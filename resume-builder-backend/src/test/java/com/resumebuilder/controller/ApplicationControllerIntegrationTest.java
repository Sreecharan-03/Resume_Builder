package com.resumebuilder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.ApplicationDTO;
import com.resumebuilder.security.JwtAuthenticationFilter;
import com.resumebuilder.service.ApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = "spring.dotenv.enabled=false")
@WithMockUser(username = "tester@example.com")
class ApplicationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldSaveApplicationSuccessfully() throws Exception {
        ApplicationDTO.SaveApplicationRequest request = new ApplicationDTO.SaveApplicationRequest();
        request.setJobId("job-101");
        request.setResumeId(1L);
        request.setJobTitle("Backend Engineer");
        request.setCompany("Acme Inc");
        request.setStatus("APPLIED");

        ApplicationDTO.ApplicationHistoryResponse response = new ApplicationDTO.ApplicationHistoryResponse();
        response.setId(11L);
        response.setJobId("job-101");
        response.setJobTitle("Backend Engineer");
        response.setCompany("Acme Inc");
        response.setStatus("APPLIED");
        response.setAppliedAt(LocalDateTime.now());

        when(applicationService.saveApplication(any(ApplicationDTO.SaveApplicationRequest.class), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/applications/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.jobId").value("job-101"))
                .andExpect(jsonPath("$.data.status").value("APPLIED"));
    }

    @Test
    void shouldGetHistorySuccessfully() throws Exception {
        ApplicationDTO.ApplicationHistoryResponse item = new ApplicationDTO.ApplicationHistoryResponse();
        item.setId(11L);
        item.setJobId("job-101");
        item.setJobTitle("Backend Engineer");
        item.setCompany("Acme Inc");
        item.setStatus("APPLIED");
        item.setMatchScore(84);
        item.setAppliedAt(LocalDateTime.now());

        when(applicationService.getHistory(anyString())).thenReturn(List.of(item));

        mockMvc.perform(get("/api/applications/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].jobId").value("job-101"))
                .andExpect(jsonPath("$.data[0].matchScore").value(84));
    }
}
