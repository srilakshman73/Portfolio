import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify, send_from_directory

# Load environment variables manually from .env if it exists
def load_dotenv():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()

load_dotenv()

def send_email_notification(name, visitor_email, subject, message_body):
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    try:
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
    except ValueError:
        smtp_port = 587
        
    sender_email = os.environ.get('SENDER_EMAIL')
    sender_password = os.environ.get('SENDER_PASSWORD')
    recipient_email = os.environ.get('RECIPIENT_EMAIL', 'srilakshman73@gmail.com')
    
    if not sender_email or not sender_password or 'your-gmail' in sender_email or 'your-gmail' in sender_password:
        print("SMTP Credentials not configured. Skipping email delivery.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = f"Portfolio Contact: {subject or 'No Subject'} (from {name})"
        
        body = f"""
New message from your portfolio contact form!

Name: {name}
Email: {visitor_email}
Subject: {subject or 'N/A'}

Message:
--------------------------------------------------
{message_body}
--------------------------------------------------
"""
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"Email successfully sent to {recipient_email}!")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

app = Flask(__name__, template_folder='templates', static_folder='static')

# File paths for simple persistence
VISITOR_FILE = 'visitor_count.json'
MESSAGES_FILE = 'messages.json'

def get_visitor_count():
    try:
        if os.path.exists(VISITOR_FILE):
            with open(VISITOR_FILE, 'r') as f:
                data = json.load(f)
                return data.get('count', 1247)
        else:
            with open(VISITOR_FILE, 'w') as f:
                json.dump({'count': 1247}, f)
            return 1247
    except Exception:
        return 1247

def increment_visitor_count():
    try:
        count = get_visitor_count() + 1
        with open(VISITOR_FILE, 'w') as f:
            json.dump({'count': count}, f)
        return count
    except Exception:
        return 1248

# Load Sri Lakshman's details for the AI Assistant context
RESUME_CONTEXT = {
    "name": "Sri Lakshman M L",
    "role": "Software Engineer | AI & ML Engineer | IoT Developer",
    "skills": {
        "programming": ["Python", "Java"],
        "web": ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
        "database": ["MySQL"],
        "technologies": ["AI & ML", "DevOps", "Software Testing", "IoT", "Robotics", "Arduino", "ESP32", "PCB Design"]
    },
    "education": {
        "college": "Amrita College of Engineering and Technology",
        "degree": "Bachelor of Engineering",
        "branch": "Electronics and Communication Engineering",
        "cgpa": "8.1/10",
        "graduation": "May 2026"
    },
    "internships": [
        {
            "company": "ISRO Propulsion Complex (IPRC)",
            "role": "Industrial Trainee",
            "details": "Gained experience in telemetry, space communications, and advanced control electronics."
        },
        {
            "company": "Tech Volt Software",
            "role": "UI/UX Design Intern",
            "details": "Designed modern wireframes, user journeys, and responsive layouts for enterprise software."
        },
        {
            "company": "Emglitz Technologies",
            "role": "Robotics Intern",
            "details": "Built autonomous driving algorithms and integrated microcontrollers with sensors."
        },
        {
            "company": "Keltron",
            "role": "Embedded Systems Intern",
            "details": "Developed firmware for microcontrollers and studied industrial automation systems."
        },
        {
            "company": "MATT Engineering",
            "role": "Arduino Applications Intern",
            "details": "Created Arduino-based sensors and custom PCB layouts for domestic IoT devices."
        }
    ],
    "projects": [
        {
            "title": "AI-Based Radiation Monitoring System",
            "tech": "ESP32 + ANN + IoT",
            "details": "Developed a real-time radiation tracker that uses artificial neural networks on an ESP32 to detect abnormal levels and broadcast alerts."
        },
        {
            "title": "Diabetes Prediction",
            "tech": "Python + Scikit Learn",
            "details": "Built a machine learning classification model predicting patient diabetes with high accuracy using medical telemetry."
        },
        {
            "title": "Mini Autonomous Car",
            "tech": "ESP32 + Sensors",
            "details": "Created an obstacle-avoiding autonomous vehicle with real-time mapping using ultrasonic and infrared sensors."
        },
        {
            "title": "Customer Churn Prediction",
            "tech": "Python + Keras",
            "details": "Designed an artificial neural network to analyze customer behavior datasets and forecast churn probabilities."
        },
        {
            "title": "AI Chatbot",
            "tech": "Python + NLP",
            "details": "Built an interactive chatbot utilizing Natural Language Processing to process questions and respond intelligently."
        },
        {
            "title": "Face Recognition System",
            "tech": "Python + OpenCV",
            "details": "Programmed an automated attendance/security face recognition system that works in real-time."
        },
        {
            "title": "Employee Management System",
            "tech": "Java + MySQL CRUD",
            "details": "Created a backend system to manage corporate employee records with advanced search, sorting, and reporting features."
        },
        {
            "title": "BookMyShow Clone",
            "tech": "HTML + CSS + JS",
            "details": "Built a front-end movie ticket booking platform clone with interactive seat selection and responsive layouts."
        }
    ],
    "achievements": [
        "Best Student Award (2022-23)",
        "Best Student Award (2023-24)",
        "Innovation Showcase Winner (IETE)"
    ],
    "certifications": [
        "Python Programming – E-Box",
        "Data Science and Artificial Intelligence – IIT Indore"
    ],
    "contact": {
        "email": "srilakshman73@gmail.com",
        "phone": "+91 9443647190",
        "github": "https://github.com/srilakshman73",
        "linkedin": "https://linkedin.com/in/srilakshman73"
    }
}

def generate_ai_response(query):
    query = query.lower()
    
    # 1. Greetings & general identity
    if any(word in query for word in ["hello", "hi", "hey", "greetings", "wassup", "who are you"]):
        return (f"Hello! I am Sri Lakshman's AI Assistant. I can tell you all about Sri's background in "
                f"Software Engineering, AI/ML, and IoT. What would you like to know? Feel free to ask about "
                f"his projects, internships, education, or skills!")
                
    # 2. Contact info
    if any(word in query for word in ["contact", "email", "phone", "reach", "hire", "call", "github", "linkedin"]):
        return (f"You can contact Sri Lakshman directly at **{RESUME_CONTEXT['contact']['email']}** or call him at "
                f"**{RESUME_CONTEXT['contact']['phone']}**. You can also check his profile on [GitHub]({RESUME_CONTEXT['contact']['github']}) "
                f"or [LinkedIn]({RESUME_CONTEXT['contact']['linkedin']}).")
                
    # 3. Internships
    if any(word in query for word in ["intern", "experience", "work", "job", "isro", "tech volt", "keltron", "emglitz"]):
        response = "Sri Lakshman has completed **5 internships** in diverse fields:\n\n"
        for idx, intern in enumerate(RESUME_CONTEXT['internships'], 1):
            response += f"{idx}. **{intern['company']}** ({intern['role']}): {intern['details']}\n"
        return response
        
    # 4. Projects
    if any(word in query for word in ["project", "build", "portfolio", "radiation", "car", "diabetes", "churn", "bookmyshow"]):
        response = "Sri has worked on several advanced projects across AI, IoT, and Software Development:\n\n"
        for p in RESUME_CONTEXT['projects']:
            response += f"- **{p['title']}** (*{p['tech']}*): {p['details']}\n"
        response += "\nYou can view live demos and source code for these in the **Project Showcase** section!"
        return response
        
    # 5. Skills
    if any(word in query for word in ["skill", "languages", "python", "java", "know", "code", "arduino", "esp32"]):
        response = "Sri Lakshman possesses a robust technical skill set:\n\n"
        response += f"- **Programming Languages:** {', '.join(RESUME_CONTEXT['skills']['programming'])}\n"
        response += f"- **Web Technologies:** {', '.join(RESUME_CONTEXT['skills']['web'])}\n"
        response += f"- **Database Management:** {', '.join(RESUME_CONTEXT['skills']['database'])}\n"
        response += f"- **Hardware & IoT:** Arduino, ESP32, PCB Design, Robotics\n"
        response += f"- **Specialized Domains:** AI & Machine Learning, DevOps, Software Testing\n"
        return response

    # 6. Education
    if any(word in query for word in ["education", "college", "university", "cgpa", "grade", "gpa", "degree", "amrita"]):
        return (f"Sri Lakshman is pursuing his **Bachelor of Engineering** in **Electronics and Communication Engineering** "
                f"at **{RESUME_CONTEXT['education']['college']}**. He has achieved an impressive CGPA of **{RESUME_CONTEXT['education']['cgpa']}** "
                f"and is expected to graduate in **{RESUME_CONTEXT['education']['graduation']}**.")
                
    # 7. Achievements / Awards
    if any(word in query for word in ["award", "achievement", "win", "prize", "best student"]):
        return (f"Sri Lakshman has a stellar academic record, winning the **Best Student Award** for two consecutive academic years "
                f"(2022-23 and 2023-24). He is also the **Innovation Showcase Winner** organized by IETE.")

    # 8. Certifications
    if any(word in query for word in ["certif", "course", "iit", "indore", "e-box"]):
        return (f"Sri holds professional certifications including:\n"
                f"- **Data Science and Artificial Intelligence** from **IIT Indore**\n"
                f"- **Python Programming** from **E-Box**")

    # Fallback response
    return (f"I'm not sure I understand that query completely, but I'd love to help! Sri Lakshman is a "
            f"highly skilled Software, AI/ML, and IoT Engineer. He is proficient in Python, Machine Learning, "
            f"and ESP32 systems, with 5 internships and a 8.1 CGPA. Ask me about his 'projects', 'skills', "
            f"'experience', or how to 'contact' him!")


@app.route('/resume/view')
def view_resume():
    return send_from_directory(
        os.path.join(app.root_path, 'static', 'assets'),
        'sri_laksh_d.pdf',
        mimetype='application/pdf'
    )

@app.route('/resume/download')
def download_resume():
    return send_from_directory(
        os.path.join(app.root_path, 'static', 'assets'),
        'sri_laksh_d.pdf',
        as_attachment=True,
        mimetype='application/pdf'
    )

@app.route('/')
def home():
    visitor_count = increment_visitor_count()
    return render_template('index.html', visitor_count=visitor_count)

@app.route('/api/visitor', methods=['GET'])
def visitor():
    count = get_visitor_count()
    return jsonify({'count': count})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    if not message:
        return jsonify({'response': "Please type a message!"}), 400
    
    response_text = generate_ai_response(message)
    return jsonify({'response': response_text})

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'Name, Email, and Message are required!'}), 400
            
        # Save to file
        try:
            messages = []
            if os.path.exists(MESSAGES_FILE):
                with open(MESSAGES_FILE, 'r') as f:
                    try:
                        messages = json.load(f)
                    except ValueError:
                        messages = []
                        
            messages.append({
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            })
            
            with open(MESSAGES_FILE, 'w') as f:
                json.dump(messages, f, indent=4)
        except Exception as write_err:
            print(f"Warning: Could not save message to local JSON file: {write_err}")
            
        # Send email notification
        send_email_notification(name, email, subject, message)
            
        return jsonify({'success': True, 'message': 'Message sent successfully! Sri will get back to you soon.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
