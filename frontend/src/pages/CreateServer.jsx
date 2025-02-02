import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../styles/CreateServer.css";
import { motion } from "framer-motion";
import pdfToText from 'react-pdftotext'
import { v4 as uuidv4 } from 'uuid';



const JoinServer = ({ setWs }) => {

  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [username, setUsername] = useState("");
  const [studyText, setStudyText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const extractText = () => {
    pdfToText(file)
      .then(text => setStudyText(text))
      .catch(error => console.error("Text extraction failed"))
  }

  const createRoom = async () => {
    if (file) {
      extractText()
    }
    setLoading(true)
    if (username == "") {
      alert("Enter in a username")
      return;
    }
    const uuid = uuidv4();

    let user = { "uuid": uuid, "name": username }
    try {
      let ws = new WebSocket(`ws://localhost:8000/multiplayer/create-room?text=${studyText}&uuid=${uuid}&name=${username}`)
      setWs(ws)
    }
    catch (e) {
      console.log(e)
      alert("Could not establish connection")
    }
  }

  return (
    <motion.div className="join-room-container body-container"
      initial={{ y: 50, opacity: 0 }}  // Start below the screen
      animate={{ y: 0, opacity: 1 }}  // Slide up into place
      exit={{ y: -50, opacity: 0 }}  // Slide up when exiting
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1>Create Room</h1>
      <form onSubmit={(e) => e.preventDefault()} className="join-room-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='upload'>Upload Notes:</label>
          <input
            type="file"
            accept='.pdf'
            onChange={handleFileChange}  // Use handleFileChange to set the file
          />
        </div>
        <div className='form-group'>
          <label htmlFor='text'>Or Import Text:</label>
          <input
            type="text"
            value={studyText}
            onChange={(e) => { setStudyText(e.target.value); console.log(studyText) }}
          />
        </div>
        <button type="button" className="join-button" onClick={createRoom}>
          Create Room
        </button>
      </form>
      {(error) ? <p className="error-feedback">{error}</p> : <></>}
      {(loading) ? <div className="loader"></div> : <></>}
    </motion.div>
  );
};

export default JoinServer;