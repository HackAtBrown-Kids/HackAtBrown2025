// dict question to an array of options
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';
import '../styles/Pong.css';

const Pong = (props) => {
    const [ball, setBall] = useState({ x: 300, y: 200 });
    const [paddles, setPaddles] = useState({ left: 10, right: 10 });
    const [gameOver, setGameOver] = useState(false);
    const [startGame, setStartGame] = useState(props.startGame);
    const ballRef = useRef(null);
    const [message, setMessage] = useState('');
    const playerNum = useRef(null)

    useEffect(() => {
        console.log(props.dataStream)
        if (props.dataStream && props.dataStream.event == 'in_progress') {
            playerNum.current = props.dataStream.data.player;
            console.log(playerNum.current)
        }
        else if (props.dataStream && props.dataStream.event == 'movement') {
            console.log(props.dataStream)
            setBall({ x: props.dataStream.data.ball.x, y: props.dataStream.data.ball.y });
            setPaddles({ left: props.dataStream.data.paddles.left, right: props.dataStream.data.paddles.right });
        }

        props.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            props.ws.close();
        };


        // return () => {
        //     props.ws.close();
        // };
    }, [props.dataStream]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    // send to websocket; player input
                    // websocket will return back new position of both paddles and ball
                    props.ws.send(JSON.stringify({ event: 'keypress', data: { 'key': 'up', 'player': playerNum.current } }));
                    console.log("up!");
                    break;
                case 'ArrowDown':
                    // send to websocket; player input
                    props.ws.send(JSON.stringify({ event: 'keypress', data: { 'key': 'down', 'player': playerNum.current } }));
                    console.log("down!");
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [startGame])

    return (
        <>
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
        </>
        
    );
};

export default Pong;