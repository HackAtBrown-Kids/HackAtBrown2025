// dict question to an array of options
import React, { useState, useEffect, useRef } from 'react';
import Pong from '../components/Pong';
import '../styles/Game.css';

const Game = (props) => {
	const [startPong, setStartPong] = useState(false);
	return (
		<div>
			<Pong startGame = {startPong}/>
		</div>
		);
};

export default Game;