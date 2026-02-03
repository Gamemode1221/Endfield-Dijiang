package com.endfield.community.domain.like.service;

import com.endfield.community.domain.like.entity.PostLike;
import com.endfield.community.domain.like.repository.PostLikeRepository;
import com.endfield.community.domain.member.entity.Member;
import com.endfield.community.domain.member.repository.MemberRepository;
import com.endfield.community.domain.post.entity.Post;
import com.endfield.community.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    @Transactional
    public boolean toggleLike(Long postId, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        return postLikeRepository.findByMemberIdAndPostId(member.getId(), postId)
                .map(like -> {
                    postLikeRepository.delete(like);
                    return false; // Unliked
                })
                .orElseGet(() -> {
                    postLikeRepository.save(new PostLike(member, post));
                    return true; // Liked
                });
    }

    public long getLikeCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }
}
