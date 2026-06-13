import os

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# 1. App.css
app_css = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&display=swap');

/* Premium Light Resort Theme */
:root {
  --primary: #C46A3A;        /* Terracotta / Clay Orange */
  --primary-light: #d6875c;
  --secondary: #2F4858;      /* Deep Blue-Gray */
  --accent: #D9A441;         /* Muted Gold */
  --accent-light: #e6bd6a;
  --bg-color: #FAF7F2;       /* Warm Off-White */
  --bg-secondary: #F8F5EF;   /* Soft Beige */
  --cards: #FFFFFF;          /* Pure White Cards */
  --text-dark: #1F2933;      /* Deep Charcoal */
  --text-light: #6B7280;     /* Muted Gray */
  --border: #E8DED2;         /* Soft Border */
  
  --shadow-sm: 0 4px 10px rgba(47, 72, 88, 0.05);
  --shadow-md: 0 12px 25px rgba(47, 72, 88, 0.08);
  --shadow-hover: 0 20px 40px rgba(196, 106, 58, 0.15);
  --radius: 16px;
  --transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg-color);
  color: var(--text-dark);
  line-height: 1.7;
  font-size: 16px;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6, .hero-title, .logo-text, .heading {
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
  background: rgba(250, 247, 242, 0.95);
  backdrop-filter: blur(12px);
  padding: 16px 0;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
}

.logo { display: flex; align-items: center; gap: 10px; transition: var(--transition); cursor: pointer; }
.logo:hover { transform: scale(1.02); }
.logo-icon { font-size: 1.8rem; }
.logo-text { font-size: 24px; font-weight: 700; color: var(--secondary); letter-spacing: 0.5px; }

.nav-menu { display: flex !important; list-style: none !important; gap: 35px !important; margin: 0 !important; padding: 0 !important; }
.nav-item { display: inline-block !important; }
.nav-link {
  text-decoration: none !important; color: var(--text-dark) !important; font-weight: 500 !important; font-size: 15px !important;
  transition: var(--transition) !important; position: relative !important; padding: 8px 0 !important; display: inline-block !important;
}
.nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: var(--primary); transition: width 0.3s ease; }
.nav-link:hover { color: var(--primary) !important; }
.nav-link:hover::after { width: 100%; }

.btn-book {
  background: var(--primary); color: var(--cards); border: none; padding: 12px 30px;
  font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  font-size: 15px; font-family: 'Inter', sans-serif; white-space: nowrap;
  box-shadow: 0 4px 15px rgba(196,106,58,0.25);
}
.btn-book:hover { background: var(--primary-light); color: var(--cards); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(196,106,58,0.4); }

.btn-login {
  background: transparent; color: var(--secondary); border: 1px solid var(--border);
  padding: 10px 24px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  margin-right: 15px; font-size: 15px;
}
.btn-login:hover { background: var(--bg-secondary); border-color: var(--secondary); color: var(--secondary); }

.btn-logout {
  background: transparent; color: #E53E3E; border: 1px solid rgba(229,62,62,0.3);
  padding: 10px 24px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition); margin-left: 15px;
}
.btn-logout:hover { background: rgba(229,62,62,0.05); border-color: #E53E3E; }
.user-greeting { color: var(--text-dark); font-weight: 500; margin-right: 15px; }

@media (max-width: 900px) { .nav-menu { gap: 15px !important; } }
@media (max-width: 768px) {
  .nav-container { flex-direction: column; gap: 15px; }
  .nav-menu { gap: 15px !important; flex-wrap: wrap; justify-content: center; }
  .logo-text { font-size: 20px; }
  .btn-book, .btn-login { padding: 8px 20px; font-size: 14px; }
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-tag { display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: var(--accent); font-weight: 700; margin-bottom: 16px; font-family: 'Inter', sans-serif; }
.section-header { text-align: center; margin-bottom: 50px; }
.section-header h2 { font-size: 42px; margin-bottom: 15px; font-weight: 700; }
.section-header p { color: var(--text-light); max-width: 600px; margin: 0 auto; font-size: 16px; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }

/* Global Forms */
input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="date"], textarea, select {
  width: 100%; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius);
  font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-dark); background: var(--cards);
  transition: var(--transition); margin-bottom: 16px;
}
input:focus, textarea:focus, select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(196,106,58,0.1); }
label { display: block; font-weight: 500; margin-bottom: 8px; color: var(--secondary); font-size: 14px; }
.btn-submit, .btn-primary, button[type="submit"] {
  background: var(--primary); color: var(--cards); border: none; padding: 14px 28px;
  font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition);
  font-size: 15px; font-family: 'Inter', sans-serif; display: inline-block; text-align: center;
  box-shadow: var(--shadow-sm); width: 100%;
}
.btn-submit:hover, button[type="submit"]:hover { background: var(--primary-light); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.form-container, .auth-container, .booking-container {
  background: var(--cards); padding: 40px; border-radius: var(--radius); box-shadow: var(--shadow-md);
  max-width: 500px; margin: 120px auto 60px; border: 1px solid var(--border);
}
.form-header, .auth-header { text-align: center; margin-bottom: 30px; }
.form-header h2, .auth-header h2 { color: var(--secondary); margin-bottom: 10px; font-size: 32px; }
"""
write_file("App.css", app_css)

# 2. Hero.css
hero_css = """.hero {
  position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden; background: var(--bg-color); padding-top: 80px;
}
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('./House.jpeg') center/cover no-repeat;
  opacity: 0.15; z-index: 0;
  animation: zoomBg 25s infinite alternate linear;
}
@keyframes zoomBg { from { transform: scale(1); } to { transform: scale(1.1); } }
.hero-content { position: relative; z-index: 2; max-width: 900px; padding: 0 20px; }
.hero-badge {
  display: inline-block; background: var(--cards); backdrop-filter: blur(10px);
  padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600;
  color: var(--primary); letter-spacing: 1px; margin-bottom: 30px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
}
.hero-title {
  font-size: 64px; font-weight: 700; color: var(--secondary); line-height: 1.15;
  margin-bottom: 25px; letter-spacing: -1px;
}
.hero-title .highlight { color: var(--primary); font-style: italic; }
.hero-subtitle { font-size: 17px; color: var(--text-light); margin-bottom: 45px; line-height: 1.6; font-weight: 400; max-width: 600px; margin-left: auto; margin-right: auto; }
.hero-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
.btn-primary { background: var(--primary); color: var(--cards); border: none; padding: 16px 36px; font-size: 16px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition); box-shadow: 0 8px 25px rgba(196, 106, 58, 0.25); }
.btn-primary:hover { background: var(--primary-light); color: var(--cards); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(196, 106, 58, 0.4); }
.btn-outline { background: var(--cards); color: var(--secondary); border: 1px solid var(--border); padding: 16px 36px; font-size: 16px; font-weight: 600; border-radius: 50px; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm); }
.btn-outline:hover { background: var(--bg-secondary); border-color: var(--secondary); transform: translateY(-3px); }
.hero-stats { display: flex; justify-content: center; gap: 80px; padding-top: 30px; border-top: 1px solid var(--border); flex-wrap: wrap; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 32px; font-weight: 700; color: var(--primary); font-family: 'Playfair Display', serif; }
.stat-label { font-size: 14px; color: var(--text-light); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
.hero-scroll { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 2; text-align: center; }
.hero-scroll span { display: block; font-size: 12px; color: var(--text-light); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
.scroll-mouse { width: 26px; height: 42px; border: 2px solid var(--border); border-radius: 20px; position: relative; margin: 0 auto; background: var(--cards); }
.scroll-mouse::before { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 3px; height: 8px; background: var(--primary); border-radius: 2px; animation: scrollWheel 1.5s infinite; }
@keyframes scrollWheel { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(15px); } }
@media (max-width: 768px) {
  .hero-title { font-size: 40px; }
  .hero-subtitle { font-size: 16px; }
  .hero-stats { gap: 40px; }
  .stat-number { font-size: 28px; }
}
"""
write_file("Hero.css", hero_css)

# 3. About.css
about_css = """.about { padding: 120px 0; background: var(--bg-secondary); position: relative; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.about-image { position: relative; }
.image-stack { position: relative; height: 550px; }
.image-stack__item { position: absolute; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); transition: var(--transition); }
.image-stack__item--top { top: 0; right: 0; width: 65%; z-index: 2; border: 8px solid var(--bg-secondary); }
.image-stack__item--bottom { bottom: 0; left: 0; width: 70%; z-index: 1; }
.image-stack__item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
.image-stack__item:hover { box-shadow: var(--shadow-hover); z-index: 3; }
.image-stack__item:hover img { transform: scale(1.05); }
.image-stack__item--top { height: 350px; }
.image-stack__item--bottom { height: 350px; }
.about-content h2 { font-size: 42px; font-weight: 700; color: var(--secondary); margin-bottom: 25px; line-height: 1.2; letter-spacing: -0.5px; }
.about-description { color: var(--text-dark); font-size: 17px; line-height: 1.8; margin-bottom: 20px; font-weight: 500; }
.about-text { color: var(--text-light); line-height: 1.8; margin-bottom: 40px; font-size: 16px; }
.about-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
.feature { display: flex; gap: 15px; align-items: flex-start; padding: 20px; background: var(--cards); border-radius: var(--radius); transition: var(--transition); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.feature:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: rgba(196,106,58,0.3); }
.feature-icon { font-size: 32px; min-width: 45px; display: flex; align-items: center; justify-content: center; }
.feature-content h4 { font-size: 16px; font-weight: 600; color: var(--secondary); margin-bottom: 4px; font-family: 'Inter', sans-serif; }
.feature-content p { font-size: 14px; color: var(--text-light); margin: 0; line-height: 1.5; }
.about-stats { display: flex; gap: 50px; padding: 30px 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stat-item { flex: 1; }
.stat-number { display: block; font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 5px; font-family: 'Playfair Display', serif; }
.stat-label { font-size: 14px; color: var(--text-light); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
.btn-learn { background: var(--cards); color: var(--primary); border: 1px solid var(--primary); padding: 14px 36px; font-weight: 600; font-size: 16px; border-radius: 50px; cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 8px; }
.btn-learn:hover { background: var(--primary); color: var(--cards); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(196, 106, 58, 0.25); }
@media (max-width: 968px) { .about-grid { gap: 40px; grid-template-columns: 1fr; } .image-stack { height: 450px; margin-bottom: 40px; } }
@media (max-width: 768px) { .about-content h2 { font-size: 32px; } .about-features { grid-template-columns: 1fr; } .about-stats { gap: 20px; flex-wrap: wrap; } .stat-number { font-size: 28px; } }
"""
write_file("About.css", about_css)

# 4. Amenities.css
amenities_css = """.amenities { padding: 120px 0; background: var(--bg-color); position: relative; }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.amenity-card { background: var(--cards); padding: 35px 25px; border-radius: var(--radius); text-align: center; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
.amenity-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); border-color: rgba(196,106,58,0.2); }
.amenity-icon { font-size: 40px; margin-bottom: 20px; display: inline-block; transition: var(--transition); filter: grayscale(20%); }
.amenity-card:hover .amenity-icon { transform: scale(1.15) rotate(5deg); filter: grayscale(0%); }
.amenity-card h3 { font-size: 18px; font-weight: 600; color: var(--secondary); margin-bottom: 10px; font-family: 'Inter', sans-serif; }
.amenity-card p { font-size: 15px; color: var(--text-light); line-height: 1.6; }
@media (max-width: 768px) { .amenities { padding: 80px 0; } .amenities-grid { gap: 20px; } .amenity-card { padding: 25px 20px; } }
"""
write_file("Amenities.css", amenities_css)

# 5. Footer.css
footer_css = """.footer {
  background: var(--cards);
  color: var(--text-dark);
  padding: 80px 0 30px;
  position: relative;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid var(--border);
}
.footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 50px; margin-bottom: 60px; }
.footer-section h4 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--secondary);
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}
.footer-section h4::after { content: ''; position: absolute; left: 0; bottom: 0; width: 40px; height: 2px; background: var(--accent); }
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer-section p { color: var(--text-light); line-height: 1.8; margin-bottom: 25px; font-size: 15px; max-width: 350px; }
.footer-section ul { list-style: none; padding: 0; }
.footer-section li { margin-bottom: 15px; }
.footer-section a { color: var(--text-light); text-decoration: none; transition: var(--transition); display: inline-block; font-size: 15px; }
.footer-section a:hover { color: var(--primary); transform: translateX(5px); }
.newsletter { display: flex; gap: 10px; }
.newsletter input { flex: 1; padding: 12px 15px; border: 1px solid var(--border); background: var(--bg-color); color: var(--text-dark); border-radius: var(--radius); outline: none; transition: var(--transition); margin-bottom: 0 !important; }
.newsletter input:focus { border-color: var(--primary); background: var(--cards); box-shadow: 0 0 0 3px rgba(196,106,58,0.1); }
.newsletter button { background: var(--primary); color: var(--cards); border: none; padding: 0 20px; border-radius: var(--radius); cursor: pointer; font-weight: 600; transition: var(--transition); width: auto; font-family: 'Inter', sans-serif;}
.newsletter button:hover { background: var(--primary-light); transform: translateY(-2px); }
.footer-bottom { text-align: center; padding-top: 30px; border-top: 1px solid var(--border); }
.footer-bottom p { color: var(--text-light); font-size: 14px; margin: 0; }
@media (max-width: 968px) { .footer-content { grid-template-columns: 1fr 1fr; gap: 40px; } }
@media (max-width: 768px) { .footer-content { grid-template-columns: 1fr; } .footer { padding: 60px 0 20px; } }
"""
write_file("Footer.css", footer_css)

# 6. Gallery / Practice
gallery_css = """.page, .gallery-page { padding: 120px 24px 60px; min-height: 100vh; background: var(--bg-color); }
.heading, .gallery-page-header h1 { text-align: center; font-size: 42px; color: var(--secondary); margin-bottom: 15px; font-weight: 700; }
.filters, .category-filter { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; flex-wrap: wrap; }
.filters button, .filter-btn { background: var(--cards); color: var(--text-dark); border: 1px solid var(--border); padding: 10px 24px; border-radius: 50px; cursor: pointer; transition: var(--transition); font-weight: 500; font-size: 15px; font-family: 'Inter', sans-serif;}
.filters button:hover, .filter-btn:hover, .filter-btn.active { background: var(--primary); color: var(--cards); border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.gallery, .full-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.card, .gallery-card { background: var(--cards); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
.card:hover, .gallery-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.card img, .gallery-card-image img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.6s ease; }
.card:hover img, .gallery-card:hover img { transform: scale(1.08); }
.card p, .gallery-card-info h3 { padding: 20px; text-align: center; font-weight: 600; color: var(--secondary); font-size: 18px; font-family: 'Inter', sans-serif; }
/* Modal */
.modal, .full-lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(31,41,51,0.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; opacity: 1; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content, .lightbox-layout { background: var(--cards); border-radius: var(--radius); overflow: hidden; display: flex; max-width: 1000px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-left, .lightbox-image { flex: 1.2; background: #000; }
.modal-left img, .lightbox-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal-right, .lightbox-info { flex: 1; padding: 40px; overflow-y: auto; }
.modal-right h2, .lightbox-info h2 { font-size: 32px; color: var(--secondary); margin-bottom: 15px; }
.modal-right p, .lightbox-info p { color: var(--text-light); margin-bottom: 12px; line-height: 1.6; font-size: 15px;}
.modal-right b { color: var(--text-dark); }
.modal-right button, .lightbox-close-btn { position: absolute; top: 20px; right: 20px; background: var(--bg-secondary); border: 1px solid var(--border); width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; color: var(--text-dark); }
.modal-right button:hover, .lightbox-close-btn:hover { background: var(--border); }
.book-now-btn { display: block; width: 100%; background: var(--primary); color: var(--cards); text-align: center; padding: 15px; border-radius: 50px; text-decoration: none; font-weight: 600; margin-top: 30px; transition: var(--transition); border: none; cursor: pointer; font-size: 16px; }
.book-now-btn:hover { background: var(--primary-light); transform: translateY(-2px); }
@media (max-width: 768px) { .modal-content, .lightbox-layout { flex-direction: column; } .modal-left, .lightbox-image { height: 300px; flex: none; } }
"""
write_file("Practics.css", gallery_css)
write_file("GalleryPage.css", gallery_css)
write_file("Gallery.css", gallery_css)

print("UI Theme successfully updated to Modern Light Resort Theme!")
