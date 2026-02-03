package com.endfield.community.domain.bookmark.service;

import com.endfield.community.domain.bookmark.dto.BookmarkResponse;
import com.endfield.community.domain.bookmark.entity.Bookmark;
import com.endfield.community.domain.bookmark.repository.BookmarkRepository;
import com.endfield.community.domain.member.entity.Member;
import com.endfield.community.domain.member.repository.MemberRepository;
import com.endfield.community.domain.post.entity.Post;
import com.endfield.community.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    @Transactional
    public boolean toggleBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        return bookmarkRepository.findByMemberIdAndPostId(member.getId(), postId)
                .map(bookmark -> {
                    bookmarkRepository.delete(bookmark);
                    return false; // Unbookmarked
                })
                .orElseGet(() -> {
                    bookmarkRepository.save(new Bookmark(member, post));
                    return true; // Bookmarked
                });
    }

    public Page<BookmarkResponse> getMyBookmarks(String email, Pageable pageable) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        return bookmarkRepository.findByMemberIdOrderByCreatedAtDesc(member.getId(), pageable)
                .map(BookmarkResponse::from);
    }
}
