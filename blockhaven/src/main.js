// Boot: build the world incrementally behind a loading bar, then show the title.
import {G} from './state.js';
import * as UI from './ui.js';
import {T} from './i18n.js';
async function boot(){
 const fail=m=>{document.querySelector('#loading .ltext').textContent=m};
 try{const t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl'))){fail('WebGL is not available on this device.');return}}catch(e){}
 UI.loading(.05,T('loading'));
 await import('./game.js');
 document.documentElement.lang=G.opt.lang;
 await G.api.bootWorld((p,k)=>UI.loading(p,T(k)));
 G.api.bindTouchControls();
 UI.loading(.95,T('mesh'));
 G.mode='title';G.api.toTitle();
 const q=new URLSearchParams(location.search);
 setTimeout(()=>UI.loading(1),350);
 if(q.has('qa'))window.BH_READY=true;
}
boot().catch(e=>{console.error(e);const l=document.querySelector('#loading .ltext');if(l)l.textContent='Error: '+e.message});
