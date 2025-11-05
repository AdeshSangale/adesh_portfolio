import { useRef, useEffect, useState, type MouseEvent } from "react";
import {
  motion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  Download,
  ChevronRight,
  Code2,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Award,
  BookOpen,
} from "lucide-react";

/* ---------------- Types ---------------- */

type SectionKey =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "awards"
  | "publications"
  | "contact";

/* ---------------- Motion Variants ---------------- */

const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const popBehindText: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.92, rotateX: -12, filter: "blur(3px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

const popBehindCard: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.95, rotateX: -8, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const stagger = (delayChildren = 0.12, staggerChildren = 0.08): Variants => ({
  animate: { transition: { delayChildren, staggerChildren } },
});

/* ---------------- Little Helpers ---------------- */

function Reveal({
  children,
  variants = fadeUp,
  amount = 0.45,
}: {
  children: React.ReactNode;
  variants?: Variants;
  amount?: number;
}) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-56 w-56 rounded-full blur-3xl opacity-20"
          style={{
            background:
              i % 2 === 0
                ? "radial-gradient(closest-side, rgba(6,182,212,0.35), rgba(6,182,212,0))"
                : "radial-gradient(closest-side, rgba(96,165,250,0.25), rgba(96,165,250,0))",
            left: `${(i * 13) % 90}%`,
            top: `${(i * 23) % 80}%`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
          transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---------------- Data ---------------- */

const PERSONAL = {
  name: "Adesh Sangale",
  title: "Software Engineer | Data Analyst",
  location: "Maharashtra, India",
  phone: "+91-7822994140",
  email: "sangaleadesh91@gmail.com",
  linkedin: "https://www.linkedin.com/in/adesh-sangale-85866828a/",
  github: "https://github.com/AdeshSangale/adesh_portfolio",
  resumePath: "/adesh_resume.pdf",
};

const PROJECTS = [
  {
    title: "Epilepsy Prediction (GUI)",
    desc:
      "Developed a machine learning model for real-time EEG data processing with a GUI to visualize brain wave patterns and seizure probability. Includes historic and synthetic-data testing.",
    tags: ["Python", "Tkinter", "Matplotlib", "Machine Learning"],
    repo: PERSONAL.github,
    live: "#",
  },
  {
    title: "Used Cars Analytics (EDA)",
    desc:
      "Conducted EDA on used car datasets to uncover pricing trends, brand popularity, and resale-value drivers — built visual dashboards and summary insights.",
    tags: ["Python", "Pandas", "Seaborn", "Plotly"],
    repo: PERSONAL.github,
    live: "#",
  },
];

const SKILLS = [
  { name: "Python", level: 85 },
  { name: "Java", level: 80 },
  { name: "SQL", level: 80 },
  { name: "JavaScript", level: 75 },
  { name: "React", level: 70 },
  { name: "HTML / CSS", level: 90 },
  { name: "Power BI / Excel", level: 75 },
  { name: "Data Analysis / Visualization", level: 85 },
];

const CERTIFICATIONS = [
  { title: "Java Full Stack", issuer: "Qspiders", date: "Jul 2024 - Jan 2025" },
  { title: "Python for Data Science", issuer: "NPTEL (IIT Madras)", date: "Jul 2024 - Aug 2024" },
  { title: "Python Programming", issuer: "InternsElite", date: "Jan 2024 - Mar 2024" },
  { title: "Big Data", issuer: "NPTEL (IIT Kanpur)", date: "Feb 2023 - May 2023" },
];

const AWARDS = [
  {
    title: "1st in National Conference — Inventions and Innovations in Technology",
    issuer: "Shri Chhatrapati Shivaji Maharaj College of Engineering, Nepti",
    date: "Mar 2025",
  },
];

const PUBLICATIONS = [
  {
    title: "Epilepsy Prediction Using Machine Learning",
    publisher: "IJARIIE, Vol. 11 Issue-2",
    date: "Jun 2025",
  },
];

/* ---------------- Component ---------------- */

export default function App() {
  // refs for sections
  const sections = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    certifications: useRef<HTMLDivElement>(null),
    awards: useRef<HTMLDivElement>(null),
    publications: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  } satisfies Record<SectionKey, React.RefObject<HTMLDivElement>>;

  const scrollTo = (key: SectionKey) =>
    sections[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // top progress line
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.2 });

  // Sticky-on-scroll logic (IntersectionObserver)
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "-8px 0px 0px 0px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // header height (keep spacer equal)
  const HEADER_H = 56;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001F3F] via-[#001022] to-black text-white">
      {/* Progress line */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-cyan-400 to-blue-600"
      />

      {/* Sentinel: when this scrolls out of view, header becomes sticky */}
      <div ref={sentinelRef} aria-hidden className="h-1 w-full"></div>

      {/* Spacer when fixed */}
      {isSticky && <div style={{ height: HEADER_H }} aria-hidden />}

      <motion.header
        initial={false}
        animate={isSticky ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "inset-x-0 z-50",
          isSticky ? "fixed top-0" : "relative",
          "w-full backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-[#0a0015]/90 border-b border-cyan-800",
        ].join(" ")}
        style={{ height: HEADER_H }}
      >
        <motion.div
          initial={false}
          animate={isSticky ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          className="relative mx-auto w-full max-w-6xl px-6 h-full flex items-center"
        >
          {/* Left: Brand */}
          <motion.button
            onClick={() => scrollTo("home")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 font-semibold text-cyan-300"
          >
            <Code2 className="h-5 w-5" /> Adesh Sangale
          </motion.button>

          {/* Center: Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm text-gray-200">
            {["home", "about", "skills", "projects", "experience", "contact"].map((k) => (
              <motion.button
                key={k}
                onClick={() => scrollTo(k as SectionKey)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="capitalize transition rounded-2xl px-4 py-2 bg-white/5 hover:bg-white/10"
              >
                {k}
              </motion.button>
            ))}
          </nav>

          {/* Right: Social Icons */}
          <div className="ml-auto flex items-center gap-4 text-cyan-300">
            <motion.a
              href={PERSONAL.github}
              aria-label="GitHub"
              className="p-2 hover:bg-cyan-900/30 rounded-xl"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.a
              href={PERSONAL.linkedin}
              aria-label="LinkedIn"
              className="p-2 hover:bg-cyan-900/30 rounded-xl"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
            <motion.a
              href={`mailto:${PERSONAL.email}`}
              aria-label="Email"
              className="p-2 hover:bg-cyan-900/30 rounded-xl"
              whileHover={{ y: -2 }}
            >
              <Mail className="h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>
      </motion.header>

      {/* ---------- Hero (Snapshot removed, grid collapsed) ---------- */}
      <section ref={sections.home} className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#002041]/40 via-[#001022] to-black" />
        <Orbs />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-1 gap-10 items-center">
          <div style={{ perspective: 1200 }}>
            <Reveal variants={popBehindText}>
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-900/60 text-cyan-200 text-xs px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </p>
            </Reveal>

            <Reveal variants={popBehindText}>
              <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 [background-size:200%_auto] animate-[shimmer_6s_linear_infinite]">
                {PERSONAL.name}
              </h1>
            </Reveal>

            <Reveal variants={fadeUp}>
              <p className="mt-4 text-lg text-gray-300">
                {PERSONAL.title} — I build clean, fast, and <br /> accessible web experiences and turn messy data into clear, actionable insights.
              </p>
            </Reveal>

            <motion.div
              variants={stagger(0.15, 0.1)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <motion.a
                variants={fadeUp}
                href="#projects"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  scrollTo("projects");
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-4 py-2 transition shadow hover:shadow-cyan-700/30"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects <ChevronRight className="h-4 w-4" />
              </motion.a>

              <motion.a
                variants={fadeUp}
                href={PERSONAL.resumePath}
                download
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-700 px-4 py-2 hover:bg-cyan-900/30 transition"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-4 w-4 text-cyan-300" /> Download CV
              </motion.a>
            </motion.div>

            <Reveal variants={fadeUp}>
              <div className="mt-5 flex items-center gap-4 text-sm text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-cyan-300" /> {PERSONAL.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-4 w-4 text-cyan-300" /> {PERSONAL.phone}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

{/* About */}
<section ref={sections.about} className="mx-auto max-w-6xl px-4 py-16 text-gray-200">
  <div style={{ perspective: 1200 }}>
    <Reveal variants={popBehindText}>
      <h2 className="text-3xl font-bold text-cyan-300">About</h2>
    </Reveal>
    <Reveal variants={popBehindText}>
      <p
        className="mt-4 max-w-3xl text-gray-300 leading-relaxed
                   [text-align:justify] [text-justify:inter-word]"
      >
        I’m a Software Engineer and Data Analyst with hands-on experience in Python
        programming, data analysis, visualization, and full-stack fundamentals.
        I build data pipelines and dashboards, design clean user interfaces,
        and focus on readable, maintainable code. Outside work, I enjoy cricket and chess.
      </p>
    </Reveal>
  </div>
</section>

      {/* Skills */}
      <section ref={sections.skills} className="mx-auto max-w-6xl px-4 py-16">
        <Reveal variants={popBehindText}>
          <h2 className="text-3xl font-bold text-cyan-300">Skills</h2>
        </Reveal>
        <motion.div
          variants={stagger(0.1, 0.08)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.35 }}
          className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SKILLS.map((s) => (
            <motion.div key={s.name} variants={popBehindCard} className="rounded-2xl border border-cyan-800 bg-[#001a2a] p-5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-cyan-200">{s.name}</span>
                <span className="text-sm text-gray-400">{s.level}%</span>
              </div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-gray-700 overflow-hidden">
                <motion.div
                  className="h-2.5 rounded-full bg-cyan-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Projects */}
      <section ref={sections.projects} className="mx-auto max-w-6xl px-4 py-16">
        <div style={{ perspective: 1200 }}>
          <Reveal variants={popBehindText}>
            <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
              <Code2 className="h-6 w-6" /> Projects
            </h2>
          </Reveal>
          <motion.div
            variants={stagger(0.1, 0.08)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.35 }}
            className="mt-8 grid md:grid-cols-2 gap-6"
          >
            {PROJECTS.map((p) => (
              <motion.article
                key={p.title}
                variants={popBehindCard}
                whileHover={{ y: -6, rotateZ: 0.3 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="rounded-2xl border border-cyan-800 bg-[#001a2a] p-5 shadow-md flex flex-col"
              >
                <h3 className="text-lg font-semibold text-cyan-200">{p.title}</h3>
                <p className="mt-2 text-gray-300">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-cyan-700 px-2 py-0.5 text-xs text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 mt-auto">
                  <a
                    href={p.live}
                    className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                  <a
                    href={p.repo}
                    className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" /> Code
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Experience & Education */}
      <section ref={sections.experience} className="mx-auto max-w-6xl px-4 py-16">
        <div style={{ perspective: 1200 }}>
          <Reveal variants={popBehindText}>
            <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
              <Briefcase className="h-6 w-6" /> Experience & Education
            </h2>
          </Reveal>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Reveal variants={popBehindCard}>
              <div className="rounded-2xl border border-cyan-800 bg-[#001a2a] p-5 shadow-md">
                <h3 className="font-semibold text-cyan-200">Experience</h3>
                <ul className="mt-3 space-y-3 text-gray-300">
                  <li>
                    <p className="font-medium">Data Analyst Intern — InternsElite</p>
                    <p className="text-sm text-gray-400">Jan 2024 - Mar 2024</p>
                    <p className="text-sm">Integrated Python, SQL, and Excel to analyze and process large datasets, developed data cleaning pipelines, and created interactive dashboards to visualize key insights.</p>
                  </li>
                  <li>
                    <p className="font-medium">Projects & Freelance</p>
                    <p className="text-sm text-gray-400">Landing pages, responsive websites, analytics dashboards, and small ML prototypes.</p>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal variants={popBehindCard}>
              <div className="rounded-2xl border border-cyan-800 bg-[#001a2a] p-5 shadow-md">
                <h3 className="font-semibold text-cyan-200 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" /> Education
                </h3>
                <p className="mt-2 text-gray-300">B.E. in Computer Science & Design — Dr. Vithalrao Vikhe Patil College of Engineering</p>
                <p className="text-sm text-gray-400">2021 – 2025 • GPA: 8.0</p>
                <p className="mt-3 text-gray-300">XII (Science), Hind Seva Mandal’s Pemraj Sarda College — CGPA: 8.77</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section ref={sections.certifications} className="mx-auto max-w-6xl px-4 py-12">
        <Reveal variants={popBehindText}>
          <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
            <Award className="h-6 w-6" /> Certifications
          </h2>
        </Reveal>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {CERTIFICATIONS.map((c) => (
            <motion.div key={c.title} variants={popBehindCard} className="rounded-xl border border-cyan-800 bg-[#001a2a] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-cyan-200">{c.title}</h3>
                  <p className="text-sm text-gray-400">{c.issuer}</p>
                </div>
                <p className="text-sm text-gray-500">{c.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section ref={sections.awards} className="mx-auto max-w-6xl px-4 py-12">
        <Reveal variants={popBehindText}>
          <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
            <Award className="h-6 w-6" /> Awards
          </h2>
        </Reveal>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {AWARDS.map((a) => (
            <motion.div key={a.title} variants={popBehindCard} className="rounded-xl border border-cyan-800 bg-[#001a2a] p-4">
              <h3 className="font-semibold text-cyan-200">{a.title}</h3>
              <p className="text-sm text-gray-400">{a.issuer} • {a.date}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section ref={sections.publications} className="mx-auto max-w-6xl px-4 py-12">
        <Reveal variants={popBehindText}>
          <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
            <BookOpen className="h-6 w-6" /> Publications
          </h2>
        </Reveal>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {PUBLICATIONS.map((p) => (
            <motion.div key={p.title} variants={popBehindCard} className="rounded-xl border border-cyan-800 bg-[#001a2a] p-4">
              <h3 className="font-semibold text-cyan-200">{p.title}</h3>
              <p className="text-sm text-gray-400">{p.publisher} • {p.date}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section ref={sections.contact} className="mx-auto max-w-6xl px-4 py-16 text-gray-200">
        <div style={{ perspective: 1200 }}>
          <Reveal variants={popBehindText}>
            <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
              <Mail className="h-6 w-6" /> Contact
            </h2>
          </Reveal>

          <Reveal variants={fadeUp}>
            <p className="mt-2 text-gray-300">
              Have a role, freelance project, or idea? Let’s chat.
            </p>
          </Reveal>

          {/* Contact form */}
          <motion.form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget as HTMLFormElement;
              const submitBtn = formEl.querySelector('button[type="submit"]') as HTMLButtonElement | null;
              const statusEl = formEl.querySelector<HTMLParagraphElement>("#contact-status");

              const setStatus = (msg: string, ok?: boolean) => {
                if (statusEl) {
                  statusEl.textContent = msg;
                  statusEl.className =
                    "md:col-span-2 text-sm " + (ok ? "text-emerald-400" : "text-rose-400");
                }
              };

              if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Sending…";
              }
              if (statusEl) {
                statusEl.textContent = "Sending…";
                statusEl.className = "md:col-span-2 text-sm text-gray-300";
              }

              const fd = new FormData(formEl);
              const name = String(fd.get("name") || "");
              const email = String(fd.get("email") || "");
              const subjectRaw = String(fd.get("subject") || "");
              const messageRaw = String(fd.get("message") || "");

              const access_key =
                (import.meta as any)?.env?.VITE_WEB3FORMS_KEY ||
                "d14ba4a0-8641-4c4b-be88-ed5eb3704234";

              try {
                const payload = {
                  access_key,
                  name,
                  email,
                  subject: subjectRaw.trim() || `New portfolio inquiry from ${name || "visitor"}`,
                  message: `${messageRaw}\n\n—\nSent from ${PERSONAL.name} (Portfolio Contact Form)`,
                  from_name: name,
                  reply_to: email,
                  botcheck: "",
                };

                const res = await fetch("https://api.web3forms.com/submit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Accept: "application/json" },
                  body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (data?.success) {
                  setStatus("Message sent successfully! Please check your inbox (or spam).", true);
                  formEl.reset();
                } else {
                  setStatus(data?.message || "Something went wrong. Please try again.");
                }
              } catch {
                setStatus("Network error. Please try again.");
              } finally {
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.innerText = "Send Message";
                }
              }
            }}
            variants={stagger(0.15, 0.1)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-6 grid md:grid-cols-2 gap-4"
          >
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />

            <motion.input
              variants={fadeUp}
              name="name"
              required
              className="rounded-2xl border border-cyan-800 bg-[#00121a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Your name"
            />
            <motion.input
  variants={fadeUp}
  name="email"
  type="email"
  required
  className="rounded-2xl border border-cyan-800 bg-[#00121a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-600"
  placeholder="Email"
/>
            <motion.input
              variants={fadeUp}
              name="subject"
              className="md:col-span-2 rounded-2xl border border-cyan-800 bg-[#00121a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Subject"
            />
            <motion.textarea
              variants={fadeUp}
              name="message"
              required
              className="md:col-span-2 rounded-2xl border border-cyan-800 bg-[#00121a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Message"
              rows={5}
            />
            <motion.button
              variants={fadeUp}
              type="submit"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="md:col-span-2 w-full max-w-xl mx-auto flex items-center justify-center gap-3
                         rounded-full bg-gradient-to-r from-cyan-600 to-blue-500
                         text-white px-8 py-3 shadow-lg hover:from-cyan-500 hover:to-blue-400
                         transition-all duration-300"
              aria-live="polite"
            >
              Send Message
            </motion.button>
            <motion.p id="contact-status" variants={fadeUp} className="md:col-span-2 text-sm text-gray-300" />
          </motion.form>

          <Reveal variants={fadeUp}>
            <div className="mt-6 text-sm text-gray-400">
              Prefer email?{" "}
              <a href={`mailto:${PERSONAL.email}`} className="underline text-cyan-300">
                {PERSONAL.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-800 bg-[#001122]">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            © {new Date().getFullYear()} {PERSONAL.name}. All rights reserved.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <a className="inline-flex items-center gap-1 underline text-cyan-300" href={PERSONAL.resumePath} download>
              <FileText className="h-4 w-4" /> Resume
            </a>
            <a className="inline-flex items-center gap-1 underline text-cyan-300" href="#">
              Privacy
            </a>
          </motion.div>
        </div>
      </footer>

      {/* keyframes for shimmer */}
      <style>{`
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>
    </div>
  );
}
