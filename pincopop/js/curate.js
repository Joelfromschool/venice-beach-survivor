'use strict';
// v1.3.2 curation (runs after all clip files, before app.js):
//  - Kaise deprioritized: only 3 Kaise clips remain (Couples tab only, never in For You / Tokyo, low weight);
//    other clips she appeared in are recast (Pinco/Pooh) or made Asmon-solo (her lines become off-camera captions).
//  - Feed weights: Parenting and Baby Bean clips are boosted in For You (see app.js extend()).
(function(){
 const C=window.CLIPS;if(!C)return;
 const DROP=new Set(['k04','k06','k09']);
 const KEEP_KAISE=new Set(['k02','k08','y08']);
 const RECAST={x01:'pinco',x02:'pinco',x07:'pinco',x09:'pinco',x11:'pinco',sc06:'pinco',lu05:'pooh'};
 const SOLO=new Set(['k01','k03','k05','k07','k10']);
 const TXT=[['winter date tier list','winter night-out tier list'],['(by vibe, he disagreed)','(by vibe, Asmon disagreed)'],['冬デート格付け','冬のおでかけ格付け'],['彼は反対','アスモンは反対'],['#datenight','#tokyonights'],['けやき坂デートに一緒に行こ','けやき坂に一緒に行こ'],['#デート','#夜さんぽ'],['#tokyodate','#tokyonights'],['#東京デート','#東京おでかけ'],['#1 is our date this Friday 💙','#1 is our plan this Friday 💙'],['1位、金曜のデートで行く💙','1位、金曜に行く💙'],['POV: your date says “let’s just walk” 💙','POV: your bestie says “let’s just walk” 💙'],['POV：彼が「ちょっと歩こう」って 💙','POV：「ちょっと歩こう」💙'],['He found the roller coaster.','Asmon found the roller coaster.'],['彼がジェットコースターを発見。','アスモンがジェットコースターを発見。']];
 const fix=s=>{if(typeof s!=='string')return s;TXT.forEach(([a,b])=>{s=s.split(a).join(b)});return s};
 const walkTx=(sh,f)=>{(sh.tx||[]).forEach(f);(sh.panes||[]).forEach(p=>walkTx(p,f))};
 const walkA=(sh,f)=>{if(sh.a)sh.a=sh.a.map(f).filter(Boolean);(sh.panes||[]).forEach(p=>walkA(p,f))};
 for(let i=C.length-1;i>=0;i--)if(DROP.has(C[i].id))C.splice(i,1);
 C.forEach(c=>{
  if(KEEP_KAISE.has(c.id)){c.noFY=1;c.noTok=1;c.w=.3;c.also=(c.also||[]).filter(k=>k!=='tokyo');return}
  const who=RECAST[c.id];
  if(who){const pre=who==='pooh'?'c_pooh_':'c_pinco_';
   if(c.by==='kaise')c.by=who;c.also=(c.also||[]).filter(k=>k!=='couple');
   c.cap=c.cap.map(fix);
   c.shots.forEach(sh=>{walkA(sh,a=>{const m=/^kaise_(\d)$/.exec(a[0]);if(m)a[0]=pre+m[1];else if(a[0]==='w_couple_0')a[0]='w_pinco_0';else if(a[0]==='w_couple_1')a[0]='w_pinco_1';return a});
    walkTx(sh,t=>{t[2]=fix(t[2]);t[3]=fix(t[3]);const o=t[6];if(o&&o.who==='kaise')o.who=who})});
   (c.com||[]).forEach(x=>{if(x[0]==='kaise')x[0]='bronny';x[1]=fix(x[1]);x[2]=fix(x[2])})}
  if(SOLO.has(c.id)){
   c.shots.forEach(sh=>{walkA(sh,a=>/^kaise_\d$/.test(a[0])?null:a);if(sh.a&&sh.a.length===1)sh.a[0][1]=.5;
    walkTx(sh,t=>{const o=t[6];if(o&&o.who==='kaise'){t[2]='(her, off-camera) '+t[2];t[3]='（彼女・画面外）'+t[3];t[4]='sub';t[6]={}}})});
   (c.com||[]).forEach(x=>{if(x[0]==='kaise')x[0]='pinco'})}
  // fewer Kaise cameos elsewhere: her comments / live-chat lines go to other regulars
  let r=0;const alt=()=>['bronny','pinco'][r++%2];
  (c.com||[]).forEach(x=>{if(x[0]==='kaise')x[0]=alt()});
  if(c.live&&Array.isArray(c.live.chat))c.live.chat.forEach(x=>{if(Array.isArray(x)&&x[1]==='kaise')x[1]=alt()});
 });
})();
