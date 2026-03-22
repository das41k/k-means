# Используем официальный образ Java 21 от Eclipse Temurin
FROM eclipse-temurin:21-jdk-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем jar файл после сборки
COPY target/k-means-0.0.1-SNAPSHOT.jar app.jar

# Создаем пользователя для безопасности
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

# Открываем порт
EXPOSE 4444

# Запускаем
ENTRYPOINT ["java", "-jar", "app.jar"]