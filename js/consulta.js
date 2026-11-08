(function(){
'use strict';
const U=()=>window.XUI;
const terms={
'B-01':['tos','congestion','respiratoria'],
'B-02':['rodilla','musculoesqueletico','actividad fisica'],
'B-03':['metabolico','laboratorio','seguimiento'],
'B-04':['hospitalizacion prolongada','ingreso hospitalario','cambio de servicio'],
'B-05':['atenciones multiples','dermatologico','varios episodios']
};
function findRecord(query){const u=U(),q=u.normalize(query);let exact=u.records.find(r=>new RegExp('(?:expediente\\s*)?'+r.id.replace('-','[-\\s]?'),'i').test(query));if(exact)return [exact];let scored=Object.entries(terms).map(([id,phrases])=>({rec:u.records.find(r=>r.id===id),score:phrases.reduce((sum,p)=>sum+(q.includes(p)?p.length:0),0)})).filter(x=>x.score>0&&x.rec).sort((a,b)=>b.score-a.score);if(!scored.length)return [];
// A clear case description should win, but a partial generic symptom never selects arbitrarily.
if(scored[0].score>=(scored[1]?.score||0)*1.3)return [scored[0].rec];return scored.slice(0,4).map(x=>x.rec)}
function getData(rec){const u=U();return {clinical:u.cases[rec.id],extra:u.detail[rec.id]||{},rec}}
function p(text){return `<p>${U().esc(text)}</p>`}
function sourceButton(rec,types=[]){const u=U();let t=types.filter(x=>rec.counts[x]);if(!t.length)t=Object.keys(rec.counts).slice(0,5);return `<div class="answer-actions"><button type="button" class="btn secondary small" data-open-sources="${u.esc(t.join(','))}">${u.svg('file-search')} Fuentes de esta respuesta</button><button type="button" class="btn ghost small" data-goto-report="true">${u.svg('file-text')} Abrir expediente</button></div>`}
function list(items){return `<ul class="answer-list">${items.filter(Boolean).map(x=>`<li>${U().esc(x)}</li>`).join('')}</ul>`}
function timeline(events){return `<div class="timeline">${events.map(([date,text,src])=>`<div class="timeline-item"><span class="timeline-date">${U().esc(date)}</span><strong>${U().esc(text)}</strong><span class="muted">Fuente: ${U().esc(src)}</span></div>`).join('')}</div>`}
function answerFor(question,rec){let {clinical,extra}=getData(rec),q=U().normalize(question);let body='',used=[],topic='Síntesis documental';
if(/antecedente|alergia|historia clinica/.test(q)){
 topic='Antecedentes documentados';used=['historiaclinica'];
 body=clinical?.antecedents?.length?`<p>En la historia clínica y las notas revisadas se registran los siguientes antecedentes:</p>${list(clinical.antecedents)}<p class="answer-caveat">Estos datos describen lo consignado en los documentos y pueden requerir cotejo con registros posteriores.</p>`:
 `<p>${U().esc(extra.reason||'No se dispone de una síntesis clínica de antecedentes para este caso.')}</p><p>No se debe asumir que un campo sin información equivale a antecedentes negados.</p>`;
}else if(/signo|presion|temperatura|saturacion|pulso|vital/.test(q)){
 topic='Signos vitales disponibles';used=['SignosVitales'];
 body=p(extra.vitals||rec.vitals||'No hay mediciones clínicas resumidas suficientes en esta muestra para describir la evolución de signos vitales.')+'<p class="answer-caveat">Los rangos extraídos de diferentes fechas no equivalen a una tendencia clínica. Para interpretarlos, revisa la fecha y procedencia de cada medición.</p>';
}else if(/medicament|receta|farmac|tratamiento|indicacion|dosis|terapia/.test(q)){
 topic='Tratamientos documentados';used=['Indicaciones','Recetas','RecetasDet'];
 body=clinical?.treatments?.length?`<p>Estos tratamientos o indicaciones aparecen mencionados en los registros:</p>${list(clinical.treatments)}<p class="answer-caveat">Una receta o indicación no demuestra por sí misma administración, dispensación ni adherencia.</p>`:
 `<p>La documentación incluye indicaciones y otras capturas clínicas, pero no hay una lista narrativa validada de tratamientos en esta muestra. No sería correcto inventar nombres o dosis.</p>`;
}else if(/evoluci|cronolog|que paso|que ocurrio|despues|ingreso|alta|egreso|procedim|operacion|cirugia/.test(q)){
 topic='Evolución y cronología';used=['NotaMedicaUrg','NotasEvolucion','NotaPostOperatoria','notaegreso'];
 body=clinical?.events?.length?`<p>${U().esc(extra.reason||clinical.summary)}</p>${timeline(clinical.events)}${extra.closing?p(extra.closing):''}`:`<p>${U().esc(extra.reason||'La vista agrupa los registros disponibles por episodio.')}</p><p>El expediente presenta ${rec.episodes.length} ingreso(s) diferenciados. Las fechas del índice documental se pueden inspeccionar en el reporte, pero no permiten reconstruir por sí solas toda la evolución.</p>`;
}else if(/diagnos|problema|hallazgo|principal|motivo|resumen|expediente|paciente|persona|quien|qu[eé] tiene|mu[eé]strame|muestrame/.test(q)){
 topic='Resumen clínico del expediente';used=['historiaclinica','NotaMedicaUrg','NotasEvolucion','notaegreso'];
 body=`<p class="answer-lead">${U().esc(clinical?.summary||extra.reason||rec.summary||'El expediente reúne documentos de diversas atenciones, pero la muestra no incluye una síntesis clínica verificada.')}</p>`+
 (extra.diagnosis?`<div class="clinical-inline"><strong>Hallazgos y diagnósticos consignados</strong>${p(extra.diagnosis)}</div>`:'')+
 (clinical?.verify?.length?`<div class="clinical-inline caution"><strong>Por corroborar</strong>${p(clinical.verify[0])}</div>`:'')+
 `<p class="answer-caveat">Síntesis automatizada de documentación; no es una nueva valoración ni una nota médica firmada.</p>`;
}else if(/cuanto|cuantas|cantidad|documentos|registros|fuentes|filas/.test(q)){
 topic='Disponibilidad de documentación';used=[];
 body=`<p>El expediente contiene documentos de ${rec.episodes.length} ingreso(s) y registros de ${Object.keys(rec.counts).map(k=>U().pretty[k]||k).join(', ')}. La vista principal los integra por episodio y significado clínico; las capturas individuales quedan en Fuentes utilizadas.</p><p class="answer-caveat">Un renglón no representa necesariamente un evento clínico diferente.</p>`;
}else{
 topic='Respuesta sobre el expediente';used=['historiaclinica','NotaMedicaUrg','NotasEvolucion'];
 body=`<p>${U().esc(clinical?.summary||extra.reason||'La pregunta está vinculada al expediente activo.')}</p><p>Para profundizar, puedes preguntar por antecedentes, evolución, tratamientos, signos vitales o pendientes de verificación. Cuando la muestra no contenga el detalle necesario, se señalará en lugar de inventarlo.</p>`;
}
return {topic,body,types:used};}
function appendUser(text){let u=U(),node=document.createElement('div');node.className='message user';node.innerHTML=`<div class="bubble">${u.esc(text)}</div>`;u.$('#chatMessages').appendChild(node)}
function appendAI(html,rec,topic='Respuesta'){let u=U(),node=document.createElement('div');node.className='message ai';node.innerHTML=`<div class="ai-avatar">${u.svg('activity')}</div><div class="ai-content"><div class="ai-label">ASSIST · ${u.esc(topic)}</div><div class="ai-response">${html}</div></div>`;u.$('#chatMessages').appendChild(node);node.scrollIntoView({behavior:'smooth',block:'nearest'});}
// Presenta una síntesis breve al abrir un expediente, antes de las repreguntas.
function showRecordIntro(rec){
 const u=U(),clinical=u.cases[rec.id]||{},extra=u.detail[rec.id]||{};
 const summary=clinical.summary||extra.reason||rec.summary||'Hay documentación vinculada a este expediente; revisa el reporte y las fuentes para conocer su alcance.';
 const episodeCount=Array.isArray(rec.episodes)?rec.episodes.length:0;
 appendAI('<div class="chat-record-intro"><strong>Expediente '+u.esc(rec.id)+' localizado</strong><p>'+u.esc(summary)+'</p><small>'+episodeCount+' ingreso(s) identificado(s) · Síntesis documental, no una valoración médica nueva.</small></div>'+sourceButton(rec,[]),rec,'Expediente disponible');
}
let pendingQuestion="";
function renderMatched(matches,q){pendingQuestion=q;let u=U();u.$('#emptyConversation').classList.add('hidden');u.$('#chatWrap').classList.remove('hidden');appendAI(`<p>Encontré varias personas o expedientes que podrían coincidir. Para evitar mezclar información clínica, selecciona el caso correcto:</p><div class="match-options">${matches.map(r=>`<button type="button" class="match-option" data-match="${u.esc(r.id)}"><strong>${u.esc(r.title)}</strong><small>${u.esc(u.detail[r.id]?.reason||'Expediente documental')}</small></button>`).join('')}</div>`,null,'Coincidencias de búsqueda');}
function saveHistory(question,rec,answer){let u=U();u.state.history.unshift({question,record:rec.id,summary:answer.topic,date:new Date().toISOString()});u.state.history=u.state.history.slice(0,60);try{localStorage.setItem('xraic-v6-history',JSON.stringify(u.state.history))}catch{}}
function submit(question){let u=U();question=question.trim();if(!question)return;u.$('#chatInput').value='';if(!u.state.record){let matches=findRecord(question);u.$('#emptyConversation').classList.add('hidden');u.$('#chatWrap').classList.remove('hidden');appendUser(question);
 if(!matches.length){appendAI(`<p>No encontré una coincidencia suficientemente clara con esa descripción. Puedes incluir el motivo de atención, una fecha o buscar por clave sin escribir SQL.</p><button class="btn secondary small" type="button" data-open-chooser>Buscar por clave</button>`,null,'Búsqueda documental');return}
 if(matches.length>1){renderMatched(matches,question);return}
 u.choose(matches[0]);
 appendUser(question);
}else appendUser(question);
let rec=u.state.record,answer=answerFor(question,rec);if(!u.$('#chatMessages').querySelector('.message.ai'))showRecordIntro(rec);appendAI(answer.body+sourceButton(rec,answer.types),rec,answer.topic);u.state.turns.push({question,topic:answer.topic,answer:answer.body});saveHistory(question,rec,answer);u.$('#composerStatus').textContent='Consultando '+rec.title+' · Puedes seguir preguntando';}
function init(){let u=U();u.answer=submit;u.showRecordIntro=showRecordIntro;
 u.$('#chatForm').onsubmit=e=>{e.preventDefault();submit(u.$('#chatInput').value)};
 u.$('#chatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit(u.$('#chatInput').value)}};
 u.$('#emptySelect')?.addEventListener('click',u.openChooser);
 document.addEventListener('click',e=>{let quick=e.target.closest('[data-quick]');if(quick)submit(quick.dataset.quick);let matched=e.target.closest('[data-match]');if(matched){let rec=u.records.find(r=>r.id===matched.dataset.match);if(rec){let text=pendingQuestion||('Muéstrame una síntesis clínica del expediente '+rec.id);u.choose(rec);appendUser(text);showRecordIntro(rec);let answer=answerFor(text,rec);appendAI(answer.body+sourceButton(rec,answer.types),rec,answer.topic);saveHistory(text,rec,answer);pendingQuestion='';}} if(e.target.closest('[data-open-chooser]'))u.openChooser()});
 u.$('#voiceButton').onclick=()=>{u.state.voice=(u.state.voice+1)%5;let texts=['','Grabando… Pulsa de nuevo para detener.','Transcribiendo audio…','Transcripción disponible para revisión.','No fue posible transcribir el audio.'];let icons=['mic','stop','mic','check','mic'];u.$('#voiceStatus').textContent=texts[u.state.voice];u.$('#voiceStatus').className='voice-state '+(u.state.voice===1?'recording':u.state.voice===2?'processing':'');u.$('#voiceButton').innerHTML=u.svg(icons[u.state.voice]);u.$('#voiceButton').title='Estado de audio: '+(texts[u.state.voice]||'En reposo');};}
window.XRAIC_INIT_CONSULTA=init;
})();
