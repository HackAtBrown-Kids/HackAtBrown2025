from pydantic.dataclasses import dataclass
from fastapi import WebSocket
from dataclasses import field

@dataclass(config=dict(arbitrary_types_allowed=True))
class User:
    uuid: str
    name: str
    websocket: WebSocket = field(default=None)

@dataclass(config=dict(arbitrary_types_allowed=True))
class Player:
    user: User
    score: int