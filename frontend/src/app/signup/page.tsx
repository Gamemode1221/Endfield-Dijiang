'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function SignUpPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const onSubmit = async (data: any) => {
        setLoading(true);
        setGlobalError('');
        try {
            await apiClient.post('/auth/signup', data); // Expect success response
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            router.push('/login');
        } catch (error: any) {
            setGlobalError(error.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        회원가입
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
                            label="닉네임"
                            type="text"
                            placeholder="닉네임"
                            {...register('nickname', { required: '닉네임을 입력해주세요.' })}
                            error={errors.nickname?.message as string}
                        />
                        <Input
                            label="비밀번호"
                            type="password"
                            placeholder="********"
                            {...register('password', { required: '비밀번호를 입력해주세요.', minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다.' } })}
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
                            {loading ? '가입하기' : '회원가입'}
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            로그인
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
