import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import { motion } from "framer-motion";

const Homepage = () => {
  return (
    <div className="body-container homepage-cont">
      <motion.div
        initial={{ y: -100, opacity: 0 }}  // Start off-screen to the left
        animate={{ y: 0, opacity: 1 }}  // Slide into view
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}  // Smooth transition
      >
        <h1>Welcome to Arcademia, the ultimate gaming (and learning) platform!</h1>
        <h1>Upload your notes, challenge your friends, and make studying fun!</h1>
      </motion.div>
      <motion.div className="homepage-btns"
        initial={{ y: 50, opacity: 0 }}  // Start below the screen
        animate={{ y: 0, opacity: 1 }}  // Move up into place
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}  // Delay for a natural effect
      >
        <button className="homepage-btn">
          <Link to="/play">Play now!</Link>
        </button>
      </motion.div>
    </div>
  );
};

export default Homepage;