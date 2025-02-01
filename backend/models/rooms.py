from pydantic.dataclasses import dataclass
from .users import Player

@dataclass(config=dict(arbitrary_types_allowed=True))
class Room:
    room_code: str
    players: list[Player]