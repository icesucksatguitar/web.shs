"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import { AsciiArt, HeroAscii, Transmission } from "./ascii";
import { campfireArt, heroArt, lakeArt, lookoutArt, radioArt } from "./ascii-art";
import { moonGlyph, pleiadesGlyph, proximaGlyph, pyxisGlyph, radioGlyph, sunGlyph } from "./ascii-glyphs";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "updates", label: "Updates" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
];

const studioEmail = "helios@stillhollow.me";
const discordUrl = "https://discord.gg/";

const aboutCopy =
  "Stillhollow Studio crafts cinematic narrative worlds where painterly landscapes meet immersive storytelling. We build adventure experiences rooted in atmosphere, mystery, and the quiet tension between beauty and decay.";

const flightCopy =
  'Amidst the solemn silence, the only sound that punctuated the room was the persistent beeping of the radars, a monotonous reminder of the urgency of the situation. A lone air traffic control officer\'s voice crackled through the radio, desperately attempting to establish contact with "Trainee Flight 914". Their voice trembled with a mix of worry and apprehension, each call met with a haunting silence.';

const pillars = [
  {
    title: "Atmosphere",
    text: "Painterly landscapes you can almost feel — light, weather and silence doing as much of the storytelling as the dialogue.",
    glyph: sunGlyph,
  },
  {
    title: "Story",
    text: "Character-driven narratives told through voices, radio static and everything left unsaid between them.",
    glyph: radioGlyph,
  },
  {
    title: "Mystery",
    text: "The quiet tension between beauty and decay — worlds that reward curiosity and linger after the credits.",
    glyph: moonGlyph,
  },
];

const updateCards = [
  {
    id: "project",
    tag: "Reveal",
    title: "Project Reveal",
    desc: "A first look at our debut title.",
    art: lakeArt,
    artLabel: "ASCII art of a sunset over mountains, reflected in a lake",
  },
  {
    id: "devlog",
    tag: "Studio",
    title: "Dev Log",
    desc: "Behind-the-scenes notes from the studio.",
    art: radioArt,
    artLabel: "ASCII art of a two-way radio sending out a signal",
  },
  {
    id: "community",
    tag: "Discord",
    title: "Community",
    desc: "Join us as we build something extraordinary.",
    art: campfireArt,
    artLabel: "ASCII art of two people at a campfire between pine trees",
  },
] as const;

const teamMembers = [
  {
    name: "Pyxis",
    role: "Creative Director & Narrative Design",
    glyph: pyxisGlyph,
    instagram: "https://instagram.com/",
  },
  {
    name: "Proxima",
    role: "Lead Developer & Systems Architect",
    glyph: proximaGlyph,
    instagram: "https://instagram.com/",
  },
  {
    name: "Pleiades",
    role: "Art Direction & Visual Worldbuilding",
    glyph: pleiadesGlyph,
    instagram: "https://instagram.com/",
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
  { label: "Twitter", href: "https://twitter.com/", icon: "twitter" },
  { label: "Discord", href: discordUrl, icon: "discord" },
  { label: "Reddit", href: "https://reddit.com/", icon: "reddit" },
];

type ModalType = "devlog" | "project" | null;

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return <InstagramIcon />;
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="4" />
          <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.2 3H21l-6.5 7.4L22 21h-6.7l-5.2-6.8L4.5 21H2l7-8L2 3h6.9l4.7 6.2L18.2 3z" />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 12a1 1 0 100 .01M15 12a1 1 0 100 .01" fill="currentColor" stroke="none" />
          <path d="M7.5 7.5c2-1 4.5-1.5 4.5-1.5s2.5.5 4.5 1.5" />
          <path d="M7.5 16.5c2 1 4.5 1.5 4.5 1.5s2.5-.5 4.5-1.5" />
          <path d="M15.5 17l1 2.5c3-1 5-2.5 5-2.5 0-5.5-2-10-2-10s-2.5-2-5-2.5l-1 2" />
          <path d="M8.5 17l-1 2.5c-3-1-5-2.5-5-2.5 0-5.5 2-10 2-10s2.5-2 5-2.5l1 2" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="13" r="1" />
          <circle cx="15" cy="13" r="1" />
          <path d="M9 16c1 1 2.5 1.5 3 1.5s2-.5 3-1.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SocialLinks({ className }: { className: string }) {
  return (
    <div className={className}>
      {socialLinks.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
          <SocialIcon icon={link.icon} />
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [navTop, setNavTop] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [modal, setModal] = useState<ModalType>(null);
  const [copied, setCopied] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // The glow only makes sense with a mouse; skip the animation loop on touch devices.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      cursorTarget.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const el = cursorRef.current;
      if (el) {
        cursorPos.current.x += (cursorTarget.current.x - cursorPos.current.x) * 0.12;
        cursorPos.current.y += (cursorTarget.current.y - cursorPos.current.y) * 0.12;
        el.style.transform = `translate(${cursorPos.current.x - 80}px, ${cursorPos.current.y - 80}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modal) return;

    // Lenis drives the page scroll, so it has to be paused as well as the body.
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      lenisRef.current?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [modal]);

  /* ── Navbar: sits at the bottom on the hero, slides to the top once scrolled ── */
  useEffect(() => {
    const onScroll = () => {
      setNavTop(window.scrollY > window.innerHeight * 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ── Highlight the nav link of the section in the middle of the screen ── */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* ── Smooth scrolling + scroll animations ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to(".hero-title", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".image-frame", {
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.fromTo(
        ".about-card",
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".soft-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleCardClick = useCallback((id: (typeof updateCards)[number]["id"]) => {
    if (id === "community") {
      window.open(discordUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setModal(id);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(studioEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${studioEmail}`;
    }
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />

      <div className={`loader ${loaded ? "loader--hidden" : ""}`} aria-hidden="true">
        <div className="loader-depth loader-depth--1" />
        <div className="loader-depth loader-depth--2" />
        <div className="loader-inner">
          <span className="loader-mark">S</span>
          <span className="loader-status">
            Establishing signal<span className="loader-dots" />
          </span>
          <span className="loader-bar">
            <span />
          </span>
        </div>
      </div>

      <nav className={`site-nav ${navTop ? "site-nav--top" : ""}`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeSection === item.id ? "is-active" : undefined}
            aria-current={activeSection === item.id ? "location" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <main className="site">
        <div className="bg-glow bg-glow--1" aria-hidden="true" />
        <div className="bg-glow bg-glow--2" aria-hidden="true" />

        <section className="landing" id="home" aria-label="Stillhollow Studio opening">
          <div className="image-frame">
            <div className="hero-placeholder">
              <HeroAscii art={heroArt} active={loaded} />
            </div>
            <div className="image-grade" />
            <h1 className="hero-title">
              <span>Stillhollow</span>
              <strong>Studio</strong>
            </h1>
          </div>

          <div className="hero-meta">
            <p className="hero-lede">
              An independent studio making cinematic, narrative-driven adventures &mdash; painterly
              worlds with a quiet, haunting pulse.
            </p>
            <div className="hero-actions">
              <a className="btn btn--solid" href="#story">
                Hear the transmission
                <ArrowIcon />
              </a>
              <a className="btn btn--ghost" href={discordUrl} target="_blank" rel="noopener noreferrer">
                Join the Discord
              </a>
            </div>
          </div>
        </section>


        <section className="about" id="about" aria-label="About Stillhollow Studio">
          <div className="about-card">
            <div className="about-image-wrap">
              <div className="about-image-placeholder">
                <AsciiArt art={lookoutArt} label="ASCII art of a fire lookout tower among pine trees in front of a full moon" />
              </div>
            </div>
            <div className="about-content">
              <p className="section-label">About</p>
              <h2>Our Story</h2>
              <p>{aboutCopy}</p>
              <a className="learn-more" href="#story">
                Learn More
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        <section className="pillars" aria-label="What we make">
          <div className="section-head soft-reveal">
            <p className="section-label">What we make</p>
            <h2>Every world starts with three things</h2>
          </div>
          <div className="pillars-grid">
            {pillars.map((pillar, i) => (
              <article key={pillar.title} className="pillar soft-reveal">
                <span className="pillar-index">0{i + 1}</span>
                <pre className="pillar-glyph" aria-hidden="true">
                  {pillar.glyph.replace(/^\n/, "")}
                </pre>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="story" id="story" aria-label="Narrative excerpt">
          <article className="transmission soft-reveal">
            <header className="transmission-bar">
              <span className="transmission-rec">
                <span className="rec-dot" aria-hidden="true" />
                Transmission log
              </span>
              <span className="transmission-freq">CH 09 &middot; 121.5 MHz</span>
            </header>
            <p className="section-label section-label--inverse">Narrative excerpt</p>
            <h2 className="transmission-title">Trainee Flight 914, do you read?</h2>
            <Transmission text={flightCopy} />
          </article>
        </section>

        <section className="updates" id="updates" aria-label="Studio updates">
          <div className="section-head soft-reveal">
            <p className="section-label">Updates</p>
            <h2>What&apos;s Next</h2>
            <p className="section-desc">Follow our journey as we craft worlds worth getting lost in.</p>
          </div>
          <div className="updates-grid">
            {updateCards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                className="update-card soft-reveal"
                onClick={() => handleCardClick(card.id)}
              >
                <span className="update-card-placeholder">
                  <AsciiArt art={card.art} label={card.artLabel} />
                </span>
                <span className="update-card-meta">
                  <span>0{i + 1}</span>
                  <span>{card.tag}</span>
                </span>
                <span className="update-card-title">
                  {card.title}
                  <ArrowIcon />
                </span>
                <span className="update-card-desc">{card.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="team" id="team" aria-label="The team">
          <div className="section-head soft-reveal">
            <p className="section-label">The Team</p>
            <h2>Three stars, one lookout</h2>
            <p className="section-desc">A small, dedicated team of creators, each named for a point of light.</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.name} className="team-card soft-reveal">
                <pre className="team-glyph" aria-hidden="true">
                  {member.glyph.replace(/^\n/, "")}
                </pre>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="team-links">
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`}>
                    <InstagramIcon />
                  </a>
                  <a href={`mailto:${studioEmail}`} aria-label={`Email ${member.name}`}>
                    <MailIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact" aria-label="Contact">
          <div className="contact-panel soft-reveal">
            <p className="section-label">Contact</p>
            <h2>Send a signal</h2>
            <p className="section-desc">
              Press, collaborations, or just want to say hello &mdash; the tower is listening.
            </p>
            <div className="contact-actions">
              <a className="contact-email" href={`mailto:${studioEmail}`}>
                {studioEmail}
              </a>
              <button type="button" className="btn btn--ghost btn--small" onClick={copyEmail}>
                {copied ? "Copied!" : "Copy email"}
              </button>
            </div>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </section>

        <footer className="site-footer">
          <p className="footer-wordmark" aria-hidden="true">
            Stillhollow
          </p>
          <div className="footer-row">
            <SocialLinks className="footer-socials" />
            <a className="footer-email" href={`mailto:${studioEmail}`}>
              {studioEmail}
            </a>
            <p className="footer-copy">&copy; 2025 Stillhollow Studio. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="modal"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">
              &times;
            </button>

            {modal === "project" && (
              <>
                <p className="section-label">Project Reveal</p>
                <h2 id="modal-title">In Development</h2>
                <p className="modal-desc">
                  Our debut title is currently in development. Stay tuned for the first official
                  reveal — a cinematic narrative experience unlike anything we&apos;ve shared before.
                </p>
              </>
            )}

            {modal === "devlog" && (
              <>
                <p className="section-label">Dev Log</p>
                <h2 id="modal-title">Field Notes</h2>
                <p className="modal-desc">
                  Our dev log will follow the making of our debut title &mdash; sketches, systems and
                  the stories behind them. Follow along on our socials so you don&apos;t miss an entry.
                </p>
                <SocialLinks className="modal-socials" />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
