package com.resumebuilder.repository;

import com.resumebuilder.model.ApplicationHistory;
import com.resumebuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, Long> {

    List<ApplicationHistory> findByUserOrderByAppliedAtDesc(User user);

    long countByUser(User user);
}
