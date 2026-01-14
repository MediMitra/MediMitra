package com.medimitra.repository;

import com.medimitra.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByStatus(String status);
    List<Store> findByCity(String city);
    List<Store> findByNameContainingIgnoreCase(String name);
    Optional<Store> findByEmail(String email);
}
