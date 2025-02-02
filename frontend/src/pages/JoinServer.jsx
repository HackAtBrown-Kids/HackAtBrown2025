import "../styles/JoinServer.css"
import React, { useState } from "react";


const JoinServer = () => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle joining the room (e.g., send data to a backend or redirect)
    console.log("Joining room with:", { username, roomCode });
    alert(`Joining room ${roomCode} as ${username}`);
  };

  return (
    <div className="join-room-container body-container">
      <h1>Join Multiplayer Room</h1>
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
    </div>
  );
};

export default JoinServer;