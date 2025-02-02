import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';  // Import Homepage
import Game from './pages/Game.jsx';
import Header from './components/Header.jsx';  // Import Header component
import Play from "./pages/Play.jsx"

const App = () => {
  return (
    <div>
      <Header /> {/* Display the header on all pages */}
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/game" element={<Game />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
};

export default App;