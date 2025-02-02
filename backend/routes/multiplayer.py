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

    await game_loop(room)


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


async def game_loop(room: Room):
    game_state = GameState.LOBBY
    await room.broadcast(
        message={"event": "lobby", "data": {"room_code": room.room_code}}
    )

    try:
        while game_state != GameState.QUIT:
            if room.size() == 2:
                await room.host_message(
                    message={"event": "queueing", "data": {"type": "select_game"}}
                )

                game_type = await room.host.websocket.receive_json()
                room.game = game_type["data"]["game"]

                if room.game == GameType.PONG:
                    game_state = await play_pong(room)

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


async def play_pong(room: Room):
    game_info = {
        0: {"player": room.host, "y": 0},
        1: {"player": room.users[-1], "y": 0},
        2: {"x": 300, "y": 200, "speedx": 0.1, "speedy": 0.1, "angle": 90},
    }

    print(room.size())

    for user in room.users:
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
            }
        )

    return GameState.QUIT

    while True:
        try:
            game_info[2]["x"] += game_info[2]["speedx"]
            game_info[2]["y"] += game_info[2]["speedy"]

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
                    # if game_info[move_player]["y"] - 50 >= 400:
                    game_info[move_player]["y"] += 50

                elif resp["data"]["key"] == "up":
                    move_player = resp["data"]["player"]
                    # if game_info[move_player]["y"] + 50 <= 400:
                    game_info[move_player]["y"] -= 50

                message = {
                    "event": "movement",
                    "data": {
                        "ball": {"x": game_info[2]["x"], "y": game_info[2]["y"]},
                        "paddles": {
                            "left": game_info[move_player]["y"],
                            "right": game_info[move_player]["y"],
                        },
                    },
                }

                await room.user_message(user=user, message=message)

        except asyncio.TimeoutError:
            # No input received, continue game loop
            pass

    # if ball hits paddle
    if game_info[2]["y"] == game_info[0]["y"] and game_info[2]["x"] == 310:
        pass  # TODO: x pos might differ based on position of paddles

    return GameState.QUIT
