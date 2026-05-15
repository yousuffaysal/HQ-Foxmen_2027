import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="logo-row">
              <Image className="mark" src="/assets/logo-mark.svg" alt="" width={44} height={44} />
              <span className="wm">Foxmen Studio</span>
            </div>
            <p>
              International digital studio. We design, engineer, and grow products
              for ambitious teams across 17 countries.
            </p>
            <NewsletterForm />
          </div>

          <div className="foot-col">
            <h4>Studio</h4>
            <ul>
              <li><Link href="/work">Work</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/#process">Process</Link></li>
              <li><Link href="/journal">Journal</Link></li>
              <li>
                <Link href="/contact">
                  Careers <span style={{ color: "var(--brand)" }}>· 3 open</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/services#web">Web · Apps</Link></li>
              <li><Link href="/services#ai">AI Integration</Link></li>
              <li><Link href="/services#commerce">Ecommerce</Link></li>
              <li><Link href="/services#real-estate">Real Estate</Link></li>
              <li><Link href="/services#brand">Brand · Design</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@foxmen.studio">hello@foxmen.studio</a></li>
              <li><a href="tel:+10000000000">+1 (000) 000–0000</a></li>
              <li className="with-dot">Remote · Worldwide</li>
              <li className="with-dot">HQ — Dhaka · Berlin</li>
            </ul>
          </div>
        </div>

        <div className="foot-giant" aria-hidden="true">
          <Image src="/assets/logo_sn_fox.png" alt="" width={140} height={140} className="foot-giant-logo" />
          <div className="foot-giant-text">
            Foxmen <span className="it">Studio</span>
          </div>
        </div>

        <div className="foot-bottom">
          <div>© 2026 Foxmen Studio · All rights reserved</div>
          <div className="socials">
            <a href="#" aria-label="Twitter / X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
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
          <div>Code · Craft · Care</div>
        </div>
      </div>
    </footer>
  );
}
