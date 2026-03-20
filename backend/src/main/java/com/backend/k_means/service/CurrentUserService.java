package com.backend.k_means.service;

import com.backend.k_means.exception.UserNotAuthenticationException;
import com.backend.k_means.model.Person;
import com.backend.k_means.repository.PersonRepository;
import com.backend.k_means.security.PersonDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CurrentUserService {
    private final PersonRepository personRepository;

    public Person getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserNotAuthenticationException("Пользователь не аутентифицирован в системе!");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof PersonDetails) {
            return ((PersonDetails) principal).getPerson();
        }
        throw new RuntimeException("Не удалось получить информацию о пользователе");
    }
}
