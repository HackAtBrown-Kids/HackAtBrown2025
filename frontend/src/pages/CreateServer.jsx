import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import "../styles/CreateServer.css";

const JoinServer = () => {
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [username, setUsername] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const uploadNotes = async () => {
    if (!file) {
      alert('Please select a file to upload!');
      return;
    }

    const formData = new FormData();  // TODO: see how this works
    formData.append('file', file);  // Append the selected file to the form data

    try {
      const response = await fetch('http://localhost:8000/upload/', {  // FastAPI endpoint
        method: 'POST',
        body: formData,  // Send the form data with the file
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
        setIsFileUploaded(true);
        alert('File uploaded successfully!');
      } else {
        console.error('File upload failed:', response);
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error during file upload.');
    }
  };

  const createServer = (e) => {  // TODO
    return;
  }

  return (
    <div className="join-room-container body-container">
      <h1>Create Multiplayer Room</h1>
      <form onSubmit={() => {}} className="join-room-form">
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
            value={file}
            onChange={(e) => {setFile(e.target.value); console.log(file)}}
          />
        </div>
        <div className='form-group'>
        <label htmlFor='text'>Or Import Text:</label>
          <input
            type="text"
            value={file}
            onChange={(e) => {setFile(e.target.value); console.log(file)}}
          />
        </div>
        <button type="submit" className="join-button">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default JoinServer;