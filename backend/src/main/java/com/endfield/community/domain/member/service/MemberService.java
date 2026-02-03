package com.endfield.community.domain.member.service;

import com.endfield.community.domain.member.dto.LoginRequest;
import com.endfield.community.domain.member.dto.SignUpRequest;
import com.endfield.community.domain.member.dto.TokenResponse;
import com.endfield.community.domain.member.entity.Member;
import com.endfield.community.domain.member.repository.MemberRepository;
import com.endfield.community.global.auth.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        Member member = request.toEntity(passwordEncoder.encode(request.getPassword()));
        return memberRepository.save(member).getId();
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 1. Authenticate (This triggers UserDetailsServiceImpl.loadUserByUsername,
        // which we haven't implemented yet!)
        // Wait, we need a CustomUserDetailsService!
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 2. Generate Token
        String accessToken = jwtTokenProvider.createToken(authentication);

        // 3. Return info
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        return TokenResponse.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .memberId(member.getId())
                .nickname(member.getNickname())
                .build();
    }
}
