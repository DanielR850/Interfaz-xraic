(function(){
'use strict';
const u=window.XUI;
// Every view is a separate file and is mounted before listeners are registered.
for(const name of ['consulta','reporte','analitica','historial','pruebas']){
 const slot=document.getElementById('slot-'+name);
 if(!slot||!window.XRAIC_VIEWS[name])throw new Error('Falta la vista '+name);
 slot.outerHTML=window.XRAIC_VIEWS[name];
}
window.XRAIC_INIT_CONSULTA();
window.XRAIC_INIT_REPORTE();
window.XRAIC_INIT_ANALITICA();
window.XRAIC_INIT_HISTORIAL();
u.initCore();
})();
