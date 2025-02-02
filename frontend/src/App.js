import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';  // Import Homepage
import CreateServer from './pages/CreateServer.jsx';  // Import CreateServerç
import JoinServer from './pages/JoinServer.jsx';  // Import JoinServer
import Game from './pages/Game.jsx';
import Header from './components/Header.jsx';  // Import Header component

const App = () => {
  return (
    <div>
      <Header /> {/* Display the header on all pages */}
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/join-server" element={<JoinServer />} />
        <Route path="/create-server" element={<CreateServer />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
};

export default App;