const p=require('puppeteer-core');const O='/tmp/pin4/';require('fs').mkdirSync(O,{recursive:true});const sl=ms=>new Promise(r=>setTimeout(r,ms));
const ARG=process.argv[2]||'all';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const pg=await b.newPage();
await pg.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.evaluateOnNewDocument(()=>{if(!sessionStorage.getItem('k')){localStorage.clear();localStorage.setItem('pinco_save_v1',JSON.stringify({lang:'en'}));sessionStorage.setItem('k',1)}});
await pg.goto('http://localhost:8811/pinco/',{waitUntil:'networkidle0'});await sl(1000);
const sh=async n=>{await pg.screenshot({path:O+n+'.png'});console.log('  shot',n)};const tap=async sel=>{const e=await pg.$(sel);if(!e)throw new Error('no '+sel);await e.tap();await sl(250)};
const ev=(f,...a)=>pg.evaluate(f,...a);global.ERRS=errs;global.PGG=pg;const scene=()=>ev(()=>PG.scene);
const waitScene=async(s,ms=20000)=>{const t0=Date.now();while(Date.now()-t0<ms){if(await scene()===s)return true;await sl(100);}throw new Error('timeout waiting '+s+' at '+await scene());};
await pg.touchscreen.tap(195,300);await sl(300);await sh('00_title_en');
async function dialog(shotAt){let n=0;while(await scene()==='story'){if(shotAt&&await ev(()=>PG.DLG&&PG.DLG.d.lines[PG.DLG.i][0]==='party')&&!dialog.did){dialog.did=1;await sl(400);await sh(shotAt);}await pg.touchscreen.tap(195,380);await sl(330);if(++n>80)throw new Error('dialog stuck');}}
async function dress(){await waitScene('theme');await sl(500);await tap('[data-a=start]');await sl(400);
 for(const c of ['bg','top','bot','shoe','hat','acc','bow','wand']){await tap('[data-c='+c+']');const id=await ev(()=>{const cs=[...document.querySelectorAll('#items .card:not(.none)')];const th=cs.find(e=>e.querySelector('em'))||cs[0];return th&&th.dataset.i;});
  if(id){await tap('[data-i="'+id+'"]');if(c!=='bg'){const sw=await ev(()=>PG.theme.p[Math.floor(Math.random()*3)]);await tap('[data-s="'+sw+'"]');}}}
 await tap('#stampbtn');const pts=await ev(()=>{const r=stageRect(),pl=place(r.x,r.y,r.w,r.h);return [[200,260],[150,320],[250,330],[200,400],[160,460],[240,470],[200,520],[130,560],[270,560],[210,300],[180,420],[230,600]].map(([x,y])=>[pl.ox+x*pl.s,pl.oy+y*pl.s])});
 for(const [x,y] of pts){await pg.touchscreen.tap(x,y);await sl(90);}await tap('#stampbtn');}
async function runway(tag,quality=1){await tap('[data-a=done]');await waitScene('runway');let shot=0;
 const t0=Date.now();while(await scene()==='runway'&&Date.now()-t0<30000){
  if(await ev(()=>document.getElementById('tut').classList.contains('on'))){await sl(300);if(tag)await sh(tag+'_posetut');await tap('[data-a=tutok]');continue;}
  const nx=await ev(()=>{const R=PG.RUN&&PG.RUN.rh;if(!R)return null;const now=PG.nowA();const c=R.cs.find(c=>!c.g);return c?{dt:c.bt-now,x:c.x,y:c.y,n:c.n}:null;});
  if(!nx){if(!shot&&tag&&await ev(()=>PG.st>2.6)){shot=1;await sh(tag+'_walk');}await sl(60);continue;}
  if(tag&&nx.n===2&&!runway.s2){runway.s2=1;}
  if(nx.dt>.25){await sl(Math.max(0,(nx.dt-.25)*1000));continue;}
  const miss=Math.random()>quality;await sl(Math.max(0,(nx.dt*1000)-12+(miss?200:0)));await pg.touchscreen.tap(nx.x,nx.y);if(tag&&nx.n===3&&shot<2){shot=2;await sl(60);await sh(tag+'_rhythm');}}
 const r=await ev(()=>({pose:PG.RESULT.pose,stars:PG.RESULT.stars,grades:PG.RUN.rh?PG.RUN.rh.cs.map(c=>c.g):[],cameo:PG.RUN.cameo,react:PG.RUN.react&&PG.RUN.react.map(r=>r.s)}));console.log('  runway',JSON.stringify(r));
 await waitScene('score',15000);await sl(900);return r;}
async function serve(tag){await waitScene('serve');await sl(400);if(await ev(()=>document.getElementById('tut').classList.contains('on'))){if(tag)await sh(tag+'_servetut');await tap('[data-a=tutok]');}
 let shot=0;const t0=Date.now();
 while(await scene()==='serve'&&Date.now()-t0<120000){if(await ev(()=>document.getElementById('tut').classList.contains('on'))){await sl(500);if(tag)await sh(tag+'_shiftover');await tap('[data-a=tutok]');break;}
  const s=await ev(()=>{const S=PG.SV;if(!S)return null;return{c:S.cust.map(c=>c&&!c.leave?{o:c.o,p:c.pat}:null),tray:S.tray.length,cook:Object.keys(S.cook).length}});if(!s){await sl(200);continue;}
  const i=s.c.map((c,i)=>c?i:-1).filter(i=>i>=0).sort((a,b)=>s.c[a].p-s.c[b].p)[0];if(i==null){await sl(200);continue;}
  for(const [f,n] of Object.entries(s.c[i].o))for(let k=0;k<n;k++){await tap('[data-food="'+f+'"]');const ck=await ev(f=>FOODS[f][2],f);if(ck)await sl(ck*1000+120);}
  if(tag&&!shot&&await ev(()=>PG.SV.served>=2)){shot=1;await sh(tag+'_serve');}
  const r=await ev(i=>{const r=custRect(i);return[r.x+r.w/2,r.y+r.h*.6]},i);await pg.touchscreen.tap(r[0],r[1]);await sl(200);}
 console.log('  shift coins',await ev(()=>PG.S.story.coins));}
async function shop(){await waitScene('shop');await sl(400);let bought=[];
 for(let k=0;k<6;k++){const id=await ev(()=>{const ss=PG.S.story;const nt=PG.CH[Math.min(11,ss.retry?ss.ch:ss.ch+1)].th;const L=PG.ITEMS.filter(i=>!ss.owned[i.id]&&Math.max(15,i.p)<=ss.coins).sort((a,b)=>(b.tags.includes(nt)-a.tags.includes(nt))||a.p-b.p);return L[0]&&[L[0].id,L[0].c]});if(!id)break;
  await tap('[data-sc='+id[1]+']');await tap('[data-sbuy="'+id[0]+'"]');bought.push(id[0]);}console.log('  bought',bought.join(','),'left',await ev(()=>PG.S.story.coins));return bought;}
async function chapter(n,opt={}){console.log('== chapter',n);await waitScene('story');await dialog(n===1?'02_partyhat':opt.dshot);
 if(opt.cameo)await ev(()=>window.__CAMEO=1);else await ev(()=>window.__CAMEO=0);
 await dress();if(opt.dressShot)await sh(opt.dressShot);let r=await runway(opt.rtag,opt.q??1);await sh('ch'+n+'_score');
 let tries=0;while(await ev(()=>!!document.querySelector('[data-a=sretry]'))&&tries<2){tries++;console.log('  failed, retry');await tap('[data-a=sretry]');await dress();r=await runway(null,1);await sh('ch'+n+'_score_retry');}
 if(await ev(()=>document.getElementById('gift').classList.contains('on'))){await sl(900);await sh('ch'+n+'_gift');await tap('[data-a=giftok]');}
 await tap('[data-a=spass]');await waitScene('story');await dialog();if(n<12){await serve(opt.stag);await shop();if(opt.shopShot)await sh(opt.shopShot);await tap('[data-a=shopnext]');}}
if(ARG==='all'||ARG==='story'){
 await tap('[data-a=story]');await waitScene('smenu');await sl(300);await tap('[data-a=snew]');await waitScene('intro');
 for(let i=0;i<40;i++){const k=await ev(()=>PG.INT&&INTRO[PG.INT.i][2]);if(k==='yank'){await sl(500);await sh('01_intro_ad');break;}await sl(150);}
 for(let i=0;i<60;i++){if(await ev(()=>document.getElementById('in-help').classList.contains('on'))){await sl(300);await sh('01b_intro_taptohelp');await tap('#in-help');break;}await sl(150);}
 await waitScene('story',15000);await sl(600);
 await chapter(1,{rtag:'ch1',stag:'ch1',dressShot:'ch1_dress',q:.85});
 await chapter(2,{rtag:'ch2',q:.4});
 await chapter(3,{rtag:'ch3',stag:'ch3',cameo:1,shopShot:'ch3_shop'});
 await chapter(4,{rtag:'ch4',stag:'ch4',cameo:1});
 console.log('story state',await ev(()=>JSON.stringify({ch:PG.S.story.ch,stage:PG.S.story.stage,coins:PG.S.story.coins,owned:Object.keys(PG.S.story.owned).length,gifts:PG.S.gifts})));
 // debug jump to finale
 await ev(()=>goTitle());await sl(400);await tap('[data-a=story]');await sl(400);await sh('09_storymenu');await tap('[data-a=sdebug]');
 await chapter(12,{rtag:'ch12',cameo:1});await sl(1500);await sh('10_ending');console.log('done flag',await ev(()=>PG.S.story.done));}
// JP check
await ev(()=>{goTitle();});await sl(300);await tap('[data-a=opts]');await tap('[data-lang=ja]');await sl(400);await sh('20_options_jp');await tap('[data-a=optsx]');await sh('21_title_jp');
await tap('[data-a=play]');await sl(700);await sh('22_theme_jp');await tap('[data-a=start]');await sl(500);await tap('[data-c=hat]');await sh('23_dress_jp');
await tap('[data-a=done]');await waitScene('runway');await sl(2500);await sh('24_runway_jp');await ev(()=>PG.RUN&&(PG.st=6));
for(let i=0;i<80&&await scene()==='runway';i++){if(await ev(()=>document.getElementById('tut').classList.contains('on')))await tap('[data-a=tutok]');await sl(150);}
await waitScene('judge');await sl(4800);await sh('25_judges_jp');await waitScene('score');await sl(800);await sh('26_score_jp');
await tap('[data-a=home]');await tap('[data-a=bank]');await sl(800);await sh('27_bank_jp');await tap('[data-a=bankx]');
await tap('[data-a=story]');await sl(300);await tap('[data-a=scont]');await sl(1200);await sh('28_story_jp');
console.log('ERRS',errs);await b.close();})().catch(async e=>{console.log('FAIL',e.message,global.ERRS);try{await global.PGG.screenshot({path:O+'fail.png'})}catch(_){};process.exit(1)});process.on('exit',()=>{});
