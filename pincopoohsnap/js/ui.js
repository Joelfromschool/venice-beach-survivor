'use strict';
const $=id=>document.getElementById(id);
const HUD={
 start(co){$('hFilm').textContent=G.film;$('hCourse').textContent=HS.L(co);$('bHoney').classList.toggle('lock',!HS.state.honey);$('hTip').classList.remove('on');$('pause').classList.remove('on');$('hBanner').className='banner';this.banner(HS.L(co),'#4ad8ff');},
 update(g){$('hFilm').textContent=g.film;$('hProg').style.width=Math.min(100,g.u*100)+'%';$('bWhistle').classList.toggle('cd',g.whCd>0);$('hFilm').parentNode.classList.toggle('low',g.film<=5);},
 banner(t,col,big){const b=$('hBanner');b.textContent=t;b.style.setProperty('--bc',col||'#ff5aa0');b.className='banner'+(big?' big':'');void b.offsetWidth;b.classList.add('on');},
 tip(t){const e=$('hTip');e.textContent=t;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');clearTimeout(this._tt);this._tt=setTimeout(()=>e.classList.remove('on'),4200);},
 ring(){const r=$('hRing');r.classList.remove('on');void r.offsetWidth;r.classList.add('on');},
 snap(img){const f=$('hFlash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');const t=$('hThumb');t.style.backgroundImage=`url(${img})`;t.classList.remove('on');void t.offsetWidth;t.classList.add('on');$('vf').classList.remove('kick');void $('vf').offsetWidth;$('vf').classList.add('kick');},
 flashMsg(t){this.tip(t);},
 press(k){const b={apple:'bApple',honey:'bHoney',whistle:'bWhistle'}[k];if(!b)return;const e=$(b);e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');},
};
const HS={KEY:'pincopoohsnap_v1',lang:'en',scr:'sTitle',reg:'la',
 defState(){const ja=(navigator.language||'').toLowerCase().startsWith('ja');return{v:1,started:false,opt:{lang:ja?'ja':'en',music:.7,sfx:1,sens:1},pts:0,unlocked:{venice:true},secrets:{},best:{},album:{},specials:{},req:{},honey:false,cheat:false,played:{}};},
 load(){let s=null;try{s=JSON.parse(localStorage.getItem(this.KEY));}catch(e){}const d=this.defState();if(!s||s.v!==1)return d;return Object.assign(d,s,{opt:Object.assign(d.opt,s.opt||{})});},
 save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.state));}catch(e){try{for(const k in this.state.album)if(this.state.album[k].img&&this.state.album[k].img.length>60000)this.state.album[k].img='';localStorage.setItem(this.KEY,JSON.stringify(this.state));}catch(e2){}}},
 T(k,v){const s=STR[k];let r=s?s[this.lang==='ja'?1:0]:k;if(v)for(const x in v)r=r.replace('{'+x+'}',v[x]);return r;},
 L(o){return o?(o[this.lang]||o.en):'';},
 cn(c){return this.L(CHARS[c]);},
 applyLang(){document.documentElement.lang=this.lang;document.querySelectorAll('[data-t]').forEach(e=>e.textContent=this.T(e.dataset.t));document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===this.lang));const u=$('updbar');if(u)u.textContent=this.T('updated');this.titleSub();},
 setLang(l){this.lang=this.state.opt.lang=l;this.save();this.applyLang();if(this.scr!=='sGame')this.render(this.scr);},
 show(id){AU.play&&0;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));this.scr=id;this.render(id);
  const mus={sTitle:'title',sIntro:'lab',sMap:'title',sAlbum:'title',sReq:'title',sOptions:null,sReview:'lab'}[id];if(mus)AU.playMusic(mus);},
 render(id){if(id==='sMap')this.renderMap();if(id==='sAlbum')this.renderAlbum();if(id==='sReq')this.renderReq();if(id==='sOptions')this.renderOpt();if(id==='sTitle')this.titleSub();},
 toast(t,ms){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(this._to);this._to=setTimeout(()=>e.classList.remove('on'),ms||2600);},
 modal(html,btns){const m=$('modal'),b=$('mBox');b.innerHTML=html+'<div class="mbtns">'+btns.map((x,i)=>`<button class="btn ${x.cls||''}" data-i="${i}">${x.t}</button>`).join('')+'</div>';m.classList.add('on');
  b.querySelectorAll('[data-i]').forEach(e=>e.onclick=()=>{AU.play('ui');m.classList.remove('on');const f=btns[+e.dataset.i].f;if(f)f();});},
 // ---------- title ----------
 titleSub(){const s=this.state;const c=$('tCont');c.disabled=!s.started;$('tContSub').textContent=s.started?(this.T('points')+' '+s.pts.toLocaleString()):this.T('nosave');},
 titleTap(){AU.unlock();AU.playMusic('title');AU.play('yay');$('tStart').classList.add('hide');$('tMenu').classList.add('on');},
 newGame(){const go=()=>{const lang=this.lang;this.state=this.defState();this.state.opt.lang=lang;this.state.started=true;this.save();this.intro();};
  if(this.state.started)this.modal(`<p>${this.T('confirmNew')}</p>`,[{t:this.T('no')},{t:this.T('yes'),cls:'pink',f:go}]);else go();},
 intro(){this.show('sIntro');let i=0;const step=()=>{const l=INTRO[i];$('iTxt').textContent=this.L(l);$('iProf').src='art/c_prof_'+l.p+'.webp';$('iProf').classList.remove('bob');void $('iProf').offsetWidth;$('iProf').classList.add('bob');};step();
  $('iNext').onclick=()=>{AU.play('ui');i++;if(i>=INTRO.length){this.reg='la';this.show('sMap');}else step();};},
 // ---------- map ----------
 unlockedIdx(i){const co=COURSES[i],s=this.state;if(i===0||s.unlocked[co.id]||s.cheat)return true;if(s.pts>=co.need)return true;const prev=COURSES[i-1];return !!s.secrets[prev.id];},
 renderMap(){const s=this.state;$('mPts').textContent=s.pts.toLocaleString();
  $('mRegs').innerHTML=REGIONS.map(r=>{const first=COURSES.findIndex(c=>c.reg===r.id);const ok=this.unlockedIdx(first);return`<button class="chip ${r.id===this.reg?'on':''} ${ok?'':'lock'}" data-reg="${r.id}">${ok?'':'🔒 '}${this.L(r)}</button>`;}).join('');
  $('mRegs').querySelectorAll('[data-reg]').forEach(b=>b.onclick=()=>{AU.play('ui');this.reg=b.dataset.reg;this.renderMap();});
  $('mList').innerHTML=COURSES.map((co,i)=>{if(co.reg!==this.reg)return'';const ok=this.unlockedIdx(i);const prev=COURSES[i-1];
   return`<div class="ccard ${ok?'':'lock'}" data-i="${i}"><div class="cimg" style="background-image:url(art/bg_${co.bg}.webp)">${s.secrets[co.id]?'<span class="sec">★</span>':''}${co.fork?'<span class="fork">🔀</span>':''}</div>
    <div class="cinfo"><b>${this.L(co)}</b><small>${ok?this.L(co.blurb):this.T('needPts',{n:co.need.toLocaleString(),c:prev?this.L(prev):''})}</small>${ok&&s.best[co.id]?`<em>${this.T('best')} ${s.best[co.id].toLocaleString()}</em>`:''}</div>
    <button class="btn ${ok?'pink':''} go" ${ok?'':'disabled'}>${ok?this.T('go'):'🔒'}</button></div>`;}).join('');
  $('mList').querySelectorAll('.ccard').forEach(c=>{const i=+c.dataset.i;c.onclick=()=>{if(!this.unlockedIdx(i)){AU.play('back');return;}AU.play('ui');this.play(COURSES[i]);};});
  $('mList').scrollTop=0;},
 play(co){this.cur=co;this.show('sGame');G.first=!Object.keys(this.state.played).length;G.start(co);},
 // ---------- review ----------
 review(photos,co,flags){const s=this.state;s.played[co.id]=true;if(flags.secret)s.secrets[co.id]=true;this.save();this.rv={photos,co,flags,sel:{},items:[],course:0,reqPts:0,news:[]};this.show('sReview');$('rCount').textContent=photos.length;
  ['rPick','rEval','rSum'].forEach(x=>$(x).classList.remove('on'));
  const groups={};for(const p of photos){if(!p.main)continue;(groups[p.main.c]=groups[p.main.c]||[]).push(p);}
  this.rv.groups=groups;const keys=CAST_ORDER.filter(c=>groups[c]);
  if(!keys.length){this.summary();return;}
  for(const c of keys){let best=null,bv=-1;for(const p of groups[c]){const v=G.evalPhoto(p).total;if(v>bv){bv=v;best=p;}}this.rv.sel[c]=best.id;}
  $('rGroups').innerHTML=keys.map(c=>`<div class="rg"><div class="rgh"><img src="art/c_${c}_1.webp" alt=""><b>${this.cn(c)}</b><small>×${groups[c].length}</small></div><div class="rrow">${groups[c].map(p=>`<button class="ph ${this.rv.sel[c]===p.id?'on':''}" data-c="${c}" data-id="${p.id}" style="background-image:url(${p.img})"></button>`).join('')}</div></div>`).join('');
  $('rGroups').querySelectorAll('.ph').forEach(b=>b.onclick=()=>{AU.play('tick');const c=b.dataset.c,id=+b.dataset.id;if(this.rv.sel[c]===id)delete this.rv.sel[c];else this.rv.sel[c]=id;$('rGroups').querySelectorAll(`.ph[data-c="${c}"]`).forEach(x=>x.classList.toggle('on',this.rv.sel[c]===+x.dataset.id));$('rShow').disabled=!Object.keys(this.rv.sel).length;});
  $('rShow').disabled=false;$('rPick').classList.add('on');$('rGroups').scrollTop=0;
  $('rShow').onclick=()=>{AU.play('ui');this.rv.items=CAST_ORDER.filter(c=>this.rv.sel[c]!==undefined).map(c=>photos[this.rv.sel[c]]);this.rv.k=0;$('rPick').classList.remove('on');$('rEval').classList.add('on');this.evalNext();};},
 evalNext(){const rv=this.rv;if(rv.k>=rv.items.length){$('rEval').classList.remove('on');this.summary();return;}
  const p=rv.items[rv.k++];const e=G.evalPhoto(p);const s=this.state;const c=p.main.c;rv.course+=e.total;
  $('eImg').src=p.img;$('eName').textContent=this.cn(c);$('eStamp').className='stamp';$('eNext').disabled=true;
  const tier=p.main.tags.includes('secret')?'secret':e.total>=3000?'high':e.total>=1300?'mid':'low';const lines=PROF_LINES[tier];$('eSay').textContent=this.L(lines[(Math.random()*lines.length)|0]);$('eProf').src='art/c_prof_'+(tier==='secret'?2:tier==='low'?0:1)+'.webp';
  const rows=[[this.T('size'),e.size],[this.T('pose'),e.pose],[this.T('tech'),e.notes.length?e.notes.map(n=>n==='centered'?this.T('centered'):n==='cropped'?this.T('cropped'):'×0.5').join(' '):'—'],[this.T('friends'),e.friends?'+'+e.friends:'—'],[this.T('special'),e.special?'+'+e.special:'—']];
  $('eRows').innerHTML=rows.map(r=>`<div class="er"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')+`<div class="er tot"><span>${this.T('total')}</span><b id="eTot">0</b></div>`;
  const ers=[...$('eRows').querySelectorAll('.er')];ers.forEach((r,i)=>{setTimeout(()=>{r.classList.add('on');AU.play('tick');},250+i*260);});
  setTimeout(()=>{let v=0;const tot=$('eTot');const iv=setInterval(()=>{v=Math.min(e.total,v+Math.ceil(e.total/18)+10);tot.textContent=v.toLocaleString();AU.play('tick');if(v>=e.total){clearInterval(iv);
    const prev=s.album[c];if(!prev||e.total>prev.score){s.album[c]={score:e.total,img:p.img,course:p.course,pose:p.main.pose};$('eStamp').textContent=this.T('newRecord');$('eStamp').className='stamp on';AU.play('stamp');}
    if(p.main.tags.includes('secret')){const sp=s.specials[p.course];if(!sp||e.total>sp.score)s.specials[p.course]={score:e.total,img:p.img,c};}
    for(const q of REQUESTS){if(s.req[q.id]||!q.t)continue;if(q.t(p)){s.req[q.id]=true;rv.reqPts+=q.pts;rv.news.push(this.T('reqDone',{r:this.L(q),n:q.pts.toLocaleString()}));}}
    this.save();$('eNext').disabled=false;}},45);},250+rows.length*260+300);
  $('eNext').onclick=()=>{AU.play('ui');this.evalNext();};},
 summary(){const rv=this.rv,s=this.state,co=rv.co;const before=COURSES.map((c,i)=>this.unlockedIdx(i));
  if(!s.req.r_all&&CAST_ORDER.every(c=>s.album[c])){s.req.r_all=true;const q=REQUESTS.find(q=>q.id==='r_all');rv.reqPts+=q.pts;rv.news.push(this.T('reqDone',{r:this.L(q),n:q.pts.toLocaleString()}));}
  const earned=rv.course+rv.reqPts;s.pts+=earned;s.best[co.id]=Math.max(s.best[co.id]||0,rv.course);
  if(!s.honey&&s.pts>=HONEY_AT){s.honey=true;rv.news.push(this.T('honeyGet'));}
  COURSES.forEach((c,i)=>{if(!before[i]&&this.unlockedIdx(i)){s.unlocked[c.id]=true;rv.news.push(this.T('unlocked',{c:this.L(c)}));}});
  if(rv.flags.secret)rv.news.unshift('★ '+this.T('secretFound')+': '+this.L(co.secret));
  this.save();
  $('sRows').innerHTML=[[this.L(co),''],[this.T('photosTaken'),rv.photos.length],[this.T('earned'),'+'+rv.course.toLocaleString()],[this.T('requests'),rv.reqPts?'+'+rv.reqPts.toLocaleString():'—'],[this.T('points'),s.pts.toLocaleString()]].map((r,i)=>`<div class="er on ${i===4?'tot':''}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')+(rv.items.length?'':`<div class="er on"><span>${this.L(PROF_LINES.none[0])}</span><b></b></div>`);
  $('sNews').innerHTML=rv.news.map(n=>`<div>${n}</div>`).join('');$('rSum').classList.add('on');AU.jingle();
  $('sDone').onclick=()=>{AU.play('ui');const ni=COURSES.findIndex((c,i)=>!before[i]&&this.unlockedIdx(i));if(ni>=0)this.reg=COURSES[ni].reg;this.show('sMap');};},
 // ---------- album / requests ----------
 renderAlbum(){const s=this.state;const cards=CAST_ORDER.map(c=>{const a=s.album[c];return`<button class="acard ${a?'':'empty'}" data-c="${c}">${a&&a.img?`<div class="aimg" style="background-image:url(${a.img})"></div>`:`<div class="aimg sil"><img src="art/c_${c}_1.webp" alt=""></div>`}<b>${this.cn(c)}</b><small>${a?a.score.toLocaleString()+' '+this.T('pts'):this.T('unseen')}</small></button>`;}).join('');
  const sp=COURSES.filter(co=>s.specials[co.id]).map(co=>{const x=s.specials[co.id];return`<button class="acard sp" data-s="${co.id}"><div class="aimg" style="background-image:url(${x.img})"></div><b>★ ${this.L(co.secret)}</b><small>${this.L(co)}</small></button>`;}).join('');
  $('aGrid').innerHTML=cards+`<h3 class="ah">${this.T('specials')} (${Object.keys(s.specials).length}/${COURSES.length})</h3>`+(sp||`<p class="hint">—</p>`);
  $('aGrid').querySelectorAll('[data-c],[data-s]').forEach(b=>b.onclick=()=>{const a=b.dataset.c?s.album[b.dataset.c]:s.specials[b.dataset.s];if(!a||!a.img)return;AU.play('ui');const co=COURSES.find(c=>c.id===a.course||c.id===b.dataset.s);
   this.modal(`<div class="bigph"><img src="${a.img}" alt=""></div><h3>${b.dataset.c?this.T('recordOf',{c:this.cn(b.dataset.c)}):'★ '+this.L(co.secret)}</h3><p>${co?this.L(co):''} · ${a.score.toLocaleString()} ${this.T('pts')}</p>`,[{t:this.T('back')}]);});},
 renderReq(){const s=this.state;$('qList').innerHTML=REQUESTS.map(q=>`<div class="rq ${s.req[q.id]?'done':''}"><i>${s.req[q.id]?'✓':'○'}</i><span>${this.L(q)}</span><b>+${q.pts.toLocaleString()}</b></div>`).join('');},
 // ---------- options ----------
 renderOpt(){const s=this.state.opt;const seg=(id,vals,cur,f)=>{$(id).innerHTML=vals.map(v=>`<button class="chip ${Math.abs(v[0]-cur)<.01?'on':''}" data-v="${v[0]}">${v[1]}</button>`).join('');$(id).querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{AU.play('ui');f(+b.dataset.v);this.save();this.renderOpt();});};
  const vol=[[0,this.T('off')],[.4,'40%'],[.7,'70%'],[1,'100%']];seg('oMusic',vol,s.music,v=>{s.music=v;AU.setMV(v);});seg('oSfx',vol,s.sfx,v=>{s.sfx=v;AU.setSV(v);AU.play('ui');});
  seg('oSens',[[.7,this.lang==='ja'?'ゆっくり':'Slow'],[1,this.lang==='ja'?'ふつう':'Normal'],[1.4,this.lang==='ja'?'はやい':'Fast']],s.sens,v=>{s.sens=v;});},
 cheat(){const v=($('oCheat').value||'').trim().toUpperCase();if(v==='AMSABABY'){const s=this.state;s.cheat=true;s.honey=true;s.pts+=50000;s.started=true;COURSES.forEach(c=>s.unlocked[c.id]=true);this.save();AU.play('secret');this.toast(this.T('cheatOk'));$('oCheat').value='';}else{AU.play('back');this.toast(this.T('cheatBad'));}},
 // ---------- init ----------
 init(){this.state=this.load();this.lang=this.state.opt.lang;AU.mv=this.state.opt.music;AU.sv=this.state.opt.sfx;
  $('tCast').innerHTML=['pooh_1','pinco_1','bean_1','max_1','dkermit_1','party_1'].map((k,i)=>`<img class="tc tc${i}" src="art/c_${k}.webp" alt="">`).join('');
  document.addEventListener('pointerdown',()=>AU.unlock(),{passive:true});
  ['touchend','pointerup'].forEach(ev=>document.addEventListener(ev,()=>AU.unlock(),{passive:true,capture:true}));
  $('sTitle').addEventListener('click',e=>{if(e.target.closest('.tmenu,.tlang,.tgames'))return;if(!$('tMenu').classList.contains('on'))this.titleTap();});
  $('tCont').onclick=()=>{AU.play('ui');this.show('sMap');};$('tNew').onclick=()=>{AU.play('ui');this.newGame();};
  $('tOpt').onclick=()=>{AU.play('ui');this.optBack='sTitle';this.show('sOptions');};$('mOpt').onclick=()=>{AU.play('ui');this.optBack='sMap';this.show('sOptions');};
  $('oBack').onclick=()=>{AU.play('back');this.show(this.optBack||'sTitle');};
  $('mAlbum').onclick=()=>{AU.play('ui');this.show('sAlbum');};$('mReq').onclick=()=>{AU.play('ui');this.show('sReq');};
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{AU.play('back');this.show(b.dataset.go);});
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=e=>{e.stopPropagation();AU.play('ui');this.setLang(b.dataset.lang);});
  $('oCheatGo').onclick=()=>this.cheat();$('oReset').onclick=()=>{this.modal(`<p>${this.T('resetQ')}</p>`,[{t:this.T('no')},{t:this.T('yes'),cls:'danger',f:()=>{const l=this.lang;this.state=this.defState();this.state.opt.lang=l;this.save();this.toast('OK');this.show('sTitle');$('tMenu').classList.add('on');$('tStart').classList.add('hide');}}]);};
  // game buttons
  const tapBtn=(id,f)=>{const e=$(id);e.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();AU.unlock();f();});};
  tapBtn('bShoot',()=>G.shoot());tapBtn('bApple',()=>G.throwItem('apple'));tapBtn('bHoney',()=>{if(!this.state.honey){HUD.tip(this.T('locked'));return;}G.throwItem('honey');});tapBtn('bWhistle',()=>G.whistle());
  tapBtn('hPause',()=>{G.paused=true;$('pause').classList.add('on');AU.play('ui');});
  $('pResume').onclick=()=>{G.paused=false;$('pause').classList.remove('on');AU.play('ui');};
  $('pRestart').onclick=()=>{AU.play('ui');$('pause').classList.remove('on');G.start(this.cur);};
  $('pQuit').onclick=()=>{AU.play('back');$('pause').classList.remove('on');G.cleanup();this.show('sMap');};
  const zr=$('zoomR');['pointerdown','touchstart'].forEach(ev=>zr.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));zr.addEventListener('input',()=>G.setZoom(+zr.value));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.on&&!G.paused){G.paused=true;$('pause').classList.add('on');}});
  G.init();this.applyLang();this.show('sTitle');
  window.__snap={G,HS,W,FX};}
};
window.addEventListener('load',()=>HS.init());
