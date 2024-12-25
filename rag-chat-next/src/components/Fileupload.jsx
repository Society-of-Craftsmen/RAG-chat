'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const PDFUpload = ({ onFileUpload }) => {
    const [fileName, setFileName] = useState('');
    const [session, setSession] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Only access sessionStorage on the client side
            const storedSession = sessionStorage.getItem('user');
            setSession(storedSession);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileUpload(file.name); // Pass the file name to the parent
        }
    };

    const handleBoxClick = () => {
        if (session) {
            fileInputRef.current.click();
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="justify-center items-center">
            <div className="bg-white rounded-3xl p-6 border w-full h-[50vh] flex justify-center items-center">
                <div
                    className="bg-gray-100 rounded-3xl border-2 border-dashed border-black w-[98%] h-[98%] flex flex-col justify-center items-center cursor-pointer hover:bg-gray-300"
                    onClick={handleBoxClick}
                >
                    <FaCloudUploadAlt className="text-green-500 text-9xl" />
                    <p className="text-gray-600 mt-4 text-lg">
                        {fileName ? `Selected File: ${fileName}` : "Drag or click to upload PDF..."}
                    </p>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <p className="text-center items-center p-5 text-1xl">
                Unlock the power of your PDFs with AI-driven conversations. Simply upload your document and start asking questions to get instant, relevant answers. Whether you're reviewing reports, studying, or exploring complex topics, our AI makes it easy to extract the information you need from your PDFs in seconds.
            </p>
            <h2 className="font-extrabold text-center font-bold text-3xl p-3 text-green-500">Chat with your <span className="text-red-500 font-serif">PDFs</span> anywhere, anytime, on any device.</h2>
        </div>
    );
};

export default PDFUpload;
