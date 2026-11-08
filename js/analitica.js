/* Analítica clínica de prototipo: datos totalmente sintéticos. */
(function(){
'use strict';
const U=()=>window.XUI;
const cases=()=>window.XRAIC_REPORT_CASES||[];
const series={
 '0001':[
  {when:'14 oct · 08:00',sys:142,dia:91,pulse:95,temp:37.6},
  {when:'14 oct · 16:00',sys:136,dia:86,pulse:92,temp:37.3},
  {when:'15 oct · 09:00',sys:128,dia:82,pulse:88,temp:37.1},
  {when:'16 oct · 09:00',sys:124,dia:80,pulse:83,temp:36.9},
  {when:'17 oct · 08:00',sys:126,dia:81,pulse:84,temp:36.8}
 ]
};
const metrics={
 sys:{label:'Presión sistólica',unit:'mmHg'},
 dia:{label:'Presión diastólica',unit:'mmHg'},
 pulse:{label:'Frecuencia cardíaca',unit:'lpm'},
 temp:{label:'Temperatura',unit:'°C'}
};
let selectedId=null,selectedEpisode='all',selectedMetric='sys',details=false;
const esc=x=>U().esc(String(x??''));
function status(v){
 if(v===null||v===undefined||v==='')return 'missing';
 if(v&&typeof v==='object'&&Array.isArray(v.conflict))return 'conflict';
 if(v&&typeof v==='object'&&Array.isArray(v.duplicate))return 'duplicate';
 return 'present';
}
function quality(c){
 const entries=Object.values(c.identity||{});
 return {total:entries.length,known:entries.filter(v=>status(v)==='present').length,
  missing:entries.filter(v=>status(v)==='missing').length,
  conflict:entries.filter(v=>status(v)==='conflict').length,
  duplicate:entries.filter(v=>status(v)==='duplicate').length};
}
function episodes(c){
 if(c.id==='0004')return [
  {id:'one',label:'02 feb 2026 · Urgencias',events:(c.events||[]).slice(0,1)},
  {id:'two',label:'18–20 ago 2026 · Hospitalización',events:(c.events||[]).slice(1)}
 ];
 if(!(c.events||[]).length)return [];
 return [{id:'one',label:c.identity.date||'Atención registrada',events:c.events}];
}
function pick(){
 const options=cases();
 if(!options.length)return null;
 let id=selectedId;
 if(!id){try{id=sessionStorage.getItem('xraic-prototype-selected-synthetic-case')}catch(_){}}
 const c=options.find(x=>x.id===id)||options[0];
 selectedId=c.id;
 return c;
}
function svgChart(rows,key,unit,label){
 if(rows.length<2)return '';
 const W=760,H=280,L=55,T=22,R=22,B=52;
 const vals=rows.map(p=>p[key]);
 const lo=Math.min(...vals)-(key==='temp'?.3:5),hi=Math.max(...vals)+(key==='temp'?.3:5);
 const x=i=>L+i*(W-L-R)/(rows.length-1);
 const y=v=>T+(hi-v)*(H-T-B)/(hi-lo);
 const grid=Array.from({length:5},(_,i)=>{
  const yy=T+i*(H-T-B)/4;
  const val=hi-i*(hi-lo)/4;
  return '<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="var(--border)" stroke-dasharray="3 5"/>'
  +'<text x="'+(L-7)+'" y="'+(yy+5)+'" text-anchor="end" font-size="12" fill="var(--muted)">'+val.toFixed(key==='temp'?1:0)+'</text>';
 }).join('');
 const pts=rows.map((p,i)=>x(i).toFixed(1)+','+y(p[key]).toFixed(1)).join(' ');
 const dots=rows.map((p,i)=>'<circle cx="'+x(i)+'" cy="'+y(p[key])+'" r="5" fill="var(--brand)" stroke="var(--paper)" stroke-width="2"><title>'+esc(p.when)+': '+p[key]+' '+unit+'</title></circle>').join('');
 const labels=rows.map((p,i)=>'<text x="'+x(i)+'" y="'+(H-12)+'" text-anchor="middle" font-size="12" fill="var(--muted)">'+esc(p.when.split(' · ')[0])+'</text>').join('');
 return '<svg class="analytics-trend-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(label)+' con '+rows.length+' datos simulados">'+grid+'<polyline points="'+pts+'" fill="none" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+dots+labels+'</svg>';
}
function trend(c){
 const rows=series[c.id];
 if(!rows||selectedEpisode==='two'){
  const notes=(c.exploration||[]).map(t=>'<li>'+esc(t)+'</li>').join('');
  return '<div class="analytics-no-trend"><strong>Sin serie temporal suficiente</strong><p>No se puede construir una tendencia a partir de mediciones ausentes o aisladas en este episodio.</p>'
   +(notes?'<div class="analytics-observation"><strong>Valores documentados en este caso ficticio</strong><ul>'+notes+'</ul></div>':'')+'</div>';
 }
 const meta=metrics[selectedMetric],vals=rows.map(p=>p[selectedMetric]);
 const min=Math.min(...vals),max=Math.max(...vals),last=vals[vals.length-1];
 const options=Object.entries(metrics).map(([k,v])=>'<option value="'+k+'"'+(k===selectedMetric?' selected':'')+'>'+v.label+'</option>').join('');
 const table=details?'<div class="analytics-table-wrap"><table class="analytics-table"><thead><tr><th>Fecha/hora</th><th>Medición</th><th>Unidad</th><th>Origen</th></tr></thead><tbody>'
   +rows.map(r=>'<tr><td>'+esc(r.when)+'</td><td>'+r[selectedMetric]+'</td><td>'+esc(meta.unit)+'</td><td>Simulación</td></tr>').join('')+'</tbody></table></div>':'';
 return '<div class="analytics-trend-actions"><label for="analyticsMetric">Medición</label><select id="analyticsMetric">'+options+'</select>'
  +'<button class="btn secondary small" id="analyticsDetails" aria-expanded="'+details+'" type="button">'+(details?'Ocultar valores':'Ver valores exactos')+'</button></div>'
  +'<div class="analytics-measure-summary"><div><strong>'+last+' '+meta.unit+'</strong><small>Última medición simulada</small></div><div><strong>'+min+'–'+max+' '+meta.unit+'</strong><small>Rango de la serie</small></div></div>'
  +'<div class="analytics-chart-canvas">'+svgChart(rows,selectedMetric,meta.unit,meta.label)+'</div>'
  +'<p class="analytics-data-warning">Serie inventada exclusivamente para probar el gráfico. No representa valores extraídos de documentos originales ni demuestra una evolución clínica real.</p>'+table;
}
function render(){
 const u=U(),area=u.$('#analyticsContent');
 if(!area)return;
 const c=pick();
 if(!c){area.innerHTML='<p>No hay expedientes ficticios disponibles.</p>';return}
 const q=quality(c),eps=episodes(c),ep=eps.find(x=>x.id===selectedEpisode),events=ep?ep.events:(c.events||[]);
 const opts=cases().map(x=>'<option value="'+esc(x.id)+'"'+(x.id===c.id?' selected':'')+'>'+esc(x.id)+' · '+esc(x.identity.name||'Sin nombre registrado')+'</option>').join('');
 const periodOptions='<option value="all"'+(selectedEpisode==='all'?' selected':'')+'>Todos los episodios</option>'
  +eps.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===selectedEpisode?' selected':'')+'>'+esc(x.label)+'</option>').join('');
 area.innerHTML=
 '<div class="analytics-filters"><div><label for="analyticsCase">Paciente / expediente</label><select id="analyticsCase">'+opts+'</select></div>'
 +'<div><label for="analyticsEpisode">Período de análisis</label><select id="analyticsEpisode"'+(eps.length?'':' disabled')+'>'+periodOptions+'</select></div>'
 +'<span class="analytics-synthetic">Datos totalmente ficticios</span></div>'
 +'<div class="analytics-patient"><div><div class="section-overline">EXPEDIENTE EXP-'+esc(c.id)+'</div><h2>'+esc(c.identity.name||'Nombre no registrado')+'</h2>'
 +'<p>'+esc(c.identity.service||'Servicio no registrado')+' · '+esc(c.identity.date||'Sin período clínico documentado')+'</p></div>'
 +'<button class="btn secondary" id="analyticsOpenReport" type="button">Abrir reporte clínico</button></div>'
 +'<section class="analytics-kpis" aria-label="Indicadores del caso">'
 +'<div><span>Episodios de atención</span><strong>'+eps.length+'</strong><small>Identificados en el caso</small></div>'
 +'<div><span>Fuentes documentales</span><strong>'+c.sources.length+'</strong><small>Documentos ficticios de origen</small></div>'
 +'<div><span>Datos sin registrar</span><strong>'+q.missing+'</strong><small>De '+q.total+' campos de identificación</small></div>'
 +'<div><span>Campos a revisar</span><strong>'+(q.conflict+q.duplicate)+'</strong><small>'+q.conflict+' discordantes · '+q.duplicate+' duplicados</small></div>'
 +'</section>'
 +'<div class="analytics-two-columns">'
 +'<section class="analytics-panel"><div class="analytics-panel-heading"><div class="section-overline">MEDICIONES</div><h3>Evolución de signos vitales</h3><p>Visualización según el período seleccionado</p></div>'+trend(c)+'</section>'
 +'<section class="analytics-panel"><div class="analytics-panel-heading"><div class="section-overline">CRONOLOGÍA</div><h3>Acontecimientos documentados</h3></div>'
 +(events.length?'<ol class="analytics-timeline">'+events.map((x,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span><p>'+esc(x)+'</p></li>').join('')+'</ol>':'<p class="analytics-muted">Sin eventos clínicos fechados. Una ficha de identificación no permite reconstruir evolución.</p>')
 +'</section></div>'
 +'<div class="analytics-two-columns analytics-lower">'
 +'<section class="analytics-panel"><div class="analytics-panel-heading"><div class="section-overline">ESTUDIOS Y VALORES</div><h3>Mediciones registradas</h3></div>'
 +((c.exploration||[]).length?'<ul class="analytics-facts">'+c.exploration.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p class="analytics-muted">No se documentan resultados de laboratorio ni mediciones clínicas en este caso.</p>')
 +'<p class="analytics-small-note">No se generan resultados ni rangos de referencia que no estén registrados.</p></section>'
 +'<section class="analytics-panel"><div class="analytics-panel-heading"><div class="section-overline">CALIDAD DOCUMENTAL</div><h3>Disponibilidad y consistencia</h3></div>'
 +'<div class="analytics-quality"><div><strong>'+q.known+'</strong><small>Registrados</small></div><div><strong>'+q.missing+'</strong><small>Ausentes</small></div><div><strong>'+q.conflict+'</strong><small>Discordantes</small></div><div><strong>'+q.duplicate+'</strong><small>Duplicados</small></div></div>'
 +'<p class="analytics-muted">'+esc(c.analysis)+'</p><strong class="analytics-source-title">Fuentes utilizadas</strong>'
 +'<ul class="analytics-source-list">'+c.sources.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'
 +'<button class="btn ghost" id="analyticsOpenSources" type="button">Ver fuentes en Reporte clínico</button></section></div>'
 +'<p class="analytics-final-note">Interfaz de prueba con expedientes sintéticos. Las visualizaciones no sustituyen las notas originales ni constituyen recomendaciones médicas.</p>';
 const navigate=sources=>{
  try{sessionStorage.setItem('xraic-prototype-selected-synthetic-case',c.id)}catch(_){}
  u.showPage('reporte');window.location.hash='reporte';
  if(sources){const el=document.getElementById('r-alcance');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
 };
 area.querySelector('#analyticsCase').addEventListener('change',e=>{
  selectedId=e.target.value;selectedEpisode='all';selectedMetric='sys';details=false;
  try{sessionStorage.setItem('xraic-prototype-selected-synthetic-case',selectedId)}catch(_){}
  render();
 });
 area.querySelector('#analyticsEpisode').addEventListener('change',e=>{selectedEpisode=e.target.value;details=false;render()});
 const select=area.querySelector('#analyticsMetric');
 if(select)select.addEventListener('change',e=>{selectedMetric=e.target.value;render()});
 const toggle=area.querySelector('#analyticsDetails');
 if(toggle)toggle.addEventListener('click',()=>{details=!details;render()});
 area.querySelector('#analyticsOpenReport').addEventListener('click',()=>navigate(false));
 area.querySelector('#analyticsOpenSources').addEventListener('click',()=>navigate(true));
}
window.XRAIC_INIT_ANALITICA=function(){U().renderAnalitica=render};
})();