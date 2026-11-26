'use strict';
// Filmed-look clips (GenerateVideo, muted) + secret bloopers for the cheat
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'v01',cat:'food',by:'pooh',song:'food',seed:501,bpm:120,vid:'v_pooh_pancake',vdur:8.04,likes:402000,cm:12800,
 cap:['Chef Pooh pancake flip 🥞 first try (it was not the first try) #pancakes #chef','シェフ・プーのパンケーキ返し🥞 一発成功（うそ）'],
 snd:['Flip Flop Breakfast','フリップフロップ朝ごはん'],
 com:[['pinco','the hat is giving michelin','帽子がミシュラン級'],['bean','save me one 🥺','ひとつ残しておいて🥺']],
 shots:[{d:16,bg:'video',tx:[[0,5,'pancake flip 🥞','パンケーキ返し 🥞','big',.15],[5,16,'first try ✨ (it was not the first try)','一発成功✨（うそ）','pill',.15]],fx:[['sparkle',10,16,{x:.5,y:.4,r:.25}]],sx:[[1,'whoosh'],[2.5,'sizzle'],[10,'ding']]}]},
{id:'v02',cat:'food',by:'pinco',song:'food',seed:502,bpm:120,vid:'v_pinco_sushi',vdur:8.04,likes:356000,cm:9900,
 cap:['Sushi night at the boardwalk 🍣 the salmon one hits different #sushi #mukbang','ボードウォークで寿司ナイト🍣 サーモンが別格'],
 snd:['Neon Nigiri','ネオン握り'],
 com:[['pooh','you did not save me one','ぼくの分なかった'],['asmon','…that does look good','…確かにうまそう']],
 shots:[{d:16,bg:'video',tx:[[0,6,'sushi night 🍣','寿司ナイト 🍣','big',.15],[8,16,'the salmon one hits different','サーモンが別格','pill',.15]],fx:[['hearts',11,16,{x:.6,y:.45,n:8}]],sx:[[1,'pop'],[8,'chomp'],[11,'aww']]}]},
{id:'v03',cat:'makeup',by:'pinco',song:'makeup',seed:503,bpm:120,vid:'v_pinco_glam',vdur:8.04,likes:298000,cm:8400,
 cap:['Just a little glam before brunch 💄 the gasp at the end is real #glam #grwm','ブランチ前にちょっとだけグラム💄 最後の驚きは本物'],
 snd:['Mirror Mirror Pop','ミラーミラー・ポップ'],
 com:[['party','THE GASP 😭','あの驚き顔😭'],['bronny',"that's a 10",'10点だな']],
 shots:[{d:16,bg:'video',tx:[[0,6,'a little glam before brunch 💄','ブランチ前にちょっとグラム 💄','pill',.15],[11,16,'omg is that me?!','えっ、これ私！？','big',.24,{c:'#ff8fc4'}]],fx:[['sparkle',11,16,{x:.55,y:.35,r:.2}]],sx:[[1,'swish'],[11,'sparkle']]}]},
{id:'v04',cat:'makeup',by:'asmon',song:'villain',seed:504,bpm:120,likes:241000,cm:10300,
 cap:['Villain lair contour, real-time 😈 the laugh is part of the routine #contour #villainera','悪のアジトでシェーディング😈 笑うまでがルーティン'],
 snd:['Lair Lights','アジトのライト'],
 com:[['pinco','why do you have ring lights in a lair','なんでアジトにリングライトが'],['pooh','he is nice now right?','もう優しいんだよね？']],
 shots:[{d:4,bg:'lair',a:[['asmon_makeup_0',.5,.88,.5,'idle',{in:'pop'}]],tx:[[0,4,'villain contour, real-time 😈','悪役シェーディング、リアルタイム 😈','pill',.15]],sx:[[0,'evil']]},
  {d:4,bg:'lair',tr:'cut',a:[['asmon_makeup_1',.5,.88,.5,'bob']],tx:[[0,4,'step 1: the palette of doom','ステップ1：破滅のパレット','sub',.24]],fx:[['sparkle',0,4,{x:.5,y:.55}]]},
  {d:4,bg:'lair',tr:'zoom',a:[['asmon_makeup_2',.5,.88,.52,'talk']],tx:[[0,4,'cheekbones: sharpened','頬骨：シャープに','sub',.24]]},
  {d:4,bg:'lair',tr:'flash',a:[['c_asmon_1',.5,.88,.5,'hop']],tx:[[0,4,'the laugh is part of the routine','笑うまでがルーティン','sub',.24]],fx:[['flash',0,.8,{c:'#b9a6ff',a:.4}]],sx:[[0,'thunder']]}]},
{id:'v05',cat:'parent',by:'pooh',song:'parent',seed:505,bpm:120,vid:'v_pooh_babysit',vdur:8.04,likes:333000,cm:11200,
 cap:['Babysitting baby Bean 🍼 step 1: quality-test the milk. all of it. #babysitting #parenting','ベビー・ビーンのシッター🍼 ステップ1：ミルクの味見。ぜんぶ。'],
 snd:['Nursery Shuffle','ナーサリー・シャッフル'],
 com:[['pooping','that was the whole bottle','それ一本まるごとだよ'],['bean','my milk 😭','ぼくのミルク😭']],
 shots:[{d:16,bg:'video',a:[['babies_1',.7,.82,.16,'bob',{in:'pop'}]],tx:[[0,6,'babysitting baby Bean 🍼','ベビー・ビーンのシッター 🍼','pill',.15],[5,11,'step 1: quality-test the milk','ステップ1：ミルクの味見','sub',.24],[11,16,'…all of it','…ぜんぶ','big',.24],[11.5,16,'my milk?!','ぼくのミルク！？','bub',.6,{who:'bean',x:.66,tx:.7,ty:.64}]],fx:[['tears',12,16,{x:.7,y:.72}]],sx:[[1,'giggle'],[6,'gulp'],[11,'cry']]}]},
{id:'v06',cat:'comedy',by:'bean',song:'comedy',seed:506,bpm:120,vid:'v_bean_standup',vdur:8.04,likes:277000,cm:9400,
 cap:['Open mic night 🎤 my one tooth joke killed #standup #comedy','オープンマイク🎤 歯が1本ネタがウケた'],
 snd:['Brick Wall Blues','レンガの壁ブルース'],
 com:[['pinco','you have no arms how did you hold the mic','腕ないのにどうやってマイク持ったの'],['prof','The laughter was statistically significant','笑いは統計的に有意']],
 shots:[{d:16,bg:'video',tx:[[0,6,'open mic night 🎤','オープンマイク 🎤','big',.15],[4,12,"why don't peas fight?",'なんでマメはケンカしない？','bub',.32,{who:'bean',x:.5}],[9,16,'they always split the difference 🫛','いつも半分こするから 🫛','pill',.15]],fx:[['emoji',12,16,{e:'😂',n:8}]],sx:[[12,'rimshot'],[13,'laugh']]}]},
// --- secret (AMSABABY) ---
{id:'s01',cat:'secret',by:'pooh',song:'sweet',seed:601,bpm:120,likes:1000000000,cm:999999,
 cap:['1 BILLION LIKES 💰 thank you gold members #secret','10億いいね💰 ゴールド会員ありがとう'],
 snd:['Billionaire Bear','億万長者クマ'],
 com:[['asmon','how','どうやって'],['pinco','he bought them','買ったんだと思う']],
 shots:[
 {d:4,bg:'promenade',a:[['c_pooh_0',.5,.86,.5,'bob']],tx:[[0,4,'secret blooper 🤫','ひみつのNG 🤫','pill',.17]],sx:[[0,'pop']]},
 {d:12,bg:'#ffe08a/#ffb347',tr:'zoom',a:[['c_pooh_5',.5,.86,.54,'dance']],fx:[['money',0,12,{n:40}],['coins',0,12,{x:.5,y:.4,n:16}],['rays',0,12,{x:.5,y:.55}]],tx:[[0,12,'1,000,000,000 likes 💰','10億いいね 💰','big',.17,{c:'#fff'}],[3,12,'thank you gold members','ゴールド会員ありがとう','sub',.28]],sx:[[0,'drop'],[1,'cash'],[3,'cheer']],pz:[0,2,4,6,8,10]}
]},
{id:'s02',cat:'secret',by:'asmon',song:'villain',seed:602,bpm:126,likes:66600,cm:666,
 cap:['Bloopers: villain laugh take 47 😈 #bloopers','NG集：悪役笑い テイク47😈'],
 snd:['Take 47','テイク47'],
 com:[['pinco','take 46 was better','46の方が良かった'],['bean','*hic*','*ひっく*']],
 shots:[
 {d:4,bg:'lair',a:[['asmon_makeup_1',.5,.94,.6,'shake']],fx:[['rec',0,4]],tx:[[0,4,'villain laugh, take 47','悪役笑い テイク47','pill',.17],[1,4,'MWAHA—','ムハハ—','big',.6,{c:'#b9a6ff'}]],sx:[[1,'evil']]},
 {d:4,bg:'lair',tr:'glitch',a:[['c_asmon_3',.5,.92,.6,'tremble']],tx:[[0,4,'*hic*','*ひっく*','big',.5]],sx:[[0,'squeak'],[1,'squeak']]},
 {d:6,bg:'lair',tr:'cut',a:[['c_asmon_0',.35,.92,.56,'idle'],['c_pinco_1',.72,.88,.48,'bob']],fx:[['emoji',0,6,{e:'😂',n:10}]],tx:[[0,6,'everyone lost it 😂','全員爆笑 😂','big',.17]],sx:[[0,'laugh'],[2,'giggle']]}
]}
);
