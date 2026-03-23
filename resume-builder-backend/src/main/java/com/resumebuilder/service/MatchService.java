package com.resumebuilder.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private static final Set<String> SKILL_DICTIONARY = Set.of(
            "java", "spring", "spring boot", "javascript", "typescript", "react", "node", "nodejs", "express",
            "python", "django", "flask", "fastapi", "sql", "mysql", "postgresql", "mongodb", "redis",
            "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "github actions",
            "microservices", "rest", "graphql", "html", "css", "tailwind", "bootstrap", "git", "linux",
            "machine learning", "data analysis", "pandas", "numpy", "tensorflow", "pytorch", "power bi",
            "communication", "leadership", "problem solving", "agile", "scrum", "testing", "junit"
    );

        private static final Map<String, String> SKILL_NORMALIZATION_MAP = buildNormalizationMap();

    public int matchScore(List<String> resumeSkills, List<String> jobSkills) {
        if (jobSkills == null || jobSkills.isEmpty()) {
            return 0;
        }

        Set<String> normalizedResume = normalizeSkills(resumeSkills);
        Set<String> normalizedJob = normalizeSkills(jobSkills);

        if (normalizedJob.isEmpty()) {
            return 0;
        }

        int matchCount = 0;
        for (String skill : normalizedResume) {
            if (normalizedJob.contains(skill)) {
                matchCount++;
            }
        }

        return Math.min(100, (matchCount * 100) / normalizedJob.size());
    }

    public int calculateWeightedMatchScore(List<String> resumeSkills,
                                           List<String> jobSkills,
                                           String jobTitle,
                                           String jobDescription) {
        Set<String> normalizedResume = normalizeSkills(resumeSkills);
        Set<String> normalizedJob = normalizeSkills(jobSkills);

        if (normalizedJob.isEmpty()) {
            return 0;
        }

        int directMatches = 0;
        int fuzzyMatches = 0;

        for (String resumeSkill : normalizedResume) {
            if (normalizedJob.contains(resumeSkill)) {
                directMatches++;
                continue;
            }

            for (String jobSkill : normalizedJob) {
                if (isFuzzyMatch(resumeSkill, jobSkill)) {
                    fuzzyMatches++;
                    break;
                }
            }
        }

        double directCoverage = (double) directMatches / normalizedJob.size();
        double fuzzyCoverage = (double) fuzzyMatches / normalizedJob.size();

        // Weighted scoring model:
        // - 70% direct skill coverage
        // - 20% fuzzy/semantic coverage
        // - 10% role-title relevance
        double score = (directCoverage * 70.0) + (fuzzyCoverage * 20.0) + (titleRelevance(jobTitle, jobDescription, normalizedResume) * 10.0);

        return Math.max(0, Math.min(100, (int) Math.round(score)));
    }

    public List<String> extractSkills(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        String normalizedText = text.toLowerCase(Locale.ROOT);
        List<String> found = new ArrayList<>();

        for (String skill : SKILL_DICTIONARY) {
            if (normalizedText.contains(skill)) {
                found.add(skill);
            }
        }

        return found.stream().distinct().collect(Collectors.toList());
    }

    public List<String> parseResumeSkills(String rawSkills) {
        if (rawSkills == null || rawSkills.isBlank()) {
            return List.of();
        }

        String trimmed = rawSkills.trim();

        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            String noBrackets = trimmed.substring(1, trimmed.length() - 1);
            return Arrays.stream(noBrackets.split(","))
                    .map(s -> s.replace("\"", "").trim())
                    .filter(s -> !s.isBlank())
                    .collect(Collectors.toList());
        }

        return Arrays.stream(trimmed.split(",|\\n|\\|"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }

    private Set<String> normalizeSkills(List<String> skills) {
        if (skills == null) {
            return Set.of();
        }

        return skills.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(this::normalizeSkill)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String normalizeSkill(String value) {
        String normalized = value.toLowerCase(Locale.ROOT).trim();
        return SKILL_NORMALIZATION_MAP.getOrDefault(normalized, normalized);
    }

    private boolean isFuzzyMatch(String left, String right) {
        if (left.equals(right)) {
            return true;
        }

        if (left.contains(right) || right.contains(left)) {
            return true;
        }

        int minLength = Math.min(left.length(), right.length());
        if (minLength < 4) {
            return false;
        }

        int commonPrefix = 0;
        while (commonPrefix < minLength && left.charAt(commonPrefix) == right.charAt(commonPrefix)) {
            commonPrefix++;
        }

        return commonPrefix >= Math.max(3, minLength - 2);
    }

    private double titleRelevance(String title, String description, Set<String> resumeSkills) {
        String combined = ((title == null ? "" : title) + " " + (description == null ? "" : description)).toLowerCase(Locale.ROOT);
        if (combined.isBlank()) {
            return 0.0;
        }

        int hits = 0;
        for (String skill : resumeSkills) {
            if (combined.contains(skill)) {
                hits++;
            }
        }

        return resumeSkills.isEmpty() ? 0.0 : (double) hits / resumeSkills.size();
    }

    private static Map<String, String> buildNormalizationMap() {
        Map<String, String> map = new HashMap<>();
        map.put("nodejs", "node");
        map.put("node.js", "node");
        map.put("springboot", "spring boot");
        map.put("react.js", "react");
        map.put("js", "javascript");
        map.put("ts", "typescript");
        map.put("postgres", "postgresql");
        map.put("k8s", "kubernetes");
        map.put("ml", "machine learning");
        map.put("ai", "machine learning");
        return map;
    }
}
