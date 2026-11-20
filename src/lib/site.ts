export const asset = (file: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/media/${file}`;

export const REPO = 'https://github.com/geoni15/fullstack-devtools';
export const VERSION = '0.6.0';
export const RELEASES = `${REPO}/releases/latest`;
export const SETUP_URL = `${REPO}/releases/download/v${VERSION}/Backend-DevTools-Desktop-${VERSION}-setup.exe`;
export const PORTABLE_URL = `${REPO}/releases/download/v${VERSION}/Backend-DevTools-Desktop-${VERSION}-portable.exe`;
export const RELEASE_TITLE = 'Mapa de flujo y edición de código';
export const SETUP_SIZE = '122 MB';
export const PORTABLE_SIZE = '109 MB';
export const NODE_MIN = '22.22.0';
export const LICENSE = 'MIT';
export const LICENSE_URL = `${REPO}/blob/main/LICENSE`;

export const SITE_NAME = 'Fullstack DevTools';
export const SITE_TITLE = 'Fullstack DevTools — del clic a la base de datos, en una sola cadena';
export const SITE_DESCRIPTION =
  'Devtool de escritorio open source que sigue una aplicación web local de punta a punta: elemento de la interfaz, manejador del frontend, petición HTTP, ruta del backend, consulta SQL y base de datos. MIT, v0.6.0.';
export const AUTHOR = 'geoni15';
export const AUTHOR_URL = 'https://github.com/geoni15';
export const TWITTER_HANDLE = '@geoni37931455';
export const SITE_ORIGIN = 'https://geoni15.github.io';

export const NAV = [
  { id: 'cadena', label: 'La cadena' },
  { id: 'modos', label: 'Modos' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'demo', label: 'Demo' },
  { id: 'grafo', label: 'Grafo' },
  { id: 'capacidades', label: 'Capacidades' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'stack', label: 'Stack' },
  { id: 'descarga', label: 'Descarga' },
];

export const SOCIALS = [
  {
    name: 'Instagram',
    handle: '@geony_ogando_montero',
    href: 'https://www.instagram.com/geony_ogando_montero/',
    icon: 'instagram',
    color: 'var(--c-magenta)',
  },
  {
    name: 'YouTube',
    handle: '@porquetefuiste',
    href: 'https://www.youtube.com/@porquetefuiste',
    icon: 'youtube',
    color: 'var(--c-red)',
  },
  {
    name: 'GitHub',
    handle: '@geoni15',
    href: 'https://github.com/geoni15',
    icon: 'github',
    color: 'var(--c-blue)',
  },
  {
    name: 'X',
    handle: '@geoni37931455',
    href: 'https://x.com/geoni37931455',
    icon: 'x',
    color: 'var(--c-cyan)',
  },
];

export type Mode = {
  id: string;
  tab: string;
  file: string;
  color: string;
  title: string;
  kicker: string;
  body: string;
  excludes: string;
  rows: { k: string; v: string }[];
  width: number;
  height: number;
};

export const MODES: Mode[] = [
  {
    id: 'htmlcss',
    tab: 'HTML/CSS',
    file: 'htmlcss.png',
    color: 'var(--c-blue)',
    title: 'El elemento, con su selector real',
    kicker: 'Modo 01 · HTML/CSS',
    body: 'Selector, caja, atributos y estilos calculados del nodo exacto que apunta el puntero. La referencia sale del evento real, también dentro de Shadow DOM, así que no hay adivinanza de selectores.',
    excludes: 'No muestra manejadores, peticiones ni SQL: solo el nodo y sus estilos.',
    rows: [
      { k: 'Selector', v: 'td.amount.journal-debit-cell' },
      { k: 'Caja', v: '77.5625px × 44.4062px' },
      { k: 'Display', v: 'table-cell · position: static' },
      { k: 'Color', v: 'rgb(10, 20, 21) sobre rgb(215, 235, 224)' },
      { k: 'Fuente', v: 'Arial · 11.52px · weight 400' },
    ],
    width: 430,
    height: 333,
  },
  {
    id: 'frontend',
    tab: 'Frontend',
    file: 'frontend.png',
    color: 'var(--c-violet)',
    title: 'El manejador que se ejecutó',
    kicker: 'Modo 02 · Frontend',
    body: 'Listener asociado, componente que renderizó el nodo, pila de iniciadores y props de React o Vue. El perfil de la función se lee del objeto en ejecución: async, await, generador, flecha o try/catch.',
    excludes: 'No vuelca el CSS calculado ni las filas de la base de datos.',
    rows: [
      { k: 'Render', v: 'AccountingLedgerPanel.jsx:360:35' },
      { k: 'Código', v: '<button>' },
      { k: 'Pila', v: 'AccountingDashboard.jsx:152 → :215' },
      { k: 'Petición', v: 'GET /api/accounts · 200 OK · 130 ms' },
      { k: 'Eventos', v: 'click · button.text-button' },
    ],
    width: 428,
    height: 391,
  },
  {
    id: 'backend',
    tab: 'Backend',
    file: 'backend.png',
    color: 'var(--c-green)',
    title: 'La ruta que atendió la petición',
    kicker: 'Modo 03 · Backend',
    body: 'Índice estático de rutas para Express, Fastify, FastAPI y Flask, con función, archivo y rango de líneas. Con Node Inspector conectado, la ejecución N2 pausa en el manejador y muestra el código vivo.',
    excludes: 'No repite los cuerpos JSON ni los estilos del elemento.',
    rows: [
      { k: 'Ruta', v: 'GET /api/accounts' },
      { k: 'Archivo', v: 'backend/index.js:3376' },
      { k: 'Líneas', v: '3376–3379 · express' },
      { k: 'Cuerpo', v: 'const accounts = await getVisibleAccounts(pool, req)' },
      { k: 'Nota', v: 'Manejador anónimo definido en la misma línea de la ruta' },
    ],
    width: 430,
    height: 288,
  },
  {
    id: 'json',
    tab: 'JSON',
    file: 'json.png',
    color: 'var(--c-cyan)',
    title: 'El cuerpo completo, y de dónde salió cada cifra',
    kicker: 'Modo 04 · JSON',
    body: 'Peticiones y cuerpos íntegros, solo en memoria. Para un texto formateado en pantalla, el inspector resuelve por identidad el objeto de respuesta que alimentó al componente y la línea JSX que lo pintó.',
    excludes: 'No enseña la rejilla de la tabla ni el perfil del manejador.',
    rows: [
      { k: 'Origen', v: '$.liabilities · respuesta' },
      { k: 'También', v: '$.accounts[15].balance = "32500.00"' },
      { k: 'Cuerpo', v: '{ assets, liabilities, equity, revenue, expenses }' },
      { k: 'Estado', v: '200 OK · 96 ms · 23:42:35' },
      { k: 'Nota', v: 'Camino exacto del dato enlazado por identidad' },
    ],
    width: 425,
    height: 480,
  },
  {
    id: 'sql',
    tab: 'SQL',
    file: 'db.png',
    color: 'var(--c-teal)',
    title: 'La consulta y las filas que devolvió',
    kicker: 'Modo 05 · SQL',
    body: 'Consultas observadas en los drivers de Node y análisis estático de MySQL, PostgreSQL y SQLite. Columnas con su uso real —SELECT, WHERE, JOIN, ORDER— y la muestra de filas tal como la entregó el driver.',
    excludes: 'No muestra estilos ni componentes: solo la consulta y su evidencia.',
    rows: [
      { k: 'Sentencia', v: 'SELECT · journal_lines, accounts' },
      { k: 'Driver', v: 'mysql2 · MySQL · contabilidad' },
      { k: 'Ejecutada', v: '23:42:35 · 3 veces' },
      { k: 'Correlación', v: 'directa · misma sentencia o línea SQL ejecutada' },
      { k: 'Muestra', v: '22 filas · 7 columnas · muestra recortada' },
    ],
    width: 414,
    height: 661,
  },
];

export const CHAIN = [
  { id: 'elemento', label: 'Elemento', sub: 'button.text-button', mode: 'htmlcss', color: 'var(--c-blue)' },
  { id: 'handler', label: 'Manejador', sub: 'handleSubmit', mode: 'frontend', color: 'var(--c-violet)' },
  { id: 'request', label: 'Petición', sub: 'GET /api/accounts', mode: 'json', color: 'var(--c-cyan)' },
  { id: 'route', label: 'Ruta', sub: 'index.js:3376', mode: 'backend', color: 'var(--c-green)' },
  { id: 'sql', label: 'SQL', sub: 'SELECT · 2 tablas', mode: 'sql', color: 'var(--c-teal)' },
  { id: 'db', label: 'Base de datos', sub: 'MySQL · contabilidad', mode: 'sql', color: 'var(--c-amber)' },
];

export const FEATURES = [
  {
    icon: 'cursor',
    color: 'var(--c-blue)',
    title: 'Selección exacta, sin robar el puntero',
    body: 'Hover y clic usan la referencia real del evento, también en Shadow DOM. El tooltip no intercepta el ratón: se cruza rápido sin congelar el hover. Shift lo muestra, Ctrl lo fija y Esc lo suelta.',
    tag: 'INSPECCIÓN',
  },
  {
    icon: 'link',
    color: 'var(--c-violet)',
    title: 'Cada archivo:línea es un enlace',
    body: 'Panel, mapa, registro, consola y cronología enlazan al código. Al pulsar, el editor abre el archivo y marca el rango completo de la función, de la línea inicial a endLine.',
    tag: 'EDITOR',
  },
  {
    icon: 'braces',
    color: 'var(--c-cyan)',
    title: 'JSON del backend, haya clic o no',
    body: 'Node Inspector instrumenta el proceso y registra http, https, fetch, JSON.parse y JSON.stringify. Cada movimiento trae hora, tipo, método, ruta, estado, repeticiones y ubicación.',
    tag: 'RUNTIME',
  },
  {
    icon: 'database',
    color: 'var(--c-teal)',
    title: 'Rejillas SQL dentro del lienzo',
    body: 'Las tablas no viven en otra vista: son nodos del mismo grafo con columnas, usos apilados y celdas reales. Clic en una celda traza el dato hasta la consulta, o desde ella si es escritura.',
    tag: 'SQL',
  },
  {
    icon: 'activity',
    color: 'var(--c-green)',
    title: 'Ciclo de vida real de cada petición',
    body: 'Enviada y esperando, enviada sin respuesta (ERR), respuesta con código y frase, o respuesta con ejecución del backend capturada. Se busca por 404, «No encontrado», 4xx, 5xx, pendiente o ERR.',
    tag: 'RED',
  },
  {
    icon: 'terminal',
    color: 'var(--c-amber)',
    title: 'Consola de los dos lados',
    body: 'console.log, avisos, errores y excepciones de la página más el stdout y stderr del backend, ordenados por hora con milisegundos y ubicación. Filtros Todo, Frontend, Backend y Solo problemas.',
    tag: 'CONSOLA',
  },
  {
    icon: 'layers',
    color: 'var(--c-magenta)',
    title: 'Tres órdenes del mismo grafo',
    body: 'Cronológico apila por hora de primera aparición. Estructural conserva columnas por categoría y ordena por archivo y línea. Jerárquico dibuja un árbol de archivos con los hijos a ambos lados.',
    tag: 'MAPA',
  },
  {
    icon: 'edit',
    color: 'var(--c-blue)',
    title: 'Edición con guardado explícito',
    body: 'Monaco editable con Ctrl+S, aviso de «Sin guardar» y confirmación al cerrar. Una sola ruta atómica dentro de la raíz abierta, sobre archivos existentes y conservando sus permisos.',
    tag: 'CÓDIGO',
  },
  {
    icon: 'gauge',
    color: 'var(--c-cyan)',
    title: 'Peso medido, no estimado',
    body: 'Cada nodo enseña sus bytes reales: el rango de líneas o el archivo en código, la muestra observada en tablas y los cuerpos conservados en peticiones. Si no se puede medir, lo declara.',
    tag: 'MEDIDA',
  },
  {
    icon: 'shield',
    color: 'var(--c-red)',
    title: 'Auditoría del código entregado',
    body: 'Revisa HTML, CSS y JS servidos al navegador y las peticiones capturadas: exposición del servidor, HTTP sin cifrar, secretos con formato conocido y sumideros DOM en código propio.',
    tag: 'SEGURIDAD',
  },
  {
    icon: 'window',
    color: 'var(--c-violet)',
    title: 'Navegador integrado y aislado',
    body: 'Ventana propia con barra de URL o vista embebida. La aplicación inspeccionada corre sin acceso a IPC, Node ni al sistema de archivos, y solo se navega a orígenes locales o permitidos.',
    tag: 'AISLAMIENTO',
  },
  {
    icon: 'badge',
    color: 'var(--c-green)',
    title: 'Evidencia STATIC o RUNTIME',
    body: 'Cada dato se etiqueta con su origen. El código detectado nunca se presenta como ejecutado, y una correlación por nombre de función se rotula heurística en lugar de directa.',
    tag: 'HONESTIDAD',
  },
];

export type Finding = {
  severity: 'alta' | 'media' | 'baja' | 'info';
  rule: string;
  detail: string;
  source: string;
  evidence: string;
};

export const FINDINGS: Finding[] = [
  {
    severity: 'alta',
    rule: 'secret.stripe-live',
    detail: 'Clave secreta de Stripe con formato conocido en el bundle del cliente.',
    source: 'frontend/src/lib/billing.js:12',
    evidence: 'sk_live_••••••••••••••••••••4f2a',
  },
  {
    severity: 'alta',
    rule: 'sink.inner-html',
    detail: 'Sumidero DOM: contenido de la respuesta insertado sin sanear en código propio.',
    source: 'frontend/src/modules/Report.jsx:88',
    evidence: 'node.innerHTML = payload.html',
  },
  {
    severity: 'media',
    rule: 'exposure.private-host',
    detail: 'IP privada del backend expuesta en el JavaScript entregado al navegador.',
    source: 'frontend/src/api/client.js:4',
    evidence: 'baseURL = "http://192.168.1.24:4000"',
  },
  {
    severity: 'media',
    rule: 'transport.http',
    detail: 'Petición capturada sin cifrar hacia el host del backend configurado.',
    source: 'GET /api/accounts · 23:42:35',
    evidence: 'http://localhost:4000/api/accounts',
  },
  {
    severity: 'media',
    rule: 'secret.jwt',
    detail: 'Token JWT literal en un módulo servido al cliente; se muestra enmascarado.',
    source: 'frontend/src/mock/session.js:9',
    evidence: 'eyJhbGciOi••••••••••••••••••••',
  },
  {
    severity: 'baja',
    rule: 'exposure.localhost',
    detail: 'Referencia a localhost en el HTML serializado; habitual en desarrollo.',
    source: 'documento · línea serializada 214',
    evidence: '<script src="http://127.0.0.1:5173/@vite/client">',
  },
  {
    severity: 'baja',
    rule: 'sink.eval',
    detail: 'Uso de new Function en código propio; revisar el origen de la cadena evaluada.',
    source: 'frontend/src/utils/formula.js:31',
    evidence: 'new Function("row", expr)',
  },
  {
    severity: 'info',
    rule: 'exposure.local-domain',
    detail: 'Dominio .local declarado en una petición de fondo capturada en la sesión.',
    source: 'GET /api/health · FONDO',
    evidence: 'http://api.local:4000/health',
  },
];

export const STACK = [
  {
    label: 'Rutas del backend',
    color: 'var(--c-green)',
    note: 'Índice estático con función, archivo y línea',
    items: ['Express', 'Fastify', 'FastAPI', 'Flask'],
  },
  {
    label: 'Procedencia en el cliente',
    color: 'var(--c-violet)',
    note: '_debugSource en React 18 · _debugStack y source map inline en React 19.1+',
    items: ['React 18', 'React 19.1+', 'Vue', 'Shadow DOM'],
  },
  {
    label: 'Drivers instrumentados',
    color: 'var(--c-teal)',
    note: 'Captura de cada ejecución SQL dentro del proceso Node',
    items: ['pg', 'mysql2', 'mysql', 'mariadb', 'mssql', 'sqlite3', 'better-sqlite3'],
  },
  {
    label: 'Análisis estático de SQL',
    color: 'var(--c-cyan)',
    note: 'Tablas y columnas declaradas, con su uso por consulta',
    items: ['MySQL', 'PostgreSQL', 'SQLite'],
  },
  {
    label: 'Captura de red',
    color: 'var(--c-blue)',
    note: 'CDP en el navegador integrado y Node Inspector en el backend',
    items: ['http', 'https', 'fetch', 'JSON.parse', 'JSON.stringify'],
  },
  {
    label: 'Base de la aplicación',
    color: 'var(--c-amber)',
    note: 'Monorepo con npm workspaces y TypeScript estricto',
    items: ['Electron', 'TypeScript', 'Monaco', 'Vitest', 'Playwright'],
  },
];

export const ARCHITECTURE = [
  {
    path: 'apps/desktop',
    role: 'Aplicación Electron: proceso principal, preload, preloads y UI',
    color: 'var(--c-blue)',
  },
  {
    path: 'packages/core/protocol',
    role: 'Tipos, canales y esquemas del protocolo IPC',
    color: 'var(--c-violet)',
  },
  {
    path: 'packages/browser/network-capture',
    role: 'Captura y normalización del tráfico de red',
    color: 'var(--c-cyan)',
  },
  {
    path: 'packages/analysis/routes',
    role: 'Índice estático de rutas del backend',
    color: 'var(--c-green)',
  },
  {
    path: 'packages/analysis/sql-analyzer',
    role: 'Análisis estático de consultas SQL',
    color: 'var(--c-teal)',
  },
];

export const GUARANTEES = [
  {
    title: 'Raíz explícita, no todo el disco',
    body: 'El acceso queda limitado a la carpeta abierta, validada con realpath. Las ubicaciones fuera de esa raíz se rechazan.',
  },
  {
    title: 'Secretos y cabeceras enmascarados',
    body: 'authorization, cookie, set-cookie, x-api-key y cualquier nombre con password, token, secret, jwt o session nunca se muestran en claro.',
  },
  {
    title: 'Los cuerpos no salen de la memoria',
    body: 'Los JSON completos se limitan a 16 000 caracteres y jamás se escriben en disco ni se exportan. Los archivos .env y las claves no se indexan.',
  },
  {
    title: 'Apagada queda inerte',
    body: 'Sin inspección no hay escaneo de página, ni dominios Debugger o CSS de CDP, ni socket al inspector de Node. Al encenderla la conexión es nueva.',
  },
  {
    title: 'Sin telemetría, sin IA por defecto',
    body: 'El proveedor de IA está desactivado de origen y ningún dato del proyecto se envía a un tercero. El análisis de seguridad no sale del equipo.',
  },
  {
    title: 'Loopback y lista blanca',
    body: 'Los servidores internos escuchan solo en loopback y la navegación se limita a orígenes locales o añadidos expresamente a la lista permitida.',
  },
];

export const LIMITS = [
  {
    title: 'Prisma no expone su SQL',
    body: 'Usa un motor propio y no pasa por los drivers de Node: se muestra el análisis estático, pero no la consulta observada ni sus filas.',
  },
  {
    title: 'La correlación tiene ventana',
    body: 'Evento y petición se asocian en una ventana de 3 s. Solo es directa cuando la pila iniciadora comparte archivo:línea:columna con el manejador; si no, se rotula heurística.',
  },
  {
    title: 'Tirones al interactuar, aún abiertos',
    body: 'Con ciertas aplicaciones la ventana puede bloquearse un tiempo al pulsar un control. Se redujo el trabajo automático, pero el problema no está reproducido ni corregido del todo.',
  },
  {
    title: 'La auditoría es textual',
    body: 'No es un SAST ni un DAST: una coincidencia no confirma una vulnerabilidad y un valor construido en ejecución puede no aparecer.',
  },
  {
    title: 'Windows es lo verificado',
    body: 'Desarrollado y probado en Windows 10/11. Electron permite macOS y Linux, pero esta versión no se ha verificado allí.',
  },
  {
    title: 'Sin inspector no hay filas',
    body: 'Las celdas reales exigen Node Inspector conectado o un backend arrancado con --inspect. Sin él, el mapa lo advierte en lugar de inventar valores.',
  },
];