'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function WritePage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await apiClient.post('/posts', data);
            router.push('/');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('게시글 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-2xl font-bold text-gray-900">글쓰기</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="제목"
                    placeholder="제목을 입력하세요"
                    {...register('title', { required: '제목을 입력해주세요.' })}
                    error={errors.title?.message as string}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        내용
                    </label>
                    <textarea
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[400px] p-4"
                        placeholder="내용을 입력하세요"
                        {...register('content', { required: '내용을 입력해주세요.' })}
                    ></textarea>
                    {errors.content && (
                        <p className="text-xs text-red-500">{errors.content.message as string}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                    >
                        취소
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? '저장 중...' : '등록'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
