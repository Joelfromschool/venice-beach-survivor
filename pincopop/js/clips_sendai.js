'use strict';
// v1.5.7: cafés near Sendai Station East Exit (仙台駅東口). Facts checked 2026-11-26 (JST) on official pages:
// 岳山珈琲 榴岡店 https://www.gakuzancoffee.com/tsutsujigaoka/ ; 珈琲館 BiVi仙台駅東口 https://www.e-bivi.com/sendai/shop/index.jsp?bf=1&fmt=6&shopid=1010 ;
// カフェ・ベローチェ 仙台駅東口駅前店 https://c-united.co.jp/store/detail/000396/ . No prices, no ratings, no logos.
window.CLIPS=window.CLIPS||[];
const SDW='#fff6ea/#ffe7cf',SDB='#eef4ff/#d9e6ff';
const SDN=['☕ check the official site for hours and prices','☕ 営業時間・価格は公式サイトで確認してね'];
CLIPS.push(
{id:'sd01',cat:'food',also:['sendai'],by:'bean',song:'lofi',seed:7201,bpm:84,likes:142000,cm:4300,note:1,
 cap:['Mr Bean reviews a tiny specialty roaster by Sendai Station East Exit ☕🫛 Gakuzan Coffee (Tsutsujigaoka) #sendai #仙台駅東口 #coffee','ミスター・ビーンが仙台駅東口の小さな焙煎店をレビュー☕🫛 岳山珈琲 榴岡店 #仙台 #仙台駅東口 #カフェ'],
 snd:['East Exit Beans','東口のコーヒー豆'],
 com:[['pinco','the free tasting by the register 😍','レジ横の試飲うれしい😍'],['pooh','@mr.bean.pod how did you hold the cup','@mr.bean.pod どうやってカップ持ったの'],['sawtelle','adding Sendai to the coffee list','仙台もコーヒーリストに追加']],
 shots:[
 {d:5,bg:'cafe',a:[['c_bean_1',.5,.9,.44,'bob',{in:'pop'}]],fx:[['steam',0,5,{x:.5,y:.4}]],tx:[[0,5,'Sendai Station East Exit coffee run ☕','仙台駅東口でコーヒー散歩 ☕','big',.18]],sx:[[0,'pop']]},
 {d:6,bg:SDW,dots:0,tr:'slide',a:[['p_mug',.42,.6,.14,'float',{sh:0}],['c_bean_0',.8,.96,.22,'bob']],tx:[[0,6,'📍 Gakuzan Coffee · Tsutsujigaoka','📍 岳山珈琲 榴岡店','loc',.2,{s:.85}],[1.5,6,'about 5 min walk from Sendai Station · 3 min from Miyagino-dori Sta.','仙台駅から徒歩約5分・宮城野通駅から約3分','tag',.33,{s:1.2}]],sx:[[0,'shutter']]},
 {d:6,bg:SDW,dots:0,tr:'slide',a:[['p_cup',.42,.6,.13,'float',{sh:0}],['c_bean_0',.8,.96,.22,'bob']],tx:[[0,6,'a small shop for beans + takeaway','豆の販売とテイクアウト中心の小さなお店','tag',.22,{s:1.2}],[1.5,6,'free tasting to the left of the register','レジ左手に試飲あり','tag',.33,{s:1.2}]],sx:[[0,'ding']]},
 {d:6,bg:SDW,dots:0,tr:'slide',a:[['p_calendar',.42,.6,.14,'float',{sh:0}],['c_bean_0',.8,.96,.22,'bob']],tx:[[0,6,'open Mon, Fri, Sat for now','営業日は当面の間 月・金・土','tag',.22,{s:1.2}],[1.5,6,'bring your own container for extra beans','容器持参で豆が増量','tag',.33,{s:1.2}]],sx:[[0,'ding']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['c_bean_3',.5,.9,.44,'hop']],fx:[['sparkle',0,6]],tx:[[0,6,'Mr Bean’s verdict: smelled it for 10 minutes 🫛','ビーンの感想：10分間ずっと香りをかいでた🫛','cap',.2,{wps:3}],[1.5,6,SDN[0],SDN[1],'tag',.34]],sx:[[0,'chime']]}
 ]},
{id:'sd02',cat:'food',also:['sendai','parent'],bb:1,by:'pooping',song:'sweet',seed:7202,bpm:96,likes:188000,cm:6100,note:1,
 cap:['stroller-friendly café stop at Sendai Station East Exit 🥞🫛 Kohikan in BiVi #sendai #仙台駅東口 #hotcakes','仙台駅東口、ベビーカーで入れるカフェ休憩🥞🫛 BiVi仙台駅東口の珈琲館 #仙台 #ホットケーキ'],
 snd:['Hotcake Stop','ホットケーキ休憩'],
 com:[['yoyogimama','stroller-friendly is everything 🌸','ベビーカーOKは本当に助かる🌸'],['bean','@baby.bean did you share','@baby.bean 分けてもらった？'],['pinco','seasonal hotcake?? 🍠','季節限定ホットケーキ？？🍠']],
 shots:[
 {d:5,bg:'cafe',a:[['pooping_parent_0',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'idle']],tx:[[0,5,'Sendai trip: café break with a baby 🥞','仙台旅：赤ちゃん連れでカフェ休憩 🥞','big',.18]],sx:[[0,'pop']]},
 {d:6,bg:SDB,dots:0,tr:'whip',a:[['p_pancakes',.42,.6,.15,'float',{sh:0}],['bbean_2',.8,.94,.17,'bob']],tx:[[0,6,'📍 Kohikan · BiVi Sendai East Exit 1F','📍 珈琲館・BiVi仙台駅東口 1F','loc',.2,{s:.85}],[1.5,6,'8:00–21:00 (last order 20:30)','8:00〜21:00（ラストオーダー20:30）','tag',.33,{s:1.2}]],sx:[[0,'whoosh']]},
 {d:6,bg:SDB,dots:0,tr:'whip',a:[['p_onesie',.42,.6,.13,'float',{sh:0}],['bbean_2',.8,.94,.17,'bob']],tx:[[0,6,'strollers + wheelchairs can come right in','ベビーカー・車いすのまま入店OK','tag',.22,{s:1.2}],[1.5,6,'23 table seats · non-smoking · takeout too','テーブル23席・禁煙・テイクアウト可','tag',.33,{s:1.2}]],sx:[[0,'ding']]},
 {d:6,bg:SDB,dots:0,tr:'whip',a:[['p_pancakes',.42,.6,.14,'float',{sh:0}],['bbean_2',.8,.94,.17,'bob']],fx:[['steam',0,6,{x:.5,y:.52}]],tx:[[0,6,'hotcakes are on the menu','ホットケーキあり','tag',.22,{s:1.2}],[1.5,6,'(they posted a seasonal sweet-potato one in Oct)','（10月に季節限定スイートポテトのお知らせあり）','tag',.33,{s:1.2}]],sx:[[0,'ding']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_1',.74,.84,.24,'hop']],fx:[['hearts',0,6,{n:6}]],tx:[[0,6,'Baby Bean’s verdict: the syrup smell 😍','ベビービーンの感想：シロップの香り😍','cap',.2,{wps:3}],[1.5,6,SDN[0],SDN[1],'tag',.34]],sx:[[0,'aww']]}
 ]},
{id:'sd03',cat:'food',also:['sendai'],by:'pinco',song:'lofi',seed:7203,bpm:88,likes:131000,cm:3900,note:1,
 cap:['laptop + latte 1 minute from Sendai Station East Exit 💻☕ Café Veloce #sendai #仙台駅東口 #workcafe','仙台駅東口から徒歩1分、PC作業カフェ💻☕ カフェ・ベローチェ #仙台 #作業カフェ'],
 snd:['Outlet Found','コンセント発見'],
 com:[['asmon','free Wi-Fi + outlets = my office now','Wi-Fi＋コンセント＝もう俺のオフィス'],['pooh','7 am? I can do 7 am','朝7時？いける'],['bean','@pinco.glam what are you typing','@pinco.glam 何打ってるの']],
 shots:[
 {d:5,bg:'cafe',a:[['c_pinco_2',.5,.9,.44,'bob']],tx:[[0,5,'need a work café at Sendai Station? 💻','仙台駅で作業カフェ探してる？💻','big',.18]],sx:[[0,'pop']]},
 {d:6,bg:SDW,dots:0,tr:'slide',a:[['p_phone',.42,.6,.13,'float',{sh:0}],['c_pinco_0',.8,.96,.26,'bob']],tx:[[0,6,'📍 Café Veloce · Sendai Station East Exit','📍 カフェ・ベローチェ 仙台駅東口駅前店','loc',.2,{s:.85}],[1.5,6,'1 min walk from the East Exit · 7:00–22:30','東口から徒歩1分・7:00〜22:30','tag',.33,{s:1.2}]],sx:[[0,'shutter']]},
 {d:6,bg:SDW,dots:0,tr:'slide',a:[['p_mug',.42,.6,.14,'float',{sh:0}],['c_pinco_0',.8,.96,.26,'bob']],fx:[['check',.6,6]],tx:[[0,6,'free Wi-Fi + outlets for customers','Free Wi-Fi・お客様用コンセントあり','tag',.22,{s:1.2}],[1.5,6,'non-smoking seats (separate smoking booth)','全席禁煙（喫煙ブースは別室）','tag',.33,{s:1.2}]],sx:[[0,'ding']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['c_pinco_5',.5,.9,.44,'hop']],fx:[['sparkle',0,6]],tx:[[0,6,'Pinco’s verdict: answered 0 emails, had 2 lattes ☕','ピンコの感想：メール0件、ラテ2杯☕','cap',.2,{wps:3}],[1.5,6,SDN[0],SDN[1],'tag',.34]],sx:[[0,'chime']]}
 ]}
);
