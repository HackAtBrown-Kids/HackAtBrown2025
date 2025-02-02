from fastapi import APIRouter, WebSocket
from models import User, Player, Room

player_router = APIRouter(prefix="/multiplayer")

@player_router.websocket("/create-room")
async def create_room(websocket: WebSocket, user: User):
    

    user.websocket = websocket
    
    room = Room(host=user)

    websocket.rooms[room.room_code] = room

    await websocket.accept()
    


@player_router.websocket("/join-room/{room_code}")
async def join_room(websocket: WebSocket, user: User, room_code: str):
    user.websocket = websocket

    room = websocket.app.rooms[room_code]
    room.add_player(user)

    await websocket.accept()


async def game_loop(room: Room):
    while True:
        await room.broadcast(message="")