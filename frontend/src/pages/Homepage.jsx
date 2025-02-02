import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import { motion } from "framer-motion";

const Homepage = () => {
  return (
    <div className="body-container">
      <motion.h1
        initial={{ x: -100, opacity: 0 }}  // Start off-screen to the left
        animate={{ x: 0, opacity: 1 }}  // Slide into view
        transition={{ duration: 1, ease: "easeOut" }}  // Smooth transition
      >
        Welcome to Arcademia, the ultimate gaming (and learning) platform!
      </motion.h1>
      <motion.div className="homepage-btns"
        initial={{ y: 50, opacity: 0 }}  // Start below the screen
        animate={{ y: 0, opacity: 1 }}  // Move up into place
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}  // Delay for a natural effect
      >
        <button>
          <Link to="/play">Play now!</Link>
        </button>
      </motion.div>
    </div>
  );
};

export default Homepage;