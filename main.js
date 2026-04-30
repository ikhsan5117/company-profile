/**
 * Ikhsan's Portfolio - Main JavaScript
 * Futuristic Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initRevealOnScroll();
    initParticles();
    initMobileMenu();
});

/* ===== NAVBAR EFFECT ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });
}

/* ===== REVEAL ON SCROLL ===== */
function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* ===== PARTICLE BACKGROUND ===== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#00f0ff' : '#a855f7';
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.size; i++) {
            for (let j = i + 1; j < particles.size; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* ===== FORM SUBMISSION ===== */
window.handleSubmit = function(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-send');
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    
    const formData = new FormData(form);
    
    btn.innerHTML = 'Mengirim...';
    btn.disabled = true;

    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.style.display = 'none';
            success.style.display = 'block';
            success.classList.add('reveal', 'active');
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! Ada masalah saat mengirim pesan Anda.");
                }
                btn.innerHTML = 'Kirim Pesan 🚀';
                btn.disabled = false;
            });
        }
    }).catch(error => {
        alert("Oops! Terjadi kesalahan koneksi.");
        btn.innerHTML = 'Kirim Pesan 🚀';
        btn.disabled = false;
    });
    
    return false;
};
