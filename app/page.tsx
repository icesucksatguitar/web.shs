"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";

const navItems = ["Home", "About", "Contact", "Updates"];

const aboutCopy =
  "Still Hollow Studios crafts cinematic narrative worlds where painterly landscapes meet immersive storytelling. We build adventure experiences rooted in atmosphere, mystery, and the quiet tension between beauty and decay.";

const flightCopy =
  'Amidst the solemn silence, the only sound that punctuated the room was the persistent beeping of the radars, a monotonous reminder of the urgency of the situation. A lone air traffic control officer\'s voice crackled through the radio, desperately attempting to establish contact with "Trainee Flight 914". Their voice trembled with a mix of worry and apprehension, each call met with a haunting silence.';

const updateCards = [
  { id: "project", title: "Project Reveal", desc: "First look at our debut title — coming soon." },
  { id: "devlog", title: "Dev Log", desc: "Behind-the-scenes notes from the studio." },
  { id: "community", title: "Community", desc: "Join us as we build something extraordinary." },
] as const;

const teamMembers = [
  {
    name: "Pyxis",
    role: "Creative Director & Narrative Design",
    instagram: "https://instagram.com/",
    email: "mailto:stillhollowstudios@gmail.com",
  },
  {
    name: "Proxima",
    role: "Lead Developer & Systems Architect",
    instagram: "https://instagram.com/",
    email: "mailto:stillhollowstudios@gmail.com",
  },
  {
    name: "Pleiades",
    role: "Art Direction & Visual Worldbuilding",
    instagram: "https://instagram.com/",
    email: "mailto:stillhollowstudios@gmail.com",
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
  { label: "Twitter", href: "https://twitter.com/", icon: "twitter" },
  { label: "Discord", href: "https://discord.gg/", icon: "discord" },
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

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
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

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [navTop, setNavTop] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
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
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  /* ── Navbar: simple scroll-based class toggle ── */
  useEffect(() => {
    const onScroll = () => {
      setNavTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── GSAP animations (no nav animation here) ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.14,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);

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

      gsap.fromTo(
        ".story-box",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".story",
            start: "top 72%",
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
              start: "top 85%",
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
    };
  }, []);

  const handleCardClick = useCallback((id: (typeof updateCards)[number]["id"]) => {
    if (id === "community") {
      window.open("https://discord.gg/", "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "devlog") setModal("devlog");
    if (id === "project") setModal("project");
  }, []);

  const closeModal = useCallback(() => setModal(null), []);
  const footerCopy = `© ${new Date().getFullYear()} Still Hollow Studio™. All rights reserved.`;

  return (
    <>
      <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />

      <div className={`loader ${loaded ? "loader--hidden" : ""}`} aria-hidden={loaded}>
        <div className="loader-depth loader-depth--1" />
        <div className="loader-depth loader-depth--2" />
        <span>S</span>
      </div>

      <nav className={`site-nav ${navTop ? "site-nav--top" : ""}`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item} href={item === "Home" ? "#home" : `#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>

      <main className="site">
        <div className="bg-glow bg-glow--1" aria-hidden="true" />
        <div className="bg-glow bg-glow--2" aria-hidden="true" />

        <section className="landing" id="home" aria-label="Still Hollow Studios opening">
          <div className="image-frame">
            <div className="hero-placeholder" aria-hidden="true">
              <span>Hero Image</span>
            </div>
            <div className="image-grade" />
            <h1 className="hero-title">
              <span>Still Hollow</span>
              <strong>Studios</strong>
            </h1>
          </div>

          <p className="coming-soon">Coming Soon</p>
        </section>

        <section className="about" id="about" aria-label="About Still Hollow Studios">
          <div className="about-card">
            <div className="about-image-wrap">
              <div className="about-image-placeholder" aria-hidden="true">
                <span>Studio Art</span>
              </div>
            </div>
            <div className="about-content">
              <p className="section-label">About</p>
              <h2>Our Story</h2>
              <p>{aboutCopy}</p>
              <a className="learn-more" href="#story">
                Learn More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="story" id="story" aria-label="Narrative excerpt">
          <div className="story-inner">
            <article className="story-box">
              <p className="section-label">Narrative</p>
              <p>{flightCopy}</p>
            </article>
          </div>
        </section>

        <section className="quiet-section" id="updates" aria-label="Studio updates">
          <div className="soft-reveal updates-wrap">
            <p className="section-label">Updates</p>
            <h2>What&apos;s Next</h2>
            <p className="section-desc">
              Follow our journey as we craft worlds worth getting lost in.
            </p>
            <div className="updates-grid">
              {updateCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="update-card"
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="update-card-placeholder" aria-hidden="true">
                    <span>Image</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="quiet-section quiet-section--contact" id="contact" aria-label="Contact">
          <div className="soft-reveal">
            <p className="section-label">Contact</p>
            <h2>Get in Touch</h2>
            <a href="mailto:stillhollowstudios@gmail.com">stillhollowstudios@gmail.com</a>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-socials">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <SocialIcon icon={link.icon} />
              </a>
            ))}
          </div>
          <p className="footer-copy">{footerCopy}</p>
        </footer>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="modal"
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
                <h2 id="modal-title">Coming Soon</h2>
                <p className="modal-desc">
                  Our debut title is currently in development. Stay tuned for the first official
                  reveal — a cinematic narrative experience unlike anything we&apos;ve shared before.
                </p>
              </>
            )}

            {modal === "devlog" && (
              <>
                <p className="section-label">Dev Log</p>
                <h2 id="modal-title">The Team</h2>
                <p className="modal-desc">
                  Still Hollow Studio is built by a small, dedicated team of creators.
                </p>
                <div className="team-grid">
                  {teamMembers.map((member) => (
                    <div key={member.name} className="team-member">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                      <div className="team-links">
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`}>
                          <InstagramIcon />
                        </a>
                        <a href={member.email} aria-label={`Email ${member.name}`}>
                          <GmailIcon />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
