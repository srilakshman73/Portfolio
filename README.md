# Sri Lakshman M L - Cyber-Glass Personal Portfolio

A premium, interactive, and responsive portfolio website designed with a modern dark cyber-glass aesthetic. Features custom UI sound design, dynamic floating dock widgets, Three.js WebGL effects, GSAP scroll animations, and a local AI Assistant Chatbot. 

Deployable directly as a serverless application on platforms like Vercel.

---

## 🚀 Key Features

* **Vibrant Glassmorphic UI:** Built using a custom-tailored dark color palette (`Outfit` and `JetBrains Mono` Google Fonts) with soft backdrop-blur filters, dynamic hover effects, and neon glows.
* **Three.js WebGL Sphere:** A dynamic 3D interactive particle sphere in the hero section that responds to drag and cursor interactions.
* **Local AI Chatbot:** An on-page virtual assistant that uses custom natural language pattern mapping to answer questions about Sri's resume details, certifications, skills, and internships in real time.
* **Responsive CTA Grouping:** Organized quick-action layout containing direct project routing, inline contacts, downloadable PDF resume, and in-browser resume viewer.
* **Integrated Contact SMTP Notifications:** Backend endpoints routing user messages directly to `srilakshman73@gmail.com` using secure Gmail App Password SMTP integrations.
* **Vercel Serverless Optimization:** Pre-configured with serverless configurations (`vercel.json`, exception-handled file writing) for instant high-availability hosting.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, FontAwesome
* **Animations & 3D:** GSAP (GreenSock Animation Platform), ScrollTrigger, Three.js
* **Backend:** Python, Flask (Serverless WSGI Router)
* **Email System:** smtplib, MIME SMTP Email Routing
* **Deployment:** Vercel, GitHub Pages (static front-end integration ready)

---

## ⚙️ Local Setup and Configuration

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srilakshman73/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   Ensure you have Python 3 installed, then run:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-gmail-address@gmail.com
   SENDER_PASSWORD=your-gmail-app-password
   RECIPIENT_EMAIL=srilakshman73@gmail.com
   ```

4. **Run the Development Server:**
   ```bash
   python app.py
   ```
   Open [http://localhost:5000](http://localhost:5000) in your web browser.

---

## ☁️ Vercel Deployment

This project includes a `vercel.json` file for routing. To deploy:
1. Connect your GitHub repository to Vercel.
2. In the Vercel dashboard, navigate to **Settings -> Environment Variables** and add the keys:
   * `SENDER_EMAIL`
   * `SENDER_PASSWORD`
   * `RECIPIENT_EMAIL`
3. Vercel will build the serverless functions and serve the static files dynamically!
