package com.endfield.community.domain.bookmark.dto;

import com.endfield.community.domain.bookmark.entity.Bookmark;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {
    private Long id;
    private Long postId;
    private String postTitle;
    private String authorName;
    private LocalDateTime createdAt;

    public static BookmarkResponse from(Bookmark bookmark) {
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .postId(bookmark.getPost().getId())
                .postTitle(bookmark.getPost().getTitle())
                .authorName(bookmark.getPost().getAuthor().getNickname())
                .createdAt(bookmark.getCreatedAt())
                .build();
    }
}
