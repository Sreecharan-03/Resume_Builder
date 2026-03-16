package com.resumebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {
    /**
     * Calculate ATS score from raw resume text (industry-style, not AI)
     */
    public int calculateATSScore(String text) {
        int score = 0;
        if (text == null) return 0;
        if (text.matches("(?i).*(email|@).*")) score += 10;
        if (text.matches("(?i).*(phone|\\+91|\\d{10}).*")) score += 10;
        if (text.matches("(?i).*education.*")) score += 15;
        if (text.matches("(?i).*skills.*")) score += 25;
        if (text.matches("(?i).*(project|experience).*")) score += 25;
        String[] keywords = {"react", "javascript", "html", "css", "node"};
        int matched = 0;
        String lower = text.toLowerCase();
        for (String k : keywords) if (lower.contains(k)) matched++;
        score += Math.min(matched * 3, 15);
        return Math.min(score, 100);
    }

    /**
     * Generate ATS improvement suggestions based on score and text
     */
    public List<String> getATSSuggestions(int score, String text) {
        List<String> suggestions = new ArrayList<>();
        if (!text.matches("(?i).*skills.*")) suggestions.add("Add a Skills section with relevant keywords.");
        if (!text.matches("(?i).*education.*")) suggestions.add("Add an Education section.");
        if (!text.matches("(?i).*(project|experience).*")) suggestions.add("Add Projects or Experience section.");
        if (score < 60) suggestions.add("Add more technical skills and measurable achievements.");
        if (score < 80) suggestions.add("Use standard section headings and avoid tables/icons.");
        if (!text.matches("(?i).*(email|@).*")) suggestions.add("Include your email address.");
        if (!text.matches("(?i).*(phone|\\+91|\\d{10}).*")) suggestions.add("Include your phone number.");
        return suggestions;
    }

    private static final Logger logger = LoggerFactory.getLogger(ResumeParserService.class);

    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;

    // Common technical skills for matching
    private static final Set<String> KNOWN_SKILLS = new HashSet<>(Arrays.asList(
        // Programming Languages
        "java", "python", "javascript", "typescript", "c++", "c#", "c", "ruby", "go", "golang",
        "rust", "swift", "kotlin", "scala", "php", "perl", "r", "matlab", "dart", "lua",
        // Frontend
        "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "vue.js",
        "html", "html5", "css", "css3", "sass", "scss", "less", "tailwind", "tailwindcss",
        "bootstrap", "jquery", "next.js", "nextjs", "nuxt", "gatsby", "svelte",
        // Backend
        "node", "nodejs", "node.js", "express", "expressjs", "spring", "spring boot", "springboot",
        "django", "flask", "fastapi", "rails", "ruby on rails", "laravel", "asp.net", ".net",
        "hibernate", "jpa", "jdbc",
        // Databases
        "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
        "oracle", "sqlite", "mariadb", "cassandra", "dynamodb", "firebase", "neo4j",
        // Cloud & DevOps
        "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes",
        "k8s", "jenkins", "terraform", "ansible", "ci/cd", "devops", "linux", "unix",
        "nginx", "apache", "git", "github", "gitlab", "bitbucket",
        // AI/ML
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn",
        "pandas", "numpy", "opencv", "nlp", "natural language processing", "computer vision",
        // Mobile
        "android", "ios", "react native", "flutter", "xamarin", "ionic",
        // Tools & Others
        "rest", "restful", "api", "graphql", "microservices", "agile", "scrum",
        "jira", "confluence", "postman", "swagger", "junit", "selenium", "maven", "gradle"
    ));

    @Autowired
    public ResumeParserService(OpenAIService openAIService) {
        this.openAIService = openAIService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Extract text from uploaded file (PDF, DOC, or DOCX)
     */
    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("File name is null");
        }

        String lowerFilename = filename.toLowerCase();
        
        if (lowerFilename.endsWith(".pdf")) {
            return extractTextFromPdf(file.getInputStream());
        } else if (lowerFilename.endsWith(".docx")) {
            return extractTextFromDocx(file.getInputStream());
        } else if (lowerFilename.endsWith(".doc")) {
            return extractTextFromDoc(file.getInputStream());
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload PDF, DOC, or DOCX");
        }
    }

    /**
     * Safe extract - wraps extractText and falls back to reading raw bytes as a string
     * to avoid bubbling exceptions to the controller when parsing libraries fail.
     */
    public String safeExtractText(MultipartFile file) {
        try {
            return extractText(file);
        } catch (Exception e) {
            logger.warn("Primary extractText failed, falling back to raw bytes: {}", e.getMessage());
            try {
                byte[] bytes = file.getBytes();
                if (bytes == null || bytes.length == 0) return "";
                // Attempt to decode as UTF-8; may produce garbage for binaries but avoids crash
                return new String(bytes);
            } catch (Exception ex) {
                logger.error("Fallback raw read failed: {}", ex.getMessage());
                return "";
            }
        }
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        }
    }

    private String extractTextFromDoc(InputStream inputStream) throws IOException {
        try (HWPFDocument document = new HWPFDocument(inputStream)) {
            WordExtractor extractor = new WordExtractor(document);
            return extractor.getText();
        }
    }

    /**
     * Parse extracted text into structured resume data
     */
    public ParsedResume parseResume(String text) {
        logger.info("Parsing resume text of length: {}", text.length());
        
        ParsedResume resume = new ParsedResume();
        
        // Extract personal information
        resume.setFullName(extractName(text));
        resume.setEmail(extractEmail(text));
        resume.setPhone(extractPhone(text));
        resume.setLocation(extractLocation(text));
        resume.setLinkedin(extractLinkedIn(text));
        resume.setGithub(extractGitHub(text));
        resume.setPortfolio(extractPortfolio(text));
        
        // Extract sections
        resume.setSummary(extractSummary(text));
        resume.setSkills(extractSkills(text));
        resume.setExperience(extractExperience(text));
        resume.setEducation(extractEducation(text));
        resume.setProjects(extractProjects(text));
        resume.setCertifications(extractCertifications(text));
        
        return resume;
    }

    /**
     * Use AI to enhance parsing accuracy (optional, fallback to rule-based)
     */
    @SuppressWarnings("unchecked")
    public ParsedResume parseResumeWithAI(String text) {
        try {
            logger.info("Starting AI-powered resume parsing...");
            
            // Call OpenAI to parse the resume
            Map<String, Object> aiResult = openAIService.parseResumeWithAI(text);
            
            if (aiResult != null && !aiResult.isEmpty()) {
                ParsedResume resume = new ParsedResume();
                
                // Extract basic info
                resume.setFullName(getStringValue(aiResult, "fullName"));
                resume.setEmail(getStringValue(aiResult, "email"));
                resume.setPhone(getStringValue(aiResult, "phone"));
                resume.setLocation(getStringValue(aiResult, "location"));
                resume.setLinkedin(getStringValue(aiResult, "linkedin"));
                resume.setGithub(getStringValue(aiResult, "github"));
                resume.setPortfolio(getStringValue(aiResult, "portfolio"));
                resume.setSummary(getStringValue(aiResult, "summary"));
                
                // Extract skills (can be object or array)
                Object skillsObj = aiResult.get("skills");
                if (skillsObj instanceof Map) {
                    Map<String, Object> skillsMap = (Map<String, Object>) skillsObj;
                    List<String> allSkills = new ArrayList<>();
                    
                    // Add skills from all categories
                    addSkillsFromList(allSkills, skillsMap.get("languages"));
                    addSkillsFromList(allSkills, skillsMap.get("libraries"));
                    addSkillsFromList(allSkills, skillsMap.get("webTechnologies"));
                    addSkillsFromList(allSkills, skillsMap.get("databases"));
                    addSkillsFromList(allSkills, skillsMap.get("tools"));
                    addSkillsFromList(allSkills, skillsMap.get("other"));
                    
                    resume.setSkills(allSkills);
                    resume.setSkillsMap(skillsMap); // Store categorized skills
                } else if (skillsObj instanceof List) {
                    resume.setSkills((List<String>) skillsObj);
                }
                
                // Extract education
                Object educationObj = aiResult.get("education");
                if (educationObj instanceof List) {
                    List<Map<String, String>> educationList = new ArrayList<>();
                    for (Object edu : (List<?>) educationObj) {
                        if (edu instanceof Map) {
                            Map<String, String> eduMap = new HashMap<>();
                            Map<?, ?> eduObj = (Map<?, ?>) edu;
                            eduMap.put("institution", getMapValue(eduObj, "institution"));
                            eduMap.put("degree", getMapValue(eduObj, "degree"));
                            eduMap.put("field", getMapValue(eduObj, "field"));
                            eduMap.put("grade", getMapValue(eduObj, "grade"));
                            eduMap.put("startDate", getMapValue(eduObj, "startDate"));
                            eduMap.put("endDate", getMapValue(eduObj, "endDate"));
                            eduMap.put("location", getMapValue(eduObj, "location"));
                            educationList.add(eduMap);
                        }
                    }
                    resume.setEducation(educationList);
                }
                
                // Extract experience
                Object experienceObj = aiResult.get("experience");
                if (experienceObj instanceof List) {
                    List<Map<String, String>> experienceList = new ArrayList<>();
                    for (Object exp : (List<?>) experienceObj) {
                        if (exp instanceof Map) {
                            Map<String, String> expMap = new HashMap<>();
                            Map<?, ?> expObj = (Map<?, ?>) exp;
                            expMap.put("company", getMapValue(expObj, "company"));
                            expMap.put("position", getMapValue(expObj, "position"));
                            expMap.put("startDate", getMapValue(expObj, "startDate"));
                            expMap.put("endDate", getMapValue(expObj, "endDate"));
                            expMap.put("location", getMapValue(expObj, "location"));
                            expMap.put("description", getMapValue(expObj, "description"));
                            experienceList.add(expMap);
                        }
                    }
                    resume.setExperience(experienceList);
                }
                
                // Extract projects
                Object projectsObj = aiResult.get("projects");
                if (projectsObj instanceof List) {
                    List<Map<String, String>> projectsList = new ArrayList<>();
                    for (Object proj : (List<?>) projectsObj) {
                        if (proj instanceof Map) {
                            Map<String, String> projMap = new HashMap<>();
                            Map<?, ?> projObj = (Map<?, ?>) proj;
                            projMap.put("name", getMapValue(projObj, "name"));
                            projMap.put("description", getMapValue(projObj, "description"));
                            projMap.put("technologies", getMapValue(projObj, "technologies"));
                            projMap.put("liveLink", getMapValue(projObj, "liveLink"));
                            projMap.put("githubLink", getMapValue(projObj, "githubLink"));
                            projectsList.add(projMap);
                        }
                    }
                    resume.setProjects(projectsList);
                }
                
                // Extract certifications
                Object certsObj = aiResult.get("certifications");
                if (certsObj instanceof List) {
                    List<Map<String, String>> certsList = new ArrayList<>();
                    for (Object cert : (List<?>) certsObj) {
                        if (cert instanceof Map) {
                            Map<String, String> certMap = new HashMap<>();
                            Map<?, ?> certObj = (Map<?, ?>) cert;
                            certMap.put("name", getMapValue(certObj, "name"));
                            certMap.put("issuer", getMapValue(certObj, "issuer"));
                            certMap.put("date", getMapValue(certObj, "date"));
                            certsList.add(certMap);
                        }
                    }
                    resume.setCertifications(certsList);
                }
                
                // Extract coding profiles
                Object codingProfilesObj = aiResult.get("codingProfiles");
                if (codingProfilesObj instanceof Map) {
                    Map<String, String> profilesMap = new HashMap<>();
                    Map<?, ?> profiles = (Map<?, ?>) codingProfilesObj;
                    for (Map.Entry<?, ?> entry : profiles.entrySet()) {
                        String value = String.valueOf(entry.getValue());
                        if (value != null && !value.isEmpty() && !value.equals("null")) {
                            profilesMap.put(String.valueOf(entry.getKey()), value);
                        }
                    }
                    resume.setCodingProfiles(profilesMap);
                }
                
                // Extract hobbies
                Object hobbiesObj = aiResult.get("hobbies");
                if (hobbiesObj instanceof List) {
                    List<String> hobbiesList = new ArrayList<>();
                    for (Object hobby : (List<?>) hobbiesObj) {
                        String h = String.valueOf(hobby);
                        if (h != null && !h.isEmpty() && !h.equals("null")) {
                            hobbiesList.add(h);
                        }
                    }
                    resume.setHobbies(hobbiesList);
                }
                
                // Extract languages (spoken)
                Object languagesObj = aiResult.get("languages");
                if (languagesObj instanceof List) {
                    List<Map<String, String>> languagesList = new ArrayList<>();
                    for (Object lang : (List<?>) languagesObj) {
                        if (lang instanceof Map) {
                            Map<String, String> langMap = new HashMap<>();
                            Map<?, ?> langObj = (Map<?, ?>) lang;
                            langMap.put("language", getMapValue(langObj, "language"));
                            langMap.put("proficiency", getMapValue(langObj, "proficiency"));
                            languagesList.add(langMap);
                        }
                    }
                    resume.setLanguages(languagesList);
                }
                
                // Extract achievements
                Object achievementsObj = aiResult.get("achievements");
                if (achievementsObj instanceof List) {
                    List<String> achievementsList = new ArrayList<>();
                    for (Object ach : (List<?>) achievementsObj) {
                        String a = String.valueOf(ach);
                        if (a != null && !a.isEmpty() && !a.equals("null")) {
                            achievementsList.add(a);
                        }
                    }
                    resume.setAchievements(achievementsList);
                }
                
                logger.info("AI parsing successful - Name: {}, Skills: {}", 
                    resume.getFullName(), resume.getSkills().size());
                return resume;
            }
            
            // Fallback to rule-based parsing if AI returns empty
            logger.warn("AI returned empty result, falling back to rule-based parsing");
            return parseResume(text);
        } catch (Exception e) {
            logger.error("AI parsing failed, falling back to rule-based: {}", e.getMessage());
            return parseResume(text);
        }
    }

    private String getStringValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null || "null".equals(String.valueOf(value))) {
            return "";
        }
        return String.valueOf(value);
    }

    private void addSkillsFromList(List<String> allSkills, Object skillsSource) {
        if (skillsSource instanceof List) {
            for (Object skill : (List<?>) skillsSource) {
                String s = String.valueOf(skill);
                if (s != null && !s.isEmpty() && !s.equals("null") && !allSkills.contains(s)) {
                    allSkills.add(s);
                }
            }
        }
    }

    private String getMapValue(Map<?, ?> map, String key) {
        Object value = map.get(key);
        if (value == null || "null".equals(String.valueOf(value))) {
            return "";
        }
        return String.valueOf(value);
    }

    // ==================== EXTRACTION METHODS ====================

    private String extractName(String text) {
        // First line is usually the name
        String[] lines = text.split("\\n");
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && line.length() > 2 && line.length() < 60) {
                // Skip lines that look like contact info
                if (!line.contains("@") && !line.matches(".*\\d{10,}.*") 
                    && !line.toLowerCase().contains("resume") 
                    && !line.toLowerCase().contains("curriculum")) {
                    // Check if it looks like a name (2-4 words, no special chars)
                    if (line.matches("^[A-Za-z\\s.'-]+$") && line.split("\\s+").length <= 5) {
                        return line;
                    }
                }
            }
        }
        return "";
    }

    private String extractEmail(String text) {
        Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = emailPattern.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return "";
    }

    private String extractPhone(String text) {
        // Match various phone formats
        Pattern phonePattern = Pattern.compile(
            "(\\+?\\d{1,3}[-.\\s]?)?" +  // Country code
            "(\\(\\d{1,4}\\)|\\d{1,4})[-.\\s]?" +  // Area code
            "\\d{1,4}[-.\\s]?" +  // First group
            "\\d{1,4}[-.\\s]?" +  // Second group
            "\\d{1,9}"  // Last group
        );
        Matcher matcher = phonePattern.matcher(text);
        if (matcher.find()) {
            return matcher.group().replaceAll("[^\\d+]", " ").trim().replaceAll("\\s+", " ");
        }
        return "";
    }

    private String extractLocation(String text) {
        // Look for location patterns (City, State/Country)
        String[] lines = text.split("\\n");
        for (String line : lines) {
            line = line.trim();
            // Common location patterns
            if (line.matches(".*[A-Z][a-z]+,\\s*[A-Z][A-Za-z\\s]+.*") ||
                line.matches(".*[A-Z][a-z]+,\\s*[A-Z]{2}.*")) {
                // Extract just the location part
                Pattern locationPattern = Pattern.compile("[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?,\\s*[A-Z][A-Za-z\\s]+");
                Matcher matcher = locationPattern.matcher(line);
                if (matcher.find()) {
                    return matcher.group();
                }
            }
        }
        return "";
    }

    private String extractLinkedIn(String text) {
        Pattern linkedinPattern = Pattern.compile("linkedin\\.com/in/([a-zA-Z0-9-]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = linkedinPattern.matcher(text);
        if (matcher.find()) {
            return "https://linkedin.com/in/" + matcher.group(1);
        }
        return "";
    }

    private String extractGitHub(String text) {
        Pattern githubPattern = Pattern.compile("github\\.com/([a-zA-Z0-9-]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = githubPattern.matcher(text);
        if (matcher.find()) {
            return "https://github.com/" + matcher.group(1);
        }
        return "";
    }

    private String extractPortfolio(String text) {
        // Look for portfolio/website URLs
        Pattern urlPattern = Pattern.compile(
            "(https?://)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(/[a-zA-Z0-9-._~:/?#\\[\\]@!$&'()*+,;=]*)?",
            Pattern.CASE_INSENSITIVE
        );
        Matcher matcher = urlPattern.matcher(text);
        while (matcher.find()) {
            String url = matcher.group();
            // Skip common non-portfolio URLs
            if (!url.contains("linkedin") && !url.contains("github") && 
                !url.contains("gmail") && !url.contains("email")) {
                return url.startsWith("http") ? url : "https://" + url;
            }
        }
        return "";
    }

    private String extractSummary(String text) {
        String lowerText = text.toLowerCase();
        String[] summaryHeaders = {"summary", "professional summary", "objective", "about me", "profile", "about"};
        String[] nextSections = {"experience", "education", "skills", "projects", "work history", "employment"};
        
        for (String header : summaryHeaders) {
            int headerIndex = lowerText.indexOf(header);
            if (headerIndex != -1) {
                int startIndex = headerIndex + header.length();
                int endIndex = text.length();
                
                // Find the next section
                for (String nextSection : nextSections) {
                    int nextIndex = lowerText.indexOf(nextSection, startIndex);
                    if (nextIndex != -1 && nextIndex < endIndex) {
                        endIndex = nextIndex;
                    }
                }
                
                String summary = text.substring(startIndex, endIndex).trim();
                summary = summary.replaceAll("^[:\\s]+", "").trim();
                
                // Limit to reasonable summary length
                if (summary.length() > 50 && summary.length() < 1500) {
                    return cleanText(summary);
                }
            }
        }
        return "";
    }

    private List<String> extractSkills(String text) {
        Set<String> foundSkills = new LinkedHashSet<>();
        String lowerText = text.toLowerCase();
        
        // Extract skills from dedicated skills section
        String skillsSection = extractSection(text, 
            new String[]{"skills", "technical skills", "technologies", "competencies"},
            new String[]{"experience", "education", "projects", "certifications", "work"});
        
        // Check known skills against the text
        for (String skill : KNOWN_SKILLS) {
            if (lowerText.contains(skill.toLowerCase())) {
                // Capitalize properly
                foundSkills.add(capitalizeSkill(skill));
            }
        }
        
        // Also parse comma/pipe separated skills from skills section
        if (!skillsSection.isEmpty()) {
            String[] parts = skillsSection.split("[,|•\\n]");
            for (String part : parts) {
                part = part.trim().replaceAll("[^a-zA-Z0-9.#+\\s-]", "");
                if (part.length() > 1 && part.length() < 30) {
                    foundSkills.add(part);
                }
            }
        }
        
        return new ArrayList<>(foundSkills);
    }

    private List<Map<String, String>> extractExperience(String text) {
        List<Map<String, String>> experiences = new ArrayList<>();
        
        String experienceSection = extractSection(text,
            new String[]{"experience", "work experience", "employment", "work history", "professional experience"},
            new String[]{"education", "projects", "skills", "certifications", "achievements"});
        
        if (experienceSection.isEmpty()) {
            return experiences;
        }
        
        // Split by potential job entries (look for company names or dates)
        String[] entries = experienceSection.split("(?=\\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))");
        
        for (String entry : entries) {
            if (entry.trim().length() < 30) continue;
            
            Map<String, String> exp = new HashMap<>();
            String[] lines = entry.split("\\n");
            
            // First non-empty line might be company/position
            for (int i = 0; i < Math.min(3, lines.length); i++) {
                String line = lines[i].trim();
                if (!line.isEmpty()) {
                    if (exp.get("position") == null) {
                        exp.put("position", line);
                    } else if (exp.get("company") == null) {
                        exp.put("company", line);
                    }
                }
            }
            
            // Extract dates
            String dates = extractDates(entry);
            if (!dates.isEmpty()) {
                String[] dateParts = dates.split("-|–|to");
                if (dateParts.length >= 1) exp.put("startDate", dateParts[0].trim());
                if (dateParts.length >= 2) exp.put("endDate", dateParts[1].trim());
            }
            
            // Rest is description
            StringBuilder desc = new StringBuilder();
            for (int i = 2; i < lines.length; i++) {
                String line = lines[i].trim();
                if (!line.isEmpty() && !line.matches(".*\\d{4}.*")) {
                    desc.append(line).append("\n");
                }
            }
            exp.put("description", desc.toString().trim());
            
            if (exp.get("position") != null || exp.get("company") != null) {
                experiences.add(exp);
            }
        }
        
        return experiences;
    }

    private List<Map<String, String>> extractEducation(String text) {
        List<Map<String, String>> educationList = new ArrayList<>();
        
        String educationSection = extractSection(text,
            new String[]{"education", "academic", "academics", "qualifications"},
            new String[]{"experience", "skills", "projects", "certifications", "work"});
        
        if (educationSection.isEmpty()) {
            return educationList;
        }
        
        // Common degree keywords
        String[] degreeKeywords = {"bachelor", "master", "phd", "b.tech", "m.tech", "bsc", "msc", 
            "b.e", "m.e", "bca", "mca", "b.com", "m.com", "mba", "diploma", "degree"};
        
        String[] lines = educationSection.split("\\n");
        Map<String, String> currentEdu = new HashMap<>();
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            
            String lowerLine = line.toLowerCase();
            
            // Check if this is a new education entry (has degree keyword)
            boolean hasDegree = false;
            for (String keyword : degreeKeywords) {
                if (lowerLine.contains(keyword)) {
                    hasDegree = true;
                    break;
                }
            }
            
            if (hasDegree) {
                if (!currentEdu.isEmpty()) {
                    educationList.add(currentEdu);
                    currentEdu = new HashMap<>();
                }
                currentEdu.put("degree", line);
            } else if (line.matches(".*\\d{4}.*")) {
                // This line contains a date
                String dates = extractDates(line);
                if (!dates.isEmpty()) {
                    currentEdu.put("dates", dates);
                }
            } else if (currentEdu.get("institution") == null && line.length() > 5) {
                currentEdu.put("institution", line);
            } else if (currentEdu.get("field") == null && line.length() > 3) {
                currentEdu.put("field", line);
            }
        }
        
        if (!currentEdu.isEmpty()) {
            educationList.add(currentEdu);
        }
        
        return educationList;
    }

    private List<Map<String, String>> extractProjects(String text) {
        List<Map<String, String>> projects = new ArrayList<>();
        
        String projectsSection = extractSection(text,
            new String[]{"projects", "personal projects", "academic projects", "key projects"},
            new String[]{"education", "experience", "skills", "certifications", "achievements"});
        
        if (projectsSection.isEmpty()) {
            return projects;
        }
        
        // Split by bullet points, numbers, or double newlines
        String[] entries = projectsSection.split("(?=•|\\d\\.|\\n\\n)");
        
        for (String entry : entries) {
            entry = entry.trim();
            if (entry.length() < 20) continue;
            
            Map<String, String> project = new HashMap<>();
            String[] lines = entry.split("\\n");
            
            // First line is usually project name
            if (lines.length > 0) {
                String name = lines[0].replaceAll("^[•\\d.\\s]+", "").trim();
                if (name.length() > 2) {
                    project.put("name", name);
                }
            }
            
            // Rest is description
            StringBuilder desc = new StringBuilder();
            for (int i = 1; i < lines.length; i++) {
                desc.append(lines[i].trim()).append(" ");
            }
            project.put("description", desc.toString().trim());
            
            // Extract any URLs
            Pattern urlPattern = Pattern.compile("(https?://[^\\s]+)");
            Matcher matcher = urlPattern.matcher(entry);
            while (matcher.find()) {
                String url = matcher.group(1);
                if (url.contains("github")) {
                    project.put("githubLink", url);
                } else {
                    project.put("liveLink", url);
                }
            }
            
            // Extract technologies (look for common patterns)
            Pattern techPattern = Pattern.compile("(?:Tech(?:nologies)?|Stack|Built with)[:\\s]+([^\\n]+)", Pattern.CASE_INSENSITIVE);
            Matcher techMatcher = techPattern.matcher(entry);
            if (techMatcher.find()) {
                project.put("technologies", techMatcher.group(1).trim());
            }
            
            if (project.get("name") != null) {
                projects.add(project);
            }
        }
        
        return projects;
    }

    private List<Map<String, String>> extractCertifications(String text) {
        List<Map<String, String>> certifications = new ArrayList<>();
        
        String certSection = extractSection(text,
            new String[]{"certifications", "certificates", "courses", "training"},
            new String[]{"education", "experience", "skills", "projects", "achievements"});
        
        if (certSection.isEmpty()) {
            return certifications;
        }
        
        String[] lines = certSection.split("\\n");
        for (String line : lines) {
            line = line.trim().replaceAll("^[•\\-\\d.]+\\s*", "");
            if (line.length() > 10) {
                Map<String, String> cert = new HashMap<>();
                cert.put("name", line);
                
                // Try to extract issuer (often after "by" or in parentheses)
                Pattern issuerPattern = Pattern.compile("(?:by|from|-)\\s*([^,\\n]+)", Pattern.CASE_INSENSITIVE);
                Matcher matcher = issuerPattern.matcher(line);
                if (matcher.find()) {
                    cert.put("issuer", matcher.group(1).trim());
                    cert.put("name", line.substring(0, matcher.start()).trim());
                }
                
                // Extract date
                String dates = extractDates(line);
                if (!dates.isEmpty()) {
                    cert.put("date", dates);
                }
                
                certifications.add(cert);
            }
        }
        
        return certifications;
    }

    // ==================== HELPER METHODS ====================

    private String extractSection(String text, String[] sectionHeaders, String[] endHeaders) {
        String lowerText = text.toLowerCase();
        int startIndex = -1;
        int headerLength = 0;
        
        // Find section start
        for (String header : sectionHeaders) {
            int index = lowerText.indexOf(header);
            if (index != -1 && (startIndex == -1 || index < startIndex)) {
                startIndex = index;
                headerLength = header.length();
            }
        }
        
        if (startIndex == -1) {
            return "";
        }
        
        startIndex += headerLength;
        int endIndex = text.length();
        
        // Find section end
        for (String endHeader : endHeaders) {
            int index = lowerText.indexOf(endHeader, startIndex + 10);
            if (index != -1 && index < endIndex) {
                endIndex = index;
            }
        }
        
        String section = text.substring(startIndex, endIndex).trim();
        section = section.replaceAll("^[:\\s]+", "");
        
        return cleanText(section);
    }

    private String extractDates(String text) {
        // Match various date formats
        Pattern datePattern = Pattern.compile(
            "((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s*\\d{4}|\\d{1,2}/\\d{4}|\\d{4})" +
            "\\s*[-–to]+\\s*" +
            "((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s*\\d{4}|\\d{1,2}/\\d{4}|\\d{4}|Present|Current)",
            Pattern.CASE_INSENSITIVE
        );
        Matcher matcher = datePattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1) + " - " + matcher.group(2);
        }
        
        // Try single year
        Pattern yearPattern = Pattern.compile("\\b(20\\d{2})\\b");
        Matcher yearMatcher = yearPattern.matcher(text);
        if (yearMatcher.find()) {
            return yearMatcher.group(1);
        }
        
        return "";
    }

    private String capitalizeSkill(String skill) {
        // Special cases
        if (skill.equalsIgnoreCase("javascript")) return "JavaScript";
        if (skill.equalsIgnoreCase("typescript")) return "TypeScript";
        if (skill.equalsIgnoreCase("nodejs") || skill.equalsIgnoreCase("node.js")) return "Node.js";
        if (skill.equalsIgnoreCase("reactjs") || skill.equalsIgnoreCase("react.js")) return "React";
        if (skill.equalsIgnoreCase("vuejs") || skill.equalsIgnoreCase("vue.js")) return "Vue.js";
        if (skill.equalsIgnoreCase("angularjs")) return "Angular";
        if (skill.equalsIgnoreCase("mongodb")) return "MongoDB";
        if (skill.equalsIgnoreCase("mysql")) return "MySQL";
        if (skill.equalsIgnoreCase("postgresql")) return "PostgreSQL";
        if (skill.equalsIgnoreCase("graphql")) return "GraphQL";
        if (skill.equalsIgnoreCase("aws")) return "AWS";
        if (skill.equalsIgnoreCase("gcp")) return "GCP";
        if (skill.equalsIgnoreCase("ci/cd")) return "CI/CD";
        if (skill.equalsIgnoreCase("html") || skill.equalsIgnoreCase("html5")) return "HTML";
        if (skill.equalsIgnoreCase("css") || skill.equalsIgnoreCase("css3")) return "CSS";
        if (skill.equalsIgnoreCase("sql")) return "SQL";
        
        // Default: capitalize first letter of each word
        String[] words = skill.split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                      .append(word.substring(1).toLowerCase())
                      .append(" ");
            }
        }
        return result.toString().trim();
    }

    private String cleanText(String text) {
        return text
            .replaceAll("\\r\\n", "\n")
            .replaceAll("\\r", "\n")
            .replaceAll("\\n{3,}", "\n\n")
            .replaceAll("[ \\t]+", " ")
            .trim();
    }

    // ==================== PARSED RESUME DTO ====================

    public static class ParsedResume {
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String portfolio;
        private String summary;
        private List<String> skills;
        private Map<String, Object> skillsMap; // Categorized skills
        private List<Map<String, String>> experience;
        private List<Map<String, String>> education;
        private List<Map<String, String>> projects;
        private List<Map<String, String>> certifications;
        private Map<String, String> codingProfiles;
        private List<String> hobbies;
        private List<Map<String, String>> languages; // Spoken languages
        private List<String> achievements;

        public ParsedResume() {
            this.skills = new ArrayList<>();
            this.skillsMap = new HashMap<>();
            this.experience = new ArrayList<>();
            this.education = new ArrayList<>();
            this.projects = new ArrayList<>();
            this.certifications = new ArrayList<>();
            this.codingProfiles = new HashMap<>();
            this.hobbies = new ArrayList<>();
            this.languages = new ArrayList<>();
            this.achievements = new ArrayList<>();
        }

        // Getters and Setters
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getLinkedin() { return linkedin; }
        public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

        public String getGithub() { return github; }
        public void setGithub(String github) { this.github = github; }

        public String getPortfolio() { return portfolio; }
        public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }

        public Map<String, Object> getSkillsMap() { return skillsMap; }
        public void setSkillsMap(Map<String, Object> skillsMap) { this.skillsMap = skillsMap; }

        public List<Map<String, String>> getExperience() { return experience; }
        public void setExperience(List<Map<String, String>> experience) { this.experience = experience; }

        public List<Map<String, String>> getEducation() { return education; }
        public void setEducation(List<Map<String, String>> education) { this.education = education; }

        public List<Map<String, String>> getProjects() { return projects; }
        public void setProjects(List<Map<String, String>> projects) { this.projects = projects; }

        public List<Map<String, String>> getCertifications() { return certifications; }
        public void setCertifications(List<Map<String, String>> certifications) { this.certifications = certifications; }

        public Map<String, String> getCodingProfiles() { return codingProfiles; }
        public void setCodingProfiles(Map<String, String> codingProfiles) { this.codingProfiles = codingProfiles; }

        public List<String> getHobbies() { return hobbies; }
        public void setHobbies(List<String> hobbies) { this.hobbies = hobbies; }

        public List<Map<String, String>> getLanguages() { return languages; }
        public void setLanguages(List<Map<String, String>> languages) { this.languages = languages; }

        public List<String> getAchievements() { return achievements; }
        public void setAchievements(List<String> achievements) { this.achievements = achievements; }
    }
}
