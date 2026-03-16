package com.resumebuilder.repository;

import com.resumebuilder.model.ATSResult;
import com.resumebuilder.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ATSResultRepository extends JpaRepository<ATSResult, Long> {
    
    Optional<ATSResult> findByResumeId(Long resumeId);
    
    Optional<ATSResult> findTopByResumeOrderByCreatedAtDesc(Resume resume);
    
    void deleteByResumeId(Long resumeId);
}
