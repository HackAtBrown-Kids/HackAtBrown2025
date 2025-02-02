import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import "../styles/Play.css";
import { motion } from "framer-motion";

import JoinServer from "./JoinServer.jsx"
import CreateServer from "./CreateServer.jsx"
import Game from "./Game.jsx"

const Play = () => {
    const [ws, setWs] = useState(null);

    return <>
        {ws ?
            <Game ws={ws} ></Game>
            :
            <div className="join-create-container">
                <JoinServer setWs={setWs} />
                <div className="separator"></div>
                <CreateServer setWs={setWs} />
            </div>
        }

    </>
}

export default Play;