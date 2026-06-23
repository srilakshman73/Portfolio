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
        "linkedin": "https://www.linkedin.com/in/sri-lakshman-m-l-5480b8243/"
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

PROJECT_CASE_STUDIES = {
    "radiation": {
        "title": "AI-Based Radiation Monitoring System",
        "tech": "ESP32 + ANN + IoT",
        "category": "IoT & Robotics",
        "banner": "assets/radiations.png",
        "subtitle": "Hardware-efficient local neural network classification for real-time radiation anomaly detection.",
        "abstract": "This project addresses the critical safety challenge of monitoring environmental radiation levels in industrial zones. Standard monitors push raw values to cloud systems, which suffer from high latency and potential communication breakdown during network outages. To overcome this, we developed a local radiation monitor using an ESP32 board that processes radiation pulses directly using an on-board artificial neural network (ANN). The system performs local edge classification to identify abnormal levels instantly, triggers physical buzzers, and queues messages to be sent to a Flask-based portal when network connectivity is solid.",
        "architecture": "Geiger Counter Tube (J305/M4011) -> Pulse Interrupt Handler -> ESP32 Edge Processor -> Local Neural Network (Multi-Layer Perceptron) -> Local Piezo Buzzer & Indicator -> MQTT Client -> Web Portal Database -> Gmail API Warnings.",
        "code": """// ESP32 Hardware Interrupt and Local Inference
#define PULSE_PIN 12
volatile unsigned long pulse_count = 0;
void IRAM_ATTR countPulse() {
    pulse_count++;
}

void setup() {
    pinMode(PULSE_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(PULSE_PIN), countPulse, FALLING);
}

void loop() {
    // Run edge inference every 10 seconds
    static unsigned long last_check = 0;
    if (millis() - last_check > 10000) {
        float cpm = pulse_count * 6.0; // Convert to CPM
        pulse_count = 0;
        last_check = millis();
        
        // Evaluate input via simple 3-layer feedforward weights
        float output = runLocalANN(cpm);
        if (output > 0.8) {
            digitalWrite(BUZZER_PIN, HIGH); // Instant Local Alarm
        }
    }
}""",
        "challenges": """1. **Sensor Noise Filtration**: The Geiger tube produced random electromagnetic spike pulses which falsely inflated CPM readings. We solved this by implementing a software-based debounce filter and calculating a moving average over a 30-second window.

2. **Resource Constraints**: Running deep networks on ESP32 is memory intensive. We solved this by training a minimal 3-layer neural network in Python and exporting only the weights and biases as static floats, bypassing heavy runtime libraries."""
    },
    "diabetes": {
        "title": "Diabetes Prediction ML Model",
        "tech": "Python + Scikit-Learn + Pandas",
        "category": "AI & ML",
        "banner": "assets/project_diabetes.png",
        "subtitle": "Predictive diagnostics pipeline using optimized classification algorithms on clinical databases.",
        "abstract": "Early diagnosis of chronic conditions like diabetes is crucial for preventing serious long-term health complications. This project details a robust machine learning classification pipeline developed to predict patient diabetic onset using demographic and clinical telemetry. By training multiple classifier systems, optimizing features via principal component analysis, and adjusting precision-recall ratios, we achieved a highly reliable classification engine integrated with an API web server.",
        "architecture": "Patient Raw Records -> Pandas Data Cleaning -> Feature Imputation -> MinMaxScaler Standardization -> PCA Dimensionality Reduction -> Random Forest Classifier (GridSearchCV Tuned) -> Serialized Pickle -> Flask API Server.",
        "code": """# Data Preprocessing and Random Forest Pipeline
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

# Load PIMA Diabetes database
df = pd.read_csv('diabetes.csv')
X = df.drop('Outcome', axis=1)
y = df['Outcome']

# Preprocess and split
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Fit model with optimized parameters
rf_model = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)
rf_model.fit(X_train, y_train)
accuracy = rf_model.score(X_test, y_test)
print(f"Diagnostics Pipeline Accuracy: {accuracy * 100:.2f}%")""",
        "challenges": """1. **Data Imbalance and Zero Values**: The clinical dataset contained numerous physically impossible 'zero' values in columns like insulin concentration and blood pressure. We resolved this by performing K-Nearest Neighbors (KNN) feature imputation instead of simple mean replacements.

2. **High False Negatives**: A false negative in diagnostics is extremely dangerous. We tackled this by lowering the classification decision threshold to 0.35 to prioritize recall, ensuring potential cases are not missed."""
    },
    "car": {
        "title": "Mini Autonomous Vehicle",
        "tech": "ESP32 + Sensors + L298N",
        "category": "IoT & Robotics",
        "banner": "assets/project_car.png",
        "subtitle": "Real-time ultrasonic range sensing and responsive obstacle avoidance navigation loops.",
        "abstract": "Autonomous navigation is a cornerstone of modern robotics. This project describes the design and construction of an obstacle-avoiding autonomous vehicle. Powered by an ESP32 microcontroller, the vehicle scans its immediate environment using an array of ultrasonic and infrared sensors, calculates collision metrics, and manages steering and propulsion using an L298N dual H-bridge motor driver. It features dynamic path redirection and an Android Bluetooth override interface.",
        "architecture": "Ultrasonic Sensor Grid -> Trigger Pulse -> Echo Pin Interrupt -> Distance Matrix -> Path Planner Algorithm -> L298N Motor Driver Control -> DC Gear Motors.",
        "code": """// Avoidance Loop and Servo Mapping
#define TRIG_PIN 5
#define ECHO_PIN 18
#define LEFT_MOTOR_SPEED_PIN 25
#define RIGHT_MOTOR_SPEED_PIN 26

long readDistance() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
    return duration * 0.034 / 2; // Distance in cm
}

void avoidObstacle() {
    stopMotors();
    servo.write(45); // Scan left
    delay(300);
    long left_dist = readDistance();
    
    servo.write(135); // Scan right
    delay(300);
    long right_dist = readDistance();
    
    servo.write(90); // Re-center
    if (left_dist > right_dist) {
        turnLeft();
    } else {
        turnRight();
    }
}""",
        "challenges": """1. **Ultrasonic Reflection Noise**: Soft surfaces or angled walls produced acoustic reflections, leading to incorrect distance readings. We solved this by using a median filter of 5 consecutive scans and integrating secondary infrared sensors to double-check close-range targets.

2. **Power Management**: Sudden motor surges caused voltage drops that reset the ESP32 board. We resolved this by isolating the microcontroller logic power supply from the motor drivers using optocouplers and separate battery packs."""
    },
    "churn": {
        "title": "Customer Churn Prediction",
        "tech": "Python + Keras + ANN",
        "category": "AI & ML",
        "banner": "assets/project_diabetes.png",
        "subtitle": "Deep learning neural network built to predict customer attrition based on behavior metrics.",
        "abstract": "Retaining customers is key to sustainable business growth. This project focuses on building an Artificial Neural Network (ANN) using Keras and TensorFlow to predict customer churn. The network analyzes demographic, billing, and interaction metrics to forecast the probability of customer attrition. This enables proactive marketing teams to offer targeted retention incentives before customers cancel their subscriptions.",
        "architecture": "Customer Activity Data -> One-Hot Categorical Encoder -> Standardized Input Values -> Keras Dense Layers -> Dropout Regularization -> Sigmoid Output Layer -> Churn Probability.",
        "code": """# Neural Network Configuration with Keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization

model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    BatchNormalization(),
    Dropout(0.3),
    Dense(32, activation='relu'),
    BatchNormalization(),
    Dropout(0.2),
    Dense(1, activation='sigmoid') # Binary prediction node
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=50,
    batch_size=32
)""",
        "challenges": """1. **High Overfitting**: The model quickly achieved high training accuracy but performed poorly on validation splits. We resolved this by introducing BatchNormalization layers to stabilize inputs and adjusting Dropout rates to 0.3.

2. **Categorical Features**: Customer datasets contain text parameters like country and credit levels. We converted these using One-Hot encoding and normalized the results so the neural net weights would converge efficiently."""
    },
    "chatbot": {
        "title": "NLP AI Chatbot Engine",
        "tech": "Python + NLP",
        "category": "AI & ML",
        "banner": "assets/project_diabetes.png",
        "subtitle": "Lightweight conversational engine utilizing tokenization and keyword mapping.",
        "abstract": "Automating customer interactions requires fast and contextually relevant conversational agents. This project outlines the creation of an interactive chatbot built entirely in Python using Natural Language Processing (NLP) libraries. The engine maps input text queries through pipeline stages (tokenization, lemmatization, and stop-word filtering) to match user intent index vectors and return immediate, styled responses.",
        "architecture": "User Input Text -> Regex Tokenizer -> Word Lemmatization -> Pattern Vectorizer -> Bag of Words Model -> Classification Score Map -> Formatted Response output.",
        "code": """# Tokenization & Lemmatization Pipeline
import nltk
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

def clean_up_sentence(sentence):
    # Split sentence into words
    sentence_words = nltk.word_tokenize(sentence)
    # Lemmatize and lowercase each word
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)  
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: 
                bag[i] = 1
    return np.array(bag)""",
        "challenges": """1. **Out-of-Vocabulary Queries**: User inputs with slang or spelling errors caused search patterns to fail. We resolved this by integrating a fallback matching algorithm based on Levenshtein Edit Distance, pointing the engine to the nearest matched pattern.

2. **Context Management**: Standard keyword mapping has no memory of previous sentences. We solved this by appending state tokens in user session states, allowing multi-turn conversations for specific flows like contact requests."""
    },
    "facerec": {
        "title": "Real-Time Face Recognition",
        "tech": "Python + OpenCV",
        "category": "AI & ML",
        "banner": "assets/project_diabetes.png",
        "subtitle": "Computer vision model identifying facial structures and tracking records.",
        "abstract": "Security and automated attendance systems require fast, secure, and non-intrusive verification methods. This project outlines a face recognition system that tracks faces in real-time using a standard USB webcam. The system isolates face regions using OpenCV Haar Cascades, extracts features, matches them against pre-registered user embeddings, and logs entries in a MySQL database.",
        "architecture": "Video Camera Feed -> Frame Decimator -> Grayscale Converter -> Haar Cascade Classifier -> Face Landmark Encoder -> Euclidean Distance Matrix -> MySQL Logging Portal.",
        "code": """# Video Processing and Classification Loop
import cv2
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret: break
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(30, 30))
    
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 242, 254), 2)
        # Extract face region for classifier match
        face_roi = gray[y:y+h, x:x+w]
        
    cv2.imshow('Real-time Face Tracker', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break
cap.release()
cv2.destroyAllWindows()""",
        "challenges": """1. **Lighting Variations**: In low light or back-lit environments, the Haar Cascade failed to detect facial borders. We resolved this by implementing Contrast Limited Adaptive Histogram Equalization (CLAHE) on the input grayscale frames.

2. **Processing Latency**: Real-time video processing is CPU intensive. We optimized execution by down-scaling the camera frame size by 50% before running face detection and mapping the result coordinates back onto the display window."""
    },
    "employeedb": {
        "title": "Employee Management System",
        "tech": "Java + MySQL CRUD",
        "category": "Web & Software",
        "banner": "assets/project_movie.png",
        "subtitle": "Secure database administration desktop panel with transactional queries.",
        "abstract": "Modern corporations require reliable and structured storage interfaces to manage employee records, organizational departments, and payroll details. This project highlights a Java Swing desktop application that integrates with a MySQL backend via Java Database Connectivity (JDBC). Featuring CRUD operations, search indices, and secure data access, the platform enables clean and robust database administration.",
        "architecture": "Java Swing UI -> Event Listeners -> JDBC Driver Manager -> PreparedStatement Compiler -> SQL Transaction Engine -> MySQL Database Server.",
        "code": """// PreparedStatement Compilation and Query Execution
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EmployeeDAO {
    private Connection connection;
    
    public void searchEmployeeByDept(String deptName) {
        String sql = "SELECT emp_id, first_name, salary FROM employees WHERE department = ? ORDER BY emp_id ASC";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, deptName);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    System.out.println("ID: " + resultSet.getInt("emp_id") + 
                                       ", Name: " + resultSet.getString("first_name"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}""",
        "challenges": """1. **SQL Injection Risks**: Initial dynamic string queries were highly vulnerable to malicious injections. We solved this by mandating Parameterized Queries through Java's PreparedStatement wrapper.

2. **Connection Drops**: Leaving database connections open caused MySQL timeout errors. We resolved this by utilizing a JDBC connection pool and wrapping query scopes in try-with-resources blocks to guarantee resource closure."""
    },
    "bookmyshow": {
        "title": "BookMyShow Clone",
        "tech": "HTML + CSS + JS",
        "category": "Web & Software",
        "banner": "assets/project_movie.png",
        "subtitle": "Responsive front-end portal featuring glassmorphism seat selection widgets.",
        "abstract": "An intuitive, responsive seat reservation interface is key for movie ticketing websites. This project presents a front-end replica of a booking engine. Built using semantic HTML5, custom Tailwind CSS configurations, and vanilla JavaScript, it displays cinema hall seat maps, handles seat lock selections dynamically, computes real-time pricing cards, and includes success booking notifications.",
        "architecture": "UI Interactive Seat Matrix -> DOM Event Delegator -> Session Storage State Manager -> Pricing Calculation Model -> Local Toast Notification Chime.",
        "code": """// Dynamic Seat Grid Management
const seatContainer = document.querySelector('.seat-grid-container');
const countDisplay = document.getElementById('seat-selected-count');
const priceDisplay = document.getElementById('total-price-indicator');

seatContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateTicketSummary();
    }
});

function updateTicketSummary() {
    const selectedSeats = document.querySelectorAll('.seat-grid-container .seat.selected');
    const count = selectedSeats.length;
    const basePrice = 150; // Rupees per seat
    
    countDisplay.innerText = count;
    priceDisplay.innerText = count * basePrice;
}""",
        "challenges": """1. **Grid Responsiveness**: Laying out a massive grid of 120 seats led to layout breakage on smaller mobile screens. We solved this by wrapping the grid in a CSS Flex wrapper with overflow scrolling, enabling zoom and swipe navigation.

2. **State Preservation**: Page reloads reset the seat selection. We fixed this by serializing the selected seat indices into browser SessionStorage, restoring the selection grid on page reload."""
    }
}

from flask import redirect, url_for

@app.route('/project/<key>')
def project_case_study(key):
    if key in PROJECT_CASE_STUDIES:
        return render_template('project_case_study.html', project=PROJECT_CASE_STUDIES[key], project_key=key)
    return redirect(url_for('home'))

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
