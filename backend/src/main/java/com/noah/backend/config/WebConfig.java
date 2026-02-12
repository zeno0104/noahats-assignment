package com.noah.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				// allowedOriginPatterns("*") 대신 실제 허용할 주소들을 명시하는 것이 가장 안전합니다.
				.allowedOriginPatterns("http://localhost:5173", "https://noahats-assignment.vercel.app",
						"https://noahats-assignment-*.vercel.app" // Vercel의 미리보기 주소들까지 모두 허용
				).allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*").allowCredentials(true)
				.maxAge(3600); // 브라우저가 CORS 설정을 1시간 동안 기억하게 함
	}
}