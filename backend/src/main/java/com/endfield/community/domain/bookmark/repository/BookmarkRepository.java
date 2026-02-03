package com.endfield.community.domain.bookmark.repository;

import com.endfield.community.domain.bookmark.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByMemberIdAndPostId(Long memberId, Long postId);

    Optional<Bookmark> findByMemberIdAndPostId(Long memberId, Long postId);

    Page<Bookmark> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);
}
