import Link from "next/link";

export default function Footer() {
  return (
    <section id="footer" style={{ padding: "80px 0" }}>
      <div className="foot">
        {/* Top bar row */}
        <div className="foot-top">
          <div className="foot-top-left">
            <div className="foot-brand-small">
              <span className="foot-brand-name">FOXMEN STUDIO</span>
              <span className="foot-brand-tm">™</span>
            </div>
            <div className="foot-top-location">
              Dhaka, New York, Remote worldwide
            </div>
          </div>
          <nav className="foot-top-nav">
            <Link href="/">Home</Link>
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="foot-rule" />

        {/* Hero title + email row */}
        <div className="foot-hero">
          <h2 className="foot-hero-title">Work with us</h2>
          <a className="foot-hero-email" href="mailto:hello@foxmenstudio.com">
            hello@foxmenstudio.com
          </a>
        </div>

        <div className="foot-rule" />

        {/* Middle links columns row (Sitemap + Socials) */}
        <div className="foot-mid">
          <div className="foot-cols">
            <div className="foot-col">
              <div className="foot-col-title">Sitemap</div>
              <ul className="foot-col-list">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/work">Work</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="foot-col">
              <div className="foot-col-title">Socials</div>
              <ul className="foot-col-list">
                <li><a href="https://www.instagram.com/foxmen_studio/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://x.com/FoxmenStudio" target="_blank" rel="noopener noreferrer">X</a></li>
                <li><a href="https://www.linkedin.com/company/foxmen-studio/" target="_blank" rel="noopener noreferrer">Linkedin</a></li>
                <li><a href="https://dribbble.com/foxmen-studio" target="_blank" rel="noopener noreferrer">Dribbble</a></li>
                <li><a href="https://www.facebook.com/people/Foxmen-Studio/61579940840061/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant brand wordmark row */}
        <div className="foot-giant">
          <span className="foot-giant-foxmen">FOXMEN</span>
          <span className="foot-giant-studio">STUDIO</span>
          <span className="foot-giant-tm">™</span>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="foot-bottom">
          <div className="foot-bottom-links">
            <Link href="/contact">Terms</Link>
            <Link href="/contact">Privacy Policy</Link>
          </div>
          <div className="foot-bottom-copy">
            © 2026 Foxmen Studio. All rights reserved
          </div>
        </div>
      </div>
    </section>
  );
}
