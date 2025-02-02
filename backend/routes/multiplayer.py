import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from models import User, Room, GameState, GameType, convert_to_flashcards

player_router = APIRouter(prefix="/multiplayer")


@player_router.websocket("/create-room")
async def create_room(websocket: WebSocket, text: str, uuid: str, name: str):
    await websocket.accept()

    user = User(uuid=uuid, name=name)

    questions = convert_to_flashcards(text)

    user.websocket = websocket

    room = Room(host=user, questions=questions)

    websocket.app.rooms[room.room_code] = room

    await game_loop(user, room)


@player_router.websocket("/join-room/{room_code}")
async def join_room(websocket: WebSocket, room_code: str, uuid: str, name: str):
    room = websocket.app.rooms.get(room_code, None)

    if room is None:
        await websocket.accept()
        await websocket.send_json(
            {"event": "error", "data": {"type": "room_not_found"}}
        )
        return

    user = User(uuid=uuid, name=name)
    user.websocket = websocket
    await room.connect(user)

    await game_loop(user, room)


async def game_loop(user: User, room: Room):
    game_state = GameState.LOBBY
    await room.broadcast(
        message={"event": "lobby", "data": {"room_code": room.room_code}}
    )

    try:
        while game_state != GameState.QUIT:
            if room.size() == 2 and user == room.host:
                await room.host_message(
                    message={"event": "queueing", "data": {"type": "select_game"}}
                )

                game_type = await room.host.websocket.receive_json()
                room.game = game_type["data"]["game"]

            if room.game == GameType.PONG:
                game_state = await play_pong(user, room)

            await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        return await room.remove_disconnected()

    await room.host_message(message={"event": "quit", "data": {"type": "replay"}})
    response = await room.host.websocket.receive_json()

    if response["data"]["replay"]:
        await game_loop(room=room)

    else:
        await room.broadcast(message={"event": "quit"})
        await room.end_room()


async def play_pong(user: User, room: Room):
    global game_info
    game_info = {
        0: {"player": room.host, "y": 0},
        1: {"player": room.users[-1], "y": 0},
        2: {"x": 300, "y": 200, "speedx": 0.5, "speedy": 0.5},
    }

    print(room.size())

    await room.user_message(
        user=user,
        message={
            "event": "in_progress",
            "data": {
                "type": "start",
                "gamemode": "pong",
                "player": next(
                    (i for i in game_info if game_info[i]["player"] == user)
                ),
            },
        },
    )

    # return GameState.QUIT

    while True:
        game_info[2]["x"] += game_info[2]["speedx"]
        game_info[2]["y"] += game_info[2]["speedy"]

        if game_info[2]["y"] >= 400 or game_info[2]["y"] <= 0:
            game_info[2]["speedy"] *= -1

        if (game_info[2]["y"] < game_info[0]["y"] + 100) and (game_info[2]["y"] > game_info[0]["y"]) and (game_info[2]["x"] < 20):
            game_info[2]["speedx"] *= -1
        elif (game_info[2]["y"] < game_info[1]["y"] + 100) and (game_info[2]["y"] > game_info[1]["y"]) and (game_info[2]["x"] > 580):
            game_info[2]["speedx"] *= -1

        try:
            # Create a task to receive messages asynchronously
            receive_task = asyncio.create_task(user.websocket.receive_json())

            # Check if we received any input
            resp = await asyncio.wait_for(receive_task, timeout=0.016)  # ~60fps
            print(resp)

            # take user input and update paddle location
            # update ball by speed and check ball/paddle collision
            # broadcast new ball/paddle location
            if resp["event"] == "keypress":
                if resp["data"]["key"] == "down":
                    move_player = resp["data"]["player"]
                    if game_info[move_player]["y"] + 100 < 400:
                        game_info[move_player]["y"] += 50

                elif resp["data"]["key"] == "up":
                    move_player = resp["data"]["player"]
                    if game_info[move_player]["y"] > 0:
                        game_info[move_player]["y"] -= 50

        except asyncio.TimeoutError:
            # No input received, continue game loop
            pass

        message = {
            "event": "movement",
            "data": {
                "ball": {"x": game_info[2]["x"], "y": game_info[2]["y"]},
                "paddles": {
                    "left": game_info[0]["y"],
                    "right": game_info[1]["y"],
                },
            },
        }
        await room.user_message(user=user, message=message)

    return GameState.QUIT