package com.backend.k_means.service;

import com.backend.k_means.dto.UserResponse;
import com.backend.k_means.exception.UserNotAuthenticationException;
import com.backend.k_means.exception.UserNotFoundException;
import com.backend.k_means.model.Person;
import com.backend.k_means.model.SavedCluster;
import com.backend.k_means.repository.PersonRepository;
import com.backend.k_means.security.PersonDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
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

    public UserResponse getUserByUsername(String username) {
        Person person = personRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Пользователь с данным логином не был найден!"));
        return mappingByUserResponse(person);
    }

    private UserResponse mappingByUserResponse(Person person) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(person.getUsername());
        List<UserResponse.ClusterUser> clustersByUser = person.getSavedClusters().stream()
                .map(this::mappingByClusterUser)
                .toList();
        userResponse.setClustersByUser(clustersByUser);
        return userResponse;
    }

    private UserResponse.ClusterUser mappingByClusterUser(SavedCluster cluster) {
        UserResponse.ClusterUser clusterUser = new UserResponse.ClusterUser();
        clusterUser.setClusterId(cluster.getId());
        clusterUser.setClusterName(cluster.getName());
        clusterUser.setK(cluster.getK());
        return  clusterUser;
    }
}
