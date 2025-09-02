
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DataInput } from './components/DataInput';
import { WeightingSliders } from './components/WeightingSliders';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeStartup } from './services/geminiService';
import type { Weightages, AnalysisReport } from './types';
import { DEFAULT_WEIGHTS } from './constants';
import { fileToBase64 } from './utils/fileUtils';

/**
 * The main application component for VentureSift AI.
 * It manages the application's state, orchestrates child components,
 * and handles the logic for submitting data to the Gemini API for analysis.
 */
const App: React.FC = () => {
    /** State for storing the user-uploaded files. */
    const [files, setFiles] = useState<File[]>([]);
    /** State for storing text pasted by the user. */
    const [pastedText, setPastedText] = useState<string>('');
    /** State for the investment thesis weightages, controlled by sliders. */
    const [weightages, setWeightages] = useState<Weightages>(DEFAULT_WEIGHTS);
    /** State for storing the analysis report returned by the API. */
    const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
    /** State to track the loading status of the API request. */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    /** State for storing any errors that occur during the analysis. */
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles changes to the file input, updating the files state.
     * @param selectedFiles - The FileList object from the file input event.
     */
    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            setFiles(Array.from(selectedFiles));
        }
    };

    /**
     * A memoized callback to update a specific weightage value.
     * @param key - The category of the weightage to update (e.g., 'team').
     * @param value - The new numeric value for the weightage.
     */
    const handleWeightChange = useCallback((key: keyof Weightages, value: number) => {
        setWeightages(prev => ({ ...prev, [key]: value }));
    }, []);

    /**
     * Handles the form submission to generate the investment memo.
     * It validates input, prepares file data, calls the analysis service,
     * and updates the state with the result or an error.
     */
    const handleSubmit = async () => {
        if (files.length === 0 && !pastedText.trim()) {
            setError('Please upload at least one file or paste some text to analyze.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setAnalysisReport(null);

        try {
            // Convert all files to base64 strings for the API request
            const fileContents = await Promise.all(
              files.map(async (file) => {
                const base64 = await fileToBase64(file);
                return {
                  mimeType: file.type,
                  data: base64,
                };
              })
            );

            const report = await analyzeStartup(fileContents, pastedText, weightages);
            setAnalysisReport(report);
        } catch (err) {
            console.error(err);
            setError('An error occurred during analysis. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-8">
                        <DataInput 
                            onFileChange={handleFileChange}
                            onTextChange={setPastedText}
                            pastedText={pastedText}
                            files={files}
                        />
                        <WeightingSliders 
                            weightages={weightages}
                            onWeightChange={handleWeightChange}
                        />
                         <div className="mt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : 'Generate Investment Memo'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <AnalysisDisplay 
                            report={analysisReport}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
