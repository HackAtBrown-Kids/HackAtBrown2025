from pydantic.dataclasses import dataclass
from fastapi import WebSocket
from dataclasses import field

@dataclass(config=dict(arbitrary_types_allowed=True))
class User:
    uuid: str
    name: str
    score: int = 0
    websocket: WebSocket = field(default=None)