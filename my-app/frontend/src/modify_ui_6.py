import os

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# 1. App.css
app_css = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

:root {
  --primary: #8B4E3D;        /* Warm Copper */
  --primary-light: #a65e49;
  --secondary: #203040;      /* Luxury Navy */
  --accent: #D6A354;         /* Soft Gold */
  --accent-light: #EFE1CC;
  --bg-color: #F7F3EA;       /* Main Background */
  --cards: #FFFFFF;          /* Pure White Cards */
  --text-dark: #17202A;      /* Deep Text */
  --text-muted: #6D747C;     /* Muted Text */
  --border: #E4D8C8;         /* Soft Border */

  --shadow-sm: 0 4px 12px rgba(32, 48, 64, 0.04);
  --shadow-md: 0 12px 32px rgba(32, 48, 64, 0.06);
  --shadow-hover: 0 20px 48px rgba(139, 78, 61, 0.12);
  
  --radius: 20px;
  --radius-btn: 50px;
  --transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, .hero-title, .logo-text, .section-header h2, .heading {
  font-family: 'Playfair Display', serif;
  color: var(--secondary);
}

.App { overflow-x: hidden; }

/* Scroll Reveals */
.reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.4, 0, 0, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.15s; }
.reveal-delay-2 { transition-delay: 0.3s; }

/* Navbar */
.navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: rgba(247, 243, 234, 0.9);
  backdrop-filter: blur(20px);
  padding: 16px 0;
  transition: var(--transition);
  border-bottom: 1px solid rgba(228, 216, 200, 0.6);
}

.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
}

.logo { display: flex; align-items: center; gap: 10px; transition: var(--transition); cursor: pointer; color: var(--primary); }
.logo:hover { transform: translateY(-1px); }
.logo-icon { color: var(--primary); }
.logo-text { font-size: 24px; font-weight: 600; color: var(--secondary); letter-spacing: -0.2px; }

.nav-menu { display: flex !important; list-style: none !important; gap: 36px !important; margin: 0 !important; padding: 0 !important; }
.nav-item { display: inline-block !important; }
.nav-link {
  text-decoration: none !important; color: var(--secondary) !important; font-weight: 500 !important; font-size: 15px !important;
  transition: var(--transition) !important; position: relative !important; padding: 8px 0 !important; display: inline-block !important;
}
.nav-link::after { content: ''; position: absolute; width: 0; height: 1px; bottom: 0; left: 0; background-color: var(--primary); transition: width 0.3s ease; }
.nav-link:hover { color: var(--primary) !important; }
.nav-link:hover::after { width: 100%; }

.btn-book {
  background: var(--primary); color: #fff; border: none; padding: 12px 32px;
  font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  font-size: 15px; font-family: 'Inter', sans-serif; white-space: nowrap;
  box-shadow: 0 4px 12px rgba(139, 78, 61, 0.2);
}
.btn-book:hover { background: var(--primary-light); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139, 78, 61, 0.35); }

.btn-login {
  background: transparent; color: var(--secondary); border: 1px solid var(--secondary);
  padding: 10px 24px; font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  margin-right: 15px; font-size: 15px;
}
.btn-login:hover { background: var(--secondary); color: #fff; }

.btn-logout {
  background: transparent; color: #D32F2F; border: 1px solid rgba(211,47,47,0.3);
  padding: 10px 24px; font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); margin-left: 15px;
}
.btn-logout:hover { background: #D32F2F; color: #fff; }
.user-greeting { color: var(--secondary); font-weight: 500; margin-right: 15px; font-size: 15px; }

@media (max-width: 968px) { .nav-menu { gap: 20px !important; } }
@media (max-width: 768px) {
  .nav-container { flex-direction: column; gap: 16px; }
  .nav-menu { gap: 16px !important; flex-wrap: wrap; justify-content: center; }
  .logo-text { font-size: 22px; }
  .btn-book, .btn-login { padding: 10px 24px; font-size: 14px; }
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.section-tag { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: var(--primary); font-weight: 600; margin-bottom: 20px; font-family: 'Inter', sans-serif; }
.section-tag::before, .section-tag::after { content: ''; width: 30px; height: 1px; background: var(--primary); opacity: 0.3; }

.section-header { text-align: center; margin-bottom: 60px; }
.section-header h2 { font-size: 42px; margin-bottom: 20px; font-weight: 500; }
.section-header p { color: var(--text-muted); max-width: 600px; margin: 0 auto; font-size: 16px; line-height: 1.8; }
@media (max-width: 768px) { .section-header h2 { font-size: 32px; } }

/* Global Forms */
input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="date"], textarea, select {
  width: 100%; padding: 16px 20px; border: 1px solid var(--border); border-radius: 12px;
  font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-dark); background: var(--bg-color);
  transition: var(--transition); margin-bottom: 20px;
}
input:focus, textarea:focus, select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(139, 78, 61, 0.08); background: #fff; }
label { display: block; font-weight: 500; margin-bottom: 8px; color: var(--secondary); font-size: 14px; }
.btn-submit, .btn-primary, button[type="submit"] {
  background: var(--primary); color: #fff; border: none; padding: 16px 32px;
  font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  font-size: 15px; font-family: 'Inter', sans-serif; display: inline-block; text-align: center;
  box-shadow: 0 6px 16px rgba(139, 78, 61, 0.2); width: 100%;
}
.btn-submit:hover, button[type="submit"]:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(139, 78, 61, 0.3); background: var(--primary-light); }

.form-container, .auth-container, .booking-container {
  background: var(--cards); padding: 50px; border-radius: var(--radius); box-shadow: var(--shadow-md);
  max-width: 500px; margin: 140px auto 80px; border: 1px solid var(--border);
}
.form-header h2, .auth-header h2 { color: var(--secondary); margin-bottom: 15px; font-size: 32px; text-align: center; font-weight: 500; }
@media (max-width: 768px) { .form-container, .auth-container, .booking-container { padding: 30px 20px; margin: 100px auto 40px; border-radius: 16px; } .form-header h2 { font-size: 28px; } }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-color); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }
"""
write_file("App.css", app_css)

# 2. Hero.css
hero_css = """.hero {
  position: relative; min-height: 95vh; display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden; background: var(--secondary); padding-top: 80px;
}
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('./House.jpeg') center/cover no-repeat;
  z-index: 0;
  animation: panImage 30s infinite alternate ease-in-out;
}
.hero-overlay::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(32, 48, 64, 0.5), rgba(32, 48, 64, 0.8));
}
@keyframes panImage { from { transform: scale(1.05) translate(0, 0); } to { transform: scale(1.15) translate(-10px, -10px); } }

.hero-content {
  position: relative; z-index: 2; max-width: 900px; padding: 40px 20px;
}

.hero-badge {
  display: inline-block; font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 3px; margin-bottom: 20px;
  text-transform: uppercase; font-family: 'Inter', sans-serif;
  border: 1px solid rgba(214, 163, 84, 0.3); padding: 8px 24px; border-radius: 50px;
  background: rgba(214, 163, 84, 0.05); backdrop-filter: blur(4px);
}
.hero-title {
  font-size: 64px; font-weight: 500; color: #ffffff; line-height: 1.1;
  margin-bottom: 25px; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.hero-title .highlight { font-style: italic; color: var(--accent); font-weight: 400; }
.hero-subtitle {
  font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 45px; line-height: 1.7;
  font-weight: 400; max-width: 600px; margin-left: auto; margin-right: auto; font-family: 'Inter', sans-serif;
}
.hero-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
.btn-primary {
  background: var(--primary); color: #fff; border: none; padding: 16px 42px;
  font-size: 15px; font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
  box-shadow: 0 8px 24px rgba(139, 78, 61, 0.4); font-family: 'Inter', sans-serif;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(139, 78, 61, 0.6); background: var(--primary-light); }
.btn-outline {
  background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.6);
  padding: 16px 42px; font-size: 15px; font-weight: 500; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition);
}
.btn-outline:hover { background: #fff; color: var(--secondary); transform: translateY(-3px); }

.hero-stats { display: flex; justify-content: center; gap: 80px; padding-top: 40px; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 36px; font-weight: 500; color: #ffffff; font-family: 'Playfair Display', serif; }
.stat-label { font-size: 13px; color: var(--accent); font-weight: 500; text-transform: uppercase; letter-spacing: 2px; }

@media (max-width: 968px) { .hero-title { font-size: 52px; } }
@media (max-width: 768px) {
  .hero { min-height: 85vh; padding-top: 100px; }
  .hero-title { font-size: 38px; }
  .hero-subtitle { font-size: 16px; margin-bottom: 35px; }
  .hero-stats { gap: 30px; }
  .stat-number { font-size: 28px; }
}
"""
write_file("Hero.css", hero_css)

# 3. About.css
about_css = """.about { padding: 120px 0; background: var(--bg-color); position: relative; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about-image { position: relative; }
.image-stack { position: relative; height: 550px; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); }
.image-stack img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; display: block; }
.image-stack:hover img { transform: scale(1.05); }
.image-stack__item { position: absolute; }
.image-stack__item--top { top: -20px; right: -20px; width: 60%; height: 350px; border: 12px solid var(--bg-color); z-index: 2; border-radius: 30px; overflow: hidden; box-shadow: var(--shadow-md); }
.image-stack__item--bottom { bottom: 0; left: 0; width: 80%; height: 450px; z-index: 1; border-radius: var(--radius); overflow: hidden; }

.about-content h2 { font-size: 42px; font-weight: 500; color: var(--secondary); margin-bottom: 24px; line-height: 1.2; letter-spacing: -0.5px; }
.about-description { color: var(--text-dark); font-size: 18px; line-height: 1.8; margin-bottom: 24px; font-weight: 400; font-family: 'Playfair Display', serif; font-style: italic; }
.about-text { color: var(--text-muted); line-height: 1.8; margin-bottom: 40px; font-size: 16px; }
.about-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
.feature { display: flex; gap: 16px; align-items: flex-start; padding: 20px; background: var(--cards); border-radius: var(--radius); transition: var(--transition); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.feature:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: rgba(139,78,61,0.2); }
.feature-icon { font-size: 24px; min-width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--accent-light); color: var(--primary); border-radius: 12px; }
.feature-content h4 { font-size: 16px; font-weight: 600; color: var(--secondary); margin-bottom: 6px; }
.feature-content p { font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.6; }

.about-stats { display: flex; gap: 40px; padding: 30px 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stat-item { flex: 1; }
.stat-number { display: block; font-size: 32px; font-weight: 600; color: var(--primary); margin-bottom: 4px; font-family: 'Playfair Display', serif; }
.stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
.btn-learn { background: transparent; color: var(--secondary); border: 1px solid var(--secondary); padding: 12px 32px; font-weight: 500; font-size: 15px; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 8px; }
.btn-learn:hover { background: var(--secondary); color: #fff; transform: translateY(-3px); box-shadow: var(--shadow-sm); }

@media (max-width: 1024px) { .about-grid { gap: 40px; grid-template-columns: 1fr; } .about-image { max-width: 600px; margin: 0 auto; width: 100%; } .image-stack { height: 450px; } .image-stack__item--top { height: 250px; } .image-stack__item--bottom { height: 350px; } }
@media (max-width: 768px) { .about { padding: 80px 0; } .about-content h2 { font-size: 32px; } .about-features { grid-template-columns: 1fr; } .about-stats { gap: 20px; flex-wrap: wrap; } .stat-number { font-size: 28px; } }
"""
write_file("About.css", about_css)

# 4. Amenities.css
amenities_css = """.amenities { padding: 120px 0; background: var(--cards); position: relative; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.amenity-card { background: var(--bg-color); padding: 32px 24px; border-radius: var(--radius); text-align: center; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid transparent; }
.amenity-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--border); background: var(--cards); }
.amenity-icon { font-size: 32px; margin-bottom: 20px; display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: var(--accent-light); color: var(--primary); transition: var(--transition); }
.amenity-card:hover .amenity-icon { transform: scale(1.1); background: var(--primary); color: #fff; }
.amenity-card h3 { font-size: 18px; font-weight: 500; color: var(--secondary); margin-bottom: 12px; font-family: 'Inter', sans-serif; }
.amenity-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }
@media (max-width: 768px) { .amenities { padding: 80px 0; } .amenities-grid { gap: 16px; } .amenity-card { padding: 24px 20px; } }
"""
write_file("Amenities.css", amenities_css)

# 5. Footer.css
footer_css = """.footer {
  background: var(--secondary);
  color: #fff;
  padding: 100px 0 30px;
  position: relative;
  font-family: 'Inter', sans-serif;
}
.footer-content { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
.footer-section h4 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: var(--accent);
  margin-bottom: 24px;
}
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer-logo .logo-icon { color: var(--accent); }
.footer-section p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 24px; font-size: 15px; max-width: 380px; }
.footer-section ul { list-style: none; padding: 0; }
.footer-section li { margin-bottom: 16px; }
.footer-section a { color: rgba(255,255,255,0.7); text-decoration: none; transition: var(--transition); display: inline-block; font-size: 15px; }
.footer-section a:hover { color: var(--accent); transform: translateX(5px); }
.newsletter { display: flex; gap: 10px; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
.newsletter input { flex: 1; padding: 12px 16px; border: none; background: transparent; color: #fff; outline: none; margin-bottom: 0 !important; font-size: 15px; box-shadow: none; }
.newsletter input::placeholder { color: rgba(255,255,255,0.4); }
.newsletter button { background: var(--primary); color: #fff; border: none; padding: 0 20px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: var(--transition); width: auto; box-shadow: none;}
.newsletter button:hover { background: var(--primary-light); }
.footer-bottom { text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.footer-bottom p { color: rgba(255,255,255,0.5); font-size: 14px; margin: 0; }
@media (max-width: 1024px) { .footer-content { grid-template-columns: 1fr 1fr; gap: 40px; } }
@media (max-width: 768px) { .footer-content { grid-template-columns: 1fr; gap: 40px; } .footer { padding: 80px 0 20px; } .footer-bottom { flex-direction: column; text-align: center; justify-content: center; } }
"""
write_file("Footer.css", footer_css)

# 6. Gallery / Practice
gallery_css = """.page, .gallery-page { padding: 140px 24px 80px; min-height: 100vh; background: var(--bg-color); }
.heading, .gallery-page-header h1 { text-align: center; font-size: 42px; color: var(--secondary); margin-bottom: 20px; font-weight: 500; }
.filters, .category-filter { display: flex; justify-content: center; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; }
.filters button, .filter-btn { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 10px 24px; border-radius: var(--radius-btn); cursor: pointer; transition: var(--transition); font-weight: 500; font-size: 15px; font-family: 'Inter', sans-serif; }
.filters button:hover, .filter-btn:hover, .filter-btn.active { background: var(--secondary); color: #fff; border-color: var(--secondary); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.gallery, .full-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.card, .gallery-card { background: var(--cards); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid var(--border); display: flex; flex-direction: column; }
.card:hover, .gallery-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.card img, .gallery-card-image img { width: 100%; height: 260px; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); display: block; }
.card:hover img, .gallery-card:hover img { transform: scale(1.08); }
.card p, .gallery-card-info h3 { padding: 20px; text-align: center; font-weight: 500; color: var(--secondary); font-size: 17px; font-family: 'Inter', sans-serif; margin: 0; }
/* Modal */
.modal, .full-lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(32,48,64,0.95); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; opacity: 1; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content, .lightbox-layout { background: var(--cards); border-radius: var(--radius); overflow: hidden; display: flex; max-width: 1000px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-left, .lightbox-image { flex: 1.5; background: #000; }
.modal-left img, .lightbox-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal-right, .lightbox-info { flex: 1; padding: 40px; overflow-y: auto; display: flex; flex-direction: column; justify-content: center; }
.modal-right h2, .lightbox-info h2 { font-size: 32px; color: var(--secondary); margin-bottom: 16px; font-weight: 500; }
.modal-right p, .lightbox-info p { color: var(--text-muted); margin-bottom: 24px; line-height: 1.7; font-size: 15px;}
.modal-right b { color: var(--text-dark); font-weight: 500; }
.modal-right button, .lightbox-close-btn { position: absolute; top: 20px; right: 20px; background: var(--bg-color); border: 1px solid var(--border); width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; color: var(--text-dark); z-index: 10; }
.modal-right button:hover, .lightbox-close-btn:hover { background: var(--border); }
.book-now-btn { display: block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 14px; border-radius: var(--radius-btn); text-decoration: none; font-weight: 500; margin-top: auto; transition: var(--transition); border: none; cursor: pointer; font-size: 15px; box-shadow: 0 4px 12px rgba(139,78,61,0.2); }
.book-now-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,78,61,0.3); background: var(--primary-light); }
@media (max-width: 968px) { .modal-content, .lightbox-layout { flex-direction: column; } .modal-left, .lightbox-image { height: 350px; flex: none; } .modal-right, .lightbox-info { padding: 30px; } .gallery { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
"""
write_file("Practics.css", gallery_css)
write_file("GalleryPage.css", gallery_css)
write_file("Gallery.css", gallery_css)

# Update components with lucide-react icons
def update_app_js():
    app = os.path.join(base_dir, 'App.js')
    with open(app, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if lucide is imported
    if "import { Home } from 'lucide-react';" not in content:
        content = content.replace("import './App.css';", "import './App.css';\nimport { Home, User } from 'lucide-react';")
    
    # Replace logo emoji
    content = content.replace('<span className="logo-icon">🏡</span>', '<span className="logo-icon"><Home size={28} /></span>')
    content = content.replace('👋 Hi', '<User size={18} /> Hi')
    
    with open(app, 'w', encoding='utf-8') as f:
        f.write(content)

def update_about_js():
    about = os.path.join(base_dir, 'About.js')
    with open(about, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "import { Leaf, Utensils, Flame, Waves, PawPrint, Bike } from 'lucide-react';" not in content:
        content = content.replace("import './About.css';", "import './About.css';\nimport { Leaf, Utensils, Flame, Waves, PawPrint, Bike } from 'lucide-react';")
        content = content.replace('<div className="feature-icon">🌿</div>', '<div className="feature-icon"><Leaf size={28} /></div>')
        content = content.replace('<div className="feature-icon">🍽️</div>', '<div className="feature-icon"><Utensils size={28} /></div>')
        content = content.replace('<div className="feature-icon">🔥</div>', '<div className="feature-icon"><Flame size={28} /></div>')
        content = content.replace('<div className="feature-icon">🚣</div>', '<div className="feature-icon"><Waves size={28} /></div>')
        content = content.replace('<div className="feature-icon">🐅</div>', '<div className="feature-icon"><PawPrint size={28} /></div>')
        content = content.replace('<div className="feature-icon">🚲</div>', '<div className="feature-icon"><Bike size={28} /></div>')
        
    with open(about, 'w', encoding='utf-8') as f:
        f.write(content)

def update_amenities_jsx():
    amenities = os.path.join(base_dir, 'Amenities.jsx')
    with open(amenities, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "import { BedDouble, ChefHat, Wifi, Snowflake, Bath, Tv, Flame, Car, ShieldCheck, Coffee, Shirt, HeartPulse } from 'lucide-react';" not in content:
        content = content.replace("import './Amenities.css';", "import './Amenities.css';\nimport { BedDouble, ChefHat, Wifi, Snowflake, Bath, Tv, Flame, Car, ShieldCheck, Coffee, Shirt, HeartPulse } from 'lucide-react';")
        
        # We need to map the emojis directly in the array mapping loop or redefine the array
        new_list = """const amenitiesList = [
    { icon: <BedDouble size={32} />, title: 'Premium Bedding', desc: 'Luxury mattresses with Egyptian cotton linens' },
    { icon: <ChefHat size={32} />, title: 'Modern Kitchen', desc: 'Fully equipped with premium appliances' },
    { icon: <Wifi size={32} />, title: 'High-Speed WiFi', desc: '100 Mbps fiber optic connection' },
    { icon: <Snowflake size={32} />, title: 'Air Conditioning', desc: 'Split AC in every room' },
    { icon: <Bath size={32} />, title: 'Spa Bathroom', desc: 'Rain shower & premium toiletries' },
    { icon: <Tv size={32} />, title: 'Smart TV', desc: '55" 4K with Netflix & Prime' },
    { icon: <Flame size={32} />, title: 'Fire Pit', desc: 'Evening bonfire arrangements' },
    { icon: <Car size={32} />, title: 'Free Parking', desc: 'Secure gated parking' },
    { icon: <ShieldCheck size={32} />, title: '24/7 Security', desc: 'CCTV surveillance & security guards' },
    { icon: <Coffee size={32} />, title: 'Tea/Coffee Maker', desc: 'Complimentary premium beverages' },
    { icon: <Shirt size={32} />, title: 'Laundry Service', desc: 'Same day laundry available' },
    { icon: <HeartPulse size={32} />, title: 'Medical Kit', desc: 'First aid & emergency assistance' }
  ];"""
        
        # Replace the old amenities list
        import re
        content = re.sub(r'const amenitiesList = \[.*?\];', new_list, content, flags=re.DOTALL)
        
    with open(amenities, 'w', encoding='utf-8') as f:
        f.write(content)

def update_footer_jsx():
    footer = os.path.join(base_dir, 'Footer.jsx')
    with open(footer, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "import { Home } from 'lucide-react';" not in content:
        content = content.replace("import './Footer.css';", "import './Footer.css';\nimport { Home, ArrowRight } from 'lucide-react';")
        content = content.replace('<span>🏡</span>', '<span className="logo-icon"><Home size={28} /></span>')
        content = content.replace('<button>→</button>', '<button><ArrowRight size={20} /></button>')
        
    with open(footer, 'w', encoding='utf-8') as f:
        f.write(content)


update_app_js()
update_about_js()
update_amenities_jsx()
update_footer_jsx()

print("UI Theme successfully updated to Professional Luxury Travel Brand Style!")
