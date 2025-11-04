// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Google Translate init and binding to our selectors
(function setupTranslation(){
	const root = document.documentElement;
	const topSel = document.getElementById('lang-top');
	const footSel = document.getElementById('lang-select');
	const saved = localStorage.getItem('dizco_lang') || 'en';
	function applyDir(lang){ root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr'; }
	applyDir(saved);
	if (topSel) topSel.value = saved; if (footSel) footSel.value = saved;

	function setGoogleLanguage(lang){
		const combo = document.querySelector('.goog-te-combo');
		if (combo) { combo.value = lang; combo.dispatchEvent(new Event('change')); }
	}
	function onChange(lang){
		localStorage.setItem('dizco_lang', lang);
		applyDir(lang);
		setGoogleLanguage(lang);
		if (topSel && topSel.value !== lang) topSel.value = lang;
		if (footSel && footSel.value !== lang) footSel.value = lang;
	}
	function bind(){
		if (topSel) topSel.addEventListener('change', () => onChange(topSel.value));
		if (footSel) footSel.addEventListener('change', () => onChange(footSel.value));
	}
	bind();
	// Load Google translate once
	if (!window.google || !window.google.translate){
		window.googleTranslateElementInit = function(){
			try{ new window.google.translate.TranslateElement({pageLanguage:'en', includedLanguages:'en,es,fr,pt,it,ar', autoDisplay:false}, 'google_translate_element'); setTimeout(()=>setGoogleLanguage(saved), 400); }catch(e){}
		};
		const s = document.createElement('script');
		s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
		document.head.appendChild(s);
	} else {
		setTimeout(()=>setGoogleLanguage(saved), 200);
	}
})();

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

// Top banner message cycle (usable on all pages)
(function initTopBanner(){
  const banner = document.querySelector('.top-banner');
  const msgs = banner ? banner.querySelectorAll('.banner-msg') : null;
  if(!banner || !msgs || msgs.length < 2) return;
  let current = 0, running = false;
  function showMsg(idx){
    msgs.forEach((m,i)=>{ m.style.display = i===idx? 'inline-block':'none'; });
  }
  function cycle(){
    if(running) return; running = true; showMsg(current); banner.classList.remove('out');
    setTimeout(()=>{ banner.classList.add('out'); setTimeout(()=>{ banner.style.visibility='hidden'; setTimeout(()=>{ current = 1-current; showMsg(current); banner.style.visibility='visible'; banner.classList.remove('out'); running=false; cycle(); }, 5000); }, 1200); }, 10000);
  }
  cycle();
})();

// Christmas toast helper
function showChristmasToast(){
  try{
    const toast = document.getElementById('christmas-toast');
    if(toast){
      toast.classList.add('show');
      setTimeout(()=>{ if(toast && toast.style.display!=='none'){ toast.style.display='none'; } }, 6000);
    }
  }catch(e){}
}


