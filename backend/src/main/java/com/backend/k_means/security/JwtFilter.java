package com.backend.k_means.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final PersonDetailsService personDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Логируем входящий запрос
        log.debug("Обработка запроса: {} {}", request.getMethod(), request.getRequestURI());

        try {
            // 1. Извлекаем токен из запроса
            String jwt = parseJwt(request);

            // 2. Если токена нет - пропускаем
            if (jwt == null) {
                log.debug("JWT токен отсутствует в запросе");
                filterChain.doFilter(request, response);
                return;
            }

            // 3. Проверяем валидность токена
            if (!jwtUtils.isValidJwtToken(jwt)) {
                log.warn("Невалидный JWT токен: {}...", jwt.substring(0, Math.min(20, jwt.length())));
                filterChain.doFilter(request, response);
                return;
            }

            // 4. Получаем username из токена
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            log.debug("JWT токен валиден для пользователя: {}", username);

            // 5. Загружаем пользователя из БД
            UserDetails userDetails = personDetailsService.loadUserByUsername(username);

            // 6. Создаем объект аутентификации
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            // 7. Добавляем детали запроса
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // 8. Устанавливаем аутентификацию в контекст
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info("Пользователь '{}' успешно аутентифицирован", username);

        } catch (Exception e) {
            // Логируем ошибку
            log.error("Ошибка аутентификации пользователя: {}", e.getMessage());

            // Детальная обработка ошибок
            if (e instanceof ExpiredJwtException) {
                log.warn("Срок действия JWT токена истек для запроса: {}", request.getRequestURI());
            } else if (e instanceof MalformedJwtException) {
                log.warn("Некорректный формат JWT токена для запроса: {}", request.getRequestURI());
            }

            // Очищаем контекст безопасности
            SecurityContextHolder.clearContext();
        }

        // Продолжаем цепочку фильтров
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}