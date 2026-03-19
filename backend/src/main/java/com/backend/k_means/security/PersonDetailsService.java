package com.backend.k_means.security;

import com.backend.k_means.model.Person;
import com.backend.k_means.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonDetailsService implements UserDetailsService {

    private final PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        Person person = personRepository.findByUsername(username)
                .orElseThrow( () -> new UsernameNotFoundException("Пользователь с данным логином и паролем не был найден в системе!"));
        return new PersonDetails(person);
    }
}
