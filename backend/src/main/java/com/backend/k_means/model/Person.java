package com.backend.k_means.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "peoples")
@Data
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;
}
