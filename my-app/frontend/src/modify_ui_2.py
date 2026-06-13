import os

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# Footer.css
footer_css = """.footer { background: var(--primary-dark); color: var(--white); padding: 80px 0 30px; position: relative; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 50px; margin-bottom: 60px; }
.footer-about h3 { font-size: 1.8rem; font-weight: 700; color: var(--accent-light); margin-bottom: 20px; letter-spacing: 1px; }
.footer-about p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 25px; max-width: 350px; }
.social-links { display: flex; gap: 15px; }
.social-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--white); text-decoration: none; transition: var(--transition); }
.social-icon:hover { background: var(--accent); transform: translateY(-3px); }
.footer-links h4, .footer-contact h4 { font-size: 1.2rem; font-weight: 600; color: var(--white); margin-bottom: 25px; position: relative; padding-bottom: 10px; }
.footer-links h4::after, .footer-contact h4::after { content: ''; position: absolute; left: 0; bottom: 0; width: 40px; height: 2px; background: var(--accent); }
.footer-links ul { list-style: none; padding: 0; }
.footer-links li { margin-bottom: 15px; }
.footer-links a { color: rgba(255,255,255,0.7); text-decoration: none; transition: var(--transition); display: inline-block; }
.footer-links a:hover { color: var(--accent-light); transform: translateX(5px); }
.contact-item { display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; }
.contact-icon { color: var(--accent); font-size: 1.2rem; }
.contact-text { color: rgba(255,255,255,0.7); line-height: 1.6; }
.footer-bottom { text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); }
.footer-bottom p { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
@media (max-width: 968px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }
@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; } .footer { padding: 60px 0 20px; } }
"""
write_file("Footer.css", footer_css)

# GalleryPage.css / Practics.css
gallery_css = """.page, .gallery-page { padding: 120px 24px 60px; min-height: 100vh; background: var(--bg-color); }
.heading, .gallery-page-header h1 { text-align: center; font-size: 2.8rem; color: var(--primary-dark); margin-bottom: 15px; font-weight: 800; }
.filters, .category-filter { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; flex-wrap: wrap; }
.filters button, .filter-btn { background: var(--white); color: var(--text-dark); border: 1px solid rgba(0,0,0,0.1); padding: 10px 24px; border-radius: 50px; cursor: pointer; transition: var(--transition); font-weight: 600; font-size: 0.95rem; }
.filters button:hover, .filter-btn:hover, .filter-btn.active { background: var(--primary-dark); color: var(--white); border-color: var(--primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.gallery, .full-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.card, .gallery-card { background: var(--white); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.03); }
.card:hover, .gallery-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.card img, .gallery-card-image img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.6s ease; }
.card:hover img, .gallery-card:hover img { transform: scale(1.08); }
.card p { padding: 20px; text-align: center; font-weight: 600; color: var(--primary-dark); font-size: 1.1rem; }
/* Modal */
.modal, .full-lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(20,46,33,0.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; opacity: 1; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content, .lightbox-layout { background: var(--white); border-radius: var(--radius); overflow: hidden; display: flex; max-width: 1000px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-left, .lightbox-image { flex: 1.2; background: #000; }
.modal-left img, .lightbox-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal-right, .lightbox-info { flex: 1; padding: 40px; overflow-y: auto; }
.modal-right h2, .lightbox-info h2 { font-size: 2rem; color: var(--primary-dark); margin-bottom: 15px; }
.modal-right p, .lightbox-info p { color: var(--text-light); margin-bottom: 12px; line-height: 1.6; }
.modal-right b { color: var(--text-dark); }
.modal-right button, .lightbox-close-btn { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
.modal-right button:hover, .lightbox-close-btn:hover { background: rgba(0,0,0,0.2); }
.book-now-btn { display: block; width: 100%; background: var(--primary-dark); color: var(--white); text-align: center; padding: 15px; border-radius: 50px; text-decoration: none; font-weight: 600; margin-top: 30px; transition: var(--transition); border: none; cursor: pointer; }
.book-now-btn:hover { background: var(--accent); transform: translateY(-2px); }
@media (max-width: 768px) { .modal-content, .lightbox-layout { flex-direction: column; } .modal-left, .lightbox-image { height: 300px; flex: none; } }
"""
write_file("Practics.css", gallery_css)
write_file("GalleryPage.css", gallery_css)
write_file("Gallery.css", gallery_css)
