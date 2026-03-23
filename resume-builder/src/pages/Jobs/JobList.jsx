import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, CalendarDays, ChevronDown, ChevronUp, Filter, MapPin, Search, Sparkles, X } from 'lucide-react';
import { jobService, resumeService } from '../../services';
import './JobList.css';

const PAGE_SIZE = 21;
const FILTER_PREFS_KEY = 'jobsFilterPrefs';

const INTERNSHIP_REGEX = /\bintern(ship)?\b|\btrainee\b|\bgraduate intern\b/i;
const PERMANENT_REGEX = /\bpermanent\b|\bfull[-\s]?time\b|\bregular\b/i;
const REMOTE_REGEX = /\bremote\b|\bwork from home\b|\bhybrid remote\b/i;
const HYBRID_REGEX = /\bhybrid\b/i;
const ONSITE_REGEX = /\bonsite\b|\bon-site\b|\bon site\b/i;

const inferJobType = (job) => {
  const haystack = `${job?.title || ''} ${job?.description || ''}`;
  if (INTERNSHIP_REGEX.test(haystack)) {
    return 'internship';
  }
  if (PERMANENT_REGEX.test(haystack)) {
    return 'permanent';
  }
  return 'other';
};

const inferWorkMode = (job) => {
  const haystack = `${job?.title || ''} ${job?.description || ''} ${job?.location || ''}`;
  if (REMOTE_REGEX.test(haystack)) {
    return 'remote';
  }
  if (HYBRID_REGEX.test(haystack)) {
    return 'hybrid';
  }
  if (ONSITE_REGEX.test(haystack)) {
    return 'onsite';
  }
  return 'any';
};

const toLabel = (value) => {
  if (!value) return 'Not specified';
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const getPreviewText = (value, maxLength = 140) => {
  if (!value) return 'No description available right now.';

  const clean = String(value).replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength)}...`;
};

const JobList = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Software Engineer');
  const [jobs, setJobs] = useState([]);
  const [bestMatches, setBestMatches] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [postedFilter, setPostedFilter] = useState('all');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [bootstrapComplete, setBootstrapComplete] = useState(false);

  const topBestMatches = useMemo(() => bestMatches.slice(0, 5), [bestMatches]);

  const filteredJobs = useMemo(() => {
    const now = Date.now();
    return jobs.filter((job) => {
      const typeOk = jobTypeFilter === 'all' || inferJobType(job) === jobTypeFilter;
      const modeOk = workModeFilter === 'all' || inferWorkMode(job) === workModeFilter;
      const normalizedCompany = String(job.company || 'Unknown company').toLowerCase();
      const companyOk = selectedCompanies.length === 0 || selectedCompanies.includes(normalizedCompany);

      let postedOk = true;
      if (postedFilter !== 'all') {
        const postedDate = job?.postedAt ? new Date(job.postedAt).getTime() : NaN;
        if (Number.isNaN(postedDate)) {
          postedOk = postedFilter === 'older';
        } else {
          const daysOld = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
          if (postedFilter === '7d') postedOk = daysOld <= 7;
          if (postedFilter === '30d') postedOk = daysOld > 7 && daysOld <= 30;
          if (postedFilter === 'older') postedOk = daysOld > 30;
        }
      }

      const scoreOk = (job.matchScore || 0) >= minMatchScore;

      return typeOk && modeOk && companyOk && postedOk && scoreOk;
    });
  }, [jobs, jobTypeFilter, workModeFilter, selectedCompanies, postedFilter, minMatchScore]);

  const companyOptions = useMemo(() => {
    const allCompanies = jobs
      .map((job) => String(job.company || 'Unknown company').trim())
      .filter(Boolean);

    return Array.from(new Set(allCompanies)).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const postedBuckets = useMemo(() => {
    const now = Date.now();
    const buckets = {
      '7d': 0,
      '30d': 0,
      older: 0,
    };

    jobs.forEach((job) => {
      const postedDate = job?.postedAt ? new Date(job.postedAt).getTime() : NaN;
      if (Number.isNaN(postedDate)) {
        buckets.older += 1;
        return;
      }

      const daysOld = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
      if (daysOld <= 7) buckets['7d'] += 1;
      else if (daysOld <= 30) buckets['30d'] += 1;
      else buckets.older += 1;
    });

    return buckets;
  }, [jobs]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (jobTypeFilter !== 'all') {
      chips.push({
        key: `jobType-${jobTypeFilter}`,
        label: `Type: ${toLabel(jobTypeFilter)}`,
        clear: () => setJobTypeFilter('all'),
      });
    }

    if (workModeFilter !== 'all') {
      chips.push({
        key: `workMode-${workModeFilter}`,
        label: `Mode: ${toLabel(workModeFilter)}`,
        clear: () => setWorkModeFilter('all'),
      });
    }

    if (postedFilter !== 'all') {
      const postedLabelMap = {
        '7d': 'Last 7 Days',
        '30d': 'Last 8-30 Days',
        older: 'Older/Unknown',
      };
      chips.push({
        key: `posted-${postedFilter}`,
        label: `Posted: ${postedLabelMap[postedFilter] || postedFilter}`,
        clear: () => setPostedFilter('all'),
      });
    }

    if (minMatchScore > 0) {
      chips.push({
        key: `score-${minMatchScore}`,
        label: `Min Score: ${minMatchScore}%`,
        clear: () => setMinMatchScore(0),
      });
    }

    selectedCompanies.forEach((company) => {
      chips.push({
        key: `company-${company}`,
        label: `Company: ${company}`,
        clear: () => setSelectedCompanies((prev) => prev.filter((item) => item !== company)),
      });
    });

    return chips;
  }, [jobTypeFilter, minMatchScore, postedFilter, selectedCompanies, workModeFilter]);

  const resetFilters = () => {
    setJobTypeFilter('all');
    setWorkModeFilter('all');
    setSelectedCompanies([]);
    setPostedFilter('all');
    setMinMatchScore(0);
  };

  const internshipCount = useMemo(() => jobs.filter((job) => inferJobType(job) === 'internship').length, [jobs]);
  const permanentCount = useMemo(() => jobs.filter((job) => inferJobType(job) === 'permanent').length, [jobs]);
  const remoteCount = useMemo(() => jobs.filter((job) => inferWorkMode(job) === 'remote').length, [jobs]);
  const hybridCount = useMemo(() => jobs.filter((job) => inferWorkMode(job) === 'hybrid').length, [jobs]);
  const onsiteCount = useMemo(() => jobs.filter((job) => inferWorkMode(job) === 'onsite').length, [jobs]);
  const totalPages = useMemo(() => {
    if (totalResults > 0) {
      return Math.ceil(totalResults / PAGE_SIZE);
    }

    if (jobs.length === PAGE_SIZE) {
      return currentPage + 1;
    }

    return Math.max(1, currentPage);
  }, [totalResults, jobs.length, currentPage]);

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

  useEffect(() => {
    try {
      const savedPrefsRaw = localStorage.getItem(FILTER_PREFS_KEY);
      if (savedPrefsRaw) {
        const savedPrefs = JSON.parse(savedPrefsRaw);
        setJobTypeFilter(savedPrefs.jobTypeFilter || 'all');
        setWorkModeFilter(savedPrefs.workModeFilter || 'all');
        setSelectedCompanies(Array.isArray(savedPrefs.selectedCompanies) ? savedPrefs.selectedCompanies : []);
        setPostedFilter(savedPrefs.postedFilter || 'all');
        setMinMatchScore(Number.isFinite(savedPrefs.minMatchScore) ? savedPrefs.minMatchScore : 0);
      }
    } catch {
      // Ignore invalid stored filters.
    }

    const bootstrap = async () => {
      const resumesResult = await resumeService.getAllResumes();
      let nextRole = role;

      if (resumesResult.success && resumesResult.data?.resumes?.length > 0) {
        const latestResume = resumesResult.data.resumes[0];
        setResumeId(latestResume.id);
        const targetRole = latestResume.content?.personal?.title;
        if (targetRole) {
          setRole(targetRole);
          nextRole = targetRole;
        }
      }

      setBootstrapComplete(true);
      fetchJobs(nextRole, 1, true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const payload = {
      jobTypeFilter,
      workModeFilter,
      selectedCompanies,
      postedFilter,
      minMatchScore,
    };
    localStorage.setItem(FILTER_PREFS_KEY, JSON.stringify(payload));
  }, [jobTypeFilter, minMatchScore, postedFilter, selectedCompanies, workModeFilter]);

  const fetchJobs = async (roleToSearch, page = 1, refreshTopMatches = false) => {
    if (!bootstrapComplete && page !== 1) {
      return;
    }

    if (!roleToSearch?.trim()) {
      setError('Please enter a role');
      return;
    }

    setLoading(true);
    setError('');

    const result = await jobService.fetchJobs({ role: roleToSearch, resumeId, page, limit: PAGE_SIZE });
    if (result.success) {
      setJobs(result.data?.results || []);
      setTotalResults(result.data?.total || 0);
      if (refreshTopMatches || bestMatches.length === 0) {
        setBestMatches((result.data?.bestMatches || []).slice(0, 5));
      }
      setCurrentPage(page);
    } else {
      setError(result.message || 'Failed to fetch jobs');
      setJobs([]);
      setBestMatches([]);
      setTotalResults(0);
    }

    setLoading(false);
  };

  const handleViewDetails = (job) => {
    navigate(`/jobs/${encodeURIComponent(job.id)}`, {
      state: {
        job,
        resumeId,
        jobMeta: {
          jobType: inferJobType(job),
          workMode: inferWorkMode(job),
        },
      },
    });
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = jobs.length === PAGE_SIZE && currentPage < totalPages;

  return (
    <div className="job-list-page">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="job-list-header">
        <div>
          <h1>Smart Job Match</h1>
          <p>Clean job cards with quick scan details. Open any card to view complete job information.</p>
        </div>

        <form
          className="job-search"
          onSubmit={(e) => {
            e.preventDefault();
            fetchJobs(role, 1, true);
          }}
        >
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter role (e.g., Frontend Developer)"
          />
          <button type="submit" disabled={loading}>
            <Search size={16} />
            {loading ? 'Searching...' : 'Fetch Jobs'}
          </button>
        </form>
      </div>

      {error && <div className="job-error">{error}</div>}

      <section className="best-jobs-section">
        <h2>
          <Sparkles size={18} />
          Top 5 Best Matches
        </h2>

        {topBestMatches.length === 0 && !loading && <p className="empty-text">No matched jobs yet.</p>}

        <div className="job-grid top-best-grid">
          {topBestMatches.map((job) => {
            return (
            <article
              key={`best-${job.id}`}
              className="job-card best clickable-card"
              onClick={() => handleViewDetails(job)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleViewDetails(job);
                }
              }}
            >
              <span className="match-pill">Match: {job.matchScore || 0}%</span>
              <h3>{job.title}</h3>
              <p className="meta-row">
                <Briefcase size={14} /> {job.company || 'Unknown company'}
              </p>
              <p className="meta-row">
                <MapPin size={14} /> {job.location || 'Location not specified'}
              </p>
              <p className="meta-row subtle">
                <CalendarDays size={14} /> {formatPostedAt(job.postedAt)}
              </p>
              <p className="description">{getPreviewText(job.description)}</p>
              <div className="card-footer">
                <button
                  type="button"
                  className="card-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleViewDetails(job);
                  }}
                >
                  View Full Details <ArrowRight size={15} />
                </button>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="jobs-top-row">
          <h2>All Jobs</h2>

          <div className="filters-box compact" role="group" aria-label="Job filters">
            <button
              type="button"
              className="filter-toggle"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              aria-expanded={isFilterOpen}
            >
              <span><Filter size={16} /> Filters</span>
              {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isFilterOpen && (
                <div className="filters-popover">
                <div className="filters-grid">
                  <label>
                    Job Type
                    <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
                      <option value="all">All ({jobs.length})</option>
                      <option value="internship">Internships ({internshipCount})</option>
                      <option value="permanent">Permanent ({permanentCount})</option>
                      <option value="other">Other ({Math.max(0, jobs.length - internshipCount - permanentCount)})</option>
                    </select>
                  </label>

                  <label>
                    Work Mode
                    <select value={workModeFilter} onChange={(e) => setWorkModeFilter(e.target.value)}>
                      <option value="all">Any Mode ({jobs.length})</option>
                      <option value="remote">Remote ({remoteCount})</option>
                      <option value="hybrid">Hybrid ({hybridCount})</option>
                      <option value="onsite">Onsite ({onsiteCount})</option>
                      <option value="any">Not Specified ({Math.max(0, jobs.length - remoteCount - hybridCount - onsiteCount)})</option>
                    </select>
                  </label>

                  <label>
                    Company (Dynamic Multi-Select)
                    <div className="company-options-box" role="group" aria-label="Company options">
                      {companyOptions.length === 0 && <span className="company-empty">No companies found on this page</span>}
                      {companyOptions.map((company) => {
                        const normalizedCompany = company.toLowerCase();
                        const checked = selectedCompanies.includes(normalizedCompany);
                        return (
                          <label className="company-option" key={company}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setSelectedCompanies((prev) => [...prev, normalizedCompany]);
                                } else {
                                  setSelectedCompanies((prev) => prev.filter((item) => item !== normalizedCompany));
                                }
                              }}
                            />
                            <span>{company}</span>
                          </label>
                        );
                      })}
                    </div>
                  </label>

                  <label>
                    Posted Date
                    <select value={postedFilter} onChange={(e) => setPostedFilter(e.target.value)}>
                      <option value="all">Any Time ({jobs.length})</option>
                      <option value="7d">Last 7 Days ({postedBuckets['7d']})</option>
                      <option value="30d">Last 8-30 Days ({postedBuckets['30d']})</option>
                      <option value="older">Older / Unknown ({postedBuckets.older})</option>
                    </select>
                  </label>

                  <label className="score-filter-box" htmlFor="match-score">
                    Min Match Score: <span>{minMatchScore}%</span>
                    <input
                      id="match-score"
                      type="range"
                      min="0"
                      max="100"
                      value={minMatchScore}
                      onChange={(e) => setMinMatchScore(Number(e.target.value))}
                    />
                  </label>
                </div>

                <div className="filters-actions">
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="jobs-stats-grid">
          <div className="stat-card">
            <span>Total This Page</span>
            <strong>{jobs.length}</strong>
          </div>
          <div className="stat-card">
            <span>Remote</span>
            <strong>{remoteCount}</strong>
          </div>
          <div className="stat-card">
            <span>Internships</span>
            <strong>{internshipCount}</strong>
          </div>
          <div className="stat-card">
            <span>Permanent</span>
            <strong>{permanentCount}</strong>
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {activeFilterChips.map((chip) => (
              <button key={chip.key} type="button" className="filter-chip" onClick={chip.clear}>
                {chip.label} <X size={13} />
              </button>
            ))}
          </div>
        )}

        {filteredJobs.length === 0 && !loading && <p className="empty-text">No jobs found for this filter.</p>}

        <div className="job-grid all-jobs-grid">
          {filteredJobs.map((job) => {
            return (
            <article
              key={job.id}
              className="job-card clickable-card"
              onClick={() => handleViewDetails(job)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleViewDetails(job);
                }
              }}
            >
              <span className="match-pill">Match: {job.matchScore || 0}%</span>
              <h3>{job.title}</h3>
              <p className="meta-row">
                <Briefcase size={14} /> {job.company || 'Unknown company'}
              </p>
              <p className="meta-row">
                <MapPin size={14} /> {job.location || 'Location not specified'}
              </p>
              <p className="meta-row subtle">
                <CalendarDays size={14} /> {formatPostedAt(job.postedAt)}
              </p>
              <p className="description">{getPreviewText(job.description)}</p>
              <div className="card-footer">
                <button
                  type="button"
                  className="card-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleViewDetails(job);
                  }}
                >
                  View Full Details <ArrowRight size={15} />
                </button>
              </div>
            </article>
            );
          })}
        </div>

        <div className="jobs-pagination" role="navigation" aria-label="Jobs pagination">
          <button disabled={!canGoPrev || loading} onClick={() => fetchJobs(role, currentPage - 1, false)}>
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button disabled={!canGoNext || loading} onClick={() => fetchJobs(role, currentPage + 1, false)}>
            Next
          </button>
        </div>
        <p className="pagination-note">Showing {jobs.length} jobs on this page. Page size: {PAGE_SIZE}.</p>
      </section>
    </div>
  );
};

export default JobList;
