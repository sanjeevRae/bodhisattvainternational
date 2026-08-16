import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Menu, X, Search, ShoppingBag, Heart, ArrowRight,
  Play, Moon, Sun, MapPin, Phone, Mail, Globe,
  BookOpen, Download, Award, Users, Leaf, Star,
  ChevronRight, Clock,
} from "lucide-react";

type Page = "home" | "museum" | "gallery" | "shop" | "news" | "foundation" | "about";

const uimg = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`block w-8 h-px ${light ? "bg-amber-400" : "bg-accent"}`} />
      <span className={`font-mono text-[0.6rem] tracking-[0.22em] uppercase ${light ? "text-amber-400" : "text-accent"}`}>
        {children}
      </span>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function useWebsiteProtection() {
  const [contentObscured, setContentObscured] = useState(false);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
    };

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blockedCombo =
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && key === "u");

      if (event.key === "F12" || blockedCombo) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleCopyCut = (event: ClipboardEvent) => {
      if (!isEditableTarget(event.target)) prevent(event);
    };

    const handleVisibility = () => {
      setContentObscured(document.hidden);
    };

    const handleBlur = () => setContentObscured(true);
    const handleFocus = () => setContentObscured(false);
    const handlePrintScreen = (event: KeyboardEvent) => {
      if (event.key === "PrintScreen") {
        setContentObscured(true);
        window.setTimeout(() => setContentObscured(false), 1400);
      }
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handlePrintScreen, true);
    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handlePrintScreen, true);
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return contentObscured;
}

function Nav({ current, onNav, dark, onToggleDark }: {
  current: Page; onNav: (p: Page) => void; dark: boolean; onToggleDark: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const items: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Museum", page: "museum" },
    { label: "Gallery", page: "gallery" },
    { label: "Gift Shop", page: "shop" },
    { label: "News Clippings", page: "news" },
    { label: "Foundation", page: "foundation" },
    { label: "About Us", page: "about" },
  ];

  const go = (p: Page) => { onNav(p); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const hero = current === "home" && !scrolled && !open;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${hero ? "bg-transparent" : "bg-background/95 backdrop-blur-md border-b border-border"}`}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">

        <button onClick={() => go("home")} className="shrink-0 focus:outline-none">
          <span className={`block font-display text-[1.05rem] font-semibold tracking-[0.12em] uppercase leading-none transition-colors ${hero ? "text-white" : "text-foreground"}`}>
            Bodhisattva
          </span>
          <span className={`block font-mono text-[0.46rem] tracking-[0.3em] uppercase mt-0.5 transition-colors ${hero ? "text-amber-300/70" : "text-accent"}`}>
            Museum & Art Gallery
          </span>
        </button>

        <nav className="hidden xl:flex items-center gap-7">
          {items.map((item) => (
            <button key={item.page} onClick={() => go(item.page)}
              className={`font-mono text-[0.57rem] tracking-[0.16em] uppercase transition-colors ${current === item.page ? (hero ? "text-amber-400" : "text-accent") : (hero ? "text-white/55 hover:text-white" : "text-muted-foreground hover:text-foreground")}`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onToggleDark} className={`transition-colors ${hero ? "text-white/55 hover:text-white" : "text-muted-foreground hover:text-foreground"}`} aria-label="Toggle dark mode">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => go("shop")} className={`hidden sm:block transition-colors ${hero ? "text-white/55 hover:text-white" : "text-muted-foreground hover:text-foreground"}`} aria-label="Cart">
            <ShoppingBag size={15} />
          </button>
          <button onClick={() => go("museum")} className={`hidden sm:flex items-center gap-1.5 font-mono text-[0.54rem] tracking-widest uppercase px-4 py-2 border transition-colors ${hero ? "border-white/25 text-white/60 hover:border-white hover:text-white" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
            Plan Visit
          </button>
          <button onClick={() => setOpen(!open)} className={`xl:hidden transition-colors ${hero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background/98 backdrop-blur-md">
          <nav className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col gap-0.5">
            {items.map((item) => (
              <button key={item.page} onClick={() => go(item.page)}
                className={`text-left font-sans text-sm py-3 border-b border-border/40 flex items-center justify-between transition-colors ${current === item.page ? "text-accent" : "text-foreground/70 hover:text-foreground"}`}>
                {item.label} <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ onNav }: { onNav: (p: Page) => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1C1A16]">
          <img src={uimg("photo-1779949437853-d8b00aee936c", 1920, 1080)} alt="Ancient Buddhist statue in museum gallery"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? "opacity-60" : "opacity-0"}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0A]/80 via-[#0F0D0A]/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-mono text-[0.56rem] tracking-[0.32em] uppercase text-white/38 mb-5">Est. 2000 &nbsp;·&nbsp; Lalitpur, Nepal &nbsp;·&nbsp; 12,400+ Artifacts</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium text-white leading-[0.92] mb-7 max-w-4xl">
              Where Heritage<br /><em className="font-sans italic font-light text-amber-200/90">Meets Eternity</em>
            </h1>
            <p className="font-sans text-sm text-white/52 max-w-md leading-relaxed mb-10 font-light">
              Dedicated to preserving and presenting the finest expressions of South Asian art, Buddhist heritage, and contemporary cultural dialogue.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNav("museum")} className="inline-flex items-center gap-2 bg-amber-800/85 hover:bg-amber-800 text-amber-50 px-7 py-3.5 text-[0.62rem] tracking-[0.18em] uppercase font-sans transition-colors">
                Explore Museum <ArrowRight size={13} />
              </button>
              <button onClick={() => onNav("gallery")} className="inline-flex items-center gap-2 border border-white/28 text-white/75 px-7 py-3.5 text-[0.62rem] tracking-[0.18em] uppercase font-sans hover:border-white hover:text-white transition-all">
                View Gallery
              </button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-3">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-white/18" />
          <span className="font-mono text-[0.46rem] tracking-[0.22em] uppercase text-white/28 [writing-mode:vertical-rl]">Scroll to discover</span>
        </div>
      </section>

      {/* Museum Intro */}
      <section className="py-28 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <SectionLabel>Our Purpose</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.08] mb-8">
              A Living Archive of<br /><em className="font-sans italic font-light text-accent">Sacred Civilization</em>
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5 font-light">
              Bodhisattva Museum & Art Gallery stands as Nepal&apos;s premier institution dedicated to Buddhist art and South Asian cultural heritage. Founded in 2000, we house over 12,000 artifacts spanning three millennia of artistic expression.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-10 font-light">
              We believe that art is not merely an object to be observed, but a living conversation between civilizations — a bridge between the ancient and the contemporary.
            </p>
            <button onClick={() => onNav("about")} className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.18em] uppercase font-sans border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
              Our Story <ArrowRight size={12} />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="relative">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={uimg("photo-1772617616268-a2f27d194fce", 800, 1000)} alt="Sculptures in museum gallery with paintings" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground px-8 py-6">
              <div className="font-display text-4xl font-medium">12,400+</div>
              <div className="font-mono text-[0.5rem] tracking-[0.2em] uppercase opacity-80 mt-1">Artifacts Preserved</div>
            </div>
            <div className="absolute -top-5 -right-5 w-20 h-20 border border-accent/30" />
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-secondary py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div><SectionLabel>Permanent Collection</SectionLabel><h2 className="font-display text-3xl md:text-4xl font-medium">Featured Collections</h2></div>
            <button onClick={() => onNav("museum")} className="hidden md:inline-flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase font-sans text-muted-foreground hover:text-accent transition-colors">View All <ArrowRight size={12} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Gandharan Sculpture", period: "1st – 5th Century CE", count: "487 works", id: "photo-1775212253782-d223fe035ddc", alt: "Two ancient statues in contemplation" },
              { title: "Buddhist Manuscript Art", period: "8th – 16th Century", count: "1,240 manuscripts", id: "photo-1765127959724-631190c32e8a", alt: "Ancient manuscript display case" },
              { title: "Contemporary Dialogues", period: "1960 – Present", count: "890 works", id: "photo-1605429523419-d828acb941d9", alt: "Contemporary paintings on gallery wall" },
            ].map((col, i) => (
              <motion.div key={col.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="group cursor-pointer" onClick={() => onNav("museum")}>
                <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                  <img src={uimg(col.id, 600, 800)} alt={col.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1 group-hover:text-accent transition-colors">{col.title}</h3>
                    <p className="font-mono text-[0.52rem] tracking-widest uppercase text-muted-foreground">{col.period}</p>
                  </div>
                  <span className="font-mono text-[0.52rem] tracking-wider text-accent mt-1">{col.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Exhibitions */}
      <section className="py-28 max-w-screen-xl mx-auto px-6 lg:px-10">
        <SectionLabel>On View Now</SectionLabel>
        <div className="grid lg:grid-cols-5 border border-border">
          <div className="lg:col-span-3 relative aspect-[16/10] overflow-hidden bg-muted">
            <img src={uimg("photo-1569783721854-33a99b4c0bae", 1200, 800)} alt="Visitors observing paintings in gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-mono text-[0.52rem] tracking-widest uppercase text-white/48 block mb-2">Main Hall &nbsp;·&nbsp; Until Nov 2026</span>
              <h3 className="font-display text-2xl md:text-3xl text-white font-medium">Echoes of Enlightenment</h3>
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col divide-y divide-border border-l border-border">
            {[
              { loc: "East Wing · Until Sep 2026", title: "The Silk Road Chronicles", desc: "Tracing Buddhist iconography along ancient trade routes from Gandhara to Tang Dynasty China." },
              { loc: "North Gallery · Until Oct 2026", title: "Feminine Divine", desc: "Goddess iconography across Buddhist, Jain, and Hindu artistic traditions." },
              { loc: "Terrace Gallery · Until Dec 2026", title: "Living Crafts of Nepal", desc: "Contemporary craftspeople working within inherited regional traditions, photographed in their workshops." },
            ].map((ex) => (
              <div key={ex.title} className="p-7 group cursor-pointer hover:bg-secondary/60 transition-colors" onClick={() => onNav("gallery")}>
                <span className="font-mono text-[0.5rem] tracking-widest uppercase text-accent block mb-2">{ex.loc}</span>
                <h3 className="font-display text-base font-medium mb-2 group-hover:text-accent transition-colors">{ex.title}</h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">{ex.desc}</p>
              </div>
            ))}
            <div className="p-7">
              <button onClick={() => onNav("gallery")} className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase font-sans border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
                All Exhibitions <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curator Quote */}
      <section className="bg-foreground text-primary-foreground py-24">
        <div className="max-w-screen-lg mx-auto px-6 text-center">
          <SectionLabel light>Curator&apos;s Note</SectionLabel>
          <blockquote className="font-sans text-2xl md:text-3xl lg:text-[2rem] font-light italic leading-[1.4] mb-8 text-primary-foreground/88">
            &ldquo;Every sculpture here is a question the ancient world poses to our present — and an invitation to answer.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-px bg-accent" />
            <span className="font-mono text-[0.52rem] tracking-[0.25em] uppercase text-primary-foreground/38">Siddhartha Man Shakya &nbsp;·&nbsp; Chief Curator</span>
            <div className="w-10 h-px bg-accent" />
          </div>
        </div>
      </section>

      {/* Foundation Preview */}
      <section className="py-28 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="aspect-square overflow-hidden bg-muted">
              <img src={uimg("photo-1708795921259-263a5e973acb", 500, 500)} alt="Child painting on canvas" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.12 }} className="aspect-square overflow-hidden bg-muted mt-10">
              <img src={uimg("photo-1756694915450-50c9796fb96d", 500, 500)} alt="Children painting together outdoors" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          <div>
            <SectionLabel>Foundation & CSR</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.08] mb-6">
              Art as an Act<br /><em className="font-sans italic font-light text-accent">of Responsibility</em>
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 font-light">
              The Bodhisattva Foundation runs 14 active programs across Nepal, nurturing young artists, preserving endangered crafts, and bringing museum access to underserved communities.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10 py-6 border-y border-border">
              {[["14", "Active Programs"], ["1,000+", "Students Reached"], ["Rs.10L", "Artist Grants"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-medium text-accent">{n}</div>
                  <div className="font-mono text-[0.5rem] tracking-wider uppercase text-muted-foreground mt-1 leading-relaxed">{l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => onNav("foundation")} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 text-[0.62rem] tracking-[0.18em] uppercase font-sans hover:opacity-90 transition-opacity">
              Learn More <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-secondary py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div><SectionLabel>Press & Media</SectionLabel><h2 className="font-display text-3xl md:text-4xl font-medium">Latest News</h2></div>
            <button onClick={() => onNav("news")} className="hidden md:inline-flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase font-sans text-muted-foreground hover:text-accent transition-colors">All Clippings <ArrowRight size={12} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border-t border-border">
            {[
              { outlet: "The Hindu", date: "12 Aug 2026", title: "Bodhisattva Museum Acquires Rare 3rd Century Mathura Sculpture", type: "News" },
              { outlet: "Art Nepal Magazine", date: "05 Aug 2026", title: "Siddhartha Man Shakya on the Future of Buddhist Art Scholarship in Nepal", type: "Interview" },
              { outlet: "Times of Nepal", date: "28 Jul 2026", title: "'Echoes of Enlightenment' Draws Record 40,000 Visitors in First Month", type: "Press Release" },
            ].map((item, i) => (
              <article key={item.title} onClick={() => onNav("news")} className={`pt-8 pb-8 pr-8 group cursor-pointer ${i > 0 ? "pl-8 border-l border-border" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[0.5rem] tracking-widest uppercase text-accent">{item.type}</span>
                  <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="font-display text-lg font-medium leading-snug mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="font-sans text-xs text-muted-foreground">{item.outlet}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        
      </section>
    </div>
  );
}

// ─── MUSEUM ───────────────────────────────────────────────────────────────────

function MuseumPage({ onNav }: { onNav: (p: Page) => void }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Sculpture", "Painting", "Manuscripts", "Coins", "Textiles", "Contemporary"];
  const collections = [
    { name: "Gandharan Sculpture", count: 487, id: "photo-1775212253782-d223fe035ddc", alt: "Ancient statues in contemplation" },
    { name: "Buddhist Paintings", count: 1240, id: "photo-1605429523419-d828acb941d9", alt: "Gallery wall with paintings" },
    { name: "Palm Leaf Manuscripts", count: 890, id: "photo-1765127959724-631190c32e8a", alt: "Ancient manuscript display" },
    { name: "Numismatic Collection", count: 3200, id: "photo-1768481498978-25ac2b210b35", alt: "Museum visitors at exhibit" },
    { name: "Decorative Textiles", count: 560, id: "photo-1772617616268-a2f27d194fce", alt: "Gallery sculptures and displays" },
    { name: "Contemporary Works", count: 724, id: "photo-1569783721854-33a99b4c0bae", alt: "Contemporary gallery visitors" },
  ];
  return (
    <div>
      <section className="relative h-[62vh] min-h-[460px] flex items-end overflow-hidden mt-16">
        <img src={uimg("photo-1765470129726-3689336ff549", 1920, 900)} alt="Interior of a grand museum hall" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0A]/75 via-[#0F0D0A]/20 to-transparent" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-white/38 mb-3">The Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-white">The Museum</h1>
        </div>
      </section>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3">
            <SectionLabel>Overview</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8 leading-[1.1]">
              Three Floors. Three Millennia.<br /><em className="font-sans italic font-light text-accent">One Continuous Story.</em>
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5 font-light">
              Spread across 28,000 sq. ft. in the heart of Lalitpur, Bodhisattva Museum houses the subcontinent&apos;s most comprehensive permanent collection of Buddhist art. Our galleries trace iconographic development from the pre-Asokan period through the Pala, Gupta, and Vijayanagara empires to the contemporary moment.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">
              The museum is organized around a principle of living dialogue: ancient works are displayed in conversation with contemporary artistic responses, encouraging visitors to see tradition not as a fixed archive but as a generative force.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-5">
            {[["Established", "2000"], ["Total Area", "28,000 sq.ft."], ["Artifacts", "12,400+"], ["Annual Visitors", "2.1 Million"], ["Active Galleries", "18 Rooms"], ["Languages", "8 Supported"]].map(([l, v]) => (
              <div key={l} className="flex items-end justify-between border-b border-border pb-4">
                <span className="font-mono text-[0.56rem] tracking-widest uppercase text-muted-foreground">{l}</span>
                <span className="font-display text-xl font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24 border-y border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <SectionLabel>History</SectionLabel>
          <h2 className="font-display text-3xl font-medium mb-14">A History of Collecting</h2>
          <div className="relative overflow-x-auto pb-2">
            <div className="flex min-w-[680px]">
              {[
                { year: "2000", event: "Founded by Siddhartha Man Shakya with 200 core artifacts in a converted Civil Lines haveli." },
                { year: "2003", event: "East Wing expansion; landmark Gandharan sculpture collection acquired." },
                { year: "2009", event: "International partnerships with the British Museum and Freer Gallery established." },
                { year: "2015", event: "Digital archive and virtual tour platform launched; 5,000 works digitized." },
                { year: "2022", event: "Contemporary Dialogues wing inaugurated. Foundation reaches 5,000 students." },
              ].map((item, i) => (
                <div key={item.year} className="flex-1 relative pl-5 pr-4">
                  <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-accent border-2 border-secondary z-10" />
                  {i < 4 && <div className="absolute left-3 top-1.5 h-px bg-border" style={{ width: "calc(100% + 0.5rem)" }} />}
                  <div className="pt-8">
                    <span className="font-display text-2xl font-medium text-accent block mb-3">{item.year}</span>
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div><SectionLabel>Permanent Collection</SectionLabel><h2 className="font-display text-3xl md:text-4xl font-medium">Explore by Category</h2></div>
          <div className="flex gap-1 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`font-mono text-[0.52rem] tracking-widest uppercase px-3.5 py-2 border transition-colors ${activeFilter === f ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.div key={col.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                <img src={uimg(col.id, 600, 450)} alt={col.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-medium group-hover:text-accent transition-colors">{col.name}</h3>
                <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground">{col.count.toLocaleString()} works</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floor Map */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-24">
        <SectionLabel>Navigation</SectionLabel>
        <h2 className="font-display text-3xl font-medium mb-8">Interactive Floor Map</h2>
        <div className="border border-border bg-secondary">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              { floor: "Ground Floor", rooms: ["Entrance Hall", "Gandharan Gallery", "Gift Shop", "Café & Reading Room"] },
              { floor: "First Floor", rooms: ["Buddhist Paintings", "Manuscripts & Textiles", "Numismatics", "Education Centre"] },
              { floor: "Second Floor", rooms: ["Contemporary Wing", "Special Exhibitions", "Research Library", "Rooftop Terrace"] },
            ].map((fl) => (
              <div key={fl.floor} className="p-7">
                <div className="font-mono text-[0.52rem] tracking-widest uppercase text-accent mb-4">{fl.floor}</div>
                {fl.rooms.map((room) => (
                  <div key={room} className="flex items-center gap-2.5 py-2 border-b border-border/40 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                    <span className="font-sans text-xs text-muted-foreground font-light">{room}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground text-primary-foreground py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <SectionLabel light>Digital Experience</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">Take a Virtual Tour</h2>
            <p className="font-sans text-sm text-primary-foreground/48 max-w-lg font-light leading-relaxed">Explore all 18 galleries from anywhere in the world. Immersive 360° experience available in 8 languages.</p>
          </div>
          <button className="shrink-0 flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-[0.6rem] tracking-[0.2em] uppercase font-sans hover:opacity-90 transition-opacity">
            <Play size={15} /> Begin Virtual Tour
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

function GalleryPage() {
  const [year, setYear] = useState("all");
  const [cat, setCat] = useState("all");

  const exhibitions = [
    { id: 1, title: "Echoes of Enlightenment", year: "2026", cat: "buddhist", date: "Mar – Nov 2026", curator: "Siddhartha Man Shakya", desc: "An immersive journey through Pali Buddhist iconography from Amaravati to Sanchi.", imgId: "photo-1569783721854-33a99b4c0bae", tall: true },
    { id: 2, title: "The Silk Road Chronicles", year: "2026", cat: "historical", date: "Jan – Sep 2026", curator: "Siddhartha Man Shakya", desc: "Tracing Buddhist iconography along ancient trade routes from Gandhara to Tang China.", imgId: "photo-1775212253782-d223fe035ddc", tall: false },
    { id: 3, title: "Feminine Divine", year: "2026", cat: "thematic", date: "Jun – Oct 2026", curator: "Siddhartha Man Shakya", desc: "Goddess iconography across Buddhist, Jain, and Hindu traditions.", imgId: "photo-1563000215-e31a8ddcb2d0", tall: true },
    { id: 4, title: "Sacred Geometries", year: "2025", cat: "thematic", date: "Sep 2025 – Jan 2026", curator: "Siddhartha Man Shakya", desc: "Mandala and yantra traditions across South and Southeast Asia.", imgId: "photo-1735605917461-4c1b77a6616f", tall: false },
    { id: 5, title: "Ink & Devotion", year: "2025", cat: "buddhist", date: "Apr – Aug 2025", curator: "Siddhartha Man Shakya", desc: "Sanskrit manuscript painting from the Pala workshops of Bengal.", imgId: "photo-1765127959724-631190c32e8a", tall: false },
    { id: 6, title: "Living Crafts of Nepal", year: "2025", cat: "contemporary", date: "Jan – May 2025", curator: "Siddhartha Man Shakya", desc: "Contemporary craftspeople working within inherited regional traditions.", imgId: "photo-1605429523419-d828acb941d9", tall: true },
    { id: 7, title: "Conversations in Bronze", year: "2024", cat: "historical", date: "Oct 2024 – Feb 2025", curator: "Siddhartha Man Shakya", desc: "Chola bronzes and their twentieth-century resonances.", imgId: "photo-1772617616268-a2f27d194fce", tall: false },
    { id: 8, title: "The Enlightened Eye", year: "2024", cat: "contemporary", date: "Mar – Jul 2024", curator: "Siddhartha Man Shakya", desc: "Contemporary artists responding to Buddhist philosophies of seeing.", imgId: "photo-1761334859641-139cffff4a47", tall: false },
    { id: 9, title: "Pillars of Dharma", year: "2023", cat: "buddhist", date: "Jun – Dec 2023", curator: "Siddhartha Man Shakya", desc: "Monumental Buddhist architecture and its rich symbolic language.", imgId: "photo-1759296456443-1cf1a93d173f", tall: true },
  ];

  const years = ["all", "2026", "2025", "2024", "2023"];
  const cats = ["all", "buddhist", "historical", "thematic", "contemporary"];
  const filtered = exhibitions.filter((e) => (year === "all" || e.year === year) && (cat === "all" || e.cat === cat));

  return (
    <div className="pt-16">
      <div className="bg-secondary py-20 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">Archive</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium">Past Exhibitions</h1>
        </div>
      </div>

      <div className="border-b border-border sticky top-16 bg-background/96 backdrop-blur-md z-30">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-3.5 flex flex-wrap gap-x-10 gap-y-2.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.48rem] tracking-widest uppercase text-muted-foreground">Year</span>
            <div className="flex gap-1">
              {years.map((y) => (
                <button key={y} onClick={() => setYear(y)} className={`font-mono text-[0.52rem] tracking-widest uppercase px-3 py-1.5 border transition-colors ${year === y ? "border-accent bg-accent text-accent-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {y === "all" ? "All" : y}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.48rem] tracking-widest uppercase text-muted-foreground">Category</span>
            <div className="flex gap-1">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`font-mono text-[0.52rem] tracking-widest uppercase px-3 py-1.5 border transition-colors ${cat === c ? "border-accent bg-accent text-accent-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {c === "all" ? "All" : c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        {filtered.length === 0 ? (
          <p className="text-center py-24 font-sans text-sm text-muted-foreground">No exhibitions match your selection.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filtered.map((ex, i) => (
              <motion.div key={ex.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }} className="break-inside-avoid mb-6 group cursor-pointer">
                <div className={`overflow-hidden bg-muted ${ex.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <img src={uimg(ex.imgId, 700, ex.tall ? 933 : 525)} alt={ex.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="pt-4 pb-6 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[0.5rem] tracking-widest uppercase text-accent">{ex.cat}</span>
                    <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground">{ex.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-medium mb-1.5 group-hover:text-accent transition-colors">{ex.title}</h3>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-2 font-light">{ex.desc}</p>
                  <p className="font-mono text-[0.48rem] tracking-widest uppercase text-muted-foreground/55">Curator: {ex.curator}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GIFT SHOP ────────────────────────────────────────────────────────────────

function GiftShopPage() {
  const [tab, setTab] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [preview, setPreview] = useState<number | null>(null);

  const tabs = [
    { key: "all", label: "All" }, { key: "books", label: "Books & Catalogs" },
    { key: "paintings", label: "Paintings" }, { key: "ceramics", label: "Ceramics" },
    { key: "jewelry", label: "Jewelry" }, { key: "souvenirs", label: "Souvenirs" },
  ];
  const products = [
    { id: 1, name: "Gandharan Buddha — Museum Edition Giclée Print", price: "Rs.4,500", cat: "paintings", detail: "A2 Archival Giclée, Limited to 200", imgId: "photo-1775212253782-d223fe035ddc" },
    { id: 2, name: "Silk Road: Art Along the Trade Routes", price: "Rs.2,800", cat: "books", detail: "Hardcover, 320 pp., 280 color plates", imgId: "photo-1760986784449-79e1a6ba616b" },
    { id: 3, name: "Terracotta Dharma Wheel Pendant", price: "Rs.1,200", cat: "jewelry", detail: "Handthrown, kiln-fired, glazed finish", imgId: "photo-1767330855651-238523c49601" },
    { id: 4, name: "Buddhist Manuscript Facsimile Portfolio", price: "Rs.6,500", cat: "books", detail: "12 facsimile plates, limited to 500", imgId: "photo-1765127959724-631190c32e8a" },
    { id: 5, name: "Hand-Painted Miniature — Bodhisattva", price: "Rs.18,000", cat: "paintings", detail: "Original, 6×8 in., natural pigments", imgId: "photo-1563000215-e31a8ddcb2d0" },
    { id: 6, name: "Sancai-Glazed Ceramic Bowl", price: "Rs.850", cat: "ceramics", detail: "Artisan-made, 300ml, dishwasher safe", imgId: "photo-1772617616268-a2f27d194fce" },
    { id: 7, name: "The Bodhisattva Collection — 2026 Catalog", price: "Rs.1,500", cat: "books", detail: "Softcover, 180 pp., bilingual EN/HI", imgId: "photo-1605429523419-d828acb941d9" },
    { id: 8, name: "Brass Lotus Incense Holder", price: "Rs.2,200", cat: "souvenirs", detail: "Hand-cast, antique brass finish", imgId: "photo-1765470129726-3689336ff549" },
    { id: 9, name: "Carved Soapstone Ganesha Figurine", price: "Rs.3,400", cat: "souvenirs", detail: "Artisan carved, 4-inch, gift-boxed", imgId: "photo-1761334859641-139cffff4a47" },
    { id: 10, name: "Ajanta Caves — Fine Art Poster Set", price: "Rs.1,800", cat: "paintings", detail: "Set of 4, A3 matte, acid-free paper", imgId: "photo-1735605917461-4c1b77a6616f" },
    { id: 11, name: "Patachitra Notebook — Handmade Paper", price: "Rs.620", cat: "souvenirs", detail: "120 gsm khadi paper, 128 pages", imgId: "photo-1759296456443-1cf1a93d173f" },
    { id: 12, name: "Blue Pottery Sake Set", price: "Rs.2,900", cat: "ceramics", detail: "Jaipur blue pottery, 1 jug + 4 cups", imgId: "photo-1569783721854-33a99b4c0bae" },
  ];

  const filtered = tab === "all" ? products : products.filter((p) => p.cat === tab);
  const previewItem = products.find((p) => p.id === preview);
  const toggleWishlist = (id: number) => setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleCart = (id: number) => setCart((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <div className="pt-16">
      <div className="bg-secondary border-b border-border py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">Collection Shop</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-5xl md:text-6xl font-medium">Museum Gift Shop</h1>
            <div className="flex items-center gap-2 ml-4">
              <ShoppingBag size={17} className="text-accent" />
              <span className="font-mono text-sm text-accent font-medium">{cart.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex gap-0 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`font-mono text-[0.52rem] tracking-widest uppercase px-6 py-4 whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                <img src={uimg(product.imgId, 500, 666)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors" />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleWishlist(product.id)} className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors ${wishlist.includes(product.id) ? "bg-accent text-accent-foreground" : "bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground"}`} aria-label="Wishlist">
                    <Heart size={12} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => setPreview(product.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-foreground hover:text-background backdrop-blur-sm transition-colors" aria-label="Quick preview">
                    <Search size={12} />
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button onClick={() => toggleCart(product.id)} className={`w-full py-3 text-[0.56rem] tracking-[0.2em] uppercase font-sans transition-colors ${cart.includes(product.id) ? "bg-foreground text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {cart.includes(product.id) ? "In Cart ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
              <h3 className="font-display text-sm font-medium leading-snug mb-1">{product.name}</h3>
              <p className="font-mono text-[0.5rem] tracking-wider text-muted-foreground mb-2">{product.detail}</p>
              <span className="font-display text-base font-medium text-accent">{product.price}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />
          <div className="relative bg-background max-w-2xl w-full grid sm:grid-cols-2 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-square sm:aspect-auto overflow-hidden bg-muted">
              <img src={uimg(previewItem.imgId, 600, 600)} alt={previewItem.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground mb-6 block"><X size={18} /></button>
                <p className="font-mono text-[0.5rem] tracking-widest uppercase text-accent mb-2">{previewItem.cat}</p>
                <h3 className="font-display text-xl font-medium mb-2">{previewItem.name}</h3>
                <p className="font-mono text-[0.52rem] tracking-wider text-muted-foreground mb-6">{previewItem.detail}</p>
                <span className="font-display text-3xl font-medium text-accent">{previewItem.price}</span>
              </div>
              <button onClick={() => { toggleCart(previewItem.id); setPreview(null); }} className="mt-8 w-full bg-accent text-accent-foreground py-3.5 text-[0.58rem] tracking-[0.2em] uppercase font-sans hover:opacity-90 transition-opacity">
                {cart.includes(previewItem.id) ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

function NewsPage() {
  const [query, setQuery] = useState("");

  const articles = [
    { id: 1, outlet: "The Hindu", date: "12 Aug 2026", title: "Bodhisattva Museum Acquires Rare 3rd Century Mathura Sculpture", type: "News", summary: "The museum announced the acquisition of a polished red sandstone Buddha figure from the estate of late collector Shri P.N. Lal — considered one of the finest Mathura school pieces in private hands." },
    { id: 2, outlet: "Art Nepal Magazine", date: "05 Aug 2026", title: "Siddhartha Man Shakya on the Future of Buddhist Art Scholarship", type: "Interview", summary: "In conversation with our editor, the chief curator discusses how digital technology is democratizing access to ancient art, and why the next decade will be a golden age for South Asian museum scholarship." },
    { id: 3, outlet: "Times of Nepal", date: "28 Jul 2026", title: "'Echoes of Enlightenment' Draws Record 40,000 Visitors in Opening Month", type: "Press Release", summary: "The museum's flagship 2026 exhibition has exceeded attendance projections, prompting an extension through November. Weekend slots are fully booked through September." },
    { id: 4, outlet: "The Wire", date: "14 Jul 2026", title: "Can Museums Keep Buddhist Art Sacred? A National Debate", type: "Feature", summary: "A longform examination of the ethics of displaying sacred objects, drawing on commentary from Bodhisattva Museum's curatorial team and scholars across Nepal and Sri Lanka." },
    { id: 5, outlet: "Mint Lounge", date: "02 Jun 2026", title: "Inside the Museum That Believes Art Should Be Free", type: "Feature", summary: "How the Bodhisattva Foundation's free-entry Sunday policy has transformed who visits Nepal's art institutions — and what other museums could learn." },
    { id: 6, outlet: "Hindustan Times", date: "20 May 2026", title: "Bodhisattva Museum Signs MOU with Nalanda University", type: "News", summary: "A landmark research partnership enabling co-curated exhibitions and joint publication of scholarly catalogs on early Buddhist art history." },
    { id: 7, outlet: "Outlook", date: "11 Apr 2026", title: "Review: The Silk Road Chronicles — Four Stars", type: "Review", summary: "\"A rare exhibition that succeeds in making scholarship viscerally felt. The material culture of faith, compressed across three millennia and two continents, emerges startlingly coherent.\"" },
    { id: 8, outlet: "NDTV", date: "15 Mar 2026", title: "Museum Launches Free Digital Archive of 5,000 Artifacts", type: "Press Release", summary: "All artifact photography and curatorial notes from the permanent collection are now freely available at the museum's new open-access digital library, supporting researchers worldwide." },
  ];

  const typeColor: Record<string, string> = {
    "News": "text-amber-700 dark:text-amber-400",
    "Interview": "text-emerald-700 dark:text-emerald-400",
    "Feature": "text-blue-700 dark:text-blue-400",
    "Press Release": "text-purple-700 dark:text-purple-400",
    "Review": "text-rose-700 dark:text-rose-400",
  };

  const filtered = articles.filter((a) => query === "" || a.title.toLowerCase().includes(query.toLowerCase()) || a.outlet.toLowerCase().includes(query.toLowerCase()) || a.type.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="pt-16">
      <div className="bg-secondary border-b border-border py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">Press Archive</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium mb-10">News Clippings</h1>
          <div className="relative max-w-xl">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, outlet, or type…" className="w-full bg-background border border-border pl-10 pr-5 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        {filtered.length === 0 && (
          <p className="py-16 text-center font-sans text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
        )}
        <div className="divide-y divide-border">
          {filtered.map((article) => (
            <article key={article.id} className="grid md:grid-cols-6 gap-6 py-10 group cursor-pointer hover:bg-secondary/40 -mx-6 lg:-mx-10 px-6 lg:px-10 transition-colors">
              <div className="md:col-span-1">
                <span className={`font-mono text-[0.5rem] tracking-widest uppercase block mb-1 ${typeColor[article.type] ?? "text-accent"}`}>{article.type}</span>
                <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground block mb-2">{article.date}</span>
                <span className="font-sans text-xs font-medium text-foreground block">{article.outlet}</span>
              </div>
              <div className="md:col-span-5">
                <h3 className="font-display text-xl font-medium mb-3 group-hover:text-accent transition-colors leading-snug">{article.title}</h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-4 font-light max-w-2xl">{article.summary}</p>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 font-mono text-[0.5rem] tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"><Download size={11} /> Download PDF</button>
                  <button className="flex items-center gap-2 font-mono text-[0.5rem] tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors">Read Article <ArrowRight size={11} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FOUNDATION ───────────────────────────────────────────────────────────────

function FoundationPage() {
  return (
    <div>
      <section className="relative h-[56vh] min-h-[400px] flex items-end overflow-hidden mt-16">
        <img src={uimg("photo-1756694915450-50c9796fb96d", 1920, 900)} alt="Children painting together in community art program" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0A]/75 via-[#0F0D0A]/20 to-transparent" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 pb-16 w-full">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-white/38 mb-3">Social Responsibility</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-white">The Foundation</h1>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/60">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border">
            {[["14", "Active Programs"], ["1,000+", "Students Reached"], ["RS.10L", "Artist Grants Disbursed"], ["38", "Partner Organizations"]].map(([v, l]) => (
              <motion.div key={l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center md:px-8">
                <div className="font-display text-4xl md:text-5xl font-medium text-accent mb-2">{v}</div>
                <div className="font-mono text-[0.52rem] tracking-widest uppercase text-muted-foreground">{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionLabel>Our Mission</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.08] mb-8">
              Art as an Act<br /><em className="font-sans italic font-light text-accent">of Responsibility</em>
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5 font-light">
              The Bodhisattva Foundation was established in 2012 as the museum&apos;s social responsibility arm. We believe that cultural institutions carry an obligation not only to preserve the past, but to actively shape a more equitable cultural future.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">
              Our work spans four interconnected domains: education, artist support, community access, and cultural preservation — each reflecting the Bodhisattva ideal of compassionate action in the world.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img src={uimg("photo-1708795921259-263a5e973acb", 800, 600)} alt="Child painting in art education program" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24 border-y border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <SectionLabel>Our Work</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-14">Programs & Initiatives</h2>
          <div className="grid md:grid-cols-2 gap-0 border border-border">
            {[
              { name: "ArtReach Schools", cat: "Education", desc: "Bringing art history and studio practice to 200+ government schools across Humla, Dolpa and Manang. We train teachers, supply materials, and run monthly artist residencies.", impact: "6,200 students per year", Icon: BookOpen },
              { name: "Living Craft Fellowship", cat: "Artist Support", desc: "Annual grants of Rs.1-4 lakhs to master craftspeople working in endangered traditional forms — Kalamkari, Bidri metalwork, and Thangka painting among them.", impact: "42 fellowships awarded", Icon: Award },
              { name: "Community Museum Visits", cat: "Access", desc: "Free-of-charge museum access, transportation, and guided tours for schools, NGOs, and community groups from underserved neighbourhoods across NCR.", impact: "18,000 visitors facilitated", Icon: Users },
              { name: "Cultural Preservation Archive", cat: "Heritage", desc: "Documentation and digitization of endangered folk art traditions. Our archive holds 40,000+ high-resolution records, freely accessible to researchers worldwide.", impact: "40,000+ records preserved", Icon: Leaf },
            ].map((p, i) => (
              <div key={p.name} className={`p-10 border-border ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-accent/10 shrink-0"><p.Icon size={18} className="text-accent" /></div>
                  <div>
                    <span className="font-mono text-[0.5rem] tracking-widest uppercase text-accent block mb-1">{p.cat}</span>
                    <h3 className="font-display text-xl font-medium">{p.name}</h3>
                  </div>
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5 font-light">{p.desc}</p>
                <div className="flex items-center gap-2">
                  <Star size={11} className="text-accent fill-accent" />
                  <span className="font-mono text-[0.52rem] tracking-wider text-accent uppercase">{p.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <SectionLabel>Voices</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-12">Impact in Their Own Words</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "The fellowship gave me two years to focus solely on Bidri metalwork. My daughter is now learning alongside me — for the first time in four generations, we believe this will continue.", name: "Meena Gurung", role: "Living Craft Fellow, 2024", imgId: "photo-1592060036126-1b6d5139dea4" },
            { quote: "Before ArtReach, our school had no art teacher and no materials. Now we have a dedicated studio and six students who have applied to arts colleges.", name: "Sunita Lama", role: "Teacher, Govt. School, Varanasi", imgId: "photo-1708795921259-263a5e973acb" },
            { quote: "Bringing 80 students to the museum changed something. They saw themselves in the art — the faces, the stories. One girl said, 'This is my history too.'", name: "Arjun Singh", role: "NGO Coordinator, Asha Foundation", imgId: "photo-1756694915450-50c9796fb96d" },
          ].map((s) => (
            <div key={s.name} className="bg-secondary p-8 border border-border">
              <blockquote className="font-sans text-sm italic font-light leading-relaxed mb-6 text-foreground/80">&ldquo;{s.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                  <img src={uimg(s.imgId, 80, 80)} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-sans text-xs font-medium">{s.name}</div>
                  <div className="font-mono text-[0.46rem] tracking-wider text-muted-foreground uppercase">{s.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-14 border-t border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 text-center">
          <p className="font-mono text-[0.52rem] tracking-[0.25em] uppercase text-muted-foreground mb-8">Partner Organizations</p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 items-center">
            {["British Museum", "Freer Gallery — Smithsonian", "Nalanda University", "IGNCA", "UNESCO Nepal", "Nepal Foundation for the Arts", "Aga Khan Trust for Culture", "Tata Trusts"].map((p) => (
              <span key={p} className="font-display text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function AboutPage() {
  const team = [
    { name: "Siddhartha Man Shakya Sharma", role: "Co-Founder", dept: "Leadership" },
    { name: "Siddhartha Man Shakya", role: "Chief Curator", dept: "Curatorial" },
    { name: "Siddhartha Man Shakya", role: "Director of Operations", dept: "Management" },
    { name: "Siddhartha Man Shakya", role: "Head, Bodhisattva Foundation", dept: "CSR" },
    { name: "Siddhartha Man Shakya", role: "Senior Curator, Ancient Art", dept: "Curatorial" },
    { name: "Siddhartha Man Shakya", role: "Curator, Manuscripts & Textiles", dept: "Curatorial" },
    { name: "Siddhartha Man Shakya", role: "Head of Education", dept: "Programs" },
    { name: "Siddhartha Man Shakya", role: "Digital Experience Lead", dept: "Technology" },
  ];

  return (
    <div className="pt-16">
      <div className="bg-secondary border-b border-border py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">Who We Are</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium">About Us</h1>
        </div>
      </div>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionLabel>History</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8 leading-[1.1]">
              Founded in Conviction.<br /><em className="font-sans italic font-light text-accent">Grown in Purpose.</em>
            </h2>
            <div className="space-y-5">
              <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">Bodhisattva Museum & Art Gallery was founded in 2000 by Siddhartha Man Shakya, a collector, scholar, and educator who believed Nepal&apos;s Buddhist artistic heritage was being underserved by existing cultural institutions. What began with 200 carefully selected objects in a converted haveli in Civil Lines, Lalitpur, has grown into one of Asia&apos;s foremost institutions of its kind.</p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">Over nearly three decades, the museum has built deep partnerships with institutions across South and Southeast Asia, Japan, the UK, and the United States — establishing scholarly exchange programs, jointly curated exhibitions, and shared digitization initiatives that have set new standards for the field.</p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">In 2012, the Bodhisattva Foundation was established as the museum&apos;s social responsibility arm, extending its mandate from collecting to community-building.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="aspect-video overflow-hidden bg-muted">
              <img src={uimg("photo-1765470129726-3689336ff549", 800, 450)} alt="Grand museum interior" className="w-full h-full object-cover" />
            </div>
            <div className="bg-foreground text-primary-foreground p-8">
              <p className="font-sans text-base italic font-light leading-relaxed mb-4">&ldquo;The Bodhisattva is the figure who postpones their own liberation to remain in the world, to serve. Our museum aspires to that same ethic.&rdquo;</p>
              <span className="font-mono text-[0.5rem] tracking-widest uppercase text-accent">Siddhartha Man Shakya &nbsp;·&nbsp; Co-Founder</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="py-14 md:pr-14">
              <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-accent block mb-6">Our Vision</span>
              <p className="font-display text-2xl md:text-3xl font-medium leading-[1.25]">A world where art from every civilization is preserved, understood, and felt as a living inheritance by all people.</p>
            </div>
            <div className="py-14 md:pl-14">
              <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-accent block mb-6">Our Mission</span>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">To collect, preserve, and interpret the artistic heritage of South Asian Buddhist and cultural traditions; to present that heritage through world-class exhibitions and scholarship; and to make art accessible to all communities through education, outreach, and open digital access.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <SectionLabel>Leadership</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-14">The Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div key={member.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
              <div className="aspect-square bg-secondary border border-border mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="font-display text-5xl font-medium text-muted/60 leading-none">{member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                </div>
              </div>
              <span className="font-mono text-[0.48rem] tracking-widest uppercase text-accent block mb-1">{member.dept}</span>
              <h3 className="font-display text-sm font-medium mb-1">{member.name}</h3>
              <p className="font-sans text-xs text-muted-foreground font-light">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-foreground text-primary-foreground py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionLabel light>Visit & Contact</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-medium mb-10">Get in Touch</h2>
              <div className="space-y-7">
                {[
                  { Icon: MapPin, label: "Address", value: "Kupondole, Lalitpur, Nepal" },
                  { Icon: Clock, label: "Hours", value: "Sun – Fri: 10:00 AM – 5:00 PM\nMonday: Closed" },
                  { Icon: Phone, label: "Phone", value: "+977-9818882876" },
                  { Icon: Mail, label: "Email", value: "info@bodhisattvainternational.com" },
                  { Icon: Globe, label: "Web", value: "www.bodhisattvainternational.com" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <Icon size={15} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="font-mono text-[0.48rem] tracking-widest uppercase text-primary-foreground/33 block mb-0.5">{label}</span>
                      <span className="font-sans text-sm text-primary-foreground/65 font-light whitespace-pre-line">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-medium mb-7">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="bg-primary-foreground/8 border border-primary-foreground/15 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-primary-foreground placeholder:text-primary-foreground/25" />
                  <input type="text" placeholder="Last Name" className="bg-primary-foreground/8 border border-primary-foreground/15 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-primary-foreground placeholder:text-primary-foreground/25" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full bg-primary-foreground/8 border border-primary-foreground/15 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-primary-foreground placeholder:text-primary-foreground/25" />
                <select className="w-full bg-primary-foreground/8 border border-primary-foreground/15 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-primary-foreground/65 appearance-none">
                  <option value="">Subject — Select one</option>
                  <option>General Enquiry</option>
                  <option>Exhibition Information</option>
                  <option>Foundation / CSR</option>
                  <option>Press & Media</option>
                  <option>Membership</option>
                  <option>Research & Loans</option>
                </select>
                <textarea rows={4} placeholder="Your message…" className="w-full bg-primary-foreground/8 border border-primary-foreground/15 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-accent text-primary-foreground placeholder:text-primary-foreground/25 resize-none" />
                <button type="submit" className="w-full bg-accent text-accent-foreground py-4 text-[0.58rem] tracking-[0.22em] uppercase font-sans hover:opacity-90 transition-opacity">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ onNav }: { onNav: (p: Page) => void }) {
  const go = (p: Page) => { onNav(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-base font-semibold tracking-[0.1em] uppercase mb-0.5">Bodhisattva</div>
            <div className="font-mono text-[0.46rem] tracking-[0.28em] uppercase text-accent mb-5">Museum & Art Gallery</div>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">Kupondole, Lalitpur, Nepal</p><br />
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">Sun-Fri 10:00am to 5:00pm</p> 
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">+977-9818882876</p>
          </div>
          {([
            { title: "Visit", links: [["Home", "home"], ["Museum", "museum"], ["Gallery", "gallery"], ["Gift Shop", "shop"]] },
            { title: "Engage", links: [["Foundation", "foundation"], ["News Clippings", "news"], ["Membership", "about"], ["Events", "museum"]] },
            { title: "Connect", links: [["About Us", "about"], ["Press Enquiries", "news"], ["Research & Loans", "about"], ["Contact", "about"]] },
          ] as { title: string; links: [string, Page][] }[]).map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[0.52em] tracking-widest uppercase text-foreground mb-5">{col.title}</h4>
              <div className="space-y-3">
                {col.links.map(([label, page]) => (
                  <button key={label} onClick={() => go(page)} className="block font-sans text-xs text-muted-foreground hover:text-accent transition-colors font-light">{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[0.46rem] tracking-widest uppercase text-muted-foreground">© 2026 Bodhisattva Museum & Art Gallery. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Accessibility"].map((item) => (
              <span key={item} className="font-mono text-[0.46rem] tracking-wider text-muted-foreground cursor-pointer hover:text-accent transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [dark, setDark] = useState(false);
  const contentObscured = useWebsiteProtection();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const navigate = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className={`protected-content ${contentObscured ? "is-obscured" : ""}`}>
        <Nav current={page} onNav={navigate} dark={dark} onToggleDark={() => setDark((d) => !d)} />
        <main>
          <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            {page === "home"       && <HomePage onNav={navigate} />}
            {page === "museum"     && <MuseumPage onNav={navigate} />}
            {page === "gallery"    && <GalleryPage />}
            {page === "shop"       && <GiftShopPage />}
            {page === "news"       && <NewsPage />}
            {page === "foundation" && <FoundationPage />}
            {page === "about"      && <AboutPage />}
          </motion.div>
        </main>
        <Footer onNav={navigate} />
      </div>
      {contentObscured && <div className="privacy-screen" aria-hidden="true" />}
    </div>
  );
}
