import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Save } from 'lucide-react';
import { applicationService, resumeService } from '../../services';
import './ApplyAssistant.css';

const THIRD_PARTY_HOSTS = ['adzuna', 'linkedin', 'indeed', 'glassdoor', 'ziprecruiter', 'google'];

const decodeRepeatedly = (value) => {
  if (!value) return '';

  let decoded = value;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
};

const collectCandidateUrls = (value) => {
  if (!value) return [];

  const candidates = new Set();
  const decoded = decodeRepeatedly(value);
  const fragments = [value, decoded].filter(Boolean);

  for (const fragment of fragments) {
    const matches = fragment.match(/https?:\/\/[^\s"'<>]+/gi) || [];
    matches.forEach((match) => candidates.add(match));

    try {
      const parsed = new URL(fragment);
      const directCandidateKeys = ['url', 'redirect', 'redirect_url', 'dest', 'destination', 'target', 'u'];
      for (const key of directCandidateKeys) {
        const candidate = parsed.searchParams.get(key);
        if (candidate && /^https?:\/\//i.test(candidate)) {
          candidates.add(decodeRepeatedly(candidate));
        }
      }
      candidates.add(parsed.toString());
    } catch {
      // Ignore malformed URL fragments.
    }
  }

  return Array.from(candidates);
};

const normalizeUrl = (value) => {
  if (!value) return '';

  try {
    return new URL(value).toString();
  } catch {
    return '';
  }
};

const getApplyUrlMeta = (job) => {
  const candidates = [job?.companyApplyUrl, job?.companyWebsite, job?.applyUrl, job?.redirectUrl].filter(Boolean);

  const normalizedCandidates = [];
  candidates.forEach((value) => {
    const collected = collectCandidateUrls(value);
    collected.forEach((entry) => {
      const normalized = normalizeUrl(entry);
      if (normalized) {
        normalizedCandidates.push(normalized);
      }
    });
  });

  const uniqueUrls = Array.from(new Set(normalizedCandidates));

  for (const normalized of uniqueUrls) {
    try {
      const host = new URL(normalized).hostname.toLowerCase();
      const isThirdParty = THIRD_PARTY_HOSTS.some((keyword) => host.includes(keyword));
      if (!isThirdParty) {
        return {
          url: normalized,
          type: 'company',
        };
      }
    } catch {
      // Ignore malformed candidate URL.
    }
  }

  if (uniqueUrls.length > 0) {
    return {
      url: uniqueUrls[0],
      type: 'listing',
    };
  }

  return {
    url: '',
    type: 'none',
  };
};

const ApplyAssistant = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { state } = useLocation();

  const [job, setJob] = useState(state?.job || null);
  const [resumeId, setResumeId] = useState(state?.resumeId || null);
  const [generatedContent, setGeneratedContent] = useState(state?.generatedContent || null);
  const [resumeSnapshot, setResumeSnapshot] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [status, setStatus] = useState('SAVED');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [checks, setChecks] = useState({
    resumeReady: true,
    coverLetterReady: true,
    portfolioReady: false,
    linkedinReady: false,
  });

  const applyMeta = getApplyUrlMeta(job);

  useEffect(() => {
    const initialize = async () => {
      let selectedResumeId = resumeId;

      if (!selectedResumeId) {
        const allResumes = await resumeService.getAllResumes();
        if (allResumes.success && allResumes.data?.resumes?.length > 0) {
          selectedResumeId = allResumes.data.resumes[0].id;
          setResumeId(selectedResumeId);
        }
      }

      if (selectedResumeId) {
        const resumeResult = await resumeService.getResume(selectedResumeId);
        if (resumeResult.success) {
          const personal = resumeResult.data?.content?.personal || {};
          setName(`${personal.firstName || ''} ${personal.lastName || ''}`.trim());
          setEmail(personal.email || '');
          setResumeSnapshot({
            title: resumeResult.data?.title || 'Latest Resume',
            targetRole: personal.title || '',
            skills: (resumeResult.data?.content?.skills || []).slice(0, 6),
          });
        }
      }

      if (generatedContent?.coverLetter) {
        setCoverLetter(generatedContent.coverLetter);
      }
    };

    initialize();
  }, []);

  const saveApplication = async (nextStatus) => {
    if (!job) {
      setMessage('Job context missing. Please open this page from Job Details.');
      return false;
    }

    setSaving(true);
    setMessage('');

    const result = await applicationService.saveApplication({
      jobId: job.id || jobId,
      resumeId,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      matchScore: job.matchScore || 0,
      status: nextStatus,
      redirectUrl: applyMeta.url || job.redirectUrl,
      coverLetter,
    });

    setSaving(false);

    if (result.success) {
      setMessage(nextStatus === 'APPLIED' ? 'Application saved and marked as APPLIED.' : 'Application saved successfully.');
      return true;
    }

    setMessage(result.message || 'Could not save application.');
    return false;
  };

  const handleApply = async () => {
    const ok = await saveApplication('APPLIED');
    if (ok && applyMeta.url) {
      window.open(applyMeta.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!applyMeta.url) {
      setMessage('Direct company website link is not available for this listing yet.');
    }
  };

  if (!job) {
    return (
      <div className="apply-page">
        <div className="apply-card">
          <h1>Apply Assistant</h1>
          <p>Missing job data for this page. Please start from Jobs.</p>
          <button onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-card">
        <h1>Apply Assistant</h1>
        <p className="subtitle">{job.title} at {job.company}</p>

        <section className="application-kit">
          <h2>Application Kit</h2>
          <p>Use your latest resume details and required checklist before applying on the company website.</p>

          <div className="kit-grid">
            <div className="kit-card">
              <h3>Resume Snapshot</h3>
              <p><strong>Title:</strong> {resumeSnapshot?.title || 'Latest Resume'}</p>
              <p><strong>Target Role:</strong> {resumeSnapshot?.targetRole || roleFallback(job.title)}</p>
              <p><strong>Top Skills:</strong> {resumeSnapshot?.skills?.length ? resumeSnapshot.skills.join(', ') : 'Update skills in your profile.'}</p>
              <button type="button" onClick={() => navigate('/profile')} className="secondary-link-btn">
                Open Resume Profile
              </button>
            </div>

            <div className="kit-card">
              <h3>Required Before Apply</h3>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={checks.resumeReady}
                  onChange={(e) => setChecks((prev) => ({ ...prev, resumeReady: e.target.checked }))}
                />
                Resume attached
              </label>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={checks.coverLetterReady}
                  onChange={(e) => setChecks((prev) => ({ ...prev, coverLetterReady: e.target.checked }))}
                />
                Cover letter ready
              </label>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={checks.portfolioReady}
                  onChange={(e) => setChecks((prev) => ({ ...prev, portfolioReady: e.target.checked }))}
                />
                Portfolio link ready
              </label>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={checks.linkedinReady}
                  onChange={(e) => setChecks((prev) => ({ ...prev, linkedinReady: e.target.checked }))}
                />
                LinkedIn profile updated
              </label>
            </div>
          </div>
        </section>

        <div className="field-grid">
          <label>
            Full Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <label>
          Cover Letter
          <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={12} />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="SAVED">SAVED</option>
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="REJECTED">REJECTED</option>
            <option value="OFFER">OFFER</option>
          </select>
        </label>

        <div className="apply-actions">
          <button disabled={saving} onClick={() => saveApplication(status)} className="secondary">
            <Save size={16} /> {saving ? 'Saving...' : 'Save History'}
          </button>
          <button disabled={saving || !applyMeta.url} onClick={handleApply}>
            <ExternalLink size={16} /> {applyMeta.type === 'company' ? 'Save + Apply on Company Website' : 'Save + Open Job Listing'}
          </button>
        </div>

        {applyMeta.url && (
          <a href={applyMeta.url} target="_blank" rel="noreferrer" className="direct-link-note">
            {applyMeta.type === 'company' ? 'Direct company website:' : 'Verified listing URL:'} {applyMeta.url}
          </a>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

const roleFallback = (jobTitle) => jobTitle || 'Target role';

export default ApplyAssistant;
