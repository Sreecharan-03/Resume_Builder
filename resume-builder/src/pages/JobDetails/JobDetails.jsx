import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CircleDashed,
  Gauge,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { jobService, resumeService } from '../../services';
import './JobDetails.css';

const toLabel = (value) => {
  if (!value) return 'Not specified';
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const formatPostedAt = (value) => {
  if (!value) return 'Recently posted';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently posted';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCompanyInitials = (companyName) => {
  if (!companyName) return 'CO';
  const parts = companyName.trim().split(/\s+/).slice(0, 2);
  return parts.map((item) => item[0]?.toUpperCase() || '').join('') || 'CO';
};

const getParagraphs = (value) => {
  if (!value) return [];
  return String(value)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalize = (value) => String(value || '').toLowerCase().trim();

const JobDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiContent, setAiContent] = useState(state?.generatedContent || null);
  const [error, setError] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const job = state?.job;
  const resumeId = state?.resumeId;
  const meta = state?.jobMeta || {};
  const companyInitials = getCompanyInitials(job?.company);
  const descriptionParagraphs = getParagraphs(job?.description);

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) return;

      setResumeLoading(true);
      const result = await resumeService.getResume(resumeId);
      if (result.success) {
        setResumeData(result.data);
      }
      setResumeLoading(false);
    };

    loadResume();
  }, [resumeId]);

  const resumeSkills = useMemo(() => {
    const raw = resumeData?.content?.skills;
    return Array.isArray(raw)
      ? raw.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
  }, [resumeData]);

  const jobSkills = useMemo(() => {
    const raw = job?.jobSkills;
    return Array.isArray(raw)
      ? raw.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
  }, [job?.jobSkills]);

  const resumeRole = useMemo(() => {
    return resumeData?.content?.personal?.title || '';
  }, [resumeData]);

  const matchInsights = useMemo(() => {
    const jobText = normalize(`${job?.title || ''} ${job?.description || ''}`);
    const resumeSkillSet = new Set(resumeSkills.map((skill) => normalize(skill)));

    const matchedFromResume = resumeSkills.filter((skill) => jobText.includes(normalize(skill)));
    const matchedFromJobSkills = jobSkills.filter((skill) => resumeSkillSet.has(normalize(skill)));

    const combinedMatched = Array.from(
      new Set([...matchedFromResume, ...matchedFromJobSkills].map((item) => item.trim()))
    ).slice(0, 8);

    const missingSkills = jobSkills
      .filter((skill) => !resumeSkillSet.has(normalize(skill)))
      .slice(0, 6);

    const roleAligned =
      normalize(resumeRole).length > 0 &&
      (normalize(job?.title).includes(normalize(resumeRole)) || normalize(resumeRole).includes(normalize(job?.title)));

    const score = Number(job?.matchScore || 0);
    const strength = score >= 80 ? 'Strong Match' : score >= 60 ? 'Good Match' : 'Needs Alignment';

    return {
      matchedSkills: combinedMatched,
      missingSkills,
      roleAligned,
      strength,
      score,
    };
  }, [job?.description, job?.matchScore, job?.title, jobSkills, resumeRole, resumeSkills]);

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-card">
          <p>Job data is missing. Go back and select a job again.</p>
          <button onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>
    );
  }

  const handleGenerateContent = async () => {
    setLoadingAI(true);
    setError('');

    const result = await jobService.generateContent({
      resumeId,
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
    });

    if (result.success) {
      setAiContent(result.data);
    } else {
      setError(result.message || 'Failed to generate content');
    }

    setLoadingAI(false);
  };

  const goToApplyAssistant = () => {
    navigate(`/apply/${encodeURIComponent(job.id)}`, {
      state: {
        job,
        resumeId,
        generatedContent: aiContent,
      },
    });
  };

  return (
    <div className="job-details-page">
      <div className="job-details-shell">
        <div className="details-topbar">
          <button className="ghost-btn" onClick={() => navigate('/jobs')}>
            <ArrowLeft size={15} /> Back to Jobs
          </button>
          <span className="match-badge">Match: {job.matchScore || 0}%</span>
        </div>

        <header className="job-hero-modern">
          <div className="company-avatar" aria-hidden="true">{companyInitials}</div>
          <div className="hero-main">
            <h1>{job.title}</h1>
            <p className="hero-subtitle">{job.company || 'Unknown company'}</p>
            <div className="hero-tags">
              <span><MapPin size={14} /> {job.location || 'Not specified'}</span>
              <span><BriefcaseBusiness size={14} /> {toLabel(meta.jobType)}</span>
              <span><CalendarDays size={14} /> {formatPostedAt(job.postedAt)}</span>
            </div>
          </div>
        </header>

        <section className="match-breakdown">
          <div className="match-headline">
            <Gauge size={18} />
            <div>
              <h2>Why This Job Matches Your Resume</h2>
              <p>
                {resumeLoading
                  ? 'Loading resume profile to compute match details...'
                  : `${matchInsights.strength} based on skills overlap and role alignment.`}
              </p>
            </div>
          </div>

          <div className="match-grid">
            <article>
              <h3><CheckCircle2 size={15} /> Matched Skills</h3>
              {matchInsights.matchedSkills.length > 0 ? (
                <div className="chip-list">
                  {matchInsights.matchedSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="muted">No strong skill overlap was detected from the available text.</p>
              )}
            </article>

            <article>
              <h3><CircleDashed size={15} /> Skills To Strengthen</h3>
              {matchInsights.missingSkills.length > 0 ? (
                <div className="chip-list soft">
                  {matchInsights.missingSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="muted">Your current profile already aligns with most listed job skills.</p>
              )}
            </article>

            <article>
              <h3><BriefcaseBusiness size={15} /> Role Alignment</h3>
              <p className="alignment-copy">
                Resume Role: <strong>{resumeRole || 'Not set in your resume'}</strong>
              </p>
              <p className="alignment-copy">
                Result: <strong>{matchInsights.roleAligned ? 'Aligned with this job title' : 'Partially aligned'}</strong>
              </p>
            </article>
          </div>
        </section>

        <div className="details-layout-modern">
          <aside className="company-profile-panel">
            <section className="panel-block">
              <h2><Building2 size={16} /> Company Profile</h2>
              <div className="kv-list">
                <div><span>Company</span><strong>{job.company || 'Not specified'}</strong></div>
                <div><span>Location</span><strong>{job.location || 'Not specified'}</strong></div>
                <div><span>Work Mode</span><strong>{toLabel(meta.workMode)}</strong></div>
                <div><span>Job Type</span><strong>{toLabel(meta.jobType)}</strong></div>
                <div><span>Posted</span><strong>{formatPostedAt(job.postedAt)}</strong></div>
              </div>
            </section>
          </aside>

          <main className="job-content-main">
            <section className="panel-block">
              <h2><ClipboardList size={16} /> Complete Job Description</h2>
              {descriptionParagraphs.length > 0 ? (
                <div className="description full">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 14)}`}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="description full">No description available for this job.</p>
              )}
            </section>
          </main>
        </div>

        <div className="actions-row">
          <button onClick={handleGenerateContent} disabled={loadingAI}>
            <Sparkles size={15} />
            {loadingAI ? 'Generating...' : 'Generate AI Content'}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {aiContent && (
          <section className="ai-content-section">
            <h2>AI Generated Content</h2>

            <h3>Cover Letter</h3>
            <pre>{aiContent.coverLetter}</pre>

            <h3>Why Fit</h3>
            <pre>{aiContent.whyFit}</pre>

            <h3>Skills Summary</h3>
            <pre>{aiContent.skillsSummary}</pre>

            <button className="continue-btn" onClick={goToApplyAssistant}>
              Continue to Apply Assistant
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
