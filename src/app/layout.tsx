import type { Metadata } from 'next';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'CodeClash - Where Friends Become Rivals',
    description:
        'A competitive coding challenge platform for developers. Create groups, submit projects, vote on peer work, and climb the leaderboards.',
    keywords: ['coding', 'challenges', 'competition', 'developers', 'peer voting', 'leaderboard'],
    authors: [{ name: 'CodeClash Team' }],
    openGraph: {
        title: 'CodeClash - Where Friends Become Rivals',
        description: 'Compete with friends in coding challenges',
        type: 'website',
        locale: 'en_US',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background text-surface antialiased">
                {/* Skip to main content - accessibility feature */}
                <a
                    href="#main-content"
                    className="skip-to-content"
                >
                    Skip to main content
                </a>

                <Providers>
                    <main id="main-content" tabIndex={-1}>
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
