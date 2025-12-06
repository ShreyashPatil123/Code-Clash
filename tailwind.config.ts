import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2C666E',
                    light: '#3D8A94',
                    dark: '#1E4A52',
                    50: '#E8F4F5',
                    100: '#D1E9EB',
                    200: '#A3D3D7',
                    300: '#75BDC3',
                    400: '#47A7AF',
                    500: '#2C666E',
                    600: '#235258',
                    700: '#1A3D42',
                    800: '#12292C',
                    900: '#091416',
                },
                background: {
                    DEFAULT: '#0A0A0B',
                    card: '#141416',
                    elevated: '#1C1C1F',
                    hover: '#252528',
                },
                surface: '#F0EDEE',
                accent: {
                    gold: '#FFD700',
                    silver: '#C0C0C0',
                    bronze: '#CD7F32',
                },
                border: '#2A2A2D',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(44, 102, 110, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(44, 102, 110, 0.8)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
