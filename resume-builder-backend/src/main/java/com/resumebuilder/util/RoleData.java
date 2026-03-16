package com.resumebuilder.util;

import java.util.*;

public class RoleData {

    private static final Map<String, List<String>> ROLE_SKILLS = new HashMap<>();
    private static final Map<String, List<String>> ROLE_KEYWORDS = new HashMap<>();

    static {
        // Software Engineer / Developer
        ROLE_SKILLS.put("software_engineer", Arrays.asList(
            "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
            "Spring Boot", "Node.js", "React", "Angular", "Vue.js", "Django", "Flask",
            "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD",
            "Git", "REST API", "GraphQL", "Microservices", "TDD", "Agile"
        ));
        ROLE_KEYWORDS.put("software_engineer", Arrays.asList(
            "developed", "implemented", "designed", "architected", "optimized",
            "scalable", "performance", "debugging", "code review", "unit testing",
            "integration", "deployment", "version control", "software development lifecycle"
        ));

        // Data Scientist
        ROLE_SKILLS.put("data_scientist", Arrays.asList(
            "Python", "R", "SQL", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
            "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "Power BI",
            "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
            "Statistics", "A/B Testing", "Hadoop", "Spark", "AWS SageMaker"
        ));
        ROLE_KEYWORDS.put("data_scientist", Arrays.asList(
            "analyzed", "predicted", "modeled", "visualized", "insights",
            "algorithms", "statistical analysis", "feature engineering", "data pipeline",
            "hypothesis testing", "regression", "classification", "clustering"
        ));

        // Frontend Developer
        ROLE_SKILLS.put("frontend_developer", Arrays.asList(
            "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
            "Redux", "Next.js", "Webpack", "Babel", "SASS", "LESS", "Tailwind CSS",
            "Bootstrap", "Material UI", "Responsive Design", "Cross-browser Compatibility",
            "Jest", "Cypress", "Figma", "Adobe XD", "Web Accessibility", "SEO"
        ));
        ROLE_KEYWORDS.put("frontend_developer", Arrays.asList(
            "responsive", "user interface", "UI/UX", "pixel-perfect", "interactive",
            "animations", "performance optimization", "component-based", "state management",
            "cross-browser", "mobile-first", "accessibility", "semantic HTML"
        ));

        // Backend Developer
        ROLE_SKILLS.put("backend_developer", Arrays.asList(
            "Java", "Python", "Node.js", "Go", "C#", ".NET", "PHP", "Ruby",
            "Spring Boot", "Django", "Express.js", "FastAPI", "Laravel",
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
            "REST API", "GraphQL", "gRPC", "Message Queues", "RabbitMQ", "Kafka",
            "Docker", "Kubernetes", "AWS", "Microservices", "API Design"
        ));
        ROLE_KEYWORDS.put("backend_developer", Arrays.asList(
            "API development", "database design", "server-side", "authentication",
            "authorization", "caching", "load balancing", "scalability", "security",
            "data modeling", "query optimization", "system architecture"
        ));

        // DevOps Engineer
        ROLE_SKILLS.put("devops_engineer", Arrays.asList(
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible",
            "Jenkins", "GitLab CI", "GitHub Actions", "CircleCI", "ArgoCD",
            "Linux", "Bash", "Python", "Prometheus", "Grafana", "ELK Stack",
            "Nginx", "Apache", "Helm", "Istio", "Vault", "Infrastructure as Code"
        ));
        ROLE_KEYWORDS.put("devops_engineer", Arrays.asList(
            "CI/CD", "automation", "deployment", "infrastructure", "monitoring",
            "containerization", "orchestration", "cloud architecture", "reliability",
            "incident response", "SRE", "configuration management", "security scanning"
        ));

        // Full Stack Developer
        ROLE_SKILLS.put("fullstack_developer", Arrays.asList(
            "JavaScript", "TypeScript", "Python", "Java", "Node.js",
            "React", "Angular", "Vue.js", "Next.js", "Express.js", "Spring Boot",
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "REST API",
            "Docker", "AWS", "Git", "CI/CD", "Agile", "TDD"
        ));
        ROLE_KEYWORDS.put("fullstack_developer", Arrays.asList(
            "end-to-end", "full stack", "frontend", "backend", "database",
            "responsive design", "API integration", "deployment", "scalable applications",
            "user experience", "system design", "cross-functional"
        ));

        // Product Manager
        ROLE_SKILLS.put("product_manager", Arrays.asList(
            "Product Strategy", "Roadmap Planning", "Agile", "Scrum", "Kanban",
            "JIRA", "Confluence", "Asana", "Trello", "User Research",
            "A/B Testing", "Data Analysis", "SQL", "Tableau", "Google Analytics",
            "Wireframing", "Figma", "Market Research", "Competitive Analysis"
        ));
        ROLE_KEYWORDS.put("product_manager", Arrays.asList(
            "product vision", "stakeholder management", "prioritization", "metrics",
            "user stories", "acceptance criteria", "sprint planning", "backlog",
            "go-to-market", "KPIs", "OKRs", "customer feedback", "feature development"
        ));

        // UI/UX Designer
        ROLE_SKILLS.put("ui_ux_designer", Arrays.asList(
            "Figma", "Sketch", "Adobe XD", "InVision", "Photoshop", "Illustrator",
            "Wireframing", "Prototyping", "User Research", "Usability Testing",
            "Information Architecture", "Design Systems", "Typography", "Color Theory",
            "HTML", "CSS", "Responsive Design", "Accessibility", "Interaction Design"
        ));
        ROLE_KEYWORDS.put("ui_ux_designer", Arrays.asList(
            "user-centered", "design thinking", "persona", "user journey", "empathy",
            "visual design", "mockups", "high-fidelity", "low-fidelity", "iteration",
            "heuristic evaluation", "A/B testing", "conversion optimization"
        ));

        // Mobile Developer
        ROLE_SKILLS.put("mobile_developer", Arrays.asList(
            "iOS", "Android", "Swift", "Kotlin", "Java", "Objective-C",
            "React Native", "Flutter", "Xamarin", "SwiftUI", "Jetpack Compose",
            "Firebase", "SQLite", "Core Data", "Room", "REST API", "GraphQL",
            "App Store", "Google Play", "CI/CD", "Unit Testing", "UI Testing"
        ));
        ROLE_KEYWORDS.put("mobile_developer", Arrays.asList(
            "native development", "cross-platform", "mobile UI", "app performance",
            "push notifications", "offline storage", "app security", "responsive",
            "user engagement", "app lifecycle", "gesture handling"
        ));

        // Cloud Architect
        ROLE_SKILLS.put("cloud_architect", Arrays.asList(
            "AWS", "Azure", "GCP", "Terraform", "CloudFormation", "ARM Templates",
            "Kubernetes", "Docker", "Serverless", "Lambda", "Cloud Functions",
            "VPC", "IAM", "Security Groups", "Load Balancers", "Auto Scaling",
            "S3", "Blob Storage", "Cloud SQL", "DynamoDB", "BigQuery"
        ));
        ROLE_KEYWORDS.put("cloud_architect", Arrays.asList(
            "cloud architecture", "migration", "cost optimization", "high availability",
            "disaster recovery", "multi-cloud", "hybrid cloud", "security compliance",
            "infrastructure design", "scalability", "performance tuning"
        ));

        // QA Engineer
        ROLE_SKILLS.put("qa_engineer", Arrays.asList(
            "Selenium", "Cypress", "Jest", "JUnit", "TestNG", "Playwright",
            "Postman", "REST Assured", "JIRA", "TestRail", "Zephyr",
            "Python", "Java", "JavaScript", "SQL", "Git", "Jenkins",
            "Performance Testing", "JMeter", "LoadRunner", "Security Testing"
        ));
        ROLE_KEYWORDS.put("qa_engineer", Arrays.asList(
            "test automation", "manual testing", "regression testing", "test cases",
            "bug tracking", "quality assurance", "test planning", "test strategy",
            "API testing", "integration testing", "end-to-end testing", "defect analysis"
        ));

        // Machine Learning Engineer
        ROLE_SKILLS.put("ml_engineer", Arrays.asList(
            "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "MLflow",
            "Pandas", "NumPy", "SQL", "Spark", "Hadoop", "Airflow",
            "Docker", "Kubernetes", "AWS SageMaker", "Azure ML", "GCP AI Platform",
            "Deep Learning", "NLP", "Computer Vision", "MLOps", "Feature Engineering"
        ));
        ROLE_KEYWORDS.put("ml_engineer", Arrays.asList(
            "model training", "model deployment", "feature engineering", "hyperparameter tuning",
            "production ML", "model monitoring", "data pipeline", "inference optimization",
            "neural networks", "transfer learning", "model versioning"
        ));
    }

    public static List<String> getSkillsForRole(String role) {
        String normalizedRole = normalizeRole(role);
        return ROLE_SKILLS.getOrDefault(normalizedRole, getDefaultSkills());
    }

    public static List<String> getKeywordsForRole(String role) {
        String normalizedRole = normalizeRole(role);
        return ROLE_KEYWORDS.getOrDefault(normalizedRole, getDefaultKeywords());
    }

    public static Set<String> getAllRoles() {
        return ROLE_SKILLS.keySet();
    }

    private static String normalizeRole(String role) {
        if (role == null) return "software_engineer";
        
        String normalized = role.toLowerCase()
            .replaceAll("[^a-z0-9]", "_")
            .replaceAll("_+", "_")
            .replaceAll("^_|_$", "");

        // Map common variations to standard keys
        if (normalized.contains("software") || normalized.contains("developer") && !normalized.contains("frontend") 
            && !normalized.contains("backend") && !normalized.contains("full") && !normalized.contains("mobile")) {
            return "software_engineer";
        }
        if (normalized.contains("data") && normalized.contains("scien")) return "data_scientist";
        if (normalized.contains("frontend") || normalized.contains("front_end")) return "frontend_developer";
        if (normalized.contains("backend") || normalized.contains("back_end")) return "backend_developer";
        if (normalized.contains("devops") || normalized.contains("sre") || normalized.contains("reliability")) return "devops_engineer";
        if (normalized.contains("full") && normalized.contains("stack")) return "fullstack_developer";
        if (normalized.contains("product") && normalized.contains("manag")) return "product_manager";
        if (normalized.contains("ui") || normalized.contains("ux") || normalized.contains("design")) return "ui_ux_designer";
        if (normalized.contains("mobile") || normalized.contains("ios") || normalized.contains("android")) return "mobile_developer";
        if (normalized.contains("cloud") && normalized.contains("arch")) return "cloud_architect";
        if (normalized.contains("qa") || normalized.contains("quality") || normalized.contains("test")) return "qa_engineer";
        if (normalized.contains("ml") || normalized.contains("machine") && normalized.contains("learn")) return "ml_engineer";

        return ROLE_SKILLS.containsKey(normalized) ? normalized : "software_engineer";
    }

    private static List<String> getDefaultSkills() {
        return Arrays.asList(
            "Communication", "Problem Solving", "Teamwork", "Time Management",
            "Critical Thinking", "Adaptability", "Leadership", "Attention to Detail"
        );
    }

    private static List<String> getDefaultKeywords() {
        return Arrays.asList(
            "achieved", "improved", "managed", "developed", "created",
            "implemented", "led", "collaborated", "analyzed", "delivered"
        );
    }
}
