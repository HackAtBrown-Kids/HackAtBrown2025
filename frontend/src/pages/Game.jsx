// dict question to an array of options
import React, { useState, useEffect } from 'react';
import Pong from '../components/Pong';
import LobbyPage from '../components/Lobby';
import '../styles/Game.css';

const Game = (props) => {
	const [startGame, setStartGame] = useState(false);
	const [dataStream, setDataStream] = useState(null)
	const [roomCode, setRoomCode] = useState("")
	if (props.ws) {
		props.ws.onmessage = (e) => setDataStream(JSON.parse(e.data))
	}
	useEffect(() => {
		console.log(dataStream)
		if (dataStream && dataStream.event == "in_progress" && dataStream.data && dataStream.data.gamemode == "pong") {
			setStartGame(true)
		}
		if (dataStream && dataStream.data && dataStream.data.room_code) {
			setRoomCode(dataStream.data.room_code)
		}
	}, [dataStream])
	return (
		<>
			{(startGame) ?
				<Pong startGame={startGame} ws={props.ws} dataStream={dataStream} setDataStream={setDataStream} />
				:
				<LobbyPage ws={props.ws} setStartGame={setStartGame} roomCode={roomCode} />
			}
		</>
	);
};

export default Game;