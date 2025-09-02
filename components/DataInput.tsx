
import React from 'react';
import { UploadIcon } from './icons/UploadIcon';

/**
 * Props for the DataInput component.
 */
interface DataInputProps {
    /** Callback function to handle file selection. */
    onFileChange: (files: FileList | null) => void;
    /** Callback function to handle changes in the text area. */
    onTextChange: (text: string) => void;
    /** The current value of the pasted text area. */
    pastedText: string;
    /** An array of currently selected files to display their names. */
    files: File[];
}

/**
 * A component that provides UI for users to upload files and paste text.
 * It's the primary way users provide data for analysis.
 * @param {DataInputProps} props - The component props.
 */
export const DataInput: React.FC<DataInputProps> = ({ onFileChange, onTextChange, pastedText, files }) => {
    return (
        <div className="bg-slate-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">1. Ingest Data</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">Upload Founder Materials</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
                            <div className="flex text-sm text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-indigo-500">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={(e) => onFileChange(e.target.files)} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">Pitch decks, transcripts, updates, etc.</p>
                        </div>
                    </div>
                     {files.length > 0 && (
                        <div className="mt-3 text-sm text-slate-400">
                            <p className="font-semibold">Selected files:</p>
                            <ul className="list-disc list-inside">
                                {files.map(file => <li key={file.name}>{file.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="text-input" className="block text-sm font-medium text-slate-300">Or Paste Text</label>
                    <textarea
                        id="text-input"
                        rows={6}
                        className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Paste call transcripts, founder updates, or emails here..."
                        value={pastedText}
                        onChange={(e) => onTextChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
