// dict question to an array of options
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';

const Game = (props) => {
	const [ball, setBall] = useState({ x: 300, y: 200});
	const [paddles, setPaddles] = useState({ left: 10, right: 10});
	const [gameOver, setGameOver] = useState(false);
	const [startGame, setStartGame] = useState(props.startGame ? props.startGame : false);
	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8000/');

		const handleKeyPress = (e) => {
			switch (e.key) {
			case 'ArrowUp':
				// send to websocket; player input
				console.log("up!", startGame);
				break;
			case 'ArrowDown':
				// send to websocket; player input
				console.log("down!");
				break;
			default:
				break;
			}
		};

		const updateRender = () => {
			
		};

		window.addEventListener('keydown', handleKeyPress);

	return () => {
		window.removeEventListener('keydown', handleKeyPress);
	};
	}, []);
	return (
		<div className="board">
			Hello: {props.questions}
		</div>
		);
};

export default Game;