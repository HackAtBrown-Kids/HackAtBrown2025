from pydantic.dataclasses import dataclass
from enum import Enum
from string import ascii_uppercase, digits
from random import choices

from .users import User


class Room:
    def __init__(self, host: User, questions: list[dict]):
        self.room_code = generate_room_code()
        self.users = [host]
        self.host = host
        self.questions: list[Question] = [
            Question(**question) for question in questions
        ]
        self._game = GameType.NONE

    @property
    def game(self):
        return self._game

    @game.setter
    def game(self, game_type: str):
        self._game = next((game for game in GameType if game.name == game_type), GameType.NONE)

    def size(self):
        return len(self.users)

    async def connect(self, user: User):
        await user.websocket.accept()
        self.users.append(user)

    async def disconnect(self, user: User):
        self.users.remove(user)
        await user.websocket.close()

    async def host_dm(self, message: dict):
        await self.host.websocket.send_json(message)

    async def broadcast(self, message: dict):
        for user in self.users:
            await user.websocket.send_json(message)

    async def end_room(self):
        for user in self.users:
            await user.websocket.close()


@dataclass
class Question:
    question: str
    correct: str
    choices: list[str]


class GameType(Enum):
    NONE = 0
    PONG = 1
    ASTEROID_BLAST = 2
    MATCHING = 3
    PACMAN = 4

class GameState(Enum):
    LOBBY = 0
    IN_PROGRESS = 1
    QUIT = 2


def generate_room_code() -> str:
    return "".join(choices(ascii_uppercase + digits, k=6))
