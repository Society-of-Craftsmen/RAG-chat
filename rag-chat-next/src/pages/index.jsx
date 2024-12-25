'use client'
import React, { useState } from 'react';

const HomePage = () => {
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (uploadedFileName) => {
    setFileName(uploadedFileName);
    setIsFileUploaded(true);
  };

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default HomePage;
