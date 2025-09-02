
import React from 'react';

/**
 * A presentational SVG icon component for 'Product'.
 */
export const ProductIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75v-2.25m0-2.25l2.25-1.313M12 21.75l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M12 2.25v2.25" />
    </svg>
);
