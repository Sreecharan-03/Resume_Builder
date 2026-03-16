package com.resumebuilder.repository;

import com.resumebuilder.model.JobContext;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobContextRepository extends JpaRepository<JobContext, Long> {
    Optional<JobContext> findByResumeAndUser(Resume resume, User user);
    Optional<JobContext> findByResumeId(Long resumeId);
    List<JobContext> findByUser(User user);
    Optional<JobContext> findByResumeIdAndUserId(Long resumeId, Long userId);
}
