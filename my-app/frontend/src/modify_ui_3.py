import os
import re

base_dir = r"e:\Desktop\Cottage\my-app\src"

def write_file(filename, content):
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def read_file(filename):
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

# 1. Update App.css with Fonts & Global form styles
app_css = read_file("App.css")
if "@import url" not in app_css:
    google_fonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&display=swap');\n\n"
    
    # Prepend Google Fonts
    app_css = google_fonts + app_css
    
    # Add headings font family
    app_css = app_css.replace("body {", "h1, h2, h3, h4, h5, h6, .hero-title, .logo-text, .heading { font-family: 'Playfair Display', serif; }\n\nbody {")
    
    # Add global form elements styles
    global_forms = """
/* Global Forms & Input Styling */
input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="date"], textarea, select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: var(--text-dark);
  background: var(--white);
  transition: var(--transition);
  margin-bottom: 15px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
}
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(196,161,90,0.15);
}
label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--primary-dark);
  font-size: 0.9rem;
}
.btn-submit, .btn-primary, button[type="submit"] {
  background: var(--primary-dark);
  color: var(--white);
  border: none;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  display: inline-block;
  text-align: center;
  box-shadow: var(--shadow-sm);
  width: 100%;
}
.btn-submit:hover, button[type="submit"]:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.form-container, .auth-container, .booking-container {
  background: var(--white);
  padding: 40px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  max-width: 600px;
  margin: 120px auto 60px;
  border: 1px solid rgba(0,0,0,0.03);
}
.form-header, .auth-header {
  text-align: center;
  margin-bottom: 30px;
}
.form-header h2, .auth-header h2 {
  color: var(--primary-dark);
  margin-bottom: 10px;
  font-size: 2rem;
}
"""
    app_css += global_forms
    write_file("App.css", app_css)

# 2. Fix Footer.css
footer_css = """/* Fixed Footer CSS */
.footer {
  background: var(--primary-dark);
  color: var(--white);
  padding: 80px 0 30px;
  position: relative;
  font-family: 'Inter', sans-serif;
  border-top: 4px solid var(--accent);
}
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 50px;
  margin-bottom: 60px;
}
.footer-section h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--accent-light);
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}
.footer-section h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: var(--accent);
}
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-light);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer-section p {
  color: rgba(255,255,255,0.8);
  line-height: 1.8;
  margin-bottom: 25px;
  font-size: 0.95rem;
}
.footer-section ul {
  list-style: none;
  padding: 0;
}
.footer-section li {
  margin-bottom: 15px;
}
.footer-section a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: var(--transition);
  display: inline-block;
  font-size: 0.95rem;
}
.footer-section a:hover {
  color: var(--accent-light);
  transform: translateX(5px);
}
.newsletter {
  display: flex;
  gap: 10px;
}
.newsletter input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  color: var(--white);
  border-radius: var(--radius);
  outline: none;
  transition: var(--transition);
  margin-bottom: 0 !important;
}
.newsletter input:focus {
  border-color: var(--accent);
  background: rgba(255,255,255,0.1);
}
.newsletter button {
  background: var(--accent);
  color: var(--primary-dark);
  border: none;
  padding: 0 20px;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition);
  width: auto;
}
.newsletter button:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
}
.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.footer-bottom p {
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin: 0;
}
@media (max-width: 968px) {
  .footer-content { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media (max-width: 768px) {
  .footer-content { grid-template-columns: 1fr; }
  .footer { padding: 60px 0 20px; }
}
"""
write_file("Footer.css", footer_css)

# 3. Clean up individual form CSS to prevent conflict and enforce premium theme
def clear_form_css(filename):
    content = read_file(filename)
    if "/* Cleaned */" not in content:
        # Just wrap them in an empty block or add minor specific tweaks to rely on App.css
        cleaned = f"/* Cleaned */\n/* The primary form styling is now handled globally in App.css for consistency. */\n"
        
        # We keep some layout-specific flex/grid properties if needed
        # Since standard classes like .form-container are styled in App.css, we can just let App.css handle colors/borders/shadows
        
        # Add basic specific rules if it's Contact or Dashboard
        if "Contact" in filename:
            cleaned += ".contact-page { padding: 120px 24px 60px; min-height: 100vh; background: var(--bg-color); }\n"
            cleaned += ".contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; max-width: 1000px; margin: 0 auto; }\n"
            cleaned += ".contact-info { background: var(--primary-dark); color: var(--white); padding: 40px; border-radius: var(--radius); }\n"
            cleaned += ".contact-info h3 { color: var(--accent-light); font-size: 1.8rem; margin-bottom: 20px; }\n"
            cleaned += "@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }\n"
            
        elif "Dashboard" in filename:
            cleaned += ".dashboard-container { padding: 120px 24px 60px; max-width: 1200px; margin: 0 auto; min-height: 100vh; }\n"
            cleaned += ".dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid var(--accent); }\n"
            cleaned += ".dashboard-header h2 { color: var(--primary-dark); font-size: 2.5rem; }\n"
            cleaned += ".dashboard-card, .booking-card { background: var(--white); padding: 25px; border-radius: var(--radius); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px; transition: var(--transition); }\n"
            cleaned += ".dashboard-card:hover, .booking-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }\n"
            
        elif "Auth" in filename or "Login" in filename or "Signup" in filename:
            cleaned += ".auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); padding: 100px 20px 40px; }\n"
            cleaned += ".auth-error { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 0.9rem; text-align: center; }\n"
            cleaned += ".auth-link { color: var(--primary-dark); text-decoration: underline; font-weight: 500; text-align: center; display: block; margin-top: 15px; }\n"
            cleaned += ".auth-link:hover { color: var(--accent); }\n"
            
        write_file(filename, cleaned)

clear_form_css("Auth.css")
clear_form_css("Login.css")
clear_form_css("Signup.css")
clear_form_css("Contact.css")
clear_form_css("BookingPage.css")
clear_form_css("UserDashboard.css")
clear_form_css("AdminDashboard.css")
clear_form_css("Otp.css")

print("Done generating modify_ui_3.py")
