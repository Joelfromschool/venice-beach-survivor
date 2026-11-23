'use strict';
// LOCAL FOOD (v1.3): scone + lunch reviews near Yoyogi Park (Yoyogi-Uehara, Yoyogi-Hachiman, Tomigaya, Sangubashi).
// Real shops only, facts checked 2026-11-23 against shop sites / recent listings. No prices, no scores: opinions are
// the characters' own vibes. Shop interiors are drawn as generic original art, not the real shops.
window.CLIPS=window.CLIPS||[];
const SBG='#fff6ea/#ffe2c4',LUBG='#f2fff0/#dff3ff';
CLIPS.push(
// s01 MAP route listicle
{id:'sc01',cat:'food',also:['tokyo'],by:'pinco',song:'lofi',seed:2101,bpm:80,likes:187000,cm:9900,note:1,
 cap:['the Yoyogi Park scone crawl 🗺️🥐 7 spots, all walkable #scones #yoyogiuehara #tomigaya','代々木公園スコーンめぐり🗺️ 歩いて回れる7軒 #スコーン #代々木上原 #富ヶ谷'],
 snd:['Scone Route Lofi','スコーンめぐりlofi'],
 com:[['pooh','I will do this route in one day','1日で全部回る'],['kaise','saving for Saturday (Levain day) 📌','土曜（ルヴァンの日）用に保存📌']],
 shots:[
 {d:5,bg:SBG,a:[['w_pinco_0',.5,.9,.46,'bob',{in:'pop'}],['p_sconecream',.2,.78,.12,'float',{sh:0}],['p_scone',.82,.8,.12,'float',{sh:0}]],tx:[[0,5,'the Yoyogi Park scone crawl 🗺️','代々木公園スコーンめぐり 🗺️','big',.17]],sx:[[0,'pop']]},
 {d:16,bg:'#f4efe2',dots:0,tr:'slide',fx:[['map',0,16,{back:1,park:[.46,.17,.44,.3],dur:11,pins:[[.42,.14,0,'FLOTO','FLOTO'],[.68,.56,0,'PATH','PATH'],[.54,.49,0,'Levain','ルヴァン','l'],[.46,.64,0,'Horn','ホルン'],[.36,.72,0,'Sigourney','シガニー'],[.25,.58,0,'Beagle','ビーグル','l'],[.18,.8,0,'Mlesna Tea','ムレスナティー']]}]],tx:[[0,16,'🌳 Yoyogi Park','🌳 代々木公園','pillk',.27,{x:.68,s:.8}]],sx:[[0,'pop'],[1.8,'pop'],[3.7,'pop'],[5.5,'pop'],[7.3,'pop'],[9.2,'pop'],[11,'pop']]},
 {d:8,bg:'x_ginkgo',tr:'zoom',a:[['w_pinco_1',.5,.9,.46,'bob']],fx:[['hearts',0,8,{n:8}]],tx:[[0,8,'reviews of each one are in the Food tab 🥐','1軒ずつのレビューはフードタブで 🥐','tag',.2],[1.5,8,'menus change — check the shop’s page first','メニューは変わるのでお店の情報を事前に確認','tag',.3]],sx:[[0,'chime']]}
]},
// s02 POV dog: Beagle
{id:'sc02',cat:'food',also:['tokyo'],by:'max',song:'sweet',seed:2102,bpm:98,likes:156000,cm:7200,note:1,
 cap:['POV: you’re a dog and this café bakes scones for YOU 🐶 #beagle #yoyogiuehara #dogfriendly','POV：犬のぼくにもスコーンを焼いてくれるカフェ🐶 #ビーグル #代々木上原 #犬連れOK'],
 snd:['Good Boy Scones','いい子のスコーン'],
 com:[['pinco','dog scones?? Max is never leaving','犬用スコーン？マックス帰らないやつ'],['prof','Soup and scones: a sound lunch.','スープとスコーン、理にかなったランチ。']],
 shots:[
 {d:5,bg:'cafe',cam:[1.25,1.2,.5,.5,.75,.75],a:[['c_max_4',.5,.92,.46,'bob',{in:'pop'}]],tx:[[0,5,'POV: you’re a dog on a walk near Yoyogi Park 🐶','POV：代々木公園の近くを散歩中の犬 🐶','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'cafe',tr:'cut',cam:[1.4,1.4,.5,.5,.8,.8],a:[['p_dogscone',.5,.82,.12,'pulse',{sh:0}]],fx:[['sparkle',0,6,{x:.5,y:.72,r:.12}]],tx:[[0,6,'Beagle sells scones made for dogs 🦴','ビーグルには犬用スコーンがある 🦴','cap',.22]],sx:[[0,'sparkle']]},
 {d:6,bg:SBG,tr:'whip',a:[['p_scone',.27,.6,.13,'float',{sh:0}],['p_sconecream',.5,.6,.13,'float',{sh:0}],['p_soup',.74,.6,.12,'float',{sh:0}]],tx:[[0,6,'(humans get 10+ kinds of homemade scones + soup)','（人間には自家製スコーン10種類以上＋スープ）','tag',.22],[2,6,'based on a traditional Scottish recipe','スコットランドの伝統レシピがベース','tag',.32]],sx:[[0,'ding'],[2,'ding']]},
 {d:6,bg:'cafe',tr:'cut',a:[['c_max_2',.5,.92,.44,'hop']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'the shop dog is named Aloe. we are friends now.','看板犬はアロエ。もう友だち。','cap',.22]],sx:[[0,'wiggle']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['c_max_5',.5,.92,.46,'bob']],tx:[[0,6,'📍 Beagle (soup & scones)','📍 Beagle（スープとスコーンのお店）','loc',.2],[.8,6,'3 min from Yoyogi-Uehara east exit · dogs & kids welcome','代々木上原駅東口から徒歩3分・犬連れ子連れ歓迎','tag',.3]],sx:[[0,'ding']]}
]},
// s03 VHS home video: Levain Saturday scone hunt
{id:'sc03',cat:'food',also:['tokyo'],by:'bean',song:'synth',seed:2103,bpm:100,likes:143000,cm:6300,look:'vhs',vhsDate:'SAT.NOV.21 2026',note:1,
 cap:['found footage: the Saturday scone hunt at Levain 📼🫛 #levain #tomigaya #scones','発掘映像：ルヴァンの土曜スコーン狩り📼🫛 #ルヴァン #富ヶ谷 #スコーン'],
 snd:['Tape Rewind Funk','巻き戻しファンク'],
 com:[['pooh','what flavor did you get','何味だった？'],['kaise','regulars say: go Saturday 📌','常連いわく、土曜に行け📌']],
 shots:[
 {d:5,bg:'cafe',a:[['c_bean_3',.5,.9,.44,'tremble']],tx:[[0,5,'THE SATURDAY SCONE HUNT','土曜のスコーン狩り','retro',.27]],sx:[[0,'tape']]},
 {d:6,bg:'cafe',tr:'glitch',a:[['c_bean_0',.5,.9,.44,'talk']],tx:[[0,6,'regulars say Levain’s scones show up on Saturdays','常連さんいわく、ルヴァンのスコーンは土曜に並ぶ','retro',.27,{s:.85}],[2.5,6,'and the flavor changes every time','味は毎回ちがう','retro',.4,{s:.85}]],sx:[[0,'scratch']]},
 {d:6,bg:SBG,tr:'glitch',a:[['p_scone',.3,.62,.13,'float',{sh:0}],['p_scone',.7,.62,.13,'float',{sh:0}]],tx:[[0,6,'never the same flavor twice, so no spoilers','毎回ちがう味なのでネタバレなし','retro',.272,{s:.8}]],sx:[[0,'tape']]},
 {d:6,bg:'cafe',tr:'cut',a:[['c_bean_5',.5,.9,.44,'hop']],fx:[['sparkle',0,6,{x:.5,y:.4}]],tx:[[0,6,'GOT ONE. still warm. 🫛','ゲット。まだ温かい。🫛','retro',.272]],sx:[[0,'cheer']]},
 {d:6,bg:'cafe',tr:'cut',a:[['c_bean_1',.5,.9,.44,'bob']],tx:[[0,6,'📍 Levain Tomigaya (natural-yeast bakery)','📍 ルヴァン 富ヶ谷店（天然酵母のパン屋）','loc',.2],[.8,6,'Tomigaya 2-chome · closed Mondays','富ヶ谷2丁目・月曜定休','tag',.3]],sx:[[0,'ding']]}
]},
// s04 ASMR tea pour: Mlesna Tea
{id:'sc04',cat:'food',also:['tokyo'],by:'pooh',song:'asmr',seed:2104,bpm:66,likes:128000,cm:4400,look:'asmr',note:1,
 cap:['scones + bottomless tea ASMR 🎧🫖 Mlesna Tea Yoyogi-Uehara #asmr #afternoontea #yoyogiuehara','スコーン＆紅茶飲み放題ASMR🎧🫖 ムレスナティー代々木上原 #ASMR #紅茶 #代々木上原'],
 snd:['Teacup Whisper','ティーカップのささやき'],
 com:[['pinco','the pour sound 😌','注ぐ音😌'],['bean','I could not hold the cup. again.','またカップが持てなかった。']],
 shots:[
 {d:4,bg:'cafe',blur:1,a:[['c_pooh_3',.5,.92,.48,'idle',{in:'fade'}]],tx:[[0,4,'scones + tea, but make it ASMR 🎧','スコーンと紅茶をASMRで 🎧','cap',.2]],sx:[[0,'chime']]},
 {d:6,bg:'cafe',blur:1,tr:'cut',a:[['p_teapot',.42,.6,.22,'idle',{sh:0,mid:1,rot:-18}],['p_teacup',.62,.74,.14,'idle',{sh:0,mid:1}]],fx:[['bgtint',0,6,{a:.3}],['steam',1,6,{x:.62,y:.66}]],tx:[[0,6,'free-flow tea comes with the scone set','スコーンセットは紅茶フリー付き','cap',.22]],sx:[[.3,'pour']]},
 {d:5,bg:'cafe',blur:1,tr:'cut',cam:[1.2,1.3,.5,.5,.6,.6],a:[['p_sconecream',.5,.66,.24,'idle',{sh:0,mid:1}]],fx:[['bgtint',0,5,{a:.3}]],tx:[[0,5,'*crunch*','＊ザクッ＊','cap',.22]],sx:[[.4,'chomp']]},
 {d:5,bg:'cafe',blur:1,tr:'cut',a:[['p_teacup',.5,.68,.18,'idle',{sh:0,mid:1}]],fx:[['bgtint',0,5,{a:.3}],['steam',0,5,{x:.5,y:.6}]],tx:[[0,5,'refill after refill… 😌','おかわり、またおかわり…😌','cap',.22]],sx:[[.3,'pour']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['c_pooh_5',.5,.92,.46,'bob']],tx:[[0,6,'📍 Mlesna Tea Yoyogi-Uehara','📍 ムレスナティー代々木上原店','loc',.2],[.8,6,'Yoyogi-Uehara · closed Thursdays','代々木上原・木曜定休','tag',.3]],sx:[[0,'ding']]}
]},
// s05 SPLIT DUET: FLOTO gelato vs scone
{id:'sc05',cat:'food',also:['tokyo'],by:'bronny',song:'comedy',seed:2105,bpm:112,likes:139000,cm:5800,note:1,
 cap:['duet: gelato vs. scone at FLOTO (Sangubashi) 🍨🥐 #floto #sangubashi #duet','デュエット：FLOTOでジェラートvsスコーン🍨🥐 #FLOTO #参宮橋'],
 snd:['Team Scone Anthem','スコーン派のテーマ'],
 com:[['pinco','team scone forever 💗','一生スコーン派💗'],['kaise','why not both (tier: S)','両方でいい（Sランク）']],
 shots:[
 {d:5,bg:'cafe',a:[['c_bronny_3',.33,.9,.44,'bob',{in:'l'}],['c_pinco_1',.7,.9,.44,'bob',{in:'r'}]],tx:[[0,5,'FLOTO debate: gelato or scone? 🍨🥐','FLOTO論争：ジェラートかスコーンか？🍨🥐','big',.17]],sx:[[0,'pop']]},
 {d:10,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:'cafe',a:[['c_bronny_0',.5,.92,.42,'talk']],tx:[[0,10,'TEAM GELATO','ジェラート派','pill',.15],[1.5,10,'it’s a gelato shop first, bro 🍨','ここはジェラート屋なんだよ🍨','tag',.3]]},{r:[.5,0,.5,1],bg:'cafe',a:[['c_pinco_3',.5,.92,.42,'talk'],['p_scone',.5,.6,.1,'float',{sh:0}]],tx:[[0,10,'TEAM SCONE','スコーン派','pill',.15],[4,10,'whole-wheat scone\n+ white choc\n& cranberry 🥐','全粒粉スコーン\n＋ホワイトチョコ\nとクランベリー🥐','tag',.3,{s:.72,x:.36}]]}],sx:[[0,'swish'],[1.5,'boing'],[4,'ding']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['c_bronny_1',.33,.9,.44,'hop'],['c_pinco_4',.7,.9,.44,'hop']],fx:[['confetti',0,6,{n:30}]],tx:[[0,6,'verdict: one of each 🤝','結論：両方買う 🤝','big',.18]],sx:[[0,'cheer']]},
 {d:6,bg:'cafe',tr:'cut',a:[['c_pinco_5',.5,.9,.44,'bob']],tx:[[0,6,'📍 FLOTO (sister shop of Bien-Être)','📍 FLOTO（ビヤンネートルの姉妹店）','loc',.2],[.8,6,'near Sangubashi station · closed Wed & Thu','参宮橋駅の近く・水木定休','tag',.3]],sx:[[0,'ding']]}
]},
// s06 PHOTO DUMP (polaroids): Sigourney + Horn
{id:'sc06',cat:'food',also:['tokyo'],by:'kaise',song:'lofi',seed:2106,bpm:76,likes:151000,cm:6600,note:1,
 cap:['photo dump: 2 Uehara scones, 2 different vibes 📸 #sigourney #horn #scones','フォトダンプ：上原のスコーン2軒、ちがう雰囲気📸 #シガニー #ホルン #スコーン'],
 snd:['Polaroid Afternoon','ポラロイドの午後'],
 com:[['asmon','the underground café is a villain lair (compliment)','地下のカフェ、悪の基地っぽい（ほめてる）'],['pinco','clotted cream + jam = yes','クロテッドクリーム＋ジャム＝正義']],
 shots:[
 {d:5,bg:'#2b2320/#4a3a32',dots:0,a:[['kaise_2',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,5,'photo dump: Uehara scone day 📸','フォトダンプ：上原スコーンの日 📸','big',.17]],sx:[[0,'shutter']]},
 {d:9,bg:'#2b2320/#4a3a32',dots:0,tr:'cut',fx:[['polaroid',0,9,{back:1,s:.46,imgs:[['living',0,-8,.32,.36],['cafe',1.5,6,.68,.4],['kitchen',3,-3,.45,.6]]}]],a:[['p_sconecream',.84,.36,.1,'float',{sh:0,t:[3.5,9]}]],tx:[[0,9,'📍 Sigourney Bake & Coffee','📍 Sigourney Bake & Coffee','loc',.14],[1.5,4.5,'a big English scone with clotted cream & jam','大ぶりのイングリッシュスコーン＋クロテッドクリーム＆ジャム','tag',.72,{s:.9}],[4.5,9,'there’s even an English scone & salad lunch plate','スコーンとサラダのランチプレートもある','tag',.72,{s:.9}]],sx:[[0,'shutter'],[1.5,'shutter'],[3,'shutter']]},
 {d:9,bg:'#2b2320/#4a3a32',dots:0,tr:'cut',fx:[['polaroid',0,9,{back:1,s:.46,imgs:[['living',0,7,.34,.38],['cafe',1.5,-6,.66,.42],['kitchen',3,4,.5,.62]]}]],a:[['p_scone',.16,.36,.1,'float',{sh:0,t:[3.5,9]}]],tx:[[0,9,'📍 Horn (Uehara 1-chome)','📍 ホルン（上原1丁目）','loc',.14],[1.5,4.5,'scones + chocolate scones (on the menu last we checked)','スコーンとチョコスコーン（前回確認時のメニュー）','tag',.72,{s:.9}],[4.5,9,'café downstairs with light from a skylight','地下に天窓の光が入るカフェ','tag',.72,{s:.9}]],sx:[[0,'shutter'],[1.5,'shutter'],[3,'shutter']]},
 {d:6,bg:'#2b2320/#4a3a32',dots:0,tr:'zoom',a:[['kaise_3',.5,.9,.46,'hop']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'both a short walk from Yoyogi-Hachiman / Yoyogi-Uehara','どちらも代々木八幡・代々木上原から歩いてすぐ','tag',.2],[1.2,6,'bakes sell out — go early','焼き菓子は売り切れるので早めに','tag',.3]],sx:[[0,'chime']]}
]},
// l01 DAY-IN-THE-LIFE: lunch this week (jump cuts, REC)
{id:'lu01',cat:'food',also:['tokyo'],by:'pinco',song:'lofi',seed:2201,bpm:84,likes:221000,cm:11200,note:1,
 cap:['what I ate for lunch this week near Yoyogi Park 🍱 (5 real spots) #lunch #tomigaya #yoyogiuehara','代々木公園まわりで今週食べたランチ🍱（実在5軒） #ランチ #富ヶ谷 #代々木上原'],
 snd:['Lunch Diary','ランチ日記'],
 com:[['pooh','day 4 looks so good','4日目おいしそう'],['asmon','day 5. the mapo. respect.','5日目の麻婆、リスペクト。']],
 shots:[
 {d:4,bg:'x_ginkgo',a:[['w_pinco_2',.5,.9,.46,'bob',{in:'pop'}]],fx:[['rec',0,4]],tx:[[0,4,'what I ate for lunch this week 🍱','今週のランチ日記 🍱','big',.18]],sx:[[0,'shutter']]},
 {d:5,bg:LUBG,tr:'cut',pz:[0],a:[['p_curry',.5,.66,.2,'float',{sh:0}]],tx:[[0,5,'day 1 · Bistro to Sakaba TAKE (Tomigaya)','1日目・ビストロとサカバ TAKE（富ヶ谷）','pillk',.18,{s:.85}],[.8,5,'French-chef curry. weekday sets come with soup + a drink','フレンチシェフのカレー。平日セットはスープ＋ドリンク付き','tag',.3]],sx:[[0,'whoosh']]},
 {d:5,bg:LUBG,tr:'cut',pz:[0],a:[['p_salad',.35,.66,.16,'float',{sh:0}],['p_daikonrice',.68,.66,.15,'float',{sh:0}]],tx:[[0,5,'day 2 · Kinharu (Yoyogi-Uehara)','2日目・きんはる（代々木上原）','pillk',.18,{s:.85}],[.8,5,'every lunch comes with the salad bar','どのランチにもサラダバー付き','tag',.3]],sx:[[0,'whoosh']]},
 {d:5,bg:LUBG,tr:'cut',pz:[0],a:[['p_mamezara',.5,.66,.2,'float',{sh:0}]],tx:[[0,5,'day 3 · Koharu Biyori TOKYO (Tomigaya)','3日目・小春日和 TOKYO（富ヶ谷）','pillk',.18,{s:.85}],[.8,5,'a set of tiny side dishes, brown rice option','小皿がたくさんの定食、玄米も選べる','tag',.3]],sx:[[0,'whoosh']]},
 {d:5,bg:LUBG,tr:'cut',pz:[0],a:[['p_fishset',.5,.66,.2,'float',{sh:0}]],tx:[[0,5,'day 4 · Kabura (by Yoyogi-koen stn)','4日目・かぶら（代々木公園駅すぐ）','pillk',.18,{s:.85}],[.8,5,'fish set lunch that changes daily','日替わりの魚の定食','tag',.3]],sx:[[0,'whoosh']]},
 {d:5,bg:LUBG,tr:'cut',pz:[0],a:[['p_mapo',.5,.66,.18,'shake',{sh:0}]],fx:[['steam',0,5,{x:.5,y:.55,c:'#ffb0a0'}]],tx:[[0,5,'day 5 · Kakan Tomigaya','5日目・かかん 富ヶ谷店','pillk',.18,{s:.85}],[.8,5,'mapo tofu + lu rou fan 🌶️','麻婆豆腐＋魯肉飯 🌶️','tag',.3]],sx:[[0,'whoosh'],[1,'sizzle']]},
 {d:5,bg:'x_ginkgo',tr:'zoom',a:[['w_pinco_1',.5,.9,.46,'bob']],tx:[[0,5,'hours & closed days vary — check before you go 🙏','営業日・時間はお店によるので事前に確認を🙏','tag',.22]],sx:[[0,'chime']]}
]},
// l02 COUNTDOWN race: Main Mano 10-a-day lunch
{id:'lu02',cat:'food',also:['tokyo'],by:'pooh',song:'comedy',seed:2202,bpm:124,likes:176000,cm:8300,note:1,
 cap:['only 10 a day?! racing for the Main Mano lunch set 🥐🏃 #mainmano #yoyogiuehara #bakery','1日10食限定！？マンマーノのランチセットに全力ダッシュ🥐🏃 #マンマーノ #代々木上原 #パン'],
 snd:['Bread Dash','パン・ダッシュ'],
 com:[['bean','you can ask for more sweet or more savory 👀','おかわりは甘い系かおかず系か選べる👀'],['max','the terrace is dog-friendly 🐶','テラスは犬OK🐶']],
 shots:[
 {d:6,bg:'park',a:[['c_pooh_0',.5,.9,.46,'shake']],fx:[['count',0,6,{from:3}]],tx:[[0,6,'the lunch set is limited to 10 a day','ランチセットは1日10食限定','tag',.2]],sx:[[0,'tick'],[2,'tick'],[4,'tick']]},
 {d:6,bg:'park',tr:'whip',a:[['c_pooh_1',.3,.9,.44,'hop',{mv:[.75,.9],mvd:6}]],fx:[['speed',0,6]],tx:[[0,6,'POOH. IS. RUNNING. (floating?)','プー、全力疾走（浮遊？）','big',.2]],sx:[[0,'whoosh'],[3,'whoosh']]},
 {d:7,bg:'u_bakery',tr:'zoom',a:[['p_breadbasket',.5,.62,.18,'pulse',{sh:0}],['p_salad',.24,.74,.11,'float',{sh:0}],['p_soup',.76,.74,.11,'float',{sh:0}]],tx:[[0,7,'bread refills + salad + soup + a drink','パンおかわり＋サラダ＋スープ＋ドリンク','tag',.2],[2,7,'refills: choose sweet or savory','おかわりは甘い系か惣菜系を選べる','tag',.3]],sx:[[0,'ding'],[2,'ding']]},
 {d:6,bg:'u_bakery',tr:'cut',a:[['c_pooh_4',.5,.9,.46,'bob']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'made it. bread secured 🥐','間に合った。パン確保🥐','bub',.28,{x:.5,tx:.5,ty:.5,who:'pooh'}]],sx:[[0,'cheer']]},
 {d:6,bg:'u_bakery',tr:'cut',a:[['c_pooh_3',.5,.9,.46,'idle']],tx:[[0,6,'📍 Boulangerie & Café Main Mano','📍 ブーランジェリー＆カフェ マンマーノ','loc',.2],[.8,6,'Nishihara 3-chome · closed Tue & Wed · go early','西原3丁目・火水定休・早めに','tag',.3]],sx:[[0,'ding']]}
]},
// l03 SILENT-ish comedy: Kinharu salad bar, no arms
{id:'lu03',cat:'food',also:['tokyo','comedy'],by:'bean',song:'silent',seed:2203,bpm:126,likes:162000,cm:7000,look:'film',note:1,
 cap:['a pea pod with no arms vs. an all-you-can-eat salad bar 🥗🫛 (Kinharu, Yoyogi-Uehara) #saladbar #silentfilm','腕のないさやえんどう vs サラダバー🥗🫛（きんはる・代々木上原） #サラダバー #サイレント映画'],
 snd:['Salad Bar Rag','サラダバー・ラグ'],
 com:[['pooping','the daikon rice tho','大根飯よ'],['party','THE PLATE BALANCE 🎉','皿のバランス🎉']],
 shots:[
 {d:6,bg:'kitchen',a:[['c_bean_0',.5,.9,.44,'bob']],tx:[[0,6,'Chapter 1: The Salad Bar','第一章：サラダバー','serif',.2]],sx:[[0,'tick']]},
 {d:6,bg:'kitchen',tr:'cut',a:[['c_bean_3',.4,.9,.44,'wiggle'],['p_salad',.72,.86,.14,'idle']],tx:[[0,6,'Every lunch here comes with the salad bar.','ここのランチはすべてサラダバー付き。','serif',.2,{s:.85}]],sx:[[0,'boing']]},
 {d:6,bg:'kitchen',tr:'cut',a:[['c_bean_5',.5,.9,.44,'hop'],['p_salad',.5,.32,.12,'idle',{sh:0}]],fx:[['stars',0,6,{x:.5,y:.3}]],tx:[[0,6,'He has no arms. He has a head.','腕はない。頭はある。','serif',.2,{s:.85}]],sx:[[0,'ding'],[1,'laugh']]},
 {d:6,bg:LUBG,tr:'cut',a:[['p_daikonrice',.5,.66,.18,'float',{sh:0}]],tx:[[0,6,'The “Kinharu lunch”: daikon rice or white rice.','「きんはるランチ」は大根飯か白飯。','serif',.2,{s:.85}]],sx:[[0,'chime']]},
 {d:6,bg:'kitchen',tr:'zoom',a:[['c_bean_1',.5,.9,.44,'bob']],tx:[[0,6,'📍 Kinharu · Yoyogi-Uehara · closed Wednesdays','📍 きんはる・代々木上原・水曜定休','loc',.2,{s:.85}]],sx:[[0,'ding']]}
]},
// l04 ANIME: TAKE French curry, Bronny pre-game
{id:'lu04',cat:'food',also:['tokyo'],by:'bronny',song:'anime',seed:2204,bpm:158,likes:149000,cm:5900,look:'anime',note:1,
 cap:['pre-game power-up: French-chef curry in Tomigaya 🍛⚡ #take #frenchcurry #tomigaya','試合前パワーアップ：富ヶ谷のフレンチシェフカレー🍛⚡ #TAKE #フレンチカレー'],
 snd:['CURRY POWER (TV size)','カレーパワー（TVサイズ）'],
 com:[['pooh','6 kinds?? I will try all 6','6種類？全部食べる'],['bean','the veggies on top 😍','上の野菜😍']],
 shots:[
 {d:8,bg:'stage',a:[['c_bronny_0',.5,.9,.5,'bob',{in:'b'}]],fx:[['lines',0,8]],tx:[[0,8,'PRE-GAME POWER-UP!','試合前パワーアップ！','manga',.18,{rot:-5}]],sx:[[0,'riser']]},
 {d:8,bg:LUBG,tr:'spin',a:[['p_curry',.5,.66,.24,'spin',{sh:0,turns:1}]],fx:[['rays',0,8],['speed',0,8]],tx:[[0,8,'FRENCH CURRY!!','フレンチカレー！！','manga',.18,{rot:4}],[3,8,'6 kinds on the menu','カレーは6種類','tag',.36]],sx:[[0,'drop'],[3,'ding']]},
 {d:8,bg:'stage',tr:'whip',a:[['c_bronny_2',.5,.9,.5,'hop']],fx:[['impact',0,3,{x:.5,y:.3,t:'POWER'}],['sparkle',0,8]],tx:[[3,8,'weekday lunch sets: soup + drink included','平日ランチセット：スープ＋ドリンク付き','tag',.4]],sx:[[0,'thud'],[3,'ding']]},
 {d:8,bg:'stage',tr:'zoom',a:[['c_bronny_5',.5,.9,.5,'bob']],tx:[[0,8,'📍 Bistro to Sakaba TAKE','📍 ビストロとサカバ TAKE','loc',.2],[1,8,'Tomigaya 1-chome · lunch served every day','富ヶ谷1丁目・ランチは毎日','tag',.3]],sx:[[0,'ding']]}
]},
// l05 COUNTING tiny plates (cap captions): Koharu Biyori
{id:'lu05',cat:'food',also:['tokyo'],by:'kaise',song:'sweet',seed:2205,bpm:94,likes:118000,cm:4300,note:1,
 cap:['counting tiny plates at lunch 🍱 (I lost count) #koharubiyori #tomigaya #teishoku','ランチの小皿を数えてみた🍱（途中で迷子） #小春日和 #富ヶ谷 #定食'],
 snd:['Tiny Plates Waltz','小皿のワルツ'],
 com:[['asmon','I would have counted correctly.','俺なら正しく数えた。'],['prof','Many small dishes: excellent variety.','小皿が多い＝バランス良し。']],
 shots:[
 {d:5,bg:'kitchen',a:[['kaise_1',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,5,'let’s count the tiny plates at lunch 🍱','ランチの小皿、数えてみよう 🍱','cap',.2]],sx:[[0,'pop']]},
 {d:8,bg:LUBG,tr:'cut',cam:[1.1,1.3,.5,.5,.55,.55],a:[['p_mamezara',.5,.66,.26,'idle',{sh:0}]],tx:[[0,8,'one… two… three… four… five… six…','いち…に…さん…よん…ご…ろく…','cap',.22,{wps:1.6}]],sx:[[0,'tick'],[1,'tick'],[2,'tick'],[3,'tick'],[4,'tick'],[5,'tick']]},
 {d:5,bg:'kitchen',tr:'cut',a:[['kaise_4',.5,.9,.46,'tremble']],fx:[['sweat',0,5,{x:.45,y:.45}]],tx:[[0,5,'…I lost count. it’s a LOT of plates.','…わからなくなった。とにかく多い。','cap',.22]],sx:[[0,'crickets']]},
 {d:6,bg:'kitchen',tr:'zoom',a:[['kaise_3',.5,.9,.46,'hop']],tx:[[0,6,'📍 Koharu Biyori TOKYO (Tomigaya)','📍 小春日和 TOKYO（富ヶ谷）','loc',.2],[.8,6,'small-plate set lunch, brown rice option · closed Mondays','小皿の定食・玄米も選べる・月曜定休','tag',.3]],sx:[[0,'ding']]}
]},
// l06 GREEN-SCREEN commentary: Asmon reacts to the mapo
{id:'lu06',cat:'food',also:['tokyo'],by:'asmon',song:'villain',seed:2206,bpm:138,likes:137000,cm:6200,note:1,
 cap:['green-screen review: an ex-villain vs. Tomigaya mapo tofu 🌶️ #mapotofu #kakan #tomigaya','グリーンバックで解説：元悪役 vs 富ヶ谷の麻婆豆腐🌶️ #麻婆豆腐 #かかん'],
 snd:['Spicy Overture','スパイシー序曲'],
 com:[['kaise','his face at 0:09 😭','0:09の顔😭'],['bean','I can’t do spicy. no tongue either.','辛いのムリ。舌もない。']],
 shots:[
 {d:8,bg:'#0f3d22/#1d6b3a',dots:0,fx:[['card',0,8,{back:1,img:'kitchen',y:.13,h:.36}]],a:[['p_mapo',.5,.42,.13,'pulse',{sh:0,mid:1}],['c_asmon_0',.28,.95,.44,'talk']],tx:[[0,8,'mapo tofu + lu rou fan at Kakan 🌶️','かかんの麻婆豆腐＋魯肉飯 🌶️','pillk',.53,{x:.62,s:.85}]],sx:[[0,'pop']]},
 {d:8,bg:'#0f3d22/#1d6b3a',dots:0,tr:'cut',fx:[['card',0,8,{back:1,img:'kitchen',y:.13,h:.36}],['smoke',2,8,{x:.3,y:.6}]],a:[['p_mapo',.5,.42,.13,'shake',{sh:0,mid:1}],['c_asmon_3',.28,.95,.44,'shake']],tx:[[0,8,'“I fear nothing.” (the mapo:)','「俺は何も恐れない」（麻婆：）','pillk',.53,{x:.62,s:.85}]],shake:[2,8,.01],sx:[[0,'evil'],[2,'sizzle']]},
 {d:8,bg:'#0f3d22/#1d6b3a',dots:0,tr:'cut',fx:[['card',0,8,{back:1,img:'kitchen',y:.13,h:.36}]],a:[['p_mapo',.5,.42,.13,'idle',{sh:0,mid:1}],['c_asmon_1',.28,.95,.44,'hop']],tx:[[0,8,'…okay that was incredible.','…いや、最高だった。','pillk',.53,{x:.62,s:.85}],[2,8,'📍 Kakan Tomigaya','📍 かかん 富ヶ谷店','loc',.6,{x:.62,s:.8}]],sx:[[0,'cheer']]}
]}
);
