// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
	toggle.addEventListener('click', () => {
		nav.classList.toggle('open');
	});
}

// Simple form validation (Contact page only)
export function validateContactForm(form) {
	const name = form.querySelector('input[name="name"]');
	const email = form.querySelector('input[name="email"]');
	const message = form.querySelector('textarea[name="message"]');
	if (!name || !email || !message) return true;
	let ok = true;
	const emailOk = /.+@.+\..+/.test(email.value.trim());
	[name, email, message].forEach((el) => {
		el.style.borderColor = 'rgba(212,175,55,.25)';
	});
	if (name.value.trim().length < 2) {
		name.style.borderColor = '#f66';
		ok = false;
	}
	if (!emailOk) {
		email.style.borderColor = '#f66';
		ok = false;
	}
	if (message.value.trim().length < 10) {
		message.style.borderColor = '#f66';
		ok = false;
	}
	return ok;
}

// Reviews carousel controls
const reviewsGrid = document.getElementById('reviewsGrid');
const prevBtn = document.querySelector('.reviews-prev');
const nextBtn = document.querySelector('.reviews-next');
if (reviewsGrid && prevBtn && nextBtn) {
	const step = 520; // width per card
	prevBtn.addEventListener('click', () => {
		reviewsGrid.scrollBy({ left: -step, behavior: 'smooth' });
	});
	nextBtn.addEventListener('click', () => {
		reviewsGrid.scrollBy({ left: step, behavior: 'smooth' });
	});
}

// No counters (removed on request)

// Scroll reveal for fade-in cards
function fadeInCardsOnScroll() {
  const cards = document.querySelectorAll('.card, .feature, .review-card');
  cards.forEach(c => c.classList.add('fade-in-on-scroll'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold: 0.18});
  cards.forEach(c => io.observe(c));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fadeInCardsOnScroll);
} else {
  fadeInCardsOnScroll();
}

// Christmas greeting toast on every visit
(function(){
  try{
    const toast = document.getElementById('christmas-toast');
    if(toast){
      toast.classList.add('show');
      setTimeout(()=>{ if(toast && toast.style.display!=='none'){ toast.style.display='none'; } }, 6000);
    }
  }catch(e){ /* ignore */ }
})();


