package com.noah.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				// 1. 실제 Vercel 주소와 로컬 주소를 명확히 입력하세요.
				.allowedOrigins("http://localhost:5173", "https://noahats-assignment.vercel.app",
						"https://noahats-assignment-8kbi.vercel.app" // 에러 로그에 찍힌 주소 포함
				).allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*").allowCredentials(true)
				.maxAge(3600); // 1시간 동안 프리플라이트 요청 캐시
	}
}