import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <header>
        <h1>
          <Link to="/">ARCADEMIA</Link>
        </h1>
      </header>
    );
  };
  
export default Header;