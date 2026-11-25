'use strict';
// ---------- icons (small inline SVGs for things emoji can't show) ----------
const SVG={
 branch:'<svg viewBox="0 0 64 64"><path d="M10 54 L50 12" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/><path d="M30 33 L22 18 M38 25 L50 28" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><ellipse cx="20" cy="15" rx="7" ry="4" fill="#7cc35a" transform="rotate(-40 20 15)"/><ellipse cx="53" cy="29" rx="7" ry="4" fill="#7cc35a"/></svg>',
 net:'<svg viewBox="0 0 64 64"><path d="M8 58 L34 30" stroke="#b07a3f" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="22" r="15" fill="#fff" fill-opacity=".55" stroke="#e8b04a" stroke-width="5"/><path d="M30 14 L54 30 M34 9 L57 22 M28 24 L48 37" stroke="#cfd8dc" stroke-width="2"/></svg>',
 shovel:'<svg viewBox="0 0 64 64"><path d="M14 52 L40 26" stroke="#b07a3f" stroke-width="6" stroke-linecap="round"/><path d="M8 46 l10 10 M6 50 l8 8" stroke="#b07a3f" stroke-width="5" stroke-linecap="round"/><path d="M38 20 Q50 6 60 4 Q58 14 44 26 Z" fill="#9fb6c3" stroke="#5f7684" stroke-width="3" stroke-linejoin="round"/></svg>',
 can:'<svg viewBox="0 0 64 64"><path d="M14 26 h28 v24 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6z" fill="#7fc7e8" stroke="#3b88ad" stroke-width="3"/><path d="M42 34 L58 22" stroke="#3b88ad" stroke-width="5" stroke-linecap="round"/><path d="M20 26 q8 -14 16 0" fill="none" stroke="#3b88ad" stroke-width="4"/><circle cx="58" cy="21" r="4" fill="#3b88ad"/></svg>',
 coin:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#ffcb3d" stroke="#d1901a" stroke-width="5"/><path d="M32 18 C24 30 22 36 32 44 C42 36 40 30 32 18Z" fill="#e89b12"/></svg>',
 stamp:'<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="8" fill="#ffffff" stroke="#59b36b" stroke-width="5" stroke-dasharray="6 3"/><path d="M32 18 l4 10 h10 l-8 7 3 11 -9 -6 -9 6 3 -11 -8 -7 h10z" fill="#59b36b"/></svg>',
 fossil:'<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="24" ry="18" fill="#c9a66b" stroke="#8d6b3a" stroke-width="3"/><path d="M20 30 q12 -10 24 0 M22 40 q10 8 20 0" stroke="#7a5a2c" stroke-width="3" fill="none"/></svg>',
 recipe:'<svg viewBox="0 0 64 64"><rect x="12" y="8" width="40" height="48" rx="5" fill="#fff6dc" stroke="#d1a35a" stroke-width="3"/><path d="M20 22h24M20 31h24M20 40h16" stroke="#d1a35a" stroke-width="3"/><circle cx="46" cy="46" r="9" fill="#5fb0e8"/><path d="M42 46h8M46 42v8" stroke="#fff" stroke-width="3"/></svg>',
 kit:'<svg viewBox="0 0 64 64"><rect x="8" y="20" width="48" height="34" rx="5" fill="#c98f4f" stroke="#8a5a2b" stroke-width="3"/><path d="M8 32h48" stroke="#8a5a2b" stroke-width="3"/><rect x="26" y="12" width="12" height="10" rx="3" fill="#8a5a2b"/></svg>',
 rug:'<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="26" ry="18" fill="#e58aa6" stroke="#b55776" stroke-width="3"/><ellipse cx="32" cy="34" rx="15" ry="9" fill="#ffd1de"/></svg>',
 wall:'<svg viewBox="0 0 64 64"><rect x="8" y="6" width="48" height="52" rx="4" fill="currentColor" stroke="#0002" stroke-width="3"/><path d="M8 22h48M8 40h48" stroke="#fff6" stroke-width="3"/></svg>',
 floor:'<svg viewBox="0 0 64 64"><path d="M4 44 L32 30 L60 44 L32 58Z" fill="currentColor" stroke="#0002" stroke-width="3"/></svg>',
 top:'<svg viewBox="0 0 64 64"><path d="M20 10 l-14 10 6 10 6-4 v28 h28 v-28 l6 4 6-10 -14-10 q-6 6 -12 0z" fill="currentColor" stroke="#0003" stroke-width="3" stroke-linejoin="round"/></svg>',
 bottom:'<svg viewBox="0 0 64 64"><path d="M16 8 h32 l4 46 h-14 l-6 -30 -6 30 h-14z" fill="currentColor" stroke="#0003" stroke-width="3" stroke-linejoin="round"/></svg>',
 hat:'<svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="28" ry="9" fill="currentColor" stroke="#0003" stroke-width="3"/><path d="M16 42 q0 -26 16 -26 q16 0 16 26z" fill="currentColor" stroke="#0003" stroke-width="3"/></svg>',
 shoe:'<svg viewBox="0 0 64 64"><path d="M8 40 v-16 h16 q4 10 16 10 q16 0 18 8 v6 h-50z" fill="currentColor" stroke="#0003" stroke-width="3" stroke-linejoin="round"/></svg>',
 sapling:'<svg viewBox="0 0 64 64"><path d="M32 58 V30" stroke="#6d4a26" stroke-width="5"/><ellipse cx="22" cy="26" rx="12" ry="7" fill="#6ec04f" transform="rotate(-25 22 26)"/><ellipse cx="42" cy="22" rx="12" ry="7" fill="#58ad3f" transform="rotate(25 42 22)"/><ellipse cx="32" cy="58" rx="16" ry="4" fill="#a2774a"/></svg>',
 seed:'<svg viewBox="0 0 64 64"><path d="M14 14 h36 v40 h-36z" fill="#f5e6c4" stroke="#b28a4a" stroke-width="3"/><circle cx="32" cy="32" r="10" fill="currentColor"/><path d="M32 42 v8" stroke="#5aa83f" stroke-width="3"/></svg>',
 bait:'<svg viewBox="0 0 64 64"><path d="M14 22 h36 l-4 32 h-28z" fill="#d6c3a1" stroke="#8d6b3a" stroke-width="3"/><circle cx="26" cy="20" r="5" fill="#b98b5a"/><circle cx="38" cy="18" r="5" fill="#b98b5a"/></svg>',
};
const SEASON_FRUIT='peach';
// cat: mat fruit fish bug fossil tool furn wall floor top bottom hat shoe flower seed misc
const ITEMS={
 branch:{n:['Tree branch','木の枝'],svg:'branch',cat:'mat',p:5,st:30},
 wood:{n:['Wood','木材'],e:'🪵',cat:'mat',p:60,st:30},
 softwood:{n:['Softwood','やわらかい木材'],e:'🪵',tint:'#f1d39a',cat:'mat',p:60,st:30},
 hardwood:{n:['Hardwood','かたい木材'],e:'🪵',tint:'#7a4a2a',cat:'mat',p:60,st:30},
 stone:{n:['Stone','石'],e:'🪨',cat:'mat',p:75,st:30},
 clay:{n:['Clay','粘土'],e:'🟤',cat:'mat',p:100,st:30},
 iron:{n:['Iron nugget','鉄鉱石'],e:'🔩',cat:'mat',p:375,st:30},
 gold:{n:['Gold nugget','金鉱石'],e:'🌟',cat:'mat',p:10000,st:30},
 weeds:{n:['Clump of weeds','ざっ草'],e:'🌿',cat:'mat',p:10,st:99},
 shell:{n:['Sea shell','貝がら'],e:'🐚',cat:'mat',p:120,st:10},
 conch:{n:['Pink conch','ピンクのまき貝'],e:'🐚',tint:'#ff9fc0',cat:'mat',p:700,st:10},
 clam:{n:['Manila clam','アサリ'],e:'🦪',cat:'mat',p:100,st:10},
 coconut:{n:['Coconut','ヤシの実'],e:'🥥',cat:'fruit',p:250,st:10},
 peach:{n:['Peach','もも'],e:'🍑',cat:'fruit',p:100,st:10},
 apple:{n:['Apple','りんご'],e:'🍎',cat:'fruit',p:500,st:10},
 orange:{n:['Orange','オレンジ'],e:'🍊',cat:'fruit',p:500,st:10},
 cherry:{n:['Cherry','さくらんぼ'],e:'🍒',cat:'fruit',p:500,st:10},
 pear:{n:['Pear','なし'],e:'🍐',cat:'fruit',p:500,st:10},
 sapling:{n:['Sapling','なえ木'],svg:'sapling',cat:'seed',p:160,st:10,plant:'tree'},
 bait:{n:['Fish bait','まき餌'],svg:'bait',cat:'misc',p:200,st:10},
 fossil_u:{n:['Fossil','化石'],svg:'fossil',cat:'misc',p:100,st:1,unid:true},
 recipe:{n:['DIY recipe','DIYレシピ'],svg:'recipe',cat:'misc',p:200,st:1},
 // tools
 frod:{n:['Flimsy fishing rod','ボロのつりざお'],e:'🎣',cat:'tool',tool:'rod',dur:15,p:100},
 rod:{n:['Sturdy fishing rod','つりざお'],e:'🎣',cat:'tool',tool:'rod',dur:40,p:600,tint:'#ffcf5a'},
 fnet:{n:['Flimsy net','ボロのあみ'],svg:'net',cat:'tool',tool:'net',dur:15,p:100},
 net:{n:['Sturdy net','あみ'],svg:'net',cat:'tool',tool:'net',dur:40,p:600},
 fshovel:{n:['Flimsy shovel','ボロのスコップ'],svg:'shovel',cat:'tool',tool:'shovel',dur:30,p:200},
 shovel:{n:['Sturdy shovel','スコップ'],svg:'shovel',cat:'tool',tool:'shovel',dur:60,p:600},
 faxe:{n:['Flimsy axe','ボロのオノ'],e:'🪓',cat:'tool',tool:'axe',dur:40,p:200},
 axe:{n:['Sturdy axe','オノ'],e:'🪓',cat:'tool',tool:'axe',dur:100,p:600},
 fcan:{n:['Flimsy watering can','ボロのじょうろ'],svg:'can',cat:'tool',tool:'can',dur:20,p:100},
 can:{n:['Sturdy watering can','じょうろ'],svg:'can',cat:'tool',tool:'can',dur:60,p:600},
};
// furniture: model key, size [w,d], floor rug flag, emoji
const FURN=[
 ['stool','Driftwood stool','流木のスツール','🪑',160],['logbench','Log bench','丸太のベンチ','🪵',300],['table','Driftwood table','流木のテーブル','🟫',500],
 ['campfire','Campfire','たき火','🔥',150],['birdhouse','Birdhouse','巣箱','🏠',400],['fern','Potted fern','シダのはち植え','🪴',300],
 ['lamp','Shell lamp','貝がらランプ','💡',800],['bed','Cozy bed','ふかふかベッド','🛏️',1200],['shelf','Bookshelf','本だな','📚',900],
 ['armchair','Plush armchair','ふかふかソファ','🛋️',1100],['rug','Round rug','まるいラグ','',600],['clock','Grandfather clock','柱時計','🕰️',1500],
 ['radio','Retro radio','レトロラジオ','📻',700],['vase','Flower vase','花びん','💐',400],['kotatsu','Kotatsu','こたつ','♨️',1800],
 ['lantern','Paper lantern','ちょうちん','🏮',500],['beachchair','Beach chair','ビーチチェア','🏖️',700],['parasol','Beach parasol','ビーチパラソル','⛱️',600],
 ['xmastree','Holiday tree','ホリデーツリー','🎄',1500],['surfboard','Surfboard','サーフボード','🏄',900],['arcade','Arcade cabinet','アーケード筐体','🕹️',3000],
 ['teaset','Tea set','ティーセット','🫖',600],['honeypot','Big honey pot','大きなはちみつつぼ','🍯',800],['beanplush','Bean plush','ビーンのぬいぐるみ','🫛',1000],
 ['guitar','Ukulele','ウクレレ','🎸',900],['snowman','Snow buddy','ゆきだるま','⛄',500],['tank','Fish tank','水そう','🐠',0],['cage','Bug cage','虫かご','🦗',0],['fstand','Fossil stand','化石スタンド','🦴',0],
];
FURN.forEach(([id,en,ja,e,p])=>{ITEMS[id]={n:[en,ja],e,cat:'furn',p,st:1,model:id};if(id==='rug')ITEMS[id].svg='rug'});
const WALLS=[['w_cream','Cream wall','クリームのかべ','#f6ecd2','plain'],['w_sea','Sea-breeze wall','しおかぜのかべ','#bfe6f2','wave'],['w_honey','Honeycomb wall','ハチの巣のかべ','#f7cf63','hex'],
 ['w_star','Starry wall','星空のかべ','#2f3c74','star'],['w_log','Log cabin wall','ログハウスのかべ','#c08a52','log'],['w_sakura','Sakura wall','さくらのかべ','#ffd7e4','dot'],['w_mint','Mint stripe wall','ミントストライプのかべ','#c9efd9','stripe'],['w_shoji','Shoji wall','障子のかべ','#fbf6e6','grid']];
const FLOORS=[['f_plank','Plank floor','板のゆか','#c9935c','plank'],['f_tatami','Tatami floor','たたみ','#cdd48f','tatami'],['f_check','Checker floor','チェックのゆか','#e9e1d3','check'],
 ['f_grass','Lawn floor','しばふのゆか','#7ccc5d','plain'],['f_sand','Beach sand floor','砂浜のゆか','#f2dfae','dots'],['f_tile','Blue tile floor','青いタイルのゆか','#8cc6e2','check'],['f_berry','Berry carpet','ベリーカーペット','#d47a9a','plain']];
WALLS.forEach(([id,en,ja,c,pat])=>ITEMS[id]={n:[en,ja],svg:'wall',col:c,pat,cat:'wall',p:500,st:1});
FLOORS.forEach(([id,en,ja,c,pat])=>ITEMS[id]={n:[en,ja],svg:'floor',col:c,pat,cat:'floor',p:500,st:1});
// clothing: [id,en,ja,cat,c1,c2,pattern,price]
const CLOTHES=[
 ['t_white','White tee','白Tシャツ','top','#f7f7f2','#f7f7f2','solid',300],['t_stripe','Sailor stripe tee','ボーダーシャツ','top','#ffffff','#3d6fb6','stripe',500],
 ['t_honey','Honey hoodie','はちみつパーカー','top','#ffc23d','#e89b12','hood',800],['t_heart','Cream heart sweater','ハートのセーター','top','#f6ead0','#e86a86','heart',900],
 ['t_aloha','Aloha shirt','アロハシャツ','top','#2fb3a6','#ffd34d','flower',700],['t_jersey','Gold #9 jersey','ゴールドの9番ジャージ','top','#f2c230','#5b2a86','num9',1200],
 ['t_yukata','Blue yukata','青いゆかた','top','#3c5a9a','#f2f2ff','dots',1500],['t_rain','Yellow raincoat','黄色いレインコート','top','#ffe14d','#ffe14d','solid',900],
 ['t_pink','Pink knit','ピンクのニット','top','#ff9bbd','#ffd3e2','stripe',700],['t_green','Leaf tee','リーフTシャツ','top','#7ccd6a','#4f9e44','solid',300],
 ['b_jeans','Jeans','ジーンズ','bottom','#4a6fa5','#4a6fa5','solid',400],['b_shorts','Khaki shorts','カーキの短パン','bottom','#c8b083','#c8b083','solid',300],
 ['b_skirt','Pleated skirt','プリーツスカート','bottom','#e87979','#e87979','skirt',500],['b_grey','Grey shorts','グレーの短パン','bottom','#9aa0a8','#9aa0a8','solid',300],['b_overall','Denim overalls','デニムのオーバーオール','bottom','#5b7fb8','#5b7fb8','solid',800],
 ['h_straw','Straw hat','むぎわらぼうし','hat','#f0d488','#e05a4f','straw',600],['h_beanie','Cozy beanie','ニットぼう','hat','#e05a4f','#fff','beanie',500],['h_cap','Ball cap','キャップ','hat','#3d6fb6','#fff','cap',400],
 ['h_crown','Flower crown','花かんむり','hat','#ff9bbd','#ffe14d','crown',300],['h_bean','Bean hat','まめぼうし','hat','#8cc152','#5d8f2f','bean',700],
 ['s_sneak','Sneakers','スニーカー','shoe','#ffffff','#e05a4f','solid',400],['s_sandal','Sandals','サンダル','shoe','#c98f4f','#c98f4f','solid',300],['s_boots','Rain boots','長ぐつ','shoe','#e0c13a','#e0c13a','solid',500],
];
CLOTHES.forEach(([id,en,ja,cat,c1,c2,pat,p])=>ITEMS[id]={n:[en,ja],svg:cat,col:c1,c2,pat,cat,p,st:1});
// flowers: species x color
const FLOWER_SP={tulip:['Tulip','チューリップ','🌷'],rose:['Rose','バラ','🌹'],cosmos:['Cosmos','コスモス','🌼']};
const FCOL={red:['#e2333c','Red','赤'],yellow:['#ffd23a','Yellow','黄'],white:['#fbfbf6','White','白'],orange:['#ff8a2a','Orange','オレンジ'],pink:['#ff8fbc','Pink','ピンク'],purple:['#9b5bd6','Purple','紫'],black:['#3a2232','Black','黒'],blue:['#4f86e8','Blue','青']};
const FPRICE={red:40,yellow:40,white:40,orange:120,pink:120,purple:240,black:240,blue:800};
for(const sp in FLOWER_SP)for(const c in FCOL){
 ITEMS['fl_'+sp+'_'+c]={n:[FCOL[c][1]+' '+FLOWER_SP[sp][0].toLowerCase(),FCOL[c][2]+'い'+FLOWER_SP[sp][1]],e:FLOWER_SP[sp][2],dot:FCOL[c][0],cat:'flower',p:FPRICE[c],st:10,plant:'flower',sp,col:c};
 if(['red','yellow','white'].includes(c))ITEMS['sd_'+sp+'_'+c]={n:[FCOL[c][1]+' '+FLOWER_SP[sp][0].toLowerCase()+' seeds',FCOL[c][2]+'い'+FLOWER_SP[sp][1]+'のタネ'],svg:'seed',col:FCOL[c][0],cat:'seed',p:60,st:10,plant:'flower',sp,col2:c};
}
// fix awkward JA for colors without い (orange/pink/purple/blue/black etc.)
for(const sp in FLOWER_SP)for(const c in FCOL){const it=ITEMS['fl_'+sp+'_'+c];const ja={red:'赤い',yellow:'黄色い',white:'白い',orange:'オレンジの',pink:'ピンクの',purple:'紫の',black:'黒い',blue:'青い'}[c];it.n[1]=ja+FLOWER_SP[sp][1];const s=ITEMS['sd_'+sp+'_'+c];if(s)s.n[1]=ja+FLOWER_SP[sp][1]+'のタネ'}
// breeding: pair -> child (chance)
const BREED=[['red','yellow','orange',.5],['red','white','pink',.5],['white','white','purple',.25],['red','red','black',.2],['purple','purple','blue',.15],['orange','orange','purple',.2],['pink','yellow','orange',.3]];
// ---------- critters ----------
// hours: [from,to) 24h wrap; months 1..12 list (northern hemisphere)
const ALL=[1,2,3,4,5,6,7,8,9,10,11,12];
const FISH=[
 ['crucian','Crucian carp','フナ','river',2,160,[0,24],ALL],['dace','Dace','ウグイ','river',3,240,[16,9],ALL],['carp','Carp','コイ','pond',4,300,[0,24],ALL],
 ['koi','Koi','ニシキゴイ','pond',4,4000,[16,9],ALL],['goldfish','Goldfish','キンギョ','pond',1,1300,[0,24],ALL],['catfish','Catfish','ナマズ','pond',4,800,[16,9],[5,6,7,8,9,10]],
 ['trout','Rainbow trout','ニジマス','river',4,800,[16,9],[3,4,5,6,9,10,11]],['salmon','Salmon','サケ','river',4,700,[0,24],[9]],['sweetfish','Sweetfish','アユ','river',3,900,[0,24],[7,8,9]],
 ['char','Char','イワナ','river',3,3800,[16,9],[3,4,5,6,9,10,11]],['loach','Loach','ドジョウ','river',2,400,[0,24],[3,4,5]],
 ['seabass','Sea bass','スズキ','sea',5,400,[0,24],ALL],['mackerel','Horse mackerel','アジ','sea',2,150,[0,24],ALL],['dab','Dab','カレイ','sea',3,300,[0,24],[10,11,12,1,2,3,4]],
 ['flounder','Olive flounder','ヒラメ','sea',5,800,[0,24],ALL],['squid','Squid','イカ','sea',3,500,[0,24],[12,1,2,3,4,5,6,7,8]],['octopus','Octopus','タコ','sea',3,1200,[0,24],[9,10,11,12,1,2,3,4,5,6]],
 ['puffer','Pufferfish','フグ','sea',3,5000,[21,4],[11,12,1,2]],['snapper','Red snapper','タイ','sea',4,3000,[0,24],ALL],['tuna','Tuna','マグロ','sea',6,7000,[0,24],[11,12,1,2,3,4]],
 ['ray','Ray','エイ','sea',5,3000,[4,21],[8,9,10,11]],['anchovy','Anchovy','カタクチイワシ','sea',1,200,[4,21],ALL],
];
const FISH_E={squid:'🦑',octopus:'🐙',puffer:'🐡',koi:'🐠',goldfish:'🐠',snapper:'🐠',ray:'🐟',tuna:'🐟'};
const FISH_T={koi:'#ffffff',goldfish:'#ffb03a',snapper:'#ff6a6a',trout:'#c9a0ff',salmon:'#ff9f8a',char:'#9fd0ff',catfish:'#8a7a6a',carp:'#9a8a5a',dab:'#c2a77d',flounder:'#b39770',ray:'#7c8fa8',tuna:'#5a7ab8',seabass:'#8aa0b8',loach:'#b0956a'};
const BUGS=[
 ['cabbage','Cabbage white','モンシロチョウ','fly',160,[4,19],[9,10,11,12,1,2,3,4,5,6],'🦋','#ffffff'],['swallow','Swallowtail','アゲハチョウ','fly',240,[4,19],[3,4,5,6,7,8,9],'🦋','#ffe14d'],
 ['peacock','Peacock butterfly','クジャクチョウ','fly',2500,[4,19],[3,4,5,6],'🦋','#e2554f'],['moth','Moth','ガ','night',130,[19,4],ALL,'🦋','#c9b58f'],
 ['bee','Honeybee','ミツバチ','flower',200,[8,17],[3,4,5,6,7],'🐝',''],['ladybug','Ladybug','テントウムシ','flower',200,[8,17],[3,4,5,6,10],'🐞',''],
 ['ant','Ant','アリ','ground',80,[0,24],ALL,'🐜',''],['cricket','Bell cricket','スズムシ','ground',430,[17,8],[9,10],'🦗','#6b5a3a'],['grasshopper','Grasshopper','バッタ','ground',160,[8,17],[7,8,9],'🦗',''],
 ['stag','Stag beetle','クワガタ','tree',2000,[17,8],[7,8],'🪲','#5a3a2a'],['rhino','Rhino beetle','カブトムシ','tree',1350,[17,8],[7,8],'🪲','#7a4a2a'],['cicada','Cicada','セミ','tree',250,[8,17],[7,8],'🪲','#8aa060'],
 ['longhorn','Longhorn beetle','カミキリムシ','tree',260,[0,24],ALL,'🪲',''],['firefly','Firefly','ホタル','night',300,[19,4],[6],'🪲','#d8ff6a'],['snail','Snail','カタツムリ','rock',250,[0,24],ALL,'🐌',''],
 ['spider','Spider','クモ','tree',600,[19,8],ALL,'🕷️',''],['pillbug','Pill bug','ダンゴムシ','rock',250,[23,16],[9,10,11,12,1,2,3,4,5,6],'🐛','#7a7f8a'],['inchworm','Inchworm','シャクトリムシ','ground',300,[0,24],ALL,'🐛',''],
 ['mosquito','Mosquito','カ','night',130,[17,4],[6,7,8,9],'🦟',''],
];
const FOSSILS=[['amber','Amber','こはく','🟠'],['ammonite','Ammonite','アンモナイト','🐚'],['trilobite','Trilobite','三葉虫','🪲'],['sharktooth','Shark tooth','サメの歯','🦷'],['dinoegg','Dino egg','恐竜のたまご','🥚'],
 ['rexskull','Big-lizard skull','大トカゲの頭','🦖'],['raptor','Raptor claw','ラプトルのツメ','🦴'],['mammoth','Mammoth tusk','マンモスのキバ','🦣'],['fern','Fern fossil','シダの化石','🌿'],['longneck','Long-neck bone','首長竜のほね','🦕']];
FISH.forEach(f=>{ITEMS['fi_'+f[0]]={n:[f[1],f[2]],e:FISH_E[f[0]]||'🐟',tint:FISH_T[f[0]]||'',cat:'fish',p:f[5],st:1,crit:f[0]}});
BUGS.forEach(b=>{ITEMS['bu_'+b[0]]={n:[b[1],b[2]],e:b[7],tint:b[8],cat:'bug',p:b[4],st:1,crit:b[0]}});
FOSSILS.forEach(f=>{ITEMS['fo_'+f[0]]={n:[f[1],f[2]],e:f[3],cat:'fossil',p:[1000,1500,1300,1100,2500,5000,3000,4000,1200,4500][FOSSILS.indexOf(f)],st:1,crit:f[0]}});
function inHours(h,hr){const [a,b]=hr;if(a===0&&b===24)return true;return a<b?(h>=a&&h<b):(h>=a||h<b)}
function fmtHours(hr){const [a,b]=hr;if(a===0&&b===24)return T('allDay');const f=x=>LANG==='ja'?x+'時':(x%12||12)+(x<12?' AM':' PM');return f(a)+' – '+f(b)}
function fmtMonths(m){if(m.length===12)return T('allYear');return m.map(x=>LANG==='ja'?x+'月':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][x-1]).join(', ')}
// ---------- recipes ----------
// id: [out, qty, mats, pack]
const RECIPES={
 frod:['frod',1,{branch:5},'start'],fnet:['fnet',1,{branch:5},'start'],faxe:['faxe',1,{branch:5,stone:1},'start'],fshovel:['fshovel',1,{hardwood:5},'start'],fcan:['fcan',1,{softwood:5},'start'],
 campfire:['campfire',1,{branch:3},'start'],stool:['stool',1,{wood:4},'start'],
 rod:['rod',1,{frod:1,iron:1},'tools'],net:['net',1,{fnet:1,iron:1},'tools'],shovel:['shovel',1,{fshovel:1,iron:1},'tools'],axe:['axe',1,{faxe:1,iron:1},'tools'],can:['can',1,{fcan:1,iron:1},'tools'],
 bait:['bait',1,{clam:1},'bottle'],logbench:['logbench',1,{wood:6},'bottle'],table:['table',1,{wood:6,hardwood:2},'bottle'],birdhouse:['birdhouse',1,{softwood:6},'bottle'],
 fern:['fern',1,{clay:2,weeds:3},'bottle'],lantern:['lantern',1,{softwood:3,weeds:2},'bottle'],shelf:['shelf',1,{wood:8,softwood:4},'bottle'],
 vase:['vase',1,{clay:3,anyflower:2},'cozy'],kotatsu:['kotatsu',1,{hardwood:6,iron:2},'cozy'],teaset:['teaset',1,{clay:4},'cozy'],armchair:['armchair',1,{softwood:6,weeds:6},'cozy'],bed:['bed',1,{wood:8,softwood:6},'cozy'],
 beachchair:['beachchair',1,{softwood:6,shell:2},'sea'],parasol:['parasol',1,{softwood:4,shell:3},'sea'],surfboard:['surfboard',1,{wood:6,softwood:4},'sea'],lamp:['lamp',1,{shell:3,iron:1},'sea'],
 xmastree:['xmastree',1,{softwood:8,iron:1},'holiday'],snowman:['snowman',1,{weeds:5,stone:2},'holiday'],
 h_crown:['h_crown',1,{anyflower:6},'bottle'],radio:['radio',1,{iron:3,wood:2},'bottle'],
};
const BOTTLE_POOL=Object.keys(RECIPES).filter(k=>RECIPES[k][3]==='bottle');
const STAMP_SHOP=[
 {id:'pk_tools',n:['Sturdy tool recipes','じょうぶなどうぐのレシピ'],cost:800,pack:'tools',svg:'recipe'},
 {id:'pk_cozy',n:['Cozy home recipes','おうちくつろぎレシピ'],cost:900,pack:'cozy',svg:'recipe'},
 {id:'pk_sea',n:['Seaside recipes','うみべのレシピ'],cost:900,pack:'sea',svg:'recipe'},
 {id:'pk_holiday',n:['Holiday recipes','ホリデーレシピ'],cost:500,pack:'holiday',svg:'recipe'},
 {id:'bagup',n:['Bigger pockets (+10)','ポケット拡張（+10）'],cost:2000,svg:'kit'},
 {id:'sapling',n:['Sapling','なえ木'],cost:200,give:'sapling',svg:'sapling'},
 {id:'bait',n:['Fish bait ×3','まき餌×3'],cost:300,give:'bait',qty:3,svg:'bait'},
 {id:'t_jersey',n:['Gold #9 jersey','ゴールドの9番ジャージ'],cost:800,give:'t_jersey',svg:'top'},
 {id:'arcade',n:['Arcade cabinet','アーケード筐体'],cost:2500,give:'arcade',e:'🕹️'},
];
// ---------- house tiers ----------
const HOUSE=[
 {n:['Tent','テント'],room:4,debt:1500,cur:'stamps'},
 {n:['Cottage','コテージ'],room:6,debt:19800,cur:'coins'},
 {n:['Big house','大きな家'],room:8,debt:49800,cur:'coins'},
 {n:['Grand house','すてきな家'],room:9,debt:0,cur:'coins'},
];
// ---------- villagers ----------
// kind: svc (service NPC) / res (resident). h = sprite height in world units
const VILL={
 pooping:{n:['Mr Pooping','ミスター・プーピング'],art:['pooping_0','pooping_1'],h:1.35,col:'#9a6234',voice:.85,svc:true},
 pooh:{n:['Pooh','プー'],art:['pooh_0','pooh_1'],h:1.35,col:'#e8a33a',voice:1.0,svc:true},
 kermit:{n:['Kermit','カーミット'],art:['kermit_0','kermit_1'],h:1.35,col:'#3e9b45',voice:1.25,svc:true},
 bean:{n:['Mr Bean','ミスター・ビーン'],art:['bean_0','bean_1'],h:1.3,col:'#7fb13a',voice:1.1,likes:['fruit','flower'],arrive:0},
 bbean:{n:['Baby Bean','ベビー・ビーン'],art:['bbean_0','bbean_1'],h:.95,col:'#9ccc5a',voice:1.6,likes:['bug','fruit'],arrive:0},
 pinco:{n:['Pinco','ピンコ'],art:['pinco_0','pinco_1'],h:1.4,col:'#ff79a8',voice:1.35,likes:['flower','top','hat'],arrive:0},
 mogu:{n:['Mogu Mogu','モグモグ'],art:['mogu_0','mogu_1'],h:1.0,col:'#a8794f',voice:.95,likes:['fossil','mat'],arrive:1,mound:true},
 bronny:{n:['Bronny','ブロニー'],art:['bronny_0','bronny_1'],h:1.4,col:'#d9a520',voice:1.0,likes:['fish','fruit'],arrive:2},
 asmon:{n:['Asmon','アズモン'],art:['asmon_0','asmon_1'],h:1.55,col:'#5a3f86',voice:.75,likes:['furn','fish'],arrive:3,grumpy:true},
 kaise:{n:['Kaise','カイセ'],art:['kaise_0','kaise_1'],h:1.5,col:'#c77d4a',voice:1.2,svc:true,visitor:true},
};
const RESIDENTS=['bean','bbean','pinco','mogu','bronny','asmon'];
const LINES={
 bean:[['Hey! Have you tried the peaches here? I could eat them all day. Not literally. I have one tooth.','やあ！ここのもも食べた？ずっと食べていられるよ。歯は一本だけどね。'],
  ['Baby Bean found a shiny shell this morning. He thinks it is a phone.','ベビー・ビーンが今朝キラキラの貝を見つけたんだ。電話だと思ってるみたい。'],
  ['No arms, no problem. I carry everything in my pod pockets.','うではないけど平気。さやのポケットに全部入るんだ。'],
  ['Did you know beans grow faster when you talk to them? Keep talking!','豆は話しかけると早く育つって知ってた？もっと話して！']],
 bbean:[['Bean! Bean bean!','ビーン！ビーンビーン！'],['*giggles* Bubble! Fishy!','*くすくす* あわ！おさかな！'],['Daddy says bugs are friends. Friend!','パパがね、虫はおともだちだって。おともだち！'],['Nap time… after one more butterfly.','おひるね…あともう一匹ちょうちょ見てから。']],
 pinco:[['Darling, this island needs more flowers. Pink ones, obviously.','ねえ、この島にはもっとお花が必要よ。もちろんピンクのね。'],
  ['I matched my sweater AND my shorts to the clouds today. Grey is very in.','今日はセーターも短パンも雲の色に合わせたの。グレーが流行りなのよ。'],
  ['If you find a cute outfit, show me first, okay?','かわいい服を見つけたら、まず私に見せてね？'],
  ['I tried fishing once. The fish was prettier than me. Never again.','一度つりをしたの。魚の方がかわいかったわ。もうしない。']],
 mogu:[['*peeks out of the mound* Oh! Hello. The soil is lovely and warm today.','*土山から顔を出して* あっ、こんにちは。今日は土があったかくて気持ちいいよ。'],
  ['I stay in my mound. It is cozy. Everything I need comes to me.','ぼくは土山の中にいるよ。落ち着くんだ。必要なものは向こうから来るし。'],
  ['If you dig up a fossil, bring it here! I love old bones. Not in a scary way.','化石をほったら見せて！古いほねが大好き。こわい意味じゃないよ。'],
  ['I can hear the worms gossiping. They say you are nice.','ミミズたちのうわさ話が聞こえるよ。きみはいい人だって。']],
 bronny:[['SNAP! Ha, I say that when I am happy. I am always happy here.','スナップ！うれしい時に言うんだ。ここではいつもうれしいよ。'],
  ['I practice free throws with coconuts. The palm trees are my hoops.','ヤシの実でフリースローの練習さ。ヤシの木がゴールなんだ。'],
  ['Number 9 jersey, washed and fluffy. A plush has to look sharp.','9番のジャージ、洗ってふわふわ。ぬいぐるみは見た目が大事。'],
  ['Wanna race to the beach? Okay, you win. I am stuffed with cotton.','浜までかけっこする？いいよ、きみの勝ち。ぼく中身わただし。']],
 asmon:[['Hmph. Another islander. Do not trample my lawn.','ふん。また島民か。うちの芝生をふむなよ。'],
  ['I moved here for peace and quiet. Then everyone kept saying hello.','静かにくらしたくて来たのに、みんなあいさつしてくる。'],
  ['What? Fine. The sunset is… acceptable.','なんだ。まあ…夕日は…悪くない。'],
  ['Do not tell anyone I fed the seagulls.','カモメにエサをやったこと、だれにも言うなよ。']],
 asmonF:[['You again! Good. I saved you the best spot on the bench.','またきたか！よし。ベンチの特等席、とっておいたぞ。'],
  ['I used to be a grump. Now I am a grump with friends. Big difference.','昔はむっつり屋だった。今はなかまのいるむっつり屋だ。大ちがいだぞ。'],
  ['I planted flowers by my door. Do not make a big deal of it.','玄関に花を植えた。おおげさにするなよ。'],
  ['Thanks for not giving up on me, neighbor.','あきらめないでくれてありがとうな、おとなりさん。']],
 kaise:[['Hi! I sail from island to island with cozy clothes. Want a look?','こんにちは！島から島へ、ほっこりした服を売って回ってるの。見てく？'],
  ['This heart sweater is my favorite. Warm hugs you can wear!','このハートのセーターがお気に入り。着られるハグだよ！']],
 pooping:[['How is island life treating you? Splendid, I hope!','島ぐらしはどうかな？きっと最高だろう！'],['Remember, every task you finish earns Island Stamps.','やることをこなすとアイランドスタンプがたまるよ。'],['A tidy island is a happy island. Weeds make wonderful crafting material too.','きれいな島はしあわせな島。ざっ草はクラフトの材料にもなるぞ。']],
 pooh:[['Welcome, welcome! Everything is a little sticky but very nice.','いらっしゃい！どれもちょっとベタベタだけど、いい品だよ。'],['I sell honey… well, I eat the honey. I sell everything else.','はちみつ売ってる…というか食べちゃう。ほかのものを売ってるよ。']],
 kermit:[['Ah, a fellow nature lover! Bring me anything that swims, crawls or fossilized.','おお、自然好きのなかま！泳ぐもの、はうもの、化石を持ってきて。'],['Every critter here deserves a nice home in the museum.','この島のいきものはみんな博物館にすてきな家をもらう価値がある。']],
};
const GIFT_REPLY={love:['Oh wow! I love it! Thank you so much!','わあ！大好き！本当にありがとう！'],like:['Thank you! That is really sweet of you.','ありがとう！やさしいね。'],ok:['Oh, for me? Thanks!','えっ、くれるの？ありがとう！']};
const FAVOR_ASK={item:['Could you bring me {0}? I have been craving one all day!','{0}を持ってきてくれない？今日ずっとほしかったの！'],fish:['Could you catch me any fish? I want to look at one up close.','なにか魚をつってきてくれない？近くで見てみたいの。'],bug:['Could you catch any bug for me? Gently, please!','なにか虫をつかまえてきてくれる？やさしくね！']};
const FAVOR_THX=['You remembered! Here, take this as thanks.','おぼえててくれたんだ！お礼にこれどうぞ。'];
// tasks: one-time goals
const GOALS=[
 ['g_settle','Settle in','島にようこそ','talk',1,300],['g_fish1','First catch','はじめての魚','fish',1,300],['g_fish10','Angler','つり名人','fish',10,500],['g_fish30','Fishing legend','つりの達人','fish',30,1000],
 ['g_bug1','First bug','はじめての虫','bug',1,300],['g_bug10','Bug buddy','虫のなかま','bug',10,500],['g_craft1','First DIY','はじめてのDIY','craft',1,300],['g_craft10','Handy islander','器用な島民','craft',10,600],
 ['g_donate1','Museum friend','博物館のなかま','donate',1,300],['g_donate10','Curator\'s pal','学芸員のなかよし','donate',10,800],['g_fossil3','Fossil finder','化石ハンター','fossil',3,400],
 ['g_plant5','Green thumb','みどりのゆび','plant',5,400],['g_breed1','New color!','新しい色！','breed',1,800],['g_sell5k','Island trader','島の商人','earn',5000,500],
 ['g_friend3','Good neighbor','いいおとなり','friend1',3,600],['g_outdoor','Island designer','島のデザイナー','outdoor',1,300],['g_deco5','Interior designer','インテリアデザイナー','deco',5,400],
 ['g_dress','Fashion check','おしゃれチェック','dress',1,200],['g_tent','Tent paid off','テント完済','house',1,500],['g_house2','Bigger home','家が大きくなった','house',2,1000],
];
const DAILY_POOL=[['d_fish','Catch {0} fish','魚を{0}匹つる','fish',3,150],['d_bug','Catch {0} bugs','虫を{0}匹つかまえる','bug',2,150],['d_shake','Shake {0} trees','木を{0}本ゆする','shake',3,100],
 ['d_weed','Pull {0} weeds','ざっ草を{0}本ぬく','weed',5,100],['d_sell','Sell {0} items','{0}個売る','sellN',5,150],['d_talk','Talk to {0} islanders','{0}人と話す','talkN',3,100],['d_craft','Craft {0} things','{0}個つくる','craft',2,200],
 ['d_water','Water {0} flowers','花に{0}回水やり','water',3,150],['d_rock','Hit rocks {0} times','岩を{0}回たたく','rock',3,100],['d_dig','Dig up {0} things','{0}回ほりおこす','dig',2,150],['d_gift','Give {0} gift','プレゼントを{0}回','gift',1,150]];
