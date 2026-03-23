// ===============================
// CUSTOM TEMPLATES FROM SCREENSHOTS
// ===============================

const toTextList = (items = []) =>
  (items || []).map((item) => (typeof item === 'string' ? item : item?.name || item?.language || '')).filter(Boolean).join(', ');

const toBulletLines = (text = '') =>
  String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

// 1. Data Scientist / Junior Developer (screenshot 1)
export const DataScientistTemplate = ({ data }) => (
  <div className="resume-template basic-template basic-template-a">
    <header className="basic-header center">
      <h1 className="basic-name">{data.personal?.fullName || 'Your Name'}</h1>
      <div className="basic-contact-line">
        {[data.personal?.phone, data.personal?.email, data.personal?.location, data.codingProfiles?.linkedin]
          .filter(Boolean)
          .join(' | ')}
      </div>
    </header>

    {data.personal?.summary && (
      <section className="basic-section">
        <h2 className="basic-section-title">Summary</h2>
        <p className="basic-text">{data.personal.summary}</p>
      </section>
    )}

    {data.education?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="basic-item">
            <div className="basic-item-row">
              <strong>{edu.institution}</strong>
              <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            <div className="basic-text">{edu.degree}{edu.field ? ` | ${edu.field}` : ''}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </section>
    )}

    {data.skills?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Skills</h2>
        <p className="basic-text">{toTextList(data.skills)}</p>
      </section>
    )}

    {data.projects?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Projects</h2>
        {data.projects.map((project, i) => (
          <div key={i} className="basic-item">
            <strong>{project.name}</strong>
            {project.description && (
              <ul className="basic-list">
                {toBulletLines(project.description).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            )}
            {project.technologies && <div className="basic-text"><strong>Technologies:</strong> {project.technologies}</div>}
          </div>
        ))}
      </section>
    )}

    {data.certifications?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Certifications</h2>
        <ul className="basic-list">
          {data.certifications.map((cert, i) => (
            <li key={i}>{cert.name}{cert.issuer ? ` - ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}</li>
          ))}
        </ul>
      </section>
    )}

    {data.codingProfiles && (
      <section className="basic-section">
        <h2 className="basic-section-title">Coding Profiles</h2>
        <p className="basic-text">
          {[data.codingProfiles.leetcode, data.codingProfiles.codechef, data.codingProfiles.codeforces, data.codingProfiles.hackerrank]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE: Classic Academic Table (screenshot style)
// =====================================================
export const ClassicAcademicTemplate = ({ data }) => (
  <div className="resume-template basic-template basic-template-b">
    <header className="basic-header">
      <h1 className="basic-name uppercase">{(data.personal?.fullName || 'Your Name').toUpperCase()}</h1>
      <div className="basic-contact-line center">
        {[data.personal?.location, data.personal?.email, data.personal?.phone].filter(Boolean).join(' | ')}
      </div>
    </header>

    {data.personal?.summary && (
      <section className="basic-section">
        <h2 className="basic-section-title">Summary</h2>
        <p className="basic-text">{data.personal.summary}</p>
      </section>
    )}

    {data.education?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="basic-item compact">
            <div className="basic-item-row">
              <strong>{edu.institution}</strong>
              <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            <div className="basic-text">{edu.degree}{edu.field ? ` (${edu.field})` : ''}{edu.gpa ? ` | ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </section>
    )}

    {data.projects?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Projects</h2>
        {data.projects.map((project, i) => (
          <div key={i} className="basic-item compact">
            <strong>{project.name}</strong>
            {project.description && (
              <ul className="basic-list">
                {toBulletLines(project.description).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            )}
            {project.technologies && <div className="basic-text">Tools Used: {project.technologies}</div>}
          </div>
        ))}
      </section>
    )}

    {data.certifications?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Certifications</h2>
        <ul className="basic-list">
          {data.certifications.map((cert, i) => (
            <li key={i}>{cert.name}{cert.issuer ? ` - ${cert.issuer}` : ''}</li>
          ))}
        </ul>
      </section>
    )}

    {data.skills?.length > 0 && (
      <section className="basic-section">
        <h2 className="basic-section-title">Skills</h2>
        <p className="basic-text"><strong>Programming:</strong> {toTextList(data.skills)}</p>
      </section>
    )}

    {data.codingProfiles && (
      <section className="basic-section">
        <h2 className="basic-section-title">Coding Profiles</h2>
        <p className="basic-text">
          {[data.codingProfiles.leetcode, data.codingProfiles.codechef, data.codingProfiles.codeforces, data.codingProfiles.hackerrank]
            .filter(Boolean)
            .join(', ')}
        </p>
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE: Three Column Showcase (thumbnail style)
// =====================================================
export const ThreeColumnTemplate = ({ data }) => (
  <div className="resume-template basic-template basic-template-c">
    <header className="basic-header">
      <h1 className="basic-name">{(data.personal?.fullName || 'Your Name').toUpperCase()}</h1>
      <div className="basic-contact-line">
        {[data.personal?.email, data.personal?.phone, data.personal?.location].filter(Boolean).join(' | ')}
      </div>
    </header>

    <div className="basic-two-col">
      <div>
        {data.personal?.summary && (
          <section className="basic-section">
            <h2 className="basic-section-title">Profile</h2>
            <p className="basic-text">{data.personal.summary}</p>
          </section>
        )}

        {data.projects?.length > 0 && (
          <section className="basic-section">
            <h2 className="basic-section-title">Projects</h2>
            {data.projects.map((project, i) => (
              <div key={i} className="basic-item">
                <strong>{project.name}</strong>
                <div className="basic-text">{project.description}</div>
                {project.technologies && <div className="basic-text">{project.technologies}</div>}
              </div>
            ))}
          </section>
        )}

        {data.codingProfiles && (
          <section className="basic-section">
            <h2 className="basic-section-title">Coding Profiles</h2>
            <ul className="basic-list">
              {[data.codingProfiles.leetcode, data.codingProfiles.codechef, data.codingProfiles.codeforces, data.codingProfiles.hackerrank]
                .filter(Boolean)
                .map((profile, i) => (
                  <li key={i}>{profile}</li>
                ))}
            </ul>
          </section>
        )}
      </div>

      <div>
        {data.education?.length > 0 && (
          <section className="basic-section">
            <h2 className="basic-section-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="basic-item">
                <strong>{edu.degree}, {edu.institution}</strong>
                <div className="basic-text">{formatDateRange(edu.startDate, edu.endDate)}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        {data.skills?.length > 0 && (
          <section className="basic-section">
            <h2 className="basic-section-title">Skills</h2>
            <p className="basic-text">{toTextList(data.skills)}</p>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section className="basic-section">
            <h2 className="basic-section-title">Certificates</h2>
            <ul className="basic-list">
              {data.certifications.map((cert, i) => (
                <li key={i}>{cert.name}{cert.issuer ? ` - ${cert.issuer}` : ''}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>
);

// =====================================================
// TEMPLATE: Traditional Clean
// =====================================================
export const TraditionalTemplate = ({ data }) => (
  <div className="resume-template traditional">
    <header className="rt-header traditional-header">
      <h1 className="rt-name">{data.personal?.fullName}</h1>
      <p className="rt-title">{data.personal?.title}</p>
      <div className="rt-contact">{data.personal?.email} • {data.personal?.phone} • {data.personal?.location}</div>
    </header>
    <section className="rt-section">
      <h2 className="rt-section-title">Profile</h2>
      <p>{data.personal?.summary}</p>
    </section>
    <section className="rt-section">
      <h2 className="rt-section-title">Experience</h2>
      {(data.experience||[]).map((exp,i)=>(
        <div key={i} className="rt-item">
          <div className="rt-item-header"><h3>{exp.position || exp.jobTitle}</h3><span>{formatDateRange(exp.startDate, exp.endDate)}</span></div>
          <p>{exp.company} • {exp.location}</p>
          {exp.description && <p>{exp.description}</p>}
        </div>
      ))}
    </section>
  </div>
);
import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Award, ExternalLink } from 'lucide-react';
import './ResumeTemplates.css';

// Helper function to format date range
const formatDateRange = (start, end) => {
  if (!start) return '';
  return end ? `${start} - ${end}` : `${start} - Present`;
};

// =====================================================
// TEMPLATE 1: Modern Professional
// =====================================================
export const ModernTemplate = ({ data }) => (
  <div className="resume-template modern">
    <header className="rt-header modern-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title || 'Professional'}</p>
      <div className="rt-contact">
        {data.personal?.email && <span><Mail size={14} />{data.personal.email}</span>}
        {data.personal?.phone && <span><Phone size={14} />{data.personal.phone}</span>}
        {data.personal?.location && <span><MapPin size={14} />{data.personal.location}</span>}
        {data.personal?.linkedin && <span><Linkedin size={14} />{data.personal.linkedin}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section">
        <h2 className="rt-section-title">Professional Summary</h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item">
            <div className="rt-item-header">
              <div>
                <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                <p className="rt-item-subtitle">{exp.company} • {exp.location}</p>
              </div>
              <span className="rt-item-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            {exp.highlights?.length > 0 && (
              <ul className="rt-item-list">
                {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item">
            <div className="rt-item-header">
              <div>
                <h3 className="rt-item-title">{edu.degree}</h3>
                <p className="rt-item-subtitle">{edu.institution} • {edu.location}</p>
              </div>
              <span className="rt-item-date">{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            {edu.gpa && <p className="rt-item-desc">GPA: {edu.gpa}</p>}
            {edu.field && <p className="rt-item-desc">Field: {edu.field}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Skills</h2>
        <p className="rt-plain-list">
          {data.skills.map((skill) => (typeof skill === 'string' ? skill : skill.name)).join(', ')}
        </p>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            <p className="rt-item-desc">{proj.description}</p>
            {proj.technologies && <p className="rt-tech">Tech: {proj.technologies}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item">
            <div className="rt-item-header">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.date && <span className="rt-item-date">{cert.date}</span>}
            </div>
            {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Languages</h2>
        <p className="rt-plain-list">
          {data.languages.map((lang) => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`).join(', ')}
        </p>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title">Activities</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 2: Creative Designer
// =====================================================
export const CreativeTemplate = ({ data }) => (
  <div className="resume-template creative">
    <header className="rt-header creative-header">
      <div className="creative-avatar">
        {(data.personal?.fullName || data.personal?.firstName || 'U').charAt(0).toUpperCase()}
      </div>
      <div className="creative-info">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title">{data.personal?.title || 'Creative Professional'}</p>
      </div>
      <div className="creative-contact">
        {data.personal?.email && <span><Mail size={14} />{data.personal.email}</span>}
        {data.personal?.phone && <span><Phone size={14} />{data.personal.phone}</span>}
        {data.personal?.location && <span><MapPin size={14} />{data.personal.location}</span>}
      </div>
    </header>
    
    <div className="creative-body">
      {data.personal?.summary && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">📝</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">About Me</h2>
            <p className="rt-summary">{data.personal.summary}</p>
          </div>
        </section>
      )}
      
      {data.experience?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">💼</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Work Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="rt-item creative-item">
                <div className="creative-timeline"></div>
                <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                <p className="rt-item-subtitle">{exp.company} | {formatDateRange(exp.startDate, exp.endDate)}</p>
                {exp.description && <p className="rt-item-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.skills?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">🎯</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Skills & Expertise</h2>
            <p className="rt-plain-list">
              {data.skills.map((skill) => (typeof skill === 'string' ? skill : skill.name)).join(', ')}
            </p>
          </div>
        </section>
      )}
      
      {data.education?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">🎓</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="rt-item">
                <h3 className="rt-item-title">{edu.degree}</h3>
                <p className="rt-item-subtitle">{edu.institution} | {formatDateRange(edu.startDate, edu.endDate)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.projects?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">💡</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="rt-item">
                <h3 className="rt-item-title">{proj.name}</h3>
                <p className="rt-item-desc">{proj.description}</p>
                {proj.technologies && <p className="rt-tech">Tech: {proj.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.certifications?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">🏆</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Certifications</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="rt-item">
                <h3 className="rt-item-title">{cert.name}</h3>
                {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.languages?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">🌐</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Languages</h2>
            <p className="rt-plain-list">
              {data.languages.map((lang) => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`).join(', ')}
            </p>
          </div>
        </section>
      )}
      
      {data.activities?.length > 0 && (
        <section className="rt-section creative-section">
          <div className="creative-section-icon">⚡</div>
          <div className="creative-section-content">
            <h2 className="rt-section-title">Activities</h2>
            {data.activities.map((act, i) => (
              <div key={i} className="rt-item">
                <h3 className="rt-item-title">{act.title}</h3>
                {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
                {act.description && <p className="rt-item-desc">{act.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// =====================================================
// TEMPLATE 3: Minimal Clean
// =====================================================
export const MinimalTemplate = ({ data }) => (
  <div className="resume-template minimal">
    <header className="rt-header minimal-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <div className="minimal-divider"></div>
      <div className="rt-contact minimal-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">PROFILE</h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">EXPERIENCE</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item minimal-item">
            <div className="minimal-item-top">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <span className="rt-item-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            <p className="rt-item-subtitle">{exp.company}</p>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">EDUCATION</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item minimal-item">
            <div className="minimal-item-top">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <span className="rt-item-date">{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            <p className="rt-item-subtitle">{edu.institution}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">SKILLS</h2>
        <p className="minimal-skills">{data.skills.map(s => typeof s === 'string' ? s : s.name).join(' • ')}</p>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">PROJECTS</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item minimal-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            {proj.description && <p className="rt-item-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-tech">{proj.technologies}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">CERTIFICATIONS</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item minimal-item">
            <div className="minimal-item-top">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.date && <span className="rt-item-date">{cert.date}</span>}
            </div>
            {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">LANGUAGES</h2>
        <p className="minimal-skills">{data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}</p>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section minimal-section">
        <h2 className="rt-section-title minimal-title">ACTIVITIES</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item minimal-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 4: Executive Classic
// =====================================================
export const ExecutiveTemplate = ({ data }) => (
  <div className="resume-template executive">
    <header className="rt-header executive-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title || 'Executive'}</p>
      <div className="executive-line"></div>
      <div className="rt-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
        {data.personal?.linkedin && <span>{data.personal.linkedin}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Executive Summary</h2>
        <p className="rt-summary executive-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Professional Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item executive-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <div className="executive-meta">
              <span className="executive-company">{exp.company}</span>
              <span className="executive-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            {exp.highlights?.length > 0 && (
              <ul className="rt-item-list executive-list">
                {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item executive-item">
            <h3 className="rt-item-title">{edu.degree}</h3>
            <div className="executive-meta">
              <span>{edu.institution}</span>
              <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Core Competencies</h2>
        <div className="executive-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="executive-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Key Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item executive-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            {proj.description && <p className="rt-item-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc"><em>Technologies: {proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item executive-item">
            <div className="executive-meta">
              <span>{cert.name}</span>
              {cert.date && <span>{cert.date}</span>}
            </div>
            {cert.issuer && <p className="rt-item-desc">{cert.issuer}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Languages</h2>
        <div className="executive-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="executive-skill">{lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section">
        <h2 className="rt-section-title executive-title">Activities & Interests</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item executive-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="rt-item-desc">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 5: Tech Innovator
// =====================================================
export const TechTemplate = ({ data }) => (
  <div className="resume-template tech">
    <div className="tech-sidebar">
      <div className="tech-avatar">
        {(data.personal?.fullName || data.personal?.firstName || 'U').charAt(0).toUpperCase()}
      </div>
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title || 'Developer'}</p>
      
      <div className="tech-contact">
        {data.personal?.email && <div className="tech-contact-item"><Mail size={14} /><span>{data.personal.email}</span></div>}
        {data.personal?.phone && <div className="tech-contact-item"><Phone size={14} /><span>{data.personal.phone}</span></div>}
        {data.personal?.location && <div className="tech-contact-item"><MapPin size={14} /><span>{data.personal.location}</span></div>}
        {data.personal?.github && <div className="tech-contact-item"><Github size={14} /><span>{data.personal.github}</span></div>}
      </div>
      
      {data.skills?.length > 0 && (
        <div className="tech-skills-section">
          <h3 className="tech-sidebar-title">Tech Stack</h3>
          <div className="tech-skills">
            {data.skills.map((skill, i) => (
              <span key={i} className="tech-skill-badge">{typeof skill === 'string' ? skill : skill.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
    
    <div className="tech-main">
      {data.personal?.summary && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;About /&gt;</h2>
          <p className="rt-summary">{data.personal.summary}</p>
        </section>
      )}
      
      {data.experience?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Experience /&gt;</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="rt-item tech-item">
              <div className="tech-item-header">
                <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                <span className="tech-badge">{formatDateRange(exp.startDate, exp.endDate)}</span>
              </div>
              <p className="rt-item-subtitle tech-company">{exp.company}</p>
              {exp.description && <p className="rt-item-desc">{exp.description}</p>}
              {exp.highlights?.length > 0 && (
                <ul className="rt-item-list">
                  {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      
      {data.projects?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Projects /&gt;</h2>
          <div className="tech-projects">
            {data.projects.map((proj, i) => (
              <div key={i} className="tech-project-card">
                <h3 className="tech-project-name">{proj.name}</h3>
                <p className="tech-project-desc">{proj.description}</p>
                {proj.technologies && (
                  <div className="tech-project-stack">
                    {proj.technologies.split(',').map((t, j) => (
                      <span key={j} className="tech-mini-badge">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.education?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Education /&gt;</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <p className="rt-item-subtitle">{edu.institution} | {formatDateRange(edu.startDate, edu.endDate)}</p>
            </div>
          ))}
        </section>
      )}
      
      {data.certifications?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Certifications /&gt;</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="rt-item tech-item">
              <div className="tech-item-header">
                <h3 className="rt-item-title">{cert.name}</h3>
                {cert.date && <span className="tech-badge">{cert.date}</span>}
              </div>
              {cert.issuer && <p className="rt-item-subtitle tech-company">{cert.issuer}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.languages?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Languages /&gt;</h2>
          <div className="tech-projects">
            {data.languages.map((lang, i) => (
              <div key={i} className="tech-project-card">
                <h3 className="tech-project-name">{lang.language}</h3>
                {lang.proficiency && <p className="tech-project-desc">{lang.proficiency}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {data.activities?.length > 0 && (
        <section className="rt-section tech-section">
          <h2 className="rt-section-title tech-title">&lt;Activities /&gt;</h2>
          {data.activities.map((act, i) => (
            <div key={i} className="rt-item tech-item">
              <h3 className="rt-item-title">{act.title}</h3>
              {act.organization && <p className="rt-item-subtitle tech-company">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
              {act.description && <p className="rt-item-desc">{act.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
);

// =====================================================
// TEMPLATE 6: Elegant Serif
// =====================================================
export const ElegantTemplate = ({ data }) => (
  <div className="resume-template elegant">
    <header className="rt-header elegant-header">
      <h1 className="rt-name elegant-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title elegant-title-text">{data.personal?.title}</p>
      <div className="elegant-ornament">✦</div>
      <div className="rt-contact elegant-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Professional Profile</h2>
        <div className="elegant-divider"></div>
        <p className="rt-summary elegant-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Career History</h2>
        <div className="elegant-divider"></div>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item elegant-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <p className="elegant-company-line">{exp.company} — {formatDateRange(exp.startDate, exp.endDate)}</p>
            {exp.description && <p className="rt-item-desc elegant-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Education</h2>
        <div className="elegant-divider"></div>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item elegant-item">
            <h3 className="rt-item-title">{edu.degree}</h3>
            <p className="elegant-company-line">{edu.institution} — {formatDateRange(edu.startDate, edu.endDate)}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Expertise</h2>
        <div className="elegant-divider"></div>
        <p className="elegant-skills">{data.skills.map(s => typeof s === 'string' ? s : s.name).join(' · ')}</p>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Notable Projects</h2>
        <div className="elegant-divider"></div>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item elegant-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            {proj.description && <p className="rt-item-desc elegant-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc elegant-desc"><em>{proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Certifications</h2>
        <div className="elegant-divider"></div>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item elegant-item">
            <h3 className="rt-item-title">{cert.name}</h3>
            <p className="elegant-company-line">{cert.issuer}{cert.date ? ` — ${cert.date}` : ''}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Languages</h2>
        <div className="elegant-divider"></div>
        <p className="elegant-skills">{data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · ')}</p>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section elegant-section">
        <h2 className="rt-section-title elegant-section-title">Activities</h2>
        <div className="elegant-divider"></div>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item elegant-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="elegant-company-line">{act.organization}{act.role ? ` — ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc elegant-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 7: Bold Impact
// =====================================================
export const BoldTemplate = ({ data }) => (
  <div className="resume-template bold">
    <header className="rt-header bold-header">
      <div className="bold-name-block">
        <h1 className="rt-name bold-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <div className="bold-accent-bar"></div>
      </div>
      <p className="rt-title bold-title">{data.personal?.title}</p>
      <div className="rt-contact bold-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHO I AM</h2>
        <p className="rt-summary bold-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHAT I'VE DONE</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item bold-item">
            <div className="bold-item-marker"></div>
            <div className="bold-item-content">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <p className="rt-item-subtitle">{exp.company} • {formatDateRange(exp.startDate, exp.endDate)}</p>
              {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHAT I KNOW</h2>
        <div className="bold-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="bold-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHERE I LEARNED</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item bold-item">
            <div className="bold-item-marker"></div>
            <div className="bold-item-content">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <p className="rt-item-subtitle">{edu.institution}</p>
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHAT I'VE BUILT</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item bold-item">
            <div className="bold-item-marker"></div>
            <div className="bold-item-content">
              <h3 className="rt-item-title">{proj.name}</h3>
              {proj.description && <p className="rt-item-desc">{proj.description}</p>}
              {proj.technologies && <p className="rt-item-subtitle">{proj.technologies}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHAT I'VE EARNED</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item bold-item">
            <div className="bold-item-marker"></div>
            <div className="bold-item-content">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">HOW I COMMUNICATE</h2>
        <div className="bold-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="bold-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section bold-section">
        <h2 className="rt-section-title bold-section-title">WHAT I DO FOR FUN</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item bold-item">
            <div className="bold-item-marker"></div>
            <div className="bold-item-content">
              <h3 className="rt-item-title">{act.title}</h3>
              {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 8: Corporate Pro
// =====================================================
export const CorporateTemplate = ({ data }) => (
  <div className="resume-template corporate">
    <header className="rt-header corporate-header">
      <div className="corporate-header-main">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title">{data.personal?.title}</p>
      </div>
      <div className="corporate-header-contact">
        {data.personal?.email && <div><Mail size={14} />{data.personal.email}</div>}
        {data.personal?.phone && <div><Phone size={14} />{data.personal.phone}</div>}
        {data.personal?.location && <div><MapPin size={14} />{data.personal.location}</div>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Summary</h2>
        </div>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Professional Experience</h2>
        </div>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item corporate-item">
            <div className="corporate-item-left">
              <span className="corporate-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            <div className="corporate-item-right">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <p className="rt-item-subtitle">{exp.company}</p>
              {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Education</h2>
        </div>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item corporate-item">
            <div className="corporate-item-left">
              <span className="corporate-date">{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            <div className="corporate-item-right">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <p className="rt-item-subtitle">{edu.institution}</p>
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Skills</h2>
        </div>
        <div className="corporate-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="corporate-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Projects</h2>
        </div>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item corporate-item">
            <div className="corporate-item-left"></div>
            <div className="corporate-item-right">
              <h3 className="rt-item-title">{proj.name}</h3>
              {proj.description && <p className="rt-item-desc">{proj.description}</p>}
              {proj.technologies && <p className="rt-item-desc"><em>{proj.technologies}</em></p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Certifications</h2>
        </div>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item corporate-item">
            <div className="corporate-item-left">
              {cert.date && <span className="corporate-date">{cert.date}</span>}
            </div>
            <div className="corporate-item-right">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Languages</h2>
        </div>
        <div className="corporate-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="corporate-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section corporate-section">
        <div className="corporate-section-header">
          <h2 className="rt-section-title">Activities</h2>
        </div>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item corporate-item">
            <div className="corporate-item-left"></div>
            <div className="corporate-item-right">
              <h3 className="rt-item-title">{act.title}</h3>
              {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
              {act.description && <p className="rt-item-desc">{act.description}</p>}
            </div>
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 9: Academic Scholar
// =====================================================
export const AcademicTemplate = ({ data }) => (
  <div className="resume-template academic">
    <header className="rt-header academic-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title academic-field">{data.personal?.title}</p>
      <div className="academic-contact">
        {data.personal?.email && <span>✉ {data.personal.email}</span>}
        {data.personal?.phone && <span>☎ {data.personal.phone}</span>}
        {data.personal?.location && <span>⌂ {data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Research Interests</h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item academic-item">
            <h3 className="rt-item-title">{edu.degree}</h3>
            <p className="academic-institution">{edu.institution}, {edu.location}</p>
            <p className="academic-date">{formatDateRange(edu.startDate, edu.endDate)}</p>
            {edu.gpa && <p className="academic-gpa">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Academic Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item academic-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <p className="academic-institution">{exp.company}</p>
            <p className="academic-date">{formatDateRange(exp.startDate, exp.endDate)}</p>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Research & Publications</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item academic-item">
            <h3 className="rt-item-title">"{proj.name}"</h3>
            <p className="rt-item-desc">{proj.description}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Technical Skills</h2>
        <p className="academic-skills">{data.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}</p>
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item academic-item">
            <h3 className="rt-item-title">{cert.name}</h3>
            {cert.issuer && <p className="academic-institution">{cert.issuer}</p>}
            {cert.date && <p className="academic-date">{cert.date}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Languages</h2>
        <p className="academic-skills">{data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', ')}</p>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section academic-section">
        <h2 className="rt-section-title academic-title">Activities & Service</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item academic-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="academic-institution">{act.organization}{act.role ? `, ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 10: Startup Vibe
// =====================================================
export const StartupTemplate = ({ data }) => (
  <div className="resume-template startup">
    <header className="rt-header startup-header">
      <div className="startup-intro">
        <span className="startup-greeting">Hi, I'm</span>
        <h1 className="rt-name startup-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title startup-role">{data.personal?.title} 🚀</p>
      </div>
      <div className="startup-contact">
        {data.personal?.email && <a href={`mailto:${data.personal.email}`}>{data.personal.email}</a>}
        {data.personal?.linkedin && <a href="#">LinkedIn</a>}
        {data.personal?.github && <a href="#">GitHub</a>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">The TL;DR</h2>
        <p className="rt-summary startup-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">Where I've Made Impact</h2>
        <div className="startup-timeline">
          {data.experience.map((exp, i) => (
            <div key={i} className="startup-timeline-item">
              <div className="startup-timeline-dot"></div>
              <div className="startup-timeline-content">
                <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                <p className="startup-company">@ {exp.company}</p>
                <span className="startup-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
                {exp.description && <p className="rt-item-desc">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">My Toolkit</h2>
        <div className="startup-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="startup-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">Cool Stuff I've Built</h2>
        <div className="startup-projects">
          {data.projects.map((proj, i) => (
            <div key={i} className="startup-project">
              <h3>{proj.name}</h3>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">Where I Leveled Up</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="startup-edu">
            <strong>{edu.degree}</strong> — {edu.institution}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">What I've Earned 🏆</h2>
        <div className="startup-projects">
          {data.certifications.map((cert, i) => (
            <div key={i} className="startup-project">
              <h3>{cert.name}</h3>
              {cert.issuer && <p>{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</p>}
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">How I Communicate 🗣️</h2>
        <div className="startup-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="startup-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section startup-section">
        <h2 className="rt-section-title startup-title">What I Do Beyond Work ⚡</h2>
        <div className="startup-timeline">
          {data.activities.map((act, i) => (
            <div key={i} className="startup-timeline-item">
              <div className="startup-timeline-dot"></div>
              <div className="startup-timeline-content">
                <h3 className="rt-item-title">{act.title}</h3>
                {act.organization && <p className="startup-company">@ {act.organization}{act.role ? ` — ${act.role}` : ''}</p>}
                {act.description && <p className="rt-item-desc">{act.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 11: Healthcare Pro
// =====================================================
export const HealthcareTemplate = ({ data }) => (
  <div className="resume-template healthcare">
    <header className="rt-header healthcare-header">
      <div className="healthcare-logo">⚕</div>
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title}</p>
      <div className="rt-contact healthcare-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section healthcare-section">
        <h2 className="rt-section-title healthcare-title">Professional Summary</h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section healthcare-section">
        <h2 className="rt-section-title healthcare-title">Clinical Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item healthcare-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <p className="healthcare-facility">{exp.company} | {exp.location}</p>
            <p className="healthcare-dates">{formatDateRange(exp.startDate, exp.endDate)}</p>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section healthcare-section">
        <h2 className="rt-section-title healthcare-title">Education & Credentials</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item healthcare-item">
            <h3 className="rt-item-title">{edu.degree}</h3>
            <p className="healthcare-facility">{edu.institution}</p>
            <p className="healthcare-dates">{formatDateRange(edu.startDate, edu.endDate)}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section healthcare-section">
        <h2 className="rt-section-title healthcare-title">Certifications & Licenses</h2>
        <div className="healthcare-certs">
          {data.certifications.map((cert, i) => (
            <div key={i} className="healthcare-cert">
              <Award size={16} />
              <span>{cert.name} — {cert.issuer}</span>
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section healthcare-section">
        <h2 className="rt-section-title healthcare-title">Clinical Skills</h2>
        <div className="healthcare-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="healthcare-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 12: Finance Expert
// =====================================================
export const FinanceTemplate = ({ data }) => (
  <div className="resume-template finance">
    <header className="rt-header finance-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title finance-designation">{data.personal?.title}</p>
      <div className="finance-divider"></div>
      <div className="rt-contact finance-contact">
        {data.personal?.email && <span>Email: {data.personal.email}</span>}
        {data.personal?.phone && <span>Phone: {data.personal.phone}</span>}
        {data.personal?.location && <span>Location: {data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">EXECUTIVE SUMMARY</h2>
        <p className="rt-summary finance-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">PROFESSIONAL EXPERIENCE</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item finance-item">
            <div className="finance-item-header">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <span className="finance-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            <p className="finance-company">{exp.company} — {exp.location}</p>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            {exp.highlights?.length > 0 && (
              <ul className="finance-achievements">
                {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">EDUCATION</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item finance-item">
            <div className="finance-item-header">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <span className="finance-date">{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
            <p className="finance-company">{edu.institution}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">CORE COMPETENCIES</h2>
        <div className="finance-competencies">
          {data.skills.map((skill, i) => (
            <span key={i} className="finance-competency">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">KEY PROJECTS</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item finance-item">
            <div className="finance-item-header">
              <h3 className="rt-item-title">{proj.name}</h3>
            </div>
            {proj.description && <p className="rt-item-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc"><em>{proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">CERTIFICATIONS</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item finance-item">
            <div className="finance-item-header">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.date && <span className="finance-date">{cert.date}</span>}
            </div>
            {cert.issuer && <p className="finance-company">{cert.issuer}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">LANGUAGES</h2>
        <div className="finance-competencies">
          {data.languages.map((lang, i) => (
            <span key={i} className="finance-competency">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section finance-section">
        <h2 className="rt-section-title finance-title">ACTIVITIES</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item finance-item">
            <div className="finance-item-header">
              <h3 className="rt-item-title">{act.title}</h3>
            </div>
            {act.organization && <p className="finance-company">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// Templates 13-20 follow similar patterns
// =====================================================
// TEMPLATE 13: Artistic Portfolio
// =====================================================
export const ArtisticTemplate = ({ data }) => (
  <div className="resume-template artistic">
    <div className="artistic-sidebar">
      <div className="artistic-photo">
        {(data.personal?.fullName || data.personal?.firstName || 'A').charAt(0)}
      </div>
      <div className="artistic-contact">
        {data.personal?.email && <p>{data.personal.email}</p>}
        {data.personal?.phone && <p>{data.personal.phone}</p>}
        {data.personal?.location && <p>{data.personal.location}</p>}
      </div>
      {data.skills?.length > 0 && (
        <div className="artistic-skills-sidebar">
          <h3>Skills</h3>
          {data.skills.slice(0, 8).map((skill, i) => (
            <div key={i} className="artistic-skill-row">
              <span>{typeof skill === 'string' ? skill : skill.name}</span>
              <div className="artistic-skill-dots">
                {[1,2,3,4,5].map(n => <span key={n} className={n <= 4 ? 'filled' : ''}></span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="artistic-main">
      <header className="rt-header artistic-header">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title">{data.personal?.title}</p>
      </header>
      
      {data.personal?.summary && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">About</h2>
          <p className="rt-summary">{data.personal.summary}</p>
        </section>
      )}
      
      {data.experience?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <p className="rt-item-subtitle">{exp.company} | {formatDateRange(exp.startDate, exp.endDate)}</p>
              {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.education?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{edu.degree}</h3>
              <p className="rt-item-subtitle">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}
      
      {data.projects?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{proj.name}</h3>
              {proj.description && <p className="rt-item-desc">{proj.description}</p>}
              {proj.technologies && <p className="rt-tech">{proj.technologies}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.certifications?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{cert.name}</h3>
              {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.languages?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Languages</h2>
          <div className="rt-skills">
            {data.languages.map((lang, i) => (
              <span key={i} className="rt-skill-tag">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
            ))}
          </div>
        </section>
      )}
      
      {data.activities?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title artistic-title">Activities</h2>
          {data.activities.map((act, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{act.title}</h3>
              {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
              {act.description && <p className="rt-item-desc">{act.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
);

// =====================================================
// TEMPLATE 14: Clean Sidebar
// =====================================================
export const SidebarTemplate = ({ data }) => (
  <div className="resume-template sidebar-layout">
    <div className="sidebar-left">
      <div className="sidebar-photo">
        {(data.personal?.fullName || data.personal?.firstName || 'U').charAt(0)}
      </div>
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Contact</h3>
        {data.personal?.email && <p><Mail size={12} /> {data.personal.email}</p>}
        {data.personal?.phone && <p><Phone size={12} /> {data.personal.phone}</p>}
        {data.personal?.location && <p><MapPin size={12} /> {data.personal.location}</p>}
      </div>
      {data.skills?.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Skills</h3>
          <div className="sidebar-skills">
            {data.skills.map((skill, i) => (
              <span key={i} className="sidebar-skill-tag">{typeof skill === 'string' ? skill : skill.name}</span>
            ))}
          </div>
        </div>
      )}
      {data.education?.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Education</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="sidebar-edu">
              <strong>{edu.degree}</strong>
              <p>{edu.institution}</p>
              <small>{formatDateRange(edu.startDate, edu.endDate)}</small>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="sidebar-right">
      <header className="rt-header">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title">{data.personal?.title}</p>
      </header>
      {data.personal?.summary && (
        <section className="rt-section">
          <h2 className="rt-section-title">Profile</h2>
          <p className="rt-summary">{data.personal.summary}</p>
        </section>
      )}
      {data.experience?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="rt-item">
              <div className="rt-item-header">
                <div>
                  <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                  <p className="rt-item-subtitle">{exp.company}</p>
                </div>
                <span className="rt-item-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
              </div>
              {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.projects?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title">Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{proj.name}</h3>
              <p className="rt-item-desc">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {data.certifications?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title">Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="rt-item">
              <div className="rt-item-header">
                <h3 className="rt-item-title">{cert.name}</h3>
                {cert.date && <span className="rt-item-date">{cert.date}</span>}
              </div>
              {cert.issuer && <p className="rt-item-subtitle">{cert.issuer}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.languages?.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Languages</h3>
          <div className="sidebar-skills">
            {data.languages.map((lang, i) => (
              <span key={i} className="sidebar-skill-tag">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
            ))}
          </div>
        </div>
      )}
      
      {data.activities?.length > 0 && (
        <section className="rt-section">
          <h2 className="rt-section-title">Activities</h2>
          {data.activities.map((act, i) => (
            <div key={i} className="rt-item">
              <h3 className="rt-item-title">{act.title}</h3>
              {act.organization && <p className="rt-item-subtitle">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
              {act.description && <p className="rt-item-desc">{act.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
);

// =====================================================
// TEMPLATE 15: Minimal Plus
// =====================================================
export const MinimalPlusTemplate = ({ data }) => (
  <div className="resume-template minimal-plus">
    <header className="rt-header minimal-plus-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <div className="minimal-plus-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>•</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>•</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section minimal-plus-section">
        <p className="minimal-plus-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item minimal-plus-item">
            <div className="minimal-plus-item-header">
              <div>
                <strong>{exp.position || exp.jobTitle}</strong>
                <span className="minimal-plus-company">{exp.company}</span>
              </div>
              <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item minimal-plus-item">
            <div className="minimal-plus-item-header">
              <div>
                <strong>{edu.degree}</strong>
                <span className="minimal-plus-company">{edu.institution}</span>
              </div>
              <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Skills</h2>
        <p className="minimal-plus-skills">{data.skills.map(s => typeof s === 'string' ? s : s.name).join(' | ')}</p>
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item minimal-plus-item">
            <div className="minimal-plus-item-header">
              <strong>{proj.name}</strong>
            </div>
            {proj.description && <p>{proj.description}</p>}
            {proj.technologies && <p className="minimal-plus-company">{proj.technologies}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item minimal-plus-item">
            <div className="minimal-plus-item-header">
              <strong>{cert.name}</strong>
              {cert.date && <span>{cert.date}</span>}
            </div>
            {cert.issuer && <span className="minimal-plus-company">{cert.issuer}</span>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Languages</h2>
        <p className="minimal-plus-skills">{data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' | ')}</p>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section minimal-plus-section">
        <h2 className="rt-section-title minimal-plus-title">Activities</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item minimal-plus-item">
            <div className="minimal-plus-item-header">
              <strong>{act.title}</strong>
              {act.organization && <span className="minimal-plus-company">{act.organization}</span>}
            </div>
            {act.description && <p>{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 16: Marketing Pro
// =====================================================
export const MarketingTemplate = ({ data }) => (
  <div className="resume-template marketing">
    <header className="rt-header marketing-header">
      <div className="marketing-header-content">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title marketing-tagline">{data.personal?.title}</p>
        <div className="marketing-contact">
          {data.personal?.email && <span>✉ {data.personal.email}</span>}
          {data.personal?.phone && <span>☎ {data.personal.phone}</span>}
          {data.personal?.linkedin && <span>in {data.personal.linkedin}</span>}
        </div>
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">🎯</span> Brand Story
        </h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">📈</span> Campaign History
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item marketing-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <p className="marketing-company">{exp.company} | {formatDateRange(exp.startDate, exp.endDate)}</p>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">🛠</span> Marketing Toolkit
        </h2>
        <div className="marketing-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="marketing-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">🎓</span> Education
        </h2>
        {data.education.map((edu, i) => (
          <div key={i} className="marketing-edu">
            <strong>{edu.degree}</strong> — {edu.institution}
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">💡</span> Projects
        </h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item marketing-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            {proj.description && <p className="rt-item-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc"><em>{proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">🏆</span> Certifications
        </h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item marketing-item">
            <h3 className="rt-item-title">{cert.name}</h3>
            <p className="marketing-company">{cert.issuer}{cert.date ? ` | ${cert.date}` : ''}</p>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">🌐</span> Languages
        </h2>
        <div className="marketing-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="marketing-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section marketing-section">
        <h2 className="rt-section-title marketing-title">
          <span className="marketing-icon">⚡</span> Activities
        </h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item marketing-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="marketing-company">{act.organization}{act.role ? ` | ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 17: Engineering Focus
// =====================================================
export const EngineeringTemplate = ({ data }) => (
  <div className="resume-template engineering">
    <header className="rt-header engineering-header">
      <div className="engineering-name-box">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title">{data.personal?.title}</p>
      </div>
      <div className="engineering-contact-box">
        {data.personal?.email && <div>{data.personal.email}</div>}
        {data.personal?.phone && <div>{data.personal.phone}</div>}
        {data.personal?.location && <div>{data.personal.location}</div>}
        {data.personal?.github && <div>github.com/{data.personal.github}</div>}
      </div>
    </header>
    
    <div className="engineering-body">
      <div className="engineering-main">
        {data.personal?.summary && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Summary</h2>
            <p className="rt-summary">{data.personal.summary}</p>
          </section>
        )}
        
        {data.experience?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="rt-item engineering-item">
                <div className="engineering-item-header">
                  <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                  <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                </div>
                <p className="engineering-company">{exp.company}</p>
                {exp.description && <p className="rt-item-desc">{exp.description}</p>}
                {exp.highlights?.length > 0 && (
                  <ul className="engineering-list">
                    {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        
        {data.projects?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="rt-item engineering-item">
                <h3 className="rt-item-title">{proj.name}</h3>
                <p className="rt-item-desc">{proj.description}</p>
                {proj.technologies && (
                  <p className="engineering-tech"><strong>Stack:</strong> {proj.technologies}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
      
      <div className="engineering-sidebar">
        {data.skills?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Technical Skills</h2>
            <div className="engineering-skills">
              {data.skills.map((skill, i) => (
                <span key={i} className="engineering-skill">{typeof skill === 'string' ? skill : skill.name}</span>
              ))}
            </div>
          </section>
        )}
        
        {data.education?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="engineering-edu">
                <strong>{edu.degree}</strong>
                <p>{edu.institution}</p>
                <small>{formatDateRange(edu.startDate, edu.endDate)}</small>
              </div>
            ))}
          </section>
        )}
        
        {data.certifications?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Certifications</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="engineering-edu">
                <strong>{cert.name}</strong>
                {cert.issuer && <p>{cert.issuer}</p>}
                {cert.date && <small>{cert.date}</small>}
              </div>
            ))}
          </section>
        )}
        
        {data.languages?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Languages</h2>
            <div className="engineering-skills">
              {data.languages.map((lang, i) => (
                <span key={i} className="engineering-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
              ))}
            </div>
          </section>
        )}
        
        {data.activities?.length > 0 && (
          <section className="rt-section engineering-section">
            <h2 className="rt-section-title engineering-title">Activities</h2>
            {data.activities.map((act, i) => (
              <div key={i} className="engineering-edu">
                <strong>{act.title}</strong>
                {act.organization && <p>{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

// =====================================================
// TEMPLATE 18: Consultant Elite
// =====================================================
export const ConsultantTemplate = ({ data }) => (
  <div className="resume-template consultant">
    <header className="rt-header consultant-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title}</p>
      <div className="consultant-separator"></div>
      <div className="rt-contact consultant-contact">
        {data.personal?.email && <span>{data.personal.email}</span>}
        {data.personal?.phone && <span>{data.personal.phone}</span>}
        {data.personal?.location && <span>{data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">PROFESSIONAL PROFILE</h2>
        <p className="rt-summary consultant-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">AREAS OF EXPERTISE</h2>
        <div className="consultant-expertise">
          {data.skills.map((skill, i) => (
            <div key={i} className="consultant-expertise-item">
              <span className="consultant-check">✓</span>
              {typeof skill === 'string' ? skill : skill.name}
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">CONSULTING ENGAGEMENTS</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item consultant-item">
            <div className="consultant-item-header">
              <div>
                <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
                <p className="consultant-client">{exp.company}</p>
              </div>
              <span className="consultant-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
            {exp.highlights?.length > 0 && (
              <ul className="consultant-results">
                {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">EDUCATION & CREDENTIALS</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="consultant-edu">
            <strong>{edu.degree}</strong>
            <span>{edu.institution} | {formatDateRange(edu.startDate, edu.endDate)}</span>
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">KEY PROJECTS</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item consultant-item">
            <div className="consultant-item-header">
              <div>
                <h3 className="rt-item-title">{proj.name}</h3>
              </div>
            </div>
            {proj.description && <p className="rt-item-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc"><em>{proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">CERTIFICATIONS</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="consultant-edu">
            <strong>{cert.name}</strong>
            <span>{cert.issuer}{cert.date ? ` | ${cert.date}` : ''}</span>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">LANGUAGES</h2>
        <div className="consultant-expertise">
          {data.languages.map((lang, i) => (
            <div key={i} className="consultant-expertise-item">
              <span className="consultant-check">✓</span>
              {lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ''}
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section consultant-section">
        <h2 className="rt-section-title consultant-title">ACTIVITIES & INTERESTS</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="consultant-edu">
            <strong>{act.title}</strong>
            {act.organization && <span>{act.organization}{act.role ? ` • ${act.role}` : ''}</span>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 19: Fresh Graduate
// =====================================================
export const GraduateTemplate = ({ data }) => (
  <div className="resume-template graduate">
    <header className="rt-header graduate-header">
      <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
      <p className="rt-title">{data.personal?.title || 'Recent Graduate'}</p>
      <div className="graduate-contact">
        {data.personal?.email && <span><Mail size={14} /> {data.personal.email}</span>}
        {data.personal?.phone && <span><Phone size={14} /> {data.personal.phone}</span>}
        {data.personal?.location && <span><MapPin size={14} /> {data.personal.location}</span>}
      </div>
    </header>
    
    {data.personal?.summary && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Objective</h2>
        <p className="rt-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="rt-item graduate-item">
            <h3 className="rt-item-title">{edu.degree}</h3>
            <p className="graduate-school">{edu.institution}</p>
            <div className="graduate-meta">
              <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
              {edu.gpa && <span>GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Academic Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item graduate-item">
            <h3 className="rt-item-title">{proj.name}</h3>
            <p className="rt-item-desc">{proj.description}</p>
            {proj.technologies && <p className="graduate-tech">Technologies: {proj.technologies}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item graduate-item">
            <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
            <p className="graduate-school">{exp.company}</p>
            <span className="graduate-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            {exp.description && <p className="rt-item-desc">{exp.description}</p>}
          </div>
        ))}
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Skills</h2>
        <div className="graduate-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="graduate-skill">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="rt-item graduate-item">
            <h3 className="rt-item-title">{cert.name}</h3>
            {cert.issuer && <p className="graduate-school">{cert.issuer}</p>}
            {cert.date && <span className="graduate-date">{cert.date}</span>}
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Languages</h2>
        <div className="graduate-skills">
          {data.languages.map((lang, i) => (
            <span key={i} className="graduate-skill">{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section graduate-section">
        <h2 className="rt-section-title graduate-title">Activities & Leadership</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="rt-item graduate-item">
            <h3 className="rt-item-title">{act.title}</h3>
            {act.organization && <p className="graduate-school">{act.organization}{act.role ? ` • ${act.role}` : ''}</p>}
            {act.description && <p className="rt-item-desc">{act.description}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE 20: Premium Executive
// =====================================================
export const PremiumTemplate = ({ data }) => (
  <div className="resume-template premium">
    <header className="rt-header premium-header">
      <div className="premium-name-section">
        <h1 className="rt-name">{data.personal?.fullName || data.personal?.firstName + ' ' + data.personal?.lastName}</h1>
        <p className="rt-title premium-title-text">{data.personal?.title}</p>
      </div>
      <div className="premium-contact-section">
        {data.personal?.email && <div className="premium-contact-item">{data.personal.email}</div>}
        {data.personal?.phone && <div className="premium-contact-item">{data.personal.phone}</div>}
        {data.personal?.location && <div className="premium-contact-item">{data.personal.location}</div>}
        {data.personal?.linkedin && <div className="premium-contact-item">{data.personal.linkedin}</div>}
      </div>
    </header>
    
    <div className="premium-gold-bar"></div>
    
    {data.personal?.summary && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Executive Profile</h2>
        <p className="rt-summary premium-summary">{data.personal.summary}</p>
      </section>
    )}
    
    {data.skills?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Key Strengths</h2>
        <div className="premium-strengths">
          {data.skills.slice(0, 6).map((skill, i) => (
            <div key={i} className="premium-strength">
              <span className="premium-diamond">◆</span>
              {typeof skill === 'string' ? skill : skill.name}
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.experience?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Executive Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="rt-item premium-item">
            <div className="premium-item-header">
              <h3 className="rt-item-title">{exp.position || exp.jobTitle}</h3>
              <span className="premium-date">{formatDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            <p className="premium-company">{exp.company}</p>
            {exp.description && <p className="rt-item-desc premium-desc">{exp.description}</p>}
            {exp.highlights?.length > 0 && (
              <ul className="premium-achievements">
                {exp.highlights.map((h, j) => (
                  <li key={j}><span className="premium-bullet">▸</span> {h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}
    
    {data.education?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="premium-edu">
            <strong>{edu.degree}</strong>
            <span className="premium-institution">{edu.institution}</span>
          </div>
        ))}
      </section>
    )}
    
    {data.projects?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Key Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} className="rt-item premium-item">
            <div className="premium-item-header">
              <h3 className="rt-item-title">{proj.name}</h3>
            </div>
            {proj.description && <p className="rt-item-desc premium-desc">{proj.description}</p>}
            {proj.technologies && <p className="rt-item-desc premium-desc"><em>{proj.technologies}</em></p>}
          </div>
        ))}
      </section>
    )}
    
    {data.certifications?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={i} className="premium-edu">
            <strong>{cert.name}</strong>
            <span className="premium-institution">{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</span>
          </div>
        ))}
      </section>
    )}
    
    {data.languages?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Languages</h2>
        <div className="premium-strengths">
          {data.languages.map((lang, i) => (
            <div key={i} className="premium-strength">
              <span className="premium-diamond">◆</span>
              {lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ''}
            </div>
          ))}
        </div>
      </section>
    )}
    
    {data.activities?.length > 0 && (
      <section className="rt-section premium-section">
        <h2 className="rt-section-title premium-section-title">Activities & Interests</h2>
        {data.activities.map((act, i) => (
          <div key={i} className="premium-edu">
            <strong>{act.title}</strong>
            {act.organization && <span className="premium-institution">{act.organization}{act.role ? ` • ${act.role}` : ''}</span>}
          </div>
        ))}
      </section>
    )}
  </div>
);

// =====================================================
// TEMPLATE RENDERER - Maps template ID to component
// =====================================================
const templateComponents = {
  1: ModernTemplate,
  2: CreativeTemplate,
  3: MinimalTemplate,
  4: ExecutiveTemplate,
  5: TechTemplate,
  6: ElegantTemplate,
  7: BoldTemplate,
  8: CorporateTemplate,
  9: AcademicTemplate,
  10: StartupTemplate,
  11: HealthcareTemplate,
  12: FinanceTemplate,
  13: ArtisticTemplate,
  14: SidebarTemplate,
  15: MinimalPlusTemplate,
  16: MarketingTemplate,
  17: EngineeringTemplate,
  18: ConsultantTemplate,
  19: GraduateTemplate,
  20: PremiumTemplate,
  100: DataScientistTemplate,
  101: ClassicAcademicTemplate,
  102: ThreeColumnTemplate,
  103: TraditionalTemplate,
};

export const ResumeTemplate = ({ templateId, data }) => {
  const TemplateComponent = templateComponents[templateId] || ModernTemplate;
  // Strip experience for student mode — templates already guard experience?.length > 0
  const templateData = data?.personal?.isStudent
    ? { ...data, experience: [] }
    : data;
  return <TemplateComponent data={templateData} />;
};

export default ResumeTemplate;
