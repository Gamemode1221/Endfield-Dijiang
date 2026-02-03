package com.endfield.community.domain.bookmark.controller;

import com.endfield.community.domain.bookmark.dto.BookmarkResponse;
import com.endfield.community.domain.bookmark.service.BookmarkService;
import com.endfield.community.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/posts/{postId}/bookmarks")
    public ApiResponse<Boolean> toggleBookmark(
            @PathVariable Long postId,
            Authentication authentication) {
        return ApiResponse.success(bookmarkService.toggleBookmark(postId, authentication.getName()));
    }

    @GetMapping("/bookmarks/me")
    public ApiResponse<Page<BookmarkResponse>> getMyBookmarks(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {
        return ApiResponse.success(bookmarkService.getMyBookmarks(authentication.getName(), pageable));
    }
}
