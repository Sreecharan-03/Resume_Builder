package com.resumebuilder.repository;

import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    
    List<Resume> findByUserOrderByUpdatedAtDesc(User user);
    
    List<Resume> findByUserAndStatus(User user, Resume.ResumeStatus status);
    
    Optional<Resume> findByIdAndUser(Long id, User user);
    
    @Query("SELECT r FROM Resume r WHERE r.user = :user AND r.atsScore IS NOT NULL ORDER BY r.atsScore DESC")
    List<Resume> findTopScoringResumes(@Param("user") User user);
    
    long countByUser(User user);
    
    @Query("SELECT AVG(r.atsScore) FROM Resume r WHERE r.user = :user AND r.atsScore IS NOT NULL")
    Double getAverageAtsScore(@Param("user") User user);
}
