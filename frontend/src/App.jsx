import { useEffect, useState } from 'react';
import { PROJECTS, SKILLS, TYPED_STRINGS } from './utils/data';
import resumePdf from '../assets/Resume.pdf';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const FIELD_LIMITS = {
  subject: 120,
  message: 500,
};

const validateContactFields = ({ name, email, subject, message }) => {
  const errors = {};

  if (!name) errors.name = 'Name is required.';
  if (!email) errors.email = 'Email is required.';
  if (!subject) errors.subject = 'Subject is required.';
  if (!message) errors.message = 'Message is required.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (subject && subject.length > FIELD_LIMITS.subject) {
    errors.subject = `Subject must be at most ${FIELD_LIMITS.subject} characters.`;
  }
  if (message && message.length > FIELD_LIMITS.message) {
    errors.message = `Message must be at most ${FIELD_LIMITS.message} characters.`;
  }

  return errors;
};

function App() {
  // UI state for navbar style, mobile menu, hero typing text, and form behavior.
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const hasValidationErrors = Object.keys(
    validateContactFields({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    })
  ).length > 0;

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
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (formStatus.type === 'error') {
      setFormStatus({ type: '', message: '' });
    }
  };

  // Submit flow: validate -> send request to backend -> show success/error state.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    const validationErrors = validateContactFields(payload);
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setFormStatus({
        type: 'error',
        message: 'Please fix the highlighted fields.',
      });
      return;
    }

    setIsSending(true);
    setFieldErrors({});
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors);
        }
        const errorMessage =
          (data?.errors ? Object.values(data.errors).join(' ') : '') ||
          data?.message ||
          'Failed to send message. Please try again.';
        throw new Error(errorMessage);
      }

      setFormStatus({
        type: 'success',
        message: "Message sent! I'll get back to you soon.",
      });
      setFieldErrors({});
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
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
                <a href={resumePdf} download="Samuel-Pimentel-Resume.pdf" className="btn btn--primary">
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
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  required
                />
                {fieldErrors.name ? (
                  <div id="name-error" className="form__field-error">
                    {fieldErrors.name}
                  </div>
                ) : null}
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
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  required
                />
                {fieldErrors.email ? (
                  <div id="email-error" className="form__field-error">
                    {fieldErrors.email}
                  </div>
                ) : null}
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
                maxLength={FIELD_LIMITS.subject}
                aria-invalid={Boolean(fieldErrors.subject)}
                aria-describedby={fieldErrors.subject ? 'subject-error' : 'subject-meta'}
                required
              />
              <div className="form__field-meta" id="subject-meta">
                {formData.subject.length}/{FIELD_LIMITS.subject}
              </div>
              {fieldErrors.subject ? (
                <div id="subject-error" className="form__field-error">
                  {fieldErrors.subject}
                </div>
              ) : null}
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
                maxLength={FIELD_LIMITS.message}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'message-error' : 'message-meta'}
                required
              ></textarea>
              <div className="form__field-meta" id="message-meta">
                {formData.message.length}/{FIELD_LIMITS.message}
              </div>
              {fieldErrors.message ? (
                <div id="message-error" className="form__field-error">
                  {fieldErrors.message}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSending || hasValidationErrors}
              aria-busy={isSending}
            >
              {isSending ? 'Sending...' : 'Send Message ↗'}
            </button>
            <div className={`form__status ${formStatus.type}`} role="status" aria-live="polite">
              {formStatus.message}
            </div>
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
