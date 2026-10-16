const p=require('/workspace/venice-game/node_modules/puppeteer-core');const O='/tmp/pin/';require('fs').mkdirSync(O,{recursive:true});const sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const pg=await b.newPage();
await pg.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.evaluateOnNewDocument(()=>{if(!sessionStorage.getItem('k')){localStorage.clear();sessionStorage.setItem('k',1)}});
await pg.goto('http://localhost:8811/pinco/',{waitUntil:'networkidle0'});await sl(1200);
const sh=async n=>{await pg.screenshot({path:O+n+'.png'})};const tap=async sel=>{const e=await pg.$(sel);if(!e)throw new Error('no '+sel);await e.tap();await sl(260)};
await sh('01_title');await tap('[data-a=play]');await sl(700);await sh('02_theme');
for(let r=1;r<=2;r++){
 if(r===2){await tap('[data-a=next]');await sl(700);}
 await tap('[data-a=start]');await sl(500);
 const th=await pg.evaluate(()=>document.getElementById('d-theme').textContent);console.log('round',r,th);
 // for each tab pick the first owned on-theme item (else first owned), tint with a theme colour
 const cats=['top','bot','shoe','hat','acc','bow','wand','bg'];
 for(const c of cats){await tap('[data-c='+c+']');
  const id=await pg.evaluate(()=>{const cs=[...document.querySelectorAll('#items .card:not(.none)')];const ok=cs.filter(e=>!e.classList.contains('lock'));const th=ok.find(e=>e.querySelector('em'))||ok[0];return th&&th.dataset.i;});
  if(r===2){const buy=await pg.evaluate(()=>{const cs=[...document.querySelectorAll('#items .card.lock')];const c=cs.find(e=>PG.IT[e.dataset.i].p<=PG.S.coins);return c&&c.dataset.i});if(buy){await tap('[data-i="'+buy+'"]');console.log('bought',buy,await pg.evaluate(()=>PG.S.coins));continue;}}
  if(id){await tap('[data-i="'+id+'"]');}
  const pal=await pg.evaluate(()=>[...document.querySelectorAll('#th-p i')].map(i=>getComputedStyle(i).backgroundColor));
  if(c!=='bg'){const sw=await pg.evaluate(()=>{const t=document.getElementById('d-theme').textContent;const th=THEMES.find(x=>t.includes(x.n));return th.p[Math.floor(Math.random()*3)]});await tap('[data-s="'+sw+'"]');}
  if(c==='top'&&r===1)await sh('03_dress_top');}
 // stamp mode
 await tap('#stampbtn');await tap('[data-t=heart]');
 const pts=await pg.evaluate(()=>{const r=stageRect(),pl=place(r.x,r.y,r.w,r.h);return [[200,260],[150,320],[250,330],[200,400],[160,460],[240,470],[200,520],[130,560],[270,560]].map(([x,y])=>[pl.ox+x*pl.s,pl.oy+y*pl.s])});
 for(const [x,y] of pts){await pg.touchscreen.tap(x,y);await sl(120);}
 await tap('[data-t=star]');for(const [x,y] of pts.slice(0,4)){await pg.touchscreen.tap(x+12,y+14);await sl(120);}
 await sl(400);await sh('04_dress_r'+r);
 console.log('stamps',await pg.evaluate(()=>PG.O.stamps.length),'time',await pg.evaluate(()=>PG.timeLeft|0));
 await tap('[data-a=done]');await sl(2500);await sh('05_runway_r'+r);await sl(3600);await sh('06_pose_r'+r);
 await sl(2200);await sh('07_judges_r'+r);await sl(2400);await sh('07b_judges_r'+r);await sl(1800);
 console.log('scene',await pg.evaluate(()=>PG.scene),'coins',await pg.evaluate(()=>PG.S.coins));await sh('08_score_r'+r);
 // try buying something affordable for round 2
 if(r===1){console.log(await pg.evaluate(()=>document.getElementById('sc-unl').textContent));}
}
await tap('[data-a=photo]');await sl(800);
await tap('#s-score [data-a=closet]');await sl(500);await sh('09_closet');
console.log('closet',await pg.evaluate(()=>PG.S.closet.length));
console.log('ERRS',errs);await b.close()})();
