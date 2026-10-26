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

  // Native document scrolling drives a sequence of readable depth chapters.
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton=$('.motion-toggle');
  const rail=$('.depth-rail'),stage=$('.depth-stage');
  const panels=$$('.depth-panel');
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  let savedMotion;try{savedMotion=localStorage.getItem('portfolio-depth-motion-v1');}catch{}
  let enabled=!media.matches&&savedMotion!=='off',framePending=false,active=0,applying=false;
  let chapters=[],journeyLength=0;
  const aliases={profile:'home',projects:'work',skills:'toolkit'};
  const counter=$('.depth-counter'),name=$('.depth-name'),prev=$('[data-depth-prev]'),next=$('[data-depth-next]');
  function layout(){
    if(!enabled)return;
    let start=0;
    const transition=Math.max(400,stage.clientHeight*.95);
    chapters=panels.map((p,i)=>{
      const c=$('.depth-content',p);c.style.transform='none';
      const style=getComputedStyle(p);
      const available=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
      const read=Math.max(0,c.offsetHeight-available);
      p.style.alignItems=read>0?'flex-start':'center';
      p.dataset.readDistance=String(Math.ceil(read));
      const chapter={start,read,transition};
      start+=read+(i<panels.length-1?transition:0);
      return chapter;
    });
    journeyLength=start;
    rail.style.setProperty('--tunnel-height',`${journeyLength+stage.clientHeight}px`);
    updateScroll();
  }
  function updateScroll(){
    framePending=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    $('.reading-progress').style.transform=`scaleX(${max>0?clamp(scrollY/max):0})`;
    if(!enabled){
      const center=innerHeight*.5;
      active=panels.reduce((best,p,i)=>Math.abs(p.getBoundingClientRect().top-center)<Math.abs(panels[best].getBoundingClientRect().top-center)?i:best,0);
      return;
    }
    if(!chapters.length)return;
    const scroll=clamp(scrollY,0,journeyLength);
    let index=0;
    for(let i=1;i<chapters.length;i++){if(scroll>=chapters[i].start-.5)index=i;else break;}
    const chapter=chapters[index],within=Math.max(0,scroll-chapter.start);
    const mix=index===panels.length-1?0:clamp((within-chapter.read)/chapter.transition);
    const incoming=Math.min(panels.length-1,index+1);
    const current=mix>.5?incoming:index;
    panels.forEach((p,i)=>{
      const distance=i===index?mix:i===incoming?mix-1:i<index?2:-2;
      const visible=i===index||i===incoming;
      const opacity=i===index?clamp(1-mix*1.55):i===incoming?clamp(1-(1-mix)*1.55):0;
      p.style.visibility=visible?'visible':'hidden';
      p.style.opacity=String(index===panels.length-1&&i===index?1:opacity);
      p.style.transform=`scale(${Math.exp(distance*.48).toFixed(4)})`;
      const readOffset=i===index?Math.min(within,chapter.read):i<index?chapters[i].read:0;
      $('.depth-content',p).style.transform=`translateY(${-readOffset}px)`;
      p.style.zIndex=String(panels.length-i+2);
      p.classList.toggle('is-current',i===current);
      p.inert=i!==current;p.setAttribute('aria-hidden',String(i!==current));
      p.dataset.depthProgress=distance.toFixed(3);
    });
    active=current;counter.textContent=`${String(active+1).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;
    name.textContent=panels[active].dataset.chapter;
    prev.disabled=active===0;next.disabled=active===panels.length-1;
    $$('.depth-ring').forEach((r,i)=>{r.style.transform=`scale(${1+mix*(i+1)*.65}) rotate(${mix*(i%2?2:-2)}deg)`;r.style.opacity=String(.8-mix*.45);});
    $('.depth-grid').style.translate=`0 ${(-scroll*.035).toFixed(1)}px`;
    if(document.activeElement?.closest('.depth-panel[inert]'))document.activeElement.blur();
  }
  function requestScrollUpdate(){if(!framePending){framePending=true;requestAnimationFrame(updateScroll);}}
  function gotoPanel(index,smooth=true){
    index=clamp(index,0,panels.length-1);active=index;
    if(enabled)window.scrollTo({top:chapters[index]?.start||0,behavior:smooth?'smooth':'instant'});
    else panels[index].scrollIntoView({behavior:media.matches?'instant':'smooth',block:'start'});
  }
  function hashTarget(hash){let id;try{id=decodeURIComponent(hash.replace(/^#/,''));}catch{return null;}
    id=aliases[id]||id;const e=document.getElementById(id);return e?.closest('.depth-panel');}
  document.addEventListener('click',e=>{
    const link=e.target.closest('a[href^="#"]');if(!link||link.classList.contains('skip-link'))return;
    const p=hashTarget(link.hash);if(!p)return;
    e.preventDefault();closeMenu();history.pushState(null,'',link.hash);gotoPanel(panels.indexOf(p));
  });
  window.addEventListener('popstate',()=>{const p=hashTarget(location.hash);if(p)gotoPanel(panels.indexOf(p),false);});
  prev.addEventListener('click',()=>gotoPanel(active-1));next.addEventListener('click',()=>gotoPanel(active+1));
  function applyMotion(){
    applying=true;
    document.documentElement.classList.toggle('depth-on',enabled);
    document.documentElement.dataset.motion=enabled?'on':'off';
    document.documentElement.classList.remove('js-motion');
    motionButton.setAttribute('aria-pressed',String(!enabled));
    motionButton.setAttribute('aria-label',enabled?'Turn depth motion off':'Turn depth motion on');
    motionButton.title=enabled?'Switch to normal scrolling':'Enable Depth Tunnel';
    $('.motion-label').textContent=enabled?'Depth ON':'Depth OFF';
    if(enabled){layout();gotoPanel(active,false);}else{
      panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden');p.style.visibility='';p.style.opacity='';p.style.transform='';p.style.alignItems='';$('.depth-content',p).style.transform='';p.classList.remove('is-current');});
      panels[active].scrollIntoView({behavior:'instant',block:'start'});
    }
    applying=false;
  }
  motionButton.addEventListener('click',()=>{
    if(media.matches){showToast('Your system has reduced motion enabled.');return;}
    enabled=!enabled;savedMotion=enabled?'on':'off';try{localStorage.setItem('portfolio-depth-motion-v1',savedMotion);}catch{}
    applyMotion();
  });
  const adapt=()=>{enabled=!media.matches&&savedMotion!=='off';applyMotion();};
  media.addEventListener('change',adapt);
  window.addEventListener('scroll',requestScrollUpdate,{passive:true});
  window.addEventListener('resize',()=>{if(!applying){const i=active;layout();if(enabled)gotoPanel(i,false);}});
  if('ResizeObserver'in window){let oldHeight=innerHeight;new ResizeObserver(()=>{if(innerHeight!==oldHeight){oldHeight=innerHeight;layout();}}).observe(document.documentElement);}
  applyMotion();
  const initial=hashTarget(location.hash);if(initial)gotoPanel(panels.indexOf(initial),false);
  document.fonts?.ready.then(()=>{layout();if(enabled){const p=hashTarget(location.hash);if(p)gotoPanel(panels.indexOf(p),false);}});
})();
