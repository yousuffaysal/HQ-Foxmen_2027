import Link from "next/link";

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">

        <div className="foot-cta">
          <p className="foot-cta-head">
            Have a project<br />
            <em>in mind?</em>
          </p>
          <div className="foot-cta-side">
            <a className="foot-cta-email" href="mailto:contact@foxmenstudio.com">
              contact@foxmenstudio.com
            </a>
            <Link href="/contact" className="btn btn--brand btn--lg">
              <span className="label">Start a project</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
          </div>
        </div>

        <div className="foot-rule" />

        <div className="foot-mid">
          <nav className="foot-links">
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/#process">Process</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Careers</Link>
          </nav>
          <div className="foot-social">
            <a href="#" aria-label="X / Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" />
              </svg>
            </a>
            <a href="#" aria-label="Dribbble">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3.5 14c5-1 9.5-.5 14 2M5 6.5c3.5 3 7 5 14 5.5M9 3.5c2.5 4 4 9 4 17" />
              </svg>
            </a>
          </div>
        </div>

        <div className="foot-rule" />

        <div className="foot-bar">
          <span>© 2026 Foxmen Studio · All rights reserved</span>
          <span>Code · Craft · Care</span>
        </div>

      </div>
    </footer>
  );
}
