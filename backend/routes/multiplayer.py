from fastapi import APIRouter, WebSocket
from models import User, Player

player_router = APIRouter(prefix="/multiplayer")


class ConnectionManager:
    def __init__(self, room_code: str):
        self.active_connections: list[WebSocket] = []
        self.room_code: str = room_code

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


connectionManagers: dict[str, ConnectionManager] = {}


@player_router.websocket("/create-room")
def create_room(websocket: WebSocket, user: User):
    user.websocket = websocket
