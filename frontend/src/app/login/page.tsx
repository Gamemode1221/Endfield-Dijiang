'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const onSubmit = async (data: any) => {
        setLoading(true);
        setGlobalError('');
        try {
            const response = await apiClient.post('/auth/login', data);
            const { accessToken, memberId, nickname } = response.data.data;
            login(accessToken, { id: memberId, nickname });
            router.push('/');
        } catch (error: any) {
            setGlobalError(error.response?.data?.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        로그인
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            label="이메일"
                            type="email"
                            placeholder="example@email.com"
                            {...register('email', { required: '이메일을 입력해주세요.' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="비밀번호"
                            type="password"
                            placeholder="********"
                            {...register('password', { required: '비밀번호를 입력해주세요.' })}
                            error={errors.password?.message as string}
                        />
                    </div>

                    {globalError && (
                        <div className="text-sm font-medium text-red-500 text-center">
                            {globalError}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        계정이 없으신가요?{' '}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            회원가입
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
