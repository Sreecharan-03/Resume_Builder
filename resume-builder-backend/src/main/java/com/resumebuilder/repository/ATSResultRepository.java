package com.resumebuilder.repository;

import com.resumebuilder.model.ATSResult;
import com.resumebuilder.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ATSResultRepository extends JpaRepository<ATSResult, Long> {
    
    Optional<ATSResult> findByResumeId(Long resumeId);
    
    Optional<ATSResult> findTopByResumeOrderByCreatedAtDesc(Resume resume);
    
    @Query("SELECT a FROM ATSResult a WHERE a.resume.id = :resumeId ORDER BY a.overallScore DESC, a.createdAt DESC LIMIT 1")
    Optional<ATSResult> findBestScoreByResumeId(@Param("resumeId") Long resumeId);
    
    void deleteByResumeId(Long resumeId);
}
