(function(){
'use strict';
/* Expedientes generados de prueba (0001-0007) más historial real del navegador.
   Nunca se muestra una pregunta individual como un expediente adicional. */
window.XRAIC_INIT_HISTORIAL=function(){
 const u=window.XUI, demos=()=>window.XRAIC_REPORT_CASES||[];
 const esc=v=>u.esc(String(v??''));
 function groups(){
  const entries=Array.isArray(u.state.history)?u.state.history:[];
  const grouped=new Map();
  for(const item of entries){
   if(!item||!item.record)continue;
   const id=String(item.record).replace(/^EXP-/i,'');
   if(!grouped.has(id))grouped.set(id,{id,questions:[],date:'',visited:false});
   const g=grouped.get(id);
   if(item.question)g.questions.push(item.question);
   g.visited=true;
   if((item.date||'')>g.date)g.date=item.date;
  }
  return grouped;
 }
 function renderCard({id,questions,date,visited},synthetic){
  const c=synthetic?demos().find(x=>x.id===id):null;
  const record=!synthetic?u.records.find(x=>x.id===id):null;
  if(!c&&!record)return '';
  const title=c?(c.identity.name||'Nombre no registrado'):(record.title||'Expediente '+id);
  const description=c?c.overview:(u.cases[id]?.summary||u.detail[id]?.reason||record.summary||'Expediente de demostración');
  const dateLabel=date?new Date(date).toLocaleString('es-MX'):'';
  const detail=visited?
   ((questions||[]).length+' pregunta(s) · '+(dateLabel?'Último acceso: '+dateLabel:'Acceso registrado')):
   'Expediente ficticio disponible para explorar';
  const key=synthetic?'EXP-'+id:id;
  return '<article class="history-item history-record-card"><div class="history-record-info">'
   +'<div class="section-overline">EXPEDIENTE '+esc(key)+'</div>'
   +'<strong>'+esc(title)+'</strong>'
   +'<p class="history-record-description">'+esc(description)+'</p>'
   +'<small>'+esc(detail)+'</small></div>'
   +'<div class="history-record-actions">'
   +'<button type="button" class="btn primary small" data-history-report="'+esc(key)+'">'+u.svg('file-text')+' Ver expediente</button>'
   +'<button type="button" class="btn secondary small" data-history-chat="'+esc(key)+'">'+u.svg('messages-square')+' Consultar con IA</button>'
   +'</div></article>';
 }
 u.renderHistorial=function(){
  const term=u.normalize(u.$('#historyFilter').value||''), existing=groups();
  const syntheticCards=demos().map(c=>{
   const saved=existing.get(c.id)||{id:c.id,questions:[],date:'',visited:false};
   return {data:saved,kind:'synthetic',search:c.id+' EXP-'+c.id+' '+(c.identity.name||'')+' '+c.overview};
  });
  const recordCards=[...existing.values()].filter(x=>!demos().some(c=>c.id===x.id)).map(g=>{
   const r=u.records.find(x=>x.id===g.id);
   return {data:g,kind:'record',search:g.id+' '+(r?.title||'')+' '+g.questions.join(' ')};
  });
  const matches=group=>group.filter(x=>u.normalize(x.search).includes(term));
  const saved=matches(recordCards), samples=matches(syntheticCards);
  let html='';
  if(saved.length)html+='<div class="history-group-label"><h2>Expedientes consultados</h2><p>Guardados en este navegador.</p></div>'
   +saved.map(x=>renderCard(x.data,false)).join('');
  if(samples.length)html+='<div class="history-group-label"><h2>Expedientes ficticios de demostración</h2>'
   +'<p>Siete reportes ya preparados para revisar su estructura, campos vacíos y discrepancias.</p></div>'
   +samples.map(x=>renderCard(x.data,true)).join('');
  if(!html)html='<div class="no-record"><h2>No se encontraron expedientes</h2><p>Prueba otro identificador o nombre.</p></div>';
  u.$('#historyContent').innerHTML=html;
 };
 u.$('#historyFilter').oninput=u.renderHistorial;
 u.$('#clearHistory').onclick=()=>{
  if(!(u.state.history||[]).length){u.toast('No hay consultas guardadas para borrar. Los ejemplos ficticios permanecen disponibles.');return}
  if(confirm('¿Borrar las consultas guardadas en este navegador? Los siete expedientes ficticios seguirán disponibles.')){
   u.state.history=[];
   try{localStorage.removeItem('xraic-v6-history')}catch(_){}
   u.renderHistorial();
  }
 };
 document.addEventListener('click',event=>{
  const report=event.target.closest('[data-history-report]');
  const chat=event.target.closest('[data-history-chat]');
  if(!report&&!chat)return;
  const key=(report||chat).getAttribute(report?'data-history-report':'data-history-chat');
  const isSynthetic=key.startsWith('EXP-');
  const id=isSynthetic?key.slice(4):key;
  if(isSynthetic){
   const c=demos().find(x=>x.id===id);
   if(!c)return;
   if(report&&typeof window.XRAIC_OPEN_SYNTHETIC_REPORT==='function'){
    window.XRAIC_OPEN_SYNTHETIC_REPORT(id);
    window.history.replaceState(null,'','#reporte');
   }else if(chat&&typeof u.openSyntheticChat==='function'){
    u.openSyntheticChat(id);
    u.showPage('consulta');
    window.history.replaceState(null,'','#consulta');
   }
   return;
  }
  const r=u.records.find(x=>x.id===id);
  if(!r)return;
  if(report){
   if(typeof window.XRAIC_OPEN_RECORD_REPORT==='function')window.XRAIC_OPEN_RECORD_REPORT(r);
   else{u.choose(r);u.showPage('reporte')}
   window.history.replaceState(null,'','#reporte');
  }else{
   u.choose(r);u.showPage('consulta');
   if(typeof u.showRecordIntro==='function')u.showRecordIntro(r);
   window.history.replaceState(null,'','#consulta');
  }
 });
};
})();