import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Homepage.css';

const Homepage = () => {
  return (
    <div>
      <Header />
      <button>
        <Link to="/JoinServer">Join a server</Link>
        <Link to="/CreateServer">Create a server</Link>
      </button>
    </div>
  );
};

export default Homepage;