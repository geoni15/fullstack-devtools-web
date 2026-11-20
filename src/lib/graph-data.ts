export type Kind = 'control' | 'handler' | 'request' | 'route' | 'sql' | 'table';
export type EdgeKind = 'send' | 'recv' | 'gateway' | 'server' | 'write';

export type GNode = {
  id: string;
  kind: Kind;
  title: string;
  sub: string;
  at: number;
  clock: string;
  file: string;
  line: number;
  evidence: 'STATIC' | 'RUNTIME';
  count: number;
  countLabel: string;
  bytes: string;
  interacted: boolean;
  status?: string;
  op?: 'read' | 'write';
  detail: [string, string][];
  columns?: { name: string; uses: string[] }[];
  rows?: string[][];
};

export type GEdge = { from: string; to: string; kind: EdgeKind; heuristic?: boolean };

export const KIND_LABEL: Record<Kind, string> = {
  control: 'CONTROL',
  handler: 'MANEJADOR',
  request: 'PETICIÓN',
  route: 'RUTA',
  sql: 'SQL',
  table: 'TABLA',
};

export const KIND_SHORT: Record<Kind, string> = {
  control: 'CTRL',
  handler: 'HANDLER',
  request: 'REQ',
  route: 'RUTA',
  sql: 'SQL',
  table: 'TABLA',
};

export const KIND_COLOR: Record<Kind, string> = {
  control: 'var(--c-blue)',
  handler: 'var(--c-violet)',
  request: 'var(--c-cyan)',
  route: 'var(--c-green)',
  sql: 'var(--c-teal)',
  table: 'var(--c-amber)',
};

export const EDGE_COLOR: Record<EdgeKind, string> = {
  send: 'var(--c-blue)',
  recv: 'var(--c-green)',
  gateway: 'var(--c-amber)',
  server: 'var(--c-violet)',
  write: 'var(--c-magenta)',
};

export const COLUMNS: { kind: Kind; label: string }[] = [
  { kind: 'control', label: 'CONTROLES' },
  { kind: 'handler', label: 'MANEJADORES' },
  { kind: 'request', label: 'PETICIONES' },
  { kind: 'route', label: 'RUTAS' },
  { kind: 'sql', label: 'SQL' },
  { kind: 'table', label: 'TABLAS' },
];

const LEDGER_COLS = [
  { name: 'id', uses: ['SELECT', 'ORDER'] },
  { name: 'entry_id', uses: ['SELECT', 'WHERE'] },
  { name: 'account_id', uses: ['SELECT', 'JOIN'] },
  { name: 'debit', uses: ['SELECT'] },
];

export const NODES: GNode[] = [
  {
    id: 'c1',
    kind: 'control',
    title: 'Editar',
    sub: 'button.text-button',
    at: 215,
    clock: '23:42:35',
    file: 'AccountingLedgerPanel.jsx',
    line: 360,
    evidence: 'RUNTIME',
    count: 3,
    countLabel: 'Interacciones',
    bytes: '412 B',
    interacted: true,
    detail: [
      ['Selector', 'button.text-button'],
      ['Eventos', 'click ×3'],
      ['Render', 'AccountingLedgerPanel.jsx:360:35'],
      ['Caja', '66 × 34 px · inline-block'],
    ],
  },
  {
    id: 'c2',
    kind: 'control',
    title: 'Iniciar sesión',
    sub: 'form#login',
    at: 207,
    clock: '23:42:27',
    file: 'LoginPanel.jsx',
    line: 48,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Interacciones',
    bytes: '864 B',
    interacted: true,
    detail: [
      ['Selector', 'form#login'],
      ['Eventos', 'submit ×1 · click ×1'],
      ['Destino', 'action=/api/auth/login'],
      ['Campos', 'usuario · contraseña (valores no capturados)'],
    ],
  },
  {
    id: 'c3',
    kind: 'control',
    title: 'Contabilidad',
    sub: 'a.nav-item',
    at: 50,
    clock: '23:39:50',
    file: 'Sidebar.jsx',
    line: 92,
    evidence: 'RUNTIME',
    count: 2,
    countLabel: 'Interacciones',
    bytes: '386 B',
    interacted: true,
    detail: [
      ['Selector', 'a.nav-item'],
      ['Eventos', 'click ×2 · hover ×4'],
      ['Destino', 'href=/app/contabilidad'],
      ['Caja', '188 × 32 px · block'],
    ],
  },
  {
    id: 'c4',
    kind: 'control',
    title: 'Eliminar asiento',
    sub: 'button.danger-button',
    at: 72,
    clock: '23:40:12',
    file: 'LedgerRow.jsx',
    line: 141,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Interacciones',
    bytes: '402 B',
    interacted: false,
    detail: [
      ['Selector', 'button.danger-button'],
      ['Eventos', 'inventariado, sin interacción'],
      ['Resolución', 'manejador detectado en el código'],
      ['Evidencia', 'STATIC · no se observó ejecución'],
    ],
  },
  {
    id: 'h1',
    kind: 'handler',
    title: 'onClick · Editar',
    sub: 'async (e) =>',
    at: 215,
    clock: '23:42:35',
    file: 'AccountingDashboard.jsx',
    line: 152,
    evidence: 'RUNTIME',
    count: 3,
    countLabel: 'Ejecuciones',
    bytes: '1.2 KB',
    interacted: true,
    detail: [
      ['Firma', 'async (e) =>'],
      ['Perfil', 'async · await · flecha'],
      ['Pila', 'AccountingDashboard.jsx:152 → :215'],
      ['Correlación', 'directa · misma ubicación archivo:línea'],
    ],
  },
  {
    id: 'h2',
    kind: 'handler',
    title: 'handleSubmit',
    sub: 'async (e) => · try/catch',
    at: 207,
    clock: '23:42:27',
    file: 'LoginPanel.jsx',
    line: 48,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Ejecuciones',
    bytes: '2.4 KB',
    interacted: true,
    detail: [
      ['Firma', 'async (e) =>'],
      ['Perfil', 'async · await · try/catch'],
      ['Props', 'onSuccess · redirect'],
      ['Ubicación', 'LoginPanel.jsx:48'],
    ],
  },
  {
    id: 'h3',
    kind: 'handler',
    title: 'navigate',
    sub: '(to) =>',
    at: 50,
    clock: '23:39:50',
    file: 'router.jsx',
    line: 22,
    evidence: 'RUNTIME',
    count: 2,
    countLabel: 'Ejecuciones',
    bytes: '640 B',
    interacted: true,
    detail: [
      ['Firma', '(to) =>'],
      ['Perfil', 'flecha'],
      ['Correlación', 'heurística · coincide el nombre de la función'],
      ['Ubicación', 'router.jsx:22'],
    ],
  },
  {
    id: 'h4',
    kind: 'handler',
    title: 'handleDelete',
    sub: 'async (id) =>',
    at: 72,
    clock: '23:40:12',
    file: 'LedgerRow.jsx',
    line: 141,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Ejecuciones',
    bytes: '980 B',
    interacted: false,
    detail: [
      ['Firma', 'async (id) =>'],
      ['Perfil', 'async · await · try/catch'],
      ['Origen', 'listener leído del código, no observado'],
      ['Ubicación', 'LedgerRow.jsx:141'],
    ],
  },
  {
    id: 'r1',
    kind: 'request',
    title: 'GET /api/accounts',
    sub: '200 · OK · 130 ms',
    at: 215,
    clock: '23:42:35',
    file: 'AccountingDashboard.jsx',
    line: 215,
    evidence: 'RUNTIME',
    count: 3,
    countLabel: 'Peticiones',
    bytes: '4.8 KB',
    interacted: true,
    status: '200',
    detail: [
      ['Estado', '200 · OK · respuesta recibida'],
      ['Origen', 'CLIC · correlación directa'],
      ['Cuerpos', 'enviado 0 B · recibido 4.8 KB'],
      ['Ejecución', 'backend capturado por Node Inspector'],
    ],
  },
  {
    id: 'r2',
    kind: 'request',
    title: 'POST /api/auth/login',
    sub: '200 · OK · 218 ms',
    at: 207,
    clock: '23:42:27',
    file: 'LoginPanel.jsx',
    line: 61,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Peticiones',
    bytes: '1.5 KB',
    interacted: true,
    status: '200',
    detail: [
      ['Estado', '200 · OK · respuesta recibida'],
      ['Origen', 'CLIC · submit del formulario'],
      ['Cuerpos', 'enviado 43 B · recibido 1.5 KB'],
      ['MIME', 'application/json'],
    ],
  },
  {
    id: 'r3',
    kind: 'request',
    title: 'GET /api/fiscal-periods',
    sub: '404 · No encontrado · 96 ms',
    at: 50,
    clock: '23:39:50',
    file: 'router.jsx',
    line: 40,
    evidence: 'RUNTIME',
    count: 2,
    countLabel: 'Peticiones',
    bytes: '312 B',
    interacted: true,
    status: '404',
    detail: [
      ['Estado', '404 · No encontrado'],
      ['Origen', 'CLIC · navegación'],
      ['Cuerpos', 'enviado 0 B · recibido 312 B'],
      ['Ejecución', 'ruta ejecutada, respuesta de error'],
    ],
  },
  {
    id: 'r4',
    kind: 'request',
    title: 'DELETE /api/entries/42',
    sub: 'ERR · sin respuesta',
    at: 72,
    clock: '23:40:12',
    file: 'LedgerRow.jsx',
    line: 150,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Peticiones',
    bytes: 'no medible',
    interacted: false,
    status: 'ERR',
    detail: [
      ['Estado', 'ERR · enviada sin respuesta'],
      ['Origen', 'destino declarado en el código'],
      ['Cuerpos', 'sin cuerpo conservado'],
      ['Evidencia', 'STATIC · no se observó tráfico'],
    ],
  },
  {
    id: 'b1',
    kind: 'route',
    title: 'GET /api/accounts',
    sub: 'express · async (req, res) =>',
    at: 215,
    clock: '23:42:35',
    file: 'backend/index.js',
    line: 3376,
    evidence: 'RUNTIME',
    count: 3,
    countLabel: 'Peticiones recibidas',
    bytes: '1.1 KB',
    interacted: true,
    detail: [
      ['Manejador', 'async (req, res) =>'],
      ['Rango', '3376–3379'],
      ['Código', 'const accounts = await getVisibleAccounts(pool, req)'],
      ['Ejecución N2', 'pausa disponible en el manejador'],
    ],
  },
  {
    id: 'b2',
    kind: 'route',
    title: 'POST /api/auth/login',
    sub: 'express · async (req, res) =>',
    at: 207,
    clock: '23:42:27',
    file: 'backend/index.js',
    line: 2045,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Peticiones recibidas',
    bytes: '2.2 KB',
    interacted: true,
    detail: [
      ['Manejador', 'async (req, res) =>'],
      ['Rango', '2045–2117'],
      ['Consultas', '1 SELECT sobre users, companies'],
      ['Cuerpo', '{ token, user } · 1.5 KB'],
    ],
  },
  {
    id: 'b3',
    kind: 'route',
    title: 'GET /api/fiscal-periods',
    sub: 'express · (req, res) =>',
    at: 50,
    clock: '23:39:50',
    file: 'backend/index.js',
    line: 3232,
    evidence: 'RUNTIME',
    count: 2,
    countLabel: 'Peticiones recibidas',
    bytes: '820 B',
    interacted: true,
    detail: [
      ['Manejador', '(req, res) =>'],
      ['Rango', '3232–3251'],
      ['Respuesta', '404 · periodo inexistente'],
      ['Consultas', 'la sentencia no llegó a ejecutarse'],
    ],
  },
  {
    id: 'b4',
    kind: 'route',
    title: 'DELETE /api/entries/:id',
    sub: 'express · async (req, res) =>',
    at: 72,
    clock: '23:40:12',
    file: 'backend/index.js',
    line: 4120,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Peticiones recibidas',
    bytes: '1.4 KB',
    interacted: false,
    detail: [
      ['Manejador', 'async (req, res) =>'],
      ['Rango', '4120–4148'],
      ['Consultas', '1 DELETE sobre journal_lines'],
      ['Evidencia', 'STATIC · índice de rutas'],
    ],
  },
  {
    id: 'q1',
    kind: 'sql',
    title: 'SELECT · journal_lines, accounts',
    sub: 'mysql2 · 22 filas',
    at: 215,
    clock: '23:42:35',
    file: 'backend/index.js',
    line: 4706,
    evidence: 'RUNTIME',
    count: 3,
    countLabel: 'Consultas ejecutadas',
    bytes: '6.4 KB',
    interacted: true,
    op: 'read',
    detail: [
      ['Sentencia', 'SELECT · OBSERVADA'],
      ['Driver', 'mysql2 · MySQL · contabilidad'],
      ['Correlación', 'directa · misma sentencia o línea SQL'],
      ['Muestra', '22 filas · 7 columnas'],
    ],
  },
  {
    id: 'q2',
    kind: 'sql',
    title: 'SELECT · users, companies',
    sub: 'mysql2 · 1 fila',
    at: 207,
    clock: '23:42:27',
    file: 'backend/index.js',
    line: 2117,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Consultas ejecutadas',
    bytes: '1.5 KB',
    interacted: true,
    op: 'read',
    detail: [
      ['Sentencia', 'SELECT · OBSERVADA'],
      ['Driver', 'mysql2 · MySQL · contabilidad'],
      ['Sitio', 'backend/index.js:2117:29'],
      ['Muestra', '1 fila · 12 columnas'],
    ],
  },
  {
    id: 'q3',
    kind: 'sql',
    title: 'SELECT · periods',
    sub: 'detectada, sin ejecutar',
    at: 50,
    clock: '23:39:50',
    file: 'backend/index.js',
    line: 3240,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Consultas ejecutadas',
    bytes: '460 B',
    interacted: true,
    op: 'read',
    detail: [
      ['Sentencia', 'SELECT · análisis estático'],
      ['Dialecto', 'mysql'],
      ['Sitio', 'backend/index.js:3240'],
      ['Muestra', 'sin filas: la consulta no se observó'],
    ],
  },
  {
    id: 'q4',
    kind: 'sql',
    title: 'DELETE · journal_lines',
    sub: 'detectada, sin ejecutar',
    at: 72,
    clock: '23:40:12',
    file: 'backend/index.js',
    line: 4131,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Consultas ejecutadas',
    bytes: '280 B',
    interacted: false,
    op: 'write',
    detail: [
      ['Sentencia', 'DELETE FROM journal_lines WHERE entry_id = ?'],
      ['Dialecto', 'mysql'],
      ['Sitio', 'backend/index.js:4131'],
      ['Muestra', 'sin filas: escritura no observada'],
    ],
  },
  {
    id: 't1',
    kind: 'table',
    title: 'journal_lines',
    sub: 'MySQL · contabilidad',
    at: 215,
    clock: '23:42:35',
    file: 'backend/index.js',
    line: 4706,
    evidence: 'RUNTIME',
    count: 22,
    countLabel: 'Filas observadas',
    bytes: '3.1 KB',
    interacted: true,
    detail: [
      ['Base', 'MySQL · contabilidad'],
      ['Usos', 'SELECT · JOIN · WHERE · ORDER · DELETE'],
      ['Muestra', '22 filas · 7 columnas · recortada'],
      ['Origen', 'celdas tal como las devolvió el driver'],
    ],
    columns: LEDGER_COLS,
    rows: [
      ['1041', '88', '2100', '32500.00'],
      ['1042', '88', '5100', '0.00'],
      ['1043', '89', '2300', '1500.00'],
    ],
  },
  {
    id: 't2',
    kind: 'table',
    title: 'accounts',
    sub: 'MySQL · contabilidad',
    at: 216,
    clock: '23:42:35',
    file: 'backend/index.js',
    line: 4708,
    evidence: 'RUNTIME',
    count: 22,
    countLabel: 'Filas observadas',
    bytes: '2.4 KB',
    interacted: true,
    detail: [
      ['Base', 'MySQL · contabilidad'],
      ['Usos', 'SELECT · JOIN · WHERE'],
      ['Muestra', '22 filas · 7 columnas'],
      ['Origen', 'ejecución observada en mysql2'],
    ],
    columns: [
      { name: 'code', uses: ['SELECT', 'ORDER'] },
      { name: 'name', uses: ['SELECT'] },
      { name: 'company_id', uses: ['WHERE'] },
      { name: 'book_id', uses: ['WHERE'] },
    ],
    rows: [
      ['2100', 'Cuentas por pagar', '1', '1'],
      ['5100', 'Gastos financieros', '1', '1'],
    ],
  },
  {
    id: 't3',
    kind: 'table',
    title: 'users',
    sub: 'MySQL · contabilidad',
    at: 207,
    clock: '23:42:27',
    file: 'backend/index.js',
    line: 2117,
    evidence: 'RUNTIME',
    count: 1,
    countLabel: 'Filas observadas',
    bytes: '1.5 KB',
    interacted: true,
    detail: [
      ['Base', 'MySQL · contabilidad'],
      ['Usos', 'SELECT · WHERE'],
      ['Muestra', '1 fila · 12 columnas'],
      ['Nota', 'los valores se muestran sin enmascarar'],
    ],
    columns: [
      { name: 'id', uses: ['SELECT'] },
      { name: 'username', uses: ['SELECT', 'WHERE'] },
      { name: 'role_name', uses: ['SELECT'] },
    ],
    rows: [['1', 'admin', 'OWNER']],
  },
  {
    id: 't4',
    kind: 'table',
    title: 'periods',
    sub: 'MySQL · contabilidad',
    at: 50,
    clock: '23:39:50',
    file: 'backend/index.js',
    line: 3240,
    evidence: 'STATIC',
    count: 0,
    countLabel: 'Filas observadas',
    bytes: 'no medible',
    interacted: true,
    detail: [
      ['Base', 'MySQL · inferida del dialecto'],
      ['Usos', 'SELECT · WHERE'],
      ['Muestra', 'sin filas: no hubo ejecución'],
      ['Evidencia', 'STATIC · análisis del código'],
    ],
    columns: [
      { name: 'id', uses: ['SELECT'] },
      { name: 'name', uses: ['SELECT'] },
      { name: 'status', uses: ['WHERE'] },
    ],
  },
];

export const EDGES: GEdge[] = [
  { from: 'c1', to: 'h1', kind: 'send' },
  { from: 'c2', to: 'h2', kind: 'send' },
  { from: 'c3', to: 'h3', kind: 'send' },
  { from: 'c4', to: 'h4', kind: 'send', heuristic: true },
  { from: 'h1', to: 'r1', kind: 'send' },
  { from: 'h2', to: 'r2', kind: 'send' },
  { from: 'h3', to: 'r3', kind: 'send', heuristic: true },
  { from: 'h4', to: 'r4', kind: 'send', heuristic: true },
  { from: 'r1', to: 'b1', kind: 'gateway' },
  { from: 'r2', to: 'b2', kind: 'gateway' },
  { from: 'r3', to: 'b3', kind: 'gateway' },
  { from: 'r4', to: 'b4', kind: 'gateway', heuristic: true },
  { from: 'b1', to: 'q1', kind: 'server' },
  { from: 'b2', to: 'q2', kind: 'server' },
  { from: 'b3', to: 'q3', kind: 'server', heuristic: true },
  { from: 'b4', to: 'q4', kind: 'server', heuristic: true },
  { from: 't1', to: 'q1', kind: 'recv' },
  { from: 't2', to: 'q1', kind: 'recv' },
  { from: 't3', to: 'q2', kind: 'recv' },
  { from: 't4', to: 'q3', kind: 'recv', heuristic: true },
  { from: 'q4', to: 't1', kind: 'write', heuristic: true },
];

export const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]));

/** Topology follows the data, so a read edge is traversed from the query to the table. */
const TOPO = EDGES.map((e) => (e.kind === 'recv' ? { from: e.to, to: e.from } : { from: e.from, to: e.to }));

const forward = new Map<string, string[]>();
const backward = new Map<string, string[]>();
for (const e of TOPO) {
  forward.set(e.from, [...(forward.get(e.from) ?? []), e.to]);
  backward.set(e.to, [...(backward.get(e.to) ?? []), e.from]);
}

const walk = (start: string[], map: Map<string, string[]>): Set<string> => {
  const seen = new Set<string>();
  const stack = [...start];
  while (stack.length) {
    const id = stack.pop() as string;
    for (const next of map.get(id) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen;
};

export const descendants = (id: string) => walk([id], forward);
export const ancestors = (id: string) => walk([id], backward);
export const chainOf = (id: string) => new Set<string>([id, ...descendants(id), ...ancestors(id)]);

export const INTERACTED_CHAIN = (() => {
  const roots = NODES.filter((n) => n.kind === 'control' && n.interacted).map((n) => n.id);
  const set = walk(roots, forward);
  roots.forEach((r) => set.add(r));
  return set;
})();