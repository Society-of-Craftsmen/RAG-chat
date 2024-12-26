'use client';
import React, { useState } from 'react';
import { auth } from '@/utils/firebaseAdmin';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(email, password);
            if (res) {
                console.log('User allowed:', res.user);
                const idToken = await res.user.getIdToken();
                sessionStorage.setItem('token', idToken);
                sessionStorage.setItem('user', true);
                sessionStorage.setItem('userEmail', email);
                router.push('/');
            }
            else {
                alert('Incorrect credentials!');
                setEmail('');
                setPassword('');
            }
        }
        catch (e) {
            console.error(e)
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Login to <span className="text-green-500">RAG-chat</span></h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <label htmlFor="email" className="mb-2 text-sm text-gray-600">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password" className="mb-2 text-sm text-gray-600">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition">
                    Login
                </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
                Don't have an account? <a href="/signup" className="text-green-500 hover:underline">Sign up here</a>
            </p>
        </div>
    );
}

export default Login;
