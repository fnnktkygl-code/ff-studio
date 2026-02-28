import React from 'react';
import AsosLogo from '../../assets/brands/asos.png';
import GucciLogo from '../../assets/brands/gucci.png';
import HMLogo from '../../assets/brands/hm.png';
import NikeLogo from '../../assets/brands/nike.png';
import RalphLaurenLogo from '../../assets/brands/ralph_lauren.png';
import ZaraLogo from '../../assets/brands/zara.png';

const brandImageClass = "w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen opacity-90";

// Generic: Sparkles
export const IconGeneric = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 21l-.394-1.18a2.25 2.25 0 00-1.426-1.426L16.5 18l1.18-.394a2.25 2.25 0 001.426-1.426L19.5 15l.394 1.18a2.25 2.25 0 001.426 1.426L22.5 18l-1.18.394a2.25 2.25 0 00-1.426 1.426L19.5 21z" />
    </svg>
);

// Zara
export const IconZara = (props) => (
    <img src={ZaraLogo} alt="Zara" className={brandImageClass} {...props} />
);

// Ralph Lauren
export const IconRalphLauren = (props) => (
    <img src={RalphLaurenLogo} alt="Ralph Lauren" className={brandImageClass} {...props} />
);

// H&M
export const IconHM = (props) => (
    <img src={HMLogo} alt="H&M" className={brandImageClass} {...props} />
);

// Nike
export const IconNike = (props) => (
    <img src={NikeLogo} alt="Nike" className={brandImageClass} {...props} />
);

// ASOS
export const IconAsos = (props) => (
    <img src={AsosLogo} alt="ASOS" className={brandImageClass} {...props} />
);

// Gucci
export const IconGucci = (props) => (
    <img src={GucciLogo} alt="Gucci" className={brandImageClass} {...props} />
);
