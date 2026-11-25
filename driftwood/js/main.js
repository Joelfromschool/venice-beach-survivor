'use strict';
(function boot(){
 initThree();
 // title backdrop: build the island from the save (or a fresh one) without starting play
 const saved=loadSave();S=saved||newSave('','',{skin:1,hair:1,hairC:1,eyes:0,top:'t_white',bottom:'b_shorts',shoe:'s_sneak'});
 G.W=genIsland();if(!S.w)S.w=genWorld();buildWorld();updateSky(true);
 // a few friends on the title beach
 S=null;
 UI.init();UI.show('title');
 requestAnimationFrame(loop);
 window.__dd={G,get S(){return S},UI,Act,NPC,House,Tut,Crit,startPlay,save,dayKey,ITEMS};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else if(G.mode==='play'){if(ensureDay())UI.afterNewDay();updateSky(true)}});
 addEventListener('pagehide',save);
})();
