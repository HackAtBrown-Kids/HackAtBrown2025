import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage.js';  // Import Homepage component
import CreateServer from './pages/CreateServer.js';  // Import CreateServer component
import JoinServer from './pages/JoinServer.js';  // Import JoinServer component
import Header from './components/Header.js';  // Import Header component

const App = () => {
  return (
    <div>
      <Header /> {/* Display the header on all pages */}
      <Switch>
        <Route exact path="/" component={MainPage} /> {/* MainPage on the root route */}
        <Route path="/second-page" component={SecondPage} /> {/* SecondPage on /second-page route */}
      </Switch>
    </div>
  );
};

export default App;