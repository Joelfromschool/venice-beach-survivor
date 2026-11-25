// First-play guided lesson and contextual tips for Blockhaven. Touch-only wording.
import {G} from './state.js?v=1.1.4';
import {T,itemName} from './i18n.js?v=1.1.4';
import {B,def,isBlock} from './blocks.js?v=1.1.4';

const LOGS=[7,35,49,62];
const TOOLS=[120,121,122,123,124,125,126,127,128,129,130,131]; // wood/stone/iron tools
const PLACEABLE=id=>id&&id!==B.waystone&&id!==B.door&&(isBlock(id)||(def(id)&&def(id).plants));
const $ = s=>document.querySelector(s);

let U=null; // UI bindings (set from ui.js to avoid a cycle)
let active=false, step=0, stepT=0, stepStart=null, pulseSel=null, awaiting=false;
let lastNight=false, lastHunger=20, tipEl=null, tipT=0;
let pending={};

export function attach(ui){U=ui}

export function isActive(){return active}
export function stepIndex(){return step}

function api(){return G.api}
function P(){return api().P}
function flags(){return G.flags||(G.flags={})}
function tips(){const f=flags();if(!f.tips)f.tips={};return f.tips}
function saveTut(){const f=flags();f.tut={on:active,step,done:!!f.tutDone};try{api().save?.();api().saveOptions?.()}catch(e){}}

const STEPS=[
 {id:'look',target:'look',next:false},
 {id:'move',target:'#stick',next:false},
 {id:'jump',target:'#bJump',next:false},
 {id:'break',target:'#bMine',next:false},
 {id:'collect',target:'#hotbar',next:false},
 {id:'bag',target:'#bBag',next:false},
 {id:'place',target:'#bUse',next:false},
 {id:'craft',target:'#bBag',next:false},
 {id:'eat',target:'#status',next:false},
 {id:'night',target:'#hearts',next:true},
 {id:'save',target:'#bPause',next:true}
];

export function maybeStart(fromReplay){
 if(G.mode==='cinema')return;
 if(fromReplay){begin(true);return}
 const f=flags();
 if(f.tutDone||G.opt.tutorialDone)return;
 if(f.tut&&f.tut.on&&!f.tut.done){begin(false,f.tut.step||0);return}
 if(f.needTut){begin(false,0);return}
}

export function begin(replay,at){
 const a=api(),p=P();
 active=true;step=Math.max(0,Math.min(STEPS.length-1,at||0));stepT=0;awaiting=false;
 flags().needTut=false;flags().tut={on:true,step,done:false};
 document.body.classList.add('touch','lesson');
 if(U&&U.closePanel)U.closePanel(true);
 enterStep(true);
 // keep morning during the lesson so monsters do not interrupt
 if(G.clock>0.4)G.clock=0.08;
 lastNight=false;
 showLesson(true);
 U&&U.dirty&&U.dirty();
}

export function skip(ask){
 if(!active)return;
 if(ask!==false){confirmSkip();return}
 finish(true);
}

function confirmSkip(){
 const card=$('#lesson');if(!card)return;
 const box=card.querySelector('.lconfirm');
 if(box){box.classList.remove('hidden');return}
}

function cancelSkip(){const box=$('#lesson .lconfirm');if(box)box.classList.add('hidden')}

function finish(skipped){
 active=false;awaiting=false;pulseSel=null;
 flags().tut={on:false,step:STEPS.length,done:true};
 flags().tutDone=true;flags().needTut=false;
 G.opt.tutorialDone=true;
 document.body.classList.remove('lesson');
 showLesson(false);
 hidePointer();
 try{api().saveOptions();api().save()}catch(e){}
 if(U&&U.toast)U.toast(skipped?T('tutSkipped'):T('tutDone'));
 if(U&&U.banner&&!skipped)U.banner(T('tutDoneTitle'),T('tutDoneSub'));
 if(U&&U.dirty)U.dirty();
}

export function replay(){
 if(U&&U.closePanel)U.closePanel(true);
 if(G.inGame){G.mode='play';begin(true)}
}

function enterStep(reset){
 const s=STEPS[step];if(!s){finish(false);return}
 stepT=0;awaiting=false;
 const p=P(),a=api();
 stepStart={x:p.pos.x,y:p.pos.y,z:p.pos.z,yaw:p.yaw,pitch:p.pitch,mined:G.stats.mined,hp:p.hp,hunger:p.hunger,invOpen:false,bagOpened:false,placed:!!pending.placed,crafted:!!pending.crafted,ate:!!pending.ate,paused:false,collected:!!pending.collected};pending={};
 if(s.id==='place')ensurePlaceable();
 if(s.id==='craft')ensureCraftMats();
 if(s.id==='eat')prepareEat();
 if(s.id==='break'&&Math.abs(p.pitch)<0.2)p.pitch=-0.45;
 flags().tut={on:true,step,done:false};
 renderLesson();
}

function invHas(ids,n=1){
 const a=api();let c=0;
 for(const id of Array.isArray(ids)?ids:[ids])c+=a.countItem(id);
 return c>=n;
}
function firstSlot(pred){
 const inv=P().inv;for(let i=0;i<36;i++)if(inv[i]&&pred(inv[i].id))return i;return-1;
}
function selectSlot(i){if(i>=0){if(i>=9){/* leave in bag; try to find hotbar */}P().sel=i<9?i:P().sel;if(i>=9){const inv=P().inv;for(let h=0;h<9;h++)if(!inv[h]){inv[h]=inv[i];inv[i]=null;P().sel=h;break}}}if(U&&U.dirty)U.dirty()}

function ensurePlaceable(quiet){
 const i=firstSlot(PLACEABLE);
 if(i>=0){selectSlot(i);return}
 if(stepStart)stepStart.gaveDirt=true;
 api().addItem(2,8); // dirt
 const j=firstSlot(id=>id===2);selectSlot(j);
 if(U&&U.toast)U.toast(T('tutGaveDirt'));
}
function ensureCraftMats(){
 if(invHas(TOOLS,1))return;
 if(!invHas(LOGS,3)&&!invHas(8,9)){api().addItem(7,4);if(U&&U.toast)U.toast(T('tutGaveLogs'))}
}
function prepareEat(){
 const p=P();
 if(p.hunger>=18)p.hunger=14;
 if(!invHas([111,112,113,116,117,163,165],1))api().addItem(111,2);
 const i=firstSlot(id=>def(id)&&def(id).food);selectSlot(i);
}

function craftHint(){
 const a=api();
 if(invHas(TOOLS,1))return T('tutCraftHave');
 if(a.nearBlock([B.workbench])&&invHas(8,3)&&invHas(100,2))return T('tutCraftPick');
 if(invHas(23,1))return T('tutCraftPlaceBench');
 if(invHas(8,4)&&invHas(100,2))return T('tutCraftBench');
 if(invHas(8,2)&&!invHas(100,2))return T('tutCraftSticks');
 if(!invHas(8,4))return T('tutCraftPlanks');
 if(!invHas(100,2))return T('tutCraftSticks');
 return T('tutCraftBench');
}

const HINT_AT=25, SKIPSTEP_AT=10;
function stepText(){
 const s=STEPS[step];
 let out;
 if(s.id==='bag'&&stepStart&&stepStart.bagOpened)out={title:T('tutBagOpenTitle'),body:T('tutBagOpenBody')};
 else if(s.id==='craft')out={title:T('tut_craft_t'),body:craftHint()};
 else out={title:T('tut_'+s.id+'_t'),body:T('tut_'+s.id+'_b')};
 if(s.id==='break'&&stepStart&&stepStart.hardBlock)out.body=T('tutBreakHard');
 else if(stepT>=HINT_AT&&!s.next)out.body=T('tutStuck')+T('tutHint_'+s.id)+'\n'+out.body;
 return out;
}
export function skipStep(){
 if(!active)return;
 cancelSkip();stepT=1;step++;
 if(step>=STEPS.length){finish(false);return}
 enterStep();
}

export function renderLesson(){
 const el=$('#lesson');if(!el)return;
 if(!active){el.classList.add('hidden');const wrap=$('#panelwrap');if(wrap)wrap.style.paddingTop='';return}
 el.classList.remove('hidden');
 const open=!!(U&&U.isOpen&&U.isOpen());el.classList.toggle('compact',open);void el.offsetHeight;
 const wrap=$('#panelwrap');if(wrap)wrap.style.paddingTop=open?(Math.ceil(el.getBoundingClientRect().height)+10)+'px':'';
 const s=STEPS[step],tx=stepText();
 el.querySelector('.lstep').textContent=T('tutStep',{n:String(step+1),m:String(STEPS.length)});
 el.querySelector('.ltitle').textContent=tx.title;
 el.querySelector('.lbody').textContent=tx.body;
 const next=el.querySelector('.lnext');
 next.classList.toggle('hidden',!(s.next||(s.id==='bag'&&stepStart&&stepStart.bagOpened)||(s.id==='craft'&&invHas(TOOLS,1))||(s.id==='collect'&&stepStart&&(stepStart.collected||stepT>8))));
 const sk=el.querySelector('.lskipstep');if(sk){sk.classList.toggle('hidden',!!s.next||stepT<SKIPSTEP_AT);sk.textContent=T('tutSkipStep')}
 next.textContent=T('tutGotIt');
 el.querySelector('.lskip').textContent=T('tutSkip');
 el.querySelector('.lyes').textContent=T('tutSkipYes');
 el.querySelector('.lno').textContent=T('tutSkipNo');
 el.querySelector('.lskipq').textContent=T('tutSkipQ');
 // goal tracker also lives here; mark the title as the next action
}

export function renderGoal(qb){
 if(!active||!qb)return false;
 const tx=stepText();
 qb.innerHTML=`<div class="qt">${T('tutNext')}</div><div class="qh">${esc(tx.title)}</div>`;
 return true;
}

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

function showLesson(on){const el=$('#lesson');if(!el)return;el.classList.toggle('hidden',!on)}

function hidePointer(){
 const p=$('#coachpulse'),a=$('#coacharrow'),z=$('#lookzone');
 if(p)p.classList.add('hidden');if(a)a.classList.add('hidden');if(z)z.classList.add('hidden');
 pulseSel=null;
}

function pointAt(sel){
 const pulse=$('#coachpulse'),arrow=$('#coacharrow'),zone=$('#lookzone');
 if(!pulse||!arrow)return;
 if(sel==='look'){
  pulse.classList.add('hidden');arrow.classList.add('hidden');
  if(zone){zone.classList.remove('hidden');layoutLookZone(zone)}
  return;
 }
 if(zone)zone.classList.add('hidden');
 const el=$(sel);if(!el||!el.getClientRects().length){pulse.classList.add('hidden');arrow.classList.add('hidden');return}
 const r=el.getBoundingClientRect();
 const pad=10;
 pulse.classList.remove('hidden');
 let pl=r.left-pad, pt=r.top-pad, pw=r.width+pad*2, ph=r.height+pad*2;
 if(pl<2){pw+=pl-2;pl=2} if(pt<2){ph+=pt-2;pt=2}
 if(pl+pw>innerWidth-2)pw=innerWidth-2-pl;
 if(pt+ph>innerHeight-2)ph=innerHeight-2-pt;
 pulse.style.left=pl+'px';pulse.style.top=pt+'px';
 pulse.style.width=Math.max(24,pw)+'px';pulse.style.height=Math.max(24,ph)+'px';
 const cx=r.left+r.width/2, cy=r.top+r.height/2;
 const spaceAbove=r.top, spaceBelow=innerHeight-(r.bottom);
 let candidates=[];
 if(sel==='#bMine'||sel==='#bUse'||sel==='#bTalk'||sel==='#bSneak'){
  candidates.push(['right',r.left-10,cy],['left',r.right+10,cy],['down',cx,r.top-6],['up',cx,r.bottom+8]);
 }else if(sel==='#bPause'){
  candidates.push(['up',cx,r.bottom+8],['left',r.right+10,r.bottom+2],['left',r.right+10,cy]);
 }else if(sel==='#bJump'&&r.right>innerWidth-90){
  candidates.push(['right',r.left-8,cy],['down',cx,r.top-6],['up',cx,r.bottom+8]);
 }else{
  if(spaceAbove>=70)candidates.push(['down',cx,r.top-6]);
  if(spaceBelow>70)candidates.push(['up',cx,r.bottom+6]);
  candidates.push([cx>innerWidth/2?'right':'left',cx>innerWidth/2?r.left-6:r.right+6,cy]);
 }
 const avoidSels=['#status','#hunger','#hotbarwrap','#hotbar','#xp','#lesson','#stick','#bJump','#bTalk','#bSneak','#bBag','#bPause','#bMine','#bUse','#bMap','#bView'].filter(s=>s!==sel);
 const avoid=avoidSels.map($).filter(e=>e&&!e.classList.contains('hidden')&&e.getClientRects().length).map(e=>e.getBoundingClientRect());
 const boxOf=(dir,ax,ay)=>{const s=34;return dir==='down'?{left:ax-s/2,right:ax+s/2,top:ay-s,bottom:ay}:dir==='up'?{left:ax-s/2,right:ax+s/2,top:ay,bottom:ay+s}:dir==='left'?{left:ax,right:ax+s+4,top:ay-s/2,bottom:ay+s/2}:{left:ax-s-4,right:ax,top:ay-s/2,bottom:ay+s/2}};
 const hits=box=>avoid.some(a=>box.left<a.right-2&&box.right>a.left+2&&box.top<a.bottom-2&&box.bottom>a.top+2)
  ||box.top<2||box.left<2||box.right>innerWidth-2||box.bottom>innerHeight-2;
 const pick=candidates.find(([d,x,y])=>!hits(boxOf(d,x,y)));
 if(!pick){arrow.classList.add('hidden');return}
 const[dir,ax,ay]=pick;
 arrow.classList.remove('hidden');
 arrow.dataset.dir=dir;
 arrow.style.left=ax+'px';arrow.style.top=ay+'px';
 const lab=arrow.querySelector('.alabel');
 if(lab){const tx=labelFor(sel);lab.textContent=tx;lab.style.display=(sel==='#bMine'||sel==='#bUse'||sel==='#bPause'||sel==='#bTalk'||sel==='#bSneak')?'none':'block'}
}
function layoutLookZone(z){
 const tbtns=$('#tbtns');const hudBottom=(tbtns?tbtns.getBoundingClientRect().top:innerHeight-120)-10;
 const topbar=$('#topbar');let top=(topbar?topbar.getBoundingClientRect().bottom:8)+8;
 const lesson=$('#lesson');const lr=lesson&&!lesson.classList.contains('hidden')?lesson.getBoundingClientRect():null;
 let left=innerWidth*0.40, width=innerWidth*0.54;
 if(lr&&lr.right<innerWidth*0.5&&innerWidth>innerHeight){left=lr.right+12;width=Math.max(140,Math.min(innerWidth*0.4,innerWidth-left-210))}
 else if(lr){
  if(lr.width>innerWidth*0.66){top=Math.max(top,lr.bottom+8);left=innerWidth*0.34;width=innerWidth*0.62}
  else{width=Math.max(110,lr.left-16-innerWidth*0.08);left=Math.max(8,lr.left-width-10);if(width<120){left=8;width=Math.max(100,lr.left-16)}}
 }
 const height=Math.max(72,hudBottom-top);
 z.style.left=left+'px';z.style.top=top+'px';z.style.width=width+'px';z.style.height=height+'px';
 z.querySelector('.lzlab').textContent=T('tutDragHere');
}
function labelFor(sel){
 return ({'#stick':T('tutLblMove'),'#bJump':T('jump'),'#bMine':T('mine'),'#bUse':T('use'),'#bBag':T('bag'),'#hotbar':T('tutLblHotbar'),'#status':T('tutLblStatus'),'#hearts':T('hp'),'#bPause':T('paused')}[sel])||'';
}

function advance(){
 if(stepT<0.85)return; // let them read
 step++;
 if(step>=STEPS.length){finish(false);return}
 enterStep();
}

export function tick(dt){
 // contextual tips run even when the lesson is over
 tickTips(dt);
 if(!active){hidePointer();return}
 if(!G.inGame||G.mode==='cinema'||G.mode==='dialog'||G.mode==='dead'||G.mode==='title'){hidePointer();return}
 stepT+=dt;
 const s=STEPS[step];if(!s)return;
 renderLesson();
 if(U&&U.isOpen&&U.isOpen())hidePointer();
 else pointAt(s.target);
 // keep the lesson un-stuckable
 if(s.id==='place'&&!PLACEABLE(P().inv[P().sel]&&P().inv[P().sel].id)&&!(U&&U.isOpen&&U.isOpen()))ensurePlaceable(true);
 if(s.id==='break'&&stepStart){const b=api().breakingInfo&&api().breakingInfo();if(b&&b.need>3&&b.t>0.8)stepStart.hardBlock=true}
 // completion
 if(checkDone(s))advance();
}

function checkDone(s){
 const p=P(),inp=api().input||G.input||{};
 const st=stepStart||{};
 if(s.id==='look'){
  const dy=Math.abs(p.yaw-st.yaw),dp=Math.abs(p.pitch-st.pitch);
  return dy>0.4||dp>0.28;
 }
 if(s.id==='move'){
  const dist=Math.hypot(p.pos.x-st.x,p.pos.z-st.z);
  return dist>1.15||(Math.hypot(inp.stickX||0,inp.stickY||0)>0.55&&stepT>1.1);
 }
 if(s.id==='jump'){
  return (p.vel.y>3&&!p.onGround)||(st.y!==undefined&&p.pos.y>st.y+0.6);
 }
 if(s.id==='break'){
  return G.stats.mined>st.mined;
 }
 if(s.id==='collect'){
  return !!st.collected||!!st.acked;
 }
 if(s.id==='bag'){
  return !!st.bagClosed;
 }
 if(s.id==='place'){
  return !!st.placed;
 }
 if(s.id==='craft'){
  return invHas(TOOLS,1);
 }
 if(s.id==='eat'){
  return !!st.ate||p.hunger>st.hunger+0.5;
 }
 if(s.id==='night'){
  return !!st.acked;
 }
 if(s.id==='save'){
  return !!st.paused||!!st.acked;
 }
 return false;
}

export function gotIt(){
 if(!active)return;
 const s=STEPS[step];if(!s||!stepStart)return;
 if(s.id==='night'||s.id==='save'||s.id==='collect'||s.id==='bag'||s.id==='craft'){stepStart.acked=true;stepStart.bagClosed=stepStart.bagClosed||(s.id==='bag'&&stepStart.bagOpened);stepT=Math.max(stepT,0.9)}
}

export function onPanel(kind,open){
 if(!active||!stepStart)return;
 const s=STEPS[step];
 if(kind==='inv'||kind==='craft'){
  if(open){stepStart.bagOpened=true;if(s&&s.id==='bag')renderLesson()}
  else if(stepStart.bagOpened&&s&&s.id==='bag'){stepStart.bagClosed=true;stepT=Math.max(stepT,0.9)}
 }
 if(kind==='craft'&&open){stepStart.craftOpen=true}
 if(kind==='pause'&&open){stepStart.paused=true;stepT=Math.max(stepT,0.9)}
}

export function onPickup(id,n){
 if(active&&stepStart&&STEPS[step]&&(STEPS[step].id==='collect'||STEPS[step].id==='break')){
  stepStart.collected=true;if(STEPS[step].id==='collect')stepT=Math.max(stepT,0.9);
 }
 // if they picked up while still on break, remember it for the collect step
 if(active&&stepStart)stepStart.collected=true;
 firstTip('pickup',T('tipPickup'));
}

export function onBreak(){/* mined is checked in tick */}
export function onPlace(id){
 if(active&&stepStart){stepStart.placed=true;stepT=Math.max(stepT,0.9)}
 if(id===B.workbench)firstTip('benchplaced',T('tipBenchPlaced'));
 if(id===B.door)firstTip('doorplaced',T('tipDoorPlaced'));
 else if(!active){const t=tips();t._placed=(t._placed||0)+1;if(t._placed>=6&&!api().countItem(B.door))firstTip('housedoor',T('tipHouseDoor'))}
 if(id===B.torch)firstTip('torch',T('tipTorch'));
 if(id===B.bed)firstTip('bed',T('tipBed'));
}
export function onCraft(r){
 if(active&&stepStart){stepStart.crafted=true;if(r&&TOOLS.includes(r.out))stepT=Math.max(stepT,0.9)}
 if(r&&r.out===23)firstTip('benchcraft',T('tipBenchCraft'));
 if(r&&r.out===8&&!active)firstTip('housedoor',T('tipHouseDoor'));
 if(r&&TOOLS.includes(r.out))firstTip('tool',T('tipTool'));
}
export function onEat(){
 if(active&&stepStart){stepStart.ate=true;stepT=Math.max(stepT,0.9)}
 firstTip('ate',T('tipAte'));
}
export function onWaystone(){tips().waystone=true}
export function onDoor(open){firstTip('door1',T('tipDoorUse'))}
export function onHurt(){firstTip('hurt',T('tipHurt'))}

function tickTips(dt){
 if(tipEl){tipT-=dt;if(tipT<=0){tipEl.classList.add('out');const e=tipEl;setTimeout(()=>e.remove(),400);tipEl=null}}
 if(!G.inGame||G.mode!=='play')return;
 const p=P(),a=api();
 const night=a.isNight&&a.isNight();
 if(night&&!lastNight)firstTip('nightfall',T('tipNightfall'));
 lastNight=night;
 if(p.hunger<=6&&lastHunger>6)firstTip('hungry',T('tipHungry'));
 lastHunger=p.hunger;
 if(a.nearBlock&&a.nearBlock([B.workbench],4))firstTip('nearbench',T('tipNearBench'));
 if(a.nearBlock&&a.nearBlock([B.kiln,B.kiln_lit],4))firstTip('nearkiln',T('tipNearKiln'));
 if(a.nearBlock&&a.nearBlock([B.bed],3))firstTip('nearbed',T('tipNearBed'));
 if(a.nearBlock&&a.nearBlock([B.waystone,B.waystone_fixed],4))firstTip('waystone',T('tipWaystone'));
 if(a.nearBlock&&a.nearBlock([B.chest],3))firstTip('nearchest',T('tipNearChest'));
 if(a.nearBlock&&a.nearBlock([B.ferry_bell],5))firstTip('ferry',T('tipFerry'));
 // hostile nearby
 if(G.mobs&&G.mobs.some(m=>m.d&&m.d.hostile&&Math.hypot(m.pos.x-p.pos.x,m.pos.z-p.pos.z)<9))firstTip('mob',T('tipMob'));
}

export function firstTip(id,text){
 if(!text)return;
 if(active){
  // do not stack a tip that repeats the current lesson
  const s=STEPS[step];
  if(s&&['night','eat','craft','save'].includes(s.id)&&['nightfall','hungry','nearbench','ate'].includes(id))return;
 }
 const t=tips();if(t[id])return;t[id]=true;
 showTip(text);
}

function showTip(text){
 let host=$('#tiplayer');
 if(!host){host=document.createElement('div');host.id='tiplayer';(document.querySelector('#ui')||document.body).appendChild(host)}
 if(tipEl){tipEl.remove();tipEl=null}
 tipEl=document.createElement('div');tipEl.className='gametip';tipEl.textContent=text;
 host.appendChild(tipEl);tipT=5.2;
}

export function bindLessonDom(){
 // called once from ui.js after #lesson exists
 const el=$('#lesson');if(!el||el._bound)return;el._bound=true;
 el.querySelector('.lskip').addEventListener('click',e=>{e.stopPropagation();confirmSkip()});
 const ss=el.querySelector('.lskipstep');if(ss)ss.addEventListener('click',e=>{e.stopPropagation();skipStep()});
 el.querySelector('.lnext').addEventListener('click',e=>{e.stopPropagation();gotIt()});
 el.querySelector('.lyes').addEventListener('click',e=>{e.stopPropagation();skip(false)});
 el.querySelector('.lno').addEventListener('click',e=>{e.stopPropagation();cancelSkip()});
}

// How-to-play section data (illustrated in ui.js)
export const HTP_SECTIONS=['look','buttons','mine','place','bag','craft','house','warp','vitals','night','save','quests','coast'];
