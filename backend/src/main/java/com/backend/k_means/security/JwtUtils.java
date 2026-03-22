package com.backend.k_means.security;

import com.backend.k_means.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwtSecret}")
    private String jwtSecret;

    @Value("${jwtExpirationMs}")
    private long jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        PersonDetails userPrincipal = (PersonDetails) authentication.getPrincipal();
        return  Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        byte[] keyBytes;

        // Проверяем, это BASE64 или обычная строка
        if (jwtSecret.matches("^[A-Za-z0-9+/=]+$") && jwtSecret.length() % 4 == 0) {
            // Пробуем декодировать как BASE64
            try {
                keyBytes = Decoders.BASE64.decode(jwtSecret);
            } catch (Exception e) {
                // Если не получилось, используем как строку
                keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            }
        } else {
            keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }

        // Если ключ меньше 32 байт — дополняем
        if (keyBytes.length < 32) {
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            for (int i = keyBytes.length; i < 32; i++) {
                paddedKey[i] = 0x00;
            }
            keyBytes = paddedKey;
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isValidJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            throw new JwtAuthenticationException("Недействительная подпись JWT токена");
        } catch (MalformedJwtException e) {
            throw new JwtAuthenticationException("Некорректный формат JWT токена");
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Срок действия JWT токена истек");
        } catch (UnsupportedJwtException e) {
            throw new JwtAuthenticationException("Неподдерживаемый тип JWT токена");
        } catch (IllegalArgumentException e) {
            throw new JwtAuthenticationException("JWT токен пуст или отсутствует");
        }
    }
}
