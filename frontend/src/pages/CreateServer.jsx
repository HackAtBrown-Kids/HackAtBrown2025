import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../styles/CreateServer.css";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const JoinServer = ({ Ws }) => {

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

  const extractTextFromPdf = async (file) => {
    try {      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Iterate through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      setStudyText(fullText);
    } catch (err) {
      setError('Error processing PDF: ' + err.message);
    } finally {
      console.log(studyText)
      setLoading(false);
    }
  };

  const createRoom = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/ai/text-to-flashcard?text=${studyText}`, {  // FastAPI endpoint
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setIsFileUploaded(true);
          alert('Text uploaded successfully!');
          console.log(result)
          setLoading(false)
          return;
        } else {
          console.error('Text upload failed:', response);
          alert('Failed to upload text.');
          setLoading(false)
          return;
        }
      } catch (error) {
        console.error('Error during text upload:', error);
        alert('Error during text upload.');
        setLoading(false)
        return;
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
            onChange={(e) => {setStudyText(e.target.value); console.log(studyText)}}
          />
        </div>
        <button type="button" className="join-button" onClick={createRoom}>
          Create Room
        </button>
      </form>
      {(error) ? <p className="error-feedback">{error}</p> : <></>}
      {(loading) ? <div className="loader"></div> : <></>}
      <button onClick={() => {extractTextFromPdf(file)}}></button>
    </motion.div>
  );
};

export default JoinServer;