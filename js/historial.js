(function(){
'use strict';
window.XRAIC_INIT_HISTORIAL=function(){const u=window.XUI;
u.renderHistorial=function(){let term=u.normalize(u.$('#historyFilter').value);let rows=u.state.history.filter(h=>u.normalize(h.question+' '+h.record).includes(term));u.$('#historyContent').innerHTML=rows.length?rows.map(h=>`<article class="history-item"><div><strong>${u.esc(h.question)}</strong><p>${u.esc(h.record)} · ${u.esc(h.summary)} · ${new Date(h.date).toLocaleString('es-MX')}</p></div><button class="btn secondary small" data-reopen="${u.esc(h.record)}">Abrir expediente</button></article>`).join(''):`<div class="no-record"><h2>Aún no hay consultas guardadas</h2><p>Las preguntas que realices se conservarán aquí para retomarlas.</p></div>`};
u.$('#historyFilter').oninput=u.renderHistorial;
u.$('#clearHistory').onclick=()=>{if(!u.state.history.length)return;if(confirm('¿Borrar las consultas guardadas en este navegador?')){u.state.history=[];try{localStorage.removeItem('xraic-v6-history')}catch{}u.renderHistorial()}};
document.addEventListener('click',e=>{let b=e.target.closest('[data-reopen]');if(!b)return;const r=u.records.find(x=>x.id===b.dataset.reopen);if(r){u.choose(r);u.showPage('consulta');u.answer('Muéstrame el resumen de este expediente.')}});
};
})();
