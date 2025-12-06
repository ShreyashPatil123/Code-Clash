import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'read:user user:email',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'github' && profile) {
                try {
                    const githubProfile = profile as any;
                    const email = user.email ||
                        githubProfile.email ||
                        `${githubProfile.login}@users.noreply.github.com`;

                    // Upsert user in database
                    const dbUser = await prisma.user.upsert({
                        where: { githubId: githubProfile.id.toString() },
                        update: {
                            name: githubProfile.name || githubProfile.login,
                            avatarUrl: githubProfile.avatar_url,
                            email: email,
                        },
                        create: {
                            email: email,
                            name: githubProfile.name || githubProfile.login,
                            avatarUrl: githubProfile.avatar_url,
                            githubUsername: githubProfile.login,
                            githubId: githubProfile.id.toString(),
                        },
                    });

                    // Store the database user ID on the user object for the JWT callback
                    (user as any).dbId = dbUser.id;
                    (user as any).githubUsername = dbUser.githubUsername;

                    return true;
                } catch (error) {
                    console.error('[Auth] Error in signIn callback:', error);
                    return true; // Still allow sign in
                }
            }
            return true;
        },
        async jwt({ token, user, account, profile }) {
            // On initial sign in, use the dbId we stored in signIn callback
            if (user && (user as any).dbId) {
                token.id = (user as any).dbId;
                token.githubUsername = (user as any).githubUsername;
            }

            // If we have account but no token.id, try to fetch from DB
            if (account?.provider === 'github' && profile && !token.id) {
                const githubProfile = profile as any;
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { githubId: githubProfile.id.toString() },
                    });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.githubUsername = dbUser.githubUsername;
                        token.avatarUrl = dbUser.avatarUrl;
                    }
                } catch (error) {
                    console.error('[Auth] Error fetching user in JWT:', error);
                }
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).githubUsername = token.githubUsername;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return `${baseUrl}/dashboard`;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
