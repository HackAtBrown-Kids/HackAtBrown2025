import { Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
  return (
    <div className="body-container">
      <h1>
        Welcome to Arcademia! This app allows you to upload your study notes and face your friends in minigames to bla bla and bla bla
      </h1>
      <div className="homepage-btns">
        <button>
          <Link to="/join-server">Join a server</Link>
        </button>
        <button>
          <Link to="/create-server">Create a server</Link>
        </button>
      </div>
    </div>
  );
};

export default Homepage;