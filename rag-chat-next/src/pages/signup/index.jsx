'use client';
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseAdmin';
import { useRouter } from 'next/navigation';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(email, password);
            if (res) {
                console.log('User created:', res.user);
                router.push('/login');
            }
        } catch (error) {
            console.error('Error creating user:', error.message);
        }

        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Create an Account for <span className="text-green-500">RAG-chat</span></h2>
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
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="confirmPassword" className="mb-2 text-sm text-gray-600">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className="py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition">
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
                Already have an account? <a href="/login" className="text-green-500 hover:underline">Login here</a>
            </p>
        </div>
    );
}

export default SignUp;
