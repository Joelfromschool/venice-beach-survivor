// ===== v2.0 boutique, closet gifts, boot =====
const SPRICE=it=>Math.max(15,it.p);let SHOPCAT='top';
function openShop(){scene='shop';st=0;show('s-shop');playSong('title');renderShop();}
function renderShop(){const ss=S.story,nxt=CH[Math.min(CH.length-1,ss.retry?ss.ch:ss.ch+1)],nt=THEMES.find(t=>t.id===nxt.th);setSCoins();
 $('sh-note').textContent=T('shopnote',nt.e+' '+THN(nt));
 $('sh-tabs').innerHTML=CATS.map(([k,n,e])=>'<button class="tab'+(SHOPCAT===k?' on':'')+'" data-sc="'+k+'"><b>'+e+'</b><span>'+CATN(k)+'</span></button>').join('');
 const L=ITEMS.filter(i=>i.c===SHOPCAT).sort((a,b)=>(b.tags.includes(nt.id)-a.tags.includes(nt.id))||SPRICE(a)-SPRICE(b));
 $('sh-grid').innerHTML=L.map(it=>{const own=ss.owned[it.id],pr=SPRICE(it);return'<div class="shopc'+(own?' own':pr>ss.coins?' poor':'')+'">'+(it.tags.includes(nt.id)?'<em>✨</em>':'')+'<img src="'+thumb(it.id)+'" alt=""><div>'+IN(it)+'</div><button data-sbuy="'+it.id+'">'+(own?'✓ '+T('owned'):'🪙 '+pr)+'</button></div>';}).join('');}
document.addEventListener('click',e=>{const t=e.target.closest('[data-sc]');if(t){SHOPCAT=t.dataset.sc;SFX.tap();renderShop();$('sh-grid').scrollTop=0;return;}
 const b=e.target.closest('[data-sbuy]');if(b){const it=IT[b.dataset.sbuy],ss=S.story,pr=SPRICE(it);if(ss.owned[it.id])return;if(ss.coins<pr){SFX.bad();toast(T('needmore',pr-ss.coins,IN(it)));return;}
  ss.coins-=pr;ss.owned[it.id]=1;save();SFX.buy();buzz(10);toast(T('unlocked',IN(it),pr));const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top,16,['#ffcc33','#fff','#ff7eb6'],140);renderShop();return;}
 const a=e.target.closest('[data-a="shopnext"]');if(a){SFX.sparkle();const ss=S.story;if(ss.retry){ss.stage='show';}else{ss.ch=Math.min(CH.length-1,ss.ch+1);ss.stage='pre';}ST.retryAfter=0;save();storyGo();}});
// coins pills follow the active wallet
setCoins=function(){document.querySelectorAll('.coins').forEach(e=>e.textContent=ST.on?S.story.coins:S.coins);};
// closet: Looks / Gifts tabs
let CLT='looks';const _openCloset=openCloset;
openCloset=function(){_openCloset();document.querySelectorAll('.ctab').forEach(b=>b.classList.toggle('on',b.dataset.ct===CLT));if(CLT==='gifts'){const G=S.gifts.slice().reverse();
 $('cl-grid').innerHTML=G.length?G.map(g=>'<div class="gift"><img src="'+thumb(g.id)+'" alt=""><div>'+IN(IT[g.id])+'</div><small>'+T('giftfrom',CN(g.who))+'</small></div>').join(''):'<p class="empty">'+T('nogifts')+'</p>';}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-ct]');if(!b)return;CLT=b.dataset.ct;SFX.tap();openCloset();});
// title refresh
const _goTitle=goTitle;goTitle=function(){$('opts').classList.remove('on');_goTitle();applyLang();$('th-rule').textContent=T('rule');};
// ---- boot ----
applyLang();requestAnimationFrame(frame);setMute(S.mute);goTitle();
window.PG=Object.defineProperties(window.PG||{},Object.getOwnPropertyDescriptors({get SV(){return SV},get RUN(){return RUN},get RESULT(){return RESULT},get DLG(){return DLG},get INT(){return INT},nowA,storyGo,openShop,setLang,CH,get st(){return st},set st(v){st=v},get theme(){return theme}}));
