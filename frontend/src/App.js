import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage.js';  // Import Homepage
import CreateServer from './pages/CreateServer.js';  // Import CreateServer
import JoinServer from './pages/JoinServer.js';  // Import JoinServer
import Game from './pages/Game.js';
import Header from './components/Header.js';  // Import Header component

const App = () => {
  return (
    <div>
      <Header /> {/* Display the header on all pages */}
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/join-server" element={<CreateServer />} />
        <Route path="/create-server" element={<JoinServer />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
};

export default App;