import asyncio
from fastapi import APIRouter, WebSocket, UploadFile
from models import User, Room, GameState, GameType
import httpx

player_router = APIRouter(prefix="/multiplayer")


@player_router.websocket("/create-room")
async def create_room(websocket: WebSocket, question_file: UploadFile, user: User):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{websocket.base_url}/api/questions", files={"file": question_file.read()}
        )
        questions = response.json()

    user.websocket = websocket

    room = Room(host=user, questions=questions)

    websocket.rooms[room.room_code] = room

    await websocket.accept()

    await game_loop(room)


@player_router.websocket("/join-room/{room_code}")
async def join_room(websocket: WebSocket, user: User, room_code: str):
    user.websocket = websocket

    room = websocket.app.rooms.get(room_code, None)

    await websocket.accept()

    if room is None:
        await websocket.send_json({"event": "error", "data": {"type": "room_not_found"}})
        return

    room.add_player(user)

    await game_loop(room)


async def game_loop(room: Room):
    game_state = GameState.LOBBY
    await room.broadcast(message={"event": "lobby"})
    while game_state != GameState.QUIT:
        if room.size() == 2:
            await room.broadcast(
                message={"event": "in_progress", "data": {"type": "select_game"}}
            )
            game_type = await room.host.websocket.receive_json()
            room.game = game_type["data"]["game"]
            game_state = GameState.IN_PROGRESS

            if room.game == GameType.PONG:
                await play_pong(room)

    await room.host_dm(message={"event": "quit", "data": {"type": "replay"}})
    response = await room.host.websocket.receive_json()

    if response["data"]["replay"]:
        await game_loop(room)

    else:
        await room.broadcast(message={"event": "quit"})
        await room.end_room()

async def play_pong(room: Room):
    await room.broadcast(message={"event": "pong", "data": {"type": "start"}})
    
    game_info = {
        0: {"player": room.host, "y": 0},
        1: {"player": room.users[-1], "y": 0},
        2: {"x": 300, "y": 200, "speedx": 5, "speedy": 5, "angle": 90},
    }

    for user in room.players:
        try:
            resp = asyncio.wait_for(user.websocket.receive_json(), timeout=0.01)
       
        except asyncio.TimeoutError:
            pass
            
        # take user input and update paddle location
        # update ball by speed and check ball/paddle collision
        # broadcast new ball/paddle location
        game_info[2].x += game_info[2].speedx
        game_info[2].y += game_info[2].speedy
        if resp.event == 'keypress':
            if resp.data["key"] == "down":
                move_player = resp.data["player"]
                player_pos = game_info[move_player]["y"]
                if player_pos - 50 >= 400:
                    player_pos -= 50
            elif resp.data["key"] == "up":
                move_player = resp.data["player"] 
                player_pos = game_info[move_player]["y"]
                if player_pos + 50 <= 400:
                    player_pos += 50
            message = {
                "event": move_player,
                "player_pos": player_pos
            }
            await room.broadcast(message=message)

    # if ball hits paddle
    if (game_info[2].y == game_info[0].y and game_info[2].x == 310): pass # TODO: x pos might differ based on position of paddles