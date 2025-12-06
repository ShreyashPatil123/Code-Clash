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
            /* ===========================================
               COLORS - Mapped to CSS Variables
               =========================================== */
            colors: {
                // Primary Brand Colors
                primary: {
                    50: 'var(--color-primary-50)',
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)',
                    700: 'var(--color-primary-700)',
                    800: 'var(--color-primary-800)',
                    900: 'var(--color-primary-900)',
                    DEFAULT: 'var(--color-primary-600)',
                    light: 'var(--color-primary-500)',
                    dark: 'var(--color-primary-700)',
                },
                // Secondary Colors (Purple accent)
                secondary: {
                    50: 'var(--color-secondary-50)',
                    100: 'var(--color-secondary-100)',
                    200: 'var(--color-secondary-200)',
                    300: 'var(--color-secondary-300)',
                    400: 'var(--color-secondary-400)',
                    500: 'var(--color-secondary-500)',
                    600: 'var(--color-secondary-600)',
                    700: 'var(--color-secondary-700)',
                    800: 'var(--color-secondary-800)',
                    900: 'var(--color-secondary-900)',
                    DEFAULT: 'var(--color-secondary-600)',
                },
                // Semantic - Success
                success: {
                    50: 'var(--color-success-50)',
                    100: 'var(--color-success-100)',
                    200: 'var(--color-success-200)',
                    300: 'var(--color-success-300)',
                    400: 'var(--color-success-400)',
                    500: 'var(--color-success-500)',
                    600: 'var(--color-success-600)',
                    700: 'var(--color-success-700)',
                    DEFAULT: 'var(--color-success-500)',
                },
                // Semantic - Warning
                warning: {
                    50: 'var(--color-warning-50)',
                    100: 'var(--color-warning-100)',
                    200: 'var(--color-warning-200)',
                    300: 'var(--color-warning-300)',
                    400: 'var(--color-warning-400)',
                    500: 'var(--color-warning-500)',
                    600: 'var(--color-warning-600)',
                    700: 'var(--color-warning-700)',
                    DEFAULT: 'var(--color-warning-500)',
                },
                // Semantic - Error
                error: {
                    50: 'var(--color-error-50)',
                    100: 'var(--color-error-100)',
                    200: 'var(--color-error-200)',
                    300: 'var(--color-error-300)',
                    400: 'var(--color-error-400)',
                    500: 'var(--color-error-500)',
                    600: 'var(--color-error-600)',
                    700: 'var(--color-error-700)',
                    DEFAULT: 'var(--color-error-500)',
                },
                // Semantic - Info
                info: {
                    50: 'var(--color-info-50)',
                    100: 'var(--color-info-100)',
                    200: 'var(--color-info-200)',
                    300: 'var(--color-info-300)',
                    400: 'var(--color-info-400)',
                    500: 'var(--color-info-500)',
                    600: 'var(--color-info-600)',
                    700: 'var(--color-info-700)',
                    DEFAULT: 'var(--color-info-500)',
                },
                // Background Colors
                background: {
                    DEFAULT: 'var(--bg-base)',
                    card: 'var(--bg-card)',
                    elevated: 'var(--bg-elevated)',
                    hover: 'var(--bg-hover)',
                    overlay: 'var(--bg-overlay)',
                },
                // Text/Surface Colors
                surface: 'var(--text-primary)',
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                    muted: 'var(--text-muted)',
                    inverted: 'var(--text-inverted)',
                },
                // Border Colors
                border: {
                    DEFAULT: 'var(--border-default)',
                    light: 'var(--border-light)',
                    focus: 'var(--border-focus)',
                    error: 'var(--border-error)',
                },
                // Rank Colors
                accent: {
                    gold: 'var(--color-gold)',
                    silver: 'var(--color-silver)',
                    bronze: 'var(--color-bronze)',
                },
            },

            /* ===========================================
               TYPOGRAPHY
               =========================================== */
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            fontSize: {
                xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
                sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
                base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
                md: ['var(--text-md)', { lineHeight: 'var(--leading-normal)' }],
                lg: ['var(--text-lg)', { lineHeight: 'var(--leading-snug)' }],
                xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
                '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
                '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
                '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
                '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
                '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],
                '7xl': ['var(--text-7xl)', { lineHeight: 'var(--leading-none)' }],
                '8xl': ['var(--text-8xl)', { lineHeight: 'var(--leading-none)' }],
            },
            fontWeight: {
                light: 'var(--font-light)',
                normal: 'var(--font-regular)',
                medium: 'var(--font-medium)',
                semibold: 'var(--font-semibold)',
                bold: 'var(--font-bold)',
                extrabold: 'var(--font-extrabold)',
            },
            lineHeight: {
                none: 'var(--leading-none)',
                tight: 'var(--leading-tight)',
                snug: 'var(--leading-snug)',
                normal: 'var(--leading-normal)',
                relaxed: 'var(--leading-relaxed)',
                loose: 'var(--leading-loose)',
            },
            letterSpacing: {
                tighter: 'var(--tracking-tighter)',
                tight: 'var(--tracking-tight)',
                normal: 'var(--tracking-normal)',
                wide: 'var(--tracking-wide)',
                wider: 'var(--tracking-wider)',
                widest: 'var(--tracking-widest)',
            },

            /* ===========================================
               SPACING - 4px base scale
               =========================================== */
            spacing: {
                '0': 'var(--space-0)',
                '1': 'var(--space-1)',
                '2': 'var(--space-2)',
                '3': 'var(--space-3)',
                '4': 'var(--space-4)',
                '5': 'var(--space-5)',
                '6': 'var(--space-6)',
                '8': 'var(--space-8)',
                '10': 'var(--space-10)',
                '12': 'var(--space-12)',
                '16': 'var(--space-16)',
                '20': 'var(--space-20)',
                '24': 'var(--space-24)',
                '32': 'var(--space-32)',
            },

            /* ===========================================
               SHADOWS
               =========================================== */
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-base)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
                inner: 'var(--shadow-inner)',
                'glow-primary': 'var(--shadow-glow-primary)',
                'glow-primary-intense': 'var(--shadow-glow-primary-intense)',
                'glow-gold': 'var(--shadow-glow-gold)',
                'glow-error': 'var(--shadow-glow-error)',
                'glow-success': 'var(--shadow-glow-success)',
            },

            /* ===========================================
               BORDER RADIUS
               =========================================== */
            borderRadius: {
                none: 'var(--radius-none)',
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                full: 'var(--radius-full)',
            },

            /* ===========================================
               TRANSITIONS
               =========================================== */
            transitionDuration: {
                fast: 'var(--duration-fast)',
                DEFAULT: 'var(--duration-base)',
                slow: 'var(--duration-slow)',
                slower: 'var(--duration-slower)',
            },
            transitionTimingFunction: {
                DEFAULT: 'var(--ease-in-out)',
                linear: 'var(--ease-linear)',
                in: 'var(--ease-in)',
                out: 'var(--ease-out)',
                'in-out': 'var(--ease-in-out)',
                bounce: 'var(--ease-bounce)',
            },

            /* ===========================================
               Z-INDEX
               =========================================== */
            zIndex: {
                base: 'var(--z-base)',
                dropdown: 'var(--z-dropdown)',
                sticky: 'var(--z-sticky)',
                fixed: 'var(--z-fixed)',
                'modal-backdrop': 'var(--z-modal-backdrop)',
                modal: 'var(--z-modal)',
                popover: 'var(--z-popover)',
                tooltip: 'var(--z-tooltip)',
                toast: 'var(--z-toast)',
            },

            /* ===========================================
               ANIMATIONS
               =========================================== */
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'fade-in': 'fade-in var(--duration-slow) var(--ease-out)',
                'slide-up': 'slide-up var(--duration-slow) var(--ease-out)',
                'slide-in-right': 'slide-in-right var(--duration-slow) var(--ease-out)',
                'scale-in': 'scale-in var(--duration-slow) var(--ease-out)',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(44, 102, 110, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(44, 102, 110, 0.8)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slide-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    from: { opacity: '0', transform: 'translateX(20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
