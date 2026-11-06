export const sectionIds = ['experience', 'projects', 'about', 'education', 'skills', 'contact'];
export const initialNavigation = { phase: 'INTRO', section: null };

export function navigationReducer(state, event) {
  switch (event.type) {
    case 'START':
      return state.phase === 'INTRO' ? { ...state, phase: 'ENTERING' } : state;
    case 'ENTERED':
      return ['ENTERING','HOST_SITTING'].includes(state.phase) ? { ...state, phase: 'EXPLORE' } : state;
    case 'HOST_TOGGLE':
      if (state.phase === 'EXPLORE') return {...state,phase:'HOST_RISING'};
      return state.phase === 'HOST_GREETING' ? {...state,phase:'HOST_SITTING'} : state;
    case 'HOST_READY':
      return state.phase === 'HOST_RISING' ? {...state,phase:'HOST_GREETING'} : state;
    case 'HOST_ABORT':
      return state.phase.startsWith('HOST_') ? {phase:'EXPLORE',section:null} : state;
    case 'SELECT':
      return ['INTRO', 'EXPLORE'].includes(state.phase) && sectionIds.includes(event.section)
        ? { phase: 'OPENING_SECTION', section: event.section } : state;
    case 'OPENED':
      return state.phase === 'OPENING_SECTION' ? { ...state, phase: 'SECTION_OPEN' } : state;
    case 'CLOSE':
      return ['SECTION_OPEN', 'OPENING_SECTION'].includes(state.phase)
        ? { ...state, phase: 'CLOSING_SECTION' } : state;
    case 'CLOSED':
      return state.phase === 'CLOSING_SECTION' ? { phase: 'EXPLORE', section: null } : state;
    default:
      return state;
  }
}
