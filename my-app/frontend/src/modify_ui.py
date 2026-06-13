import os
import re

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def append_to_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "a", encoding="utf-8") as f:
        f.write(content)

def read_file(filename):
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

# 1. App.css - Global Styles & Navigation
app_css = """/* Premium Cottage Global Styles */
:root {
  --primary-dark: #142E21; /* Deep Forest */
  --primary: #1A3A2A;      /* Forest Green */
  --primary-light: #2B4C3B;
  --accent: #C4A15A;       /* Antique Gold */
  --accent-light: #FFD78C;
  --bg-color: #FDFBF7;     /* Off White */
  --bg-secondary: #F5F0E6; /* Warm Beige */
  --text-dark: #2C3E2F;
  --text-light: #5A6B5E;
  --white: #FFFFFF;
  --shadow-sm: 0 4px 15px rgba(0,0,0,0.03);
  --shadow-md: 0 10px 30px rgba(26,58,42,0.08);
  --shadow-hover: 0 15px 40px rgba(196,161,90,0.15);
  --radius: 12px;
  --transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

* {
  margin: 0; padding: 0; box-sizing: border-box;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-color);
  color: var(--text-dark);
  line-height: 1.7;
  overflow-x: hidden;
}

.App { overflow-x: hidden; }

/* Scroll Reveals */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.5, 0, 0, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }

/* Navigation Bar */
.navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: rgba(20, 46, 33, 0.95);
  backdrop-filter: blur(12px);
  padding: 16px 0;
  transition: var(--transition);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
}

.logo { display: flex; align-items: center; gap: 10px; transition: var(--transition); }
.logo:hover { transform: scale(1.02); }
.logo-icon { font-size: 1.8rem; }
.logo-text { font-size: 1.5rem; font-weight: 700; color: var(--accent-light); letter-spacing: 1px; }

.nav-menu { display: flex !important; list-style: none !important; gap: 35px !important; margin: 0 !important; padding: 0 !important; }
.nav-item { display: inline-block !important; }
.nav-link {
  text-decoration: none !important; color: var(--white) !important; font-weight: 500 !important; font-size: 0.95rem !important;
  transition: var(--transition) !important; position: relative !important; padding: 8px 0 !important; display: inline-block !important;
}

.nav-link::after {
  content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0;
  background-color: var(--accent); transition: width 0.3s ease;
}
.nav-link:hover { color: var(--accent-light) !important; }
.nav-link:hover::after { width: 100%; }

.btn-book {
  background: var(--accent); color: var(--white); border: none; padding: 12px 30px;
  font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  font-size: 0.9rem; font-family: inherit; white-space: nowrap;
  box-shadow: 0 4px 15px rgba(196,161,90,0.3);
}
.btn-book:hover {
  background: var(--accent-light); color: var(--primary-dark);
  transform: translateY(-2px); box-shadow: 0 6px 20px rgba(196,161,90,0.5);
}

.btn-login {
  background: transparent; color: var(--white); border: 2px solid rgba(255,255,255,0.3);
  padding: 10px 24px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  margin-right: 15px; font-size: 0.9rem;
}
.btn-login:hover { background: rgba(255,255,255,0.1); border-color: var(--white); }
.btn-logout {
  background: transparent; color: #ff6b6b; border: 2px solid rgba(255,107,107,0.3);
  padding: 10px 24px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition); margin-left: 15px;
}
.btn-logout:hover { background: rgba(255,107,107,0.1); border-color: #ff6b6b; }
.user-greeting { color: var(--white); font-weight: 500; margin-right: 15px; }

@media (max-width: 900px) {
  .nav-menu { gap: 15px !important; }
}
@media (max-width: 768px) {
  .nav-container { flex-direction: column; gap: 15px; }
  .nav-menu { gap: 15px !important; flex-wrap: wrap; justify-content: center; }
  .logo-text { font-size: 1.3rem; }
  .btn-book, .btn-login { padding: 8px 20px; font-size: 0.8rem; }
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-tag {
  display: inline-block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px;
  color: var(--accent); font-weight: 700; margin-bottom: 16px;
}
.section-header { text-align: center; margin-bottom: 50px; }
.section-header h2 { font-size: 2.5rem; color: var(--primary-dark); margin-bottom: 15px; font-weight: 700; }
.section-header p { color: var(--text-light); max-width: 600px; margin: 0 auto; font-size: 1.1rem; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-light); }
"""

write_file("App.css", app_css)

# 2. Hero.css
hero_css = """.hero {
  position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden; background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  padding-top: 80px;
}
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('./House.jpeg') center/cover no-repeat;
  opacity: 0.4; z-index: 0;
  animation: zoomBg 20s infinite alternate linear;
}
@keyframes zoomBg { from { transform: scale(1); } to { transform: scale(1.1); } }
.hero-content {
  position: relative; z-index: 2; max-width: 900px; padding: 0 20px;
}
.hero-badge {
  display: inline-block; background: rgba(196, 161, 90, 0.2); backdrop-filter: blur(10px);
  padding: 8px 20px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
  color: var(--accent-light); letter-spacing: 1px; margin-bottom: 30px;
  border: 1px solid rgba(196, 161, 90, 0.4);
}
.hero-title {
  font-size: 4.5rem; font-weight: 800; color: var(--white); line-height: 1.1;
  margin-bottom: 25px; text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); letter-spacing: -1px;
}
.hero-title .highlight { color: var(--accent-light); }
.hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 45px; line-height: 1.6; font-weight: 400; }
.hero-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
.btn-primary {
  background: var(--accent); color: var(--white); border: none; padding: 16px 36px;
  font-size: 1.05rem; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  box-shadow: 0 8px 25px rgba(196, 161, 90, 0.4);
}
.btn-primary:hover { background: var(--accent-light); color: var(--primary-dark); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(196, 161, 90, 0.6); }
.btn-outline {
  background: rgba(255, 255, 255, 0.1); color: var(--white); border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px 36px; font-size: 1.05rem; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  backdrop-filter: blur(5px);
}
.btn-outline:hover { background: var(--white); color: var(--primary-dark); transform: translateY(-3px); }
.hero-stats { display: flex; justify-content: center; gap: 80px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.15); flex-wrap: wrap; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 2.2rem; font-weight: 800; color: var(--accent-light); text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.stat-label { font-size: 0.9rem; color: rgba(255, 255, 255, 0.8); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
.hero-scroll { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 2; text-align: center; }
.hero-scroll span { display: block; font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
.scroll-mouse { width: 26px; height: 42px; border: 2px solid rgba(255, 255, 255, 0.4); border-radius: 20px; position: relative; margin: 0 auto; }
.scroll-mouse::before { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 3px; height: 8px; background: var(--accent-light); border-radius: 2px; animation: scrollWheel 1.5s infinite; }
@keyframes scrollWheel { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(15px); } }
@media (max-width: 768px) {
  .hero-title { font-size: 2.8rem; }
  .hero-subtitle { font-size: 1.1rem; }
  .hero-stats { gap: 40px; }
  .stat-number { font-size: 1.6rem; }
}
"""
write_file("Hero.css", hero_css)

# 3. About.css
about_css = """.about { padding: 120px 0; background: var(--bg-color); position: relative; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.about-image { position: relative; }
.image-stack { position: relative; height: 550px; }
.image-stack__item { position: absolute; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); transition: var(--transition); }
.image-stack__item--top { top: 0; right: 0; width: 65%; z-index: 2; border: 8px solid var(--bg-color); }
.image-stack__item--bottom { bottom: 0; left: 0; width: 70%; z-index: 1; }
.image-stack__item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
.image-stack__item:hover { box-shadow: var(--shadow-hover); z-index: 3; }
.image-stack__item:hover img { transform: scale(1.08); }
.image-stack__item--top { height: 350px; }
.image-stack__item--bottom { height: 350px; }
.about-content h2 { font-size: 2.8rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 25px; line-height: 1.2; letter-spacing: -0.5px; }
.about-description { color: var(--text-dark); font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px; font-weight: 500; }
.about-text { color: var(--text-light); line-height: 1.8; margin-bottom: 40px; font-size: 1rem; }
.about-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
.feature { display: flex; gap: 15px; align-items: flex-start; padding: 20px; background: var(--white); border-radius: var(--radius); transition: var(--transition); border: 1px solid rgba(0,0,0,0.03); box-shadow: var(--shadow-sm); }
.feature:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: rgba(196,161,90,0.2); }
.feature-icon { font-size: 2.2rem; min-width: 50px; display: flex; align-items: center; justify-content: center; }
.feature-content h4 { font-size: 1.05rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 6px; }
.feature-content p { font-size: 0.9rem; color: var(--text-light); margin: 0; line-height: 1.5; }
.about-stats { display: flex; gap: 50px; padding: 30px 0; margin-bottom: 40px; border-top: 1px solid rgba(196,161,90,0.2); border-bottom: 1px solid rgba(196,161,90,0.2); }
.stat-item { flex: 1; }
.stat-number { display: block; font-size: 2.2rem; font-weight: 800; color: var(--accent); margin-bottom: 5px; }
.stat-label { font-size: 0.85rem; color: var(--text-light); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
.btn-learn { background: transparent; color: var(--accent); border: 2px solid var(--accent); padding: 14px 36px; font-weight: 600; font-size: 1rem; border-radius: 50px; cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 8px; }
.btn-learn:hover { background: var(--accent); color: var(--white); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(196, 161, 90, 0.3); }
@media (max-width: 968px) { .about-grid { gap: 40px; grid-template-columns: 1fr; } .image-stack { height: 450px; margin-bottom: 40px; } }
@media (max-width: 768px) { .about-content h2 { font-size: 2.2rem; } .about-features { grid-template-columns: 1fr; } .about-stats { gap: 20px; flex-wrap: wrap; } .stat-number { font-size: 1.8rem; } }
"""
write_file("About.css", about_css)

# 4. Amenities.css
amenities_css = """.amenities { padding: 120px 0; background: var(--bg-secondary); position: relative; }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.amenity-card { background: var(--white); padding: 35px 25px; border-radius: var(--radius); text-align: center; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid transparent; }
.amenity-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-md); border-color: rgba(196,161,90,0.3); }
.amenity-icon { font-size: 3rem; margin-bottom: 20px; display: inline-block; transition: var(--transition); }
.amenity-card:hover .amenity-icon { transform: scale(1.15) rotate(5deg); }
.amenity-card h3 { font-size: 1.2rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 12px; }
.amenity-card p { font-size: 0.95rem; color: var(--text-light); line-height: 1.6; }
@media (max-width: 768px) { .amenities { padding: 80px 0; } .amenities-grid { gap: 20px; } .amenity-card { padding: 25px 20px; } }
"""
write_file("Amenities.css", amenities_css)


# 5. JSX File Updates for Reveal & Animations
def apply_reveals():
    # Helper to add Counter Logic and observer
    hook_code = '''
import { useEffect, useRef, useState } from 'react';

// Custom hook for Scroll Reveal & CountUp
export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

export const CountUp = ({ end, decimals = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) setHasStarted(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      let start = null;
      const duration = 2000;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(easeOut * end);
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  }, [hasStarted, end]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
};
'''
    write_file("AnimationUtils.jsx", hook_code)

    # HERO.JSX
    hero = read_file("Hero.jsx")
    if "CountUp" not in hero:
        hero = hero.replace("import './Hero.css';", "import './Hero.css';\nimport { useScrollReveal, CountUp } from './AnimationUtils';")
        hero = hero.replace("const Hero = ({ onBookNow }) => {", "const Hero = ({ onBookNow }) => {\n  useScrollReveal();")
        hero = hero.replace('className="hero-content"', 'className="hero-content reveal"')
        # Replace numbers
        hero = hero.replace('<span className="stat-number">4.9</span>', '<span className="stat-number"><CountUp end={4.9} decimals={1} /></span>')
        hero = hero.replace('<span className="stat-number">120+</span>', '<span className="stat-number"><CountUp end={120} suffix="+" /></span>')
        write_file("Hero.jsx", hero)
    
    # ABOUT.JS
    about = read_file("About.js")
    if "CountUp" not in about:
        about = about.replace("import './About.css';", "import './About.css';\nimport { useScrollReveal, CountUp } from './AnimationUtils';")
        about = about.replace("const About = () => {", "const About = () => {\n  useScrollReveal();")
        about = about.replace('className="about-image"', 'className="about-image reveal"')
        about = about.replace('className="about-content"', 'className="about-content reveal reveal-delay-1"')
        about = about.replace('<span className="stat-number">50+</span>', '<span className="stat-number"><CountUp end={50} suffix="+" /></span>')
        about = about.replace('<span className="stat-number">4.9</span>', '<span className="stat-number"><CountUp end={4.9} decimals={1} /></span>')
        write_file("About.js", about)

    # AMENITIES.JSX
    amenities = read_file("Amenities.jsx")
    if "useScrollReveal" not in amenities:
        amenities = amenities.replace("import './Amenities.css';", "import './Amenities.css';\nimport { useScrollReveal } from './AnimationUtils';")
        amenities = amenities.replace("const Amenities = () => {", "const Amenities = () => {\n  useScrollReveal();")
        amenities = amenities.replace('className="section-header"', 'className="section-header reveal"')
        amenities = amenities.replace('className="amenity-card"', 'className="amenity-card reveal"')
        write_file("Amenities.jsx", amenities)

apply_reveals()
