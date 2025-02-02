import "../styles/JoinServer.css"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';


const JoinServer = ({ setWs }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle joining the room (e.g., send data to a backend or redirect)
    console.log("Joining room with:", { username, roomCode });
    alert(`Joining room ${roomCode} as ${username}`);
  };

  const joinRoom = () => {
    if (username == "") {
      alert("Enter in a username")
      return;
    }

    const uuid = uuidv4();

    try {
      let ws = new WebSocket(`ws://localhost:8000/multiplayer/join-room/${roomCode}?uuid=${uuid}&name=${username}`)
      ws.onopen = setWs(ws)
    }
    catch (e) {
      console.log(e)
      alert("Could not establish connection")
    }
  }

  return (
    <motion.div className="join-room-container body-container"
      initial={{ y: 50, opacity: 0 }}  // Start below the screen
      animate={{ y: 0, opacity: 1 }}  // Slide up into place
      exit={{ y: -50, opacity: 0 }}  // Slide up when exiting
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1>Join Room</h1>
      <form onSubmit={handleSubmit} className="join-room-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomCode">Room Code:</label>
          <input
            type="text"
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            required
          />
        </div>
        <button type="button" className="join-button" onClick={joinRoom}>
          Join Room
        </button>
      </form>
    </motion.div>
  );
};

export default JoinServer;