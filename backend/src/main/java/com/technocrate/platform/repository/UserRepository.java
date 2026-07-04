package com.technocrate.platform.repository;

import com.technocrate.platform.model.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findById(int id);
    User save(User user);
    List<User> findAll();
}
