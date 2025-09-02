
import React from 'react';
import type { AnalysisReport } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { WarningIcon } from './icons/WarningIcon';
import { RocketIcon } from './icons/RocketIcon';
import { TargetIcon } from './icons/TargetIcon';

/**
 * Props for the AnalysisDisplay component.
 */
interface AnalysisDisplayProps {
    /** The analysis report object, or null if no report is available. */
    report: AnalysisReport | null;
    /** A boolean indicating if the analysis is in progress. */
    isLoading: boolean;
    /** An error message string, or null if there is no error. */
    error: string | null;
}

/**
 * A circular progress-style component to visually represent the overall score.
 * @param {object} props - Component props.
 * @param {number} props.score - The score from 0-100.
 */
const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    let colorClass = 'stroke-red-500';
    if (score >= 75) colorClass = 'stroke-green-500';
    else if (score >= 50) colorClass = 'stroke-yellow-500';

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <span className="absolute text-3xl font-bold text-white">{score}</span>
        </div>
    );
};

/**
 * A reusable container for displaying a section of the analysis report.
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the section.
 * @param {React.ReactNode} props.icon - An SVG icon for the section header.
 * @param {React.ReactNode} props.children - The content of the section.
 */
const AnalysisSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
);

/**
 * Displays the generated investment memo.
 * It handles loading, error, and final report states.
 * @param {AnalysisDisplayProps} props - The component props.
 */
export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ report, isLoading, error }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 shadow-md min-h-[500px] border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">3. Investment Memo</h2>
            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full pt-16">
                    <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-slate-400">AI Analyst is synthesizing data...</p>
                </div>
            )}
            {/* Error State */}
            {error && (
                <div className="flex items-center justify-center h-full pt-16 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                    <WarningIcon className="w-6 h-6 mr-3"/>
                    {error}
                </div>
            )}
            {/* Initial/Empty State */}
            {!isLoading && !report && !error && (
                 <div className="flex items-center justify-center h-full pt-16 text-center text-slate-500">
                    Your generated analysis will appear here.
                </div>
            )}
            {/* Success State: Display the report */}
            {report && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-4 rounded-lg">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{report.startupName}</h2>
                            <p className="text-indigo-400 font-semibold mt-1">{report.recommendation}</p>
                            <p className="text-slate-300 mt-2 max-w-md">{report.summary}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                           <ScoreCircle score={report.overallScore} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnalysisSection title="Key Strengths" icon={<ThumbsUpIcon className="w-5 h-5 text-green-400"/>}>
                           <ul className="list-disc list-inside space-y-1">
                                {report.keyStrengths.map((item, i) => <li key={i}>{item}</li>)}
                           </ul>
                        </AnalysisSection>
                        <AnalysisSection title="Risk Assessment" icon={<WarningIcon className="w-5 h-5 text-red-400"/>}>
                            <ul className="list-disc list-inside space-y-1">
                                {report.riskAssessment.map((item, i) => <li key={i}>{item}</li>)}
                           </ul>
                        </AnalysisSection>
                    </div>

                    <AnalysisSection title="Benchmark Analysis" icon={<TargetIcon className="w-5 h-5 text-blue-400"/>}>
                        <p>{report.benchmarkAnalysis}</p>
                    </AnalysisSection>

                     <AnalysisSection title="Growth Potential" icon={<RocketIcon className="w-5 h-5 text-purple-400"/>}>
                        <p>{report.growthPotential}</p>
                    </AnalysisSection>
                </div>
            )}
        </div>
    );
};
