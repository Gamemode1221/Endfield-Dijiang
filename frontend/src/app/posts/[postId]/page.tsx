'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

interface PostDetail {
    id: number;
    title: string;
    content: string;
    authorName: string;
    viewCount: number;
    createdAt: string;
}

interface Comment {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
}

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const resolvedParams = use(params);
    const postId = resolvedParams.postId;

    const router = useRouter();
    const { user } = useAuthStore();
    const [post, setPost] = useState<PostDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    apiClient.get(`/posts/${postId}`),
                    apiClient.get(`/posts/${postId}/comments`)
                ]);
                setPost(postRes.data.data);
                setComments(commentsRes.data.data.content);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId]);

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await apiClient.delete(`/posts/${postId}`);
            router.push('/');
        } catch (error) {
            alert('삭제에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await apiClient.post(`/posts/${postId}/comments`, { content: newComment });
            setNewComment('');
            // Refresh comments
            const res = await apiClient.get(`/posts/${postId}/comments`);
            setComments(res.data.data.content);
        } catch (error) {
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const handleBookmark = async () => {
        try {
            const res = await apiClient.post(`/posts/${postId}/bookmarks`);
            alert(res.data.data ? '북마크 되었습니다.' : '북마크가 해제되었습니다.');
        } catch (error) {
            alert('북마크 요청 실패');
        }
    };

    const handleLike = async () => {
        try {
            const res = await apiClient.post(`/posts/${postId}/likes`);
            alert(res.data.data ? '좋아요!' : '좋아요 취소');
            // Ideally refresh like count here
        } catch (error) {
            alert('좋아요 요청 실패');
        }
    };

    if (loading) return <div className="text-center py-10">로딩 중...</div>;
    if (!post) return <div className="text-center py-10">게시글을 찾을 수 없습니다.</div>;

    const isAuthor = user?.nickname === post.authorName; // Simple check, ideally use ID

    return (
        <div className="space-y-8">
            {/* Post Header */}
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                        <span>{post.authorName}</span>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        <span>조회 {post.viewCount}</span>
                    </div>
                    <div className="flex gap-2">
                        {isAuthor && (
                            <Button variant="secondary" size="sm" onClick={handleDelete}>
                                삭제
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none py-4 whitespace-pre-wrap">
                {post.content}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 py-8 border-b border-gray-200">
                <Button variant="outline" onClick={handleLike}>
                    ♥ 좋아요
                </Button>
                <Button variant="outline" onClick={handleBookmark}>
                    ★ 북마크
                </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold">댓글 {comments.length}개</h3>

                {/* Comment Form */}
                {user && (
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="댓글을 작성하세요..."
                        />
                        <Button type="submit">등록</Button>
                    </form>
                )}

                {/* Comment List */}
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li key={comment.id} className="rounded-lg bg-gray-50 p-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span className="font-semibold text-gray-900">{comment.authorName}</span>
                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-800">{comment.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
