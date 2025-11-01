import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import bgVideo from '@assets/Medical prescription.mp4';

export function GetStartedPage() {
  const gh = (import.meta as any).env?.VITE_GITHUB_URL || '';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.loop = false;
    v.muted = true;

    const onLoaded = () => {
      try {
        v.currentTime = 0;
        const p = v.play();
        if (p && typeof (p as any).then === 'function') (p as Promise<void>).catch(() => {});
      } catch {}
    };
    const onEnded = () => {
      try { v.pause(); } catch {}
    };

    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('ended', onEnded);
    if (v.readyState >= 1) onLoaded();

    return () => {
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div className="stack" style={{ position: 'relative' }}>
      {/* Foreground hero with inline parallax video on the side */}
      <section className="hero card z-row z-row-1" data-row={1} style={{ overflow: 'hidden' }}>
        <div className="hero-grid">
          <div className="stack">
            <h1>Welcome to Medical Camp</h1>
            <p className="sub">Streamline health screenings, manage patients, and track progress — all in one secure platform.</p>
            <div className="hero-cta">
              <Link to="/signup" className="btn btn-primary pulse">Get Started</Link>
              <a href="#features" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
          <div ref={wrapRef} className="inline-video-wrap" aria-hidden>
            <div className="inline-video-frame">
              <video
                ref={videoRef}
                className="bg-video"
                src={bgVideo}
                muted
                autoPlay
                playsInline
                preload="auto"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="z-row z-row-2" data-row={2}>
        <div className="grid grid-3">
        <article className="card">
          <h3 className="feature-title">Patient Registration</h3>
          <p className="feature-desc">Simple onboarding flows with role-aware access for patients and staff.</p>
        </article>
        <article className="card">
          <h3 className="feature-title">Health Screening Dashboard</h3>
          <p className="feature-desc">View upcoming screenings, history, and personalized health scores.</p>
        </article>
        <article className="card">
          <h3 className="feature-title">Bank-Grade Security</h3>
          <p className="feature-desc">We protect patient data with industry-leading encryption and strict access controls to ensure complete privacy and compliance.</p>
        </article>
        </div>
      </section>

      <section id="privacy" className="card z-row z-row-4" data-row={4}>
        <h3 style={{ marginTop: 0 }}>Privacy Policy</h3>
        <p className="feature-desc">HIPAA-Compliant. Data Privacy Guaranteed. Secure Patient Records.</p>
        <p className="muted">We use end-to-end encryption in transit and at rest, with strict access controls and auditing to keep your information safe.</p>
      </section>

      <section id="description" className="card z-row z-row-5" data-row={5}>
        <h3 style={{ marginTop: 0 }}>About Medical Camp</h3>
        <p className="feature-desc">A modern platform to organize medical camps, streamline patient registrations, manage staff, and track health outcomes.</p>
        <p className="muted">This is placeholder content demonstrating a descriptive section at the bottom of the landing page.</p>
      </section>

      {/* Dummy content to extend the page */}
      <section id="more" className="card z-row z-row-6" data-row={6}>
        <h3 style={{ marginTop: 0 }}>More Information</h3>
        <p className="muted">The following is dummy content to extend the page for demonstration and testing of scroll-linked effects.</p>
        <ul className="muted" style={{ lineHeight: 1.8 }}>
          <li>Mobile clinics coordination guidelines and checklists.</li>
          <li>Best practices for patient intake and triage.</li>
          <li>Sample screening protocols and follow‑up templates.</li>
          <li>Volunteer onboarding and staff shift scheduling samples.</li>
          <li>Offline-first considerations and sync strategies.</li>
          <li>Data export formats and interoperability notes.</li>
          <li>Security posture overview and audit readiness tips.</li>
          <li>Community engagement toolkit and outreach tips.</li>
        </ul>
        <p className="muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique lorem eget augue pharetra, quis accumsan justo aliquam. Donec rutrum, augue ac ullamcorper elementum, tortor mauris lacinia lorem, et placerat odio lectus eget metus. Cras ultrices, mi nec fermentum dictum, ligula sapien efficitur ipsum, nec sollicitudin lorem nunc a eros.</p>
      </section>

      <footer className="site-footer z-row z-row-7" data-row={7}>
        <div>
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          {gh && <a href={gh} target="_blank" rel="noreferrer">GitHub</a>}
        </div>
      </footer>

    </div>
  );
}
