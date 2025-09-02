
import React from 'react';
import type { Weightages } from '../types';
import { TeamIcon } from './icons/TeamIcon';
import { ProductIcon } from './icons/ProductIcon';
import { MarketIcon } from './icons/MarketIcon';
import { TractionIcon } from './icons/TractionIcon';

/**
 * Props for the WeightingSliders component.
 */
interface WeightingSlidersProps {
    /** The current weightages object. */
    weightages: Weightages;
    /** Callback function to handle changes in any slider's value. */
    onWeightChange: (key: keyof Weightages, value: number) => void;
}

/** Configuration for each slider's appearance and metadata. */
const sliderConfig = {
    team: { label: 'Team', icon: TeamIcon, color: 'text-sky-400' },
    product: { label: 'Product', icon: ProductIcon, color: 'text-emerald-400' },
    market: { label: 'Market', icon: MarketIcon, color: 'text-amber-400' },
    traction: { label: 'Traction', icon: TractionIcon, color: 'text-rose-400' },
};

/**
 * A component that displays a set of sliders for the user to define
 * their investment thesis by weighting different categories.
 * @param {WeightingSlidersProps} props - The component props.
 */
export const WeightingSliders: React.FC<WeightingSlidersProps> = ({ weightages, onWeightChange }) => {
    return (
        <div className="bg-slate-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">2. Customize Thesis</h2>
            <div className="space-y-6">
                {(Object.keys(weightages) as Array<keyof Weightages>).map(key => {
                    const config = sliderConfig[key];
                    const Icon = config.icon;
                    return (
                        <div key={key}>
                            <label htmlFor={`${key}-slider`} className={`flex items-center text-sm font-medium text-slate-300 mb-2 ${config.color}`}>
                                <Icon className="w-5 h-5 mr-2" />
                                {config.label}
                                <span className="ml-auto font-bold text-white bg-slate-700 px-2 py-0.5 rounded-full text-xs">{weightages[key]}%</span>
                            </label>
                            <input
                                id={`${key}-slider`}
                                type="range"
                                min="0"
                                max="100"
                                value={weightages[key]}
                                onChange={(e) => onWeightChange(key, parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
