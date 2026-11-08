(function(){
'use strict';
// Historial de expedientes consultados. Las preguntas se agrupan, no se duplican en la lista.
window.XRAIC_INIT_HISTORIAL=function(){
 const u=window.XUI;
 function groups(){
  const map=new Map();
  for(const h of u.state.history||[]){
   if(!h||!h.record)continue;
   const key=String(h.record);
   if(!map.has(key))map.set(key,{id:key,entries:[],latest:h.date||'',summary:h.summary||''});
   const item=map.get(key);
   item.entries.push(h);
   if((h.date||'')>item.latest){item.latest=h.date;item.summary=h.summary||item.summary}
  }
  return [...map.values()].sort((a,b)=>b.latest.localeCompare(a.latest));
 }
 u.renderHistorial=function(){
  const term=u.normalize(u.$('#historyFilter').value||'');
  const rows=groups().filter(h=>{
   const record=u.records.find(r=>r.id===h.id);
   const q=h.entries.map(x=>x.question).join(' ');
   return u.normalize(h.id+' '+(record?.title||'')+' '+q).includes(term);
  });
  u.$('#historyContent').innerHTML=rows.length?rows.map(h=>{
   const record=u.records.find(r=>r.id===h.id);
   const clinical=record?u.cases[record.id]:null;
   const title=record?.title||('Expediente '+h.id);
   const description=clinical?.summary||u.detail[h.id]?.reason||'Información previamente consultada; abre el documento para revisar sus fuentes.';
   const date=h.latest?new Date(h.latest).toLocaleString('es-MX'):'Fecha no disponible';
   return '<article class="history-item history-record-card"><div class="history-record-info">'
    +'<div class="section-overline">EXPEDIENTE '+u.esc(h.id)+'</div><strong>'+u.esc(title)+'</strong>'
    +'<p class="history-record-description">'+u.esc(description)+'</p>'
    +'<small>'+h.entries.length+' pregunta(s) guardada(s) · Última consulta: '+u.esc(date)+'</small></div>'
    +'<div class="history-record-actions"><button type="button" class="btn primary small" data-history-report="'+u.esc(h.id)+'">'+u.svg('file-text')+' Ver expediente</button>'
    +'<button type="button" class="btn secondary small" data-history-chat="'+u.esc(h.id)+'">'+u.svg('messages-square')+' Consultar con IA</button></div></article>';
  }).join(''):'<div class="no-record"><h2>No hay expedientes consultados</h2><p>Cuando consultes un expediente en Consulta, aparecerá aquí una sola vez, junto con el acceso a su reporte y sus preguntas.</p></div>';
 };
 u.$('#historyFilter').oninput=u.renderHistorial;
 u.$('#clearHistory').onclick=()=>{
  if(!(u.state.history||[]).length)return;
  if(confirm('¿Borrar el historial de expedientes consultados en este navegador?')){
   u.state.history=[];
   try{localStorage.removeItem('xraic-v6-history')}catch(_){}
   u.renderHistorial();
  }
 };
 document.addEventListener('click',e=>{
  const report=e.target.closest('[data-history-report]');
  const chat=e.target.closest('[data-history-chat]');
  if(!report&&!chat)return;
  const id=(report||chat).dataset[report?'historyReport':'historyChat'];
  const rec=u.records.find(r=>r.id===id);
  if(!rec)return;
  if(report){
   if(typeof window.XRAIC_OPEN_RECORD_REPORT==='function'){
    window.XRAIC_OPEN_RECORD_REPORT(rec);
   }else{
    u.choose(rec);u.showPage('reporte');
   }
   window.history.replaceState(null,'','#reporte');
  }else{
   u.choose(rec);
   u.showPage('consulta');
   if(typeof u.showRecordIntro==='function')u.showRecordIntro(rec);
   window.history.replaceState(null,'','#consulta');
  }
 });
};
})();