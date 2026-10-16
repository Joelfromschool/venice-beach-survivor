const p=require('puppeteer-core');const sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();await pg.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
pg.on('pageerror',e=>console.log('ERR',e.message));await pg.goto('http://localhost:8811/pinco/');await sl(800);
for(const ch of [2,11]){await pg.evaluate(ch=>{window.__CAMEO=1;S.tutPose=1;S.lang='en';ST.on=true;S.story.ch=ch;theme=THEMES.find(t=>t.id==='royal');O=newOutfit();Object.assign(O,{top:'gown',hat:'crown',shoe:'heels',acc:'pearls',wand:'starw',bow:'classic'});scene='dress';goRunway();},ch);
 await sl(7000);await pg.screenshot({path:'/tmp/fr_'+ch+'.png'});}
await pg.evaluate(()=>{S.story.ch=10;scene='story';playDialog({bg:'london',cast:['holiday','kermit'],lines:[['holiday','Ho ho!','ホッホー！']]},()=>{});});await sl(700);await pg.screenshot({path:'/tmp/fr_cast.png'});await b.close()})();
