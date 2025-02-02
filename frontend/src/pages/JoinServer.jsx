import "../styles/JoinServer.css"
import React, { useState } from "react";
import { motion } from "framer-motion";

const JoinServer = ({ Ws }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle joining the room (e.g., send data to a backend or redirect)
    console.log("Joining room with:", { username, roomCode });
    alert(`Joining room ${roomCode} as ${username}`);
  };

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
        <button type="submit" className="join-button">
          Join Room
        </button>
      </form>
    </motion.div>
  );
};

export default JoinServer;