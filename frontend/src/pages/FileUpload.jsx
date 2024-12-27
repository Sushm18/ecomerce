import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [message, setMessage] = useState(''); // State to store upload message

  // Handle file selection
  const onFileChange = (e) => {
    setFile(e.target.files[0]); // Set selected file
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data

    try {
      // Send POST request to backend
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message); // Success message from backend
    } catch (error) {
      console.error(error);
      setMessage('File upload failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>File Upload</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
