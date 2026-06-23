// Main JavaScript for Sri Lakshman M L's Personal Portfolio

/* =========================================================================
   1. Audio Synthesizer (Web Audio API) for UI Feedback
   ========================================================================= */
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'hover') {
            // Light high pitch blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'click') {
            // Cyber click chirp
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'success') {
            // Double positive chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'boot') {
            // Futuristic boot up sweep
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.8);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
            osc.start(now);
            osc.stop(now + 0.9);
        }
    } catch (e) {
        // Audio context block protection
    }
}

// Bind sound events
function bindSoundEffects() {
    const clickables = document.querySelectorAll('a, button, input, textarea, .dock-item, .project-filter-btn');
    clickables.forEach(elem => {
        elem.addEventListener('mouseenter', () => playSound('hover'));
        elem.addEventListener('click', () => playSound('click'));
    });
}

/* =========================================================================
   2. System Bootloader Loader Sequence
   ========================================================================= */
function runBootLoader() {
    const logsContainer = document.getElementById('loading-logs');
    const loadingBar = document.getElementById('loading-bar');
    const percentageText = document.getElementById('loading-percentage');
    const statusText = document.getElementById('loading-status');
    const loader = document.getElementById('loader');

    if (!logsContainer) return;

    const bootMessages = [
        "Initializing core environment...",
        "Reading hardware architecture: ESP32/Arduino...",
        "Loading Three.js 3D WebGL renderer...",
        "Allocating memory pools for GSAP systems...",
        "Fetching remote visitor logs database...",
        "Connecting artificial intelligence context...",
        "Validating CGPA indicators: 8.1/10...",
        "Setting dark cyber-glass themes...",
        "Booting Sri Lakshman M L's Portfolio...",
        "System status: ACTIVE - RENDER COMPLETE."
    ];

    let currentLogIndex = 0;
    let progress = 0;

    const interval = setInterval(() => {
        // Random progress step
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Finish Boot
            statusText.innerText = "System Ready.";
            percentageText.innerText = "100%";
            loadingBar.style.width = "100%";
            
            setTimeout(() => {
                playSound('boot');
                loader.classList.add('opacity-0');
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Initialize scroll triggers
                    initGSAPAnimations();
                }, 700);
            }, 500);
        } else {
            // Update percentage and loading bar
            percentageText.innerText = `${progress}%`;
            loadingBar.style.width = `${progress}%`;
            
            // Print log lines at intervals
            if (progress > (currentLogIndex * 10) && currentLogIndex < bootMessages.length) {
                const log = document.createElement('p');
                log.innerHTML = `<span class="text-cyan-400">></span> ${bootMessages[currentLogIndex]}`;
                logsContainer.appendChild(log);
                logsContainer.scrollTop = logsContainer.scrollHeight;
                currentLogIndex++;
            }
        }
    }, 120);
}

/* =========================================================================
   3. Custom Cursor Outline & Dot
   ========================================================================= */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (!cursor) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Animate outline with delay for smoothness
    function animateOutline() {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;

        outline.style.left = `${posX}px`;
        outline.style.top = `${posY}px`;

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover actions
    const hoverTargets = document.querySelectorAll('a, button, .dock-item, .project-card, input, textarea');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.add('hovering');
            cursor.classList.remove('hovering');
        });
    });
}

/* =========================================================================
   4. Animated Typing Effect
   ========================================================================= */
function initTypingEffect() {
    const textTarget = document.getElementById('typing-text');
    if (!textTarget) return;

    const phrases = [
        "Python Developer",
        "Machine Learning Engineer",
        "DevOps Enthusiast",
        "Embedded Systems Developer"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            textTarget.innerText = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            textTarget.innerText = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let typingSpeed = 100;
        if (isDeleting) typingSpeed = 50;

        if (!isDeleting && charIdx === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* =========================================================================
   5. Apple macOS Style Floating Dock Magnifier
   ========================================================================= */
function initFloatingDock() {
    const dock = document.getElementById('floating-dock');
    if (!dock) return;

    const dockItems = dock.querySelectorAll('.dock-item');

    dock.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        
        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - centerX);
            
            // Standard size is 48px, maximum size is 72px
            const maxScale = 1.4;
            const range = 100; // range of effect in pixels
            
            if (distance < range) {
                const scale = 1 + (maxScale - 1) * (1 - distance / range);
                item.style.transform = `scale(${scale})`;
                item.style.margin = `0 ${8 * scale}px`;
            } else {
                item.style.transform = 'scale(1)';
                item.style.margin = '0 4px';
            }
        });
    });

    dock.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
            item.style.transform = 'scale(1)';
            item.style.margin = '0 4px';
        });
    });
}

/* =========================================================================
   6. GSAP and ScrollTrigger Animations
   ========================================================================= */
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // General fade-in elements
    gsap.utils.toArray('.timeline-item, .glass-card, .project-card').forEach(box => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Stats Counters Animation
    const counterNumbers = document.querySelectorAll('.counter-num');
    counterNumbers.forEach(num => {
        const targetVal = parseInt(num.getAttribute('data-target'));
        gsap.fromTo(num, {
            textContent: 0
        }, {
            textContent: targetVal,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: num,
                start: "top 90%"
            }
        });
    });

    // Scroll Progress bar
    gsap.to('#scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });

    // Sticky Navbar shadow on scroll
    ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => document.getElementById('navbar').classList.add('bg-cyber-bg/80', 'backdrop-blur-md', 'border-white/5'),
        onLeaveBack: () => document.getElementById('navbar').classList.remove('bg-cyber-bg/80', 'backdrop-blur-md', 'border-white/5')
    });
}

/* =========================================================================
   7. Theme Switcher (Dark & Light Mode Toggle)
   ========================================================================= */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const ball = document.getElementById('theme-ball');
    if (!toggle) return;

    // Check saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        ball.style.transform = 'translateX(24px)';
    }

    toggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
            ball.style.transform = 'translateX(24px)';
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            ball.style.transform = 'translateX(0px)';
        }
    });
}

/* =========================================================================
   8. Project Filtering and Search Logic
   ========================================================================= */
function initProjectFilters() {
    const searchInput = document.getElementById('project-search');
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    let currentFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('p').innerText.toLowerCase();
            const tags = Array.from(card.querySelectorAll('span')).map(s => s.innerText.toLowerCase()).join(' ');

            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || tags.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
                gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().strip ? e.target.value.toLowerCase().trim() : e.target.value.toLowerCase();
            filterProjects();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-cyan-500', 'text-black', 'font-semibold');
                b.classList.add('bg-slate-900', 'border-white/10', 'text-slate-400');
            });
            btn.classList.add('bg-cyan-500', 'text-black', 'font-semibold');
            btn.classList.remove('bg-slate-900', 'border-white/10', 'text-slate-400');

            currentFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });
}

/* =========================================================================
   9. Case Study Popup Data and Modal Handlers
   ========================================================================= */
const CASE_STUDIES = {
    radiation: {
        title: "AI-Based Radiation Monitoring System",
        tech: "ESP32 + ANN (Artificial Neural Networks) + Edge Telemetry",
        subtitle: "Designing hardware-efficient machine learning filters for safety critical radiation monitors.",
        details: "This project addresses the bottleneck of slow network checks in safety-critical environments by compiling small machine learning classification layers directly onto a micro-controller. Built with an ESP32, the system reads Geiger counter sensor streams, passes them through a local artificial neural network (compiled via TensorFlow Lite Micro or custom matrices) to determine ABNORMAL thresholds, and triggers a dynamic local warning system before piping telemetry data to a central Django hub.",
        architecture: "Geiger Tube Sensor -> ADC Input -> ESP32 Local ANN Classifier -> Local Alarm / Buzzer -> MQTT Telemetry -> Flask/Django Portal -> Gmail Alerts.",
        codeSnippet: `void runEdgeMLModel() {\n  float input_val = readSensorTelemetry();\n  float prediction = ml_network.predict(input_val);\n  if(prediction > ABNORMAL_THRESHOLD) {\n    triggerHardwareAlarm();\n    sendMqttAlert(\"ABNORMAL\");\n  }\n}`
    },
    diabetes: {
        title: "Diabetes Prediction Using Machine Learning",
        tech: "Python + Scikit-Learn + Pandas",
        subtitle: "High precision classification pipelines predicting diabetes from clinical data datasets.",
        details: "A health diagnostics machine learning model trained using Scikit-Learn. Pre-processed datasets (PIMA Indian Diabetes Database) using standard scaling, PCA analysis for dimension reduction, and evaluated via Random Forest, SVM, and Logistic Regression models. Achieved high classification score thresholds and integrated model serialization files (.pkl) with client Flask API servers.",
        architecture: "PIMA Dataset -> Standardizer -> PCA Reducer -> Random Forest Classifier -> serialized Pickle -> Flask Web Server endpoint.",
        codeSnippet: `model = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train_scaled, y_train)\ny_pred = model.predict(X_test_scaled)\nprint(f\"Accuracy Score: {accuracy_score(y_test, y_pred)}\")`
    },
    car: {
        title: "Mini Autonomous Car System",
        tech: "ESP32 + Ultrasonic & IR Grid + Custom L298N Firmware",
        subtitle: "Developing rapid motor control loops and avoidance calculations for embedded robotics.",
        details: "An obstacle avoidance robotic car prototype. Programmed an ESP32 chip in C++ to capture range inputs from ultrasonic and infrared sensor arrays, process collision paths, and send pwm commands to L298N motor drivers. Features automatic spin-arounds and real-time Bluetooth manual overrides.",
        architecture: "Ultrasonic Sensors -> GPIO Reading -> Collision Distance Checker -> ESP32 Path Decisions -> PWM Motor Driver Control.",
        codeSnippet: `void checkCollision() {\n  long duration = pulseIn(echoPin, HIGH);\n  int distance = duration * 0.034 / 2;\n  if (distance < COLLISION_RANGE) {\n    stopCar();\n    adjustSteeringAngle();\n  }\n}`
    },
    churn: {
        title: "Customer Churn Prediction",
        tech: "Python + Keras + TensorFlow + Matplotlib",
        subtitle: "Deep Learning sequential neural network classifying client attrition rates.",
        details: "Engineered a Deep Learning classifier model in Keras using artificial neural networks (ANN) with multiple Dense, Dropout, and BatchNormalization layers. Normalized categorical customer telemetry inputs and minimized binary crossentropy loss. Rendered training curves detailing validation split metrics.",
        architecture: "Customer Demographics JSON -> OneHot Encoder -> Dense Input Layer -> Dropout Regulator -> Sigmoid Classifier Node.",
        codeSnippet: `model = Sequential([\n  Dense(64, activation='relu', input_shape=(X.shape[1],)),\n  Dropout(0.3),\n  Dense(32, activation='relu'),\n  Dense(1, activation='sigmoid')\n])\nmodel.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])`
    },
    chatbot: {
        title: "AI Chatbot NLP Client",
        tech: "Python + Natural Language Processing (NLP)",
        subtitle: "Keyword categorization parser and query classifier templates.",
        details: "Designed a lightweight conversational pipeline using python NLP libraries. Features tokenization, lemmatization, and bag-of-words classifications to map text questions into standard prompt indexes, returning rapid response cards.",
        architecture: "Input Text -> Tokenizer -> Lemmatizer -> Bag of Words -> Class Similarity -> Output Response.",
        codeSnippet: `def clean_up_sentence(sentence):\n  words = nltk.word_tokenize(sentence)\n  return [lemmatizer.lemmatize(w.lower()) for w in words]`
    },
    facerec: {
        title: "Face Recognition System",
        tech: "Python + OpenCV + Haar Cascades",
        subtitle: "Computer vision frameworks identifying facial contours in real time.",
        details: "A camera attendance framework. Utilized OpenCV Haar Cascade models and local encodings to capture webcam feeds, isolate face coordinates, match them against pre-registered user profiles, and record timestamps to MySQL tables.",
        architecture: "Webcam Input -> OpenCV Frame Capture -> Haar Cascade Classifier -> Face Match Encoder -> MySQL Log Insert.",
        codeSnippet: `faces = face_cascade.detectMultiScale(gray, 1.1, 4)\nfor (x, y, w, h) in faces:\n  cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)`
    },
    employeedb: {
        title: "Employee Management System",
        tech: "Java Swing + JDBC + MySQL Database",
        subtitle: "A highly robust administration desktop CRUD platform with database indexes.",
        details: "Developed a desktop client application handling employee records, roles, salaries, and search keys. Features JDBC connection pools, secure parameterization queries, and custom reporting tables.",
        architecture: "Java Desktop Swing UI -> JDBC Connection Interface -> MySQL Secure Database Server.",
        codeSnippet: `String query = \"SELECT * FROM employees WHERE department = ?\";\nPreparedStatement pstmt = conn.prepareStatement(query);\npstmt.setString(1, deptName);\nResultSet rs = pstmt.executeQuery();`
    },
    bookmyshow: {
        title: "BookMyShow Booking Clone",
        tech: "HTML5 + CSS3 + Vanilla JavaScript",
        subtitle: "Premium UI/UX layout replicating complex seat selection matrices.",
        details: "Built an interactive movie ticket selection application featuring glassmorphic designs. Captures click updates on seat grids, computes prices, updates cart indicators, and triggers success notification cards.",
        architecture: "Interactive Seat Layout SVG/Divs -> Click Listeners -> Price Calculators -> Session Storage Cart.",
        codeSnippet: `seat.addEventListener('click', () => {\n  seat.classList.toggle('selected');\n  updateCartSummary();\n});`
    }
};

function openCaseStudy(key) {
    window.location.href = '/project/' + key;
}

function closeCaseStudy() {
    const modal = document.getElementById('case-study-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    const content = modal.querySelector('#case-study-content-container');
    if (content) content.classList.add('translate-y-12');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/* =========================================================================
   10. Blog Modal Content and Handlers
   ========================================================================= */
const BLOGS = {
    1: {
        title: "Deploying Real-Time Radiation Monitors via ESP32 & MQTT",
        date: "June 10, 2026",
        content: `
            <p class="leading-relaxed">Building Internet of Things (IoT) devices in hazardous locations requires swift alert triggers. A common failure mode is depending entirely on remote cloud server response paths. If local network nodes go offline, latency spike thresholds cause alerts to fail.</p>
            <p class="mt-4 leading-relaxed">In this study, we coupled a Geiger counter tube sensor directly with an ESP32 chip. We compiled a custom neural network that performs edge threshold checks. The microcontroller samples radiation pulse frequencies, filters background electrical noise locally on-chip, and immediately raises buzzer alerts if radiation increases. Standard telemetry packets are pushed over MQTT broker bridges to centralized Flask analytics dashboards for long-term logging.</p>
            <p class="mt-4 leading-relaxed font-mono text-cyan-400 text-xs">// Key benefits: Edge-computed anomaly detection, zero network latency alerts, resilient network failure fallback modes.</p>
        `
    },
    2: {
        title: "Training Scikit-Learn Classifiers for Medical Diagnostics",
        date: "May 28, 2026",
        content: `
            <p class="leading-relaxed">Applying machine learning classifiers in medicine requires high recall indicators to avoid dangerous false negatives. In this project, we built a diabetes prediction pipeline analyzing patient parameters like insulin, age, and glucose thresholds.</p>
            <p class="mt-4 leading-relaxed">Data preprocessing steps involved handling missing parameters, standardizing dataset attributes using Scikit-Learn StandardScalers, and mapping correlations using PCA. We evaluated Random Forest, Support Vector Machines, and Logistic Regressions. Random Forest classifiers achieved high validation accuracy score thresholds. Models were exported as serialized pickle (.pkl) assets and loaded into lightweight REST API endpoints.</p>
        `
    },
    3: {
        title: "Robotic Autonomous Vehicles and Sensor Integration",
        date: "April 14, 2026",
        content: `
            <p class="leading-relaxed">Autonomous navigation requires real-time range scanning loops. Our mini robotic vehicle integrates ultrasonic range finders and infrared array tracks to construct dynamic avoidance vectors.</p>
            <p class="mt-4 leading-relaxed">Using Arduino and ESP32 GPIO interrupts, we created sensor scanning frequencies running every 20ms. If range readings fall under safety limits, steering routines adjust servo angles to chart clear paths. Driving power is regulated via L298N H-bridge pulse width modulation outputs.</p>
        `
    }
};

function readBlog(id) {
    const data = BLOGS[id];
    if (!data) return;

    const modal = document.getElementById('blog-modal');
    const injected = document.getElementById('blog-injected');

    injected.innerHTML = `
        <span class="text-xs font-mono text-purple-400 uppercase tracking-widest">${data.date}</span>
        <h2 class="text-3xl font-extrabold text-white mb-6 mt-2">${data.title}</h2>
        <div class="text-slate-400 leading-relaxed space-y-4 text-sm">
            ${data.content}
        </div>
        <div class="mt-8">
            <button onclick="closeBlog()" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-xs hover:scale-103 transition-transform duration-300">
                <span>Done Reading</span>
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('#blog-content-container').classList.remove('translate-y-12');
    }, 50);
}

function closeBlog() {
    const modal = document.getElementById('blog-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('#blog-content-container').classList.add('translate-y-12');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/* =========================================================================
   11. Contact Form Submission Routing
   ========================================================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        status.classList.remove('hidden', 'text-green-400', 'text-red-400');
        status.innerText = "Transmitting message packet...";
        status.classList.add('block', 'text-cyan-400');

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            status.classList.remove('text-cyan-400');
            if (data.success) {
                playSound('success');
                status.innerText = data.message;
                status.classList.add('text-green-400');
                form.reset();
                setTimeout(() => {
                    status.classList.add('hidden');
                }, 5000);
            } else {
                status.innerText = data.message;
                status.classList.add('text-red-400');
            }
        })
        .catch(err => {
            status.classList.remove('text-cyan-400');
            status.innerText = "Transmission failed. Verify local network connection.";
            status.classList.add('text-red-400');
        });
    });
}

/* =========================================================================
   11.5. Quick Contact Form / Auto-Popup Logic
   ========================================================================= */
function initQuickContact() {
    const panel = document.getElementById('quick-contact-panel');
    const closeBtn = document.getElementById('close-quick-contact');
    const form = document.getElementById('quick-contact-form');
    const status = document.getElementById('quick-contact-status');
    
    if (!panel || !form) return;

    // Close button dismisses popup and sets dismissed flag
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            playSound('click');
            closeQuickContact();
            localStorage.setItem('quick_contact_dismissed', 'true');
        });
    }

    // Check if user has previously dismissed or submitted
    const isDismissed = localStorage.getItem('quick_contact_dismissed');
    
    if (isDismissed !== 'true') {
        // Show after a delay of 3.5 seconds (gives bootloader time to finish)
        setTimeout(() => {
            openQuickContact();
        }, 3500);
    }

    function openQuickContact() {
        panel.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none', 'scale-95');
    }

    function closeQuickContact() {
        panel.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none', 'scale-95');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        status.classList.remove('hidden', 'text-green-400', 'text-red-400');
        status.innerText = "Transmitting message packet...";
        status.classList.add('block', 'text-cyan-400');

        const formData = {
            name: document.getElementById('quick-contact-name').value,
            email: document.getElementById('quick-contact-email').value,
            subject: "Quick Contact Message Box",
            message: document.getElementById('quick-contact-message').value
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            status.classList.remove('text-cyan-400');
            if (data.success) {
                playSound('success');
                status.innerText = "Message sent successfully!";
                status.classList.add('text-green-400');
                form.reset();
                localStorage.setItem('quick_contact_dismissed', 'true');
                // Automatically close after a short delay
                setTimeout(() => {
                    closeQuickContact();
                }, 3000);
            } else {
                status.innerText = data.message;
                status.classList.add('text-red-400');
            }
        })
        .catch(err => {
            status.classList.remove('text-cyan-400');
            status.innerText = "Transmission failed. Verify connection.";
            status.classList.add('text-red-400');
        });
    });
}

/* =========================================================================
   12. Entrypoint Initializations
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Run loading sequence
    runBootLoader();

    // Setup visual components
    initCustomCursor();
    initTypingEffect();
    initFloatingDock();
    initThemeToggle();
    initProjectFilters();
    initContactForm();
    initQuickContact();

    // Sound binding
    bindSoundEffects();
    
    // Resume audio context on user action
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
});

