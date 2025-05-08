package org.example.backend.repository;

import org.example.backend.model.MoneyInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoneyInsightRepository extends JpaRepository<MoneyInsight, Long> {
    List<MoneyInsight> findByUserId(Long userId);
}
