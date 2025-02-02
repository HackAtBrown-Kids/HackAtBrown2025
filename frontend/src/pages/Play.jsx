import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import "../styles/Play.css";
import { motion } from "framer-motion";

import JoinServer from "./JoinServer.jsx"
import CreateServer from "./CreateServer.jsx"

const Play = () => {
    const [ws, setWs] = useState(null);

    return <>
        {ws ? 
            <></>
        :
        <div className="join-create-container">
            <JoinServer Ws={ws}/>
            <div className="separator"></div>
            <CreateServer Ws={ws}/>
        </div>
        }
        
    </>
}

export default Play;