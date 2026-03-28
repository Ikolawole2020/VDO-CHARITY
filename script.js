// VDO Charity - Direct Donation with Loading & Custom Messages
// EmailJS - Live enabled
const SERVICE_ID = 'service_la0i41s';
const TEMPLATE_ID = 'template_gjfzcwd';
const PUBLIC_KEY = 'O-QWGFWLI-SKVhN-D';

document.addEventListener('DOMContentLoaded', function () {
    emailjs.init(PUBLIC_KEY);

    // Custom notification function (replaces alert)
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1.5rem 2rem; border-radius: 12px; 
            color: white; font-weight: 600; font-size: 1rem; z-index: 9999; transform: translateX(400px);
            transition: transform 0.3s ease, opacity 0.3s ease; backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;
        notification.className = `notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Type-specific styles
        if (type === 'loading') {
            notification.style.background = 'linear-gradient(45deg, #ff6b35, #ff8e53)';
            notification.innerHTML += ' <div style="display: inline-block; margin-left: 1rem;"><div style="width: 20px;height: 20px;border: 2px solid rgba(255,255,255,0.3);border-top: 2px solid white;border-radius: 50%;animation: spin 1s linear infinite;"></div></div>';
        } else if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #10b981, #34d399)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ef4444, #f87171)';
        }

        // Show animation
        requestAnimationFrame(() => notification.style.transform = 'translateX(0)');

        // Auto hide
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }

    // Add spinner CSS
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('animate'));
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.animate').forEach(el => observer.observe(el));

    // Safe stats
    function animateStats() {
        document.querySelectorAll('[data-target]').forEach(stat => {
            try {
                const target = parseInt(stat.getAttribute('data-target').replace(/[^0-9]/g, ''));
                let count = parseInt(stat.innerText.replace(/[^0-9]/g, ''));
                if (count < target) {
                    stat.innerText = Math.floor(count + target / 100).toLocaleString();
                    requestAnimationFrame(animateStats);
                }
            } catch (e) { }
        });
    }
    document.querySelector('.stats') && observer.observe(document.querySelector('.stats'));

    // Donation Form - Enhanced submit with loading
    const paymentForm = document.getElementById('paymentForm');
    const submitBtn = paymentForm?.querySelector('button[type="submit"]');
    if (paymentForm && submitBtn) {
        paymentForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const amountInput = document.getElementById('custom-amount');
            const amount = parseFloat(amountInput.value.replace(/[^0-9.]/g, '')) || 0;

            if (amount <= 0) {
                showNotification('Please enter valid amount > $0', 'error');
                return;
            }

            // Set hidden amount
            document.getElementById('modalAmount').value = amount;

            // Loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            showNotification('Payment is being processed. Please wait...', 'loading');

            try {
                const result = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this, PUBLIC_KEY);
                showNotification(`Thank you! $${amount.toLocaleString()} donated ❤️ Check email.`, 'success');
                this.reset();
                amountInput.focus();
            } catch (error) {
                console.error(error);
                showNotification('Processing error. Please try again or contact us.', 'error');
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});

// Header scroll
window.addEventListener('scroll', () => document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50));

