const paths = {
  experience: <><path d="M4 19V5M4 19h16M7 15l4-5 4 2 5-8"/><circle cx="11" cy="10" r="1"/><circle cx="15" cy="12" r="1"/></>,
  projects: <><path d="M14 5c3-2 6-2 6-2s0 3-2 6l-5 6-5-5zM8 10l-4 1-1 4 5-1M13 15l-1 5 4-1 1-5M7 17l-3 3"/><circle cx="15" cy="8" r="1.5"/></>,
  about: <><path d="M5 4h12a2 2 0 0 1 2 2v15H7a3 3 0 0 1-3-3V6a2 2 0 0 1 1-2zM4 17h15M9 8h6M9 11h4"/></>,
  education: <><circle cx="12" cy="13" r="7"/><path d="m8 2 2 4m6-4-2 4m-6 6 4-2 4 2-4 2zM10 14v2h4v-2"/></>,
  skills: <><path d="m10 3-.5 3-2 .9L5 6 3 9l2 2v2l-2 2 2 3 2.5-.9 2 .9.5 3h4l.5-3 2-.9 2.5.9 2-3-2-2v-2l2-2-2-3-2.5.9-2-.9L14 3z"/><circle cx="12" cy="12" r="3"/></>,
  contact: <path d="M7 3H4a1 1 0 0 0-1 1c0 10 7 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2z"/>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
};

export default function Icon({ name, ...props }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>;
}
