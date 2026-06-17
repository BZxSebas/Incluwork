// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOGO_COLORS = { BN:'#1d4ed8',SI:'#7c3aed',TA:'#0d9488',DG:'#d97706',CF:'#059669',MI:'#db2777' };

const JOBS = [
  { id:1, title:'Analista de Datos', company:'Banco Nacional de México', location:'CDMX (Remoto disponible)', type:'Tiempo completo', salary:'$18,000 – $22,000 MXN', posted:'Hace 2 días', tags:['SQL','Excel','Power BI'], a11y:['remoto','horario-flexible','lector-pantalla','motor'], description:'El Banco Nacional de México busca un Analista de Datos para unirse a nuestro equipo de inteligencia de negocios. Trabajarás analizando grandes volúmenes de información para apoyar decisiones estratégicas. Somos una empresa comprometida con la inclusión laboral, con instalaciones accesibles y políticas de ajustes razonables para todos nuestros colaboradores.', requirements:['Licenciatura en Sistemas, Estadística o afín','2 años de experiencia con SQL','Manejo avanzado de Excel y Power BI','Capacidad analítica y atención al detalle'], logo:'BN', category:'Tecnología', featured:true },
  { id:2, title:'Diseñadora/or UX Senior', company:'Startup Inclusiva', location:'Guadalajara (Híbrido)', type:'Tiempo completo', salary:'$22,000 – $30,000 MXN', posted:'Hace 1 día', tags:['Figma','UX Research','WCAG'], a11y:['sordera','remoto','sensorial','motor'], description:'Empresa de tecnología con misión de inclusión busca UX Designer con pasión por la accesibilidad digital. Trabajarás en proyectos de alto impacto social diseñando experiencias para todas las personas.', requirements:['Portfolio con proyectos de accesibilidad','Dominio de Figma y metodologías de investigación','Conocimiento de WCAG 2.1 AA','Inglés intermedio'], logo:'SI', category:'Diseño', featured:true },
  { id:3, title:'Agente de Atención al Cliente', company:'TeleAsiste México', location:'Monterrey', type:'Medio tiempo', salary:'$8,500 – $11,000 MXN', posted:'Hace 3 días', tags:['Servicio al cliente','Chat','CRM'], a11y:['motor','horario-flexible','remoto'], description:'Centro de atención al cliente 100% digital. Atenderás a usuarios vía chat y correo electrónico, sin necesidad de llamadas telefónicas. Ambiente de trabajo inclusivo y equipo diverso.', requirements:['Bachillerato terminado','Buena redacción y ortografía','Empatía y paciencia'], logo:'TA', category:'Atención al Cliente', featured:false },
  { id:4, title:'Contadora/or Junior', company:'Despacho García & Asociados', location:'Ciudad de México', type:'Tiempo completo', salary:'$14,000 – $17,000 MXN', posted:'Hace 5 días', tags:['Contabilidad','SAP','Fiscal'], a11y:['silla-ruedas','horario-flexible'], description:'Despacho contable con instalaciones 100% accesibles en planta baja. Buscamos recién egresados con ganas de aprender y crecer profesionalmente.', requirements:['Lic. en Contaduría (titulado o pasante)','Conocimiento básico de SAP','Disponibilidad para aprender'], logo:'DG', category:'Finanzas', featured:false },
  { id:5, title:'Desarrolladora/or Frontend', company:'CodeForAll', location:'100% Remoto', type:'Freelance / Proyecto', salary:'$28,000 – $38,000 MXN', posted:'Hoy', tags:['React','TypeScript','Accesibilidad web'], a11y:['remoto','lector-pantalla','motor','horario-flexible','sordera','silla-ruedas'], description:'Empresa especializada en desarrollo web accesible. Construimos productos digitales que cumplen WCAG 2.1 AA. Trabajamos 100% remoto y valoramos la diversidad.', requirements:['3+ años con React y TypeScript','Conocimiento de WCAG 2.1','Experiencia con herramientas de accesibilidad'], logo:'CF', category:'Tecnología', featured:true },
  { id:6, title:'Community Manager', company:'Marca Inclusión', location:'CDMX (Híbrido)', type:'Tiempo completo', salary:'$12,000 – $16,000 MXN', posted:'Hace 4 días', tags:['Redes sociales','Contenido','Canva'], a11y:['sordera','horario-flexible','sensorial'], description:'Agencia de comunicación con valores de diversidad busca Community Manager creativo para gestionar redes sociales de marcas comprometidas con la inclusión.', requirements:['Experiencia en gestión de redes','Creatividad y buen ojo visual','Conocimiento de accesibilidad en contenido digital'], logo:'MI', category:'Marketing', featured:false },
];

const A11Y_FEATURES = [
  { id:'remoto', label:'Trabajo remoto', emoji:'🏠' },
  { id:'horario-flexible', label:'Horario flexible', emoji:'🕐' },
  { id:'silla-ruedas', label:'Acceso silla de ruedas', emoji:'♿' },
  { id:'lector-pantalla', label:'Lector de pantalla', emoji:'👁️' },
  { id:'sordera', label:'Intérprete LSM', emoji:'🤟' },
  { id:'motor', label:'Adaptaciones motoras', emoji:'🖱️' },
  { id:'sensorial', label:'Ambiente adaptado', emoji:'🧠' },
];

const APPS_DATA = [
  { id:1, job:'Analista de Datos', company:'Banco Nacional de México', date:'12 jun 2026', status:'En revisión', color:'yellow' },
  { id:2, job:'Diseñadora/or UX Senior', company:'Startup Inclusiva', date:'10 jun 2026', status:'Entrevista programada', color:'blue' },
  { id:3, job:'Desarrolladora/or Frontend', company:'CodeForAll', date:'8 jun 2026', status:'Contratado', color:'green' },
  { id:4, job:'Community Manager', company:'Marca Inclusión', date:'5 jun 2026', status:'No seleccionado', color:'red' },
  { id:5, job:'Contadora/or Junior', company:'Despacho García & Asociados', date:'3 jun 2026', status:'Postulado', color:'gray' },
];

const MSGS = [
  { id:1, from:'Startup Inclusiva', initials:'SI', time:'10:34', unread:2, preview:'¿Tienes disponibilidad para una entrevista el martes?', thread:[
    { mine:false, text:'Hola María, gracias por tu postulación al puesto de UX Senior. Hemos revisado tu perfil y nos gustaría conocerte mejor.', time:'Ayer 15:20' },
    { mine:true, text:'¡Hola! Muchas gracias, con gusto. ¿En qué formato sería la entrevista?', time:'Ayer 16:05' },
    { mine:false, text:'Será por videollamada vía Google Meet. ¿Tienes disponibilidad el martes 18 de junio a las 10:00 am?', time:'Hoy 10:34' },
    { mine:false, text:'Si necesitas algún ajuste razonable (intérprete, subtítulos, etc.) con gusto lo coordinamos.', time:'Hoy 10:35' },
  ]},
  { id:2, from:'Banco Nacional de México', initials:'BN', time:'Ayer', unread:0, preview:'Hemos recibido tu postulación y la estamos revisando.', thread:[
    { mine:false, text:'Hola, hemos recibido tu postulación al puesto de Analista de Datos y la estamos revisando. Te contactaremos en los próximos días.', time:'Ayer 09:15' },
  ]},
  { id:3, from:'CodeForAll', initials:'CF', time:'Lun', unread:0, preview:'¡Felicidades! Hemos decidido contratarte.', thread:[
    { mine:false, text:'¡Felicidades, María! Hemos decidido contratarte para el puesto de Desarrolladora Frontend. En breve te enviamos los detalles del contrato.', time:'Lun 14:00' },
    { mine:true, text:'¡Muchas gracias! Estoy muy emocionada. Quedo pendiente del contrato.', time:'Lun 14:30' },
  ]},
];

const CHART_DATA = [
  { mes:'Ene', val:12 },{ mes:'Feb', val:19 },{ mes:'Mar', val:8 },
  { mes:'Abr', val:25 },{ mes:'May', val:32 },{ mes:'Jun', val:41 },
];

const COMPANY_APPLICANTS = [
  { id:1, name:'María López', date:'12 jun', status:'Entrevista', disability:'Movilidad reducida', score:92 },
  { id:2, name:'Carlos Ramos', date:'11 jun', status:'En revisión', disability:'Baja visión', score:88 },
  { id:3, name:'Ana Jiménez', date:'10 jun', status:'Entrevista', disability:'Hipoacusia', score:85 },
  { id:4, name:'Pedro Sánchez', date:'9 jun', status:'Descartado', disability:'Sin especificar', score:60 },
  { id:5, name:'Laura Torres', date:'8 jun', status:'En revisión', disability:'Parálisis cerebral', score:79 },
];

const ADMIN_USERS = [
  { id:1, name:'María López García', email:'maria@email.com', role:'Candidata', status:'Activo', joined:'15 mar 2026' },
  { id:2, name:'Banco Nacional SA', email:'rrhh@banconacional.mx', role:'Empresa', status:'Verificado', joined:'10 ene 2026' },
  { id:3, name:'Carlos Mendoza', email:'carlos@email.com', role:'Candidato', status:'Activo', joined:'20 abr 2026' },
  { id:4, name:'Startup Inclusiva', email:'contacto@startupinclusiva.com', role:'Empresa', status:'Verificado', joined:'5 feb 2026' },
  { id:5, name:'Ana Torres', email:'ana.torres@email.com', role:'Candidata', status:'Inactivo', joined:'1 may 2026' },
];

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  view: 'landing',
  role: null,
  fontSize: 16,
  highContrast: false,
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
  return `<span class="a11y-badge"><span aria-hidden="true">${feat.emoji}</span><span class="d-none d-sm-inline">${feat.label}</span></span>`;
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
          Ver oferta <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </article>`;
}

// ─── Accessibility ────────────────────────────────────────────────────────────
function increaseFontSize() {
  state.fontSize = Math.min(22, state.fontSize + 2);
  applyFontSize();
}
function decreaseFontSize() {
  state.fontSize = Math.max(14, state.fontSize - 2);
  applyFontSize();
}
function applyFontSize() {
  document.documentElement.style.setProperty('--fs-base', state.fontSize + 'px');
  el('font-size-display').textContent = state.fontSize + 'px';
}
function toggleHighContrast() {
  state.highContrast = !state.highContrast;
  document.body.classList.toggle('high-contrast', state.highContrast);
  const btn = el('high-contrast-btn');
  btn.setAttribute('aria-pressed', String(state.highContrast));
}
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
function handleLoginSubmit(e) { e.preventDefault(); handleLogin(state.loginRole); }
function handleRegisterSubmit(e, role) { e.preventDefault(); handleLogin(role); }
function handleLogin(role) {
  state.role = role;
  if (role === 'candidate') navigate('candidate-home');
  else if (role === 'company') navigate('company-dashboard');
  else navigate('admin-panel');
}
function handleLogout() { state.role = null; navigate('landing'); }

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
  const userName = role === 'candidate' ? 'María López' : role === 'company' ? 'Startup Inclusiva' : 'Administrador';
  const roleLabel = role === 'candidate' ? 'Candidata' : role === 'company' ? 'Empresa' : 'Admin';

  el('sidebar-user-name').textContent = userName;
  el('sidebar-user-role').textContent = roleLabel;
  el('sidebar-user-avatar').textContent = userName.charAt(0);

  const candidateItems = [
    { view:'candidate-home', label:'Inicio', icon:'bi-house' },
    { view:'job-search', label:'Buscar ofertas', icon:'bi-search' },
    { view:'profile', label:'Mi perfil', icon:'bi-person' },
    { view:'applications', label:'Mis postulaciones', icon:'bi-file-text' },
    { view:'messages', label:'Mensajes', icon:'bi-chat-square-text', badge:2 },
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

function viewJob(id) {
  state.selectedJob = JOBS.find(j => j.id === id) || JOBS[0];
  navigate('job-detail');
}

// ─── Landing Dynamic ──────────────────────────────────────────────────────────
function renderLandingDynamic() {
  // A11y chips
  const chips = el('landing-a11y-chips');
  if (chips) chips.innerHTML = A11Y_FEATURES.map(f =>
    `<span class="a11y-filter-chip"><span>${f.emoji}</span> ${f.label}</span>`).join('');

  // Features grid
  const features = el('features-grid');
  if (features) features.innerHTML = [
    { icon:'bi-universal-access', title:'100% Accesible', desc:'Interfaz compatible con lectores de pantalla, alto contraste, tipografía ajustable y navegación por teclado.', color:'rgba(26,54,148,0.1)', tc:'#1a3694' },
    { icon:'bi-shield-check', title:'Empresas verificadas', desc:'Solo publicamos empresas que han firmado nuestro compromiso de inclusión y tienen políticas reales.', color:'rgba(229,91,20,0.1)', tc:'#e55b14' },
    { icon:'bi-heart', title:'Apoyo continuo', desc:'Guías, talleres y asesoría para prepararte para la búsqueda de empleo y negociar ajustes razonables.', color:'#dcfce7', tc:'#166534' },
    { icon:'bi-funnel', title:'Filtros de accesibilidad', desc:'Busca por las características que necesitas: remoto, horario flexible, intérprete LSM, adaptaciones motoras y más.', color:'#f3e8ff', tc:'#7c3aed' },
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
  el('view-candidate-home').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:24px;">
      <div class="greeting-card">
        <p style="color:rgba(255,255,255,0.7);font-size:0.875rem;margin-bottom:4px;">Hola de vuelta,</p>
        <h2 style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin-bottom:8px;">María López 👋</h2>
        <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin-bottom:16px;">Tienes <strong>2 mensajes nuevos</strong> y <strong>1 entrevista</strong> programada esta semana.</p>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-accent-custom btn-sm d-flex align-items-center gap-2" onclick="navigate('job-search')"><i class="bi bi-search"></i> Buscar ofertas</button>
          <button class="btn" style="background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:8px;font-size:0.875rem;font-weight:600;" onclick="navigate('applications')">Ver mis postulaciones</button>
        </div>
      </div>
      <div class="row g-3">
        ${[
          { label:'Postulaciones', value:'5', icon:'bi-file-text', bg:'var(--secondary)', c:'var(--primary)' },
          { label:'En proceso', value:'2', icon:'bi-clock', bg:'#fef3c7', c:'#92400e' },
          { label:'Entrevistas', value:'1', icon:'bi-people', bg:'#dbeafe', c:'#1e40af' },
          { label:'Contrataciones', value:'1', icon:'bi-award', bg:'#dcfce7', c:'#166534' },
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
              <span aria-hidden="true">${f.emoji}</span> ${f.label}
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
    return matchText && matchFilters;
  });
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
    return f ? `<span style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;background:var(--card);border:1px solid rgba(26,54,148,0.3);font-size:0.875rem;font-weight:600;color:var(--primary);"><span>${f.emoji}</span>${f.label}</span>` : '';
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
                <button class="btn btn-accent-custom w-100 d-flex align-items-center justify-content-center gap-2" style="height:48px;font-size:1rem;" onclick="applyToJob()">
                  <i class="bi bi-send"></i> Postularme ahora
                </button>
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
function applyToJob() {
  el('apply-section').innerHTML = `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;"><i class="bi bi-check-circle-fill" style="color:#16a34a;font-size:2.5rem;display:block;margin-bottom:8px;"></i><p style="font-family:'Lexend',sans-serif;font-weight:700;color:#166534;margin-bottom:4px;">¡Postulación enviada!</p><p style="font-size:0.75rem;color:#15803d;margin:0;">La empresa revisará tu perfil y te contactará si avanzas.</p></div>`;
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function renderProfile() {
  el('view-profile').innerHTML = `
    <div style="max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="i-card-sm" style="padding:0;overflow:hidden;">
        <div class="profile-banner"></div>
        <div style="padding:0 28px 28px;">
          <div class="d-flex align-items-end justify-content-between" style="margin-top:-40px;margin-bottom:16px;">
            <div style="width:80px;height:80px;border-radius:16px;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;border:4px solid var(--card);box-shadow:0 2px 8px rgba(0,0,0,0.1);font-family:'Lexend',sans-serif;">M</div>
            <button id="edit-profile-btn" onclick="toggleProfileEdit()" class="btn btn-secondary-custom btn-sm d-flex align-items-center gap-2"><i class="bi bi-pencil"></i> Editar perfil</button>
          </div>
          <div id="profile-view-mode">
            <h2 style="font-family:'Lexend',sans-serif;font-size:1.25rem;font-weight:700;margin-bottom:2px;">María López García</h2>
            <p style="color:var(--muted-fg);font-size:0.875rem;margin-bottom:4px;">Analista de Datos · Diseñadora UX</p>
            <p style="display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--muted-fg);margin-bottom:12px;"><i class="bi bi-geo-alt"></i>Ciudad de México</p>
            <p style="font-size:0.875rem;color:var(--muted-fg);line-height:1.7;margin:0;">Profesional con 4 años de experiencia en análisis de datos y diseño UX. Apasionada por la accesibilidad digital y los productos centrados en el usuario.</p>
          </div>
          <div id="profile-edit-mode" class="d-none">
            <div class="row g-3 mb-3"><div class="col-6"><label class="i-label">Nombre completo</label><input type="text" class="i-input" value="María López García"/></div><div class="col-6"><label class="i-label">Título profesional</label><input type="text" class="i-input" value="Analista de Datos · Diseñadora UX"/></div></div>
            <div class="mb-3"><label class="i-label">Ciudad</label><input type="text" class="i-input" value="Ciudad de México"/></div>
            <div class="mb-3"><label class="i-label">Sobre mí</label><textarea class="i-input" rows="3">Profesional con 4 años de experiencia en análisis de datos y diseño UX. Apasionada por la accesibilidad digital y los productos centrados en el usuario.</textarea></div>
            <button onclick="toggleProfileEdit()" class="btn btn-primary-custom d-flex align-items-center gap-2"><i class="bi bi-check"></i> Guardar cambios</button>
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
          ${['SQL','Python','Power BI','Excel avanzado','Figma','UX Research','Accesibilidad WCAG','React'].map(s => `<span class="skill-tag">${s}</span>`).join('')}
          <button class="border-dashed-btn">+ Añadir</button>
        </div>
      </div>
      <div class="i-card-sm">
        <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Documentos</h3>
        <div class="d-flex flex-column gap-2">
          ${[{name:'CV_María_López_2026.pdf',size:'245 KB',date:'15 jun 2026'},{name:'Portafolio_UX.pdf',size:'3.2 MB',date:'10 jun 2026'}].map(d => `
            <div class="doc-item">
              <i class="bi bi-file-earmark-text" style="font-size:1.75rem;color:var(--primary);flex-shrink:0;"></i>
              <div class="flex-grow-1 min-w-0"><p style="font-size:0.875rem;font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.name}</p><p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">${d.size} · Subido ${d.date}</p></div>
              <button class="icon-btn"><i class="bi bi-download"></i></button>
            </div>`).join('')}
          <button class="btn btn-secondary-custom btn-sm d-flex align-items-center gap-2 mt-1" style="width:fit-content;"><i class="bi bi-plus-lg"></i> Subir documento</button>
        </div>
      </div>
    </div>`;
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
    { label:'Contratado', count:1, bg:'#dcfce7', c:'#166534' },
    { label:'Entrevista', count:1, bg:'#dbeafe', c:'#1e40af' },
    { label:'En revisión', count:1, bg:'#fef3c7', c:'#92400e' },
    { label:'Descartado', count:1, bg:'#fee2e2', c:'#991b1b' },
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
    { id:1, title:'Cómo preparar tu CV inclusivo', cat:'Consejos', time:'5 min', emoji:'📄', desc:'Aprende a destacar tus fortalezas y habilidades de manera efectiva en tu currículum.' },
    { id:2, title:'Derechos laborales de personas con discapacidad en México', cat:'Legal', time:'8 min', emoji:'⚖️', desc:'Conoce la Ley Federal del Trabajo y tus derechos en el ámbito laboral.' },
    { id:3, title:'Cómo solicitar ajustes razonables en el trabajo', cat:'Guía práctica', time:'6 min', emoji:'🛠️', desc:'Guía paso a paso para comunicar tus necesidades de accesibilidad con tu empleador.' },
    { id:4, title:'Entrevistas: consejos para personas con discapacidad', cat:'Consejos', time:'7 min', emoji:'💬', desc:'Estrategias para comunicar tu discapacidad y brillar en las entrevistas de trabajo.' },
    { id:5, title:'Herramientas de accesibilidad digital para el trabajo', cat:'Tecnología', time:'10 min', emoji:'💻', desc:'Software, extensiones y configuraciones que pueden facilitar tu trabajo diario.' },
    { id:6, title:'Empresas comprometidas con la inclusión: qué buscar', cat:'Guía práctica', time:'5 min', emoji:'🏢', desc:'Señales que indican si una empresa realmente tiene cultura de inclusión.' },
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
              <div style="font-size:2rem;">${r.emoji}</div>
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
function renderCompanyDashboard() {
  el('view-company-dashboard').innerHTML = `
    <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
      <div class="greeting-card">
        <p style="color:rgba(255,255,255,0.7);font-size:0.875rem;margin:0;">Panel de empresa</p>
        <h2 style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin:4px 0;">Startup Inclusiva</h2>
        <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin:0;">Cuenta verificada · Compromiso de inclusión firmado</p>
      </div>
      <div class="row g-3">
        ${[
          { label:'Ofertas activas', value:'4', icon:'bi-briefcase', delta:'+1 este mes', bg:'var(--secondary)', c:'var(--primary)' },
          { label:'Postulantes totales', value:'137', icon:'bi-people', delta:'+41 este mes', bg:'rgba(229,91,20,0.1)', c:'var(--accent)' },
          { label:'Contrataciones', value:'12', icon:'bi-person-check', delta:'+2 este mes', bg:'#dcfce7', c:'#166534' },
          { label:'Tasa de inclusión', value:'78%', icon:'bi-heart', delta:'↑ 5% vs anterior', bg:'#f3e8ff', c:'#7c3aed' },
        ].map(k => `
          <div class="col-6 col-md-3">
            <div class="i-card-sm">
              <div class="kpi-icon mb-3" style="background:${k.bg};color:${k.c};"><i class="bi ${k.icon}"></i></div>
              <p style="font-family:'Lexend',sans-serif;font-size:1.5rem;font-weight:700;margin:0;">${k.value}</p>
              <p style="font-size:0.75rem;color:var(--muted-fg);margin:2px 0 0;">${k.label}</p>
              <p class="delta-text">${k.delta}</p>
            </div>
          </div>`).join('')}
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="i-card-sm">
            <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:16px;">Postulantes por mes</h3>
            <canvas id="company-chart" height="180"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="i-card-sm">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;">Postulantes recientes</h3>
              <button class="btn btn-ghost-primary btn-sm d-flex align-items-center gap-1" onclick="navigate('company-applicants')">Ver todos <i class="bi bi-chevron-right"></i></button>
            </div>
            ${COMPANY_APPLICANTS.slice(0,4).map(ap => `
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="candidate-avatar">${ap.name.charAt(0)}</div>
                <div class="flex-grow-1 min-w-0"><p style="font-size:0.875rem;font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ap.name}</p><p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">${ap.date}</p></div>
                ${statusBadge(ap.status, ap.status==='Entrevista'?'blue':ap.status==='Descartado'?'red':'yellow')}
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="i-card-sm">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h3 style="font-family:'Lexend',sans-serif;font-weight:700;margin:0;">Ofertas activas</h3>
          <button class="btn btn-accent-custom btn-sm d-flex align-items-center gap-2" onclick="navigate('post-job')"><i class="bi bi-plus-lg"></i> Nueva oferta</button>
        </div>
        ${[{title:'Analista de Datos',apps:42,days:12,status:'Activa'},{title:'UX Designer Senior',apps:28,days:7,status:'Activa'},{title:'Frontend Developer',apps:67,days:3,status:'Destacada'}].map(j => `
          <div class="d-flex align-items-center gap-3 p-2 rounded" style="transition:background 0.2s;" onmouseover="this.style.background='var(--muted-bg)'" onmouseout="this.style.background=''">
            <div class="flex-grow-1"><p style="font-weight:600;font-size:0.875rem;margin:0;">${j.title}</p><p style="font-size:0.75rem;color:var(--muted-fg);margin:0;">${j.apps} postulantes · Hace ${j.days} días</p></div>
            ${statusBadge(j.status,j.status==='Destacada'?'blue':'green')}
            <button class="btn btn-ghost-custom btn-sm d-flex align-items-center gap-1">Ver <i class="bi bi-chevron-right"></i></button>
          </div>`).join('')}
      </div>
    </div>`;
  initBarChart('company-chart');
}

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
                  <div class="col-6"><label class="i-label">Rango salarial (MXN/mes)</label><input type="text" class="i-input" placeholder="ej. $18,000 – $25,000"/></div>
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
                        <input type="checkbox" style="display:none;"/>
                        <span style="font-size:1.25rem;">${f.emoji}</span>
                        <span style="font-size:0.875rem;line-height:1.3;">${f.label}</span>
                      </label>
                    </div>`).join('')}
                </div>
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
                  <td><span style="padding:4px 10px;border-radius:999px;font-size:0.75rem;background:var(--secondary);color:var(--secondary-fg);border:1px solid var(--border);">${ap.disability}</span></td>
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
          { label:'Usuarios registrados', value:'1,842', icon:'bi-people', delta:'+124 este mes', bg:'var(--secondary)', c:'var(--primary)' },
          { label:'Empresas verificadas', value:'134', icon:'bi-building', delta:'+8 este mes', bg:'rgba(229,91,20,0.1)', c:'var(--accent)' },
          { label:'Ofertas activas', value:'289', icon:'bi-briefcase', delta:'+31 este mes', bg:'#dcfce7', c:'#166534' },
          { label:'Postulaciones', value:'4,230', icon:'bi-file-text', delta:'+412 este mes', bg:'#dbeafe', c:'#1e40af' },
          { label:'Tasa de inclusión', value:'78%', icon:'bi-heart', delta:'↑ 5% este mes', bg:'#f3e8ff', c:'#7c3aed' },
          { label:'Contrataciones', value:'312', icon:'bi-person-check', delta:'+28 este mes', bg:'#fef3c7', c:'#d97706' },
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
document.addEventListener('DOMContentLoaded', () => {
  navigate('landing');
});
