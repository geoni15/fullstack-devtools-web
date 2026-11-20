import {
  COLUMNS,
  EDGES,
  EDGE_COLOR,
  INTERACTED_CHAIN,
  KIND_COLOR,
  KIND_LABEL,
  KIND_SHORT,
  NODES,
  NODE_BY_ID,
  chainOf,
  descendants,
  type GNode,
  type Kind,
} from './graph-data';

type Scope = 'all' | 'interacted';
type SqlFilter = 'all' | 'read' | 'write';
type Order = 'chrono' | 'structural';
type Status = 'all' | '200' | '404' | '4xx' | 'ERR';

type State = {
  scope: Scope;
  sql: SqlFilter;
  order: Order;
  status: Status;
  query: string;
  compact: boolean;
  zoom: number;
  selected: string | null;
  isolated: string | null;
};

const NW = 160;
const CG = 36;
const GY = 14;
const PAD = 14;
const NH_COMPACT = 54;
const NH_FULL = 104;

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clip = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value);

const matchesStatus = (node: GNode, status: Status) => {
  if (status === 'all') return true;
  if (node.kind !== 'request') return false;
  if (status === '4xx') return node.status?.startsWith('4') ?? false;
  return node.status === status;
};

const matchesQuery = (node: GNode, query: string) => {
  if (!query) return true;
  const haystack = [node.title, node.sub, node.file, KIND_LABEL[node.kind], node.status ?? '', node.countLabel]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};

export function mountGraph(root: HTMLElement) {
  const canvas = root.querySelector<HTMLElement>('[data-graph-canvas]');
  const svg = root.querySelector<SVGSVGElement>('[data-graph-svg]');
  const sizer = root.querySelector<HTMLElement>('[data-graph-sizer]');
  const heads = root.querySelector<HTMLElement>('[data-graph-heads]');
  const headsInner = root.querySelector<HTMLElement>('[data-graph-heads-inner]');
  const detail = root.querySelector<HTMLElement>('[data-graph-detail]');
  const status = root.querySelector<HTMLElement>('[data-graph-status]');
  const menu = root.querySelector<HTMLElement>('[data-graph-menu]');
  const search = root.querySelector<HTMLInputElement>('[data-graph-search]');
  const statusSelect = root.querySelector<HTMLSelectElement>('[data-graph-status-select]');
  const compact = root.querySelector<HTMLInputElement>('[data-graph-compact]');
  const zoomLabel = root.querySelector<HTMLElement>('[data-graph-zoom-label]');

  if (!canvas || !svg || !sizer || !detail || !heads || !headsInner) return;

  const state: State = {
    scope: 'all',
    sql: 'all',
    order: 'chrono',
    status: 'all',
    query: '',
    compact: false,
    zoom: 1,
    selected: null,
    isolated: null,
  };

  const visibleNodes = (): GNode[] => {
    let ids = new Set(NODES.map((n) => n.id));

    if (state.scope === 'interacted') ids = new Set([...ids].filter((id) => INTERACTED_CHAIN.has(id)));

    if (state.sql !== 'all') {
      const queries = NODES.filter((n) => n.kind === 'sql' && n.op === state.sql).map((n) => n.id);
      const keep = new Set<string>(queries);
      for (const q of queries) {
        descendants(q).forEach((id) => keep.add(id));
        chainOf(q).forEach((id) => keep.add(id));
      }
      ids = new Set([...ids].filter((id) => keep.has(id)));
    }

    if (state.status !== 'all') {
      const requests = NODES.filter((n) => matchesStatus(n, state.status)).map((n) => n.id);
      const keep = new Set<string>();
      for (const r of requests) chainOf(r).forEach((id) => keep.add(id));
      ids = new Set([...ids].filter((id) => keep.has(id)));
    }

    if (state.isolated) {
      const chain = chainOf(state.isolated);
      ids = new Set([...ids].filter((id) => chain.has(id)));
    }

    return NODES.filter((n) => ids.has(n.id));
  };

  const comparator = (a: GNode, b: GNode) =>
    state.order === 'chrono'
      ? a.at - b.at || a.file.localeCompare(b.file) || a.line - b.line
      : a.file.localeCompare(b.file) || a.line - b.line || a.at - b.at;

  const renderDetail = () => {
    const node = state.selected ? NODE_BY_ID.get(state.selected) : null;
    if (!node) {
      const shown = visibleNodes();
      const reqs = shown.filter((n) => n.kind === 'request');
      const tally = ['200', '404', 'ERR']
        .map((s) => ({ s, n: reqs.filter((r) => r.status === s).length }))
        .filter((t) => t.n > 0);
      const runtime = shown.filter((n) => n.evidence === 'RUNTIME').length;
      const statusRows = tally
        .map(
          (t, i) =>
            `<div class="fg-row" style="background-color:var(--c-surface${i % 2 ? '' : '-2'})"><dt>${
              t.s === '200' ? '200 · OK' : t.s === '404' ? '404 · No encontrado' : 'ERR · sin respuesta'
            }</dt><dd>${t.n} ${t.n === 1 ? 'petición' : 'peticiones'}</dd></div>`,
        )
        .join('');
      detail.innerHTML = `
        <div class="fg-empty">
          <p class="label" style="color: var(--c-blue)">Detalle del nodo</p>
          <p class="fg-detail-title" style="margin-top:10px">Ningún nodo seleccionado</p>
          <p style="margin-top:12px;font-size:14px;line-height:1.6;color:var(--c-ink-2)">
            Clic izquierdo en un nodo para iluminar toda su cadena —ancestros y descendientes— sin mover el mapa.
            Clic derecho para aislar esa cadena y re-apilar el grafo.
          </p>
          <div class="fg-rows" style="margin-top:16px">
            <div class="fg-row" style="background-color:var(--c-surface-2)"><dt>Alcance</dt><dd>${
              state.scope === 'all' ? 'Todo el tráfico' : 'Solo lo que interactuaste'
            }</dd></div>
            <div class="fg-row" style="background-color:var(--c-surface)"><dt>Orden</dt><dd>${
              state.order === 'chrono' ? 'Cronológico · HH:MM:SS' : 'Estructural · archivo y línea'
            }</dd></div>
            <div class="fg-row" style="background-color:var(--c-surface-2)"><dt>SQL</dt><dd>${
              state.sql === 'all' ? 'Todo' : state.sql === 'read' ? 'Solo lecturas' : 'Solo escrituras'
            }</dd></div>
            <div class="fg-row" style="background-color:var(--c-surface)"><dt>Estado</dt><dd>${
              state.status === 'all' ? 'Todos los estados' : state.status
            }</dd></div>
          </div>
          <p class="label" style="margin:18px 0 8px;color:var(--c-cyan)">Peticiones visibles</p>
          <div class="fg-rows">${
            statusRows ||
            '<div class="fg-row" style="background-color:var(--c-surface-2)"><dt>Sin peticiones</dt><dd>El filtro actual las oculta</dd></div>'
          }</div>
          <p class="label" style="margin:18px 0 8px;color:var(--c-green)">Procedencia</p>
          <div class="fg-rows">
            <div class="fg-row" style="background-color:var(--c-surface-2)"><dt>RUNTIME</dt><dd>${runtime} nodos observados en ejecución</dd></div>
            <div class="fg-row" style="background-color:var(--c-surface)"><dt>STATIC</dt><dd>${
              shown.length - runtime
            } nodos leídos del código</dd></div>
          </div>
        </div>`;
      return;
    }

    const color = KIND_COLOR[node.kind];
    const rows = node.detail
      .map(
        ([k, v], i) =>
          `<div class="fg-row" style="background-color:var(--c-surface${i % 2 ? '' : '-2'})"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`,
      )
      .join('');

    let grid = '';
    if (node.kind === 'table') {
      if (node.rows?.length && node.columns?.length) {
        const head = node.columns
          .map((c) => `<th>${esc(c.name)}${c.uses.map((u) => `<span>${esc(u)}</span>`).join('')}</th>`)
          .join('');
        const body = node.rows
          .map(
            (row, i) =>
              `<tr><td>${i + 1}</td>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`,
          )
          .join('');
        grid = `
          <p class="label" style="margin:18px 0 8px;color:var(--c-teal)">Rejilla SQL · muestra observada</p>
          <div class="scroll-x"><table class="fg-grid"><thead><tr><th>#</th>${head}</tr></thead><tbody>${body}</tbody></table></div>
          <p style="margin-top:8px;font-family:var(--font-mono);font-size:10px;color:var(--c-ink-3)">
            Valores tal como los devolvió el driver, sin enmascarar y solo en memoria.
          </p>`;
      } else {
        grid = `
          <p class="label" style="margin:18px 0 8px;color:var(--c-amber)">Rejilla SQL</p>
          <p style="font-family:var(--font-mono);font-size:11px;line-height:1.6;color:var(--c-ink-2);background-color:var(--c-surface-2);padding:12px">
            Sin filas: la consulta no se observó en ejecución. El mapa lo declara en lugar de inventar valores.
          </p>`;
      }
    }

    detail.innerHTML = `
      <div style="background-color:${color};padding:14px 16px">
        <p class="label" style="color:var(--c-on-accent);opacity:.8">${esc(KIND_LABEL[node.kind])} · ${esc(node.countLabel)} ${node.count}</p>
        <p class="fg-detail-title" style="margin-top:6px;color:var(--c-on-accent)">${esc(node.title)}</p>
      </div>
      <div style="padding:16px">
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:14px">
          <span class="label" style="padding:5px 9px;background-color:${node.evidence === 'RUNTIME' ? 'var(--c-green)' : 'var(--c-surface-3)'};color:${node.evidence === 'RUNTIME' ? 'var(--c-on-accent)' : 'var(--c-ink-2)'}">${node.evidence}</span>
          <span class="label" style="padding:5px 9px;background-color:var(--c-surface-2);color:var(--c-ink-2)">${esc(node.clock)}</span>
          <span class="label" style="padding:5px 9px;background-color:var(--c-surface-2);color:var(--c-ink-2)">${esc(node.bytes)}</span>
          ${node.status ? `<span class="label" style="padding:5px 9px;background-color:${node.status === '200' ? 'var(--c-green)' : node.status === '404' ? 'var(--c-amber)' : 'var(--c-red)'};color:var(--c-on-accent)">${esc(node.status)}</span>` : ''}
        </div>
        <div class="fg-rows">${rows}</div>
        <p style="margin-top:14px;font-family:var(--font-mono);font-size:11px;color:var(--c-blue)">${esc(node.file)}:${node.line}</p>
        ${grid}
      </div>`;
  };

  const render = () => {
    const nodes = visibleNodes();
    const nodeHeight = state.compact ? NH_COMPACT : NH_FULL;
    const byId = new Map<string, { x: number; y: number; node: GNode }>();

    const columns = COLUMNS.map((column) => ({
      ...column,
      nodes: nodes.filter((n) => n.kind === column.kind).sort(comparator),
    }));

    columns.forEach((column, ci) => {
      column.nodes.forEach((node, ri) => {
        byId.set(node.id, { x: PAD + ci * (NW + CG), y: PAD + ri * (nodeHeight + GY), node });
      });
    });

    const maxRows = Math.max(1, ...columns.map((c) => c.nodes.length));
    const width = PAD * 2 + COLUMNS.length * NW + (COLUMNS.length - 1) * CG;
    const height = Math.max(240, PAD * 2 + maxRows * (nodeHeight + GY) - GY);

    const query = state.query.trim().toLowerCase();
    const chain = state.selected ? chainOf(state.selected) : null;
    const dimmed = (id: string) => {
      if (query) return !matchesQuery(NODE_BY_ID.get(id) as GNode, query);
      if (chain) return !chain.has(id);
      return false;
    };

    const markers = (Object.keys(EDGE_COLOR) as (keyof typeof EDGE_COLOR)[])
      .map(
        (kind) =>
          `<marker id="fg-ar-${kind}" markerWidth="8" markerHeight="8" refX="7.5" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 z" fill="${EDGE_COLOR[kind]}"/></marker>`,
      )
      .join('');

    const edgeSvg = EDGES.filter((e) => byId.has(e.from) && byId.has(e.to))
      .map((e) => {
        const a = byId.get(e.from) as { x: number; y: number };
        const b = byId.get(e.to) as { x: number; y: number };
        const back = e.kind === 'recv';
        const y1 = a.y + (back ? nodeHeight * 0.72 : nodeHeight / 2);
        const y2 = b.y + (back ? nodeHeight * 0.72 : nodeHeight / 2);
        const x1 = back ? a.x : a.x + NW;
        const x2 = back ? b.x + NW + 4 : b.x - 4;
        const c1 = back ? x1 - 16 : x1 + (x2 - x1) * 0.45;
        const c2 = back ? x2 + 16 : x2 - (x2 - x1) * 0.45;
        const path = `M${x1} ${y1} C${c1} ${y1} ${c2} ${y2} ${x2} ${y2}`;
        const faded = dimmed(e.from) || dimmed(e.to);
        const opacity = faded ? 0.12 : e.heuristic ? 0.6 : 0.95;
        return `<g opacity="${opacity}"><path d="${path}" fill="none" stroke="${EDGE_COLOR[e.kind]}" stroke-width="1.6"${
          e.heuristic ? ' stroke-dasharray="4 3"' : ''
        } marker-end="url(#fg-ar-${e.kind})"/></g>`;
      })
      .join('');

    const nodeSvg = [...byId.values()]
      .map(({ x, y, node }) => {
        const faded = dimmed(node.id);
        const selected = state.selected === node.id;
        const color = KIND_COLOR[node.kind];
        const countText = node.count > 1 ? ` · ×${node.count}` : '';
        const parts = [
          `<rect class="fg-bg" x="${x}" y="${y}" width="${NW}" height="${nodeHeight}" fill="var(--c-surface${selected ? '-3' : '-2'})"/>`,
          `<rect x="${x}" y="${y}" width="${NW}" height="3" fill="${color}"/>`,
          selected ? `<rect x="${x}" y="${y}" width="3" height="${nodeHeight}" fill="${color}"/>` : '',
          `<text class="fg-kind" x="${x + 9}" y="${y + 17}">${esc(KIND_SHORT[node.kind] + countText)}</text>`,
          `<text class="fg-time" x="${x + NW - 9}" y="${y + 17}" text-anchor="end">${esc(node.clock)}</text>`,
          `<text class="fg-title" x="${x + 9}" y="${y + 32}"${selected ? ` fill="${color}"` : ''}>${esc(clip(node.title, 24))}</text>`,
          `<text class="fg-sub" x="${x + 9}" y="${y + 46}">${esc(clip(node.sub, 30))}</text>`,
        ];
        if (!state.compact) {
          const evColor = node.evidence === 'RUNTIME' ? 'var(--c-green)' : 'var(--c-surface-4)';
          const evText = node.evidence === 'RUNTIME' ? 'var(--c-on-accent)' : 'var(--c-ink-2)';
          parts.push(
            `<rect x="${x + 9}" y="${y + 55}" width="54" height="14" fill="${evColor}"/>`,
            `<text class="fg-chip" x="${x + 14}" y="${y + 65}" fill="${evText}">${node.evidence}</text>`,
            node.status
              ? `<rect x="${x + 68}" y="${y + 55}" width="34" height="14" fill="${
                  node.status === '200' ? 'var(--c-green)' : node.status === '404' ? 'var(--c-amber)' : 'var(--c-red)'
                }"/><text class="fg-chip" x="${x + 73}" y="${y + 65}" fill="var(--c-on-accent)">${esc(node.status)}</text>`
              : '',
            `<text class="fg-meta" x="${x + 9}" y="${y + 83}">${esc(clip(`${node.file}:${node.line}`, 30))}</text>`,
            `<text class="fg-meta" x="${x + 9}" y="${y + 96}">${esc(clip(`${node.bytes} · ${node.countLabel}`, 30))}</text>`,
          );
        }
        return `<g class="fg-node" data-node="${node.id}" tabindex="0" role="button" opacity="${faded ? 0.22 : 1}" aria-label="${esc(
          `${KIND_LABEL[node.kind]} ${node.title}, ${node.sub}, evidencia ${node.evidence}`,
        )}">${parts.join('')}</g>`;
      })
      .join('');

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.innerHTML = `<defs>${markers}</defs>${edgeSvg}${nodeSvg}`;

    const z = state.zoom;
    svg.style.transform = `scale(${z})`;
    svg.style.transformOrigin = '0 0';
    sizer.style.width = `${width * z}px`;
    sizer.style.height = `${height * z}px`;
    canvas.style.height = `${Math.min(520, Math.max(210, height * z + 4))}px`;

    headsInner.style.width = `${width * z}px`;
    headsInner.style.paddingLeft = `${PAD * z}px`;
    headsInner.innerHTML = columns
      .map(
        (c) =>
          `<span class="label" style="flex:0 0 ${NW * z}px;margin-right:${CG * z}px;color:${KIND_COLOR[c.kind]};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.label} · ${c.nodes.length}</span>`,
      )
      .join('');

    const edgeCount = EDGES.filter((e) => byId.has(e.from) && byId.has(e.to)).length;
    const controls = columns[0]?.nodes.length ?? 0;
    const runtime = nodes.filter((n) => n.evidence === 'RUNTIME').length;
    if (status) {
      status.textContent = `${nodes.length} nodos · ${edgeCount} aristas · ${controls} controles · ${runtime} con evidencia RUNTIME${
        state.isolated ? ` · enfoque en ${NODE_BY_ID.get(state.isolated)?.title ?? ''}` : ''
      }`;
    }
    if (zoomLabel) zoomLabel.textContent = `${Math.round(z * 100)}%`;

    renderDetail();
  };

  const select = (id: string | null) => {
    state.selected = id;
    render();
  };

  const hideMenu = () => {
    if (menu) menu.hidden = true;
  };

  const showMenu = (id: string, clientX: number, clientY: number) => {
    if (!menu) return;
    const box = root.getBoundingClientRect();
    menu.dataset.node = id;
    menu.hidden = false;
    const left = Math.min(Math.max(8, clientX - box.left), Math.max(8, box.width - 220));
    const top = Math.min(Math.max(8, clientY - box.top), Math.max(8, box.height - 140));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.querySelector<HTMLButtonElement>('button')?.focus();
  };

  svg.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<SVGGElement>('[data-node]');
    hideMenu();
    select(target?.dataset.node ?? null);
  });

  svg.addEventListener('keydown', (event) => {
    const target = (event.target as Element).closest<SVGGElement>('[data-node]');
    if (!target) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(target.dataset.node ?? null);
    }
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      const box = target.getBoundingClientRect();
      showMenu(target.dataset.node ?? '', box.left + 40, box.top + 20);
    }
  });

  svg.addEventListener('contextmenu', (event) => {
    const target = (event.target as Element).closest<SVGGElement>('[data-node]');
    if (!target) return;
    event.preventDefault();
    select(target.dataset.node ?? null);
    showMenu(target.dataset.node ?? '', event.clientX, event.clientY);
  });

  menu?.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-action]');
    if (!button) return;
    const id = menu.dataset.node ?? '';
    const action = button.dataset.action;
    if (action === 'isolate' && id) {
      state.isolated = id;
      state.selected = id;
    }
    if (action === 'clear-focus') state.isolated = null;
    if (action === 'clear-selection') state.selected = null;
    hideMenu();
    render();
  });

  document.addEventListener('click', (event) => {
    if (menu && !menu.hidden && !menu.contains(event.target as Node)) hideMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideMenu();
  });

  canvas.addEventListener('scroll', () => {
    heads.scrollLeft = canvas.scrollLeft;
  });

  const setPressed = (selector: string, attr: string, value: string) => {
    root.querySelectorAll<HTMLButtonElement>(selector).forEach((button) => {
      const on = button.dataset[attr] === value;
      button.setAttribute('aria-pressed', String(on));
    });
  };

  root.querySelectorAll<HTMLButtonElement>('[data-scope]').forEach((button) => {
    button.addEventListener('click', () => {
      state.scope = button.dataset.scope as Scope;
      state.isolated = null;
      setPressed('[data-scope]', 'scope', state.scope);
      render();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-sqlfilter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sql = button.dataset.sqlfilter as SqlFilter;
      setPressed('[data-sqlfilter]', 'sqlfilter', state.sql);
      render();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-order]').forEach((button) => {
    button.addEventListener('click', () => {
      state.order = button.dataset.order as Order;
      setPressed('[data-order]', 'order', state.order);
      render();
    });
  });

  statusSelect?.addEventListener('change', () => {
    state.status = statusSelect.value as Status;
    render();
  });

  search?.addEventListener('input', () => {
    state.query = search.value;
    render();
  });

  compact?.addEventListener('change', () => {
    state.compact = compact.checked;
    render();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = Number(button.dataset.zoom);
      state.zoom = Math.min(1.6, Math.max(0.6, Math.round((state.zoom + delta) * 10) / 10));
      render();
    });
  });

  root.querySelector<HTMLButtonElement>('[data-graph-reset]')?.addEventListener('click', () => {
    state.scope = 'all';
    state.sql = 'all';
    state.order = 'chrono';
    state.status = 'all';
    state.query = '';
    state.compact = false;
    state.zoom = 1;
    state.selected = null;
    state.isolated = null;
    if (search) search.value = '';
    if (statusSelect) statusSelect.value = 'all';
    if (compact) compact.checked = false;
    setPressed('[data-scope]', 'scope', 'all');
    setPressed('[data-sqlfilter]', 'sqlfilter', 'all');
    setPressed('[data-order]', 'order', 'chrono');
    hideMenu();
    canvas.scrollTo({ left: 0, top: 0 });
    render();
  });

  setPressed('[data-scope]', 'scope', 'all');
  setPressed('[data-sqlfilter]', 'sqlfilter', 'all');
  setPressed('[data-order]', 'order', 'chrono');
  render();
}

export const GRAPH_KINDS: Kind[] = COLUMNS.map((c) => c.kind);