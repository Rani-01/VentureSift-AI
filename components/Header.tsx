
import React from 'react';

/**
 * A simple presentational component for the application header.
 * Displays the main title and a brief description of the app.
 */
export const Header: React.FC = () => (
    <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            VentureSift <span className="text-indigo-400">AI</span>
        </h1>
        <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Your AI-powered analyst for generating actionable investment insights from unstructured startup data.
        </p>
    </header>
);
