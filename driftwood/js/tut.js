'use strict';
// ================= first-day tutorial =================
const TUT=['talk','shake','craft','fish','bug','sell','home','report'];
const Tut={
 step(){return S&&!S.tut.done?TUT[S.tut.step]:null},
 start(isNew){this.refresh()},
 next(){S.tut.step++;SFX.play('jingle');if(S.tut.step>=TUT.length){S.tut.done=true}this.refresh();save()},
 skip(){const s=this.step();if(!s)return;
  if(s==='talk'){this.grant()}if(s==='craft'&&!bagCount('frod'))addItem('frod');if(s==='bug'&&!bagCount('fnet'))addItem('fnet');if(s==='report'){this.finish();return}
  this.next()},
 grant(){if(S.tut.granted)return;S.tut.granted=true;addItem('stool');S.coins+=0},
 finish(){S.tut.done=true;S.tut.step=TUT.length;S.stamps+=300;UI.toast(T('tutDone'));SFX.play('fanfare');
  // residents that arrive later can now start their schedule
  for(const id of RESIDENTS){const v=S.vill[id]||(S.vill[id]={f:0});}NPC.schedule();this.refresh();UI.refreshHud();save()},
 ev(e){const s=this.step();if(!s)return;
  if(s==='shake'&&e==='branch'){if(bagCount('branch')>=5)this.next();else this.refresh()}
  else if(s==='craft'&&e==='craft:frod')this.next();
  else if(s==='fish'&&e==='fish')this.next();
  else if(s==='bug'&&e==='bug')this.next();
  else if(s==='sell'&&e==='sell')this.next();
  else if(s==='home'&&e==='deco')this.next()},
 async talk(id){const s=this.step();const ja=LANG==='ja';
  if(id!=='pooping'){if(s==='talk'){await UI.say(id,ja?'あっ、新しい島民さん！まずは広場のミスター・プーピングにあいさつしてきて！':'Oh, a new islander! Go say hi to Mr Pooping in the plaza first!');return true}return false}
  if(s==='talk'){
   await UI.say('pooping',ja?`ようこそ、${S.name}！ぼくはミスター・プーピング。この${S.island}島の島民サービス係だよ。`:`Welcome, ${S.name}! I'm Mr Pooping, and I run Resident Services here on ${S.island}.`);
   await UI.say('pooping',ja?'あそこの青いテントがきみの家。まずはテント代として1,500アイランドスタンプ。島で何かするとたまるから、のんびり返してね。':'That blue tent is your new home! It costs 1,500 Island Stamps. You earn stamps just by living here, so pay whenever you like.');
   await UI.say('pooping',ja?'これはリーフパッド。スタンプ、図鑑、レシピ、マップが入っている。それと、ひっこし祝いにスツールをどうぞ！':'Here is your Leaf Pad, with stamps, a critter guide, recipes and a map. And a driftwood stool as a welcome gift!');
   this.grant();UI.itemGet('stool');
   await UI.say('pooping',ja?'さっそくだけど、木をゆすって木の枝を5本集めてくれる？それでどうぐがつくれるんだ。':'First things first: could you shake some trees and collect 5 tree branches? You can craft tools with them.');
   stat('talk');this.next();return true}
  if(s==='report'){
   await UI.say('pooping',ja?'一日目おつかれさま！魚、虫、お店、もようがえ…もう立派な島民だね。':'What a first day! Fishing, bugs, shopping, decorating… you are a real islander now.');
   await UI.say('pooping',ja?'お祝いに300スタンプ！明日からはベビー・ビーンのお友だちも引っこしてくるかもしれないよ。毎朝5時に島が新しくなるからね。':'Here are 300 Island Stamps to celebrate! New neighbors may move in over the next few days. The island refreshes every morning at 5.');
   this.finish();return true}
  return false},
 target(){const s=this.step();if(!s)return null;
  if(s==='talk'||s==='report'){const n=G.npcs.pooping;return n?[n.x,n.z,1.9]:null}
  if(s==='craft'||(s==='bug'&&!bagCount('fnet')&&!bagCount('net'))){return [G.bench.position.x,G.bench.position.z,1.2]}
  if(s==='sell'){const n=G.npcs.pooh;return n?[n.x,n.z,1.9]:null}
  if(s==='home'){const hm=G.homeM;return [hm.position.x,hm.position.z+hm.userData.door.z,1.4]}
  if(s==='shake'){let b=null,bd=1e9;for(const o of S.w.objs)if(o.t==='tree'&&!o.shook){const d=Math.hypot(o.x+.5-G.pp.x,o.z+.5-G.pp.z);if(d<bd){bd=d;b=o}}
   const dr=S.w.drops.find(d=>d.id==='branch');if(dr&&Math.hypot(dr.x-G.pp.x,dr.z-G.pp.z)<6)return [dr.x,dr.z,.9];return b?[b.x+.5,b.z+.5,2.6]:null}
  if(s==='bug'){let b=null,bd=1e9;for(const x of G.bugs){const d=Math.hypot(x.x-G.pp.x,x.z-G.pp.z);if(d<bd){bd=d;b=x}}return b?[b.x,b.z,b.y-(walkH(G.W,b.x,b.z)||0)+.8]:null}
  if(s==='fish'){const F=G.fishing;if(F)return null;let b=null,bd=1e9;for(const f of G.fish){const d=Math.hypot(f.x-G.pp.x,f.z-G.pp.z);if(d<bd){bd=d;b=f}}return b?[b.x,b.z,.8]:null}
  return null},
 update(dt){if(!S||G.interior){G.arrow&&(G.arrow.visible=false);return}const t=this.target();if(!t){G.arrow.visible=false;return}G.arrow.visible=true;G.arrow.position.x=t[0];G.arrow.position.z=t[1];G.arrowY=(walkH(G.W,t[0],t[1])??(G.fishing?0:-.2))+t[2];if(t[2]<1&&this.step()==='fish')G.arrowY=.6},
 text(){const s=this.step();if(!s)return null;const i=TUT.indexOf(s)+1;return {t:T('tut'+i,bagCount('branch')),h:T('tut'+i+'h'),n:i,of:TUT.length}},
 refresh(){UI.tutCard&&UI.tutCard()}
};
