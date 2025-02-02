from typing import Annotated
from pydantic.dataclasses import dataclass
from pydantic import BeforeValidator
from enum import Enum
from string import ascii_uppercase, digits
from random import choices

from .users import User

class Room:
    def __init__(self, host: User):
        self.room_code = generate_room_code()
        self.users = [host]
        self.host = host
        self.flashcards = []
        self.cur_game = GameType.NONE

    async def connect(self, user: User):
        await user.websocket.accept()
        self.users.append(user)

    async def disconnect(self, user: User):
        self.users.remove(user)
        await user.websocket.close()

    async def broadcast(self, message: dict):
        for user in self.users:
            await user.websocket.send_json(message)

class GameType(Enum):
    NONE = 0
    ASTEROID_BLAST = 1
    MATCHING = 2
    PACMAN = 3

def generate_room_code() -> str:
    return ''.join(choices(ascii_uppercase + digits, k=6))