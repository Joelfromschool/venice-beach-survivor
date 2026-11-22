'use strict';
// FOOD clips. All times are in beats (converted with the clip's bpm).
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'f01',cat:'food',by:'pooh',song:'food',seed:11,bpm:96,likes:48200,cm:1284,
 cap:['Breakfast is served 💰🥞 Recipe in the comments (it is just coins) #moneypancakes #poohcooks','朝ごはんできたよ💰🥞 レシピはコメントで（ほぼ金貨）#マネーパンケーキ #プーのキッチン'],
 snd:["Pooh's Pancake Bounce",'プーのパンケーキ・バウンス'],
 com:[['bean','I still have so many questions','まだ聞きたいことが山ほどある'],['asmon','Those coins were MINE','その金貨、俺のなんだけど']],
 shots:[
 {d:4,bg:'kitchen',cam:[1.04,1.12,.5,.5,.55,.55],a:[['pooh_food_0',.5,.86,.5,'bob',{in:'pop'}]],fx:[['sparkle',0,4,{x:.3,y:.45,r:.15,n:6}]],
  tx:[[0,4,'POV: Pooh makes his famous','POV：プーの名物','pill',.17],[.5,4,'MONEY PANCAKES 💰🥞','マネーパンケーキ 💰🥞','yel',.235]],sx:[[0,'pop'],[.3,'sizzle',2.2],[.5,'pop']]},
 {d:4,bg:'kitchen',blur:1,tr:'whip',cam:[1.05,1.2,.5,.5,.55,.5],a:[['p_pancakes',.5,.74,.3,'pulse',{in:'drop',sh:1}]],fx:[['money',1.6,4,{n:22}],['steam',0,4,{x:.5,y:.45}]],
  tx:[[0,4,'Step 1: butter','ステップ1：バター','pill',.18],[1,4,'Step 2: MORE butter','ステップ2：もっとバター','pill',.245],[2,4,'Step 3: gold coins','ステップ3：金貨','pink',.31]],sx:[[0,'thud'],[1,'pop'],[2,'cash']],pz:[0,2]},
 {d:4,bg:'kitchen',tr:'flash',cam:[1.12,1.04,.5,.5,.5,.55],a:[['pooh_food_1',.5,.86,.5,'hop']],fx:[['rays',0,4,{x:.5,y:.6,c:'#fff3b0'}],['sparkle',0,4,{x:.5,y:.6,r:.2}]],
  tx:[[0,4,'Not edible.','食べられません。','big',.16],[1.5,4,'Still delicious.','でも、おいしい。','big',.25]],sx:[[0,'ding'],[1.5,'boing']],pz:[0,1.5]},
 {d:6,bg:'kitchen',tr:'whip',cam:[1,1.08,.5,.55,.55,.55],a:[['c_bean_3',.27,.86,.36,'shake',{in:'l'}],['c_pooh_5',.7,.86,.46,'bob',{sw:[[3.5,'pooh_food_2']]}]],
  fx:[['sparkle',4.5,6,{x:.7,y:.55,r:.15}]],
  tx:[[0,3,"Wait. You can't eat coins—",'まって、金貨は食べられな…','bub',.36,{x:.34,tx:.27,ty:.52,who:'bean'}],[2.5,6,'Watch me 😌','見てて 😌','bub',.33,{x:.68,tx:.7,ty:.45,who:'pooh'}],[4.6,6,'*crunch*','*ガリッ*','big',.62,{c:'#ffd84a'}]],
  sx:[[4.4,'chomp'],[5,'cash']]}
]},
{id:'f02',cat:'food',by:'bean',song:'food',seed:23,bpm:92,likes:91300,cm:3022,
 cap:['Rating snacks with zero hands. Who wants round 2? 🫛 #snackreview #noarms','手を使わずにお菓子をレビュー。第2弾見たい人？🫛 #お菓子レビュー'],
 snd:['Snack Court (original)','おやつ裁判（オリジナル）'],
 com:[['pooh','11/10 cupcake rating is correct','カップケーキ11/10は正しい'],['bronny','How do you hold the taco though','でもタコスどうやって持ってるの']],
 shots:[
 {d:4,bg:'#ffe08a/#ff9fc2',a:[['c_bean_1',.5,.84,.48,'bob',{in:'pop'}]],fx:[['sparkle',0,4,{x:.5,y:.5,r:.3}]],
  tx:[[0,4,'MR BEAN RATES SNACKS','ミスター・ビーンのおやつ採点','big',.16],[1,4,'(no hands edition)','（ノーハンド版）','pillk',.25]],sx:[[0,'pop'],[1,'boing']]},
 {d:4,bg:'kitchen',blur:1,tr:'whip',a:[['p_donut',.33,.66,.17,'float',{in:'pop',sh:0}],['bean_food_2',.66,.86,.45,'hop',{in:'r'}]],fx:[['hearts',.5,4,{x:.66,y:.45,n:10}]],
  tx:[[0,4,'Donut','ドーナツ','pill',.2],[1.4,4,'10/10','10/10','stamp',.38,{x:.3}]],sx:[[0,'chomp'],[1.4,'ding']]},
 {d:4,bg:'kitchen',blur:1,tr:'whip',a:[['p_toast',.33,.66,.15,'tremble',{in:'pop',sh:0}],['c_bean_3',.66,.86,.45,'shake']],fx:[['smoke',0,4,{x:.33,y:.58}]],
  tx:[[0,4,'Toast (Pooh made it)','トースト（作：プー）','pill',.2],[1.4,4,'1/10','1/10','stamp',.38,{x:.3}]],sx:[[0,'chomp'],[1.4,'buzz']]},
 {d:4,bg:'kitchen',blur:1,tr:'whip',a:[['p_taco',.33,.67,.15,'float',{in:'pop',sh:0}],['bean_food_1',.66,.86,.45,'shake']],fx:[['steam',.5,4,{x:.66,y:.42}],['tears',.5,4,{x:.66,y:.6}]],
  tx:[[0,4,'Taco (spicy???)','タコス（辛い？？？）','pill',.2],[1.4,4,'3/10 🔥','3/10 🔥','stamp',.38,{x:.3}]],sx:[[0,'chomp'],[1.2,'slip'],[1.4,'buzz']]},
 {d:5,bg:'kitchen',blur:1,tr:'zoom',a:[['p_cupcake',.33,.67,.17,'pulse',{in:'drop',sh:0}],['c_bean_5',.66,.86,.45,'dance']],fx:[['confetti',1.4,5,{n:40}],['sparkle',0,5,{x:.66,y:.5}]],
  tx:[[0,5,'Strawberry cupcake','いちごカップケーキ','pill',.2],[1.4,5,'11/10 ✨','11/10 ✨','stamp',.38,{x:.3,c:'#ff2d8a'}],[2.6,5,'no notes','文句なし','sub',.64]],sx:[[0,'chomp'],[1.4,'chime'],[1.5,'cheer']],pz:[1.4]}
]},
{id:'f03',cat:'food',by:'pinco',song:'sweet',seed:31,bpm:100,likes:35700,cm:842,
 cap:['Late-night sushi in Shibuya 🍣🌃 plated with love (and paws) #tokyo #sushi','渋谷で夜ふかし寿司🍣🌃 愛（と肉球）をこめて #東京 #寿司'],
 snd:['Neon Nigiri','ネオン握り'],
 com:[['pooh','do they take gold coins','金貨で払える？'],['mogu','I would dig through the earth for this','これのためなら地球の裏まで掘る']],
 shots:[
 {d:4,bg:'sushi',cam:[1.15,1.05,.5,.5,.4,.5],fx:[['bgtint',0,4,{c:'#1b0f2e',a:.15}]],tx:[[0,4,'Shibuya, 9 PM 🌃','渋谷、夜9時 🌃','big',.2],[1.2,4,'sushi date with myself','ひとり寿司デート','pill',.29]],sx:[[0,'chime']]},
 {d:4,bg:'sushi',tr:'slide',a:[['pinco_food_0',.5,.9,.52,'bob',{in:'b'}]],fx:[['sparkle',1,4,{x:.4,y:.5,r:.12}]],tx:[[0,4,'Chef Pinco is IN','シェフ・ピンコ、出勤','pink',.17]],sx:[[0,'pop']]},
 {d:4,bg:'sushi',blur:1,tr:'whip',cam:[1.05,1.15,.5,.5,.55,.55],a:[['p_sushi',.5,.6,.13,'float',{in:'pop',sh:0}],['p_onigiri',.3,.78,.14,'float',{in:'pop',t:[1,4],sh:0}],['p_ramen',.72,.8,.15,'float',{in:'pop',t:[2,4],sh:0}]],
  fx:[['steam',2,4,{x:.72,y:.7}],['sparkle',0,4,{x:.5,y:.55,r:.3}]],tx:[[0,4,'nigiri','にぎり','tag',.48,{x:.5}],[1,4,'onigiri','おにぎり','tag',.65,{x:.3}],[2,4,'ramen (bonus)','ラーメン（おまけ）','tag',.68,{x:.72}]],sx:[[0,'pop'],[1,'pop'],[2,'pop']]},
 {d:5,bg:'sushi',tr:'flash',cam:[1.08,1.18,.5,.5,.48,.45],a:[['pinco_food_2',.5,.9,.52,'idle']],fx:[['hearts',.6,5,{x:.5,y:.4,n:12}]],
  tx:[[0,5,'*chef’s kiss*','*シェフのキス*','big',.18],[2,5,'10/10 would paw again','また食べに来る 10/10','sub',.63]],sx:[[0,'kiss'],[2,'chime']]}
]},
{id:'f04',cat:'food',by:'pinco',song:'food',seed:42,bpm:90,likes:27400,cm:611,
 cap:['Rating ramen by slurp volume 🍜 headphones on #asmr #ramen','すする音の大きさでラーメン採点🍜 イヤホン推奨 #ASMR'],
 snd:['Slurp Theory','すすり理論'],
 com:[['bean','I can’t slurp. I am a pea.','ぼくはすすれない。豆だから。'],['party','LOUDER','もっと大きく！']],
 shots:[
 {d:3,bg:'sushi',blur:1,a:[['p_ramen',.5,.7,.24,'pulse',{in:'pop',sh:0}]],fx:[['steam',0,3,{x:.5,y:.56,n:9}]],tx:[[0,3,'Ramen ASMR 🎧','ラーメンASMR 🎧','big',.18],[1,3,'rated by slurp volume','すする音で採点','pill',.27]],sx:[[0,'pop']]},
 {d:3,bg:'sushi',tr:'cut',cam:[1.2,1.3,.5,.5,.42,.42],a:[['pinco_food_1',.5,.9,.52,'talk',{sp:.6}]],fx:[['steam',0,3,{x:.48,y:.45}]],tx:[[0,3,'slurp #1','すすり #1','pill',.17],[.3,3,'sluuurp','ずずっ','big',.62,{c:'#ffd84a'}]],sx:[[.3,'slurp']],pz:[.3]},
 {d:3,bg:'sushi',tr:'cut',cam:[1.4,1.5,.5,.5,.4,.4],a:[['pinco_food_1',.5,.9,.52,'talk']],fx:[['steam',0,3,{x:.48,y:.45}],['lines',0,3]],tx:[[0,3,'slurp #2','すすり #2','pill',.17],[.3,3,'SLUUUURP','ズズズーッ','big',.62,{c:'#ff8a3d',s:1.2}]],sx:[[.3,'slurp'],[.9,'slurp']],pz:[.3],shake:[.3,1.4,.008]},
 {d:5,bg:'sushi',tr:'zoom',cam:[1,1.05,.5,.5,.5,.5],a:[['pinco_food_2',.5,.9,.52,'idle']],fx:[['sparkle',0,5,{x:.5,y:.4,r:.2}],['stars5',1,5,{x:.5,y:.3,n:5}]],tx:[[0,5,'Verdict:','判定：','pill',.18],[2,5,'the neighbors heard it','近所まで聞こえた','sub',.63]],sx:[[1,'chime'],[2,'laugh']]}
]},
{id:'f05',cat:'food',by:'asmon',song:'villain',seed:55,bpm:138,likes:64800,cm:2210,
 cap:['Day 1 of villain meal prep. The smoke alarm is my audience. 🔥 #mealprep #villainera','悪役の作り置き1日目。観客は火災報知器🔥 #作り置き'],
 snd:['Evil Kitchen Theme','悪のキッチンのテーマ'],
 com:[['pooh','the pancakes were a gift 💛','パンケーキはプレゼントだよ💛'],['pinco','character development!!','成長してる！！']],
 shots:[
 {d:6,bg:'kitchen',cam:[1,1.06,.5,.5,.5,.5],a:[['c_asmon_5',.5,.88,.55,'nod',{in:'pop'}]],fx:[['bgtint',0,6,{c:'#2a0c3d',a:.3}],['bars',0,6]],tx:[[0,6,'Day 1 of villain meal prep','悪役の作り置き 1日目','big',.17],[2,6,'I need no recipe.','レシピなど不要。','bub',.33,{x:.5,tx:.5,ty:.42,who:'asmon'}]],sx:[[0,'thunder']]},
 {d:4,bg:'kitchen',blur:1,tr:'glitch',a:[['p_toast',.5,.68,.22,'tremble',{in:'pop',sh:0}]],fx:[['smoke',0,4,{x:.5,y:.58,n:12}],['flash',2,2.6,{c:'#ff3030',a:.35}],['flash',3,3.6,{c:'#ff3030',a:.35}]],tx:[[0,4,'toast:','トースト：','pill',.18],[1.5,4,'🔥 well done 🔥','🔥 ウェルダン 🔥','big',.3,{c:'#ff8a3d'}]],sx:[[0,'sizzle',2.5],[2,'buzz'],[3,'buzz']]},
 {d:5,bg:'kitchen',tr:'cut',cam:[1.15,1.25,.5,.5,.45,.45],a:[['c_asmon_3',.5,.88,.55,'shake']],fx:[['smoke',0,5,{x:.3,y:.6}],['sweat',0,5,{x:.62,y:.33}]],tx:[[0,5,'smoke alarm: 🔔🔔🔔','火災報知器：🔔🔔🔔','pillk',.17],[1.5,5,'THIS IS FINE','問題ない','big',.62]],sx:[[0,'buzz'],[1,'buzz'],[2,'buzz']],shake:[0,5,.006]},
 {d:7,bg:'kitchen',tr:'whip',a:[['c_asmon_1',.32,.88,.5,'hop',{t:[3,7]}],['c_asmon_3',.32,.88,.5,'tremble',{t:[0,3]}],['pooh_food_1',.72,.86,.46,'bob',{in:'r'}]],fx:[['sparkle',3,7,{x:.5,y:.5,r:.3}],['hearts',3.5,7,{x:.32,y:.45,n:8}]],
  tx:[[0,3,'Pancakes? For me??','パンケーキ？オレに？？','bub',.28,{x:.33,tx:.33,ty:.42,who:'asmon'}],[3,7,'character development 🥲','キャラの成長 🥲','sub',.64]],sx:[[0,'pop'],[3,'chime'],[3.2,'aww']]}
]},
{id:'f06',cat:'food',by:'bronny',song:'food',seed:66,bpm:96,likes:52100,cm:930,
 cap:['What I eat before a game 🏀 (green smoothie is a punishment) #whatieatinaday #venice','試合前に食べるもの🏀（グリーンスムージーは罰ゲーム）#ベニスビーチ'],
 snd:['Boardwalk Bites','ボードウォーク・バイツ'],
 com:[['pooh','3 burgers is a light snack','バーガー3個は軽食'],['mogu','the smoothie face 😭','スムージーの顔 😭']],
 shots:[
 {d:4,bg:'boardwalk',a:[['c_bronny_0',.5,.86,.5,'bob',{in:'pop'}]],fx:[['rec',0,4]],tx:[[0,4,'What I eat before a game 🏀','試合前の食事 🏀','big',.2]],sx:[[0,'pop']]},
 {d:4,bg:'boardwalk',blur:1,tr:'whip',a:[['p_smoothie',.32,.66,.2,'float',{in:'pop',sh:0}],['bronny_comedy_2',.68,.86,.48,'idle']],tx:[[0,4,'Breakfast: green smoothie','朝：グリーンスムージー','pill',.18],[1.5,4,'(I hate it)','（大きらい）','pillk',.245]],sx:[[0,'pop'],[1.5,'gulp']]},
 {d:4,bg:'boardwalk',blur:1,tr:'whip',a:[['p_pizza',.32,.66,.18,'float',{in:'pop',sh:0}],['c_bronny_3',.68,.86,.48,'bob']],tx:[[0,4,'Lunch: pizza 🍕','昼：ピザ 🍕','pill',.18]],sx:[[0,'pop'],[1,'chomp']]},
 {d:4,bg:'boardwalk',blur:1,tr:'whip',a:[['p_burger',.22,.62,.13,'pulse',{in:'drop',sh:0}],['p_burger',.36,.69,.13,'pulse',{in:'drop',t:[.5,4],sh:0}],['p_burger',.22,.76,.13,'pulse',{in:'drop',t:[1,4],sh:0}],['c_bronny_1',.68,.86,.48,'hop']],tx:[[0,4,'Dinner: 3 burgers','夜：バーガー3個','pill',.18]],sx:[[0,'thud'],[.5,'thud'],[1,'thud']]},
 {d:5,bg:'boardwalk',tr:'zoom',cam:[1.1,1,.5,.5,.45,.5],a:[['c_bronny_2',.5,.8,.55,'hop2']],fx:[['speed',0,5],['sparkle',0,5,{x:.5,y:.4}]],tx:[[0,5,'Result:','結果：','pill',.17],[1,5,'ELITE ⛹️','最強 ⛹️','big',.25,{c:'#ffd84a',s:1.3}]],sx:[[0,'whoosh'],[1,'cheer']],pz:[1]}
]},
{id:'f07',cat:'food',by:'mogu',song:'sweet',seed:77,bpm:104,likes:22900,cm:540,
 cap:['Life hack: bury your snacks so nobody steals them 🍙 (results may vary) #lifehack','ライフハック：おやつは埋めれば盗まれない🍙（個人差あり）'],
 snd:['Underground Snack Club','地下おやつ同好会'],
 com:[['max','sorry not sorry 🐶','ごめん、でも後悔してない🐶'],['prof','Scientifically, dogs can smell rice','科学的に、犬はお米の匂いがわかる']],
 shots:[
 {d:4,bg:'park',a:[['c_mogu_1',.5,.84,.42,'bob',{in:'b'}]],tx:[[0,4,'Life hack 💡','ライフハック 💡','big',.18],[1,4,'bury your snacks so nobody steals them','おやつは埋めれば盗まれない','pill',.27]],sx:[[0,'pop']]},
 {d:4,bg:'park',tr:'cut',a:[['p_onigiri',.5,.72,.12,'idle',{mv:[.5,.92],mt:2,mvd:1.5,sh:0}],['c_mogu_0',.5,.88,.3,'idle',{t:[0,4]}]],tx:[[0,4,'*dig dig*','*ほりほり*','sub',.6]],sx:[[0,'tick'],[.5,'tick'],[1,'tick'],[2.2,'thud']]},
 {d:4,bg:'park',tr:'whip',a:[['c_max_3',.7,.84,.36,'sneak',{in:'r',mv:[.42,.84],mvd:3}]],fx:[['sweat',0,4,{x:.25,y:.6}]],tx:[[0,4,'meanwhile...','そのころ…','pillk',.18]],sx:[[0,'tick'],[.5,'tick'],[1,'tick'],[1.5,'tick']]},
 {d:6,bg:'park',tr:'flash',a:[['c_max_2',.4,.84,.36,'hop',{mv:[1.4,.84],mt:1.5,mvd:2}],['c_mogu_3',.2,.86,.34,'shake',{in:'b',t:[1,6]}]],fx:[['speed',1.5,3.5]],tx:[[0,6,'the snack:','おやつ：','pill',.18],[2,6,'GONE','消えた','big',.3,{c:'#ff3b4e',s:1.3}],[3.5,6,'results may vary','個人差があります','sub',.64]],sx:[[1.5,'whoosh'],[2,'buzz'],[3,'laugh']]}
]},
{id:'f08',cat:'food',by:'pooh',song:'comedy',seed:88,bpm:128,likes:73900,cm:1730,
 cap:['Rating my egg flips 🍳 flip #2 is still missing #cookingfail','目玉焼きフリップを採点🍳 2回目の卵はまだ行方不明'],
 snd:['Flip Flop Polka','フリップフロップ・ポルカ'],
 com:[['bean','the egg landed on ME','卵、ぼくの頭に落ちたんだけど'],['prof','Flip #2 has achieved orbit','2回目は軌道に乗りました']],
 shots:[
 {d:6,bg:'kitchen',a:[['pooh_food_0',.42,.86,.48,'bob'],['c_bean_0',.82,.86,.32,'idle'],['p_egg',.36,.6,.08,'idle',{arc:[.82,.47,.25,1.5],t:[1,3],sh:0}],['p_egg',.82,.47,.06,'idle',{t:[3,6],sh:0}]],
  tx:[[0,6,'Flip #1','フリップ #1','pill',.18],[3,6,'🫠','🫠','big',.28,{s:1.5}]],sx:[[1,'whoosh'],[3,'splat']]},
 {d:6,bg:'kitchen',tr:'whip',a:[['pooh_food_0',.42,.86,.48,'bob',{sw:[[2.4,'c_pooh_0']]}],['p_egg',.36,.6,.08,'idle',{arc:[.36,-.3,.3,2],t:[1,2.4],sh:0}]],
  tx:[[0,6,'Flip #2','フリップ #2','pill',.18],[2.4,6,'where did it go','どこ行った','big',.3]],fx:[['stars',2.6,6,{x:.42,y:.4}]],sx:[[1,'rise'],[3,'crickets']]},
 {d:5,bg:'kitchen',tr:'whip',a:[['pooh_food_0',.42,.86,.48,'hop',{sw:[[3,'c_pooh_3']]}],['p_egg',.36,.6,.08,'idle',{arc:[.36,.6,.25,1],t:[1,2.6],sh:0}]],fx:[['confetti',2.6,5,{n:40}],['sparkle',2.6,5,{x:.4,y:.55}]],
  tx:[[0,5,'Flip #3','フリップ #3','pill',.18],[2.6,5,'CHEF 👨‍🍳','シェフ 👨‍🍳','big',.3,{c:'#ffd84a'}]],sx:[[1,'whoosh'],[2.6,'ding'],[2.8,'cheer']]},
 {d:4,bg:'kitchen',tr:'cut',cam:[1.2,1.25,.42,.42,.45,.45],a:[['c_pooh_3',.42,.86,.48,'idle',{sw:[[1.4,'c_pooh_4']]}],['p_egg',.42,-.1,.07,'idle',{mv:[.42,.47],mt:1,mvd:.4,me:'in',sh:0}]],fx:[['stars',1.4,4,{x:.42,y:.4}]],
  tx:[[1.4,4,'flip #2 came back','フリップ #2、帰還','sub',.64]],sx:[[1,'slip'],[1.4,'splat'],[1.8,'laugh']]}
]},
{id:'f09',cat:'food',by:'party',song:'makeup',seed:99,bpm:120,likes:18800,cm:402,
 cap:['Cupcake glow-up for my birthday 🧁🎉 every day is my birthday #partytime','誕生日カップケーキのグロウアップ🧁🎉 毎日が誕生日'],
 snd:['Sprinkle Drop','スプリンクル・ドロップ'],
 com:[['pinco','the sprinkle drop at 0:04 🔥','0:04のスプリンクルドロップ最高🔥'],['pooh','is it your birthday again','また誕生日なの？']],
 shots:[
 {d:4,bg:'#fff2c7/#ffc2dc',a:[['c_party_0',.5,.84,.5,'bob',{in:'pop'}]],tx:[[0,4,'Cupcake glow-up 🧁','カップケーキ・グロウアップ 🧁','big',.17],[1,4,'birthday edition (again)','誕生日版（また）','pill',.26]],sx:[[0,'pop'],[1,'pop']]},
 {d:4,bg:'#fff2c7/#ffc2dc',tr:'cut',cam:[1.1,1.25,.5,.5,.55,.55],a:[['p_cupcake',.5,.7,.22,'idle',{in:'drop',sh:0}]],fx:[['sparkle',2,4,{x:.5,y:.55,r:.12}]],tx:[[0,4,'before: plain','ビフォー：ふつう','pillk',.18]],sx:[[0,'thud'],[3,'riser']]},
 {d:6,bg:'#ff9fc2/#b07bff',tr:'wipe',cam:[1.25,1.1,.5,.5,.55,.55],a:[['p_cupcake',.5,.7,.24,'pulse',{sh:0}]],fx:[['confetti',0,6,{n:70}],['rays',0,6,{x:.5,y:.6}],['sparkle',0,6,{x:.5,y:.55,r:.25,n:18}]],tx:[[0,6,'after: ICONIC','アフター：伝説','big',.17,{c:'#ffd84a'}]],sx:[[0,'drop']],pz:[0,2,4]},
 {d:4,bg:'#ff9fc2/#b07bff',tr:'flash',a:[['c_party_5',.5,.84,.52,'dance']],fx:[['confetti',0,4,{n:60}]],tx:[[0,4,'happy birthday to me!!','ハッピーバースデー、わたし！！','sub',.64]],sx:[[0,'cheer']]}
]},
{id:'f10',cat:'food',by:'pooh',song:'sweet',seed:101,bpm:100,likes:40500,cm:777,
 cap:['Santa Monica food crawl on the Promenade 🌴 paid in gold coins, obviously #santamonica #foodtour','サンタモニカのプロムナードで食べ歩き🌴 もちろん金貨払い #食べ歩き'],
 snd:['Promenade Strut','プロムナード・ストラット'],
 com:[['pinco','you ate MY donut','わたしのドーナツ食べたでしょ'],['asmon','the coins. again.','また金貨か']],
 shots:[
 {d:4,bg:'promenade',cam:[1.12,1.02,.5,.5,.4,.5],a:[['c_pooh_3',.5,.86,.44,'hop',{in:'b'}]],fx:[['sparkle',0,4,{x:.5,y:.2,r:.3,n:10,c:'#ffe7a8'}]],tx:[[0,4,'Santa Monica food crawl 🌴','サンタモニカ食べ歩き 🌴','big',.17]],sx:[[0,'pop']]},
 {d:3,bg:'promenade',blur:1,tr:'whip',a:[['p_taco',.32,.62,.15,'float',{in:'pop',sh:0}],['c_pooh_2',.68,.86,.44,'bob']],tx:[[0,3,'Stop 1: tacos 🌮','1軒目：タコス 🌮','pill',.18]],sx:[[0,'pop'],[1.5,'chomp']]},
 {d:3,bg:'promenade',blur:1,tr:'whip',a:[['p_donut',.32,.62,.15,'float',{in:'pop',sh:0}],['c_pinco_4',.68,.86,.46,'bob']],tx:[[0,3,'Stop 2: donuts 🍩','2軒目：ドーナツ 🍩','pill',.18],[1,3,'(Pinco joined)','（ピンコ合流）','pillk',.245]],sx:[[0,'pop'],[1.5,'chomp']]},
 {d:3,bg:'promenade',blur:1,tr:'whip',a:[['p_pizza',.32,.62,.15,'float',{in:'pop',sh:0}],['c_pooh_4',.68,.86,.44,'bob']],tx:[[0,3,'Stop 3: pizza 🍕','3軒目：ピザ 🍕','pill',.18]],sx:[[0,'pop'],[1.5,'chomp']]},
 {d:5,bg:'promenade',tr:'zoom',a:[['c_pooh_0',.5,.86,.48,'hop']],fx:[['coins',0,2,{x:.5,y:.55,n:14}],['money',1,5,{n:20}]],tx:[[0,5,'paying the bill like:','お会計のとき：','pill',.18],[1,5,'KA-CHING','チャリーン','big',.3,{c:'#ffd84a'}]],sx:[[0,'cash'],[1,'cash'],[2,'cheer']]}
]}
);
