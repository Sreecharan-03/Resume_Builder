package com.resumebuilder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.JobDTO;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class JobService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JobService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final MatchService matchService;
    private final ResumeRepository resumeRepository;
    private final AuthService authService;
    private final OpenAIService openAIService;

    @Value("${rapidapi.jobs.base-url:https://jsearch.p.rapidapi.com/search}")
    private String rapidApiJobsBaseUrl;

    @Value("${rapidapi.jobs.host:jsearch.p.rapidapi.com}")
    private String rapidApiJobsHost;

    @Value("${rapidapi.jobs.key:}")
    private String rapidApiJobsKey;

    @Value("${matching.ai-skill-extraction-enabled:true}")
    private boolean aiSkillExtractionEnabled;

    private final Map<Integer, List<String>> skillExtractionCache = new ConcurrentHashMap<>();

    public JobService(RestTemplate restTemplate,
                      MatchService matchService,
                      ResumeRepository resumeRepository,
                      AuthService authService,
                      OpenAIService openAIService) {
        this.restTemplate = restTemplate;
        this.matchService = matchService;
        this.resumeRepository = resumeRepository;
        this.authService = authService;
        this.openAIService = openAIService;
        this.objectMapper = new ObjectMapper();
    }

    public JobDTO.JobSearchResponse fetchJobs(String role, Integer page, Integer limit, Long resumeId, String userEmail) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role is required");
        }

        User user = null;
        Resume resume = null;

        if (userEmail != null && !userEmail.isBlank()) {
            try {
                user = authService.getUserByEmail(userEmail);
            } catch (RuntimeException ignored) {
                user = null;
            }
        }

        if (user != null) {
            resume = resolveResume(user, resumeId);
        }

        List<String> parsedResumeSkills = resume != null
                ? matchService.parseResumeSkills(resume.getSkills())
                : List.of();

        String resumeText = resume != null ? buildResumeText(resume) : "";
        List<String> resumeSkills = mergeSkills(
                parsedResumeSkills,
                aiSkillExtractionEnabled ? extractSkillsCached(resumeText, 20) : List.of()
        );

        String responseJson = fetchJobsRaw(role, page, limit);
        List<JobDTO.JobCard> jobs = parseAndScoreJobs(responseJson, resumeSkills, role);

        jobs.sort(Comparator.comparingInt(JobDTO.JobCard::getMatchScore).reversed());

        JobDTO.JobSearchResponse response = new JobDTO.JobSearchResponse();
        response.setRole(role);
        response.setResults(jobs);
        response.setBestMatches(jobs.stream().limit(5).collect(Collectors.toList()));
        response.setTotal(jobs.size());
        return response;
    }

    public String fetchJobsRaw(String role, Integer page, Integer limit) {
        int safePage = (page == null || page < 1) ? 1 : page;
        int safeLimit = (limit == null || limit < 1) ? 20 : Math.min(limit, 50);
        String safeRole = role == null ? "" : role.trim();

        if (rapidApiJobsKey == null || rapidApiJobsKey.isBlank()) {
            throw new IllegalStateException("RapidAPI jobs key is missing. Configure RAPIDAPI_JOBS_KEY.");
        }

        String query = safeRole + " jobs";
        
        // Build URL without final encode() - let RestTemplate handle encoding
        String rapidApiUrl = UriComponentsBuilder
                .fromHttpUrl(rapidApiJobsBaseUrl)
                .queryParam("query", query)
                .queryParam("page", safePage)
                .queryParam("page_size", safeLimit)
                .build()
                .toUriString();

        logger.info("Calling RapidAPI with URL (raw): {}", rapidApiUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", rapidApiJobsKey);
        headers.set("X-RapidAPI-Host", rapidApiJobsHost);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        
        logger.info("API Key present: {}, Host: {}", (rapidApiJobsKey != null && !rapidApiJobsKey.isBlank()),  rapidApiJobsHost);

        try {
            ResponseEntity<String> rapidResponse = restTemplate.exchange(
                    rapidApiUrl,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            logger.info("RapidAPI Response Status: {}", rapidResponse.getStatusCode());
            
            return rapidResponse.getBody();
        } catch (Exception ex) {
            logger.error("RapidAPI call failed: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to fetch jobs from RapidAPI", ex);
        }
    }

    public JobDTO.GeneratedContentResponse generateContent(JobDTO.GenerateContentRequest request, String userEmail) {
        String resumeText = request.getResumeText();

        if ((resumeText == null || resumeText.isBlank()) && request.getResumeId() != null) {
            User user = authService.getUserByEmail(userEmail);
            Resume resume = resumeRepository.findByIdAndUser(request.getResumeId(), user)
                    .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
            resumeText = buildResumeText(resume);
        }

        if (resumeText == null || resumeText.isBlank()) {
            throw new IllegalArgumentException("Resume text or resumeId is required");
        }

        if (request.getJobDescription() == null || request.getJobDescription().isBlank()) {
            throw new IllegalArgumentException("Job description is required");
        }

        Map<String, String> generated = openAIService.generateJobApplicationContent(
                resumeText,
                request.getJobDescription(),
                request.getJobTitle(),
                request.getCompany()
        );

        JobDTO.GeneratedContentResponse response = new JobDTO.GeneratedContentResponse();
        response.setCoverLetter(generated.getOrDefault("coverLetter", ""));
        response.setWhyFit(generated.getOrDefault("whyFit", ""));
        response.setSkillsSummary(generated.getOrDefault("skillsSummary", ""));

        return response;
    }

    private Resume resolveResume(User user, Long resumeId) {
        if (resumeId != null) {
            return resumeRepository.findByIdAndUser(resumeId, user).orElse(null);
        }

        List<Resume> resumes = resumeRepository.findByUserOrderByUpdatedAtDesc(user);
        return resumes.isEmpty() ? null : resumes.get(0);
    }

    private List<JobDTO.JobCard> parseAndScoreJobs(String responseJson, List<String> resumeSkills, String roleQuery) {
        List<JobDTO.JobCard> jobs = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(responseJson);
            
            // DEBUG: Log first 500 chars of response
            String logMsg = responseJson.length() > 500 ? responseJson.substring(0, 500) : responseJson;
            logger.info("RapidAPI Response (first 500 chars): {}", logMsg);
            
            JsonNode sourceArray = root.path("data");

            if (!sourceArray.isArray()) {
                logger.warn("Jobs response did not contain array at 'data'. Response root keys: {}", root.fieldNames());
                // Try alternative: check if root itself is the array
                if (root.isArray()) {
                    sourceArray = root;
                    logger.info("Using root as array instead of root.data");
                } else {
                    return jobs;
                }
            }
            
            logger.info("Found {} jobs in response", sourceArray.size());

            for (JsonNode jobNode : sourceArray) {
                JobDTO.JobCard card = new JobDTO.JobCard();

                String id = firstNonBlank(
                        jobNode.path("job_id").asText(null),
                        jobNode.path("id").asText(null),
                        jobNode.path("_id").asText(null)
                );
                String title = firstNonBlank(
                        jobNode.path("job_title").asText(null),
                        jobNode.path("title").asText(null)
                );
                String company = firstNonBlank(
                        jobNode.path("employer_name").asText(null),
                        "Unknown Company"
                );
                String location = firstNonBlank(
                        jobNode.path("job_city").asText(null),
                        jobNode.path("job_state").asText(null),
                        jobNode.path("job_country").asText(null),
                        "Remote"
                );
                String description = firstNonBlank(
                        jobNode.path("job_description").asText(null),
                        ""
                );
                String redirectUrl = firstNonBlank(
                        jobNode.path("job_apply_link").asText(null),
                        jobNode.path("job_google_link").asText(null),
                        ""
                );
                String postedAt = firstNonBlank(
                        jobNode.path("job_posted_at_datetime_utc").asText(null),
                        ""
                );

                card.setId(id == null || id.isBlank() ? String.valueOf(System.nanoTime()) : id);
                card.setTitle(title == null ? "" : title);
                card.setCompany(company);
                card.setLocation(location);
                card.setDescription(description);
                card.setRedirectUrl(redirectUrl);
                card.setPostedAt(postedAt);

                String skillSource = card.getTitle() + " " + card.getDescription();
                List<String> jobSkills = List.of();
                int matchScore = 0;

                try {
                    jobSkills = mergeSkills(
                            matchService.extractSkills(skillSource),
                            aiSkillExtractionEnabled ? extractSkillsCached(skillSource, 20) : List.of()
                    );

                    matchScore = matchService.calculateWeightedMatchScore(
                            resumeSkills,
                            jobSkills,
                            card.getTitle(),
                            card.getDescription()
                    );

                    // If resume context is not available, fall back to role-query relevance scoring
                    // so users still see meaningful ordering and non-zero scores.
                    if (matchScore <= 0 && (resumeSkills == null || resumeSkills.isEmpty())) {
                        matchScore = calculateRoleQueryScore(roleQuery, card.getTitle(), card.getDescription(), jobSkills);
                    }

                    // Fallback: if structured skill extraction returns weak/no signal,
                    // compute overlap directly from title+description text.
                    if (matchScore <= 0 && resumeSkills != null && !resumeSkills.isEmpty()) {
                        matchScore = calculateTextOverlapFallbackScore(resumeSkills, card.getTitle(), card.getDescription());

                        if ((jobSkills == null || jobSkills.isEmpty()) && matchScore > 0) {
                            jobSkills = extractMatchedResumeSkillsFromText(resumeSkills, card.getTitle(), card.getDescription());
                        }
                    }
                } catch (Exception scoringEx) {
                    logger.warn("Score fallback for job '{}': {}", card.getTitle(), scoringEx.getMessage());
                }

                card.setJobSkills(jobSkills);
                card.setMatchScore(Math.max(0, matchScore));
                jobs.add(card);
            }
        } catch (Exception ex) {
            logger.error("Failed to parse jobs response: {}", ex.getMessage());
            return List.of();
        }

        return jobs;
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return "";
        }

        for (String value : values) {
            if (value != null && !value.isBlank() && !"null".equalsIgnoreCase(value)) {
                return value;
            }
        }

        return "";
    }

    private String buildResumeText(Resume resume) {
        return String.join("\n",
                defaultString(resume.getFullName()),
                defaultString(resume.getSummary()),
                defaultString(resume.getSkills()),
                defaultString(resume.getExperience()),
                defaultString(resume.getProjects()),
                defaultString(resume.getEducation()),
                defaultString(resume.getCertifications())
        );
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private List<String> extractSkillsCached(String text, int maxSkills) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        int key = text.hashCode();
        return skillExtractionCache.computeIfAbsent(key, k -> openAIService.extractSkillsFromText(text, maxSkills));
    }

    private List<String> mergeSkills(List<String> first, List<String> second) {
        Set<String> merged = new LinkedHashSet<>();
        if (first != null) {
            merged.addAll(first);
        }
        if (second != null) {
            merged.addAll(second);
        }
        return new ArrayList<>(merged);
    }

    private int calculateTextOverlapFallbackScore(List<String> resumeSkills, String title, String description) {
        if (resumeSkills == null || resumeSkills.isEmpty()) {
            return 0;
        }

        String combined = (defaultString(title) + " " + defaultString(description)).toLowerCase(Locale.ROOT);
        if (combined.isBlank()) {
            return 0;
        }

        int hits = 0;
        for (String skill : resumeSkills) {
            if (skill == null || skill.isBlank()) {
                continue;
            }
            String normalized = skill.toLowerCase(Locale.ROOT).trim();
            if (!normalized.isBlank() && combined.contains(normalized)) {
                hits++;
            }
        }

        if (hits == 0) {
            return 0;
        }

        int denominator = Math.max(1, Math.min(resumeSkills.size(), 10));
        int score = (hits * 100) / denominator;

        if (score < 20) {
            score = 20;
        }

        return Math.min(score, 95);
    }

    private List<String> extractMatchedResumeSkillsFromText(List<String> resumeSkills, String title, String description) {
        if (resumeSkills == null || resumeSkills.isEmpty()) {
            return List.of();
        }

        String combined = (defaultString(title) + " " + defaultString(description)).toLowerCase(Locale.ROOT);
        List<String> matched = new ArrayList<>();

        for (String skill : resumeSkills) {
            if (skill == null || skill.isBlank()) {
                continue;
            }
            String normalized = skill.toLowerCase(Locale.ROOT).trim();
            if (!normalized.isBlank() && combined.contains(normalized)) {
                matched.add(skill.trim());
            }
        }

        return matched.stream().distinct().limit(12).collect(Collectors.toList());
    }

    private int calculateRoleQueryScore(String roleQuery,
                                        String title,
                                        String description,
                                        List<String> jobSkills) {
        if (roleQuery == null || roleQuery.isBlank()) {
            return 0;
        }

        String combined = (defaultString(title) + " " + defaultString(description)).toLowerCase(Locale.ROOT);
        String normalizedRole = roleQuery.toLowerCase(Locale.ROOT).trim();

        int score = 0;

        if (!normalizedRole.isBlank()) {
            if (combined.contains(normalizedRole)) {
                score += 45;
            }

            String[] roleTokens = normalizedRole.split("\\s+");
            int tokenHits = 0;
            for (String token : roleTokens) {
                if (token.length() < 3) {
                    continue;
                }
                if (combined.contains(token)) {
                    tokenHits++;
                }
            }

            if (roleTokens.length > 0) {
                score += (int) Math.round(((double) tokenHits / Math.max(1, roleTokens.length)) * 35.0);
            }
        }

        if (jobSkills != null && !jobSkills.isEmpty()) {
            score += Math.min(20, jobSkills.size() * 3);
        }

        if (score > 0 && score < 18) {
            score = 18;
        }

        return Math.min(score, 90);
    }
}
