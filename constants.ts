
import type { Weightages } from './types';

/**
 * Default weightages for the investment thesis sliders.
 * Each category is given an equal weight of 25% by default.
 */
export const DEFAULT_WEIGHTS: Weightages = {
    team: 25,
    product: 25,
    market: 25,
    traction: 25,
};

/**
 * The specific Gemini model used for the analysis.
 */
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';
