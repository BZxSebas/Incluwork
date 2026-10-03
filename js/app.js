import { supabase } from './supabase.js';
// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOGO_COLORS = { BN:'#1d4ed8',SI:'#7c3aed',TA:'#0d9488',DG:'#d97706',CF:'#059669',MI:'#db2777' };

let JOBS = [];
const A11Y_FEATURES = [
  { id:'remoto', label:'Trabajo remoto', icon:'bi-house' },
  { id:'horario-flexible', label:'Horario flexible', icon:'bi-clock' },
  { id:'silla-ruedas', label:'Acceso silla de ruedas', icon:'bi-universal-access' },
  { id:'lector-pantalla', label:'Lector de pantalla', icon:'bi-eye' },
  { id:'sordera', label:'Intérprete LSP', icon:'bi-chat-square-dots' },
  { id:'motor', label:'Adaptaciones motoras', icon:'bi-mouse' },
  { id:'sensorial', label:'Ambiente adaptado', icon:'bi-sliders' },
];
let APPS_DATA = [];
let MSGS = [];
let CHART_DATA = [];
let COMPANY_APPLICANTS = [];
let ADMIN_USERS = [];

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  view: 'landing',
  role: null,
  fontSize: 16,
  highContrast: false,
  dyslexia: false,
  selectedJob: JOBS[0],
  activeFilters: [],
  searchQuery: '',
  sortBy: 'recent',
  appFilter: 'all',
  resourceCategory: 'Todos',
  activeMsg: 0,
  msgThreads: MSGS.map(m => ({ ...m, thread: [...m.thread] })),
  profileEditing: false,
  postJobSubmitted: false,
  adminTab: 'overview',
  companyApplicantFilter: 'all',
  sidebarOpen: true,
  loginRole: 'candidate',
  selectedA11y: [],
  appliedJobs: [],
  medicalConsent: false,
  profileTitle: 'Analista de Datos · Diseñadora UX',
  profileCity: 'Lima',
  profileBio: 'Profesional con 4 años de experiencia en análisis de datos y diseño UX. Apasionada por la accesibilidad digital y los productos centrados en el usuario.',
};

let chartInstance = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }
function show(id) { const e = el(id); if(e) e.classList.remove('d-none'); }
function hide(id) { const e = el(id); if(e) e.classList.add('d-none'); }

function statusBadge(status, color) {
  return `<span class="status-badge status-${color}">${status}</span>`;
}

function a11yBadge(id) {
  const feat = A11Y_FEATURES.find(f => f.id === id);
  if (!feat) return '';
  return `<span class="a11y-badge"><i class="bi ${feat.icon}" aria-hidden="true"></i><span class="d-none d-sm-inline">${feat.label}</span></span>`;
}

function logoBadge(initials, size='md') {
  const sz = { sm:'logo-badge-sm', md:'logo-badge-md', lg:'logo-badge-lg' }[size];
  const bg = LOGO_COLORS[initials] || '#1a3694';
  return `<div class="logo-badge ${sz}" style="background:${bg}">${initials}</div>`;
}

function jobCard(job) {
  const a11yBadges = job.a11y.slice(0,3).map(id => a11yBadge(id)).join('') +
    (job.a11y.length > 3 ? `<span class="a11y-badge">+${job.a11y.length - 3}</span>` : '');
  const tags = job.tags.map(t => `<span style="font-size:0.75rem;padding:2px 8px;border-radius:6px;background:var(--muted-bg);color:var(--muted-fg);">${t}</span>`).join('');
  const isApplied = state.appliedJobs.includes(job.id);
  return `
    <article class="job-card" tabindex="0" role="button" aria-label="Ver oferta: ${job.title}" onclick="viewJob(${job.id})" onkeydown="if(event.key==='Enter')viewJob(${job.id})">
      ${job.featured ? '<div class="job-card-featured-bar"></div>' : ''}
      <div style="padding:20px;display:flex;flex-direction:column;gap:12px;flex:1;">
        <div class="d-flex align-items-start gap-3">
          ${logoBadge(job.logo,'md')}
          <div class="flex-grow-1 min-w-0">
            <div class="d-flex align-items-start justify-content-between gap-2">
              <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;line-height:1.3;font-size:1rem;">${job.title}</h3>
              ${job.featured ? '<span style="flex-shrink:0;font-size:0.7rem;background:rgba(229,91,20,0.1);color:var(--accent);border:1px solid rgba(229,91,20,0.3);padding:2px 8px;border-radius:999px;font-weight:600;">Destacada</span>' : ''}
            </div>
            <p style="font-size:0.875rem;color:var(--muted-fg);margin:2px 0 0;">${job.company}</p>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-3" style="font-size:0.875rem;color:var(--muted-fg);">
          <span><i class="bi bi-geo-alt me-1"></i>${job.location}</span>
          <span><i class="bi bi-clock me-1"></i>${job.type}</span>
        </div>
        <p style="font-size:0.875rem;font-weight:600;margin:0;">${job.salary}</p>
        <div class="d-flex flex-wrap gap-1">${a11yBadges}</div>
        <div class="d-flex flex-wrap gap-1 mt-auto">${tags}</div>
      </div>
      <div class="d-flex align-items-center justify-content-between px-3 pb-3">
        <span style="font-size:0.75rem;color:var(--muted-fg);">${job.posted}</span>
        <button class="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onclick="event.stopPropagation();viewJob(${job.id})">
          ${isApplied ? 'Ver postulación' : 'Ver oferta'} <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </article>`;
}

// ─── Accessibility ────────────────────────────────────────────────────────────
function loadA11yState() {
  const saved = localStorage.getItem('incluyet-a11y');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.fontSize = parsed.fontSize || 16;
      state.highContrast = !!parsed.highContrast;
      state.dyslexia = !!parsed.dyslexia;
    } catch(e) {}
  }
  applyFontSize();
  applyHighContrast();
  applyDyslexia();
}
function saveA11yState() {
  localStorage.setItem('incluyet-a11y', JSON.stringify({
    fontSize: state.fontSize,
    highContrast: state.highContrast,
    dyslexia: state.dyslexia
  }));
}
function increaseFontSize() {
  state.fontSize = Math.min(22, state.fontSize + 2);
  applyFontSize();
  saveA11yState();
}
function decreaseFontSize() {
  state.fontSize = Math.max(14, state.fontSize - 2);
  applyFontSize();
  saveA11yState();
}
function applyFontSize() {
  document.documentElement.style.setProperty('--fs-base', state.fontSize + 'px');
  const disp = el('font-size-display');
  if (disp) disp.textContent = state.fontSize + 'px';
}
function toggleHighContrast() {
  state.highContrast = !state.highContrast;
  applyHighContrast();
  saveA11yState();
}
function applyHighContrast() {
  document.body.classList.toggle('high-contrast', state.highContrast);
  const btn = el('high-contrast-btn');
  if (btn) btn.setAttribute('aria-pressed', String(state.highContrast));
}
function toggleDyslexia() {
  state.dyslexia = !state.dyslexia;
  applyDyslexia();
  saveA11yState();
}
function applyDyslexia() {
  document.body.classList.toggle('font-dyslexia', state.dyslexia);
  const btn = el('dyslexia-btn');
  if (btn) btn.setAttribute('aria-pressed', String(state.dyslexia));
}

document.addEventListener('DOMContentLoaded', loadA11yState);
function togglePassword(inputId, btn) {
  const input = el(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.innerHTML = '<i class="bi bi-eye-slash"></i>'; }
  else { input.type = 'password'; btn.innerHTML = '<i class="bi bi-eye"></i>'; }
}

// ─── Login / Auth ─────────────────────────────────────────────────────────────
function selectRole(r) {
  state.loginRole = r;
  ['candidate','company','admin'].forEach(x => el('role-card-'+x).classList.toggle('active', x === r));
}

async function handleLoginSubmit(e) { 
  e.preventDefault(); 
  const email = el('login-email').value;
  const pass = el('login-password').value;
  
  if (window.supabaseClient) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email, password: pass
    });
    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      return;
    }
    
    // Obtener el rol real directamente desde la metadata del usuario
    const trueRole = data.user.user_metadata?.role || state.loginRole;
    
    // Fetch profile
    const { data: profile } = await window.supabaseClient.from('profiles').select('*').eq('id', data.user.id).single();
    if (profile && profile.full_name) {
      state.userName = profile.full_name;
    } else {
      state.userName = data.user.user_metadata?.full_name || email.split('@')[0];
    }
    
    handleLogin(trueRole); 
  } else {
    state.userName = email.split('@')[0]; // Fallback if no Supabase
    handleLogin(state.loginRole); 
  }
}

async function handleRegisterSubmit(e, role) {
  e.preventDefault();
  
  let nameInput = role === 'candidate' ? el('reg-name') : el('reg-company-name');
  let emailInput = role === 'candidate' ? el('reg-email') : el('reg-company-email');
  let passInput = role === 'candidate' ? el('reg-pass') : el('reg-company-pass');
  
  const name = nameInput ? nameInput.value : 'Usuario';
  const email = emailInput ? emailInput.value : '';
  const pass = passInput ? passInput.value : '';

  if (window.supabaseClient) {
    const { data, error } = await window.supabaseClient.auth.signUp({
      email, password: pass,
      options: { data: { full_name: name, role: role } }
    });
    if (error) {
      alert('Error al registrarse: ' + error.message);
      return;
    }
    state.userName = name;
  } else {
    state.userName = name;
  }
  
  handleLogin(role);
}

function handleLogin(role) {
  state.role = role;
  if (!state.userName) {
    state.userName = role === 'candidate' ? 'María López' : role === 'company' ? 'Startup Inclusiva' : 'Administrador';
  }
  localStorage.setItem('incluyet-session', JSON.stringify({ role: state.role, userName: state.userName }));
  if (role === 'candidate') navigate('candidate-home');
  else if (role === 'company') navigate('company-dashboard');
  else navigate('admin-panel');
}

async function handleLogout() { 
  if (window.supabaseClient) {
    await window.supabaseClient.auth.signOut();
  }
  localStorage.removeItem('incluyet-session');
  state.role = null; 
  state.userName = null; 
  navigate('landing'); 
}

function switchRegisterTab(tab) {
  ['candidate','company'].forEach(t => {
    el('tab-'+t).classList.toggle('active', t === tab);
    el('register-'+t+'-form').classList.toggle('d-none', t !== tab);
  });
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  const sidebar = el('app-sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open', state.sidebarOpen);
  } else {
    sidebar.classList.toggle('collapsed', !state.sidebarOpen);
  }
}

function buildSidebar() {
  const role = state.role;
  const userName = state.userName || 'Usuario';
  const roleLabel = role === 'candidate' ? 'Candidata/o' : role === 'company' ? 'Empresa' : 'Admin';

  el('sidebar-user-name').textContent = userName;
  el('sidebar-user-role').textContent = roleLabel;
  el('sidebar-user-avatar').textContent = userName.charAt(0).toUpperCase();

  const candidateItems = [
    { view:'candidate-home', label:'Inicio', icon:'bi-house' },
    { view:'job-search', label:'Buscar ofertas', icon:'bi-search' },
    { view:'profile', label:'Mi perfil', icon:'bi-person' },
    { view:'applications', label:'Mis postulaciones', icon:'bi-file-text' },
    { view:'messages', label:'Mensajes', icon:'bi-chat-square-text' },
    { view:'resources', label:'Recursos', icon:'bi-book' },
  ];
  const companyItems = [
    { view:'company-dashboard', label:'Dashboard', icon:'bi-bar-chart-line' },
    { view:'post-job', label:'Publicar oferta', icon:'bi-plus-lg' },
    { view:'company-applicants', label:'Postulantes', icon:'bi-people' },
    { view:'messages', label:'Mensajes', icon:'bi-chat-square-text' },
  ];
  const adminItems = [
    { view:'admin-panel', label:'Panel admin', icon:'bi-shield' },
  ];

  const items = role === 'candidate' ? candidateItems : role === 'company' ? companyItems : adminItems;
  const navId = role === 'candidate' ? 'sidebar-nav-candidate' : role === 'company' ? 'sidebar-nav-company' : 'sidebar-nav-admin';

  ['sidebar-nav-candidate','sidebar-nav-company','sidebar-nav-admin'].forEach(id => hide(id));
  show(navId);

  const nav = el(navId);
  nav.innerHTML = '<div class="sidebar-nav">' + items.map(item => `
    <button class="sidebar-nav-item ${state.view === item.view ? 'active' : ''}"
      onclick="navigate('${item.view}')" aria-current="${state.view === item.view ? 'page' : 'false'}">
      <i class="bi ${item.icon} fs-5"></i>
      <span>${item.label}</span>
      ${item.badge ? `<span class="sidebar-nav-badge">${item.badge}</span>` : ''}
    </button>`).join('') + '</div>';
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const APP_VIEWS = ['candidate-home','job-search','job-detail','profile','applications','messages','resources','company-dashboard','post-job','company-applicants','admin-panel'];
const PAGE_TITLES = {
  landing:'InclúyeT', login:'Iniciar sesión', register:'Crear cuenta',
  'candidate-home':'Inicio', 'job-search':'Buscar ofertas', 'job-detail':'Detalle de oferta',
  profile:'Mi perfil', applications:'Mis postulaciones', messages:'Mensajes',
  resources:'Recursos e inclusión', 'company-dashboard':'Dashboard',
  'post-job':'Publicar oferta', 'company-applicants':'Postulantes', 'admin-panel':'Panel de administración',
};

function navigate(view) {
  state.view = view;

  // Hide all sections
  ['view-landing','view-login','view-register','app-container'].forEach(hide);
  APP_VIEWS.forEach(v => hide('view-'+v));

  const isApp = state.role !== null && !['landing','login','register'].includes(view);

  if (view === 'landing') { show('view-landing'); renderLandingDynamic(); }
  else if (view === 'login') { show('view-login'); }
  else if (view === 'register') { show('view-register'); }
  else if (isApp) {
    show('app-container');
    show('view-'+view);
    buildSidebar();
    el('app-page-title').textContent = view === 'job-detail' ? state.selectedJob.title : PAGE_TITLES[view];
    renderAppView(view);
  } else {
    navigate('landing');
  }
  window.scrollTo(0,0);
  
  // A11y Focus Management
  setTimeout(() => {
    if (isApp) {
      const title = el('app-page-title');
      if (title) title.focus();
    } else {
      const firstHeading = document.querySelector(`#view-${view} h1`);
      if (firstHeading) {
        firstHeading.setAttribute('tabindex', '-1');
        firstHeading.focus();
      }
    }
  }, 50);
}

function renderAppView(view) {
  const renderers = {
    'candidate-home': renderCandidateHome,
    'job-search': renderJobSearch,
    'job-detail': renderJobDetail,
    'profile': renderProfile,
    'applications': renderApplications,
    'messages': renderMessages,
    'resources': renderResources,
    'company-dashboard': renderCompanyDashboard,
    'post-job': renderPostJob,
    'company-applicants': renderCompanyApplicants,
    'admin-panel': renderAdminPanel,
  };
  if (renderers[view]) renderers[view]();
}


window.viewJob = async function(id) {
  // Fetch from Supabase
  const { data: vacante, error } = await window.supabase.from('vacantes').select('*').eq('id', id).single();
  if (vacante) {
    state.selectedJob = {
      id: vacante.id,
      title: vacante.titulo,
      company: 'Empresa Inclusiva', // Mocked if no relation
      logo: 'EI',
      location: 'Remoto',
      type: vacante.modalidad,
      posted: 'Hoy',
      salary: 'No especificado',
      a11y: vacante.etiquetas_accesibilidad || [],
      tags: [],
      description: vacante.descripcion || '',
      requirements: ['Cumplir con el perfil']
    };
  } else {
    // Fallback if not in DB yet (for UI testing)
    state.selectedJob = JOBS.find(j => j.id === id) || JOBS[0] || {id: '10100000-0000-0000-0000-000000000101', title: 'Vacante de prueba', company: 'Prueba', a11y:[], tags:[], requirements:[], description:''};
  }

  // Verificar duplicados
  let yaPostulado = false;
  const { data: userData } = await window.supabase.auth.getUser();
  if (userData?.user) {
    const { data: postData } = await window.supabase.from('postulaciones')
      .select('id')
      .eq('candidato_id', userData.user.id)
      .eq('vacante_id', state.selectedJob.id)
      .single();
    if (postData) {
      yaPostulado = true;
    }
  }

  if (yaPostulado) {
    if (!state.appliedJobs.includes(state.selectedJob.id)) {
      state.appliedJobs.push(state.selectedJob.id);
    }
  } else {
    state.appliedJobs = state.appliedJobs.filter(jid => jid !== state.selectedJob.id);
  }

  navigate('job-detail');
};


// ─── Landing Dynamic ──────────────────────────────────────────────────────────
function renderLandingDynamic() {
  // A11y chips
  const chips = el('landing-a11y-chips');
  if (chips) chips.innerHTML = A11Y_FEATURES.map(f =>
    `<span class="a11y-filter-chip"><i class="bi ${f.icon}" aria-hidden="true"></i> ${f.label}</span>`).join('');

  // Features grid
  const features = el('features-grid');
  if (features) features.innerHTML = [
    { icon:'bi-universal-access', title:'100% Accesible', desc:'Interfaz compatible con lectores de pantalla, alto contraste, tipografía ajustable y navegación por teclado.', color:'rgba(26,54,148,0.1)', tc:'#1a3694' },
    { icon:'bi-shield-check', title:'Empresas verificadas', desc:'Solo publicamos empresas que han firmado nuestro compromiso de inclusión y tienen políticas reales.', color:'rgba(229,91,20,0.1)', tc:'#e55b14' },
    { icon:'bi-heart', title:'Apoyo continuo', desc:'Guías, talleres y asesoría para prepararte para la búsqueda de empleo y negociar ajustes razonables.', color:'#dcfce7', tc:'#166534' },
    { icon:'bi-funnel', title:'Filtros de accesibilidad', desc:'Busca por las características que necesitas: remoto, horario flexible, intérprete LSP, adaptaciones motoras y más.', color:'#f3e8ff', tc:'#7c3aed' },
    { icon:'bi-chat-square-text', title:'Comunicación directa', desc:'Habla con las empresas sin intermediarios. Coordina ajustes para entrevistas desde el primer mensaje.', color:'#ccfbf1', tc:'#0d9488' },
    { icon:'bi-graph-up', title:'Indicadores de inclusión', desc:'Las empresas publican sus métricas de diversidad para que puedas elegir con información real.', color:'#fef3c7', tc:'#d97706' },
  ].map(f => `
    <div class="col-md-4">
      <div class="feature-card h-100">
        <div class="feature-icon" style="background:${f.color};color:${f.tc};"><i class="bi ${f.icon}"></i></div>
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1rem;margin-bottom:8px;">${f.title}</h3>
        <p style="font-size:0.875rem;color:var(--muted-fg);line-height:1.6;margin:0;">${f.desc}</p>
      </div>
    </div>`).join('');

  // How it works
  const how = el('how-grid');
  if (how) how.innerHTML = [
    { num:'01', title:'Crea tu perfil', desc:'Registra tus habilidades y declara voluntariamente tu discapacidad.' },
    { num:'02', title:'Filtra por accesibilidad', desc:'Usa nuestros chips de accesibilidad para encontrar empleos ideales para ti.' },
    { num:'03', title:'Postúlate con confianza', desc:'Envía tu postulación a empresas que ya saben y valoran la diversidad.' },
    { num:'04', title:'Empieza a trabajar', desc:'Coordina tu incorporación con los ajustes razonables que necesitas.' },
  ].map(s => `
    <div class="col-6 col-md-3">
      <div class="how-step-num">${s.num}</div>
      <h3 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1rem;margin-bottom:8px;">${s.title}</h3>
      <p style="font-size:0.875rem;color:var(--muted-fg);">${s.desc}</p>
    </div>`).join('');
}

// ─── Candidate Home ───────────────────────────────────────────────────────────
function renderCandidateHome() {
  const featured = JOBS.filter(j => j.featured);
  const userName = state.userName || 'Usuario';
  el('view-candidate-home').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:24px;">
      <div class="greeting-card">
        <p style="color:rgba(255,255,255,0.7);font-size:0.875rem;margin-bottom:4px;">Hola de vuelta,</p>
        <h2 style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin-bottom:8px;">${userName}</h2>
        <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin-bottom:16px;">¡Qué bueno verte por aquí! Explora nuevas ofertas o revisa el estado de tus postulaciones.</p>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-accent-custom btn-sm d-flex align-items-center gap-2" onclick="navigate('job-search')"><i class="bi bi-search"></i> Buscar ofertas</button>
          <button class="btn" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:8px;font-size:0.875rem;font-weight:600;" onclick="navigate('applications')">Ver mis postulaciones</button>
        </div>
      </div>
      <div class="row g-3">
        ${[
          { label:'Postulaciones', value: APPS_DATA.length.toString(), icon:'bi-file-text', bg:'var(--secondary)', c:'var(--primary)' },
          { label:'En proceso', value: APPS_DATA.filter(a=>a.status!=='Descartado'&&a.status!=='Contratado').length.toString(), icon:'bi-clock', bg:'#fef3c7', c:'#92400e' },
          { label:'Entrevistas', value: APPS_DATA.filter(a=>a.status==='Entrevista').length.toString(), icon:'bi-people', bg:'#dbeafe', c:'#1e40af' },
          { label:'Contrataciones', value: APPS_DATA.filter(a=>a.status==='Contratado').length.toString(), icon:'bi-award', bg:'#dcfce7', c:'#166534' },
        ].map(s => `
          <div class="col-6 col-md-3">
            <div class="i-card-sm d-flex align-items-center gap-3">
              <div class="kpi-icon" style="background:${s.bg};color:${s.c};"><i class="bi ${s.icon}"></i></div>
              <div><p style="font-family:'Lexend',sans-serif;font-size:1.25rem;font-weight:700;margin:0;">${s.value}</p><p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">${s.label}</p></div>
            </div>
          </div>`).join('')}
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin:0;">Recomendadas para ti</h2>
          <button class="btn btn-ghost-primary btn-sm d-flex align-items-center gap-1" onclick="navigate('job-search')">Ver todas <i class="bi bi-chevron-right"></i></button>
        </div>
        <div class="row g-3">${featured.map(j => `<div class="col-md-4">${jobCard(j)}</div>`).join('')}</div>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin:0;">Últimas postulaciones</h2>
          <button class="btn btn-ghost-primary btn-sm d-flex align-items-center gap-1" onclick="navigate('applications')">Ver todas <i class="bi bi-chevron-right"></i></button>
        </div>
        <div class="i-card-sm" style="padding:0;overflow:hidden;">
          ${APPS_DATA.length === 0 ? '<p class="p-3 mb-0" style="font-size:0.875rem;color:var(--muted-fg);">Aún no te has postulado a ninguna oferta.</p>' : ''}
          ${APPS_DATA.slice(0,3).map((a,i) => `
            <div class="d-flex align-items-center gap-3 px-4 py-3 ${i<2?'border-bottom':''}">
              ${logoBadge(a.company.substring(0,2).toUpperCase(),'sm')}
              <div class="flex-grow-1 min-w-0"><p style="font-weight:600;font-size:0.875rem;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.job}</p><p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">${a.company}</p></div>
              ${statusBadge(a.status,a.color)}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ─── Job Search ───────────────────────────────────────────────────────────────
function renderJobSearch() {
  el('view-job-search').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="d-flex gap-3">
        <div class="flex-grow-1 position-relative">
          <i class="bi bi-search position-absolute" style="left:14px;top:50%;transform:translateY(-50%);color:var(--muted-fg);pointer-events:none;"></i>
          <input type="search" id="job-search-input" placeholder="Buscar por puesto, empresa o habilidad..." aria-label="Buscar ofertas"
            value="${state.searchQuery}"
            oninput="state.searchQuery=this.value;renderJobResults()"
            style="width:100%;height:48px;padding:0 1rem 0 2.5rem;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--foreground);font-size:1rem;outline:none;">
        </div>
        <select onchange="state.sortBy=this.value;renderJobResults()" style="height:48px;padding:0 2.5rem 0 1rem;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--foreground);font-size:0.875rem;font-weight:600;outline:none;appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%235a6480' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 12px center;cursor:pointer;">
          <option value="recent">Más recientes</option><option value="salary">Mayor salario</option><option value="match">Mejor match</option>
        </select>
      </div>
      <div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-funnel" style="color:var(--muted-fg);"></i>
          <span style="font-size:0.875rem;font-weight:600;">Filtrar por accesibilidad</span>
          <button id="clear-filters-btn" onclick="clearFilters()" class="btn-link-custom" style="font-size:0.75rem;${state.activeFilters.length?'':'display:none;'}">Limpiar filtros</button>
        </div>
        <div class="d-flex flex-wrap gap-2" role="group" aria-label="Filtros de accesibilidad">
          ${A11Y_FEATURES.map(f => `
            <button class="filter-btn ${state.activeFilters.includes(f.id)?'active':''}"
              aria-pressed="${state.activeFilters.includes(f.id)}"
              onclick="toggleFilter('${f.id}')">
              <i class="bi ${f.icon}" aria-hidden="true"></i> ${f.label}
              ${state.activeFilters.includes(f.id) ? '<i class="bi bi-check"></i>' : ''}
            </button>`).join('')}
        </div>
      </div>
      <div id="job-results-header"></div>
      <div id="job-results-grid"></div>
    </div>`;
  renderJobResults();
}

function toggleFilter(id) {
  if (state.activeFilters.includes(id)) state.activeFilters = state.activeFilters.filter(x => x !== id);
  else state.activeFilters.push(id);
  renderJobSearch();
}
function clearFilters() { state.activeFilters = []; renderJobSearch(); }

function renderJobResults() {
  const q = (el('job-search-input') || {value:state.searchQuery}).value || state.searchQuery;
  const filtered = JOBS.filter(j => {
    const matchText = !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase());
    const matchFilters = state.activeFilters.length === 0 || state.activeFilters.every(f => j.a11y.includes(f));
    // Validación cruzada excluyente (ajustes razonables obligatorios del postulante vs vacante)
    const matchMandatoryA11y = state.selectedA11y.length === 0 || state.selectedA11y.every(f => j.a11y.includes(f));
    return matchText && matchFilters && matchMandatoryA11y;
  });
  
  if (state.sortBy === 'match') {
    // Algoritmo de priorización por mérito técnico (simulado)
    filtered.sort((a, b) => b.tags.length - a.tags.length);
  } else if (state.sortBy === 'salary') {
    // Ordenar por salario (simulado)
    filtered.sort((a, b) => b.salary.localeCompare(a.salary));
  }
  const hdr = el('job-results-header');
  const grid = el('job-results-grid');
  if (!hdr || !grid) return;
  hdr.innerHTML = `<p style="font-size:0.875rem;color:var(--muted-fg);"><strong style="color:var(--foreground);">${filtered.length}</strong> ofertas encontradas${state.activeFilters.length ? ` con ${state.activeFilters.length} filtro${state.activeFilters.length>1?'s':''} de accesibilidad` : ''}</p>`;
  if (filtered.length) {
    grid.innerHTML = `<div class="row g-3">${filtered.map(j => `<div class="col-md-6">${jobCard(j)}</div>`).join('')}</div>`;
  } else {
    grid.innerHTML = `<div class="text-center py-5" style="color:var(--muted-fg);"><i class="bi bi-search" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:16px;"></i><p style="font-size:1.125rem;font-weight:600;margin-bottom:4px;">Sin resultados</p><p style="font-size:0.875rem;">Intenta cambiar los filtros o el término de búsqueda</p><button class="btn btn-secondary-custom btn-sm mt-3" onclick="state.searchQuery='';clearFilters()">Limpiar búsqueda</button></div>`;
  }
}

// ─── Job Detail ────────────────────────────────────────────────────────────────
function renderJobDetail() {
  const job = state.selectedJob;
  const a11yAll = job.a11y.map(id => {
    const f = A11Y_FEATURES.find(x => x.id === id);
    return f ? `<span style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;background:var(--card);border:1px solid rgba(26,54,148,0.3);font-size:0.875rem;font-weight:600;color:var(--primary);"><i class="bi ${f.icon}" aria-hidden="true"></i>${f.label}</span>` : '';
  }).join('');
  el('view-job-detail').innerHTML = `
    <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <button onclick="navigate('job-search')" style="background:none;border:none;color:var(--muted-fg);cursor:pointer;display:flex;align-items:center;gap:8px;font-size:0.875rem;padding:0;" onmouseover="this.style.color=''var(--foreground)''">
        <i class="bi bi-chevron-left"></i> Volver a resultados
      </button>
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        ${job.featured ? '<div style="height:6px;background:var(--accent);"></div>' : ''}
        <div style="padding:28px;">
          <div class="d-flex align-items-start gap-4 mb-5">
            ${logoBadge(job.logo,'lg')}
            <div class="flex-grow-1">
              <h1 style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin-bottom:4px;">${job.title}</h1>
              <p style="color:var(--muted-fg);font-weight:600;margin-bottom:8px;">${job.company}</p>
              <div class="d-flex flex-wrap gap-4" style="font-size:0.875rem;color:var(--muted-fg);">
                <span><i class="bi bi-geo-alt me-1"></i>${job.location}</span>
                <span><i class="bi bi-briefcase me-1"></i>${job.type}</span>
                <span><i class="bi bi-clock me-1"></i>${job.posted}</span>
              </div>
            </div>
            <div class="text-end d-none d-md-block">
              <p style="font-family:'Lexend',sans-serif;font-size:1.25rem;font-weight:700;color:var(--primary);margin:0;">${job.salary}</p>
              <p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">por mes</p>
            </div>
          </div>
          <div style="background:rgba(228,233,247,0.5);border:1px solid rgba(26,54,148,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
            <h2 style="font-size:0.875rem;font-weight:700;color:var(--primary);margin-bottom:12px;display:flex;align-items:center;gap:8px;"><i class="bi bi-universal-access"></i> Características de accesibilidad</h2>
            <div class="d-flex flex-wrap gap-2">${a11yAll}</div>
          </div>
          <div class="row g-4">
            <div class="col-md-8">
              <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin-bottom:12px;">Descripción del puesto</h2>
              <p style="color:var(--muted-fg);line-height:1.7;margin-bottom:24px;">${job.description}</p>
              <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin-bottom:12px;">Requisitos</h2>
              <ul style="list-style:none;padding:0;margin-bottom:24px;display:flex;flex-direction:column;gap:8px;">
                ${job.requirements.map(r => `<li style="display:flex;align-items:flex-start;gap:10px;font-size:0.875rem;color:var(--muted-fg);"><i class="bi bi-check-circle-fill" style="color:#16a34a;margin-top:2px;flex-shrink:0;"></i>${r}</li>`).join('')}
              </ul>
              <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin-bottom:12px;">Habilidades requeridas</h2>
              <div class="d-flex flex-wrap gap-2">${job.tags.map(t => `<span style="padding:6px 12px;border-radius:8px;background:var(--muted-bg);border:1px solid var(--border);font-size:0.875rem;font-weight:600;">${t}</span>`).join('')}</div>
            </div>
            <div class="col-md-4 d-flex flex-column gap-3">
              <div id="apply-section">
                ${state.appliedJobs.includes(job.id) ? 
                  `<button class="btn btn-secondary-custom w-100 d-flex align-items-center justify-content-center gap-2" style="height:48px;font-size:0.875rem;opacity:0.7;" disabled>Ya cuentas con una postulación activa para esta vacante</button>` 
                  : 
                  `<button class="btn btn-accent-custom w-100 d-flex align-items-center justify-content-center gap-2" style="height:48px;font-size:1rem;" onclick="openApplyModal()">
                    <i class="bi bi-send"></i> Postularme ahora
                  </button>`
                }
              </div>
              <button class="btn btn-secondary-custom w-100 d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-heart"></i> Guardar oferta
              </button>
              <div style="background:var(--muted-bg);border-radius:12px;padding:16px;font-size:0.875rem;display:flex;flex-direction:column;gap:8px;">
                <p style="font-weight:600;margin:0;">Empresa comprometida con:</p>
                ${['Ajustes razonables','Equidad salarial','Cultura inclusiva'].map(c => `<p style="display:flex;align-items:center;gap:8px;color:var(--muted-fg);margin:0;"><i class="bi bi-check" style="color:#16a34a;font-weight:700;"></i>${c}</p>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}


let applyStep = 1;
window.applyState = { cvFile: null, reqA11y: 'yes' };

window.openApplyModal = function() {
  applyStep = 1;
  document.body.style.overflow = 'hidden';
  renderApplyModal();
};

window.closeApplyModal = function() {
  el('modal-root').innerHTML = '';
  document.body.style.overflow = '';
  el('app-page-title')?.focus();
};

window.renderApplyModal = async function() {
  const root = el('modal-root');
  let bodyContent = '';
  let footerContent = '';
  let title = 'Postulación: Paso ' + applyStep + ' de 3';
  
  // Paso 1: Perfil y Consentimiento
  if (applyStep === 1) {
    title = '1. Perfil y Consentimiento';
    const { data: userData } = await window.supabase.auth.getUser();
    const email = userData?.user?.email || 'usuario@correo.com';
    const userName = userData?.user?.user_metadata?.full_name || state.userName || 'Usuario';
    
    bodyContent = `
      <p style="color:var(--muted-fg);margin-bottom:16px;">Verifica tu información antes de enviarla a la empresa.</p>
      <div class="i-card-sm" style="background:var(--muted-bg);margin-bottom:16px;">
        <p style="font-weight:700;margin-bottom:4px;">${userName}</p>
        <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:8px;">${email}</p>
      </div>
      <div>
        <label style="display:flex;align-items:start;gap:8px;font-size:0.875rem;cursor:pointer;">
          <input type="checkbox" id="consent-a11y" style="margin-top:4px;" ${window.applyState.consent ? 'checked' : ''} onchange="window.applyState.consent = this.checked">
          <span>Doy mi consentimiento para compartir mis requerimientos de accesibilidad con la empresa. <span style="color:var(--destructive);">*</span></span>
        </label>
        <div id="consent-error" style="color:var(--destructive);font-size:0.75rem;margin-top:4px;display:none;">Debes aceptar el consentimiento para continuar.</div>
      </div>
    `;
    footerContent = `
      <button onclick="closeApplyModal()" class="btn btn-secondary-custom">Cancelar</button>
      <button onclick="if(el('consent-a11y').checked) { applyStep=2; renderApplyModal(); } else { el('consent-error').style.display='block'; }" class="btn btn-primary-custom">Continuar <i class="bi bi-chevron-right"></i></button>
    `;
  } 
  // Paso 2: Ajustes y Carga de CV
  else if (applyStep === 2) {
    title = '2. CV y Ajustes Razonables';
    bodyContent = `
      <p style="color:var(--muted-fg);margin-bottom:16px;">Sube tu currículum y confirma tus adaptaciones.</p>
      <div class="mb-4">
        <label class="i-label" for="cv-upload">Currículum Vitae (.pdf o .docx, máx 5MB) <span style="color:var(--destructive);">*</span></label>
        <input type="file" id="cv-upload" class="i-input" accept=".pdf,.docx" onchange="validateCV()" />
        <div id="cv-error" style="color:var(--destructive);font-size:0.75rem;margin-top:4px;font-weight:600;" aria-live="polite"></div>
      </div>
      <div class="mb-3">
        <label class="i-label">¿Requiere adaptaciones físicas o tecnológicas?</label>
        <div class="d-flex flex-column gap-2">
          <label style="display:flex;align-items:center;gap:8px;font-size:0.875rem;cursor:pointer;">
            <input type="radio" name="reqA11y" value="yes" ${window.applyState.reqA11y === 'yes' ? 'checked' : ''} onchange="window.applyState.reqA11y='yes'; el('a11y-options').style.opacity='1'; Array.from(el('a11y-options').querySelectorAll('input')).forEach(i=>i.disabled=false);">
            Sí, requiero adaptaciones.
          </label>
          <div id="a11y-options" style="margin-left:24px; display:flex; flex-direction:column; gap:8px; opacity:${window.applyState.reqA11y === 'yes' ? '1' : '0.5'};">
            <label style="font-size:0.875rem;"><input type="checkbox" class="a11y-chk" value="Lector de pantalla" ${window.applyState.reqA11y === 'no' ? 'disabled' : ''}> Lector de pantalla</label>
            <label style="font-size:0.875rem;"><input type="checkbox" class="a11y-chk" value="Intérprete LSP" ${window.applyState.reqA11y === 'no' ? 'disabled' : ''}> Intérprete LSP</label>
            <label style="font-size:0.875rem;"><input type="checkbox" class="a11y-chk" value="Rampa/Ascensor" ${window.applyState.reqA11y === 'no' ? 'disabled' : ''}> Rampa o ascensor</label>
          </div>
          <label style="display:flex;align-items:center;gap:8px;font-size:0.875rem;cursor:pointer;">
            <input type="radio" name="reqA11y" value="no" ${window.applyState.reqA11y === 'no' ? 'checked' : ''} onchange="window.applyState.reqA11y='no'; el('a11y-options').style.opacity='0.5'; Array.from(el('a11y-options').querySelectorAll('input')).forEach(i=>{i.checked=false; i.disabled=true;});">
            No requiero ajustes adicionales.
          </label>
        </div>
      </div>
    `;
    footerContent = `
      <button onclick="applyStep=1;renderApplyModal()" class="btn btn-secondary-custom"><i class="bi bi-chevron-left"></i> Atrás</button>
      <button onclick="if(validateCV(true)){ saveStep2(); applyStep=3; renderApplyModal(); }" class="btn btn-primary-custom">Continuar <i class="bi bi-chevron-right"></i></button>
    `;
    
    setTimeout(() => {
      if (window.applyState.cvFile && el('cv-upload')) {
         // File input value can't be set for security reasons, we could show a label "Archivo seleccionado: X"
         el('cv-error').textContent = 'Archivo pre-seleccionado: ' + window.applyState.cvFile.name;
         el('cv-error').style.color = 'var(--primary)';
      }
    }, 50);
  } 
  // Paso 3: Confirmación y Envío
  else if (applyStep === 3) {
    title = '3. Confirmar Postulación';
    bodyContent = `
      <div class="text-center py-3">
        <i class="bi bi-send" style="font-size:3rem;color:var(--primary);margin-bottom:16px;display:block;"></i>
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.25rem;margin-bottom:8px;">¿Todo listo?</h3>
        <p style="color:var(--muted-fg);font-size:0.875rem;">Estás a punto de postularte a la oferta <strong>${state.selectedJob.title}</strong> en <strong>${state.selectedJob.company}</strong>.</p>
        <div id="apply-loading" style="display:none; margin-top:16px;">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Enviando...</span></div>
          <p style="font-size:0.875rem; margin-top:8px;">Enviando postulación...</p>
        </div>
        <div id="apply-success-msg" style="display:none; color:#16a34a; font-weight:bold; margin-top:16px;" aria-live="polite"></div>
      </div>
    `;
    footerContent = `
      <button id="btn-back-3" onclick="applyStep=2;renderApplyModal()" class="btn btn-secondary-custom"><i class="bi bi-chevron-left"></i> Atrás</button>
      <button id="btn-submit-3" onclick="finishApplication()" class="btn btn-accent-custom"><i class="bi bi-check-circle"></i> Confirmar y Enviar</button>
    `;
  }

  root.innerHTML = `
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onclick="if(event.target===this)closeApplyModal()">
      <div class="modal-content" style="max-width:500px;">
        <div class="modal-header">
          <h2 id="modal-title" style="font-family:'Lexend',sans-serif;font-size:1.125rem;margin:0;font-weight:700;">${title}</h2>
          <button onclick="closeApplyModal()" class="modal-close-btn" aria-label="Cerrar modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">${bodyContent}</div>
        <div class="modal-footer">${footerContent}</div>
      </div>
    </div>
  `;
  
  // Trap Focus
  setTimeout(() => {
    const focusable = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) {
      focusable[0].focus();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      root.onkeydown = function(e) {
        if (e.key === 'Escape') {
          closeApplyModal();
          return;
        }
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
          } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        }
      };
    }
  }, 50);
};

window.saveStep2 = function() {
  const fileInput = el('cv-upload');
  if (fileInput && fileInput.files[0]) {
    window.applyState.cvFile = fileInput.files[0];
  }
  const chks = document.querySelectorAll('.a11y-chk:checked');
  window.applyState.ajustes = Array.from(chks).map(c => c.value);
};

window.validateCV = function(showErrorIfEmpty = false) {
  const fileInput = el('cv-upload');
  const errorEl = el('cv-error');
  if (!fileInput || !errorEl) return false;
  
  const file = fileInput.files[0] || window.applyState.cvFile;
  if (!file) {
    if (showErrorIfEmpty) {
       errorEl.textContent = 'Por favor, selecciona un archivo (PDF o DOCX).';
       errorEl.style.color = 'var(--destructive)';
    }
    return false;
  }
  
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext !== 'pdf' && ext !== 'docx') {
    errorEl.textContent = 'Error: Solo se permiten archivos PDF o DOCX.';
    errorEl.style.color = 'var(--destructive)';
    if (fileInput.files[0]) fileInput.value = ''; // Reset
    window.applyState.cvFile = null;
    return false;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    errorEl.textContent = 'Error: El archivo excede el tamaño máximo permitido de 5 MB.';
    errorEl.style.color = 'var(--destructive)';
    if (fileInput.files[0]) fileInput.value = ''; // Reset
    window.applyState.cvFile = null;
    return false;
  }
  
  errorEl.textContent = '';
  return true;
};

window.finishApplication = async function() {
  el('btn-submit-3').disabled = true;
  el('btn-back-3').disabled = true;
  el('apply-loading').style.display = 'block';

  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData?.user) throw new Error("Usuario no autenticado");
    const uid = userData.user.id;

    // 1. Subir CV al Storage
    const file = window.applyState.cvFile;
    const fileName = `${uid}/${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await window.supabase.storage
      .from('cv-postulaciones')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = window.supabase.storage
      .from('cv-postulaciones')
      .getPublicUrl(fileName);

    // 2. Insertar en postulaciones
    const ajustes = window.applyState.reqA11y === 'yes' ? window.applyState.ajustes : [];
    
    const { error: insertError } = await window.supabase.from('postulaciones')
      .insert({
        candidato_id: uid,
        vacante_id: state.selectedJob.id,
        ajustes_razonables: ajustes,
        cv_url: publicUrlData.publicUrl,
        estado: 'Enviada'
      });
      
    if (insertError) {
      if (insertError.code === '23505') throw new Error("Ya cuentas con una postulación activa para esta vacante");
      throw insertError;
    }

    // Éxito
    state.appliedJobs.push(state.selectedJob.id);
    el('apply-loading').style.display = 'none';
    const msg = el('apply-success-msg');
    msg.style.display = 'block';
    msg.textContent = '¡Postulación enviada con éxito!';
    
    setTimeout(() => {
      closeApplyModal();
      renderJobDetail(); // Re-render to show "Ya te has postulado"
    }, 1500);

  } catch (err) {
    el('apply-loading').style.display = 'none';
    el('btn-submit-3').disabled = false;
    el('btn-back-3').disabled = false;
    alert('Error al postular: ' + err.message);
  }
};


// ─── Profile ──────────────────────────────────────────────────────────────────
function renderProfile() {
  const userName = state.userName || 'Usuario';
  el('view-profile').innerHTML = `
    <div style="max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        <div class="profile-banner"></div>
        <div style="padding:0 28px 28px;">
          <div class="d-flex align-items-end justify-content-between" style="margin-top:-40px;margin-bottom:16px;">
            <div style="width:80px;height:80px;border-radius:16px;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;border:4px solid var(--card);box-shadow:0 2px 8px rgba(0,0,0,0.1);font-family:'Lexend',sans-serif;">${userName.charAt(0).toUpperCase()}</div>
            <button id="edit-profile-btn" onclick="toggleProfileEdit()" class="btn btn-secondary-custom btn-sm d-flex align-items-center gap-2"><i class="bi bi-pencil"></i> Editar perfil</button>
          </div>
          <div id="profile-view-mode">
            <h2 style="font-family:'Lexend',sans-serif;font-size:1.25rem;font-weight:700;margin-bottom:2px;">${userName}</h2>
            <p style="color:var(--muted-fg);font-size:0.875rem;margin-bottom:4px;">${state.profileTitle}</p>
            <p style="display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--muted-fg);margin-bottom:12px;"><i class="bi bi-geo-alt"></i>${state.profileCity}</p>
            <p style="font-size:0.875rem;color:var(--muted-fg);line-height:1.7;margin:0;">${state.profileBio}</p>
          </div>
          <div id="profile-edit-mode" class="d-none">
            <div class="row g-3 mb-3"><div class="col-6"><label class="i-label">Nombre completo</label><input type="text" id="prof-name" class="i-input" value="${userName}"/></div><div class="col-6"><label class="i-label">Título profesional</label><input type="text" id="prof-title" class="i-input" value="${state.profileTitle}"/></div></div>
            <div class="mb-3"><label class="i-label">Ciudad</label><input type="text" id="prof-city" class="i-input" value="${state.profileCity}"/></div>
            <div class="mb-3"><label class="i-label">Sobre mí</label><textarea id="prof-bio" class="i-input" rows="3">${state.profileBio}</textarea></div>
            <button onclick="saveProfile()" class="btn btn-primary-custom d-flex align-items-center gap-2"><i class="bi bi-check"></i> Guardar cambios</button>
          </div>
        </div>
      </div>
      <div class="i-card-sm" style="border-color:rgba(26,54,148,0.2);">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px;"><i class="bi bi-shield" style="color:var(--primary);"></i> Declaración de discapacidad</h3>
        <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:16px;">Esta información es completamente voluntaria, confidencial y protegida.</p>
        <div class="mb-3"><label class="i-label">Tipo de discapacidad</label>
          <select class="i-input"><option value="motriz" selected>Motriz</option><option value="visual">Visual / Baja visión</option><option value="auditiva">Auditiva / Hipoacusia</option><option value="intelectual">Intelectual</option><option value="psicosocial">Psicosocial</option><option value="multiple">Múltiple</option></select>
        </div>
        <label class="d-flex align-items-center gap-3" style="cursor:pointer;">
          <label class="toggle-switch"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <span style="font-size:0.875rem;font-weight:600;">Compartir con empresas al postularme</span>
        </label>
      </div>
      <div class="i-card-sm">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Habilidades</h3>
        <div class="d-flex flex-wrap gap-2">
          <p style="font-size:0.875rem;color:var(--muted-fg);">Aún no has añadido habilidades.</p>
          <button class="border-dashed-btn">+ Añadir</button>
        </div>
      </div>
      <div class="i-card-sm">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Documentos</h3>
        <div class="d-flex flex-column gap-2">
          <p style="font-size:0.875rem;color:var(--muted-fg);">No hay documentos subidos.</p>
          <button class="btn btn-secondary-custom btn-sm d-flex align-items-center gap-2 mt-1" style="width:fit-content;"><i class="bi bi-plus-lg"></i> Subir documento</button>
        </div>
      </div>
    </div>`;
}

function saveProfile() {
  state.userName = el('prof-name').value;
  state.profileTitle = el('prof-title').value;
  state.profileCity = el('prof-city').value;
  state.profileBio = el('prof-bio').value;
  
  // Actualizar también en el menú lateral si existe
  const sidebarName = el('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = state.userName;
  
  state.profileEditing = false;
  renderProfile();
}

function toggleProfileEdit() {
  state.profileEditing = !state.profileEditing;
  el('profile-view-mode').classList.toggle('d-none', state.profileEditing);
  el('profile-edit-mode').classList.toggle('d-none', !state.profileEditing);
  el('edit-profile-btn').innerHTML = state.profileEditing ? '<i class="bi bi-x"></i> Cancelar' : '<i class="bi bi-pencil"></i> Editar perfil';
}

// ─── Applications ─────────────────────────────────────────────────────────────
function renderApplications() {
  const statuses = ['all','En revisión','Entrevista programada','Contratado','No seleccionado','Postulado'];
  const summary = [
    { label:'Total', count: APPS_DATA.length, bg:'var(--secondary)', c:'var(--secondary-fg)' },
    { label:'Contratado', count: APPS_DATA.filter(a=>a.status==='Contratado').length, bg:'#dcfce7', c:'#166534' },
    { label:'Entrevista', count: APPS_DATA.filter(a=>a.status==='Entrevista programada'||a.status==='Entrevista').length, bg:'#dbeafe', c:'#1e40af' },
    { label:'En revisión', count: APPS_DATA.filter(a=>a.status==='En revisión'||a.status==='Postulado').length, bg:'#fef3c7', c:'#92400e' },
    { label:'Descartado', count: APPS_DATA.filter(a=>a.status==='No seleccionado'||a.status==='Descartado').length, bg:'#fee2e2', c:'#991b1b' },
  ];
  const filtered = state.appFilter === 'all' ? APPS_DATA : APPS_DATA.filter(a => a.status === state.appFilter);

  el('view-applications').innerHTML = `
    <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="row g-2">
        ${summary.map(s => `<div class="col"><div style="border-radius:12px;padding:12px 16px;text-align:center;background:${s.bg};color:${s.c};"><p style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin:0;">${s.count}</p><p style="font-size:0.75rem;font-weight:600;margin:0;">${s.label}</p></div></div>`).join('')}
      </div>
      <div class="d-flex gap-2 overflow-x-auto pb-1" role="tablist">
        ${statuses.map(s => `<button class="tab-btn ${state.appFilter===s?'active':''}" role="tab" aria-selected="${state.appFilter===s}" onclick="setAppFilter('${s}')">${s==='all'?'Todas':s}</button>`).join('')}
      </div>
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        <div class="overflow-x-auto">
          <table class="i-table" aria-label="Mis postulaciones">
            <thead><tr><th>Puesto</th><th>Empresa</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              ${filtered.map(a => `
                <tr>
                  <td style="font-weight:600;">${a.job}</td>
                  <td style="color:var(--muted-fg);">${a.company}</td>
                  <td style="color:var(--muted-fg);">${a.date}</td>
                  <td>${statusBadge(a.status,a.color)}</td>
                  <td><button class="btn btn-ghost-primary btn-sm" onclick="viewJob(1)">Ver oferta</button></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}
function setAppFilter(f) { state.appFilter = f; renderApplications(); }

// ─── Messages ─────────────────────────────────────────────────────────────────
function renderMessages() {
  const threads = state.msgThreads;
  if (!threads || threads.length === 0) {
    el('view-messages').innerHTML = `
      <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
        <div class="i-card-sm text-center py-5">
          <i class="bi bi-chat-square-text" style="font-size:3rem;color:var(--border);margin-bottom:16px;"></i>
          <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:8px;">Bandeja de entrada vacía</h3>
          <p style="color:var(--muted-fg);font-size:0.875rem;margin:0;">Aún no tienes mensajes nuevos de las empresas.</p>
        </div>
      </div>`;
    return;
  }
  
  const current = threads[state.activeMsg];
  el('view-messages').innerHTML = `
    <div class="messages-view">
      <div class="msg-sidebar">
        <div style="padding:16px;border-bottom:1px solid var(--border);"><h2 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;font-size:1rem;">Mensajes</h2></div>
        <div class="msg-list">
          ${threads.map((m,i) => `
            <button class="msg-item ${i===state.activeMsg?'active':''}" onclick="selectMsg(${i})">
              <div class="msg-avatar" style="background:${LOGO_COLORS[m.initials]||'#1a3694'}">${m.initials}</div>
              <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <p style="font-size:0.875rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;">${m.from}</p>
                  <span style="font-size:0.7rem;color:var(--muted-fg);flex-shrink:0;">${m.time}</span>
                </div>
                <p style="font-size:0.75rem;color:var(--muted-fg);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.preview}</p>
              </div>
              ${m.unread ? `<span style="width:20px;height:20px;background:var(--accent);color:white;font-size:0.7rem;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${m.unread}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>
      <div class="msg-chat">
        <div style="height:64px;border-bottom:1px solid var(--border);padding:0 20px;display:flex;align-items:center;gap:12px;flex-shrink:0;">
          <div class="msg-avatar" style="width:36px;height:36px;font-size:0.7rem;background:${LOGO_COLORS[current.initials]||'#1a3694'}">${current.initials}</div>
          <div><p style="font-weight:600;font-size:0.875rem;margin:0;">${current.from}</p><p style="font-size:0.75rem;color:#16a34a;margin:0;">En línea</p></div>
        </div>
        <div class="chat-messages" id="chat-messages-area">
          ${current.thread.map(m => `
            <div style="display:flex;justify-content:${m.mine?'flex-end':'flex-start'};">
              <div class="chat-bubble ${m.mine?'chat-bubble-mine':'chat-bubble-other'}">
                <p style="margin:0;">${m.text}</p>
                <p style="font-size:0.7rem;margin:4px 0 0;opacity:0.7;">${m.time}</p>
              </div>
            </div>`).join('')}
        </div>
        <div style="padding:16px;border-top:1px solid var(--border);display:flex;gap:12px;flex-shrink:0;">
          <input id="chat-input" type="text" placeholder="Escribe un mensaje..." aria-label="Mensaje nuevo"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg();}"
            style="flex:1;height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--border);background:var(--input-bg);color:var(--foreground);font-size:1rem;outline:none;">
          <button onclick="sendMsg()" class="btn btn-primary-custom d-flex align-items-center gap-1" aria-label="Enviar"><i class="bi bi-send"></i></button>
        </div>
      </div>
    </div>`;
  scrollChatToBottom();
}
function selectMsg(i) { state.activeMsg = i; renderMessages(); }
function sendMsg() {
  const input = el('chat-input');
  if (!input || !input.value.trim()) return;
  state.msgThreads[state.activeMsg].thread.push({ mine:true, text:input.value.trim(), time:'Ahora' });
  input.value = '';
  renderMessages();
}
function scrollChatToBottom() {
  const area = el('chat-messages-area');
  if (area) setTimeout(() => { area.scrollTop = area.scrollHeight; }, 50);
}

// ─── Resources ────────────────────────────────────────────────────────────────
function renderResources() {
  const cats = ['Todos','Consejos','Legal','Guía práctica','Tecnología'];
  const resources = [
    { id:1, title:'Cómo preparar tu CV inclusivo', cat:'Consejos', time:'5 min', icon:'bi-file-earmark-text', desc:'Aprende a destacar tus fortalezas y habilidades de manera efectiva en tu currículum.' },
    { id:2, title:'Derechos laborales de personas con discapacidad en Perú', cat:'Legal', time:'8 min', icon:'bi-bank', desc:'Conoce la Ley General de la Persona con Discapacidad (Ley 29973) y tus derechos en el ámbito laboral.' },
    { id:3, title:'Cómo solicitar ajustes razonables en el trabajo', cat:'Guía práctica', time:'6 min', icon:'bi-tools', desc:'Guía paso a paso para comunicar tus necesidades de accesibilidad con tu empleador.' },
    { id:4, title:'Entrevistas: consejos para personas con discapacidad', cat:'Consejos', time:'7 min', icon:'bi-chat-square-text', desc:'Estrategias para comunicar tu discapacidad y brillar en las entrevistas de trabajo.' },
    { id:5, title:'Herramientas de accesibilidad digital para el trabajo', cat:'Tecnología', time:'10 min', icon:'bi-laptop', desc:'Software, extensiones y configuraciones que pueden facilitar tu trabajo diario.' },
    { id:6, title:'Empresas comprometidas con la inclusión: qué buscar', cat:'Guía práctica', time:'5 min', icon:'bi-building', desc:'Señales que indican si una empresa realmente tiene cultura de inclusión.' },
  ];
  const filtered = state.resourceCategory === 'Todos' ? resources : resources.filter(r => r.cat === state.resourceCategory);

  el('view-resources').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="i-card-sm" style="border-color:rgba(26,54,148,0.2);background:var(--secondary);">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="kpi-icon" style="background:var(--primary);color:white;"><i class="bi bi-book"></i></div>
          <h1 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;font-size:1.25rem;">Recursos e inclusión</h1>
        </div>
        <p style="color:var(--muted-fg);margin:0;max-width:600px;">Guías, artículos y herramientas para ayudarte en tu búsqueda de empleo y conocer tus derechos laborales.</p>
      </div>
      <div class="d-flex flex-wrap gap-2" role="tablist">
        ${cats.map(c => `<button class="tab-btn ${state.resourceCategory===c?'active':''}" role="tab" aria-selected="${state.resourceCategory===c}" onclick="setResourceCat('${c}')">${c}</button>`).join('')}
      </div>
      <div class="row g-3">
        ${filtered.map(r => `
          <div class="col-md-4">
            <div class="resource-card">
              <div><i class="bi ${r.icon} fs-3" aria-hidden="true"></i></div>
              <div><span style="font-size:0.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.05em;">${r.cat}</span><h3 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:0.875rem;margin:4px 0 0;line-height:1.4;">${r.title}</h3></div>
              <p style="font-size:0.875rem;color:var(--muted-fg);line-height:1.6;flex:1;margin:0;">${r.desc}</p>
              <div class="d-flex align-items-center justify-content-between mt-auto pt-2">
                <span style="font-size:0.75rem;color:var(--muted-fg);display:flex;align-items:center;gap:4px;"><i class="bi bi-clock"></i>${r.time} de lectura</span>
                <button class="btn btn-ghost-primary btn-sm d-flex align-items-center gap-1">Leer <i class="bi bi-chevron-right"></i></button>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}
function setResourceCat(c) { state.resourceCategory = c; renderResources(); }

// ─── Company Dashboard ────────────────────────────────────────────────────────

window.renderCompanyDashboard = function() {
  const userName = state.userName || 'Usuario';
  el('view-company-dashboard').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="greeting-card">
        <p style="color:rgba(255,255,255,0.7);font-size:0.875rem;margin:0;">Panel de empresa</p>
        <h2 style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin:4px 0;">${userName}</h2>
      </div>
      
      <div class="i-card-sm">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Postulantes en tiempo real (Realtime)</h3>
        <div id="realtime-postulaciones-list" class="d-flex flex-column gap-2">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
      </div>
    </div>`;

  loadRealtimePostulaciones();
};

window.loadRealtimePostulaciones = async function() {
  const listEl = el('realtime-postulaciones-list');
  
  const renderItem = (p) => `
    <div class="d-flex align-items-center gap-3 p-3 border rounded" id="post-${p.id}">
      <div class="flex-grow-1">
        <p style="font-weight:600;margin:0;">Vacante: ${p.vacante_id}</p>
        <p style="font-size:0.875rem;color:var(--muted-fg);margin:0;">Candidato: ${p.candidato_id} | Ajustes: ${JSON.stringify(p.ajustes_razonables)}</p>
        <a href="${p.cv_url}" target="_blank" style="font-size:0.75rem;">Ver CV</a>
      </div>
      <div>
        <select class="form-select form-select-sm" ${p.estado === 'Cancelada' ? 'disabled' : ''} onchange="updatePostulacionEstado('${p.id}', this.value)">
          <option value="Enviada" ${p.estado === 'Enviada' ? 'selected' : ''}>Enviada</option>
          <option value="En Revisión" ${p.estado === 'En Revisión' ? 'selected' : ''}>En Revisión</option>
          <option value="Preseleccionado" ${p.estado === 'Preseleccionado' ? 'selected' : ''}>Preseleccionado</option>
          <option value="Entrevista" ${p.estado === 'Entrevista' ? 'selected' : ''}>Entrevista</option>
          <option value="Cancelada" ${p.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      </div>
    </div>
  `;

  try {
    const { data, error } = await window.supabase.from('postulaciones').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) throw error;
    
    if (data.length === 0) {
       listEl.innerHTML = '<p class="text-muted">No hay postulaciones aún.</p>';
    } else {
       listEl.innerHTML = data.map(renderItem).join('');
    }
    
    // Subscribe to realtime
    window.supabase.channel('postulaciones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'postulaciones' }, payload => {
        console.log('Realtime update:', payload);
        // Reload list for simplicity
        loadRealtimePostulaciones();
      })
      .subscribe();

  } catch(err) {
    listEl.innerHTML = '<p class="text-danger">Error al cargar postulaciones: ' + err.message + '</p>';
  }
};

window.updatePostulacionEstado = async function(id, estado) {
  const { error } = await window.supabase.from('postulaciones').update({ estado }).eq('id', id);
  if (error) alert('Error al actualizar: ' + error.message);
};


// ─── Post Job ─────────────────────────────────────────────────────────────────
function renderPostJob() {
  el('view-post-job').innerHTML = `
    <div style="max-width:700px;margin:0 auto;">
      <div id="post-job-form-wrapper">
        <div class="i-card-sm" style="padding:0;overflow:hidden;">
          <div style="height:6px;background:var(--primary);"></div>
          <div style="padding:28px;">
            <h1 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.25rem;margin-bottom:4px;">Publicar nueva oferta</h1>
            <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:24px;">Completa la información para conectar con los mejores candidatos.</p>
            <form onsubmit="submitPostJob(event)" class="d-flex flex-column gap-4">
              <div>
                <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted-fg);margin-bottom:12px;">Información básica</p>
                <div class="mb-3"><label class="i-label">Título del puesto <span style="color:var(--destructive);">*</span></label><input type="text" class="i-input" placeholder="ej. Analista de Datos Senior" required/></div>
                <div class="row g-3 mb-3">
                  <div class="col-6"><label class="i-label">Ubicación <span style="color:var(--destructive);">*</span></label><input type="text" class="i-input" placeholder="Ciudad de México" required/></div>
                  <div class="col-6"><label class="i-label">Tipo de empleo <span style="color:var(--destructive);">*</span></label><select class="i-input" required><option value="">Seleccionar</option><option>Tiempo completo</option><option>Medio tiempo</option><option>100% Remoto</option><option>Híbrido</option><option>Freelance</option></select></div>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-6"><label class="i-label">Rango salarial (PEN/mes)</label><input type="text" class="i-input" placeholder="ej. S/ 1,800 – S/ 2,500"/></div>
                  <div class="col-6"><label class="i-label">Categoría <span style="color:var(--destructive);">*</span></label><select class="i-input" required><option value="">Seleccionar</option><option>Tecnología</option><option>Diseño</option><option>Finanzas</option><option>Marketing</option><option>Atención al cliente</option></select></div>
                </div>
                <div class="mb-0"><label class="i-label">Descripción del puesto <span style="color:var(--destructive);">*</span></label><textarea class="i-input" rows="5" required placeholder="Describe las responsabilidades, el ambiente de trabajo y por qué tu empresa es un buen lugar para trabajar..."></textarea></div>
              </div>
              <div>
                <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted-fg);margin-bottom:4px;display:flex;align-items:center;gap:8px;"><i class="bi bi-universal-access"></i> Características de accesibilidad</p>
                <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:12px;">Selecciona las adaptaciones y facilidades que ofrece tu empresa.</p>
                <div class="row g-2" role="group" aria-label="Características de accesibilidad">
                  ${A11Y_FEATURES.map(f => `
                    <div class="col-6 col-md-4">
                      <label class="a11y-check-card" id="a11y-check-${f.id}" onclick="toggleA11yCheck('${f.id}')">
                        <input type="checkbox" style="opacity:0;position:absolute;"/>
                        <i class="bi ${f.icon} fs-5" aria-hidden="true"></i>
                        <span style="font-size:0.875rem;line-height:1.3;">${f.label}</span>
                      </label>
                    </div>`).join('')}
                </div>
              </div>
              
              <!-- Checklist Ley N 29973 Obligatorio -->
              <div style="background:var(--muted-bg); border-radius:12px; padding:16px;">
                <p style="font-size:0.875rem;font-weight:700;color:var(--primary);margin-bottom:12px;"><i class="bi bi-shield-check"></i> Checklist de Cumplimiento (Ley N° 29973)</p>
                <label style="display:flex;gap:12px;align-items:flex-start;margin-bottom:8px;font-size:0.875rem;cursor:pointer;">
                  <input type="checkbox" required style="margin-top:4px;" />
                  <span>Confirmo que las instalaciones de la empresa cuentan con infraestructura accesible (rampas, ascensores, baños adaptados) o el rol permite teletrabajo al 100%.</span>
                </label>
                <label style="display:flex;gap:12px;align-items:flex-start;font-size:0.875rem;cursor:pointer;">
                  <input type="checkbox" required style="margin-top:4px;" />
                  <span>Confirmo que la empresa está dispuesta a proveer los ajustes razonables tecnológicos (lectores de pantalla, teclados especiales) si el candidato seleccionado lo requiere.</span>
                </label>
              </div>
              <div class="d-flex gap-3 pt-2" style="border-top:1px solid var(--border);">
                <button type="button" onclick="navigate('company-dashboard')" class="btn btn-secondary-custom">Cancelar</button>
                <button type="submit" class="btn btn-primary-custom flex-grow-1 d-flex align-items-center justify-content-center gap-2" style="max-width:260px;height:48px;font-size:1rem;"><i class="bi bi-globe"></i> Publicar oferta</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="post-job-success" class="d-none text-center py-5">
        <div style="width:80px;height:80px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="bi bi-check-circle-fill" style="font-size:2.5rem;color:#16a34a;"></i></div>
        <h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.5rem;margin-bottom:8px;">¡Oferta publicada!</h2>
        <p style="color:var(--muted-fg);margin-bottom:24px;">Tu oferta está activa y los candidatos ya pueden verla.</p>
        <div class="d-flex gap-3 justify-content-center">
          <button onclick="navigate('company-dashboard')" class="btn btn-secondary-custom">Ir al dashboard</button>
          <button onclick="el('post-job-success').classList.add('d-none');el('post-job-form-wrapper').classList.remove('d-none');" class="btn btn-primary-custom">Publicar otra</button>
        </div>
      </div>
    </div>`;
}
function toggleA11yCheck(id) {
  const card = el('a11y-check-'+id);
  if(card) card.classList.toggle('checked');
}
function submitPostJob(e) {
  e.preventDefault();
  el('post-job-form-wrapper').classList.add('d-none');
  el('post-job-success').classList.remove('d-none');
}

// ─── Company Applicants ───────────────────────────────────────────────────────
function renderCompanyApplicants() {
  const statuses = ['all','En revisión','Entrevista','Descartado'];
  const filtered = state.companyApplicantFilter === 'all' ? COMPANY_APPLICANTS : COMPANY_APPLICANTS.filter(a => a.status === state.companyApplicantFilter);
  el('view-company-applicants').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="d-flex align-items-center justify-content-between">
        <div><h2 style="font-family:'Lexend',sans-serif;font-weight:700;font-size:1.125rem;margin:0;">Postulantes — Analista de Datos</h2><p style="font-size:0.875rem;color:var(--muted-fg);margin:0;">${COMPANY_APPLICANTS.length} candidatos en total</p></div>
        <button class="btn btn-secondary-custom btn-sm d-flex align-items-center gap-2"><i class="bi bi-download"></i>Exportar</button>
      </div>
      <div class="d-flex gap-2" role="tablist">
        ${statuses.map(s => `<button class="tab-btn ${state.companyApplicantFilter===s?'active':''}" onclick="setCompanyFilter('${s}')">${s==='all'?'Todos':s}</button>`).join('')}
      </div>
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        <div class="overflow-x-auto">
          <table class="i-table" aria-label="Postulantes">
            <thead><tr><th>Candidato</th><th>Fecha</th><th>Discapacidad declarada</th><th>Puntaje</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              ${filtered.map(ap => `
                <tr>
                  <td><div class="d-flex align-items-center gap-3"><div class="candidate-avatar">${ap.name.charAt(0)}</div><span style="font-weight:600;">${ap.name}</span></div></td>
                  <td style="color:var(--muted-fg);">${ap.date}</td>
                  <td><span style="padding:4px 10px;border-radius:999px;font-size:0.75rem;background:var(--secondary);color:var(--secondary-fg);border:1px solid var(--border);">${ap.medicalConsent ? ap.disability : 'Requiere Ajustes'}</span></td>
                  <td><div class="d-flex align-items-center gap-2"><div class="score-bar"><div class="score-fill" style="width:${ap.score}%;"></div></div><span style="font-size:0.75rem;font-weight:700;">${ap.score}</span></div></td>
                  <td>${statusBadge(ap.status, ap.status==='Entrevista'?'blue':ap.status==='Descartado'?'red':'yellow')}</td>
                  <td><div class="d-flex gap-1"><button class="icon-btn" aria-label="Ver perfil"><i class="bi bi-eye"></i></button><button class="icon-btn" aria-label="Más opciones"><i class="bi bi-three-dots-vertical"></i></button></div></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}
function setCompanyFilter(f) { state.companyApplicantFilter = f; renderCompanyApplicants(); }

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function renderAdminPanel() {
  const candidates = ADMIN_USERS.filter(u => u.role !== 'Empresa');
  const companies = ADMIN_USERS.filter(u => u.role === 'Empresa');
  const tableRows = (users) => users.map(u => `
    <tr>
      <td style="font-weight:600;">${u.name}</td>
      <td style="color:var(--muted-fg);">${u.email}</td>
      <td><span style="padding:4px 10px;border-radius:999px;font-size:0.75rem;background:var(--secondary);color:var(--secondary-fg);border:1px solid var(--border);">${u.role}</span></td>
      <td>${statusBadge(u.status, u.status==='Activo'||u.status==='Verificado'?'green':'gray')}</td>
      <td style="color:var(--muted-fg);">${u.joined}</td>
      <td><div class="d-flex gap-1"><button class="icon-btn"><i class="bi bi-eye"></i></button><button class="icon-btn"><i class="bi bi-pencil"></i></button></div></td>
    </tr>`).join('');

  el('view-admin-panel').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="row g-3">
        ${[
          { label:'Usuarios registrados', value: ADMIN_USERS.filter(u=>u.role!=='Empresa').length.toString(), icon:'bi-people', delta:'Dinámico', bg:'var(--secondary)', c:'var(--primary)' },
          { label:'Empresas verificadas', value: ADMIN_USERS.filter(u=>u.role==='Empresa').length.toString(), icon:'bi-building', delta:'Dinámico', bg:'rgba(229,91,20,0.1)', c:'var(--accent)' },
          { label:'Ofertas activas', value: JOBS.length.toString(), icon:'bi-briefcase', delta:'Dinámico', bg:'#dcfce7', c:'#166534' },
          { label:'Postulaciones', value: APPS_DATA.length.toString(), icon:'bi-file-text', delta:'Dinámico', bg:'#dbeafe', c:'#1e40af' },
          { label:'Tasa de inclusión', value:'Dinámico', icon:'bi-heart', delta:'N/A', bg:'#f3e8ff', c:'#7c3aed' },
          { label:'Contrataciones', value: APPS_DATA.filter(a=>a.status==='Contratado').length.toString(), icon:'bi-person-check', delta:'Dinámico', bg:'#fef3c7', c:'#d97706' },
        ].map(k => `
          <div class="col-6 col-md-4">
            <div class="i-card-sm">
              <div class="kpi-icon mb-3" style="background:${k.bg};color:${k.c};"><i class="bi ${k.icon}"></i></div>
              <p style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin:0;">${k.value}</p>
              <p style="font-size:0.75rem;color:var(--muted-fg);margin:2px 0 0;">${k.label}</p>
              <p class="delta-text">${k.delta}</p>
            </div>
          </div>`).join('')}
      </div>
      <div class="admin-tabs" role="tablist">
        ${[['overview','Resumen'],['users','Usuarios'],['companies','Empresas']].map(([t,l]) => `
          <button class="admin-tab ${state.adminTab===t?'active':''}" role="tab" aria-selected="${state.adminTab===t}" onclick="setAdminTab('${t}')">${l}</button>`).join('')}
      </div>
      <div id="admin-tab-content"></div>
      <div class="i-card-sm">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Alertas del sistema</h3>
        <div class="d-flex flex-column gap-2">
          <div class="sys-alert sys-alert-warning"><i class="bi bi-exclamation-triangle flex-shrink-0"></i><p style="margin:0;">3 empresas pendientes de verificación</p><button style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;" onclick="this.parentElement.style.display='none'" aria-label="Cerrar"><i class="bi bi-x"></i></button></div>
          <div class="sys-alert sys-alert-info"><i class="bi bi-universal-access flex-shrink-0"></i><p style="margin:0;">Actualización de accesibilidad WCAG 2.2 disponible</p><button style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;" onclick="this.parentElement.style.display='none'" aria-label="Cerrar"><i class="bi bi-x"></i></button></div>
          <div class="sys-alert sys-alert-success"><i class="bi bi-check-circle flex-shrink-0"></i><p style="margin:0;">Copia de seguridad completada · Hoy 03:00 AM</p><button style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;" onclick="this.parentElement.style.display='none'" aria-label="Cerrar"><i class="bi bi-x"></i></button></div>
        </div>
      </div>
    </div>`;

  renderAdminTabContent();
  if (state.adminTab === 'overview') initBarChart('admin-chart');
}

function renderAdminTabContent() {
  const content = el('admin-tab-content');
  if (!content) return;
  if (state.adminTab === 'overview') {
    content.innerHTML = `<div class="i-card-sm"><h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Actividad de la plataforma</h3><canvas id="admin-chart" height="200"></canvas></div>`;
    setTimeout(() => initBarChart('admin-chart'), 50);
  } else {
    const users = state.adminTab === 'users' ? ADMIN_USERS.filter(u => u.role !== 'Empresa') : ADMIN_USERS.filter(u => u.role === 'Empresa');
    const title = state.adminTab === 'users' ? 'Usuarios registrados' : 'Empresas';
    content.innerHTML = `
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;">${title}</h3>
          <div class="d-flex gap-2">
            <div class="position-relative"><i class="bi bi-search position-absolute" style="left:10px;top:50%;transform:translateY(-50%);font-size:0.875rem;color:var(--muted-fg);"></i><input placeholder="Buscar..." style="height:36px;padding:0 12px 0 30px;border-radius:8px;border:1px solid var(--border);background:var(--input-bg);font-size:0.875rem;outline:none;color:var(--foreground);"/></div>
            <button class="btn btn-secondary-custom btn-sm"><i class="bi bi-funnel"></i></button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="i-table" aria-label="${title}">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Registro</th><th></th></tr></thead>
            <tbody>${(state.adminTab === 'users' ? ADMIN_USERS.filter(u=>u.role!=='Empresa') : ADMIN_USERS.filter(u=>u.role==='Empresa')).map(u => `
              <tr>
                <td style="font-weight:600;">${u.name}</td><td style="color:var(--muted-fg);">${u.email}</td>
                <td><span style="padding:4px 10px;border-radius:999px;font-size:0.75rem;background:var(--secondary);color:var(--secondary-fg);border:1px solid var(--border);">${u.role}</span></td>
                <td>${statusBadge(u.status, u.status==='Activo'||u.status==='Verificado'?'green':'gray')}</td>
                <td style="color:var(--muted-fg);">${u.joined}</td>
                <td><div class="d-flex gap-1"><button class="icon-btn"><i class="bi bi-eye"></i></button><button class="icon-btn"><i class="bi bi-pencil"></i></button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }
}

function setAdminTab(t) { state.adminTab = t; renderAdminTabContent(); document.querySelectorAll('.admin-tab').forEach((btn,i)=>{ const tabs=[['overview'],['users'],['companies']]; btn.classList.toggle('active', tabs[i] && tabs[i][0]===t); }); if(t==='overview') setTimeout(()=>initBarChart('admin-chart'),50); }

// ─── Chart ────────────────────────────────────────────────────────────────────
function initBarChart(canvasId) {
  const canvas = el(canvasId);
  if (!canvas) return;
  if (chartInstance) { try { chartInstance.destroy(); } catch(e){} chartInstance = null; }
  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: CHART_DATA.map(d => d.mes),
      datasets: [{ label:'Postulantes', data: CHART_DATA.map(d => d.val), backgroundColor: '#1a3694', borderRadius: 4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} postulantes` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#5a6480' } },
        y: { grid: { color: 'rgba(26,54,148,0.08)' }, ticks: { font: { size: 11 }, color: '#5a6480' } }
      }
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function loadAllDataFromSupabase() {
  if (!window.supabaseClient) return;
  try {
    // 1. Cargar Ofertas (JOBS)
    const { data: dbJobs, error: errJobs } = await window.supabaseClient
      .from('jobs')
      .select('*, companies(name, logo_url)');
    if (!errJobs && dbJobs) {
      JOBS = dbJobs.map(dbJob => ({
        id: dbJob.id,
        title: dbJob.title,
        company: dbJob.companies?.name || 'Empresa Desconocida',
        location: dbJob.location,
        type: dbJob.type,
        salary: dbJob.salary,
        posted: new Date(dbJob.created_at).toLocaleDateString(),
        tags: Array.isArray(dbJob.requirements) ? dbJob.requirements : (dbJob.requirements ? dbJob.requirements.split(',').map(s=>s.trim()) : []),
        a11y: Array.isArray(dbJob.a11y) ? dbJob.a11y : (dbJob.a11y ? dbJob.a11y.split(',').map(s=>s.trim()) : []),
        description: dbJob.description,
        requirements: Array.isArray(dbJob.requirements) ? dbJob.requirements : (dbJob.requirements ? dbJob.requirements.split(',').map(s=>s.trim()) : []),
        logo: dbJob.companies?.logo_url ? `<img src="${dbJob.companies.logo_url}" width="32" />` : (dbJob.companies?.name || 'UD').substring(0,2).toUpperCase(),
        category: dbJob.category,
        featured: false
      }));
      if (state.selectedJob && !JOBS.find(j => j.id === state.selectedJob.id)) {
        state.selectedJob = JOBS[0] || null;
      }
    }

    // 2. Cargar Postulaciones del Candidato (APPS_DATA) y de la Empresa (COMPANY_APPLICANTS)
    const { data: dbApps, error: errApps } = await window.supabaseClient
      .from('applications')
      .select('*, jobs(title, companies(name)), profiles(full_name, title, bio)');
    if (!errApps && dbApps) {
      APPS_DATA = dbApps.map(a => ({
        id: a.id,
        job: a.jobs?.title || 'Vacante eliminada',
        company: a.jobs?.companies?.name || 'UD',
        date: new Date(a.created_at).toLocaleDateString(),
        status: a.status || 'En revisión',
        color: a.status === 'Contratado' ? 'green' : (a.status === 'Descartado' ? 'red' : 'yellow')
      }));
      COMPANY_APPLICANTS = dbApps.map(a => ({
        id: a.id,
        name: a.profiles?.full_name || 'Candidato Anónimo',
        date: new Date(a.created_at).toLocaleDateString(),
        status: a.status || 'En revisión',
        disability: 'No especificado (Base de datos)',
        score: Math.floor(Math.random() * 100),
        medicalConsent: false
      }));
    }

    // 3. Cargar Usuarios (ADMIN_USERS)
    const { data: dbProfiles, error: errProfiles } = await window.supabaseClient.from('profiles').select('*');
    if (!errProfiles && dbProfiles) {
      ADMIN_USERS = dbProfiles.map(p => ({
        id: p.id,
        name: p.full_name || 'Sin nombre',
        email: 'Oculto por privacidad',
        role: p.title || 'Candidato',
        status: 'Activo',
        joined: new Date(p.updated_at || Date.now()).toLocaleDateString()
      }));
    }

    // Actualizar vista actual si requiere repintado
    renderAppView(state.view);

  } catch (err) {
    console.error('Error cargando datos de Supabase:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadA11yState();
  loadAllDataFromSupabase();
  
  const savedSession = localStorage.getItem('incluyet-session');
  if (savedSession) {
    try {
      const parsed = JSON.parse(savedSession);
      state.userName = parsed.userName;
      handleLogin(parsed.role);
    } catch(e) {
      navigate('landing');
    }
  } else {
    navigate('landing');
  }
});



// Make all functions global for inline event handlers
Object.assign(window, { el, show, hide, statusBadge, a11yBadge, logoBadge, jobCard, loadA11yState, saveA11yState, increaseFontSize, decreaseFontSize, applyFontSize, toggleHighContrast, applyHighContrast, toggleDyslexia, applyDyslexia, togglePassword, selectRole, handleLoginSubmit, handleRegisterSubmit, handleLogin, handleLogout, switchRegisterTab, toggleSidebar, buildSidebar, navigate, renderAppView, viewJob, renderLandingDynamic, renderCandidateHome, renderJobSearch, toggleFilter, clearFilters, renderJobResults, renderJobDetail, renderProfile, saveProfile, toggleProfileEdit, renderApplications, setAppFilter, renderMessages, selectMsg, sendMsg, scrollChatToBottom, renderResources, setResourceCat, renderCompanyDashboard, renderPostJob, toggleA11yCheck, submitPostJob, renderCompanyApplicants, setCompanyFilter, renderAdminPanel, renderAdminTabContent, setAdminTab, initBarChart, loadAllDataFromSupabase });
