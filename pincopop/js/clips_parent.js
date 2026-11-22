'use strict';
// PARENTING clips (times in beats)
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'p01',cat:'parent',by:'pooh',song:'parent',seed:301,bpm:88,likes:132000,cm:3900,
 cap:['Babysitting for the first time 🍼 hour 3 hit different #babysitting #newparent','はじめてのベビーシッター🍼 3時間目がいちばんキツい'],
 snd:['Nap Trap Lullaby','お昼寝トラップ子守唄'],
 com:[['pooping','welcome to my life','ようこそ、ぼくの毎日へ'],['pinco','they look so peaceful on you 🥹','みんなプーの上で安心してる🥹']],
 shots:[
 {d:4,bg:'nursery',a:[['pooh_parent_0',.5,.86,.46,'bob',{in:'pop'}]],fx:[['sparkle',0,4,{x:.5,y:.5}]],tx:[[0,4,'Babysitting, hour 1:','ベビーシッター 1時間目：','pill',.17],[1,4,'I got this 😎','よゆう 😎','big',.25]],sx:[[0,'pop'],[1,'ding']]},
 {d:6,bg:'nursery',tr:'whip',a:[['pooh_parent_2',.5,.86,.46,'tremble'],['babies_0',.2,.9,.18,'hop',{mv:[.75,.92],mvd:3}],['babies_1',.8,.88,.2,'hop',{mv:[.25,.9],mvd:3.5}],['babies_2',.55,.95,.18,'dance',{in:'b'}],['p_duck',.3,.6,.07,'spin',{arc:[.8,.55,.2,2],t:[1,3],sh:0}],['p_car',.75,.62,.08,'spin',{arc:[.2,.5,.25,1],t:[2.5,4.5],sh:0}]],
  fx:[['sweat',0,6,{x:.58,y:.48}]],tx:[[0,6,'hour 2:','2時間目：','pill',.17],[1.5,6,'chaos 🌀','カオス 🌀','big',.25]],sx:[[0,'giggle'],[1,'squeak'],[2.5,'whoosh'],[3.5,'giggle']]},
 {d:8,bg:'nursery',tr:'flash',cam:[1.05,1.15,.5,.5,.6,.6],a:[['pooh_parent_1',.5,.86,.46,'float',{sp:.5}],['babies_0',.33,.92,.16,'idle'],['babies_1',.5,.95,.17,'idle'],['babies_2',.67,.93,.16,'idle']],fx:[['bgtint',0,8,{c:'#1a1440',a:.35}],['zzz',0,8,{x:.58,y:.45}],['zzz',1,8,{x:.36,y:.75,s:.7}]],
  tx:[[0,8,'hour 3:','3時間目：','pill',.17],[1.5,8,'everyone is asleep (including me)','全員寝た（ぼくも）','sub',.28]],sx:[[0,'snore'],[3,'snore'],[6,'snore']]}
]},
{id:'p02',cat:'parent',by:'pooh',song:'parent',seed:302,bpm:84,likes:98700,cm:2701,
 cap:['Nap-time hack that works 100% of the time (until the duck) 🦆 #naptime #parentinghack','100%成功するお昼寝ハック（アヒルさえなければ）🦆'],
 snd:['Tiptoe Waltz','つまさきワルツ'],
 com:[['bean','RIP the nap','お昼寝、さようなら'],['max','I would have eaten the duck','ぼくならアヒル食べてた']],
 shots:[
 {d:4,bg:'bedtime',a:[['pooh_parent_2',.6,.86,.46,'sneak'],['babies_0',.25,.62,.16,'idle',{sh:0}]],fx:[['zzz',0,4,{x:.27,y:.5,s:.6}]],tx:[[0,4,'nap-time hack 🤫','お昼寝ハック 🤫','big',.17]],sx:[[0,'tick']]},
 {d:4,bg:'bedtime',tr:'whip',a:[['pooh_parent_2',.7,.86,.46,'sneak',{mv:[.55,.86],mvd:4}]],tx:[[0,4,'step 1: tiptoe','ステップ1：そろりそろり','pill',.17],[1,4,'(easy with no legs)','（足がないから楽）','pillk',.235]],sx:[[0,'tick'],[1,'tick'],[2,'tick'],[3,'tick']]},
 {d:4,bg:'bedtime',tr:'whip',a:[['babies_0',.4,.75,.22,'idle',{sh:0}]],fx:[['notes',0,4,{x:.5,y:.4}],['zzz',1,4,{x:.45,y:.55}]],tx:[[0,4,'step 2: lullaby 🎶','ステップ2：子守唄 🎶','pill',.17]],sx:[[0,'chime']]},
 {d:3,bg:'bedtime',tr:'cut',cam:[1.4,1.5,.5,.5,.85,.85],a:[['p_duck',.5,.92,.1,'tremble',{sh:0}]],tx:[[0,3,"step 3: DON'T step on the duck",'ステップ3：アヒルを踏むな','pill',.6]],sx:[[1,'squeak'],[1.3,'squeak']],shake:[1,2,.02],pz:[1]},
 {d:5,bg:'bedtime',tr:'cut',a:[['pooh_parent_0',.68,.86,.46,'shake'],['babies_0',.27,.62,.18,'shake',{sh:0}]],fx:[['tears',.5,5,{x:.27,y:.5}],['impact',0,1,{x:.3,y:.4,t:'WAAH',s:.16,c:'#ff8fc4'}]],tx:[[0,5,'nap: cancelled','お昼寝：中止','big',.2,{c:'#ff8fc4'}]],sx:[[0,'cry']]}
]},
{id:'p03',cat:'parent',by:'pooping',song:'comedy',seed:303,bpm:120,likes:72100,cm:1666,
 cap:['Toy cleanup race 🧸 8 seconds flat (then they dumped it again) #momlife #dadlife','おもちゃ片付けレース🧸 8秒（そしてまたひっくり返された）'],
 snd:['Clean-Up Countdown','おかたづけカウントダウン'],
 com:[['pinco','the ending is SO real','オチがリアルすぎる'],['prof','Entropy always wins','エントロピーは常に勝つ']],
 shots:[
 {d:4,bg:'living',a:[['pooping_parent_2',.5,.86,.42,'tremble']],fx:[['sweat',0,4,{x:.6,y:.5}]],tx:[[0,4,'clean-up challenge 🧸','おかたづけチャレンジ 🧸','big',.17],[1,4,'can Dad do it in 8 seconds?','パパは8秒でできる？','pill',.27]],sx:[[0,'ding']]},
 {d:8,bg:'living',tr:'zoom',a:[['c_pooping_2',.32,.86,.38,'dance'],['p_car',.25,.9,.08,'spin',{arc:[.8,.8,.3,1],t:[0,1],sh:0}],['p_duck',.7,.92,.08,'spin',{arc:[.8,.8,.3,1],t:[1,2],sh:0}],['p_rattle',.45,.92,.08,'spin',{arc:[.8,.8,.3,1],t:[2,3],sh:0}],['p_bottle',.6,.9,.08,'spin',{arc:[.8,.8,.3,1],t:[3,4],sh:0}],['p_paci',.15,.93,.06,'spin',{arc:[.8,.8,.3,1],t:[4,5],sh:0}]],
  fx:[['count',0,8,{x:.5,y:.3,from:8,c:'#ffd84a'}],['speed',0,8]],sx:[[1,'pop'],[2,'pop'],[3,'pop'],[4,'pop'],[5,'pop'],[0,'tick'],[2,'tick'],[4,'tick'],[6,'tick']]},
 {d:4,bg:'living',tr:'flash',a:[['c_pooping_5',.4,.86,.4,'hop']],fx:[['confetti',0,4]],tx:[[0,4,'DONE ✨','完了 ✨','big',.2,{c:'#38dcb0'}]],sx:[[0,'cheer']]},
 {d:6,bg:'living',tr:'cut',a:[['c_pooping_3',.4,.86,.4,'shake'],['babies_2',.72,.9,.18,'hop',{in:'r'}],['p_car',.8,.75,.08,'spin',{arc:[.2,.92,.25,2],t:[1,2.5],sh:0}],['p_duck',.8,.75,.08,'spin',{arc:[.55,.95,.25,2],t:[1.5,3],sh:0}],['p_rattle',.8,.75,.08,'spin',{arc:[.1,.9,.3,2],t:[2,3.5],sh:0}]],tx:[[0,6,'...again 🙃','…ふりだし 🙃','big',.2]],sx:[[1,'giggle'],[1.5,'whoosh'],[2,'whoosh'],[3,'laugh']]}
]},
{id:'p04',cat:'parent',by:'pooping',song:'parent',seed:304,bpm:86,likes:84300,cm:2033,
 cap:['Bedtime story, page 1 (of 1, forever) 📖😴 #bedtime #storytime','寝る前の絵本、1ページ目（永遠に1ページ目）📖😴'],
 snd:['Again Again Lullaby','もういっかい子守唄'],
 com:[['bean','AGAIN','もういっかい'],['pooh','who fell asleep first 😂','先に寝たのはどっち😂']],
 shots:[
 {d:5,bg:'bedtime',a:[['pooping_parent_1',.62,.86,.42,'idle'],['babies_1',.2,.62,.2,'idle',{sh:0}]],tx:[[0,5,'bedtime story, page 1 📖','絵本、1ページ目 📖','pill',.17],[2,5,'The end! 🌙','おしまい！🌙','bub',.38,{x:.6,tx:.62,ty:.5,who:'pooping'}]],sx:[[2,'chime']]},
 {d:3,bg:'bedtime',tr:'cut',cam:[1.4,1.5,.22,.22,.55,.55],a:[['babies_1',.2,.62,.2,'pulse',{sh:0}]],tx:[[0,3,'again.','もういっかい。','big',.27]],sx:[[0,'voice']]},
 {d:3,bg:'bedtime',tr:'cut',a:[['pooping_parent_1',.62,.86,.42,'idle'],['babies_1',.2,.62,.2,'idle',{sh:0}]],tx:[[0,3,'again.','もういっかい。','big',.27],[0,3,'×5','×5','tag',.17]],sx:[[0,'tick']]},
 {d:3,bg:'bedtime',tr:'cut',cam:[1.2,1.2,.5,.5,.5,.5],a:[['c_pooping_3',.62,.86,.42,'tremble'],['babies_1',.2,.62,.2,'idle',{sh:0}]],tx:[[0,3,'AGAIN.','もういっかい！','big',.27,{c:'#ffd84a'}],[0,3,'×12','×12','tag',.17]],sx:[[0,'tick']]},
 {d:6,bg:'bedtime',tr:'flash',a:[['pooping_parent_1',.62,.86,.42,'float',{rot:-14}],['babies_1',.2,.62,.2,'bob',{sh:0}]],fx:[['bgtint',0,6,{c:'#0d0a30',a:.4}],['zzz',0,6,{x:.64,y:.45}]],tx:[[0,6,'who fell asleep first:','先に寝たのは：','pill',.17],[1.5,6,'Dad 😴','パパ 😴','big',.25]],sx:[[0,'snore'],[3,'giggle']]}
]},
{id:'p05',cat:'parent',by:'pooping',song:'sweet',seed:305,bpm:100,likes:56600,cm:1209,
 cap:['Weekend dad mode on the Strand 🌴👶 every dad here waves at every other dad #venice #strand','ストランドで週末パパモード🌴👶 パパ同士はみんな手をふる'],
 snd:['Stroller Strut','ベビーカー・ストラット'],
 com:[['bronny','the dad wave is real','パパの挨拶はガチ'],['party','I want a stroller ride','ベビーカー乗りたい']],
 shots:[
 {d:6,bg:'boardwalk',a:[['pooping_parent_0',.2,.86,.4,'bob',{mv:[.55,.86],mvd:6,me:'lin'}]],fx:[['sparkle',0,6,{x:.5,y:.2,r:.4,n:8}]],tx:[[0,6,'weekend dad mode 🌴','週末パパモード 🌴','big',.17]],sx:[[0,'pop']]},
 {d:5,bg:'boardwalk',tr:'whip',a:[['c_bronny_1',.78,.84,.42,'hop',{in:'r'}],['pooping_parent_0',.32,.86,.4,'bob']],tx:[[0,5,'every dad on the Strand:','ストランドのパパたち：','pill',.17],[1.5,5,'👋 sup','👋 よっ','bub',.36,{x:.75,tx:.78,ty:.46,who:'bronny'}]],sx:[[1.5,'pop']]},
 {d:5,bg:'boardwalk',tr:'cut',cam:[1.3,1.4,.32,.32,.62,.62],a:[['pooping_parent_0',.32,.86,.4,'nod']],tx:[[0,5,'👋 sup','👋 よっ','bub',.42,{x:.3,tx:.28,ty:.5,who:'pooping'}],[2,5,'(they have never met)','（初対面）','sub',.25]],sx:[[0,'pop'],[2,'laugh']]}
]},
{id:'p06',cat:'parent',by:'pooping',song:'sweet',seed:306,bpm:96,likes:110000,cm:4400,
 cap:['Asking my kids what Pooh does for work 🎤👶 #kidsays #interview','子どもたちに「プーのお仕事は？」と聞いてみた🎤👶'],
 snd:['Tiny Interview','ちいさなインタビュー'],
 com:[['pooh','money bear is correct','マネーベアで正解'],['asmon','"he yells at clouds" LMAO','「くもにおこってる」草']],
 shots:[
 {d:4,bg:'#ffe6f1/#e3f4ff',a:[['babies_0',.25,.84,.22,'bob'],['babies_1',.5,.84,.25,'bob'],['babies_2',.75,.84,.22,'bob']],tx:[[0,4,'interviewing my kids 🎤','子どもにインタビュー 🎤','big',.17]],sx:[[0,'pop']]},
 {d:5,bg:'#ffe6f1/#e3f4ff',tr:'whip',a:[['babies_1',.5,.86,.3,'talk']],tx:[[0,5,'What does Pooh do for work?','プーのお仕事はなに？','pill',.17],[1.5,5,"He's a money bear.",'お金のクマさん。','bub',.4,{x:.5,tx:.5,ty:.52,who:'babyb'}]],sx:[[0,'pop']]},
 {d:5,bg:'#ffe6f1/#e3f4ff',tr:'whip',a:[['babies_0',.5,.86,.28,'talk']],tx:[[0,5,'And Asmon?','アスモンは？','pill',.17],[1.5,5,'He yells at clouds.','くもにおこってる。','bub',.4,{x:.5,tx:.5,ty:.52,who:'babyp'}]],sx:[[0,'pop'],[3,'laugh']]},
 {d:5,bg:'#ffe6f1/#e3f4ff',tr:'whip',a:[['babies_2',.5,.86,.28,'talk']],tx:[[0,5,'And Daddy?','パパは？','pill',.17],[1.5,5,'He sits on the computer.','パソコンの上にすわってる。','bub',.4,{x:.5,tx:.5,ty:.52,who:'babyh'}]],sx:[[0,'pop'],[3,'laugh']]},
 {d:4,bg:'living',tr:'cut',a:[['c_pooping_3',.5,.86,.42,'shake']],tx:[[0,4,'I do NOT sit on it','すわってないよ','big',.2]],sx:[[0,'scratch'],[1,'laugh']]}
]},
{id:'p07',cat:'parent',by:'pooh',song:'comedy',seed:307,bpm:120,likes:66300,cm:1540,
 cap:['Picky eater? Try the airplane ✈️ …or the money trick 💰 #pickyeater #feedingtime','好き嫌い対策：ひこうき✈️ …またはお金作戦💰'],
 snd:['Here Comes The Spoon','スプーンがくるよ'],
 com:[['pinco','money trick works on adults too','お金作戦は大人にも効く'],['bean','I also would open for coins','ぼくも金貨なら口あける']],
 shots:[
 {d:4,bg:'kitchen',a:[['babies_2',.5,.86,.3,'idle']],tx:[[0,4,'picky eater? 🥄','好き嫌い？🥄','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'kitchen',tr:'whip',a:[['babies_2',.62,.86,.3,'shake'],['p_egg',.0,.4,.07,'spin',{arc:[.6,.6,.15,1],t:[0,3],sh:0}]],fx:[['speed',0,3]],tx:[[0,6,'try the airplane ✈️','ひこうき作戦 ✈️','pill',.17],[3,6,'nope.','いや。','big',.3]],sx:[[0,'whoosh'],[3,'buzz']]},
 {d:6,bg:'kitchen',tr:'whip',a:[['babies_2',.6,.86,.3,'hop'],['pooh_parent_0',.25,.86,.44,'bob',{in:'l'}]],fx:[['coins',1,3,{x:.3,y:.5,n:12}],['sparkle',1,6,{x:.6,y:.6}]],tx:[[0,6,'try the money trick 💰','お金作戦 💰','pill',.17],[3,6,'works every time','毎回成功','big',.27,{c:'#ffd84a'}]],sx:[[1,'cash'],[3,'chomp'],[3.6,'giggle']]}
]},
{id:'p08',cat:'parent',by:'max',song:'sweet',seed:308,bpm:104,likes:79800,cm:2290,
 cap:['Hire Max as your babysitter 🐶 5 stars, he fetched the baby (literally) #petsofpincopop','マックスをベビーシッターに🐶 ★5、赤ちゃんを取ってきた（文字通り）'],
 snd:['Good Boy Groove','グッドボーイ・グルーヴ'],
 com:[['pooping','he brought my kid back faster than I could','ぼくより早く子どもを連れ戻した'],['mogu','5 stars no notes','★5、文句なし']],
 shots:[
 {d:4,bg:'park',a:[['c_max_5',.5,.86,.38,'bob',{in:'pop'}]],tx:[[0,4,'Max: babysitter 🐶','マックス：ベビーシッター 🐶','big',.17],[1,4,'reviews from parents:','保護者のレビュー：','pill',.27]],sx:[[0,'pop']]},
 {d:5,bg:'park',tr:'whip',a:[['c_max_2',.25,.86,.34,'hop',{mv:[.7,.86],mvd:3}],['babies_0',.7,.9,.16,'idle',{t:[0,3]}],['babies_0',.7,.78,.14,'idle',{t:[3,5],sh:0}]],fx:[['stars5',3,5,{x:.5,y:.3,n:5}],['speed',0,3]],tx:[[3,5,'"He fetched the baby."','「赤ちゃんを取ってきてくれた」','pill',.18]],sx:[[0,'whoosh'],[3,'ding']]},
 {d:5,bg:'park',tr:'whip',a:[['c_max_1',.5,.86,.36,'nod'],['babies_1',.25,.9,.17,'dance'],['babies_2',.78,.9,.16,'dance']],fx:[['stars5',.5,5,{x:.5,y:.3,n:5}]],tx:[[.5,5,'"Very good boy."','「とてもいい子」','pill',.18]],sx:[[.5,'ding'],[2,'giggle']]},
 {d:4,bg:'park',tr:'flash',a:[['c_max_4',.5,.86,.36,'hop']],fx:[['hearts',0,4,{x:.5,y:.5}]],tx:[[0,4,'payment: 1 apple 🍎','報酬：りんご1個 🍎','big',.2]],sx:[[0,'chime']]}
]},
{id:'p09',cat:'parent',by:'pooh',song:'food',seed:309,bpm:94,likes:58800,cm:1311,
 cap:["What's in my diaper bag (Pooh edition) 👜 spoiler: snacks and money #whatsinmybag",'マザーズバッグの中身（プー版）👜 ネタバレ：おやつとお金'],
 snd:['Pack It Up','パックイットアップ'],
 com:[['pinco','why are there 47 snacks','なんでおやつ47個も'],['pooping','the coins are a choking hazard Pooh','金貨は誤飲注意だよプー']],
 shots:[
 {d:4,bg:'#fff3d6/#ffd7e8',a:[['pooh_parent_0',.5,.86,.5,'bob',{in:'pop'}]],tx:[[0,4,"what's in my diaper bag 👜",'バッグの中身 👜','big',.17],[1,4,'(Pooh edition)','（プー版）','pill',.27]],sx:[[0,'pop']]},
 {d:8,bg:'#fff3d6/#ffd7e8',tr:'slide',cam:[1,1,.5,.5,.5,.5],a:[['p_bottle',.27,.38,.16,'pulse',{in:'pop',t:[0,8],sh:0}],['p_paci',.5,.36,.11,'pulse',{in:'pop',t:[1,8],sh:0}],['p_duck',.73,.37,.12,'pulse',{in:'pop',t:[2,8],sh:0}],['p_rattle',.27,.6,.12,'pulse',{in:'pop',t:[3,8],sh:0}],['p_car',.5,.59,.11,'pulse',{in:'pop',t:[4,8],sh:0}],['p_onigiri',.73,.6,.12,'pulse',{in:'pop',t:[5,8],sh:0}]],
  tx:[[0,8,'bottle','ほにゅうびん','tag',.42,{x:.27}],[1,8,'paci','おしゃぶり','tag',.42,{x:.5}],[2,8,'duck','アヒル','tag',.42,{x:.73}],[3,8,'rattle','ガラガラ','tag',.64,{x:.27}],[4,8,'car','くるま','tag',.64,{x:.5}],[5,8,'+47 snacks','おやつ+47','tag',.64,{x:.73}]],sx:[[0,'pop'],[1,'pop'],[2,'pop'],[3,'pop'],[4,'pop'],[5,'pop']]},
 {d:5,bg:'#fff3d6/#ffd7e8',tr:'flash',a:[['c_pooh_0',.5,.86,.5,'hop']],fx:[['money',0,5,{n:20}]],tx:[[0,5,'and... emergency money 💰','あと…非常用のお金 💰','pill',.17]],sx:[[0,'cash'],[1,'cash']]}
]},
{id:'p10',cat:'parent',by:'pinco',song:'parent',seed:310,bpm:82,likes:201000,cm:8800,
 cap:['She took her FIRST STEPS 😭💕 the whole crew was there #firststeps #milestone','はじめての一歩😭💕 みんなで見守った'],
 snd:['First Steps (strings)','はじめの一歩（ストリングス）'],
 com:[['pooh','I am crying into my money','お金に涙がおちてる'],['asmon','…I am not crying. you are crying.','…泣いてない。泣いてるのはお前だ。']],
 shots:[
 {d:4,bg:'nursery',a:[['babies_0',.25,.9,.2,'tremble']],tx:[[0,4,'wait for it...','見てて…','pill',.17]],sx:[[0,'aww']]},
 {d:6,bg:'nursery',tr:'cut',cam:[1.1,1.25,.4,.55,.6,.6],a:[['babies_0',.25,.9,.2,'sneak',{mv:[.62,.9],mvd:6,me:'lin',rot:6}]],fx:[['sparkle',2,6,{x:.5,y:.75,r:.2}]],tx:[[0,6,'step 1… step 2… step 3…','1歩…2歩…3歩…','sub',.3,{wd:.5}]],sx:[[0,'tick'],[1.5,'tick'],[3,'tick'],[4.5,'tick']]},
 {d:8,bg:'nursery',tr:'flash',a:[['c_pooh_3',.2,.86,.36,'hop'],['c_pinco_1',.5,.86,.4,'hop'],['c_pooping_2',.8,.86,.32,'hop'],['babies_0',.5,.95,.17,'dance',{z:2}]],fx:[['confetti',0,8,{n:70}],['hearts',0,8,{x:.5,y:.6,n:16}]],tx:[[0,8,'FIRST STEPS 😭💕','はじめての一歩 😭💕','big',.17,{c:'#ff8fc4'}]],sx:[[0,'cheer'],[1,'aww']]}
]}
);
