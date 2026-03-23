package com.resumebuilder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.JobDTO;
import com.resumebuilder.security.JwtAuthenticationFilter;
import com.resumebuilder.service.JobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = JobController.class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = "spring.dotenv.enabled=false")
@WithMockUser(username = "tester@example.com")
class JobControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JobService jobService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldFetchJobsSuccessfully() throws Exception {
        JobDTO.JobCard job = new JobDTO.JobCard();
        job.setId("job-1");
        job.setTitle("Java Developer");
        job.setCompany("Acme Inc");
        job.setLocation("Bangalore");
        job.setMatchScore(82);
        job.setJobSkills(List.of("java", "spring boot"));

        JobDTO.JobSearchResponse response = new JobDTO.JobSearchResponse();
        response.setRole("Java Developer");
        response.setResults(List.of(job));
        response.setBestMatches(List.of(job));
        response.setTotal(1);

        when(jobService.fetchJobs(eq("Java Developer"), any(), any(), any(), anyString())).thenReturn(response);

        mockMvc.perform(get("/api/jobs")
                .param("role", "Java Developer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("Java Developer"))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.results[0].matchScore").value(82));
    }

    @Test
    void shouldGenerateAiContentSuccessfully() throws Exception {
        JobDTO.GenerateContentRequest request = new JobDTO.GenerateContentRequest();
        request.setResumeId(1L);
        request.setJobDescription("Need Java and Spring Boot experience");
        request.setJobTitle("Backend Engineer");
        request.setCompany("Acme Inc");

        JobDTO.GeneratedContentResponse response = new JobDTO.GeneratedContentResponse();
        response.setCoverLetter("Generated cover letter");
        response.setWhyFit("Generated why fit");
        response.setSkillsSummary("Generated skills summary");

        when(jobService.generateContent(any(JobDTO.GenerateContentRequest.class), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/jobs/generate-content")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.coverLetter").value("Generated cover letter"));
    }
}
