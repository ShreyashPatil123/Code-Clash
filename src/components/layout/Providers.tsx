'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, theme } from 'antd';
import { Toaster } from 'react-hot-toast';

const antdTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#2C666E',
        colorBgBase: '#0A0A0B',
        colorBgContainer: '#141416',
        colorBgElevated: '#1C1C1F',
        colorBorder: '#2A2A2D',
        colorText: '#F0EDEE',
        colorTextSecondary: 'rgba(240, 237, 238, 0.6)',
        borderRadius: 8,
        fontFamily: 'Inter, system-ui, sans-serif',
    },
};

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <ConfigProvider theme={antdTheme}>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1C1C1F',
                            color: '#F0EDEE',
                            border: '1px solid #2A2A2D',
                        },
                        success: {
                            iconTheme: {
                                primary: '#2C666E',
                                secondary: '#F0EDEE',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#F0EDEE',
                            },
                        },
                    }}
                />
            </ConfigProvider>
        </SessionProvider>
    );
}
