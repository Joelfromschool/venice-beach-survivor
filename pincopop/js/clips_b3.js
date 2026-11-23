'use strict';
// v1.5.3 batch. Facts checked 2026-11-24 (JST): Yoyogi Hachimangu official pages (event.html, gokitou.html, access.html),
// Holiday Ice Rink Pershing Square (holidayicerinkdowntownla.com/ice-skating-downtown-la/). No prices, no ratings.
window.CLIPS=window.CLIPS||[];
const B3C='#fff8ec/#ffeccc',B3I='#eaf6ff/#cfe6ff';
CLIPS.push(
// bb20 SCRAPBOOK: Baby Bean's omiyamairi tips (Yoyogi Hachimangu)
{id:'bb20',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'sweet',seed:5301,bpm:96,likes:259000,cm:11200,note:1,
 cap:['Baby Bean’s omiyamairi (first shrine visit) at our neighborhood shrine ⛩️🫛 Yoyogi Hachimangu #omiyamairi #yoyogihachiman #babybean','ベビービーンのお宮参り、近所の代々木八幡宮で⛩️🫛 #お宮参り #代々木八幡宮 #ベビービーン'],
 snd:['First Shrine Visit','はじめてのお宮参り'],
 com:[['pinco','the bonnet was the right choice','ボンネット正解'],['prof','Details from the shrine’s official site; January works differently.','神社公式サイトより。1月は受付方法が異なります。']],
 shots:[
 {d:5,bg:'x_shrine',a:[['pooping_parent_1',.38,.9,.44,'talk'],['bbean_0',.74,.84,.26,'idle']],tx:[[0,5,'Baby Bean’s first shrine visit ⛩️','ベビービーンのお宮参り ⛩️','big',.18]],sx:[[0,'chime']]},
 {d:9,bg:B3C,dots:0,tr:'slide',fx:[['polaroid',0,9,{s:.46,imgs:[['x_shrine',0,-7,.32,.36],['nursery',1.5,6,.68,.42]]}]],tx:[[0,9,'📍 Yoyogi Hachimangu · Yoyogi 5-1-1','📍 代々木八幡宮・代々木5-1-1','loc',.12,{s:.85}],[2.5,9,'5 min walk from Yoyogi-Hachiman Station','代々木八幡駅から徒歩5分','tag',.72]],sx:[[0,'shutter'],[1.5,'shutter']]},
 {d:6,bg:B3C,dots:0,tr:'slide',a:[['p_calendar',.5,.62,.14,'float',{sh:0}]],tx:[[0,6,'prayers one family at a time · about 15 min','ご祈祷は1組ずつ・約15分','tag',.22],[1.5,6,'reception 9:00–16:30 · book by phone or email','受付9:00〜16:30・電話かメールで予約','tag',.32]],sx:[[0,'ding']]},
 {d:6,bg:B3C,dots:0,tr:'slide',a:[['p_phone',.5,.62,.13,'float',{sh:0}]],tx:[[0,6,'January: some days are walk-in only','1月は予約なし（当日受付）の日あり','tag',.22],[1.5,6,'hired photographers: only with a booked prayer','カメラマン撮影はご祈祷を受ける方のみ','tag',.32]],sx:[[0,'ding']]},
 {d:5,bg:'x_shrine',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,5,{x:.75,y:.5}],['sparkle',0,5]],tx:[[0,5,'he slept through his own ceremony 😴⛩️','本人、儀式中ずっと寝てた 😴⛩️','cap',.2,{wps:3}]],sx:[[0,'aww']]}
]},
// pa10 NIGHT: a neighborhood New Year's Eve (Yoyogi Hachimangu)
{id:'pa10',cat:'parent',also:['tokyo'],by:'pooh',song:'lofi',seed:5302,bpm:84,likes:188000,cm:8100,look:'night',note:1,
 cap:['skip the Shibuya crowds: a cozy neighborhood New Year’s Eve 🔥⛩️ Yoyogi Hachimangu #yoyogihachiman #newyearseve #tokyo','渋谷の人混みじゃなく、ご近所の年越し🔥⛩️ 代々木八幡宮 #代々木八幡宮 #年越し'],
 snd:['Bonfire Countdown','かがり火カウントダウン'],
 com:[['pooping','we’re bringing Baby Bean (bundled)','ベビービーンも行く（防寒ばっちり）'],['bean','amazake is my love language','甘酒は愛']],
 shots:[
 {d:5,bg:'x_shrine_night',a:[['c_pooh_0',.5,.9,.46,'bob']],fx:[['snow',0,5,{n:14}]],tx:[[0,5,'a cozy neighborhood New Year’s Eve 🔥','ご近所でほっこり年越し 🔥','big',.18]],sx:[[0,'bells']]},
 {d:6,bg:'x_shrine_night',tr:'cut',a:[['c_pooh_1',.5,.9,.44,'talk']],fx:[['glow',0,6,{x:.15,y:.74}]],tx:[[0,6,'📍 Yoyogi Hachimangu, Dec 31','📍 代々木八幡宮・12月31日','loc',.18,{s:.85}],[1.5,6,'bonfires kept by the Boy Scouts light the grounds','ボーイスカウトが守るかがり火が境内を照らす','tag',.3]],sx:[[0,'whoosh']]},
 {d:6,bg:'x_shrine_night',tr:'cut',a:[['p_cup',.5,.6,.13,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.5}]],tx:[[0,6,'kids’ festival music at the kagura stage','神楽殿では子ども囃子','tag',.22],[1.5,6,'+ amazake handed out by the local youth group','氏子青年会の特製甘酒のふるまいも','tag',.32]],sx:[[0,'ding']]},
 {d:6,bg:'x_shrine_night',tr:'zoom',a:[['c_pooh_4',.5,.9,.44,'hop']],fx:[['count',0,3,{x:.5,y:.4,from:3}],['confetti',3,6]],tx:[[3,6,'New Year visits start with the drum at midnight 🥁','元日0時の太鼓を合図に初詣スタート 🥁','tag',.22]],sx:[[0,'tick'],[1,'tick'],[2,'tick'],[3,'cheer']]},
 {d:5,bg:'x_shrine_night',tr:'cut',a:[['c_pooh_2',.5,.9,.44,'bob']],tx:[[0,5,'(as listed on the shrine’s site — check the year-end notice)','（神社公式サイトの記載より・年末のお知らせも確認を）','cap',.2,{wps:4}]],sx:[[0,'chime']]}
]},
// la15 SKATE DIARY: Pershing Square ice rink (Baby Bean watches)
{id:'la15',cat:'la',also:['parent'],bb:1,by:'bronny',song:'xmas',seed:5303,bpm:108,likes:176000,cm:6400,note:1,
 cap:['ice skating in downtown LA (Baby Bean supervised from the stroller) ⛸️🌴 Holiday Ice Rink Pershing Square #dtla #iceskating #babybean','ダウンタウンLAでスケート（ベビービーンはベビーカーから監督）⛸️🌴 #ロサンゼルス #スケート'],
 snd:['Palm Tree Skate','ヤシの木スケート'],
 com:[['pooh','Bronny fell 0 times (he says)','ブロニー転倒0回（本人談）'],['pinco','supervisor bean 🫛📋','監督ビーン🫛📋']],
 shots:[
 {d:5,bg:'la_rink',a:[['c_bronny_1',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'idle']],fx:[['snow',0,5,{n:14}]],tx:[[0,5,'ice skating… in LA ⛸️🌴','LAで…スケート ⛸️🌴','big',.18]],sx:[[0,'bells']]},
 {d:6,bg:B3I,dots:0,tr:'whip',a:[['p_snowflake',.5,.62,.14,'float',{sh:0}]],tx:[[0,6,'📍 Holiday Ice Rink Pershing Square','📍 パーシング・スクエアのホリデー・アイスリンク','loc',.2,{s:.85}],[1.5,6,'open daily Nov 12 – Jan 3','11/12〜1/3 毎日営業','tag',.32]],sx:[[0,'whoosh']]},
 {d:6,bg:B3I,dots:0,tr:'whip',a:[['p_calendar',.5,.62,.14,'float',{sh:0}]],tx:[[0,6,'Mon–Fri 3–10 pm · Sat–Sun noon–10 pm','月〜金15〜22時・土日12〜22時','tag',.22],[1.5,6,'holiday break Dec 21 – Jan 3: noon–10 pm daily','12/21〜1/3は毎日12〜22時','tag',.32]],sx:[[0,'ding']]},
 {d:5,bg:B3I,dots:0,tr:'whip',a:[['p_mittens',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'60-minute sessions, starting every 1.5 hours','1回60分・1.5時間ごとにスタート','tag',.22]],sx:[[0,'ding']]},
 {d:6,bg:'la_rink',tr:'zoom',a:[['c_bronny_4',.35,.9,.42,'wiggle'],['bbean_1',.74,.84,.24,'hop']],fx:[['sparkle',0,6],['emoji',1,6,{e:'👏',x:.74,y:.55,n:4}]],tx:[[0,6,'supervisor rating: giggles ⭐','監督の評価：にっこり ⭐','big',.2]],sx:[[0,'cheer']]}
]},
// bb21 GLOW + TYPE: Baby Bean's first word
{id:'bb21',cat:'parent',also:['comedy'],bb:1,by:'bean',song:'sweet',seed:5304,bpm:100,likes:273000,cm:12900,look:'glow',
 cap:['we waited 7 months for his first word 🫛🗣️ #babybean #firstword','7か月待った、はじめての言葉🫛🗣️ #ベビービーン #はじめての言葉'],
 snd:['First Word Waltz','はじめての言葉ワルツ'],
 com:[['pooping','I was so sure it would be “dada”','絶対「パパ」だと思ってた'],['pooh','“pea” is a strong first word','「ピー」は強い一言目']],
 shots:[
 {d:5,bg:'nursery',a:[['c_bean_0',.33,.9,.42,'talk'],['bbean_0',.73,.84,.26,'idle']],tx:[[0,5,'Dad: say “dada” 🥺','パパ：「パパ」って言って 🥺','type',.2,{cps:20}]],sx:[[0,'type']]},
 {d:5,bg:'nursery',tr:'cut',cam:[1.3,1.3,.5,.55,.5,.5],a:[['bbean_0',.5,.84,.32,'idle']],fx:[['lines',0,5]],tx:[[0,5,'Baby Bean: …','ベビービーン：…','type',.2,{cps:12}]],sx:[[0,'tick']]},
 {d:5,bg:'nursery',tr:'flash',cam:[1.4,1.4,.5,.55,.5,.5],a:[['bbean_1',.5,.84,.32,'hop']],fx:[['impact',0,1],['sparkle',0,5]],tx:[[0,5,'“PEA.”','「ピー」','manga',.22,{rot:-5}]],sx:[[0,'boing'],[.4,'giggle']]},
 {d:6,bg:'nursery',tr:'zoom',a:[['c_bean_3',.33,.9,.42,'shake'],['bbean_1',.73,.84,.26,'hop']],fx:[['tears',0,6,{x:.33,y:.55}],['hearts',0,6,{n:8}]],tx:[[0,6,'close enough. framing it.','もうそれでいい。額に入れる。','type',.2,{cps:20}]],sx:[[0,'aww']]}
]},
// pa11 MANGA PANELS: holiday cookie decorating with toddlers
{id:'pa11',cat:'parent',also:['food'],by:'pinco',song:'comedy',seed:5305,bpm:116,likes:151000,cm:5400,look:'anime',
 cap:['decorating holiday cookies with a toddler: a manga in 4 panels 🍪 #parenting #holidaybaking','幼児とクリスマスクッキー作り：4コマ漫画🍪 #子育て #おうちお菓子'],
 snd:['Sprinkle Panic','トッピング大パニック'],
 com:[['pooh','panel 3 is my kitchen right now','3コマ目、今のうちのキッチン'],['max','I will clean the floor 🐶','床は私が掃除します🐶']],
 shots:[
 {d:5,bg:'kitchen',a:[['c_pinco_1',.33,.9,.42,'dance'],['babies_0',.75,.9,.22,'hop']],fx:[['speed',0,5]],tx:[[0,5,'① “let’s decorate cookies!”','①「クッキー飾ろう！」','manga',.18,{rot:-3}]],sx:[[0,'drop']]},
 {d:5,bg:'kitchen',tr:'whip',a:[['p_cupcake',.5,.62,.14,'float',{sh:0}],['babies_0',.75,.9,.22,'wiggle']],fx:[['sparkle',0,5]],tx:[[0,5,'② ONE sprinkle. very careful.','② トッピング1粒。慎重に。','manga',.18,{rot:3}]],sx:[[0,'tick']]},
 {d:5,bg:'kitchen',tr:'whip',a:[['c_pinco_3',.33,.9,.42,'shake'],['babies_0',.75,.9,.22,'hop']],fx:[['confetti',0,5,{n:60}],['impact',0,1]],tx:[[0,5,'③ the entire jar.','③ 瓶ごと。','manga',.18,{rot:-4}]],sx:[[0,'boing']]},
 {d:6,bg:'kitchen',tr:'zoom',a:[['c_pinco_4',.33,.9,.42,'hop'],['babies_0',.75,.9,.22,'bob']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'④ best cookie of the year 🍪','④ 今年いちばんのクッキー 🍪','manga',.18,{rot:2}]],sx:[[0,'aww']]}
]},
// bb22 POV BUBBLES: Christmas morning
{id:'bb22',cat:'parent',also:['comedy'],bb:1,by:'pooping',song:'xmas',seed:5306,bpm:104,likes:291000,cm:13800,
 cap:['Baby Bean’s first Christmas morning: we bought 3 gifts. he chose the bag. 🎁🫛 #babybean #firstchristmas','ベビービーン初めてのクリスマスの朝：プレゼント3つ。選んだのは袋🎁🫛 #ベビービーン'],
 snd:['Box Day','箱の日'],
 com:[['bean','I have also always preferred the bag','ぼくも昔から袋派'],['pinco','the bow on the bonnet 😭','ボンネットにリボン😭']],
 shots:[
 {d:5,bg:'living',a:[['pooping_parent_1',.38,.9,.44,'talk'],['bbean_0',.74,.84,.26,'idle']],fx:[['snow',0,5,{n:18}],['sparkle',0,5]],tx:[[0,5,'first Christmas morning 🎄','初めてのクリスマスの朝 🎄','big',.17],[1.5,5,'which one will he pick?','どれを選ぶかな？','bub',.32,{x:.3}]],sx:[[0,'bells']]},
 {d:6,bg:'living',tr:'whip',a:[['p_gift',.25,.66,.12,'float',{sh:0}],['p_duck',.5,.66,.11,'float',{sh:0}],['p_rattle',.75,.66,.11,'float',{sh:0}],['bbean_0',.5,.88,.24,'idle']],tx:[[0,6,'option A · option B · option C…','A案・B案・C案…','bub',.3]],sx:[[0,'pop']]},
 {d:5,bg:'living',tr:'flash',a:[['p_bag',.5,.62,.16,'float',{sh:0}],['bbean_1',.5,.86,.28,'hop']],fx:[['impact',0,1],['confetti',0,5]],tx:[[0,5,'he chose: the gift bag 🛍️','選んだのは：プレゼントの袋 🛍️','bub',.3]],sx:[[0,'boing'],[.4,'giggle']]},
 {d:5,bg:'living',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,5,{x:.75,y:.5}],['hearts',0,5,{n:6}]],tx:[[0,5,'merry Christmas from us 🎄🫛','メリークリスマス 🎄🫛','big',.2]],sx:[[0,'aww']]}
]}
);
