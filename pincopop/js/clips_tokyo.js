'use strict';
// TOKYO tab (v1.3): influencer-style clips about Christmas & holiday events running in Tokyo in late Nov–Dec 2026,
// plus local Yoyogi Park content. Every date/place below was checked against the official pages on 2026-11-23 (JST).
// No prices. Each clip shows the "check the official site" note (clip.note).
window.CLIPS=window.CLIPS||[];
const XBG='#0d1b3d/#3b1d5e',GBG='#2a1a08/#6b4a12';
CLIPS.push(
// x01 COUNTDOWN top 5 (glow look)
{id:'x01',cat:'tokyo',by:'pinco',song:'xmas',seed:2001,bpm:108,likes:212000,cm:9100,look:'glow',note:1,
 cap:['5 Tokyo Christmas light-ups to do THIS week 🎄✨ save for later! #tokyochristmas #illumination','今週行きたい東京クリスマスイルミ5選🎄✨ 保存してね！ #東京クリスマス #イルミネーション'],
 snd:['Five Lights Countdown','5つの光カウントダウン'],
 com:[['kaise','#1 is our date this Friday 💙','1位、金曜のデートで行く💙'],['prof','All dates match the official pages. Approved.','日程は公式どおり。承認。']],
 shots:[
 {d:5,bg:'x_keyaki',cam:[1.1,1.02,.5,.5,.45,.5],a:[['w_pinco_0',.5,.9,.46,'bob',{in:'pop'}]],fx:[['snow',0,5,{n:50}]],tx:[[0,5,'5 Tokyo light-ups to do THIS week 🎄','今週行きたい東京イルミ5選 🎄','big',.17]],sx:[[0,'bells']]},
 {d:6,bg:'x_gold',tr:'whip',cam:[1,1.08,.5,.5,.4,.45],a:[['w_pinco_2',.72,.9,.4,'idle']],fx:[['bokeh',0,6,{cols:['#ffd88a','#fff1c4']}]],tx:[[0,6,'5','5','num',.2,{x:.25}],[.4,6,'📍 Marunouchi Illumination','📍 丸の内イルミネーション','loc',.36,{x:.42}],[1.2,6,'champagne-gold trees, about 1.2 km · until Feb 14','シャンパンゴールドの並木 約1.2km・2/14まで','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:6,bg:'x_market',tr:'whip',cam:[1,1.08,.5,.5,.5,.55],a:[['w_gang_0',.7,.9,.38,'bob']],fx:[['snow',0,6,{n:40}]],tx:[[0,6,'4','4','num',.2,{x:.25}],[.4,6,'📍 Tokyo Christmas Market · Shin-Toyosu','📍 東京クリスマスマーケット・新豊洲','loc',.36,{x:.45}],[1.2,6,'first time by the bay! until Dec 25','初の湾岸開催！12/25まで','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:6,bg:'x_chand',tr:'whip',cam:[1.05,1.15,.5,.5,.45,.45],a:[['w_couple_1',.75,.9,.38,'idle']],fx:[['sparkle',0,6,{x:.47,y:.42,r:.15}]],tx:[[0,6,'3','3','num',.2,{x:.25}],[.4,6,'📍 Ebisu Garden Place','📍 恵比寿ガーデンプレイス','loc',.36,{x:.42}],[1.2,6,'a ~5 m crystal chandelier · until Jan 11','高さ約5mのシャンデリア・1/11まで','tag',.46]],sx:[[0,'whoosh'],[.4,'pop'],[1,'sparkle']]},
 {d:6,bg:'x_lawn',tr:'whip',a:[['w_pinco_1',.72,.9,.38,'idle']],fx:[['bubbles',0,6,{x:.5,y:.7}]],tx:[[0,6,'2','2','num',.2,{x:.25}],[.4,6,'📍 Tokyo Midtown · MIDWINTER LIGHTS','📍 東京ミッドタウン・MIDWINTER LIGHTS','loc',.36,{x:.45}],[1.2,6,'starts Thu Nov 26 · bubble show until Dec 20','11/26(木)スタート・シャボン玉演出は12/20まで','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:7,bg:'x_keyaki',tr:'zoom',cam:[1,1.1,.5,.5,.5,.45],a:[['w_pinco_0',.32,.9,.4,'hop'],['w_couple_0',.72,.9,.42,'idle']],fx:[['snow',0,7,{n:60}],['sparkle',0,7,{x:.5,y:.3,r:.3}]],tx:[[0,7,'1','1','num',.2,{x:.25}],[.4,7,'📍 Roppongi Hills Keyakizaka','📍 六本木ヒルズ けやき坂','loc',.36,{x:.45}],[1.2,7,'“SNOW & BLUE” · 17:00–22:00 · until Dec 25','「SNOW＆BLUE」17:00〜22:00・12/25まで','tag',.46]],sx:[[0,'whoosh'],[.4,'pop'],[1.2,'chime']]}
]},
// x02 POV vlog: Keyakizaka date (night look, REC, typewriter)
{id:'x02',cat:'tokyo',by:'kaise',song:'lofi',seed:2002,bpm:78,likes:176000,cm:7400,look:'night',note:1,also:['couple'],
 cap:['come with us to Keyakizaka 💙 400 m of “SNOW & BLUE” #roppongi #datenight #tokyochristmas','けやき坂デートに一緒に行こ💙 400mの「SNOW＆BLUE」 #六本木 #デート #東京クリスマス'],
 snd:['Snow & Blue Walk (lofi)','スノー＆ブルー散歩（lofi）'],
 com:[['asmon','I took 212 photos. one of them is good.','212枚撮った。1枚だけ良いのがある。'],['pinco','the tip about the road 🙏 so real','車道のマナーの話、大事🙏']],
 shots:[
 {d:4,bg:'x_keyaki',cam:[1.15,1.05,.5,.5,.4,.45],a:[['w_couple_0',.5,.9,.46,'idle',{in:'pop'}]],fx:[['rec',0,4],['snow',0,4,{n:40}]],tx:[[0,4,'POV: your date says “let’s just walk” 💙','POV：彼が「ちょっと歩こう」って 💙','big',.18]],sx:[[0,'shutter']]},
 {d:5,bg:'x_keyaki',tr:'cut',cam:[1.3,1.3,.3,.35,.5,.5],a:[['w_couple_2',.35,.9,.44,'bob'],['w_couple_1',.68,.9,.44,'idle']],fx:[['snow',0,5,{n:40}],['bokeh',0,5,{cols:['#9fd0ff','#ffffff']}]],tx:[[0,5,'about 970,000 LEDs on a ~400 m slope','約400mの坂に約97万灯のLED','type',.22,{cps:24}]],sx:[[0,'type']]},
 {d:5,bg:'x_keyaki',tr:'cut',pz:[0],cam:[1.6,1.7,.75,.75,.4,.38],fx:[['sparkle',0,5,{x:.73,y:.4,r:.08}]],tx:[[0,5,'that orange tower peeking in = the shot 📸','オレンジのタワーが入る構図が正解 📸','type',.22,{cps:24}]],sx:[[0,'shutter'],[.4,'type']]},
 {d:5,bg:'x_keyaki',tr:'cut',a:[['w_couple_2',.5,.9,.46,'talk']],fx:[['snow',0,5]],tx:[[0,5,'please stay on the sidewalk for photos 🚦 (the official page asks this too)','写真は歩道から🚦（公式サイトのお願いでもあります）','type',.22,{cps:26}]],sx:[[0,'type']]},
 {d:6,bg:'x_keyaki',tr:'zoom',cam:[1,1.08,.5,.5,.5,.46],a:[['w_couple_2',.33,.9,.44,'bob'],['w_couple_0',.68,.9,.44,'bob']],fx:[['hearts',0,6,{x:.5,y:.5,n:10}],['snow',0,6,{n:70}]],tx:[[0,6,'17:00–22:00 · until Dec 25 💙','17:00〜22:00・12/25まで 💙','neon',.2,{g:'#4fb4ff'}]],sx:[[0,'chime']]}
]},
// x03 ASMR: Christmas market
{id:'x03',cat:'tokyo',by:'pooh',song:'asmr',seed:2003,bpm:66,likes:154000,cm:5600,look:'asmr',note:1,also:['food'],
 cap:['Christmas market ASMR 🎧 (new bayside venue!) #tokyochristmasmarket #asmr','クリスマスマーケットASMR🎧（新しい湾岸会場！） #東京クリスマスマーケット #ASMR'],
 snd:['Market ASMR (whisper)','マーケットASMR（ささやき）'],
 com:[['bean','the sausage sizzle 😩','ソーセージの音😩'],['pinco','mug rally?? we’re doing both venues','マグのスタンプラリー？両会場行く']],
 shots:[
 {d:4,bg:'x_market',blur:1,cam:[1.2,1.1,.5,.5,.6,.6],a:[['w_gang_0',.5,.92,.5,'idle',{in:'fade'}]],tx:[[0,4,'Christmas market ASMR 🎧','クリスマスマーケットASMR 🎧','cap',.2]],sx:[[0,'bells']]},
 {d:5,bg:'x_market',blur:1,tr:'cut',a:[['p_sausage',.5,.7,.3,'float',{sh:0,mid:1}]],fx:[['steam',0,5,{x:.5,y:.45}],['bgtint',0,5,{a:.3}]],tx:[[0,5,'*sizzle*','＊ジュウ…＊','cap',.22]],sx:[[0,'sizzle',3]]},
 {d:5,bg:'x_market',blur:1,tr:'cut',a:[['p_cocoa',.5,.7,.28,'float',{sh:0,mid:1}]],fx:[['steam',0,5,{x:.47,y:.45}],['bgtint',0,5,{a:.3}]],tx:[[0,5,'cocoa in a mug… *slurp*','マグでココア…＊ずず＊','cap',.22]],sx:[[.5,'slurp']]},
 {d:5,bg:'x_market',tr:'cut',cam:[1.4,1.5,.52,.52,.5,.5],tx:[[0,5,'a big wooden Christmas pyramid 🕯️','大きな木のクリスマスピラミッド 🕯️','cap',.22],[1.6,5,'+ little wooden huts','＋ 木の小屋が並ぶ','cap',.32]],fx:[['glow',0,5,{x:.52,y:.42,s:.8}]],sx:[[0,'chime']]},
 {d:7,bg:'x_market',tr:'zoom',a:[['w_gang_0',.5,.92,.46,'bob']],fx:[['snow',0,7,{n:40}]],tx:[[0,7,'📍 Tokyo Christmas Market 2026','📍 東京クリスマスマーケット2026','loc',.2],[.8,7,'Shin-Toyosu: Nov 20–Dec 25','新豊洲：11/20〜12/25','tag',.3],[1.6,7,'Shiba Park: Dec 4–Dec 25','芝公園：12/4〜12/25','tag',.38],[2.4,7,'mug stamp rally across both venues','2会場めぐるマグのスタンプラリーも','tag',.46]],sx:[[0,'pop'],[.8,'ding'],[1.6,'ding']]}
]},
// x04 GRWM + snap transition -> Ebisu chandelier
{id:'x04',cat:'tokyo',by:'pinco',song:'synth',seed:2004,bpm:100,likes:198000,cm:8000,note:1,also:['makeup'],
 cap:['GRWM: cold-weather look for the giant chandelier in Ebisu ✨🧣 #grwm #ebisu #winteroutfit','GRWM：恵比寿の巨大シャンデリアに行く冬コーデ✨🧣 #GRWM #恵比寿 #冬コーデ'],
 snd:['Snap Into Winter','スナップで冬へ'],
 com:[['kaise','the beanie is S tier','ニット帽Sランク'],['asmon','8,500 crystals. I counted. (I did not.)','クリスタル8500個。数えた。（数えてない）']],
 shots:[
 {d:4,bg:'vanity',a:[['c_pinco_5',.5,.9,.5,'bob',{in:'pop'}]],tx:[[0,4,'GRWM: cold night, cute look 🧣','GRWM：寒い夜の冬コーデ 🧣','big',.17],[0,4,'6:12 pm','18:12','pillk',.3,{x:.2}]],sx:[[0,'pop']]},
 {d:5,bg:'vanity',tr:'cut',a:[['c_pinco_0',.5,.9,.5,'idle']],fx:[['sparkle',0,5,{x:.5,y:.4,r:.15}]],tx:[[0,5,'step 1: warm layers under the sweater','①セーターの下にあったかインナー','tag',.22],[0,5,'6:20 pm','18:20','pillk',.3,{x:.2}]],sx:[[0,'sparkle']]},
 {d:4,bg:'vanity',tr:'flash',a:[['w_pinco_0',.5,.9,.5,'hop']],fx:[['flash',0,.5],['stars',0,4,{x:.5,y:.3}]],tx:[[0,4,'*snap* scarf + beanie ✨','＊パチン＊マフラー＋ニット帽 ✨','big',.2]],sx:[[0,'shutter'],[0,'drop']]},
 {d:6,bg:'x_chand',tr:'flash',cam:[1.05,1.15,.5,.5,.45,.45],a:[['w_pinco_2',.72,.9,.42,'idle']],fx:[['sparkle',0,6,{x:.46,y:.4,r:.14,n:16}],['flash',0,.4]],tx:[[0,6,'📍 Ebisu Garden Place','📍 恵比寿ガーデンプレイス','loc',.2],[.8,6,'~5 m tall · 8,500 crystal pieces · 250 lights','高さ約5m・クリスタル8,500ピース・250灯','tag',.3],[1.6,6,'Nov 14 – Jan 11','11/14〜1/11','tag',.38]],sx:[[0,'shutter'],[.8,'sparkle']]},
 {d:6,bg:'x_chand',tr:'zoom',a:[['w_pinco_0',.3,.9,.42,'hop'],['w_gang_0',.7,.9,.38,'bob']],fx:[['sparkle',0,6,{x:.5,y:.4,r:.3}],['hearts',.5,6,{n:8}]],tx:[[0,6,'also: a ~10 m tree with red ornaments until Dec 25 🎄','約10mの赤いツリーも12/25まで 🎄','tag',.22]],sx:[[0,'chime']]}
]},
// x05 storytime family: Midtown bubbles
{id:'x05',cat:'tokyo',by:'pooh',song:'sweet',seed:2005,bpm:96,likes:133000,cm:4100,note:1,also:['parent'],
 cap:['storytime: we took the babies to see light + bubbles 🫧 (family-friendly!) #midtown #familyday','ストーリー：赤ちゃんたちと光とシャボン玉を見に行った🫧 #ミッドタウン #家族でおでかけ'],
 snd:['Bubble Lullaby','シャボン玉の子守唄'],
 com:[['pooping','free + stroller-friendly lawn = dad approved','無料＋ベビーカーで行ける＝パパ承認'],['pinco','POOH CAUGHT ONE 😭','プーが1個つかまえた😭']],
 shots:[
 {d:5,bg:'x_lawn',a:[['w_gang_0',.33,.9,.42,'bob'],['w_pinco_1',.7,.9,.42,'idle']],tx:[[0,5,'storytime: the night of the bubbles 🫧','ストーリー：シャボン玉の夜 🫧','cap',.2]],sx:[[0,'pop']]},
 {d:6,bg:'x_lawn',tr:'cut',a:[['babies_0',.5,.9,.3,'hop']],fx:[['bubbles',0,6,{x:.5,y:.6}]],tx:[[0,6,'every ~4 minutes the garden does a little light show','約4分ごとに庭で光のショーがあって','cap',.2]],sx:[[0,'chime'],[2,'wiggle']]},
 {d:6,bg:'x_lawn',tr:'cut',cam:[1.1,1.2,.5,.5,.5,.45],a:[['w_gang_0',.5,.9,.44,'hop']],fx:[['bubbles',0,6,{x:.5,y:.75}],['sparkle',1,6,{x:.5,y:.4}]],tx:[[0,6,'and BUBBLES come out. Pooh lost it.','シャボン玉が出てきて、プーが大興奮。','cap',.2]],sx:[[0,'pop'],[1,'wiggle'],[2.5,'pop']]},
 {d:7,bg:'x_lawn',tr:'whip',a:[['w_pinco_0',.5,.9,.44,'bob']],fx:[['bubbles',0,7,{x:.5,y:.75}]],tx:[[0,7,'📍 Tokyo Midtown · MIDWINTER LIGHTS','📍 東京ミッドタウン・MIDWINTER LIGHTS','loc',.18],[.8,7,'Nov 26 – Dec 25 · 17:00–23:00 · free','11/26〜12/25・17:00〜23:00・無料','tag',.28],[1.6,7,'bubble show until Dec 20','シャボン玉演出は12/20まで','tag',.36]],sx:[[0,'ding']]}
]},
// x06 ANIME style: Marunouchi
{id:'x06',cat:'tokyo',by:'bronny',song:'anime',seed:2006,bpm:156,likes:167000,cm:6000,look:'anime',note:1,
 cap:['anime opening but it’s us walking Marunouchi’s gold trees ✨ #marunouchi #anime','アニメOP風、丸の内の金色並木をただ歩く✨ #丸の内 #アニメ'],
 snd:['GOLDEN AVENUE (TV size)','ゴールデン・アベニュー（TVサイズ）'],
 com:[['bean','I am the main character (I have no arms)','主人公はぼく（腕はない）'],['party','OPENING SONG GOES HARD 🎉','OPが強い🎉']],
 shots:[
 {d:8,bg:'x_gold',cam:[1.2,1,.5,.5,.4,.5],a:[['w_gang_2',.5,.9,.5,'hop',{in:'b'}]],fx:[['lines',0,8],['speed',0,8]],tx:[[0,8,'EPISODE 1','第1話','manga',.18,{rot:-6}],[2,8,'The Golden Avenue','黄金の並木道','big',.3]],sx:[[0,'riser'],[2,'drop']]},
 {d:8,bg:'x_gold',tr:'spin',a:[['w_gang_1',.5,.9,.44,'dance']],fx:[['speed',0,8],['sparkle',0,8,{x:.5,y:.4,r:.35}]],tx:[[0,8,'about 1.2 km of champagne-gold trees!!','約1.2kmのシャンパンゴールド並木！！','manga',.2,{rot:4}]],sx:[[0,'whoosh']]},
 {d:8,bg:'x_gold',tr:'whip',cam:[1.3,1.3,.3,.7,.5,.5],a:[['w_gang_2',.3,.9,.42,'hop'],['w_gang_1',.7,.9,.4,'hop']],fx:[['lines',0,8,{c:'#ffe7a0'}]],tx:[[0,8,'until Feb 14','2/14まで','manga',.2,{rot:-4}],[2,8,'+ Gyoko-dori lights Nov 27–Dec 25','＋行幸通りは11/27〜12/25','tag',.32]],sx:[[0,'drop'],[2,'ding']]},
 {d:8,bg:'x_gold',tr:'zoom',a:[['w_gang_2',.3,.9,.44,'hop'],['w_gang_1',.7,.9,.42,'hop']],fx:[['rays',0,8,{c:'#fff2b0'}],['confetti',1,8]],tx:[[0,8,'TO BE CONTINUED…','つづく…','manga',.2,{rot:-3}]],sx:[[0,'drop'],[1,'cheer']]}
]},
// x07 Ao no Dokutsu: save-for-later (neon text, glow)
{id:'x07',cat:'tokyo',by:'kaise',song:'synth',seed:2007,bpm:100,likes:189000,cm:8800,look:'glow',note:1,
 cap:['SAVE THIS for Dec 11 💙 the blue tunnel is coming back (and it’s 1 stop from Yoyogi-Uehara) #aonodokutsu #shibuya','12/11まで保存💙 青の洞窟が今年も（代々木上原から1駅） #青の洞窟 #渋谷'],
 snd:['Blue Cave Synth','青の洞窟シンセ'],
 com:[['pinco','a TREE this year?? 🥹','今年はツリーも？🥹'],['asmon','blue is my color now. villain arc over.','青が俺の色。悪役は卒業。']],
 shots:[
 {d:5,bg:'x_blue',cam:[1.3,1.1,.5,.5,.4,.45],fx:[['bokeh',0,5,{cols:['#4f7bff','#9fd0ff']}]],tx:[[0,5,'save this for Dec 11 💙','12/11まで保存して 💙','neon',.2,{g:'#3b7bff'}]],sx:[[0,'riser']]},
 {d:6,bg:'x_blue',tr:'zoom',a:[['w_couple_0',.5,.9,.46,'idle']],fx:[['bokeh',0,6,{cols:['#4f7bff','#9fd0ff']}]],tx:[[0,6,'📍 Ao no Dokutsu SHIBUYA','📍 青の洞窟 SHIBUYA','loc',.2],[.8,6,'Dec 11–27 · 17:00–22:00','12/11〜12/27・17:00〜22:00','tag',.3],[1.6,6,'Shibuya Koen-dori → Yoyogi Park zelkova avenue','渋谷公園通り→代々木公園ケヤキ並木','tag',.38]],sx:[[0,'pop'],[.8,'ding']]},
 {d:6,bg:'x_blue',tr:'cut',cam:[1.5,1.7,.5,.5,.6,.6],fx:[['glow',0,6,{x:.5,y:.6,c:'rgba(120,170,255,.8)'}]],tx:[[0,6,'NEW this year: a blue Christmas tree 🎄','今年初登場：青いクリスマスツリー 🎄','neon',.22,{g:'#3b7bff'}]],sx:[[0,'sparkle']]},
 {d:6,bg:'x_blue',tr:'whip',a:[['w_couple_2',.33,.9,.42,'bob'],['w_couple_1',.68,.9,.42,'bob']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'local tip: Yoyogi-koen station is 1 stop from Yoyogi-Uehara 🚇','地元メモ：代々木上原から代々木公園駅は1駅 🚇','tag',.22]],sx:[[0,'ding']]}
]},
// x08 listicle: Yomiuriland family vibe check
{id:'x08',cat:'tokyo',by:'pooping',song:'xmas',seed:2008,bpm:110,likes:121000,cm:3900,note:1,also:['parent'],
 cap:['dad vibe check: jewel-colored lights + a fountain show 💎 (theme park day with the kids) #jewellumination #familyday','パパのバイブチェック：宝石色の光と噴水ショー💎 #ジュエルミネーション #家族でおでかけ'],
 snd:['Jewel Dad Jingle','宝石パパのジングル'],
 com:[['max','did the fountain get you wet 🐶','噴水でぬれた？🐶'],['prof','“Growing Light” theme confirmed.','テーマ「Growing Light」確認済み。']],
 shots:[
 {d:5,bg:'x_jewel',a:[['c_pooping_1',.5,.9,.44,'bob',{in:'pop'}],['babies_1',.78,.9,.22,'hop']],tx:[[0,5,'dad vibe check: Yomiuriland Jewellumination 💎','パパのバイブチェック：よみうりランド ジュエルミネーション 💎','big',.17]],sx:[[0,'bells']]},
 {d:6,bg:'x_jewel',tr:'slide',cam:[1.2,1.3,.4,.6,.4,.4],tx:[[0,6,'this season’s theme: “Growing Light” 🌱','今季のテーマ：「Growing Light」🌱','type',.2,{cps:22}],[2.4,6,'new green jewel colors','新色のグリーン系ジュエリーカラー','type',.3,{cps:22}]],fx:[['sparkle',0,6,{x:.5,y:.45,r:.3,c:'#7dffa8'}]],sx:[[0,'type'],[2.4,'type']]},
 {d:6,bg:'x_jewel',tr:'slide',cam:[1.4,1.5,.7,.7,.55,.5],tx:[[0,6,'fountain show: 60 m wide, 226 jets ⛲','噴水ショー：幅60m・噴水226本 ⛲','type',.2,{cps:22}],[2.4,6,'~140 m crystal light tunnel','約140mの光のトンネル','type',.3,{cps:22}]],fx:[['mist',0,6,{x:.75,y:.6}]],sx:[[0,'type'],[2.4,'type']]},
 {d:6,bg:'x_jewel',tr:'zoom',a:[['c_pooping_2',.35,.9,.42,'hop'],['babies_2',.7,.9,.26,'hop']],fx:[['confetti',0,6,{n:30}]],tx:[[0,6,'until Apr 4, 2027 (closed days excluded)','2027/4/4まで（休園日を除く）','tag',.22],[1.2,6,'hours change by season — check before you go','時間は時期で変わるので事前確認を','tag',.3]],sx:[[0,'cheer']]}
]},
// x09 tier list: Kaise’s winter date tier list (vibes only)
{id:'x09',cat:'tokyo',by:'kaise',song:'comedy',seed:2009,bpm:106,likes:201000,cm:12000,note:1,also:['couple'],
 cap:['winter date tier list 📋❄️ (by vibe, he disagreed) #tierlist #tokyodate','冬デート格付け📋❄️（雰囲気で。彼は反対） #格付け #東京デート'],
 snd:['Tier Tier Christmas','格付けクリスマス'],
 com:[['asmon','The snow globe one is S. I will die on this hill.','スノードームのとこがS。譲らない。'],['bronny','free + open till midnight is elite','無料で24時までは強い']],
 shots:[
 {d:5,bg:'stream',a:[['w_couple_0',.33,.9,.44,'idle',{in:'l'}],['w_couple_2',.7,.9,.44,'bob',{in:'r'}]],tx:[[0,5,'winter date tier list (by VIBE) 📋','冬デート格付け（雰囲気で）📋','big',.17]],sx:[[0,'pop']]},
 {d:12,bg:'#1d1430/#3a2350',dots:0,tr:'whip',fx:[['tier',0,12,{rows:[['cozy','ほっこり'],['sparkly','キラキラ'],['romantic','ロマンチック'],['chaos','カオス']],y:.22,rh:.11,items:[['bg_x_market',0,.6],['bg_x_dome',1,2],['bg_x_chand',2,3.4],['bg_x_keyaki',2,4.8],['bg_x_lawn',1,6.2]]}]],tx:[[.6,2,'Christmas market','クリスマスマーケット','tag',.72],[2,3.4,'Tokyo Dome City (free, till 24:00)','東京ドームシティ（無料・24時まで）','tag',.72],[3.4,4.8,'Ebisu chandelier','恵比寿シャンデリア','tag',.72],[4.8,6.2,'Keyakizaka','けやき坂','tag',.72],[6.2,8,'Midtown bubbles','ミッドタウンのシャボン玉','tag',.72],[8,12,'“chaos” row is empty… for now','「カオス」枠はまだ空…','tag',.72]],sx:[[.6,'ding'],[2,'ding'],[3.4,'ding'],[4.8,'ding'],[6.2,'ding'],[8,'crickets']]},
 {d:6,bg:'x_dome',tr:'cut',a:[['w_couple_2',.5,.9,.46,'hop']],fx:[['snow',0,6,{n:60}],['impact',.5,2,{x:.5,y:.3,t:'CHAOS'}]],tx:[[1.5,6,'He found the roller coaster. CHAOS tier unlocked.','彼がジェットコースターを発見。カオス枠解放。','bub',.3,{x:.5,tx:.5,ty:.5,who:'kaise'}]],sx:[[.5,'boing'],[1.5,'laugh']]},
 {d:6,bg:'x_dome',tr:'zoom',a:[['w_couple_2',.33,.9,.44,'bob'],['w_couple_1',.68,.9,.44,'bob']],fx:[['snow',0,6,{n:60}],['hearts',0,6,{n:8}]],tx:[[0,6,'📍 TOKYO SNOW DOME CITY · Nov 19 – Feb 28 · 17:00–24:00 · free','📍 TOKYO SNOW DOME CITY・11/19〜2/28・17:00〜24:00・無料','tag',.22]],sx:[[0,'chime']]}
]},
// x10 STOP-MOTION (clay): Skytree Town market, Mr Bean & the mug
{id:'x10',cat:'tokyo',by:'bean',song:'clay',seed:2010,bpm:112,likes:144000,cm:5100,look:'clay',note:1,also:['comedy'],
 cap:['stop-motion: me vs. one (1) Christmas market mug 🫛☕ #skytree #stopmotion','ストップモーション：ぼく vs マグカップ1個🫛☕ #スカイツリー #ストップモーション'],
 snd:['Claymation Cocoa','クレイアニメのココア'],
 com:[['pooh','I would have held it for you','持ってあげたのに'],['mogu','frame by frame 😭 the effort','1コマずつ😭努力']],
 shots:[
 {d:5,bg:'x_market',cam:[1.1,1.1,.5,.5,.6,.6],a:[['w_gang_1',.5,.9,.46,'hop',{in:'drop'}]],tx:[[0,5,'Skytree Town Dream Christmas ⭐','東京スカイツリータウン ドリームクリスマス ⭐','big',.17]],sx:[[0,'thud'],[.3,'pop']]},
 {d:6,bg:'x_market',tr:'cut',cam:[1.2,1.2,.5,.5,.65,.65],a:[['w_gang_1',.35,.9,.44,'idle'],['p_cocoa',.7,.88,.16,'idle']],tx:[[0,6,'step 1: obtain cocoa','手順①：ココアを手に入れる','pill',.2]],sx:[[0,'wood']]},
 {d:6,bg:'x_market',tr:'cut',cam:[1.2,1.2,.5,.5,.65,.65],a:[['w_gang_1',.5,.9,.44,'wiggle',{mv:[.6,.9],mvd:4}],['p_cocoa',.7,.88,.16,'shake']],fx:[['sweat',1,6,{x:.46,y:.5}]],tx:[[0,6,'step 2: …I have no arms','手順②：…腕がない','pill',.2]],sx:[[0,'boing'],[2,'wood'],[4,'wood']]},
 {d:6,bg:'x_market',tr:'cut',cam:[1.2,1.2,.5,.5,.65,.65],a:[['w_gang_1',.5,.9,.44,'hop'],['p_cocoa',.5,.4,.14,'idle',{sh:0}]],fx:[['stars',0,6,{x:.5,y:.38}]],tx:[[0,6,'step 3: balance it on my head 🏆','手順③：頭にのせる 🏆','pill',.2]],sx:[[0,'ding'],[1,'cheer']]},
 {d:7,bg:'x_market',tr:'zoom',a:[['w_gang_1',.5,.9,.46,'bob']],fx:[['sparkle',0,7,{x:.5,y:.3,r:.35,c:'#ffd86a'}]],tx:[[0,7,'“STAR LIGHT GOLD” lights + a picture-book Christmas market (4F Sky Arena)','「STAR LIGHT GOLD」の光＋絵本の世界のクリスマスマーケット（4F スカイアリーナ）','tag',.2],[1.2,7,'Nov 5 – Dec 25','11/5〜12/25','tag',.34]],sx:[[0,'chime']]}
]},
// x11 SPLIT expectation vs reality: Shibuya Sky
{id:'x11',cat:'tokyo',by:'asmon',song:'comedy',seed:2011,bpm:110,likes:158000,cm:6700,note:1,also:['couple','comedy'],
 cap:['expectation vs reality: the bubble show 229 m above Shibuya 🫧 #shibuyasky #expectationvsreality','理想と現実：渋谷上空229mのシャボン玉演出🫧 #渋谷スカイ #理想と現実'],
 snd:['Bubble Trouble','バブル・トラブル'],
 com:[['kaise','the bubble on your beard 😭','ひげにシャボン玉😭'],['prof','Every 30 minutes from 19:00. Accurate.','19時から30分おき。正確。']],
 shots:[
 {d:5,bg:'x_lawn',a:[['w_couple_2',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,5,'expectation vs reality: rooftop bubbles 🫧','理想と現実：屋上のシャボン玉 🫧','big',.17]],sx:[[0,'pop']]},
 {d:9,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:'x_lawn',a:[['w_couple_1',.5,.92,.44,'idle']],fx:[['bubbles',0,9,{x:.5,y:.6}],['sparkle',0,9,{x:.5,y:.4}]],tx:[[0,9,'EXPECTATION','理想','pill',.16]]},{r:[.5,0,.5,1],bg:'x_lawn',a:[['w_couple_2',.5,.92,.44,'shake']],fx:[['bubbles',0,9,{x:.5,y:.5}],['sweat',1,9,{x:.42,y:.55}]],tx:[[0,9,'REALITY','現実','pill',.16],[2,9,'bubble.\nin. beard.','ひげに、\nシャボン玉。','tag',.3,{x:.4}]]}],sx:[[0,'swish'],[2,'pop'],[3,'laugh']]},
 {d:7,bg:'x_lawn',tr:'whip',a:[['w_couple_2',.33,.9,.42,'bob'],['w_couple_0',.68,.9,.42,'bob']],fx:[['bubbles',0,7,{x:.5,y:.7}]],tx:[[0,7,'📍 SHIBUYA SKY “Sparkling View” · until Dec 25','📍 SHIBUYA SKY「Sparkling View」12/25まで','loc',.18],[.8,7,'light tree from 19:00 · show every 30 min (weather permitting)','19時から光のツリー・30分おきに演出（天候による）','tag',.3],[1.6,7,'needs a same-day SHIBUYA SKY ticket','当日のSHIBUYA SKY入場チケットが必要','tag',.4]],sx:[[0,'ding']]}
]},
// x12 LIVE STREAM: Mr Bean strolls Yoyogi Park
{id:'x12',cat:'tokyo',by:'bean',song:'stream',seed:2012,bpm:140,likes:264000,cm:15400,note:1,
 live:{v0:1180,rate:46,chat:[[1,'pinco','BEAN IS LIVE 🫛💕','ビーン配信きた🫛💕'],[4,'pooh','where are u','どこにいるの'],[7,'prof','Yoyogi Park, judging by the ginkgo.','イチョウからして代々木公園ですね。'],[11,'bronny','the yellow leaves 🔥','黄色い葉っぱ🔥'],[15,'kaise','show us the fountain!!','噴水見せて！！'],[20,'asmon','walk faster. (please)','早く歩け。（お願い）'],[26,'pinco','the music show!! 🎶','音楽のショー！！🎶'],[31,'pooh','sending gold coins 🪙','金貨送る🪙'],[36,'prof','Shows at 17:00, 18:00, 19:00, 20:00 and 20:50.','ショーは17時・18時・19時・20時・20時50分。'],[41,'kaise','best stream ever 🥹','神配信🥹'],[45,'bronny','see u at the courts tmrw','明日コートで']],gifts:[12,24,32,40,46]},
 cap:['LIVE from Yoyogi Park 🫛🍂 ginkgo walk + the new Forest Fountain #yoyogipark #live','代々木公園からライブ配信🫛🍂 イチョウ散歩＋新しい森の噴水 #代々木公園 #ライブ'],
 snd:['Bean Live Beat','ビーンのライブビート'],
 com:[['pinco','I was in the chat 💕','チャットにいたよ💕'],['prof','The fountain reopened Nov 13. Verified.','噴水は11/13にリニューアル。確認済み。']],
 shots:[
 {d:10,bg:'x_ginkgo',cam:[1.15,1.05,.5,.5,.6,.55],a:[['xb_bean_1',.5,.9,.4,'sneak']],tx:[[0,10,'hi chat!! walking the ginkgo trees 🍂','チャットのみんなー！イチョウ並木を歩いてる🍂','bub',.26,{x:.5,tx:.5,ty:.52,who:'bean'}]],sx:[[0,'pop']]},
 {d:10,bg:'x_ginkgo',tr:'cut',cam:[1,1.15,.5,.5,.5,.6],a:[['xb_bean_5',.5,.9,.4,'sneak',{mv:[.5,.84,.9],mvd:10}]],fx:[['sparkle',0,10,{x:.5,y:.4,r:.4,c:'#ffe27a'}]],tx:[[0,10,'they usually peak late Nov–mid Dec','見頃はだいたい11月下旬〜12月中旬','bub',.26,{x:.5,tx:.5,ty:.55,who:'bean'}]],sx:[[0,'chime']]},
 {d:10,bg:'x_yoyogi',tr:'whip',cam:[1.1,1.2,.5,.5,.55,.6],a:[['xb_bean_0',.35,.92,.38,'hop']],fx:[['mist',0,10,{x:.6,y:.62,a:-1.6}]],tx:[[0,10,'the fountain is new! “Forest Fountain”, opened Nov 13 ⛲','噴水がリニューアル！「森の噴水」11/13オープン⛲','bub',.25,{x:.5,tx:.35,ty:.6,who:'bean'}]],sx:[[0,'whoosh']]},
 {d:10,bg:'x_yoyogi',tr:'cut',cam:[1.3,1.4,.6,.6,.6,.6],a:[['xb_bean_1',.3,.92,.36,'dance']],fx:[['notes',0,10,{x:.6,y:.55}],['hearts',2,10,{x:.4,y:.6,n:10,loop:1}]],tx:[[0,10,'lit up 17:00–21:00, music shows 5x a night (10 min)','ライトアップ17〜21時、音楽付きは1晩5回（各10分）','bub',.25,{x:.55,tx:.3,ty:.62,who:'bean'}]],sx:[[0,'chime']]},
 {d:12,bg:'x_ginkgo',tr:'zoom',cam:[1,1.05,.5,.5,.6,.6],a:[['xb_bean_1',.5,.9,.4,'bob']],fx:[['hearts',0,12,{n:12,loop:1}]],tx:[[0,12,'running till 23:00 through Jan 31. byeee chat 🫛','1/31までは23時まで運転。またねー🫛','bub',.26,{x:.5,tx:.5,ty:.52,who:'bean'}]],sx:[[0,'aww']]}
]}
);
