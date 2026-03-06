import { useEffect, useState } from 'react';
import { PROJECTS, SKILLS, TYPED_STRINGS } from './utils/data';

function App() {
  // UI state for navbar style, mobile menu, hero typing text, and form behavior.
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Toggle "scrolled" navbar style once the page is past 40px.
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal animations: hero items animate on load, other items animate when visible.
  useEffect(() => {
    const heroItems = document.querySelectorAll('.hero .reveal');
    const timer = window.setTimeout(() => {
      heroItems.forEach((element) => element.classList.add('in-view'));
    }, 50);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll('.reveal-up')
      .forEach((element) => observer.observe(element));

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Typewriter effect for the hero subtitle.
  useEffect(() => {
    if (!TYPED_STRINGS.length) return undefined;

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const current = TYPED_STRINGS[stringIndex];
      const nextText = isDeleting
        ? current.substring(0, charIndex--)
        : current.substring(0, charIndex++);

      setTypedText(nextText);

      let delay = isDeleting ? 60 : 100;

      if (!isDeleting && charIndex > current.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
        stringIndex = (stringIndex + 1) % TYPED_STRINGS.length;
        delay = 400;
      }

      timeoutId = window.setTimeout(type, delay);
    };

    type();
    return () => window.clearTimeout(timeoutId);
  }, []);

  // Generic controlled-input handler: updates the matching form field by name.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Basic submit flow: validate -> simulate request -> show success message.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSending(true);
    setFormStatus({ type: '', message: '' });

    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    setFormStatus({
      type: 'success',
      message: "Message sent! I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSending(false);
  };

  return (
    <>
      {/* Fixed navigation bar */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`} id="nav">
        <a href="#hero" className="nav__logo">
          MERICOT<span className="dot">.</span>
        </a>
        <ul className="nav__links">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button
          className="nav__hamburger"
          type="button"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Full-screen mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <ul>
          <li>
            <a href="#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
          </li>
          <li>
            <a href="#work" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Work
            </a>
          </li>
          <li>
            <a href="#skills" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Skills
            </a>
          </li>
          <li>
            <a href="#contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hero section */}
      <section className="hero" id="hero">
        <div className="hero__bg">
          <div className="hero__grid"></div>
          <div className="hero__blob blob1"></div>
          <div className="hero__blob blob2"></div>
        </div>
        <div className="hero__content">
          <div className="hero__tag reveal">Available for work</div>
          <h1 className="hero__name reveal">
            <span className="hero__hi">Hi, I&apos;m</span>
            <span className="hero__big">Samuel Pimentel</span>
          </h1>
          <p className="hero__role reveal">
            <span className="typed">{typedText}</span>
            <span className="cursor">|</span>
          </p>
          <p className="hero__sub reveal">
            I build thoughtful digital experiences - clean code, sharp design, real impact.
          </p>
          <div className="hero__cta reveal">
            <a href="#work" className="btn btn--primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get In Touch
            </a>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* About section */}
      <section className="about section" id="about">
        <div className="container">
          <div className="section-label">/ About Me</div>
          <div className="about__grid">
            <div className="about__text">
              <h2 className="about__heading reveal-up">
                A developer who <br />
                <em>cares about craft.</em>
              </h2>
              <p className="reveal-up">
                I&apos;m a full-stack developer with a passion for building products that feel as good as they
                work. I bridge the gap between engineering and design while writing clean, maintainable code.
              </p>
              <p className="reveal-up">
                When I&apos;m not coding, you&apos;ll find me exploring new frameworks, contributing to open
                source, or making espresso with way too much care.
              </p>
              <div className="about__links reveal-up">
                <a href="#" className="btn btn--primary">
                  Download Resume
                </a>
                <a href="https://github.com/mericot" className="btn btn--ghost" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </div>
            </div>
            <div className="about__card reveal-up">
              <div className="stat-card">
                <div className="stat-card__num">3+</div>
                <div className="stat-card__label">Years Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__num">20+</div>
                <div className="stat-card__label">Projects Shipped</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__num">10+</div>
                <div className="stat-card__label">Happy Clients</div>
              </div>
              <div className="stat-card wide">
                <div className="stat-card__num">∞</div>
                <div className="stat-card__label">Curiosity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work/projects section rendered from PROJECTS data */}
      <section className="work section" id="work">
        <div className="container">
          <div className="section-label">/ Selected Work</div>
          <h2 className="section-title reveal-up">Projects I&apos;m proud of.</h2>
          <div className="projects" id="projects">
            {PROJECTS.map((project, index) => (
              <article className="project-card" style={{ animationDelay: `${index * 0.08}s` }} key={project.title}>
                <div className="project-card__accent"></div>
                <span className="project-card__emoji">{project.emoji}</span>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-card__links">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      Code ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <div className="work__more reveal-up">
            <a href="https://github.com/mericot" target="_blank" rel="noreferrer" className="btn btn--ghost">
              See all on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* Skills section rendered from SKILLS data */}
      <section className="skills section" id="skills">
        <div className="container">
          <div className="section-label">/ Tech Stack</div>
          <h2 className="section-title reveal-up">Tools of the trade.</h2>
          <div className="skills__grid" id="skillsGrid">
            {SKILLS.map((skill, index) => (
              <div className="skill-item" style={{ animationDelay: `${index * 0.05}s` }} key={skill.name}>
                <div className="skill-item__icon">{skill.icon}</div>
                <div className="skill-item__name">{skill.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section with controlled React form */}
      <section className="contact section" id="contact">
        <div className="container">
          <div className="section-label">/ Contact</div>
          <h2 className="section-title reveal-up">Let&apos;s build something.</h2>
          <p className="contact__sub reveal-up">Got a project in mind? I&apos;d love to hear about it.</p>
          <form className="contact__form reveal-up" id="contactForm" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Project inquiry"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn--primary" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Message ↗'}
            </button>
            <div className={`form__status ${formStatus.type}`}>{formStatus.message}</div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <a href="#hero" className="footer__logo">
              YN<span className="dot">.</span>
            </a>
            <div className="footer__socials">
              <a href="https://github.com/mericot" target="_blank" rel="noreferrer" aria-label="GitHub">
                GH
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                LI
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer" aria-label="Twitter">
                TW
              </a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} Your Name. Built with care.</span>
            <a href="#hero" className="footer__up">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
