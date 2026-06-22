// Three.js Scenes for Sri Lakshman M L's Personal Portfolio

// Global variables to track mouse position for interactive elements
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

/* =========================================================================
   1. Interactive Particle Web Background
   ========================================================================= */
function initBackgroundParticles() {
    const container = document.getElementById('background-canvas');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle geometry
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Distribute randomly in a box
        positions[i] = (Math.random() - 0.5) * 120;     // X
        positions[i + 1] = (Math.random() - 0.5) * 80;  // Y
        positions[i + 2] = (Math.random() - 0.5) * 60;  // Z

        speeds.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle material - glowing cyan/purple dots
    const material = new THREE.PointsMaterial({
        size: 0.8,
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // Points system
    const pointSystem = new THREE.Points(geometry, material);
    scene.add(pointSystem);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const posAttr = geometry.attributes.position;
        const array = posAttr.array;

        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            // Drifts
            array[idx] += speeds[i].x;
            array[idx + 1] += speeds[i].y;
            array[idx + 2] += speeds[i].z;

            // Bounds check
            if (Math.abs(array[idx]) > 65) speeds[i].x *= -1;
            if (Math.abs(array[idx + 1]) > 45) speeds[i].y *= -1;
            if (Math.abs(array[idx + 2]) > 35) speeds[i].z *= -1;

            // Interactive mouse pull
            const dx = array[idx] - (mouse.x * 45);
            const dy = array[idx + 1] - (mouse.y * 30);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 15) {
                array[idx] += dx * 0.01;      // Push slightly away
                array[idx + 1] += dy * 0.01;
            }
        }

        posAttr.needsUpdate = true;

        // Subtle camera rotation
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* =========================================================================
   2. Interactive 3D Tech Sphere (Hero Canvas)
   ========================================================================= */
function initHero3D() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all objects for easy dragging
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Core geometry - A premium wireframe TorusKnot
    const coreGeom = new THREE.TorusKnotGeometry(4, 1.2, 120, 16);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x0f172a,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.45,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    mainGroup.add(coreMesh);

    // Outer Orbiting Satellites (Representing Tech stack nodes)
    const satCount = 8;
    const satellites = [];
    const colors = [0x00f2fe, 0x8b5cf6, 0xec4899, 0x10b981, 0xf59e0b, 0x3b82f6, 0x84cc16, 0xa855f7];
    const techNames = ["Python", "Java", "ESP32", "ANN", "IoT", "DevOps", "Robotics", "MySQL"];

    for (let i = 0; i < satCount; i++) {
        // Orbit configuration
        const radius = 7 + Math.random() * 2;
        const angle = (i / satCount) * Math.PI * 2;
        const speed = 0.005 + Math.random() * 0.005;

        // Satellite Geometry
        const satGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const satMat = new THREE.MeshPhongMaterial({
            color: colors[i],
            emissive: colors[i],
            emissiveIntensity: 1.2,
            shininess: 100
        });
        const satMesh = new THREE.Mesh(satGeom, satMat);

        satMesh.position.x = Math.cos(angle) * radius;
        satMesh.position.y = Math.sin(angle) * radius;
        satMesh.position.z = (Math.random() - 0.5) * 3;

        mainGroup.add(satMesh);
        satellites.push({
            mesh: satMesh,
            radius: radius,
            angle: angle,
            speed: speed,
            axisY: Math.random() * 0.5 + 0.5,
            axisX: Math.random() * 0.5
        });
    }

    // Drag Interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', () => {
        isDragging = true;
    });

    container.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging) {
            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    (deltaMove.y * Math.PI) / 180 * 0.5,
                    (deltaMove.x * Math.PI) / 180 * 0.5,
                    0,
                    'XYZ'
                ));

            mainGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, mainGroup.quaternion);
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        previousMousePosition = {
            x: touch.clientX - container.getBoundingClientRect().left,
            y: touch.clientY - container.getBoundingClientRect().top
        };
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const currentX = touch.clientX - container.getBoundingClientRect().left;
        const currentY = touch.clientY - container.getBoundingClientRect().top;
        const deltaMove = {
            x: currentX - previousMousePosition.x,
            y: currentY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                (deltaMove.y * Math.PI) / 180 * 0.5,
                (deltaMove.x * Math.PI) / 180 * 0.5,
                0,
                'XYZ'
            ));

        mainGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, mainGroup.quaternion);

        previousMousePosition = {
            x: currentX,
            y: currentY
        };
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Auto rotation when not dragging
        if (!isDragging) {
            mainGroup.rotation.y += 0.05 * delta;
            mainGroup.rotation.x += 0.02 * delta;
        }

        // Rotate core wireframe torus knot independently
        coreMesh.rotation.z += 0.1 * delta;

        // Animate outer satellites in circular orbit
        satellites.forEach(sat => {
            sat.angle += sat.speed;
            sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
            sat.mesh.position.y = Math.sin(sat.angle) * sat.radius;
            // Pulsing scale
            const scale = 1 + Math.sin(sat.angle * 3) * 0.15;
            sat.mesh.scale.set(scale, scale, scale);
        });

        // Hover reactive light
        pointLight1.position.x = Math.sin(clock.getElapsedTime()) * 15;
        pointLight2.position.y = Math.cos(clock.getElapsedTime()) * 15;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0) {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundParticles();
    // Wait a brief moment to let Hero render container fully before loading 3D
    setTimeout(initHero3D, 200);
});
