package com.endfield.community.domain.like.controller;

import com.endfield.community.domain.like.service.PostLikeService;
import com.endfield.community.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PostMapping("/{postId}/likes")
    public ApiResponse<Boolean> toggleLike(
            @PathVariable Long postId,
            Authentication authentication) {
        return ApiResponse.success(postLikeService.toggleLike(postId, authentication.getName()));
    }

    @GetMapping("/{postId}/likes/count")
    public ApiResponse<Long> getLikeCount(@PathVariable Long postId) {
        return ApiResponse.success(postLikeService.getLikeCount(postId));
    }
}
