package com.noah.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class WebConfig {

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		// 1. 자격 증명(쿠키, 인증헤더) 허용 - 이게 true면 allowedOrigins에 *를 못씀
		config.setAllowCredentials(true);

		// 2. 허용할 주소 패턴 (여기에 Vercel 주소들을 넣음)
		config.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", // 로컬
				"https://*.vercel.app" // Vercel 프리뷰/배포 주소 전체
		));

		// 3. 허용할 HTTP 메서드 및 헤더
		config.setAllowedHeaders(Collections.singletonList("*"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		// 4. 브라우저가 이 설정을 기억하는 시간 (1시간)
		config.setMaxAge(3600L);

		// 5. 모든 경로(/**)에 대해 위 설정 적용
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}