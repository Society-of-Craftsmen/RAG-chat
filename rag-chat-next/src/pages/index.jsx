'use client'
import React, { useState } from 'react';
import Header from '../components/Header';
import PDFUpload from '../components/Fileupload';
import Chatbot from '../components/Chatbot';

const HomePage = () => {
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (uploadedFileName) => {
    setFileName(uploadedFileName);
    setIsFileUploaded(true);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
      <Header />
      <div className="grid grid-cols-12 w-full px-4 mt-8 flex-grow">
        <div className="col-start-2 col-span-10 flex flex-col">
          {!isFileUploaded ? (
            <PDFUpload onFileUpload={handleFileUpload} />
          ) : (
            <Chatbot fileName={fileName} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
