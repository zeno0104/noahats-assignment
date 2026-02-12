# 1. 빌드 단계 (Java 21 지원하는 Gradle 이미지 사용)
FROM gradle:8.5-jdk21-alpine AS builder
WORKDIR /app
COPY . .
# 테스트 건너뛰고 빌드
RUN gradle build --no-daemon -x test

# 2. 실행 단계 (OpenJDK 대신 Eclipse Temurin 사용 - 이게 표준입니다!)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# 빌드 단계에서 만든 jar 파일을 복사해옴
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]