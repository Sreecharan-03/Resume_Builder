package com.resumebuilder.service;

import com.resumebuilder.dto.UserDTO;
import com.resumebuilder.model.ATSResult;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.ATSResultRepository;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ATSResultRepository atsResultRepository;

    public UserService(UserRepository userRepository, 
                       ResumeRepository resumeRepository,
                       ATSResultRepository atsResultRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.atsResultRepository = atsResultRepository;
    }

    public UserDTO.UserResponse getUserById(Long userId, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Users can only access their own profile
        if (!currentUser.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToUserResponse(currentUser);
    }

    public UserDTO.UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    public UserDTO.UserResponse updateUser(Long userId, UserDTO.UpdateUserRequest request, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!currentUser.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            currentUser.setFullName(request.getFullName());
        }
        if (request.getProfilePicture() != null) {
            currentUser.setProfilePicture(request.getProfilePicture());
        }

        User savedUser = userRepository.save(currentUser);
        return mapToUserResponse(savedUser);
    }

    private UserDTO.UserResponse mapToUserResponse(User user) {
        List<Resume> resumes = resumeRepository.findByUserOrderByUpdatedAtDesc(user);
        int totalResumes = resumes.size();

        // Calculate average ATS score
        int averageAtsScore = 0;
        if (!resumes.isEmpty()) {
            int totalScore = 0;
            int count = 0;
            for (Resume resume : resumes) {
                Optional<ATSResult> result = atsResultRepository.findByResumeId(resume.getId());
                if (result.isPresent() && result.get().getOverallScore() != null) {
                    totalScore += result.get().getOverallScore();
                    count++;
                }
            }
            if (count > 0) {
                averageAtsScore = totalScore / count;
            }
        }

        return UserDTO.UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole() != null ? user.getRole().name() : "USER")
                .totalResumes(totalResumes)
                .averageAtsScore(averageAtsScore)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
