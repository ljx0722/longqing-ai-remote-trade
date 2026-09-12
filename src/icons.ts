const paths: Record<string, string> = {
  anchor:
    '<path d="M12 3v17M8 7h8M4 13v3c0 6 16 6 16 0v-3M4 13l-2 3m2-3 3 2m13-2 2 3m-2-3-3 2"/><circle cx="12" cy="4" r="2"/>',
  market:
    '<path d="M3 9h18l-2-6H5L3 9ZM4 9v12h16V9M9 21v-7h6v7M3 9c0 4 4 4 4 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 4 4 4 0"/>',
  route:
    '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h9a4 4 0 0 1 0 8H8a2 2 0 0 0 0 4h9"/>',
  ship: '<path d="M12 2v14M12 3 4 14h8m2-9 6 9h-6M3 17h18l-4 4H7l-4-4Z"/>',
  history: '<path d="M4 5h16v16H4zM8 3v4m8-4v4M4 10h16M8 14h3m3 0h3M8 17h3"/>',
  guild: '<path d="m3 9 9-6 9 6H3ZM5 11v7m5-7v7m4-7v7m5-7v7M3 21h18M4 18h16"/>',
  log: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
  coin: '<ellipse cx="12" cy="12" rx="8" ry="9"/><path d="M9 8h6m-3-2v12m3-2H9"/>',
  cargo:
    '<path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v11M7 5l10 4"/>',
  supply:
    '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13ZM8 15c0 3 2 4 4 4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 7-2 7-6 3 2-7 6-3Z"/>',
  settings:
    '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  save: '<path d="M4 3h13l3 3v15H4V3Zm4 0v6h8V3M8 21v-7h8v7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
};
export const icon = (name: string, cls = ""): string =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.compass}</svg>`;
