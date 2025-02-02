// dict question to an array of options
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';

const Pong = (props) => {
    const [ball, setBall] = useState({ x: 300, y: 200 });
    const [paddles, setPaddles] = useState({ left: 10, right: 10 });
    const [gameOver, setGameOver] = useState(false);
    const [startGame, setStartGame] = useState(props.startGame);
    const ballRef = useRef(null);
    const [message, setMessage] = useState('');
    const [playerNum, setPlayerNum] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            if (event.data.event == 'start') {
                setPlayerNum(event.data.player);
            }
            else if (event.data.event == 'movement') {
                setBall({ x: event.data.ball.x, y: event.data.ball.y });
                setPaddles({ left: event.data.paddles.left, right: event.data.paddles.right });
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };

        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    // send to websocket; player input
                    // websocket will return back new position of both paddles and ball
                    ws.send(JSON.stringify({ event: 'keypress', data: {'key': 'up', 'player': playerNum }}));
                    console.log("up!");
                    break;
                case 'ArrowDown':
                    // send to websocket; player input
                    ws.send(JSON.stringify({ event: 'keypress', data: {'key': 'down', 'player': playerNum }}));
                    console.log("down!");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            ws.close();
        };
    }, [startGame]);

    return (
        <div className="board">
            <div
                className={`paddle paddle-left`}
                id="paddle-left"
                style={{ top: `${paddles.left}px` }}
            />
            <div
                className={`paddle paddle-right`}
                id="paddle-right"
                style={{ top: `${paddles.right}px`, left: '580px' }}
            />
            <div
                className={`ball`}
                ref={ballRef}
                style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
            />
        </div>
    );
};

export default Pong;