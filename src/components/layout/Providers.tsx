'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, theme } from 'antd';
import { Toaster } from 'react-hot-toast';
import { LenisProvider } from './LenisProvider';

/* ===========================================
   PROFESSIONAL ANT DESIGN THEME
   Modern dark theme with brand colors
   =========================================== */

const antdTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        // Brand Colors
        colorPrimary: '#2C666E',
        colorPrimaryHover: '#3D8A94',
        colorPrimaryActive: '#1E4A52',
        colorPrimaryBg: 'rgba(44, 102, 110, 0.1)',
        colorPrimaryBgHover: 'rgba(44, 102, 110, 0.2)',
        colorPrimaryBorder: '#2C666E',
        colorPrimaryBorderHover: '#3D8A94',

        // Background Colors
        colorBgBase: '#0A0A0B',
        colorBgContainer: '#141416',
        colorBgElevated: '#1C1C1F',
        colorBgLayout: '#0A0A0B',
        colorBgSpotlight: '#242428',
        colorBgMask: 'rgba(0, 0, 0, 0.6)',

        // Border Colors
        colorBorder: '#2A2A2D',
        colorBorderSecondary: 'rgba(42, 42, 45, 0.5)',

        // Text Colors
        colorText: '#F0EDEE',
        colorTextSecondary: 'rgba(240, 237, 238, 0.7)',
        colorTextTertiary: 'rgba(240, 237, 238, 0.5)',
        colorTextQuaternary: 'rgba(240, 237, 238, 0.35)',
        colorTextPlaceholder: 'rgba(240, 237, 238, 0.35)',

        // Semantic Colors
        colorSuccess: '#10B981',
        colorSuccessBg: 'rgba(16, 185, 129, 0.1)',
        colorWarning: '#F59E0B',
        colorWarningBg: 'rgba(245, 158, 11, 0.1)',
        colorError: '#EF4444',
        colorErrorBg: 'rgba(239, 68, 68, 0.1)',
        colorInfo: '#3B82F6',
        colorInfoBg: 'rgba(59, 130, 246, 0.1)',

        // Typography
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontFamilyCode: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontSize: 14,
        fontSizeSM: 12,
        fontSizeLG: 16,
        fontSizeXL: 20,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontSizeHeading4: 20,
        fontSizeHeading5: 16,

        // Spacing & Sizing
        borderRadius: 8,
        borderRadiusLG: 12,
        borderRadiusSM: 6,
        borderRadiusXS: 4,

        // Shadows
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',

        // Motion
        motionDurationFast: '0.1s',
        motionDurationMid: '0.2s',
        motionDurationSlow: '0.3s',
        motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',

        // Line heights
        lineHeight: 1.6,
        lineHeightLG: 1.5,
        lineHeightSM: 1.4,
        lineHeightHeading1: 1.2,
        lineHeightHeading2: 1.3,
        lineHeightHeading3: 1.35,
        lineHeightHeading4: 1.4,
        lineHeightHeading5: 1.45,

        // Control
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        controlHeightXS: 24,

        // Padding
        paddingXS: 8,
        paddingSM: 12,
        padding: 16,
        paddingMD: 20,
        paddingLG: 24,
        paddingXL: 32,
    },
    components: {
        // Button overrides
        Button: {
            primaryShadow: '0 0 0 2px rgba(44, 102, 110, 0.2)',
            defaultBorderColor: '#2A2A2D',
            defaultBg: '#141416',
            defaultColor: '#F0EDEE',
            algorithm: true,
        },
        // Card overrides
        Card: {
            colorBgContainer: '#141416',
            colorBorderSecondary: '#2A2A2D',
            boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        },
        // Input overrides
        Input: {
            colorBgContainer: '#141416',
            colorBorder: '#2A2A2D',
            hoverBorderColor: '#2C666E',
            activeBorderColor: '#3D8A94',
            activeShadow: '0 0 0 2px rgba(44, 102, 110, 0.2)',
        },
        // Select overrides
        Select: {
            colorBgContainer: '#141416',
            colorBgElevated: '#1C1C1F',
            colorBorder: '#2A2A2D',
            optionSelectedBg: 'rgba(44, 102, 110, 0.2)',
        },
        // Table overrides
        Table: {
            colorBgContainer: 'transparent',
            headerBg: '#1C1C1F',
            rowHoverBg: '#1C1C1F',
            borderColor: '#2A2A2D',
        },
        // Modal overrides
        Modal: {
            contentBg: '#141416',
            headerBg: '#141416',
            titleColor: '#F0EDEE',
        },
        // Menu overrides
        Menu: {
            darkItemBg: 'transparent',
            darkItemHoverBg: 'rgba(44, 102, 110, 0.1)',
            darkItemSelectedBg: 'rgba(44, 102, 110, 0.2)',
            darkItemColor: 'rgba(240, 237, 238, 0.7)',
            darkItemHoverColor: '#F0EDEE',
            darkItemSelectedColor: '#3D8A94',
        },
        // Tabs overrides
        Tabs: {
            inkBarColor: '#2C666E',
            itemColor: 'rgba(240, 237, 238, 0.6)',
            itemHoverColor: '#F0EDEE',
            itemSelectedColor: '#3D8A94',
        },
        // Tooltip overrides
        Tooltip: {
            colorBgSpotlight: '#1C1C1F',
            colorTextLightSolid: '#F0EDEE',
        },
        // Dropdown overrides
        Dropdown: {
            colorBgElevated: '#1C1C1F',
            boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        },
        // Statistic overrides
        Statistic: {
            titleFontSize: 14,
            contentFontSize: 28,
        },
        // Badge overrides
        Badge: {
            colorBgContainer: '#2C666E',
        },
        // Tag overrides
        Tag: {
            defaultBg: 'rgba(44, 102, 110, 0.1)',
            defaultColor: '#3D8A94',
        },
    },
};

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <ConfigProvider theme={antdTheme}>
                <LenisProvider>
                    {children}
                </LenisProvider>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1C1C1F',
                            color: '#F0EDEE',
                            border: '1px solid #2A2A2D',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#F0EDEE',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#F0EDEE',
                            },
                        },
                    }}
                />
            </ConfigProvider>
        </SessionProvider>
    );
}
