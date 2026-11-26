import {SP,ITEMS,XP_LV,calcCP,calcHP} from './data.js?v=1.0.2';
const KEY='honeytrails_v1';
export const S={};
export function defaults(){return {v:1,lang:(navigator.language||'').startsWith('ja')?'ja':'en',started:false,mode:'',avatar:'pinco',music:true,sfx:true,arDef:false,
 xp:0,lv:1,glitter:0,treats:{},items:{jar:30,gjar:0,rjar:0,drop:0,bun:0},pals:[],dex:{},eggs:[],inc:null,dist:0,
 gone:{},spun:{},arenaWins:{},raidsDone:{},daily:{day:'',streak:0,catch:'',spin:''},cheat:false,nid:1,lastPos:null,boostUntil:0,sort:'cp'}}
export function load(){let d=null;try{d=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 Object.assign(S,defaults(),d||{});S.items=Object.assign(defaults().items,S.items||{});prune();return !!d}
export function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
export function wipe(){try{localStorage.removeItem(KEY)}catch(e){}Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,defaults())}
function prune(){const now=Date.now();for(const k in S.gone)if(S.gone[k]<now-3600000)delete S.gone[k];for(const k in S.spun)if(S.spun[k]<now-600000)delete S.spun[k]}
export function lvFromXp(x){let l=1;while(l<40&&x>=XP_LV[l+1])l++;return l}
export function newPal(sp,lv,iv,shiny,extra={}){const p=Object.assign({uid:S.nid++,sp,lv:Math.max(1,Math.min(40,lv)),iv,shiny:!!shiny,t:Date.now(),fav:false},extra);
 p.cp=calcCP(sp,p.lv,iv);p.hp=calcHP(sp,p.lv,iv);return p}
export function refresh(p){p.cp=calcCP(p.sp,p.lv,p.iv);p.hp=calcHP(p.sp,p.lv,p.iv)}
export function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
export function bagCount(){return Object.entries(S.items).reduce((a,[k,v])=>a+v,0)}
export const BAG_MAX=350;
