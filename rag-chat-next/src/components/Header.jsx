'use client';
import React, { useEffect, useState } from 'react';

const Header = () => {
    return (
        <header className="bg-slate-600 w-full py-4 px-8 flex justify-between items-center">
            <div className="text-white text-2xl font-semibold">
                <h1>
                    Welcome to <span className="text-green-400">RAG-chat</span>
                </h1>
            </div>
        </header>
    )
};

export default Header;
