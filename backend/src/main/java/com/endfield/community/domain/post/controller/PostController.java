package com.endfield.community.domain.post.controller;

import com.endfield.community.domain.post.dto.PostDto;
import com.endfield.community.domain.post.dto.PostResponse;
import com.endfield.community.domain.post.service.PostService;
import com.endfield.community.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ApiResponse<Long> createPost(@Valid @RequestBody PostDto.CreateRequest request,
            Authentication authentication) {
        return ApiResponse.success(postService.createPost(authentication.getName(), request));
    }

    @GetMapping
    public ApiResponse<Page<PostResponse>> getPostList(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.success(postService.getPostList(pageable));
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPostDetail(@PathVariable Long postId) {
        return ApiResponse.success(postService.getPostDetail(postId));
    }

    @PutMapping("/{postId}")
    public ApiResponse<Long> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody PostDto.UpdateRequest request,
            Authentication authentication) {
        return ApiResponse.success(postService.updatePost(postId, authentication.getName(), request));
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId, Authentication authentication) {
        postService.deletePost(postId, authentication.getName());
        return ApiResponse.success(null);
    }
}
