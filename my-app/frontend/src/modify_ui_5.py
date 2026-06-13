import os

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# 1. App.css
app_css = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap');

:root {
  --primary: #B86B4B;        /* Warm Copper */
  --primary-light: #c87a58;
  --secondary: #1E3A5F;      /* Luxury Navy Blue */
  --accent: #F2B84B;         /* Soft Gold */
  --bg-color: #FFF9F2;       /* Soft Warm White */
  --cards: #FFFFFF;          /* Pure White */
  --text-dark: #1B1B1B;      /* Text */
  --text-muted: #6F6F6F;     /* Muted Text */
  --border: #EADFD2;         /* Soft Border */
  --navy-light: #2c4f7c;

  --shadow-sm: 0 8px 24px rgba(30, 58, 95, 0.04);
  --shadow-md: 0 16px 40px rgba(30, 58, 95, 0.08);
  --shadow-hover: 0 24px 48px rgba(184, 107, 75, 0.15);
  
  --radius: 24px;            /* Modern Cards Radius */
  --radius-btn: 50px;        /* Pill Button */
  --transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  font-size: 17px;
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6, .hero-title, .logo-text, .section-header h2, .heading {
  font-family: 'Playfair Display', serif;
  color: var(--secondary);
}

.App { overflow-x: hidden; }

/* Scroll Reveals */
.reveal { opacity: 0; transform: translateY(40px); transition: all 1s cubic-bezier(0.5, 0, 0, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }

/* Navigation Bar */
.navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: rgba(255, 249, 242, 0.85);
  backdrop-filter: blur(16px);
  padding: 16px 0;
  transition: var(--transition);
  border-bottom: 1px solid rgba(234, 223, 210, 0.5);
}

.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
}

.logo { display: flex; align-items: center; gap: 10px; transition: var(--transition); cursor: pointer; }
.logo:hover { transform: scale(1.02); }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 26px; font-weight: 700; color: var(--secondary); letter-spacing: -0.5px; }

.nav-menu { display: flex !important; list-style: none !important; gap: 40px !important; margin: 0 !important; padding: 0 !important; }
.nav-item { display: inline-block !important; }
.nav-link {
  text-decoration: none !important; color: var(--text-dark) !important; font-weight: 500 !important; font-size: 16px !important;
  transition: var(--transition) !important; position: relative !important; padding: 8px 0 !important; display: inline-block !important;
}
.nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: var(--primary); transition: width 0.3s ease; }
.nav-link:hover { color: var(--primary) !important; }
.nav-link:hover::after { width: 100%; }

.btn-book {
  background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 14px 32px;
  font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  font-size: 16px; font-family: 'Inter', sans-serif; white-space: nowrap;
  box-shadow: 0 6px 16px rgba(184, 107, 75, 0.25);
}
.btn-book:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(184, 107, 75, 0.4); }

.btn-login {
  background: transparent; color: var(--secondary); border: 1px solid var(--secondary);
  padding: 12px 28px; font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  margin-right: 15px; font-size: 16px;
}
.btn-login:hover { background: var(--secondary); color: #fff; }

.btn-logout {
  background: transparent; color: #E53E3E; border: 1px solid rgba(229,62,62,0.5);
  padding: 12px 28px; font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); margin-left: 15px;
}
.btn-logout:hover { background: #E53E3E; color: #fff; }
.user-greeting { color: var(--text-dark); font-weight: 500; margin-right: 15px; font-size: 16px; }

@media (max-width: 968px) { .nav-menu { gap: 20px !important; } }
@media (max-width: 768px) {
  .nav-container { flex-direction: column; gap: 15px; }
  .nav-menu { gap: 15px !important; flex-wrap: wrap; justify-content: center; }
  .logo-text { font-size: 22px; }
  .btn-book, .btn-login { padding: 10px 24px; font-size: 15px; }
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.section-tag { display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 2.5px; color: var(--primary); font-weight: 700; margin-bottom: 16px; font-family: 'Inter', sans-serif; background: rgba(184,107,75,0.1); padding: 6px 16px; border-radius: 50px; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-header h2 { font-size: 48px; margin-bottom: 18px; font-weight: 600; letter-spacing: -0.5px; }
.section-header p { color: var(--text-muted); max-width: 650px; margin: 0 auto; font-size: 18px; line-height: 1.7; }
@media (max-width: 768px) { .section-header h2 { font-size: 34px; } .section-header p { font-size: 16px; } }

/* Global Forms */
input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="date"], textarea, select {
  width: 100%; padding: 16px 20px; border: 1px solid var(--border); border-radius: 14px;
  font-family: 'Inter', sans-serif; font-size: 16px; color: var(--text-dark); background: var(--cards);
  transition: var(--transition); margin-bottom: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}
input:focus, textarea:focus, select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(184, 107, 75, 0.1); background: #fff; }
label { display: block; font-weight: 500; margin-bottom: 8px; color: var(--secondary); font-size: 15px; }
.btn-submit, .btn-primary, button[type="submit"] {
  background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 16px 32px;
  font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  font-size: 16px; font-family: 'Inter', sans-serif; display: inline-block; text-align: center;
  box-shadow: 0 6px 16px rgba(184, 107, 75, 0.25); width: 100%;
}
.btn-submit:hover, button[type="submit"]:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(184, 107, 75, 0.4); }

.form-container, .auth-container, .booking-container {
  background: var(--cards); padding: 50px; border-radius: var(--radius); box-shadow: var(--shadow-md);
  max-width: 550px; margin: 140px auto 80px; border: 1px solid var(--border);
}
.form-header h2, .auth-header h2 { color: var(--secondary); margin-bottom: 12px; font-size: 38px; text-align: center; }
@media (max-width: 768px) { .form-container, .auth-container, .booking-container { padding: 30px 20px; margin: 100px auto 40px; border-radius: 20px; } .form-header h2 { font-size: 32px; } }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-color); }
::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary-light); }
"""
write_file("App.css", app_css)

# 2. Hero.css
hero_css = """.hero {
  position: relative; min-height: 90vh; display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden; background: var(--bg-color); padding-top: 80px;
}
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('./House.jpeg') center/cover no-repeat;
  z-index: 0;
  animation: zoomBg 30s infinite alternate cubic-bezier(0.45, 0.05, 0.55, 0.95);
}
.hero-overlay::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(30, 58, 95, 0.65), rgba(30, 58, 95, 0.35));
}
@keyframes zoomBg { from { transform: scale(1); } to { transform: scale(1.15); } }

.hero-content {
  position: relative; z-index: 2; max-width: 1000px; padding: 50px;
  background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px);
  border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

.hero-badge {
  display: inline-block; background: rgba(242, 184, 75, 0.15); backdrop-filter: blur(10px);
  padding: 8px 24px; border-radius: 50px; font-size: 14px; font-weight: 600;
  color: var(--accent); letter-spacing: 2px; margin-bottom: 25px;
  border: 1px solid rgba(242, 184, 75, 0.3); text-transform: uppercase;
}
.hero-title {
  font-size: 72px; font-weight: 600; color: #ffffff; line-height: 1.15;
  margin-bottom: 25px; letter-spacing: -1px; text-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.hero-title .highlight { color: var(--accent); font-style: italic; font-weight: 500; }
.hero-subtitle {
  font-size: 18px; color: rgba(255,255,255,0.9); margin-bottom: 40px; line-height: 1.6;
  font-weight: 400; max-width: 650px; margin-left: auto; margin-right: auto;
}
.hero-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 50px; flex-wrap: wrap; }
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 16px 40px;
  font-size: 16px; font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  box-shadow: 0 8px 20px rgba(184, 107, 75, 0.3);
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(184, 107, 75, 0.5); filter: brightness(1.1); }
.btn-outline {
  background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255,255,255,0.4);
  padding: 16px 40px; font-size: 16px; font-weight: 600; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); backdrop-filter: blur(5px);
}
.btn-outline:hover { background: #fff; color: var(--secondary); transform: translateY(-3px); }

.hero-stats { display: flex; justify-content: center; gap: 80px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); flex-wrap: wrap; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 36px; font-weight: 600; color: var(--accent); font-family: 'Playfair Display', serif; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.stat-label { font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; }

.hero-scroll { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 2; text-align: center; }
.hero-scroll span { display: block; font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
.scroll-mouse { width: 26px; height: 42px; border: 2px solid rgba(255,255,255,0.5); border-radius: 20px; position: relative; margin: 0 auto; background: rgba(0,0,0,0.1); }
.scroll-mouse::before { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 3px; height: 8px; background: var(--accent); border-radius: 2px; animation: scrollWheel 1.5s infinite; }
@keyframes scrollWheel { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(15px); } }

@media (max-width: 968px) { .hero-title { font-size: 56px; } .hero-content { padding: 40px 30px; } }
@media (max-width: 768px) {
  .hero { min-height: 80vh; padding-top: 100px; }
  .hero-title { font-size: 40px; }
  .hero-subtitle { font-size: 16px; margin-bottom: 30px; }
  .hero-content { padding: 30px 20px; background: transparent; border: none; box-shadow: none; backdrop-filter: none; }
  .hero-stats { gap: 30px; border-top: none; }
  .stat-number { font-size: 28px; }
}
"""
write_file("Hero.css", hero_css)

# 3. About.css
about_css = """.about { padding: 140px 0; background: var(--bg-color); position: relative; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.about-image { position: relative; }
.image-stack { position: relative; height: 600px; }
.image-stack__item { position: absolute; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); transition: var(--transition); }
.image-stack__item--top { top: 0; right: 0; width: 65%; z-index: 2; border: 10px solid var(--bg-color); }
.image-stack__item--bottom { bottom: 0; left: 0; width: 75%; z-index: 1; }
.image-stack__item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
.image-stack__item:hover { box-shadow: var(--shadow-hover); z-index: 3; }
.image-stack__item:hover img { transform: scale(1.05); }
.image-stack__item--top { height: 400px; }
.image-stack__item--bottom { height: 400px; }

.about-content h2 { font-size: 48px; font-weight: 600; color: var(--secondary); margin-bottom: 25px; line-height: 1.2; letter-spacing: -0.5px; }
.about-description { color: var(--text-dark); font-size: 18px; line-height: 1.8; margin-bottom: 24px; font-weight: 500; }
.about-text { color: var(--text-muted); line-height: 1.8; margin-bottom: 40px; font-size: 16px; }
.about-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 40px; }
.feature { display: flex; gap: 16px; align-items: flex-start; padding: 24px; background: var(--cards); border-radius: 20px; transition: var(--transition); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.feature:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: rgba(184,107,75,0.3); }
.feature-icon { font-size: 32px; min-width: 45px; display: flex; align-items: center; justify-content: center; background: rgba(242,184,75,0.1); width: 60px; height: 60px; border-radius: 16px; }
.feature-content h4 { font-size: 17px; font-weight: 600; color: var(--secondary); margin-bottom: 6px; font-family: 'Inter', sans-serif; }
.feature-content p { font-size: 15px; color: var(--text-muted); margin: 0; line-height: 1.6; }

.about-stats { display: flex; gap: 50px; padding: 30px 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stat-item { flex: 1; }
.stat-number { display: block; font-size: 38px; font-weight: 600; color: var(--primary); margin-bottom: 5px; font-family: 'Playfair Display', serif; }
.stat-label { font-size: 14px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
.btn-learn { background: transparent; color: var(--primary); border: 2px solid var(--primary); padding: 14px 36px; font-weight: 600; font-size: 16px; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 8px; }
.btn-learn:hover { background: var(--primary); color: #fff; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(184, 107, 75, 0.25); }

@media (max-width: 1024px) { .about-grid { gap: 40px; grid-template-columns: 1fr; } .image-stack { height: 500px; margin-bottom: 40px; max-width: 700px; margin: 0 auto 50px; } }
@media (max-width: 768px) { .about { padding: 80px 0; } .about-content h2 { font-size: 34px; } .about-features { grid-template-columns: 1fr; } .about-stats { gap: 20px; flex-wrap: wrap; } .stat-number { font-size: 32px; } }
"""
write_file("About.css", about_css)

# 4. Amenities.css
amenities_css = """.amenities { padding: 140px 0; background: #FFFFFF; position: relative; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.amenity-card { background: var(--bg-color); padding: 40px 30px; border-radius: var(--radius); text-align: center; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
.amenity-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-md); border-color: rgba(184,107,75,0.2); background: #fff; }
.amenity-icon { font-size: 44px; margin-bottom: 24px; display: inline-block; transition: var(--transition); filter: grayscale(10%); background: rgba(242,184,75,0.1); width: 80px; height: 80px; line-height: 80px; border-radius: 50%; }
.amenity-card:hover .amenity-icon { transform: scale(1.1) rotate(5deg); filter: grayscale(0%); background: rgba(184,107,75,0.1); }
.amenity-card h3 { font-size: 20px; font-weight: 600; color: var(--secondary); margin-bottom: 12px; font-family: 'Inter', sans-serif; }
.amenity-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }
@media (max-width: 768px) { .amenities { padding: 80px 0; } .amenities-grid { gap: 24px; } .amenity-card { padding: 30px 20px; } }
"""
write_file("Amenities.css", amenities_css)

# 5. Footer.css
footer_css = """.footer {
  background: var(--cards);
  color: var(--text-dark);
  padding: 100px 0 40px;
  position: relative;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid var(--border);
}
.footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 80px; }
.footer-section h4 {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--secondary);
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 12px;
  letter-spacing: 0.5px;
}
.footer-section h4::after { content: ''; position: absolute; left: 0; bottom: 0; width: 30px; height: 3px; background: var(--accent); border-radius: 3px; }
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer-section p { color: var(--text-muted); line-height: 1.8; margin-bottom: 25px; font-size: 16px; max-width: 350px; }
.footer-section ul { list-style: none; padding: 0; }
.footer-section li { margin-bottom: 16px; }
.footer-section a { color: var(--text-muted); text-decoration: none; transition: var(--transition); display: inline-block; font-size: 16px; font-weight: 500; }
.footer-section a:hover { color: var(--primary); transform: translateX(5px); }
.newsletter { display: flex; gap: 12px; }
.newsletter input { flex: 1; padding: 14px 18px; border: 1px solid var(--border); background: var(--bg-color); color: var(--text-dark); border-radius: 14px; outline: none; transition: var(--transition); margin-bottom: 0 !important; font-size: 15px; }
.newsletter input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px rgba(184,107,75,0.1); }
.newsletter button { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 0 24px; border-radius: 14px; cursor: pointer; font-weight: 600; transition: var(--transition); width: auto; font-family: 'Inter', sans-serif; box-shadow: 0 4px 10px rgba(184,107,75,0.2); }
.newsletter button:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(184,107,75,0.35); }
.footer-bottom { text-align: center; padding-top: 40px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
.footer-bottom p { color: var(--text-muted); font-size: 15px; margin: 0; }
@media (max-width: 1024px) { .footer-content { grid-template-columns: 1fr 1fr; gap: 50px; } }
@media (max-width: 768px) { .footer-content { grid-template-columns: 1fr; gap: 40px; } .footer { padding: 80px 0 30px; } .footer-bottom { flex-direction: column; text-align: center; justify-content: center; } }
"""
write_file("Footer.css", footer_css)

# 6. Gallery / Practice
gallery_css = """.page, .gallery-page { padding: 140px 24px 80px; min-height: 100vh; background: var(--bg-color); }
.heading, .gallery-page-header h1 { text-align: center; font-size: 48px; color: var(--secondary); margin-bottom: 20px; font-weight: 600; letter-spacing: -0.5px; }
.filters, .category-filter { display: flex; justify-content: center; gap: 15px; margin-bottom: 50px; flex-wrap: wrap; }
.filters button, .filter-btn { background: var(--cards); color: var(--text-dark); border: 1px solid var(--border); padding: 12px 28px; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); font-weight: 500; font-size: 16px; font-family: 'Inter', sans-serif; box-shadow: var(--shadow-sm); }
.filters button:hover, .filter-btn:hover, .filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(184, 107, 75, 0.25); }
.gallery, .full-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 32px; max-width: 1200px; margin: 0 auto; }
.card, .gallery-card { background: var(--cards); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid var(--border); display: flex; flex-direction: column; }
.card:hover, .gallery-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-hover); border-color: rgba(184, 107, 75, 0.2); }
.card img, .gallery-card-image img { width: 100%; height: 280px; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.card:hover img, .gallery-card:hover img { transform: scale(1.1); }
.card p, .gallery-card-info h3 { padding: 24px; text-align: center; font-weight: 600; color: var(--secondary); font-size: 18px; font-family: 'Inter', sans-serif; margin: 0; }
/* Modal */
.modal, .full-lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(30,58,95,0.9); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; opacity: 1; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content, .lightbox-layout { background: var(--cards); border-radius: var(--radius); overflow: hidden; display: flex; max-width: 1100px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.4); animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-left, .lightbox-image { flex: 1.5; background: #000; }
.modal-left img, .lightbox-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal-right, .lightbox-info { flex: 1; padding: 50px; overflow-y: auto; display: flex; flex-direction: column; justify-content: center; }
.modal-right h2, .lightbox-info h2 { font-size: 36px; color: var(--secondary); margin-bottom: 20px; }
.modal-right p, .lightbox-info p { color: var(--text-muted); margin-bottom: 16px; line-height: 1.7; font-size: 16px;}
.modal-right b { color: var(--text-dark); font-weight: 600; }
.modal-right button, .lightbox-close-btn { position: absolute; top: 24px; right: 24px; background: var(--bg-color); border: 1px solid var(--border); width: 44px; height: 44px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; color: var(--text-dark); z-index: 10; }
.modal-right button:hover, .lightbox-close-btn:hover { background: var(--border); transform: scale(1.1); }
.book-now-btn { display: block; width: 100%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; text-align: center; padding: 16px; border-radius: var(--radius-btn); text-decoration: none; font-weight: 600; margin-top: 30px; transition: var(--transition); border: none; cursor: pointer; font-size: 16px; box-shadow: 0 6px 16px rgba(184,107,75,0.25); }
.book-now-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(184,107,75,0.4); }
@media (max-width: 968px) { .modal-content, .lightbox-layout { flex-direction: column; } .modal-left, .lightbox-image { height: 400px; flex: none; } .modal-right, .lightbox-info { padding: 30px; } .gallery { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
"""
write_file("Practics.css", gallery_css)
write_file("GalleryPage.css", gallery_css)
write_file("Gallery.css", gallery_css)

print("UI Theme completely rewritten with design-first approach!")
