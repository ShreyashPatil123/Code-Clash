'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import { signOut } from 'next-auth/react';

export function Navbar() {
    const { data: session } = useSession();

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link href="/profile">Profile</Link>,
        },
        {
            key: 'dashboard',
            icon: <AppstoreOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: 'signout',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
            onClick: () => signOut({ callbackUrl: '/' }),
        },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
                        {'</>'}
                    </div>
                    <span className="text-xl font-bold gradient-text hidden sm:block">CodeClash</span>
                </Link>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    {session?.user && (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-background-elevated">
                                <Avatar
                                    src={session.user.image}
                                    icon={<UserOutlined />}
                                    size={32}
                                />
                                <span className="hidden text-sm font-medium text-surface sm:block">
                                    {session.user.name}
                                </span>
                            </button>
                        </Dropdown>
                    )}
                </div>
            </nav>
        </header>
    );
}
