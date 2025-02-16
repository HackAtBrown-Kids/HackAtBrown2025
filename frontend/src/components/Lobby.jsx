import React, { useState } from "react";
import "../styles/LobbyPage.css";
import "../styles/index.css";


const LobbyPage = ({ ws, setStartGame, roomCode, dataStream }) => {
  // Mock data for users and games
  const [users, setUsers] = useState([
    { id: 1, username: "Player1", score: 100 },
    { id: 2, username: "Player2", score: 85 },
    { id: 3, username: "Player3", score: 70 },
  ]);

  const [questions, setQuestions] = useState([
    {
      "question": "What is one main function of an operating system?",
      "correct": "Provides a user interface",
      "choices": [
        " Provides a user interface",
        " Performs internet browsing",
        " Runs applications without user input",
        " Increases hardware speed"
      ]
    },
    {
      "question": "What does an operating system do in terms of memory management?",
      "correct": "Keeps track of storage devices and controls RAM access",
      "choices": [
        " Creates software applications",
        " Stores user files permanently",
        " Keeps track of storage devices and controls RAM access",
        " Provides internet connectivity"
      ]
    },
    {
      "question": "Which of the following is NOT a type of user interface mentioned?",
      "correct": "Voice command interface",
      "choices": [
        " Voice command interface",
        " Command line interface",
        " Graphical user interface",
        " Menu based interface"
      ]
    },
    {
      "question": "What software allows for the creation and management of databases?",
      "correct": "Database management systems",
      "choices": [
        " Database management systems",
        " Graphic processing software",
        " Spreadsheets",
        " Word processors"
      ]
    },
    {
      "question": "What is a feature of application software?",
      "correct": "Toolbars",
      "choices": [
        " Toolbars",
        " Operating system optimization",
        " Network security",
        " Power management"
      ]
    },
    {
      "question": "What type of software is used primarily for manipulating text?",
      "correct": "Word processors",
      "choices": [
        " Word processors",
        " Spreadsheets",
        " Email clients",
        " Web browsers"
      ]
    },
  ])

  
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
      <div className="questions">
        <ul>
          {questions.map((q) => (
            <li>
              <MultipleChoiceCard question={q} />
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default LobbyPage;



const MultipleChoiceCard = ({ question }) => {
  // Sample question data - this could be passed as props

  return (
    <div className="quiz-card">
      <div className="question-header">
        <h2>{question.question}</h2>
      </div>
      <div className="answers-container">
        {question.choices.map((answer, index) => (
          <div key={index} className="answer-option">
            <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
            <span className="answer-text">{answer}</span>
          </div>
        ))}
      </div>
      <style>{`
        .quiz-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 600px;
          margin: 20px auto;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .question-header {
          margin-bottom: 20px;
        }

        .question-header h2 {
          color: #333;
          font-size: 1.25rem;
          margin: 0;
          line-height: 1.4;
        }

        .answers-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .answer-option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .answer-option:hover {
          background-color: #f8fafc;
        }

        .answer-letter {
          background-color: #f1f5f9;
          color: #475569;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .answer-text {
          color: #334155;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};
