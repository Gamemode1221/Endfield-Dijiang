'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                        Community
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-sm font-medium text-gray-700">
                                {user.nickname}님
                            </span>
                            <Button onClick={() => router.push('/write')} size="sm">
                                글쓰기
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    로그인
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">회원가입</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
