package com.backend.k_means.controller;

import com.backend.k_means.model.Person;
import com.backend.k_means.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Person person) {
        Optional<Person> find = personRepository.findByUsername(person.getUsername());
        if (find.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь с таким логином уже существует!");
        }
        person.setPassword(passwordEncoder.encode(person.getPassword()));
        personRepository.save(person);
        return ResponseEntity.ok("Вы успешно зарегистрировались!");
    }

}
