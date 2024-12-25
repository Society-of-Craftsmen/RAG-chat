'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebaseAdmin';
import { FaUser } from 'react-icons/fa';

const Header = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [userSession, setUserSession] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        const email = sessionStorage.getItem('userEmail');
        setUserSession(session);
        setUserEmail(email);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('userEmail');
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-slate-600 w-full py-4 px-8 flex justify-between items-center">
            <div className="text-white text-2xl font-semibold">
                <h1>
                    Welcome to <span className="text-green-400">RAG-chat</span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {userSession ? (
                    <div className="flex items-center gap-4">
                        <FaUser className="text-green-500 text-xl" title={userEmail || 'User'} />
                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-green-500 transition font-medium"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <a
                            href="/login"
                            className="text-white hover:text-green-500 transition font-medium"
                        >
                            Login
                        </a>
                        <span className="text-gray-400">|</span>
                        <a
                            href="/signup"
                            className="text-white hover:text-green-500 transition font-medium"
                        >
                            Sign Up
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
