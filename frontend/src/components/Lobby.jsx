import React, { useState } from "react";
import "../styles/LobbyPage.css";


const LobbyPage = ({ ws, setStartGame, roomCode }) => {
  // Mock data for users and games
  const [users, setUsers] = useState([
    { id: 1, username: "Player1", score: 100 },
    { id: 2, username: "Player2", score: 85 },
    { id: 3, username: "Player3", score: 70 },
  ]);

  
  const startPong = () => {
    let content = {
      "event": "queueing",
      "data": {"game": "pong"}
    }
    ws.send(JSON.stringify(content))
  }

  return (
    <div className="lobby-container">
      <h1>Room Code: {roomCode}</h1>
      <div className="lobby-content">
        {/* Left Side: List of Games */}
        <div className="games-list">
          <h2>Select a Game</h2>
          <ul>
            <li>
              <button onClick={startPong}>Pong</button>
            </li>
          </ul>
        </div>

        {/* Right Side: Leaderboard */}
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;