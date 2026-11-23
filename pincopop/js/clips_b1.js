'use strict';
// v1.5.1 batch: Baby Bean + Parenting + local Tokyo/LA. Facts checked 2026-11-24 (JST) on official pages:
// 青の洞窟 SHIBUYA (shibuya-aonodokutsu.jp), ふるさと東京応援祭 in SHIBUYA Christmas (furusatotokyofes.com),
// INSPIRE TOKYO 2026 WINTER (j-wave.co.jp/special/inspiretokyo), 365日 (ultrakitchen.jp/brands), FUGLEN TOKYO (fuglencoffee.jp),
// Meiji Jingu (meijijingu.or.jp), Shibuya City 2025 countdown notice (city.shibuya.tokyo.jp), The Grove (thegrovela.com). No prices, no ratings.
window.CLIPS=window.CLIPS||[];
const B1N='#0a1a4a/#1d3d8a',B1W='#fff7ee/#ffe6d6',B1S='#eef6ff/#dcecff';
CLIPS.push(
// bb09 NIGHT VLOG: Ao no Dokutsu SHIBUYA
{id:'bb09',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'xmas',seed:5101,bpm:90,likes:296000,cm:13100,look:'night',note:1,
 cap:['Baby Bean vs. 500,000 blue lights 💙🫛 Ao no Dokutsu SHIBUYA, Dec 11–27 #aonodokutsu #babybean #shibuya','ベビービーン vs 約50万球の青い光💙🫛 青の洞窟 SHIBUYA 12/11〜27 #青の洞窟 #ベビービーン #渋谷'],
 snd:['Blue Cave Lullaby','青の洞窟の子守歌'],
 com:[['pinco','his little face in the blue light 😭💙','青い光の中の小さな顔😭💙'],['pooh','I would also stare like that','ぼくもそうやって見つめる']],
 shots:[
 {d:5,bg:'x_blue',cam:[1.15,1.05,.5,.5,.45,.45],a:[['pooping_parent_0',.5,.9,.46,'bob',{in:'pop'}]],fx:[['rec',0,5],['bokeh',0,5,{cols:['#3b7bff','#9fd0ff']}]],tx:[[0,5,'taking Baby Bean to the blue cave 💙','ベビービーンを青の洞窟へ 💙','big',.27]],sx:[[0,'shutter']]},
 {d:6,bg:'x_blue',tr:'cut',cam:[1.3,1.3,.5,.55,.5,.5],a:[['bbean_0',.5,.84,.3,'idle']],fx:[['sparkle',0,6,{x:.5,y:.4,r:.25}]],tx:[[0,6,'about 500,000 blue lights from Koen-dori to the Yoyogi Park zelkova trees','公園通りから代々木公園ケヤキ並木まで約50万球','type',.22,{cps:26}]],sx:[[0,'type']]},
 {d:6,bg:'x_blue',tr:'cut',a:[['pooping_parent_1',.5,.9,.44,'talk']],tx:[[0,6,'Dec 11–27 · 17:00–22:00 · new this year: a Christmas-tree screen, “THE BLUE TREE”','12/11〜27・17:00〜22:00・今年は大型サイネージ「THE BLUE TREE」','type',.22,{cps:28}]],sx:[[0,'type']]},
 {d:5,bg:'x_blue',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,5,{x:.76,y:.5}],['snow',0,5,{n:20}]],tx:[[0,5,'…asleep before the second tree 😴💙','…2本目の木で寝た 😴💙','cap',.22,{wps:3}]],sx:[[0,'aww']]}
]},
// bb10 POV STROLLER: Furusato Tokyo Ouensai in SHIBUYA Christmas (Yoyogi Park)
{id:'bb10',cat:'parent',also:['tokyo'],bb:1,by:'pooh',song:'lofi',seed:5102,bpm:84,likes:244000,cm:9700,note:1,
 cap:['POV: Uncle Pooh takes Baby Bean to the Christmas market in Yoyogi Park 🎄🫛 #yoyogipark #christmasmarket #babybean','POV：プーおじさんとベビービーン、代々木公園のクリスマスへ🎄🫛 #代々木公園 #ベビービーン'],
 snd:['Market Stroll','マーケットさんぽ'],
 com:[['pooping','thank you for babysitting (where are the snacks)','子守ありがとう（おやつどこ）'],['bean','he gets that face from me','あの顔はぼく似']],
 shots:[
 {d:5,bg:'x_market',cam:[1.1,1.02,.5,.5,.5,.55],a:[['c_pooh_0',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'hop']],tx:[[0,5,'POV: Uncle Pooh is babysitting 🎄','POV：今日はプーおじさんが子守 🎄','big',.2]],sx:[[0,'bells']]},
 {d:6,bg:B1W,dots:0,tr:'whip',a:[['p_cocoa',.5,.66,.16,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.56}]],tx:[[0,6,'📍 Furusato Tokyo Ouensai in SHIBUYA Christmas','📍 ふるさと東京応援祭 in SHIBUYA Christmas','loc',.22,{x:.5,s:.85}],[1,6,'Yoyogi Park event square + outdoor stage · free entry','代々木公園イベント広場・野外ステージ・入場無料','tag',.34]],sx:[[0,'whoosh']]},
 {d:6,bg:B1W,dots:0,tr:'whip',a:[['p_calendar',.5,.66,.15,'float',{sh:0}]],tx:[[0,6,'Part 1: Dec 11–20 · Part 2: Dec 23–27','1部：12/11〜20・2部：12/23〜27','tag',.24],[1.5,6,'planned: weekdays 16–22, weekends 11–22','予定：平日16〜22時・土日11〜22時','tag',.34]],sx:[[0,'ding']]},
 {d:5,bg:'x_market',tr:'zoom',a:[['c_pooh_2',.38,.9,.44,'shake'],['bbean_1',.74,.84,.24,'hop']],fx:[['hearts',0,5,{x:.7,y:.55,n:6}]],tx:[[0,5,'he loved the lights. I loved the food.','彼は光が好き。ぼくは食べ物が好き。','cap',.22,{wps:3}]],sx:[[0,'giggle']]}
]},
// bb11 VHS: 365日 bakery run (Tomigaya)
{id:'bb11',cat:'parent',also:['tokyo','food'],bb:1,by:'pooping',song:'synth',seed:5103,bpm:96,likes:212000,cm:8100,look:'vhs',vhsDate:'SAT.NOV.28 2026',note:1,
 cap:['Saturday bakery walk with Baby Bean 🥐🫛 365日 in Tomigaya opens at 7 #tomigaya #365nichi #babybean','ベビービーンと土曜のパン屋さんぽ🥐🫛 富ヶ谷の365日は朝7時から #富ヶ谷 #365日'],
 snd:['Morning Crust Tape','朝のパン耳テープ'],
 com:[['pinco','dad ate it on the walk home didn’t he','パパ帰り道で食べたでしょ'],['pooh','7 am is my kind of time','朝7時はぼくの時間']],
 shots:[
 {d:5,bg:'u_morning',a:[['pooping_parent_0',.5,.9,.46,'bob']],tx:[[0,5,'SATURDAY BAKERY WALK','土曜のパン屋さんぽ','retro',.27]],sx:[[0,'tape']]},
 {d:6,bg:'u_bakery',tr:'glitch',a:[['bbean_0',.5,.84,.3,'idle']],tx:[[0,6,'📍 365日 · Tomigaya 1-2-8','📍 365日・富ヶ谷1-2-8','retro',.27,{s:.85}],[2.5,6,'right by Yoyogi-Hachiman Station','代々木八幡駅のすぐそば','retro',.4,{s:.85}]],sx:[[0,'scratch']]},
 {d:6,bg:'u_bakery',tr:'glitch',a:[['pooping_parent_1',.5,.9,.44,'talk']],tx:[[0,6,'open 7:00–19:00','営業 7:00〜19:00','retro',.27,{s:.85}],[2.5,6,'bread made with Japanese wheat','国産小麦のパン','retro',.4,{s:.85}]],sx:[[0,'tape']]},
 {d:5,bg:'u_morning',tr:'glitch',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_1',.72,.84,.24,'hop']],tx:[[0,5,'(the bread was for dad. the walk was for him.)','（パンはパパ用。散歩はこの子用。）','retro',.27,{s:.8}]],sx:[[0,'aww']]}
]},
// bb12 TYPEWRITER DAY: Fuglen Tokyo morning
{id:'bb12',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'lofi',seed:5104,bpm:80,likes:198000,cm:6900,note:1,
 cap:['7 am dad coffee run with a sleepy pea ☕🫛 FUGLEN TOKYO, Tomigaya #fuglen #tomigaya #dadlife','朝7時、眠いさやえんどうとパパのコーヒー☕🫛 FUGLEN TOKYO（富ヶ谷） #フグレン #富ヶ谷'],
 snd:['Brown Cheese Morning','ブラウンチーズの朝'],
 com:[['asmon','open till 1 am on Wednesdays?? noted','水曜は深夜1時まで？メモした'],['pinco','the stroller nap 😭','ベビーカーで寝てる😭']],
 shots:[
 {d:5,bg:'cafe',a:[['pooping_parent_0',.5,.9,.46,'bob']],tx:[[0,5,'7:00 a.m. — dad needs coffee ☕','朝7:00 — パパはコーヒーが必要 ☕','type',.2,{cps:22}]],sx:[[0,'type']]},
 {d:6,bg:B1W,dots:0,tr:'slide',a:[['p_mug',.5,.64,.16,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.54}]],tx:[[0,6,'📍 FUGLEN TOKYO · Tomigaya 1-16-11','📍 FUGLEN TOKYO・富ヶ谷1-16-11','type',.22,{cps:24}],[2.6,6,'coffee from 7 am every day','毎日朝7時からコーヒー','type',.34,{cps:24}]],sx:[[0,'type']]},
 {d:6,bg:B1W,dots:0,tr:'slide',tx:[[0,6,'Mon–Tue 7:00–23:00 · Wed–Sun & holidays 7:00–1:00','月・火 7:00〜23:00・水〜日・祝 7:00〜翌1:00','type',.24,{cps:26}],[3,6,'(Norwegian brown cheese is on the menu)','（ノルウェーのブラウンチーズもある）','type',.38,{cps:26}]],sx:[[0,'type']]},
 {d:5,bg:'x_yoyogi',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,5,{x:.76,y:.5}]],tx:[[0,5,'7:40 a.m. — one of us is awake 😴','朝7:40 — 起きてるのは1人だけ 😴','type',.2,{cps:22}]],sx:[[0,'yawn']]}
]},
// bb13 ANIME: first New Year at Meiji Jingu (plan)
{id:'bb13',cat:'parent',also:['tokyo'],bb:1,by:'pinco',song:'anime',seed:5105,bpm:150,likes:231000,cm:9900,look:'anime',note:1,
 cap:['EPISODE 1: Baby Bean’s first New Year (the plan) ⛩️🫛 Meiji Jingu #hatsumode #meijijingu #babybean','第1話：ベビービーンはじめてのお正月（計画編）⛩️🫛 明治神宮 #初詣 #ベビービーン'],
 snd:['New Year Henshin','お正月変身'],
 com:[['prof','Hours quoted from the official site. Please re-check in December.','時間は公式サイトより。12月に再確認を。'],['pooping','we are going in the afternoon. with snacks.','うちは午後に行く。おやつ持って。']],
 shots:[
 {d:7,bg:'x_shrine',cam:[1.2,1,.5,.5,.4,.5],a:[['bbean_0',.5,.84,.34,'hop',{in:'b'}]],fx:[['lines',0,7],['speed',0,7]],tx:[[0,7,'EPISODE 1','第1話','manga',.18,{rot:-6}],[2,7,'Baby Bean’s First New Year','ベビービーン、はじめてのお正月','big',.3]],sx:[[0,'riser'],[2,'drop']]},
 {d:7,bg:'x_shrine',tr:'spin',a:[['c_pinco_1',.5,.9,.44,'dance']],fx:[['sparkle',0,7,{x:.5,y:.35,r:.35}]],tx:[[0,7,'Meiji Jingu opens\nwith the sunrise!!','明治神宮は\n日の出とともに開門！！','manga',.2,{rot:3,s:.78}],[2,7,'December gates: 6:40–16:00','12月の開門：6:40〜16:00','tag',.33]],sx:[[0,'whoosh']]},
 {d:7,bg:'x_shrine',tr:'whip',a:[['c_pinco_4',.3,.9,.42,'hop'],['bbean_1',.72,.84,.26,'hop']],fx:[['lines',0,7,{c:'#ffe0a0'}]],tx:[[0,7,'last New Year:\nopen all night!','前回のお正月は\n夜通し参拝OK！','manga',.2,{rot:-3,s:.75}],[2,7,'(Dec 31 → Jan 1) · expect big crowds around midnight','（大晦日〜元日）年越し前後はとても混雑','tag',.34]],sx:[[0,'drop'],[2,'ding']]},
 {d:6,bg:'x_shrine',tr:'zoom',a:[['bbean_2',.5,.84,.32,'bob']],fx:[['rays',0,6,{c:'#fff2b0'}]],tx:[[0,6,'our baby plan:\na calm daytime visit 😴','うちは赤ちゃんと\n昼間にのんびり 😴','manga',.2,{rot:-3,s:.78}],[2,6,'2027 hours: check the official page in December','2027年の時間は12月に公式で確認','tag',.33]],sx:[[0,'chime']]}
]},
// bb14 SPLIT: LA Baby Bean meets The Grove snowfall
{id:'bb14',cat:'parent',also:['la'],bb:1,by:'bronny',song:'comedy',seed:5106,bpm:112,likes:254000,cm:10800,note:1,
 cap:['Baby Bean’s first “snow” was in LA ❄️🌴 The Grove snowfall, every evening at 6 & 8 pm #thegrove #babybean #LA','ベビービーン、人生初の「雪」はLA❄️🌴 ザ・グローブの人工雪は毎晩18時と20時 #ベビービーン'],
 snd:['Palm Tree Snow Day','ヤシの木と雪の日'],
 com:[['pooh','snow in LA is a lie I believe in','LAの雪、信じてる'],['pinco','the bonnet snowflake 😭','ボンネットに雪😭']],
 shots:[
 {d:5,bg:'la_lights',a:[['c_bronny_1',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'hop']],tx:[[0,5,'Uncle Bronny says it snows in LA 🌴❄️','ブロニーおじさん「LAにも雪降るよ」🌴❄️','big',.2]],sx:[[0,'pop']]},
 {d:10,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:'la_lights',a:[['bbean_0',.5,.82,.34,'idle']],fx:[['snow',0,10,{n:40}],['sparkle',0,10]],tx:[[0,10,'EXPECTATION','理想','pill',.15]]},{r:[.5,0,.5,1],bg:'la_lights',a:[['bbean_2',.5,.84,.34,'tremble']],fx:[['snow',0,10,{n:60}]],tx:[[0,10,'REALITY','現実','pill',.15],[3,10,'one flake.\non the bonnet.\noffended.','雪ひとつ。\nボンネットに。\nご立腹。','tag',.3,{x:.5,s:.85}]]}],sx:[[0,'swish'],[3,'boing']]},
 {d:6,bg:'la_lights',tr:'cut',a:[['c_bronny_3',.5,.9,.44,'talk']],tx:[[0,6,'📍 The Grove, LA · snowfall every evening at 6 pm + 8 pm','📍 ザ・グローブ（LA）・毎晩18時と20時に人工雪','tag',.22],[1.5,6,'it started Nov 17 this season','今シーズンは11/17から','tag',.32]],sx:[[0,'ding']]},
 {d:5,bg:'la_lights',tr:'zoom',a:[['c_bronny_4',.35,.9,.42,'hop'],['bbean_1',.74,.84,.24,'hop']],fx:[['snow',0,5,{n:40}],['confetti',0,5]],tx:[[0,5,'8 pm round: a giggle ❄️🫛','20時の回：笑った ❄️🫛','big',.22]],sx:[[0,'giggle']]}
]},
// pa03 CHECKLIST: INSPIRE TOKYO family day
{id:'pa03',cat:'parent',also:['tokyo'],by:'pooping',song:'parent',seed:5107,bpm:100,likes:156000,cm:5300,note:1,
 cap:['free music + market weekend in Yoyogi Park: family packing list 🎶🧺 INSPIRE TOKYO 2026 WINTER, Dec 4–6 #yoyogipark #inspiretokyo','代々木公園で無料の音楽＆マーケット：家族の持ち物リスト🎶🧺 INSPIRE TOKYO 2026 WINTER 12/4〜6 #代々木公園'],
 snd:['Market Day Checklist','マーケットの日チェックリスト'],
 com:[['max','I will carry the snacks 🐶','おやつは私が運ぶ🐶'],['prof','Hall shows at LINE CUBE are ticketed separately.','LINE CUBEの公演は別料金です。']],
 shots:[
 {d:5,bg:'park',a:[['pooping_parent_2',.5,.9,.46,'bob']],tx:[[0,5,'family day: INSPIRE TOKYO 2026 WINTER 🎶','家族でINSPIRE TOKYO 2026 WINTER 🎶','big',.18]],sx:[[0,'bells']]},
 {d:6,bg:B1S,dots:0,tr:'whip',a:[['p_calendar',.5,.64,.14,'float',{sh:0}]],tx:[[0,6,'📍 Yoyogi Park event square · free entry','📍 代々木公園イベント広場・入場無料','pill',.22],[1.4,6,'Fri Dec 4 15:00–21:00 · Sat–Sun Dec 5–6 11:00–21:00','12/4(金)15〜21時・12/5〜6(土日)11〜21時','tag',.33]],sx:[[0,'ding']]},
 {d:5,bg:B1S,dots:0,tr:'whip',a:[['p_mittens',.5,.64,.14,'float',{sh:0}]],tx:[[0,5,'☑ layers (it gets cold after sunset)','☑ 重ね着（日が沈むと冷える）','pill',.22]],sx:[[0,'ding']]},
 {d:5,bg:B1S,dots:0,tr:'whip',a:[['p_onesie',.5,.64,.14,'float',{sh:0}]],tx:[[0,5,'☑ ear protection for little ones near the stage','☑ ステージ近くは子どもの耳を守るものを','pill',.22,{s:.9}]],sx:[[0,'ding']]},
 {d:5,bg:'park',tr:'zoom',a:[['pooping_parent_0',.4,.9,.44,'bob'],['babies_0',.78,.9,.2,'hop']],fx:[['notes',0,5]],tx:[[0,5,'free live sets on Dec 5 + 6 🎶','12/5・6は観覧無料のフリーライブ 🎶','tag',.22]],sx:[[0,'cheer']]}
]},
// pa04 PSA: Shibuya NYE with kids
{id:'pa04',cat:'parent',also:['tokyo'],by:'prof',song:'lofi',seed:5108,bpm:84,likes:171000,cm:7600,note:1,
 cap:['New Year’s Eve in Shibuya with kids? read this first 🧪 #shibuya #newyearseve #parenting','子連れで渋谷の年越し？先にこれを読んで🧪 #渋谷 #年越し #子育て'],
 snd:['Calm Countdown','おだやかカウントダウン'],
 com:[['pooping','home countdown + shrine in the morning. done.','家でカウントダウン＋朝に神社。決定。'],['pinco','thank you professor 🙏','教授ありがとう🙏']],
 shots:[
 {d:5,bg:'#1d1430/#3a2350',dots:0,a:[['c_prof_0',.5,.9,.46,'talk']],tx:[[0,5,'Shibuya on Dec 31 with kids? 🧪','子連れで12/31の渋谷？🧪','big',.2]],sx:[[0,'pop']]},
 {d:7,bg:'#1d1430/#3a2350',dots:0,tr:'cut',a:[['c_prof_1',.5,.9,.44,'talk']],tx:[[0,7,'fact: last year (2025) the official Shibuya countdown event was canceled for safety','事実：昨年（2025年）渋谷駅前の公式カウントダウンは安全のため中止','cap',.22,{wps:3}]],sx:[[0,'ding']]},
 {d:6,bg:'#1d1430/#3a2350',dots:0,tr:'cut',a:[['c_prof_2',.5,.9,.44,'idle']],tx:[[0,6,'as of Nov 24, no official 2026 event is announced','11/24時点で、2026年の公式開催は発表なし','cap',.22,{wps:3}]],sx:[[0,'ding']]},
 {d:6,bg:'living',tr:'zoom',a:[['pooping_parent_0',.38,.9,.44,'bob'],['bbean_1',.74,.84,.24,'hop']],fx:[['confetti',0,6],['stars',0,6]],tx:[[0,6,'our plan: countdown at home 🎉 shrine visit in the daytime','うちの計画：家でカウントダウン🎉 お参りは昼間に','cap',.22,{wps:3}]],sx:[[0,'cheer']]}
]},
// pa05 SILENT FILM: Max babysits Baby Pinco
{id:'pa05',cat:'parent',also:['comedy'],by:'max',song:'silent',seed:5109,bpm:132,likes:183000,cm:6600,look:'film',bw:1,
 cap:['a silent film: “The Babysitter” starring Max 🎞️🐶 #babysitting #silentfilm','サイレント映画「ベビーシッター」主演マックス🎞️🐶 #子守'],
 snd:['Ragtime Nap Time','ラグタイム・お昼寝'],
 com:[['pinco','she has never slept that fast for me','私の時はあんなに早く寝ない'],['pooh','the bow 😭','おじぎ😭']],
 shots:[
 {d:5,bg:'#111/#222',dots:0,tx:[[0,5,'“THE BABYSITTER”\na drama in 3 acts','「ベビーシッター」\n三幕のドラマ','serif',.4]],sx:[[0,'tick']]},
 {d:7,bg:'nursery',tr:'cut',a:[['c_max_0',.35,.9,.44,'bob'],['babies_0',.75,.86,.24,'hop']],tx:[[0,7,'Act I. The baby will not nap.','第一幕：赤ちゃん、昼寝しない。','serif',.2,{s:.85}]],sx:[[0,'boing']]},
 {d:7,bg:'nursery',tr:'cut',a:[['c_max_3',.35,.9,.44,'wiggle'],['babies_0',.75,.86,.24,'bob']],fx:[['notes',0,7]],tx:[[0,7,'Act II. A lullaby. Mostly barking.','第二幕：子守歌。ほぼワン。','serif',.2,{s:.85}]],sx:[[0,'wiggle']]},
 {d:6,bg:'bedtime',tr:'cut',a:[['c_max_5',.35,.9,.44,'idle'],['babies_0',.75,.86,.24,'idle']],fx:[['zzz',0,6,{x:.78,y:.55}]],tx:[[0,6,'Act III. Both asleep.\nTHE END','第三幕：ふたりとも寝た。\n完','serif',.2,{s:.85}]],sx:[[0,'snore']]}
]},
// pa06 TIER LIST: rainy-day indoor play (no places)
{id:'pa06',cat:'parent',by:'pinco',song:'comedy',seed:5110,bpm:112,likes:162000,cm:7400,
 cap:['rainy-day indoor play ideas, ranked by how long they lasted ☔🧸 #parenting #rainyday','雨の日のおうち遊び、続いた時間で格付け☔🧸 #子育て #雨の日'],
 snd:['Rainy Tier Time','雨の日格付け'],
 com:[['pooping','the box > every toy we own','箱 ＞ うちの全おもちゃ'],['bean','I am also entertained by boxes','ぼくも箱で遊べる']],
 shots:[
 {d:4,bg:'living',a:[['c_pinco_5',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,4,'rainy-day play tier list ☔','雨の日遊び格付け ☔','big',.2],[1,4,'(ranked by minutes of peace)','（静かだった時間で格付け）','tag',.3]],sx:[[0,'pop']]},
 {d:12,bg:'#1d1430/#3a2350',dots:0,tr:'whip',fx:[['tier',0,12,{rows:[['S','S'],['A','A'],['B','B'],['C','C']],y:.22,rh:.11,items:[['p_gift',0,.6],['p_rattle',2,2],['p_duck',1,3.4],['p_mamezara',3,4.8],['p_bag',0,6.2]]}]],tx:[[.6,2,'an empty box','空き箱','tag',.72],[2,3.4,'the rattle (2 minutes)','ガラガラ（2分）','tag',.72],[3.4,4.8,'bath duck in a bowl of water','水を張ったボウルとアヒル','tag',.72],[4.8,6.2,'“helping” cook','料理の「お手伝い」','tag',.72],[6.2,8,'a paper bag fort','紙袋の秘密基地','tag',.72],[8,12,'always stay close during play 💗','遊ぶときは必ずそばで見守ってね 💗','tag',.72]],sx:[[.6,'pop'],[2,'pop'],[3.4,'pop'],[4.8,'pop'],[6.2,'pop']]}
]}
);
