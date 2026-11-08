/* ASSIST XRAIC · Reporte clínico narrativo
   Cambio aislado de la vista Reporte. Conserva el sistema visual y las demás pantallas.
   El caso inicial R-SIM es 100 % sintético; no procede de documentos de pacientes. */
(function(){
'use strict';
const U=()=>window.XUI;
const syntheticCases=()=>window.XRAIC_REPORT_CASES||[];
// El selector y el contenido clínico deben usar la misma fuente de verdad.
const selectedCaseStorageKey='xraic-prototype-selected-synthetic-case';
let selectedSyntheticCase=null;
try {
 const savedId=sessionStorage.getItem(selectedCaseStorageKey);
 selectedSyntheticCase=syntheticCases().find(c=>c.id===savedId)||null;
} catch (_) { /* El prototipo funciona aunque el navegador bloquee storage. */ }
const demo={
  id:'R-SIM',title:'Atención en urgencias · palpitaciones',patientName:'Javier Alejandro Serrano',
  profile:{age:'54 años',sex:'Masculino',service:'Urgencias',date:'18 sep 2026',episode:'Atención única',source:'Nota de urgencias · URG-SIM-018'},
  summary:'Paciente masculino de 54 años valorado en urgencias por palpitaciones intermitentes y sensación de mareo iniciadas durante la tarde. En el interrogatorio se documenta hipertensión arterial en tratamiento habitual. La nota consigna un electrocardiograma descrito como taquicardia sinusal. Durante la misma atención se registra observación clínica y se indica seguimiento ambulatorio.',
  analysis:'La documentación permite reconstruir una sola atención de urgencias, no una evolución longitudinal. El registro indica motivo de consulta, antecedente de hipertensión y un hallazgo electrocardiográfico referido. No hay mediciones seriadas ni datos suficientes para comprobar la evolución después de la atención. Esta observación describe el alcance documental; no es un juicio diagnóstico.',
  summary2:'La información permite describir el motivo de consulta, algunos antecedentes y el manejo consignado, pero no permite afirmar la evolución posterior ni la administración efectiva de medicamentos. Se trata de una sola atención, no de una historia longitudinal.',
  facts:[['Motivo','Palpitaciones y mareo'],['Antecedente','Hipertensión arterial'],['Hallazgo documentado','ECG descrito como taquicardia sinusal']],
  history:['Hipertensión arterial referida en interrogatorio.','Tratamiento habitual referido, sin nombre ni dosis especificados en esta muestra.','Alergias: no consignadas; no equivale a alergias negadas.'],
  entry:'No se documenta hospitalización en esta muestra. El episodio corresponde a una atención única en urgencias.',
  urgency:'La nota inicial describe palpitaciones intermitentes y mareo. En la valoración se documentó la solicitud y revisión de un electrocardiograma; el registro lo describe como taquicardia sinusal. No hay en esta muestra resultados seriados que permitan describir un cambio posterior.',
  exploration:['Estado de conciencia: alerta y orientado, según la nota de atención.','Exploración cardiopulmonar: se consigna evaluación, sin descripción de otros hallazgos destacables en esta muestra.','Signos vitales: no se incluyeron mediciones numéricas verificables en el material sintético.'],
  evolution:'La documentación se limita a un único contacto en urgencias. Se registra valoración inicial, electrocardiograma y plan. No hay notas posteriores para reconstruir una evolución después de la salida.',
  orders:['Electrocardiograma realizado, con interpretación consignada en la nota.','Se registra observación clínica y seguimiento ambulatorio.','No hay una pauta farmacológica con fármaco y dosis verificables en esta muestra.'],
  discharge:'La nota disponible consigna seguimiento ambulatorio. No se dispone de una nota de egreso hospitalario independiente ni de evolución posterior.',
  checks:['No se registró una lista completa de medicamentos habituales.','No se incluyen cifras ni mediciones seriadas de signos vitales.','Sin documentos posteriores no puede confirmarse la evolución tras la atención.'],
  events:[['18 sep 2026 · Tarde','Inicio referido de palpitaciones y sensación de mareo.'],['18 sep 2026 · Urgencias','Valoración y electrocardiograma descrito como taquicardia sinusal.'],['18 sep 2026 · Cierre de la atención','Plan documentado de seguimiento ambulatorio.']],
  original:'NOTA DE URGENCIAS — DOCUMENTO SINTÉTICO. Motivo de consulta: palpitaciones intermitentes y mareo desde la tarde. Antecedentes: hipertensión arterial, tratamiento habitual no especificado. Atención: paciente alerta y orientado. Se registra electrocardiograma descrito como taquicardia sinusal. Plan: observación clínica y seguimiento ambulatorio. No se aportan cifras seriadas ni notas de evolución posteriores.'
};
const names=[
 ['resumen','Síntesis clínica','Síntesis del episodio'],
 ['ingresos','Ingresos y contexto','Identificación y contexto de atención'],
 ['historia','Historia clínica y antecedentes','Antecedentes documentados'],
 ['ingreso','Notas de ingreso','Ingreso hospitalario'],
 ['urgencias','Atención en urgencias','Atención de urgencias'],
 ['exploracion','Exploración y signos vitales','Exploración física y signos vitales'],
 ['evolucion','Notas de evolución','Evolución documentada'],
 ['indicaciones','Indicaciones registradas','Indicaciones y tratamientos'],
 ['quirurgica','Atención quirúrgica','Procedimientos quirúrgicos'],
 ['egreso','Notas de egreso','Egreso o situación al cierre'],
 ['hospitalaria','Información hospitalaria','Contexto de hospitalización'],
 ['cronologia','Cronología documental','Cronología del episodio'],
 ['alcance','Alcance y fuentes','Fuentes y límites de la información']
];
const P=x=>`<p>${U().esc(x)}</p>`;
const prose=a=>(a||[]).map(t=>P(t)).join('');
const numbered=a=>`<div class="report-facts">${a.map(([label,val])=>`<div class="report-fact"><span>${U().esc(label)}</span><strong>${U().esc(val)}</strong></div>`).join('')}</div>`;
const empty=text=>`<p class="report-quiet">${U().esc(text)}</p>`;
const quote=a=>`<div class="report-document-lines">${(a||[]).map(x=>P(x)).join('')}</div>`;
function timeline(entries){return `<div class="report-narrative-timeline">${(entries||[]).map(e=>`<div class="report-narrative-event"><span>${U().esc(e[0])}</span><p>${U().esc(e[1])}</p></div>`).join('')}</div>`}
function sourceButton(types,hasRecord){if(!hasRecord)return '<a class="report-source-link" href="#r-alcance">Consultar nota original y procedencia</a>';return `<button class="btn ghost small" type="button" data-open-sources="${types.join(',')}">${U().svg('file-search')} Consultar fuentes del apartado</button>`}
function composeDemo(){const d=demo;const body={
 resumen:`<div class="report-overview">${P(d.summary)}${P(d.summary2)}</div><div class="report-analysis-note"><div class="report-analysis-title">Comentario de análisis documental</div>${P(d.analysis)}</div>${numbered(d.facts)}`,
 ingresos:`<div class="report-patient-identification"><div class="report-patient-primary"><span>NOMBRE DEL PACIENTE</span><strong>${U().esc(d.patientName)}</strong><small>Nombre ficticio para la presentación visual</small></div><div class="report-patient-secondary">${[['Edad registrada',d.profile.age],['Sexo registrado',d.profile.sex],['N.º expediente','R-SIM'],['Servicio',d.profile.service],['Fecha de atención',d.profile.date],['Tipo de episodio',d.profile.episode]].map(([a,b])=>`<div><span>${a}</span><strong>${U().esc(b)}</strong></div>`).join('')}</div></div>`,
 historia:prose(d.history),
 ingreso:empty(d.entry),
 urgencias:P(d.urgency),
 exploracion:quote(d.exploration),
 evolucion:P(d.evolution),
 indicaciones:prose(d.orders)+'<p class="report-small-context">Las indicaciones documentadas no prueban su realización o cumplimiento posterior.</p>',
 quirurgica:empty('En este episodio no se aportaron documentos quirúrgicos.'),
 egreso:P(d.discharge),
 hospitalaria:empty('No se aportaron notas de hospitalización para esta atención; la información se limita a urgencias.'),
 cronologia:timeline(d.events),
 alcance:`<h3>Aspectos que deben corroborarse</h3>${quote(d.checks)}<h3>Documento de origen</h3><div class="report-original-reference"><div><strong>${U().esc(d.profile.source)}</strong><small>Fuente sintética correspondiente a esta composición visual.</small></div><button type="button" class="btn secondary small" id="showOriginalSource" aria-expanded="false">Ver nota completa</button></div><div id="originalSourceText" class="report-original-full hidden">${P(d.original)}</div><p class="report-small-context">Esta página utiliza exclusivamente información sintética para evaluar el formato. Un resumen automatizado no equivale a un documento firmado por personal médico.</p>`
 };return body}
function composeForRecord(r){
 const u=U(),c=u.cases[r.id]||{},x=u.detail[r.id]||{};
 const reported=c.summary||x.reason||r.summary;
 const history=c.antecedents||[];
 const events=c.events||[];
 const treatment=c.treatments||[];
 const verify=c.verify||[];
 const list=(a,none)=>a.length?quote(a):empty(none);
 const docs=x.documents?.length?x.documents:Object.keys(r.counts).filter(k=>r.counts[k]>0).map(k=>u.pretty[k]||k);
 const admissions=r.episodes||[];
 return {
 resumen:`<div class="report-overview">${P(reported)}</div><div class="report-analysis-note"><div class="report-analysis-title">Comentario de análisis documental</div>${P(`El expediente reúne ${admissions.length} episodio(s) identificado(s) entre las fechas disponibles. La síntesis se limita a las fuentes incorporadas; los campos ausentes no deben interpretarse como negativos y las diferencias entre episodios requieren cotejo documental.`)}</div>${x.diagnosis?`<div class="report-narrative-highlight"><strong>Información consignada</strong>${P(x.diagnosis)}</div>`:''}`,
 ingresos:`<div class="report-patient-identification"><div class="report-patient-primary"><span>NOMBRE DEL PACIENTE</span><strong>Nombre no registrado en esta muestra</strong><small>El identificador del expediente no sustituye al nombre</small></div><div class="report-patient-secondary">${[['Expediente documental',r.id],['Edad registrada','No disponible'],['Sexo registrado','No disponible'],['Servicio o motivo',r.title],['Ingresos identificados',String(admissions.length)],['Periodo documental',`${r.first||'No disponible'} — ${r.last||'No disponible'}`]].map(([a,b])=>`<div><span>${u.esc(a)}</span><strong>${u.esc(b)}</strong></div>`).join('')}</div></div>${admissions.map((ep,i)=>`<p class="report-episode-line"><strong>Episodio ${i+1}.</strong> ${u.esc(ep.start||'Sin fecha')} ${ep.end&&ep.end!==ep.start?'– '+u.esc(ep.end):''}.</p>`).join('')}`,
 historia:list(history,'Los antecedentes no están suficientemente descritos en las fuentes de esta muestra.'),
 ingreso:x.reason?P(x.reason):empty('No se dispone de una narración de ingreso hospitalario suficientemente detallada.'),
 urgencias:events.length?prose(events.filter(e=>/urgencia|consulta|ingreso|atención|valoración|choque/i.test(e[1])).map(e=>`${e[0]}: ${e[1]}`)):empty('No hay una narración específica de urgencias en la muestra.'),
 exploracion:x.vitals?P(x.vitals):empty('No se cuenta con resultados clínicos de exploración suficientes para elaborar una síntesis.'),
 evolucion:events.length?timeline(events):empty('No existe una secuencia fechada suficiente.'),
 indicaciones:list(treatment,'No hay indicaciones específicas verificables en esta muestra.')+'<p class="report-small-context">Una prescripción no implica administración efectiva.</p>',
 quirurgica:empty('Los procedimientos quirúrgicos solo se describen si existe una nota que los respalde.'),
 egreso:x.closing?P(x.closing):empty('No se dispone de una nota de egreso suficiente.'),
 hospitalaria:x.reason?P(x.reason):empty('No se dispone de suficiente información sobre estancia hospitalaria.'),
 cronologia:events.length?timeline(events):empty('No se dispone de una cronología suficiente.'),
 alcance:`<h3>Aspectos que requieren corroboración</h3>${list(verify,'Corroborar la narrativa con los documentos originales cuando exista alguna discrepancia.')}<h3>Fuentes disponibles</h3><div class="report-ref-grid">${docs.map(t=>`<div>${u.svg('file-text')} ${u.esc(t)}</div>`).join('')}</div><p class="report-small-context">Síntesis automatizada del conjunto disponible: no constituye una nota médica firmada. La falta de registro no significa un hallazgo normal o negativo.</p>`
 };
}

/* Escenarios de diseño para expedientes completos y con distintos tipos de ausencia.
   No modifica la vista Consulta ni sustituye un expediente efectivamente consultado. */
function syntheticField(label,value){
 const u=U();
 const isEmpty=value===null||value===undefined||value==='';
 const isConflict=value&&typeof value==='object'&&Array.isArray(value.conflict);
 const isDuplicate=value&&typeof value==='object'&&Array.isArray(value.duplicate);
 // Duplicado: un mismo dato repetido en varias fuentes. No equivale a discordancia.
 const kind=isEmpty?'missing':isConflict?'conflicted':isDuplicate?'duplicated':'present';
 const labelState={missing:'Sin registrar',conflicted:'Discordante',duplicated:'Duplicado',present:'Registrado'}[kind];
 const renderValues=arr=>arr.map(v=>`<div>${u.esc(v)}</div>`).join('');
 const content=isEmpty?'<em class="report-data-missing">No registrado</em>'
  :isConflict?`<div class="report-field-conflicts">${renderValues(value.conflict)}</div>`
  :isDuplicate?`<div class="report-field-duplicates">${renderValues(value.duplicate)}</div>`
  :u.esc(value);
 return `<div class="report-identity-item is-${kind}"><span class="report-field-label">${u.esc(label)}</span><strong>${content}</strong><small class="report-field-state">${labelState}</small></div>`;
}
function composeSynthetic(c){
 const u=U(),ident=c.identity||{};
 const proseArr=(v)=>Array.isArray(v)&&v.length?quote(v):empty('Sin información documentada en las fuentes disponibles.');
 const clinical=Boolean(c.events?.length)&&c.id!=='0006';
 const hasHospital=c.id==='0001'||c.id==='0004';
 const outpatient=c.id==='0002'||c.id==='0007';
 const hasSurgery=c.id==='0001';
 const card=`<div class="report-patient-identification">
 <div class="report-identity-intro"><p>Información de identificación disponible en las fuentes. Cada campo distingue los datos registrados, ausentes, discordantes o duplicados.</p></div>
 <div class="report-patient-secondary report-identity-panel">
 ${[['Edad registrada',ident.age],['Sexo registrado',ident.sex],['Fecha de nacimiento',ident.birth],['Peso',ident.weight],['Talla / estatura',ident.height],['Alergias documentadas',ident.allergies],['Grupo sanguíneo',ident.blood],['Servicio',ident.service],['Fecha o periodo',ident.date]].map(x=>syntheticField(...x)).join('')}</div>
 <p class="report-small-context">«No registrado» no significa negativo o normal. «Duplicado» indica que un mismo valor aparece repetido; «Discordante» identifica valores distintos que requieren cotejo.</p></div>`;
 const body={
 resumen:`<div class="report-overview">${P(c.overview)}</div><div class="report-analysis-note"><div class="report-analysis-title">Comentario de análisis documental</div>${P(c.analysis)}</div>${numbered([['Expediente',`EXP-${c.id}`],['Contexto',c.state],['Documentos base',`${c.sources.length} fuente(s)`]])}`,
 ingresos:card,
 historia:proseArr(c.history),
 ingreso:hasHospital?P(c.id==='0001'?'Se registra ingreso hospitalario tras valoración de urgencias. La nota de ingreso permite relacionar motivo de atención y evolución.':'El segundo episodio corresponde a un ingreso hospitalario separado del contacto inicial.'):(outpatient?empty('No aplica: el episodio corresponde a atención ambulatoria, sin ingreso hospitalario.'):empty('No se cuenta con una nota de ingreso hospitalario en las fuentes disponibles.')),
 urgencias:c.id==='0001'||c.id==='0003'||c.id==='0004'||c.id==='0005'?P(c.overview):outpatient?empty('No aplica: el episodio descrito es una consulta externa.'):empty('No existe una nota de urgencias en las fuentes disponibles.'),
 exploracion:proseArr(c.exploration)+(ident.weight==null||ident.height==null?'<p class="report-small-context">No se calcula IMC si falta peso o talla.</p>':'')+(typeof ident.height==='object'?'<p class="report-small-context">No se calcula un índice consolidado con tallas discordantes.</p>':''),
 evolucion:clinical?P(c.id==='0001'?'La atención cuenta con notas sucesivas y un cierre documentado. La secuencia completa se presenta al final en orden cronológico.':c.id==='0004'?'La información se distribuye en dos episodios independientes; no deben unirse como una sola estancia.':'La muestra contiene un único contacto, sin notas posteriores que permitan evaluar evolución longitudinal.'):empty('No se dispone de notas clínicas de evolución en las fuentes consultadas.'),
 indicaciones:proseArr(c.orders)+'<p class="report-small-context">Las indicaciones consignadas no confirman su administración o cumplimiento.</p>',
 quirurgica:hasSurgery?P('Se dispone de nota quirúrgica y postoperatoria del episodio. Los detalles del procedimiento deben verificarse en el documento original.'):outpatient?empty('No aplica al episodio ambulatorio documentado.'):empty('Sin documentación quirúrgica disponible en el conjunto consultado.'),
 egreso:hasHospital?P('Existe nota de egreso hospitalario en el episodio correspondiente. Las indicaciones y el destino deben corroborarse en la fuente.'):outpatient?empty('No aplica: no se trata de un egreso hospitalario.'):empty('No hay una nota de egreso hospitalario que permita afirmar un destino final.'),
 hospitalaria:hasHospital?P('Se documenta un periodo de hospitalización. La información se interpreta por episodio y no como una sola trayectoria indiferenciada.'):outpatient?empty('No aplica: la atención documentada es ambulatoria.'):empty('No se documenta una estancia hospitalaria en las fuentes disponibles.'),
 cronologia:c.events.length?timeline(c.events.map(e=>{const pos=e.indexOf(' · ');return pos>=0?[e.slice(0,pos),e.slice(pos+3)]:['Fecha no especificada',e]})):empty('No hay eventos fechados suficientes para generar una cronología clínica.'),
 alcance:`<h3>Puntos que requieren corroboración</h3>${proseArr(c.checks)}<h3>Documentos de origen</h3><div class="report-ref-grid">${c.sources.map(t=>`<div>${u.svg('file-text')} ${u.esc(t)}</div>`).join('')}</div><div class="report-original-reference"><div><strong>Transcripción ilustrativa de origen</strong><small>Contenido ficticio, creado para visualizar el formato documental.</small></div><button type="button" class="btn secondary small" id="showOriginalSource" aria-expanded="false">Ver fuente completa</button></div><div id="originalSourceText" class="report-original-full hidden">${P(c.original)}</div><p class="report-small-context">Este expediente es sintético. No constituye una nota médica, diagnóstico ni documento firmado por personal sanitario.</p>`
 };
 return body;
}
function renderSynthetic(c){
 if(!c)return;
 selectedSyntheticCase=c;
 try { sessionStorage.setItem(selectedCaseStorageKey,c.id); } catch (_) {}
 const u=U(),record=u.state.record,emptyEl=u.$('#reportEmpty'),content=u.$('#reportContent');
 emptyEl.classList.add('hidden');content.classList.remove('hidden');
 const body=composeSynthetic(c);
 const options=syntheticCases().map(x=>`<option value="${u.esc(x.id)}" ${c.id===x.id?'selected':''}>${u.esc(x.id)} · ${u.esc(x.identity.name||'Sin nombre')} · ${u.esc(x.state)}</option>`).join('');
 const clinicalName=c.identity.name||'Nombre no registrado';
 const reportHeader=`<div class="report-scenario-bar"><label for="reportCaseSelect">Expediente</label><select id="reportCaseSelect" autocomplete="off" aria-label="Elegir expediente ficticio">${options}</select><span class="report-scenario-tag">${u.esc(c.state)}</span>${record?'<button type="button" class="btn ghost small" id="reportReturnRecord">Volver al expediente consultado</button>':''}</div>`;
 u.$('#reportToc').innerHTML=names.map(([key,label],i)=>`<a href="#r-${key}" data-anchor="r-${key}" class="${i===0?'active':''}">${String(i+1).padStart(2,'0')} · ${u.esc(label)}</a>`).join('');
 u.$('#reportDocument').innerHTML=reportHeader+`<header class="report-cover report-cover-clinical report-patient-cover"><div class="overline">ASSIST · XRAIC / EXPEDIENTE CLÍNICO INTEGRADO</div><span class="report-cover-eyebrow">PACIENTE</span><h2>${u.esc(clinicalName)}</h2><p class="report-cover-summary">${u.esc(c.title)} · ${u.esc(c.identity.service||'Servicio no registrado')}</p><div class="report-header-details"><span>${u.svg('folder')} Expediente EXP-${u.esc(c.id)}</span><span>${u.svg('clock')} ${u.esc(c.identity.date||'Fecha no registrada')}</span><span>${u.svg('file-text')} Síntesis documental</span></div></header>`+
 names.map(([key,label,title],i)=>`<section class="report-section report-story-section" id="r-${key}"><div class="report-story-heading"><span class="report-story-index">${String(i+1).padStart(2,'0')}</span><h2>${u.esc(title)}</h2></div><div class="report-story-content">${body[key]}${key==='alcance'?'':`<div class="report-story-reference"><a class="report-source-link" href="#r-alcance">Ver documentos de origen</a></div>`}</div></section>`).join('');
 // Sincroniza el control y la ficha en cada renderizado. Impide que el navegador
 // restaure otro valor visualmente distinto al expediente mostrado.
 const caseSelect=u.$('#reportCaseSelect');
 caseSelect.value=c.id;
 const selectCase=e=>{
  const next=syntheticCases().find(x=>x.id===e.target.value);
  if(!next || (selectedSyntheticCase&&selectedSyntheticCase.id===next.id))return;
  renderSynthetic(next);
  u.$('#r-ingresos')?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 caseSelect.addEventListener('change',selectCase);
 caseSelect.addEventListener('input',selectCase);
 const back=u.$('#reportReturnRecord');if(back)back.addEventListener('click',()=>{selectedSyntheticCase=null;try{sessionStorage.removeItem(selectedCaseStorageKey)}catch(_){}render()});
 const source=u.$('#showOriginalSource');if(source)source.addEventListener('click',()=>{const box=u.$('#originalSourceText');const opening=box.classList.contains('hidden');box.classList.toggle('hidden');source.textContent=opening?'Ocultar fuente completa':'Ver fuente completa';source.setAttribute('aria-expanded',String(opening))});
}

function render(){
 const u=U(),r=u.state.record,emptyEl=u.$('#reportEmpty'),content=u.$('#reportContent');
 // Al regresar desde Analítica, tomar la selección compartida más reciente.
 try {
   const sharedId=sessionStorage.getItem(selectedCaseStorageKey);
   if(sharedId)selectedSyntheticCase=syntheticCases().find(c=>c.id===sharedId)||selectedSyntheticCase;
 } catch (_) {}
 if(selectedSyntheticCase||!r){renderSynthetic(selectedSyntheticCase||syntheticCases()[0]);return;}
 // If no record has been searched yet, make the new visual design reviewable using a fictional case.
 const showcase=!r, model=showcase?demo:r;
 emptyEl.classList.add('hidden');content.classList.remove('hidden');
 const body=showcase?composeDemo():composeForRecord(r);
 const heading=showcase?demo.patientName:'Nombre no registrado';
 const sub=showcase?'Atención en urgencias · 18 de septiembre de 2026':r.title;
 const info=showcase?'18 de septiembre de 2026':(r.first&&r.last?`${r.first} — ${r.last}`:'Fechas no disponibles');
 u.$('#reportToc').innerHTML=names.map(([k,label],i)=>`<a href="#r-${k}" data-anchor="r-${k}" class="${i===0?'active':''}">${String(i+1).padStart(2,'0')} · ${u.esc(label)}</a>`).join('');
 u.$('#reportDocument').innerHTML=`<header class="report-cover report-cover-clinical report-patient-cover"><div class="overline">ASSIST · XRAIC / EXPEDIENTE CLÍNICO INTEGRADO</div><span class="report-cover-eyebrow">PACIENTE</span><h2>${u.esc(heading)}</h2><p class="report-cover-summary">${u.esc(sub)}</p><div class="report-header-details"><span>${u.svg('clock')} ${u.esc(info)}</span><span>${u.svg('folder')} Expediente ${u.esc(showcase?'R-SIM':r.id)}</span><span>${u.svg('file-text')} Síntesis con fuentes</span></div></header>`+
 names.map(([key,label,title],i)=>`<section class="report-section report-story-section" id="r-${key}"><div class="report-story-heading"><span class="report-story-index">${String(i+1).padStart(2,'0')}</span><h2>${u.esc(title)}</h2></div><div class="report-story-content">${body[key]}${key!=='alcance'?`<div class="report-story-reference">${sourceButton([key==='ingresos'?'NotaIngreso_HC':key==='historia'?'historiaclinica':key==='exploracion'?'SignosVitales':key==='evolucion'?'NotasEvolucion':key==='indicaciones'?'Indicaciones':key==='egreso'?'notaegreso':'NotaMedicaUrg'],!showcase)}</div>`:''}</div></section>`).join('');
 const source=u.$('#showOriginalSource');if(source)source.addEventListener('click',()=>{const box=u.$('#originalSourceText');const opening=box.classList.contains('hidden');box.classList.toggle('hidden');source.textContent=opening?'Ocultar nota completa':'Ver nota completa';source.setAttribute('aria-expanded',String(opening))});
}
window.XRAIC_INIT_REPORTE=function(){const u=U();u.renderReport=render;u.$('#reportToc').addEventListener('click',e=>{const a=e.target.closest('[data-anchor]');if(!a)return;e.preventDefault();const el=document.getElementById(a.dataset.anchor);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});u.$$('#reportToc a').forEach(x=>x.classList.toggle('active',x===a))}});
window.addEventListener('scroll',()=>{if(u.state.page!=='reporte')return;const active=u.$$('#reportDocument .report-section').filter(s=>s.getBoundingClientRect().top<190).pop();if(active)u.$$('#reportToc a').forEach(a=>a.classList.toggle('active',a.dataset.anchor===active.id))},{passive:true});};
})();
