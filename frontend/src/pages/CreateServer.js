import Header from '../components/Header';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const JoinServer = () => {
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

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

  const createServer = (e) => {  // TODO: learn how to create a server
    return;
  }

  return (
    <div>
      <Header />
      <h2>Create a server</h2>
      <div>
        <button onClick={uploadNotes} className="upload-notes-btn">Upload your notes</button>
      </div>
      {isFileUploaded && (
        <button className="create-server-btn">
          <Link to="/Game">Create</Link>
        </button>
      )}
    </div>
  );
};

export default JoinServer;