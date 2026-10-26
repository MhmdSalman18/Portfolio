(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const profile = window.PORTFOLIO || {};
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fill = (selector, value) => { if (value) $$(selector).forEach(el => el.textContent = value); };
  fill('[data-name]', profile.name);
  fill('[data-role]', profile.role);
  fill('[data-location]', profile.location);
  fill('[data-bio]', profile.bio);
  fill('[data-bio-detail]', profile.bioDetail);
  document.title = `${profile.name || 'Your Name'} — ${profile.role || 'Android Developer'}`;
  if (profile.template === false) $('[data-template]').hidden = true;

  // Modal focus is handled by native <dialog>; restore the initiating control on close.
  const projectDialog = $('#project-dialog');
  const infoDialog = $('#info-dialog');
  let opener = null;
  let previousOverflow = '';
  const openDialog = (dialog, trigger) => {
    opener = trigger || document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    $('.dialog-close', dialog).focus({preventScroll:true});
  };
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus({preventScroll:true});
    });
  });

  const projects = window.PORTFOLIO_PROJECTS || {};
  const showProject = (key, trigger) => {
    const p = projects[key]; if (!p) return;
    $('.case-body').innerHTML = `
      <p class="eyebrow">${escapeHTML(p.category)}</p><h2 id="case-title">${escapeHTML(p.title)}<span style="color:#91a37e">.</span></h2>
      <p class="case-subtitle">${escapeHTML(p.subtitle)}</p>
      <p class="case-notice">${escapeHTML(p.notice)}</p>
      <div class="case-banner ${key}-case" aria-hidden="true"><div class="case-banner-title">${p.visual.map(escapeHTML).join('<br>')}</div><span class="case-banner-symbol">${p.symbol}</span></div>
      <div class="case-overview"><div><span>PLATFORM</span><strong>${escapeHTML(p.platform)}</strong></div><div><span>TECH STACK</span><strong>${escapeHTML(p.stack)}</strong></div><div><span>PROJECT TYPE</span><strong>${escapeHTML(p.type)}</strong></div></div>
      <div class="case-sections"><div><h3>The idea</h3><p>${escapeHTML(p.problem)}</p></div><div><h3>The approach</h3><p>${escapeHTML(p.approach)}</p></div><div class="case-full"><h3>My contribution</h3><p>${escapeHTML(p.contribution)}</p><ul>${p.details.map(d=>`<li>${escapeHTML(d)}</li>`).join('')}</ul></div><div class="case-full"><h3>${escapeHTML(p.resultsTitle)}</h3><p>${escapeHTML(p.outcome)}</p></div></div>
      <div class="case-links">${(p.links || []).map(link => { const url = safeLink(link.url); return url ? `<a class="text-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>` : ''; }).join('')}</div>
      <div class="case-footer"><span>${escapeHTML(p.footer)}</span><button class="case-next" data-next="${p.next}">Next: ${escapeHTML(projects[p.next].title)} <span aria-hidden="true">↗</span></button></div>`;
    $('[data-next]', projectDialog).addEventListener('click', event => {
      const next = event.currentTarget.dataset.next;
      renderNextProject(next);
    });
    if (!projectDialog.open) openDialog(projectDialog, trigger);
    projectDialog.scrollTop = 0;
  };
  const renderNextProject = key => { showProject(key); $('.dialog-close', projectDialog).focus({preventScroll:true}); };
  $$('[data-project]').forEach(el => el.addEventListener('click', () => showProject(el.dataset.project, el)));

  // Filters use real buttons and announce the visible result count.
  const filters = $$('.filter');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => {const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
    let count=0;
    $$('.project-card').forEach(card=>{const show=category==='all'||category===card.dataset.category;card.hidden=!show;if(show){count++;card.classList.add('visible');}});
    $('.work-count').textContent=`${count} ${count===1?'selected project':'selected projects'}`;
    requestScrollUpdate();
  }));

  const safeLink = value => {
    if (!value || typeof value !== 'string') return null;
    try { const url=new URL(value,window.location.href);return ['https:','http:'].includes(url.protocol)?url.href:null; } catch {return null;}
  };
  const showInfo = (title, content, trigger) => {
    $('.info-body').innerHTML=`<div class="info-mark" aria-hidden="true">✳</div><h2 id="info-title">${title}</h2>${content}`;
    openDialog(infoDialog,trigger);
  };
  const missingLink = (type,trigger) => {
    const names={resume:'résumé',github:'GitHub profile',linkedin:'LinkedIn profile'};
    showInfo(`Your ${names[type]} goes here.`,`<p>This is a template preview. Add your ${names[type]} link in <code>content.js</code> when you’re ready to personalize it.</p><p>The button will then open your real ${names[type]} directly.</p>`,trigger);
  };
  $$('[data-link]').forEach(button=>button.addEventListener('click',()=>{
    const type=button.dataset.link;
    const url=safeLink(profile[type]);
    if(url) window.open(url,'_blank','noopener,noreferrer');else missingLink(type,button);
  }));
  $$('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
    const focusReturn = mobileNav.contains(button) ? menuButton : button;
    closeMenu();
    const email=String(profile.email||'').trim();
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showInfo('Let’s start a conversation.',`<p>Reach ${escapeHTML(profile.name||'me')} at <strong>${escapeHTML(email)}</strong>.</p><div class="info-actions"><a class="button button-dark" href="mailto:${encodeURIComponent(email)}">Write an email <span>↗</span></a><button class="button button-light" id="copy-email">Copy email</button></div>`,focusReturn);
      $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(email);showToast('Email address copied.');}catch{showToast(`Email: ${email}`);}});
    }else{
      showInfo('A good conversation<br>starts here.',`<p>Your contact details will appear here. Add your email in <code>content.js</code> to enable the email and copy buttons.</p><p>For now, enjoy exploring the template. No messages are collected or sent.</p>`,focusReturn);
    }
  }));
  $('[data-template]').addEventListener('click',event=>showInfo('Make it yours.',`<p>Your project stories are in place: Kadi Undo, CredenceAI, Prime Valet, and EcoMap. Selected Work uses original marketing posters; the homepage features an illustrated app interface.</p><ol><li>Update your name, bio, and links in <code>content.js</code>.</li><li>Add real app screenshots or recordings when they are ready and approved for sharing.</li><li>Finish your profile, contact links, and résumé. The portfolio stays local until you ask to publish.</li></ol>`,event.currentTarget));
  let toastTimer;
  const showToast = message => {const toast=$('.toast');clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,3500);};

  const menuButton=$('.menu-toggle');const mobileNav=$('#mobile-nav');
  function closeMenu(){menuButton.setAttribute('aria-expanded','false');mobileNav.hidden=true;menuButton.setAttribute('aria-label','Open navigation');}
  menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open;menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $$('a',mobileNav).forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
  document.addEventListener('click',event=>{if(!mobileNav.hidden&&!$('.site-header').contains(event.target))closeMenu();});
  window.matchMedia('(min-width: 641px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

  // Scroll-driven layers work without native CSS scroll-timeline support.
  // Ordinary page scrolling stays intact; only the hero scene is temporarily pinned.
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = $('.motion-toggle');
  const track = $('.hero-scroll-track');
  const hero = $('.hero');
  const scene = $('.hero-visual');
  const header = $('.site-header');
  const art = $$('.project-visual .art-drift');
  const parallax = $$('.parallax').filter(el => !el.closest('.hero'));
  const motionKey = 'portfolio-motion-v2';
  let savedMotion;
  try { savedMotion = localStorage.getItem(motionKey); } catch {}
  let motionEnabled = !media.matches && savedMotion !== 'off';
  let framePending = false;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  function updateScroll() {
    framePending = false;
    if (!motionEnabled) return;
    const viewport = window.innerHeight;
    const scroll = window.scrollY;
    const max = document.documentElement.scrollHeight - viewport;
    $('.reading-progress').style.transform = `scaleX(${max > 0 ? clamp(scroll / max) : 0})`;

    const heroRect = hero.getBoundingClientRect();
    const heroTop = heroRect.top + scroll;
    const progress = clamp((scroll - heroTop) / Math.max(1, hero.offsetHeight));
    hero.style.setProperty('--hero-progress', progress.toFixed(4));
    hero.dataset.scrollProgress = progress.toFixed(3);

    parallax.forEach(el => {
      const previous = Number(el.dataset.shift || 0);
      const rect = el.getBoundingClientRect();
      const top = rect.top - previous;
      if (top + rect.height < -150 || top > viewport + 150) return;
      const shift = clamp((viewport * .5 - top - rect.height * .5) * (Number(el.dataset.speed) || .1) * 2, -110, 110);
      el.style.translate = `0 ${shift.toFixed(2)}px`;
      el.dataset.shift = shift.toFixed(2);
    });

    art.forEach(el => {
      const frame = el.closest('.project-visual');
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < -150 || rect.top > viewport + 150) return;
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      const depth = (progress - .5) * 2;
      const poster = el.classList.contains('poster-art');
      const device = el.classList.contains('mini-phone') || el.classList.contains('valet-console');
      el.style.translate = poster ? `0 ${(-depth * 12).toFixed(2)}px` : device ? `0 ${(-depth * 78).toFixed(2)}px` : `${(depth * 22).toFixed(2)}px ${(depth * 25).toFixed(2)}px`;
      if (device || poster) el.style.rotate = `${(depth * (poster ? -.7 : -2)).toFixed(2)}deg`;
      frame.style.setProperty('--art-progress', progress.toFixed(4));
    });
    const photo = $('.about-personal-logo');
    const portraitFrame = $('.personal-art').getBoundingClientRect();
    if (portraitFrame.bottom > 0 && portraitFrame.top < viewport) {
      const progress = clamp((viewport - portraitFrame.top) / (viewport + portraitFrame.height));
      photo.style.transform = `translateY(${((progress - .5) * -44).toFixed(2)}px) scale(1.08)`;
    }
  }
  function requestScrollUpdate() {
    if (!framePending && motionEnabled) { framePending = true; requestAnimationFrame(updateScroll); }
  }
  function applyMotion() {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
    document.documentElement.classList.toggle('js-motion', motionEnabled);
    motionButton.setAttribute('aria-pressed', String(!motionEnabled));
    motionButton.setAttribute('aria-label', motionEnabled ? 'Reduce motion' : 'Enable motion');
    motionButton.title = motionEnabled ? 'Turn scroll animations off' : (media.matches ? 'System reduced motion is enabled' : 'Turn scroll animations on');
    $('.motion-label').textContent = motionEnabled ? 'Motion ON' : 'Motion OFF';
    if (motionEnabled) requestScrollUpdate();
    else {
      hero.style.setProperty('--hero-progress', '0');
      hero.dataset.scrollProgress = '0';
      [...parallax, ...art].forEach(el => { el.style.translate = ''; el.style.rotate = ''; el.dataset.shift = '0'; });
      $('.android-mascot').style.transform = '';
      $('.about-personal-logo').style.transform = '';
    }
  }
  motionButton.addEventListener('click', () => {
    if (media.matches) { showToast('Your system has reduced motion enabled.'); return; }
    motionEnabled = !motionEnabled;
    savedMotion = motionEnabled ? 'on' : 'off';
    try { localStorage.setItem(motionKey, savedMotion); } catch {}
    applyMotion();
  });
  media.addEventListener('change', () => { motionEnabled = !media.matches && savedMotion !== 'off'; applyMotion(); });
  window.addEventListener('scroll', requestScrollUpdate, {passive:true});
  window.addEventListener('resize', requestScrollUpdate, {passive:true});
  window.addEventListener('load', requestScrollUpdate);
  if (document.fonts?.ready) document.fonts.ready.then(requestScrollUpdate);
  scene.addEventListener('pointermove', event => {
    if (!motionEnabled || event.pointerType !== 'mouse') return;
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    $('.android-mascot').style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  });
  scene.addEventListener('pointerleave', () => { $('.android-mascot').style.transform = ''; });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:.08});
    $$('.reveal').forEach(el => observer.observe(el));
  } else { $$('.reveal').forEach(el => el.classList.add('visible')); }
  applyMotion();
})();


// Local, accessible exploration of documented project flows.
(() => {
  const scene=document.querySelector('.tech-universe');
  document.querySelectorAll('[data-studio-scene]').forEach(button=>button.addEventListener('click',()=>{
    scene.dataset.scene=button.dataset.studioScene;
    document.querySelectorAll('[data-studio-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  const flows={
    credence:[
      ['Capture','A payment becomes an event.','Android notification access lets the app listen for relevant payment and bank alerts. Package checks and sender patterns filter what reaches the parser.','NotificationListenerService / user-granted access'],
      ['Interpret','Make sense of the message.','A rules-based parser distinguishes debit and credit phrases, extracts amounts, and rejects OTPs, login reminders, and promotional messages.','Pure Kotlin / deterministic parsing'],
      ['Persist','Keep transactions structured.','Repository interfaces connect the domain layer to Room DAOs. Local transaction storage supports the dashboard and CSV export.','Repository pattern / Room / Hilt'],
      ['Present','Turn data into clarity.','ViewModels expose StateFlow to the Compose interface, bringing spending, income, and budget progress into a reactive dashboard.','ViewModel / StateFlow / Jetpack Compose']
    ],
    valet:[
      ['Start','Meet the workflow where it is.','Incident reporting is available from both parking confirmation and vehicle return. Vehicle details are filled from the active workflow.','Kotlin / Jetpack Compose'],
      ['Attach','Keep the evidence together.','Incident types come from the backend. The executive can attach photos, which upload before the incident report is submitted.','Retrofit / photo uploads'],
      ['Recover','A failed upload is recoverable.','Incident details and attached photos remain available locally after an upload failure so the user can recover the draft.','Room / local draft recovery'],
      ['Confirm','Success follows confirmation.','The app shows success only after the API confirms submission. The delivery flow returns Home before displaying the backend confirmation message.','REST API / explicit submission state']
    ],
    kadi:[
      ['Discover','Start close to home.','Distance-based discovery offers 2, 5, 10, and 25 km radii, with nearby reports sorted by distance and shown on a map.','Kotlin Multiplatform / MapLibre'],
      ['Contribute','Turn a find into a report.','Photo capture, compressed uploads, snack filters, and availability voting let the community share what is fresh nearby.','Compose Multiplatform / Supabase'],
      ['Validate','Keep today relevant.','Server timestamps, idempotent submissions, daily report limits, and editable availability votes protect the reporting flow. Daily reports expire at Kerala midnight.','Server validation / shared repositories'],
      ['Notify','Deliver useful updates.','A durable queue handles retries and lease recovery. Client checks reject duplicate, expired, or wrong-account notifications.','Durable queue / retry backoff / client validation']
    ]
  };
  const section=document.querySelector('#engineering');
  let project='credence',step=0;
  const flow=section.querySelector('.build-flow');
  function detail(){
    const item=flows[project][step];
    section.querySelector('.build-step').textContent=`${String(step+1).padStart(2,'0')} / ${project==='credence'?'CREDENCEAI':project==='valet'?'PRIME VALET':'KADI UNDO'}`;
    section.querySelector('.build-detail h3').textContent=item[1];
    section.querySelector('.build-detail p').textContent=item[2];
    section.querySelector('.build-tech').textContent=item[3];
    flow.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===step)));
  }
  function render(){
    flow.replaceChildren();
    flows[project].forEach((item,i)=>{
      const b=document.createElement('button');b.type='button';
      const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');
      b.append(n,document.createTextNode(item[0]));
      b.addEventListener('click',()=>{step=i;detail();});flow.append(b);
    });detail();
  }
  section.querySelectorAll('[data-build]').forEach(b=>b.addEventListener('click',()=>{
    project=b.dataset.build;step=0;
    section.querySelectorAll('[data-build]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));
    render();
  }));
  // Reuse the original case-study triggers, preserving native dialog behavior.
  const full=section.querySelector('#build-case');
  full.removeAttribute('data-project');
  full.addEventListener('click',()=>document.querySelector(`.project-card [data-project="${project}"]`).click());
  render();
})();
