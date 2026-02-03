package com.endfield.community.domain.comment.controller;

import com.endfield.community.domain.comment.dto.CommentDto;
import com.endfield.community.domain.comment.dto.CommentResponse;
import com.endfield.community.domain.comment.service.CommentService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<Long> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentDto.Request request,
            Authentication authentication) {
        return ApiResponse.success(commentService.createComment(postId, authentication.getName(), request));
    }

    @GetMapping("/posts/{postId}/comments")
    public ApiResponse<Page<CommentResponse>> getCommentList(
            @PathVariable Long postId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ApiResponse.success(commentService.getCommentList(postId, pageable));
    }

    @PutMapping("/comments/{commentId}")
    public ApiResponse<Void> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentDto.Request request,
            Authentication authentication) {
        commentService.updateComment(commentId, authentication.getName(), request);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        commentService.deleteComment(commentId, authentication.getName());
        return ApiResponse.success(null);
    }
}
