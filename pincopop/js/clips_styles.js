'use strict';
// STYLE PACK (v1.3): new video formats across the older tabs: silent film, claymation, VHS home video,
// vlog with REC, anime transformation, word-by-word captions, flashcards, film-grain storytime.
window.CLIPS=window.CLIPS||[];
const YBG='#fff3f8/#ffe1ee',YW='#eef6ff/#dcecff';
CLIPS.push(
// comedy: silent film (b&w, intertitles, piano)
{id:'y01',cat:'comedy',by:'bean',song:'silent',seed:3101,bpm:132,likes:244000,cm:9100,look:'film',bw:1,
 cap:['if my life was a silent film: “The Door” 🎞️ #silentfilm #mrbean #comedy','もしぼくの人生がサイレント映画だったら：「ドア」🎞️ #サイレント映画 #コメディ'],
 snd:['Ragtime for No Arms','腕なしラグタイム'],
 com:[['pooh','the bow at the end 😭','最後のおじぎ😭'],['asmon','cinema. absolute cinema.','映画だ。これは映画だ。']],
 shots:[
 {d:6,bg:'#111/#222',dots:0,tx:[[0,6,'“THE DOOR”\na tragedy in 3 acts','「ドア」\n三幕の悲劇','serif',.4]],sx:[[0,'tick']]},
 {d:7,bg:'living',tr:'cut',a:[['c_bean_0',.45,.9,.44,'bob',{mv:[.6,.9],mvd:7}]],tx:[[0,7,'Act I. A pea arrives at a door.','第一幕：さや、ドアの前に立つ。','serif',.2,{s:.85}]],sx:[[0,'boing']]},
 {d:7,bg:'living',tr:'cut',a:[['c_bean_3',.6,.9,.44,'wiggle']],fx:[['sweat',1,7,{x:.66,y:.5}]],tx:[[0,7,'Act II. He has no arms.','第二幕：腕がない。','serif',.2,{s:.85}]],sx:[[0,'boing'],[3,'boing']]},
 {d:7,bg:'living',tr:'cut',a:[['c_bean_5',.5,.9,.44,'hop'],['c_max_2',.2,.92,.3,'hop',{in:'l'}]],fx:[['stars',2,7,{x:.5,y:.4}]],tx:[[0,7,'Act III. A dog opens it.','第三幕：犬が開けた。','serif',.2,{s:.85}]],sx:[[0,'squeak'],[2,'cheer']]},
 {d:5,bg:'#111/#222',dots:0,tr:'cut',a:[['c_bean_1',.5,.9,.4,'nod']],tx:[[0,5,'THE END','おしまい','serif',.25]],sx:[[0,'chime']]}
]},
// comedy: claymation
{id:'y02',cat:'comedy',by:'mogu',song:'clay',seed:3102,bpm:110,likes:171000,cm:6000,look:'clay',
 cap:['stop-motion: Mogu vs. the last onigiri 🍙 (shot at 8 fps for drama) #stopmotion #claymation','ストップモーション：モグ vs 最後のおにぎり🍙 #ストップモーション #クレイアニメ'],
 snd:['Clay Chase','ねんどの追いかけっこ'],
 com:[['pooh','the onigiri moved on its own??','おにぎり勝手に動いた？'],['party','8 fps of pure stress 🎉','8fpsのストレス🎉']],
 shots:[
 {d:6,bg:'kitchen',a:[['c_mogu_0',.35,.9,.34,'bob'],['p_onigiri',.75,.86,.12,'idle']],tx:[[0,6,'the last onigiri.','最後のおにぎり。','cap',.25]],sx:[[0,'pop']]},
 {d:6,bg:'kitchen',tr:'cut',a:[['c_mogu_1',.5,.9,0.357,'hop',{mv:[.65,.9],mvd:6}],['p_onigiri',.8,.86,.12,'idle',{mv:[.92,.86],mvd:6}]],tx:[[0,6,'it… slid away?','…すべって逃げた？','cap',.25]],sx:[[0,'squeak'],[3,'squeak']]},
 {d:6,bg:'kitchen',tr:'cut',a:[['p_onigiri',.5,.6,.16,'hop',{sh:0}],['c_mogu_3',.3,.9,0.357,'shake']],fx:[['lines',0,6]],tx:[[0,6,'it’s a clay movie. anything can happen.','クレイアニメだから何でもアリ。','cap',.25]],sx:[[0,'boing']]},
 {d:6,bg:'kitchen',tr:'zoom',a:[['c_mogu_5',.5,.9,0.374,'hop']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'(we shared it)','（はんぶんこした）','cap',.25]],sx:[[0,'chime']]}
]},
// comedy: VHS home video 1998
{id:'y03',cat:'comedy',by:'bronny',song:'synth',seed:3103,bpm:104,likes:198000,cm:8400,look:'vhs',vhsDate:'DEC.24 1998',
 cap:['found my 1998 home video 📼 baby Bronny’s first jump shot #vhs #throwback','1998年のホームビデオ発見📼 ベビーブロニーの初シュート #VHS #懐かしい'],
 snd:['Camcorder Christmas','ビデオカメラのクリスマス'],
 com:[['pinco','the tiny jersey 😭','ちっちゃいユニフォーム😭'],['prof','The tracking lines are authentic.','トラッキングノイズが本物っぽい。']],
 shots:[
 {d:6,bg:'living',a:[['c_bronny_0',.5,.9,.4,'bob']],tx:[[0,6,'▶ PLAY','▶ 再生','retro',.2]],sx:[[0,'tape']]},
 {d:6,bg:'living',tr:'glitch',a:[['c_bronny_3',.5,.9,.4,'tremble'],['p_gift',.78,.88,.12,'idle']],tx:[[0,6,'“okay buddy, show grandma!”','「ほら、おばあちゃんに見せて！」','retro',.2,{s:.85}]],sx:[[0,'scratch']]},
 {d:6,bg:'living',tr:'cut',a:[['c_bronny_2',.5,.9,.42,'hop']],fx:[['confetti',1,6,{n:24}]],tx:[[0,6,'*sock into laundry basket* SWISH','＊靴下を洗濯かごへ＊シュッ','retro',.2,{s:.85}]],sx:[[1,'cheer']]},
 {d:5,bg:'living',tr:'glitch',a:[['c_bronny_5',.5,.9,.42,'bob']],tx:[[0,5,'■ STOP','■ 停止','retro',.2]],sx:[[0,'tape']]}
]},
// parent: vlog with REC + typewriter
{id:'y04',cat:'parent',by:'pooping',song:'lofi',seed:3104,bpm:86,likes:132000,cm:5100,
 cap:['dad vlog: 6:30 AM with three babies ☕👶👶👶 #dadlife #vlog','パパvlog：三つ子と朝6:30☕👶👶👶 #パパ #育児vlog'],
 snd:['Morning Shift','朝のシフト'],
 com:[['pooh','the coffee getting cold every time','コーヒー毎回冷める'],['kaise','dads doing the morning = 💗','朝担当パパ＝💗']],
 shots:[
 {d:5,bg:'nursery',a:[['c_pooping_1',.5,.9,.44,'bob']],fx:[['rec',0,5]],tx:[[0,5,'6:30 AM. day 412 of dad mode.','朝6:30。パパモード412日目。','type',.22,{cps:14}]],sx:[[0,'type']]},
 {d:6,bg:'nursery',tr:'cut',a:[['babies_0',.5,.9,.36,'wiggle']],fx:[['rec',0,6]],tx:[[0,6,'all three awake. at once. again.','3人同時に起床。またか。','type',.22,{cps:14}]],sx:[[0,'type'],[1,'wiggle']]},
 {d:6,bg:'kitchen',tr:'cut',a:[['c_pooping_2',.4,.9,.44,'talk'],['p_mug',.78,.84,.11,'idle']],fx:[['rec',0,6],['steam',0,6,{x:.78,y:.76}]],tx:[[0,6,'coffee status: poured. not yet drunk.','コーヒー：淹れた。まだ飲めてない。','type',.22,{cps:14}]],sx:[[0,'pour'],[1,'type']]},
 {d:6,bg:'living',tr:'zoom',a:[['pooping_parent_1',.5,.9,.46,'bob']],fx:[['rec',0,6],['hearts',1,6,{n:8}]],tx:[[0,6,'worth it though.','でも、しあわせ。','type',.22,{cps:10}]],sx:[[0,'chime']]}
]},
// makeup: anime transformation
{id:'y05',cat:'makeup',by:'pinco',song:'anime',seed:3105,bpm:160,likes:211000,cm:9900,look:'anime',
 cap:['holiday party glam but it’s an anime transformation ✨💄 #transformation #grwm','パーティーメイクを魔法少女変身で✨💄 #変身 #GRWM'],
 snd:['Sparkle Henshin','きらきら変身'],
 com:[['kaise','the spin!!!','回転！！'],['bronny','I need an intro like this before games','試合前にこのイントロ欲しい']],
 shots:[
 {d:8,bg:'vanity',a:[['c_pinco_0',.5,.9,.46,'bob']],tx:[[0,8,'party in 10 minutes?!','パーティーまであと10分！？','manga',.2,{rot:-4}]],sx:[[0,'boing']]},
 {d:8,bg:'#ff9ad5/#8a5cff',dots:0,tr:'flash',a:[['p_lipstick',.3,.6,.12,'spin',{sh:0}],['p_palette',.7,.6,.12,'spin',{sh:0}],['p_star',.5,.4,.12,'pulse',{sh:0}]],fx:[['rays',0,8],['sparkle',0,8]],tx:[[0,8,'MAKEUP… TRANSFORM!','メイクアップ…変身！','manga',.2,{rot:4}]],sx:[[0,'riser'],[4,'sparkle']]},
 {d:8,bg:'vanity',tr:'flash',a:[['pinco_makeup_2',.5,.9,.5,'hop']],fx:[['sparkle',0,8],['confetti',.5,8,{n:30}]],tx:[[0,8,'tip: shimmer on the lids, keep the rest soft','コツ：まぶたにラメ、他はやわらかく','tag',.2]],sx:[[0,'cheer']]}
]},
// preg: winter tips, word-by-word captions
{id:'y06',cat:'preg',by:'pinco',song:'sweet',seed:3106,bpm:90,likes:97000,cm:3600,
 cap:['pregnant in winter: 4 cozy, sensible tips ❄️🤰 (ask your doctor/midwife) #pregnancy #winter','冬の妊婦さん：ゆるっと4つのコツ❄️🤰（主治医・助産師さんに相談を） #妊娠 #冬'],
 snd:['Snug Season','ぬくぬくシーズン'],
 com:[['pooh','grippy shoes are so underrated','すべらない靴、大事'],['prof','Vaccines: discuss with your doctor. Good tip.','ワクチンは医師と相談、良いコツ。']],
 shots:[
 {d:5,bg:YBG,a:[['pinco_preg_0',.5,.9,.46,'bob']],fx:[['snow',0,5,{n:40}]],tx:[[0,5,'pregnant in winter? 4 cozy tips ❄️','冬の妊婦さんへ 4つのコツ ❄️','cap',.2,{wps:3}]],sx:[[0,'chime']]},
 {d:6,bg:YBG,tr:'flash',a:[['p_mittens',.5,.62,.14,'float',{sh:0}]],fx:[['snow',0,6,{n:30}]],tx:[[0,6,'1. layers you can take off indoors','①室内で脱げる重ね着を','cap',.2,{wps:3}]],sx:[[0,'pop']]},
 {d:6,bg:YBG,tr:'flash',a:[['p_water',.5,.62,.14,'float',{sh:0}]],tx:[[0,6,'2. keep drinking water, even when it’s cold','②寒くても水分補給','cap',.2,{wps:3}]],sx:[[0,'pop']]},
 {d:6,bg:YBG,tr:'flash',a:[['c_pinco_4',.5,.9,.42,'bob']],tx:[[0,6,'3. grippy shoes for icy or wet streets','③凍った道・ぬれた道にはすべりにくい靴','cap',.2,{wps:3}]],sx:[[0,'pop']]},
 {d:7,bg:YBG,tr:'flash',a:[['c_pinco_5',.5,.9,.44,'bob']],tx:[[0,7,'4. wash hands often & ask your doctor about flu vaccination','④手洗いをこまめに、インフルエンザの予防接種は主治医に相談','cap',.2,{wps:3}],[3,7,'general tips, not medical advice','一般的なコツです（医療アドバイスではありません）','tag',.4]],sx:[[0,'pop'],[3,'ding']]}
]},
// lng: winter words flashcards
{id:'y07',cat:'lng',by:'prof',song:'xmas',seed:3107,bpm:104,likes:72000,cm:1900,
 cap:['winter words flashcards ❄️ EN ↔ JA #learnjapanese #learnenglish','冬の単語フラッシュカード❄️ 英⇔日 #英語 #日本語'],
 snd:['Flashcard Flurry','フラッシュカード吹雪'],
 com:[['bean','kotatsu is my favorite word','こたつが一番好きな単語'],['kaise','“hokkairo” saved my winter','ホッカイロに冬を救われた']],
 shots:[
 {d:5,bg:YW,a:[['c_prof_1',.5,.9,.44,'talk']],fx:[['snow',0,5,{n:30}]],tx:[[0,5,'winter words ❄️ flashcards','冬の単語 ❄️ フラッシュカード','big',.18]],sx:[[0,'bells']]},
 {d:5,bg:YW,tr:'spin',a:[['p_snowflake',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'snow = 雪 (yuki)','snow = 雪（ゆき）','pill',.22]],sx:[[0,'pop']]},
 {d:5,bg:YW,tr:'spin',a:[['p_mittens',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'gloves = 手袋 (tebukuro)','gloves = 手袋（てぶくろ）','pill',.22]],sx:[[0,'pop']]},
 {d:5,bg:YW,tr:'spin',a:[['p_cocoa',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'hot cocoa = ココア (kokoa)','hot cocoa = ココア','pill',.22]],sx:[[0,'pop']]},
 {d:5,bg:YW,tr:'spin',a:[['p_gift',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'present = プレゼント (purezento)','present = プレゼント','pill',.22]],sx:[[0,'pop']]},
 {d:5,bg:YW,tr:'zoom',a:[['c_prof_0',.5,.9,.44,'nod']],tx:[[0,5,'It’s cold! = 寒い！(samui!)','It’s cold! = 寒い！（さむい！）','pill',.22]],sx:[[0,'ding']]}
]},
// couple: film storytime
{id:'y08',cat:'couple',by:'kaise',song:'lofi',seed:3108,bpm:78,likes:263000,cm:12800,look:'film',
 cap:['storytime: how we met (he was dressed as a villain) 🎞️💗 #storytime #howwemet','ストーリータイム：出会い（彼は悪役の格好だった）🎞️💗 #なれそめ'],
 snd:['Super 8 Summer','スーパー8の夏'],
 com:[['pinco','I KNEW it was a costume party','やっぱり仮装パーティー'],['asmon','for the record, I was the best villain there','言っとくけど一番の悪役だった']],
 shots:[
 {d:6,bg:'park',a:[['kaise_0',.5,.9,.46,'bob']],tx:[[0,6,'storytime: how we met 🎞️','ストーリータイム：出会い 🎞️','cap',.2,{wps:3}]],sx:[[0,'tape']]},
 {d:7,bg:'stage',tr:'cut',a:[['c_asmon_0',.5,.9,.46,'talk']],tx:[[0,7,'a costume party. he came as a villain. very committed.','仮装パーティー。彼は悪役。本気すぎた。','cap',.2,{wps:3}]],sx:[[0,'evil']]},
 {d:7,bg:'stage',tr:'cut',a:[['kaise_4',.35,.9,.42,'wiggle'],['c_asmon_2',.7,.9,.42,'bob']],tx:[[0,7,'he spilled punch on his cape and said “this is part of the plan.”','マントにパンチをこぼして「計画通り」って言った。','cap',.2,{wps:3}]],sx:[[0,'wiggle']]},
 {d:7,bg:'park',tr:'zoom',a:[['asmon_couple_1',.5,.9,.5,'bob']],fx:[['hearts',0,7,{n:10}]],tx:[[0,7,'it was not part of the plan. we’ve been together since.','計画じゃなかった。それからずっと一緒。','cap',.2,{wps:3}]],sx:[[0,'chime']]}
]}
);
