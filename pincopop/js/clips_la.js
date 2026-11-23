'use strict';
// LA tab (v1.4): local LA cafés, Christmas / New Year 2026–27 events and Sawtelle Japantown spots.
// Every date / address / hour below was checked on the official page on 2026-11-23 (JST); see the v1.4 report for sources.
// No prices, no ratings. Each clip shows the "check the official site" note (clip.note). Original art, no logos.
window.CLIPS=window.CLIPS||[];
const LAN='#0b1534/#3a1d5e',LAS='#fff4e0/#ffd9b8',LAC='#fff6ec/#f3e4d2';
CLIPS.push(
// la01 COUNTDOWN: 4 LA holiday light nights (glow)
{id:'la01',cat:'la',by:'bronny',song:'xmas',seed:5001,bpm:108,likes:226000,cm:9400,look:'glow',note:1,
 cap:['4 LA holiday light nights to save this season 🎄🌴 #losangeles #holidaylights #LAchristmas','この冬保存したいLAのイルミ4選🎄🌴 #ロサンゼルス #イルミネーション'],
 snd:['Palm Tree Lights Countdown','ヤシの木イルミ・カウントダウン'],
 com:[['pinco','#1 is my whole weekend 🛥️💗','1位で週末決まり🛥️💗'],['prof','Dates match the official pages. Approved.','日程は公式どおり。承認。']],
 shots:[
 {d:5,bg:'la_lights',cam:[1.1,1.02,.5,.5,.45,.5],a:[['c_bronny_3',.5,.9,.46,'bob',{in:'pop'}]],fx:[['sparkle',0,5,{x:.5,y:.35,r:.3}]],tx:[[0,5,'4 LA holiday light nights 🎄🌴','LAのイルミ4選 🎄🌴','big',.17]],sx:[[0,'bells']]},
 {d:6,bg:'la_lights',tr:'whip',cam:[1,1.1,.5,.5,.5,.45],a:[['c_pinco_2',.74,.9,.38,'idle']],fx:[['bokeh',0,6,{cols:['#ffd88a','#ff9ad5']}]],tx:[[0,6,'4','4','num',.2,{x:.25}],[.4,6,'📍 L.A. Zoo Lights','📍 L.A. Zoo Lights（ロサンゼルス動物園）','loc',.36,{x:.45}],[1.2,6,'select nights Nov 20 – Jan 10','11/20〜1/10の指定日の夜','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:6,bg:'la_lights',tr:'whip',cam:[1.2,1.25,.7,.3,.4,.4],a:[['c_pooh_1',.72,.9,.38,'bob']],fx:[['sparkle',0,6,{x:.4,y:.45,r:.2}]],tx:[[0,6,'3','3','num',.2,{x:.25}],[.4,6,'📍 Enchanted · Descanso Gardens','📍 デスカンソ・ガーデンズ「Enchanted」','loc',.36,{x:.45}],[1.2,6,'10th year! Nov 22 – Jan 9','10周年！11/22〜1/9','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:6,bg:'la_harbor',tr:'whip',cam:[1,1.08,.5,.5,.5,.55],a:[['c_bean_1',.72,.9,.38,'bob']],fx:[['stars',0,6]],tx:[[0,6,'2','2','num',.2,{x:.25}],[.4,6,'📍 Harbor Glow · West Harbor, San Pedro','📍 ハーバー・グロウ（サンペドロ）','loc',.36,{x:.45}],[1.2,6,'nightly Nov 20 – Jan 3','11/20〜1/3 毎晩','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:7,bg:'la_harbor',tr:'zoom',cam:[1,1.1,.5,.5,.5,.45],a:[['c_bronny_1',.3,.9,.4,'hop'],['c_pinco_1',.72,.9,.4,'hop']],fx:[['sparkle',0,7,{x:.5,y:.3,r:.3}],['confetti',1,7]],tx:[[0,7,'1','1','num',.2,{x:.25}],[.4,7,'📍 Marina del Rey Holiday Boat Parade','📍 マリナ・デル・レイ ホリデー・ボートパレード','loc',.36,{x:.45,s:.9}],[1.2,7,'Sat Dec 12 · starts with a light show','12/12(土)・ライトショーで開幕','tag',.46]],sx:[[0,'whoosh'],[.4,'pop'],[1.2,'cheer']]}
]},
// la02 NIGHT VLOG: L.A. Zoo Lights (REC, typewriter)
{id:'la02',cat:'la',also:['parent'],by:'pooping',song:'lofi',seed:5002,bpm:84,likes:188000,cm:7100,look:'night',note:1,
 cap:['family night at L.A. Zoo Lights 🦋✨ plants, pollinators + Ice Age giants in lights #lazoolights #losangeles','家族でL.A. Zoo Lightsへ🦋✨ 植物・虫・氷河期の巨獣が光る #ロサンゼルス #イルミネーション'],
 snd:['Glow Walk','光のさんぽ'],
 com:[['max','I would like to meet the Ice Age giants 🐶','氷河期の巨獣に会いたい🐶'],['pinco','saving the closed dates 🙏','休みの日も保存🙏']],
 shots:[
 {d:5,bg:'la_lights',cam:[1.15,1.05,.5,.5,.45,.45],a:[['pooping_parent_0',.5,.9,.46,'bob',{in:'pop'}]],fx:[['rec',0,5]],tx:[[0,5,'family night at L.A. Zoo Lights 🦋','家族でL.A. Zoo Lights 🦋','big',.27]],sx:[[0,'shutter']]},
 {d:6,bg:'la_lights',tr:'cut',cam:[1.3,1.3,.6,.4,.5,.5],a:[['babies_1',.5,.84,.3,'idle']],fx:[['sparkle',0,6,{x:.5,y:.35,r:.25}]],tx:[[0,6,'2026 theme: plants, pollinators and Ice Age giants — all in light','2026年のテーマは植物・ポリネーター・氷河期の巨獣、ぜんぶ光で','type',.22,{cps:24}]],sx:[[0,'type']]},
 {d:6,bg:'la_lights',tr:'cut',cam:[1.2,1.2,.35,.6,.5,.5],a:[['pooping_parent_1',.5,.9,.44,'talk']],tx:[[0,6,'select nights Nov 20 – Jan 10 · most people spend 60–90 min','11/20〜1/10の指定日・所要時間はだいたい60〜90分','type',.22,{cps:24}]],sx:[[0,'type']]},
 {d:6,bg:'la_lights',tr:'cut',a:[['pooping_parent_2',.5,.9,.44,'idle']],fx:[['snow',0,6,{n:20}]],tx:[[0,6,'closed: Nov 26, 30 · Dec 1, 7, 14–16, 24, 25, 31 · Jan 4–7','休み：11/26・30、12/1・7・14〜16・24・25・31、1/4〜7','type',.22,{cps:28}]],sx:[[0,'type']]},
 {d:5,bg:'la_lights',tr:'zoom',a:[['pooping_parent_0',.35,.9,.42,'bob'],['babies_1',.72,.86,.26,'hop']],fx:[['hearts',0,5,{x:.6,y:.5,n:8}]],tx:[[0,5,'quieter Sensory Inclusive night: Tue Dec 8 💙','音や混雑を控えめにした夜：12/8(火) 💙','cap',.22,{wps:3}]],sx:[[0,'aww']]}
]},
// la03 ASMR: Enchanted at Descanso Gardens
{id:'la03',cat:'la',by:'pinco',song:'asmr',seed:5003,bpm:66,likes:154000,cm:5200,look:'asmr',note:1,
 cap:['whisper tour: Enchanted at Descanso Gardens, 10th year 🌸✨ #descanso #enchanted #asmr','ささやきツアー：デスカンソ・ガーデンズ「Enchanted」10周年🌸✨ #ASMR'],
 snd:['Forest of Light (whisper)','光の森（ささやき）'],
 com:[['bean','the koi!!! (quietly)','鯉！！！（小声）'],['asmon','the laser snowfall in California. respect.','カリフォルニアでレーザーの雪。敬意。']],
 shots:[
 {d:6,bg:'la_lights',cam:[1.2,1.1,.5,.5,.5,.5],a:[['c_pinco_0',.5,.9,.44,'sway']],fx:[['bokeh',0,6,{cols:['#ffb0d8','#c9a8ff']}]],tx:[[0,6,'🎧 ASMR','🎧 ASMR','pill',.16,{x:.15,s:.7}],[.5,6,'Enchanted at Descanso Gardens, 10 years 🌸','デスカンソ・ガーデンズ「Enchanted」10周年 🌸','cap',.25,{wps:2}]],sx:[[0,'chime']]},
 {d:7,bg:'la_lights',tr:'cut',cam:[1.4,1.5,.65,.4,.6,.4],fx:[['sparkle',0,7,{x:.5,y:.4,r:.3}]],tx:[[0,7,'new this year: a laser light show with a “snowfall” finale','今年の新作：「雪」がフィナーレのレーザーショー','cap',.25,{wps:2}]],sx:[[0,'sparkle']]},
 {d:7,bg:'la_lights',tr:'cut',cam:[1.3,1.3,.3,.7,.4,.6],a:[['c_pinco_4',.6,.9,.42,'idle']],fx:[['glow',0,7,{x:.4,y:.6,c:'rgba(255,170,120,.6)'}]],tx:[[0,7,'Giant Koi for the Japanese Garden’s 60th anniversary 🎏','日本庭園60周年を祝う「ジャイアント・コイ」🎏','cap',.25,{wps:2}]],sx:[[0,'chime']]},
 {d:6,bg:'la_lights',tr:'cut',a:[['c_pinco_2',.5,.9,.44,'sway']],fx:[['stars',0,6]],tx:[[0,6,'Nov 22 – Jan 9 · Holiday Market Dec 2–6 ✨','11/22〜1/9・ホリデーマーケットは12/2〜6 ✨','cap',.25,{wps:2}]],sx:[[0,'chime']]}
]},
// la04 POV / duet-style: Harbor Glow
{id:'la04',cat:'la',by:'bean',song:'synth',seed:5004,bpm:100,likes:132000,cm:4300,note:1,
 cap:['POV: you said “let’s go see boats” and it turned into Harbor Glow 🛥️✨ #sanpedro #harborglow','POV：「船見よう」が「ハーバー・グロウ」になった🛥️✨ #サンペドロ'],
 snd:['Harbor Synthwave','ハーバー・シンセウェーブ'],
 com:[['bronny','open on Christmas Day too?? say less','クリスマス当日もやってる？了解'],['pooh','are the boats edible','その船食べられる？']],
 shots:[
 {d:5,bg:'la_harbor',cam:[1.2,1.05,.5,.5,.5,.5],a:[['c_bean_0',.5,.9,.44,'bob',{in:'pop'}]],tx:[[0,5,'POV: “let’s go see boats” 🛥️','POV：「船見に行こう」🛥️','big',.24]],sx:[[0,'pop']]},
 {d:6,bg:'la_harbor',tr:'glitch',cam:[1.4,1.4,.3,.5,.4,.45],fx:[['stars',0,6],['sparkle',0,6,{x:.3,y:.45,r:.2}]],tx:[[0,6,'📍 Harbor Glow · West Harbor, San Pedro','📍 ハーバー・グロウ（ウェストハーバー／サンペドロ）','loc',.24,{x:.5,s:.9}],[1,6,'open every night Nov 20 – Jan 3, holidays included','11/20〜1/3、祝日も含めて毎晩','tag',.34]],sx:[[0,'whoosh']]},
 {d:6,bg:'la_harbor',tr:'cut',a:[['c_bean_2',.5,.9,.44,'talk']],tx:[[0,6,'Fri–Sun 5:00–10:30 pm · Mon–Thu 5:30–9:30 pm','金〜日 17:00〜22:30・月〜木 17:30〜21:30','tag',.24],[1.5,6,'timed tickets: arrive ~15 min early','時間指定チケット：15分前には到着を','tag',.34]],sx:[[0,'ding']]},
 {d:5,bg:'la_harbor',tr:'zoom',a:[['c_bean_1',.5,.9,.46,'hop']],fx:[['confetti',0,5]],tx:[[0,5,'Christmas Eve + New Year’s Eve: open till 10:30 pm 🎆','イブと大みそかは22:30まで 🎆','big',.24]],sx:[[0,'cheer']]}
]},
// la05 ANIME: Marina del Rey Holiday Boat Parade
{id:'la05',cat:'la',by:'pinco',song:'anime',seed:5005,bpm:150,likes:171000,cm:6600,look:'anime',note:1,
 cap:['EPISODE 64: the Holiday Boat Parade ⛵✨ “Hollywood Under The Stars” #marinadelrey #boatparade','第64話：ホリデー・ボートパレード⛵✨「Hollywood Under The Stars」 #マリナデルレイ'],
 snd:['Sail Henshin','セイル変身'],
 com:[['party','boats in costumes 🎉🎉','コスプレする船🎉🎉'],['bronny','Westside represent 🌴','ウエストサイド代表🌴']],
 shots:[
 {d:7,bg:'la_harbor',cam:[1.2,1,.5,.5,.4,.5],a:[['c_pinco_3',.5,.9,.48,'hop',{in:'b'}]],fx:[['lines',0,7],['speed',0,7]],tx:[[0,7,'EPISODE 64','第64話','manga',.18,{rot:-6}],[2,7,'The Holiday Boat Parade','ホリデー・ボートパレード','big',.3]],sx:[[0,'riser'],[2,'drop']]},
 {d:7,bg:'la_harbor',tr:'spin',a:[['c_pinco_1',.5,.9,.44,'dance']],fx:[['speed',0,7],['sparkle',0,7,{x:.5,y:.35,r:.35}]],tx:[[0,7,'theme: “Hollywood Under The Stars”!!','テーマは「Hollywood Under The Stars」！！','manga',.2,{rot:4}]],sx:[[0,'whoosh']]},
 {d:7,bg:'la_harbor',tr:'whip',cam:[1.3,1.3,.3,.7,.5,.5],a:[['c_pinco_4',.3,.9,.42,'hop'],['c_party_2',.7,.9,.4,'hop']],fx:[['lines',0,7,{c:'#ffd0f0'}]],tx:[[0,7,'Saturday, Dec 12!','12月12日（土）！','manga',.2,{rot:-4}],[2,7,'boats in lights + costumes + live music','光る船・仮装・生演奏','tag',.32]],sx:[[0,'drop'],[2,'ding']]},
 {d:6,bg:'la_harbor',tr:'zoom',a:[['c_pinco_2',.5,.9,.46,'hop']],fx:[['rays',0,6,{c:'#ffe0f6'}],['confetti',1,6]],tx:[[0,6,'TO BE CONTINUED…','つづく…','manga',.2,{rot:-3}]],sx:[[0,'drop'],[1,'cheer']]}
]},
// la06 SILENT FILM: Hollywood Christmas Parade
{id:'la06',cat:'la',by:'asmon',song:'silent',seed:5006,bpm:132,likes:149000,cm:5100,look:'film',bw:1,note:1,
 cap:['a silent film about the Hollywood Christmas Parade 🎞️🎄 Sun Nov 29 #hollywood #christmasparade','サイレント映画で紹介：ハリウッド・クリスマス・パレード🎞️🎄 11/29(日) #ハリウッド'],
 snd:['Ragtime on the Boulevard','大通りのラグタイム'],
 com:[['bean','the title cards 😭','字幕カード😭'],['pinco','toys for tots 🥹💗','おもちゃの寄付🥹💗']],
 shots:[
 {d:6,bg:'#111/#222',dots:0,tx:[[0,6,'“THE PARADE”\na Hollywood tradition since 1928','「パレード」\n1928年から続くハリウッドの伝統','serif',.4]],sx:[[0,'tick']]},
 {d:7,bg:'stage',tr:'cut',a:[['c_asmon_2',.45,.9,.44,'bob',{mv:[.6,.9],mvd:7}]],tx:[[0,7,'Act I. A former villain hears about a parade.','第一幕：元・悪役、パレードのうわさを聞く。','serif',.2,{s:.85}]],sx:[[0,'boing']]},
 {d:6,bg:'#111/#222',dots:0,tr:'cut',tx:[[0,6,'The 94th Hollywood Christmas Parade.\nSunday, November 29, 2026.','第94回ハリウッド・クリスマス・パレード\n2026年11月29日（日）','serif',.4]],sx:[[0,'tick']]},
 {d:7,bg:'stage',tr:'cut',a:[['c_asmon_4',.5,.9,.44,'hop']],fx:[['confetti',0,7]],tx:[[0,7,'Act II. He learns it supports Toys for Tots.','第二幕：「Toys for Tots」支援と知る。','serif',.2,{s:.85}]],sx:[[0,'cheer']]},
 {d:5,bg:'#111/#222',dots:0,tr:'cut',tx:[[0,5,'He is now a good guy.\nTHE END','そして彼は善人になった。\n完','serif',.4]],sx:[[0,'tick']]}
]},
// la07 SPLIT SCREEN: NYELA expectation vs reality
{id:'la07',cat:'la',by:'bronny',song:'comedy',seed:5007,bpm:116,likes:197000,cm:8800,note:1,
 cap:['New Year’s Eve in DTLA: expectation vs reality 🎆 NYELA at Grand Park, free with RSVP #NYELA #grandpark','DTLAの大みそか：理想vs現実🎆 グランドパークのNYELA（無料・要RSVP） #NYELA'],
 snd:['Countdown Crew','カウントダウン隊'],
 com:[['pooh','30+ food vendors?? I’m going','屋台30以上？行く'],['asmon','the worries trash bin is genius','悩みを捨てるゴミ箱、天才']],
 shots:[
 {d:5,bg:'#0b1534/#3a1d5e',dots:0,a:[['c_bronny_2',.5,.9,.46,'bob',{in:'pop'}]],fx:[['stars',0,5]],tx:[[0,5,'NYE in DTLA 🎆','DTLAで年越し 🎆','big',.22],[1,5,'Gloria Molina Grand Park’s NYELA','グロリア・モリーナ・グランドパーク「NYELA」','tag',.33]],sx:[[0,'riser']]},
 {d:9,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:LAN,a:[['c_bronny_4',.5,.92,.44,'dance']],fx:[['confetti',0,9],['sparkle',0,9,{x:.5,y:.3}]],tx:[[0,9,'EXPECTATION','理想','pill',.16]]},{r:[.5,0,.5,1],bg:LAN,a:[['c_pooh_2',.5,.92,.44,'bob'],['p_taco',.75,.6,.1,'float',{sh:0}]],fx:[['steam',0,9,{x:.7,y:.55}]],tx:[[0,9,'REALITY','現実','pill',.16],[2,9,'still in the\nfood line','まだ屋台の\n行列','tag',.3,{x:.4}]]}],sx:[[0,'swish'],[2,'pop'],[3,'laugh']]},
 {d:6,bg:LAN,dots:0,tr:'cut',a:[['c_bronny_1',.5,.9,.44,'talk']],tx:[[0,6,'Thu Dec 31, 8 pm – 1 am · free, RSVP online','12/31(木) 20:00〜翌1:00・無料、オンラインでRSVP','tag',.22],[1.5,6,'alcohol-free · midnight art show on City Hall','アルコールなし・0時に市庁舎へアート投影','tag',.32]],sx:[[0,'ding']]},
 {d:5,bg:LAN,dots:0,tr:'zoom',a:[['c_bronny_3',.35,.9,.42,'hop'],['c_pooh_3',.7,.9,.4,'hop']],fx:[['confetti',0,5],['stars',0,5]],tx:[[0,5,'3… 2… 1… HAPPY 2027! 🎉','3…2…1…ハッピー2027！🎉','big',.22]],sx:[[0,'cheer']]}
]},
// la08 VHS home video: Rose Parade New Year's Day
{id:'la08',cat:'la',also:['parent'],by:'pooh',song:'synth',seed:5008,bpm:96,likes:163000,cm:5900,look:'vhs',vhsDate:'FRI.JAN.01 2027',note:1,
 cap:['New Year’s Day plan: the 138th Rose Parade in Pasadena 🌹 theme “Welcome” #roseparade #pasadena','元日の予定：パサデナの第138回ローズパレード🌹 テーマは「Welcome」 #ローズパレード'],
 snd:['Float Tape ’27','フロートテープ’27'],
 com:[['pinco','floats made of flowers 😭🌹','花でできたフロート😭🌹'],['pooping','camping on the curb with snacks: yes','おやつ持って沿道待機：する']],
 shots:[
 {d:5,bg:'promenade',a:[['c_pooh_3',.5,.9,.46,'bob']],tx:[[0,5,'NEW YEAR’S DAY TAPE','元日のテープ','retro',.27]],sx:[[0,'tape']]},
 {d:6,bg:'promenade',tr:'glitch',a:[['c_pooh_0',.5,.9,.44,'talk']],tx:[[0,6,'the 138th Rose Parade · Fri Jan 1, 2027','第138回ローズパレード・2027年1月1日（金）','retro',.27,{s:.85}],[2.5,6,'steps off at 8 am (Pacific)','朝8時（太平洋時間）スタート','retro',.4,{s:.85}]],sx:[[0,'scratch']]},
 {d:6,bg:LAS,tr:'glitch',a:[['p_heart',.3,.6,.12,'float',{sh:0}],['p_star',.7,.6,.12,'float',{sh:0}]],fx:[['confetti',0,6]],tx:[[0,6,'this year’s theme: “Welcome” 🌹','今年のテーマ：「Welcome」🌹','retro',.27,{s:.85}],[2.5,6,'floats, marching bands + horses on Colorado Blvd','コロラド大通りにフロート・マーチングバンド・馬','retro',.4,{s:.8}]],sx:[[0,'tape']]},
 {d:5,bg:'promenade',tr:'glitch',a:[['c_pooh_1',.35,.9,.42,'hop'],['babies_1',.72,.86,.26,'bob']],tx:[[0,5,'happy new year from Pasadena 🌹','パサデナからあけおめ 🌹','retro',.27]],sx:[[0,'cheer']]}
]},
// la09 TIER LIST: holiday + NYE 2026–27 planner
{id:'la09',cat:'la',by:'pinco',song:'comedy',seed:5009,bpm:112,likes:181000,cm:10400,note:1,
 cap:['LA holiday season tier list 2026–27 🌴🎄 (by vibe, not quality) #LA #tierlist','LAホリデーシーズン格付け2026–27🌴🎄（気分で分類） #格付け'],
 snd:['Tier Time','格付けタイム'],
 com:[['bronny','putting the boat parade in “chaos” is accurate','ボートパレードが「カオス」なの正しい'],['bean','I am cozy tier','ぼくはほっこり枠']],
 shots:[
 {d:4,bg:'la_lights',a:[['c_pinco_5',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,4,'LA holiday tier list 🌴🎄','LAホリデー格付け 🌴🎄','big',.2],[1,4,'(by vibe, not quality)','（気分で分類・優劣じゃないよ）','tag',.3]],sx:[[0,'pop']]},
 {d:12,bg:'#1d1430/#3a2350',dots:0,tr:'whip',fx:[['tier',0,12,{rows:[['cozy','ほっこり'],['sparkly','キラキラ'],['family','ファミリー'],['chaos','カオス']],y:.22,rh:.11,items:[['bg_la_lights',1,.6],['bg_la_harbor',3,2],['bg_stage',3,3.4],['bg_promenade',2,4.8],['bg_la_cafe',0,6.2]]}]],tx:[[.6,2,'Descanso “Enchanted” (Nov 22–Jan 9)','デスカンソ「Enchanted」（11/22〜1/9）','tag',.72],[2,3.4,'Boat Parade (Sat Dec 12)','ボートパレード（12/12）','tag',.72],[3.4,4.8,'NYELA (Dec 31, free + RSVP)','NYELA（12/31・無料／要RSVP）','tag',.72],[4.8,6.2,'Rose Parade (Jan 1)','ローズパレード（1/1）','tag',.72],[6.2,8,'a latte the morning after','翌朝のラテ','tag',.72],[8,12,'save for your plans 📌','予定用に保存📌','tag',.72]],sx:[[.6,'pop'],[2,'pop'],[3.4,'pop'],[4.8,'pop'],[6.2,'pop']]}
]},
// la10 ASMR café: Intelligentsia Venice
{id:'la10',cat:'la',also:['food'],by:'bronny',song:'asmr',seed:5010,bpm:66,likes:142000,cm:4700,look:'asmr',note:1,
 cap:['ASMR coffee morning on Abbot Kinney before the courts ☕🌴 Intelligentsia Venice #venice #coffee','コートの前にアボット・キニーでコーヒーASMR☕🌴 #ベニス #カフェ'],
 snd:['Patio Pour (ASMR)','パティオで一杯（ASMR）'],
 com:[['pinco','the patio 😭','パティオ😭'],['max','dogs on the patio? asking for me','パティオに犬OK？自分用の質問']],
 shots:[
 {d:6,bg:'la_cafe',cam:[1.15,1.05,.5,.5,.5,.55],a:[['c_bronny_0',.5,.9,.44,'sway']],tx:[[0,6,'🎧 ASMR','🎧 ASMR','pill',.16,{x:.15,s:.7}],[.5,6,'coffee before the courts ☕','コートの前にコーヒー ☕','cap',.25,{wps:2}]],sx:[[0,'pour']]},
 {d:6,bg:LAC,dots:0,tr:'cut',a:[['p_mug',.5,.58,.18,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.46}]],tx:[[0,6,'📍 Intelligentsia · 1331 Abbot Kinney Blvd, Venice','📍 インテリジェンシア・ベニス（アボット・キニー通り1331）','cap',.25,{wps:2}]],sx:[[0,'slurp']]},
 {d:6,bg:'la_cafe',tr:'cut',cam:[1.3,1.35,.6,.5,.65,.6],tx:[[0,6,'open daily 6 am – 5 pm · patio + free wifi','毎日6:00〜17:00・パティオ席と無料Wi-Fi','cap',.25,{wps:2}]],sx:[[0,'pour']]},
 {d:5,bg:'boardwalk',tr:'cut',a:[['c_bronny_3',.5,.9,.44,'bob']],tx:[[0,5,'…ok now the courts 🏀','…よし、コート行こ 🏀','cap',.25,{wps:2}]],sx:[[0,'chime']]}
]},
// la11 COFFEE CRAWL (typewriter list): Maru Coffee + Go Get Em Tiger
{id:'la11',cat:'la',also:['food'],by:'asmon',song:'lofi',seed:5011,bpm:84,likes:126000,cm:4100,note:1,
 cap:['an ex-villain’s LA coffee crawl ☕ Maru Coffee + Go Get Em Tiger #LAcoffee #coffeecrawl','元・悪役のLAコーヒーはしご☕ マル・コーヒー＋ゴー・ゲット・エム・タイガー #LAカフェ'],
 snd:['Pour-Over Plot','ハンドドリップの陰謀'],
 com:[['bean','Grand Central Market + coffee = my whole day','グランド・セントラル・マーケット＋コーヒー＝1日終わる'],['prof','Hours match the official pages.','営業時間は公式どおり。']],
 shots:[
 {d:5,bg:'la_cafe',a:[['c_asmon_1',.5,.9,.46,'bob',{in:'pop'}]],tx:[[0,5,'an ex-villain’s LA coffee crawl ☕','元・悪役のLAコーヒーはしご ☕','big',.2]],sx:[[0,'evil']]},
 {d:7,bg:LAC,dots:0,tr:'slide',a:[['p_cup',.5,.62,.16,'float',{sh:0}]],tx:[[0,7,'📍 Maru Coffee','📍 マル・コーヒー','loc',.2,{x:.5}],[.6,7,'Los Feliz · 1936 Hillhurst Ave · Mon–Sat 7–5, Sun 8–5','ロスフェリズ（ヒルハースト通り1936）・月〜土7〜17時、日8〜17時','type',.3,{cps:26}],[3.8,7,'also Arts District + Beverly Hills','アーツ・ディストリクトとビバリーヒルズにも','type',.42,{cps:26}]],sx:[[0,'type']]},
 {d:7,bg:LAC,dots:0,tr:'slide',a:[['p_mug',.5,.62,.16,'float',{sh:0}]],tx:[[0,7,'📍 Go Get Em Tiger','📍 ゴー・ゲット・エム・タイガー','loc',.2,{x:.5}],[.6,7,'the first one opened on Larchmont in 2013','1号店は2013年にラーチモントで開店','type',.3,{cps:26}],[3.5,7,'Larchmont: weekdays 6:30 am–6 pm, weekends 7 am–6 pm','ラーチモント店：平日6:30〜18時、週末7〜18時','type',.42,{cps:26}]],sx:[[0,'type']]},
 {d:6,bg:LAC,dots:0,tr:'slide',a:[['p_cup',.35,.62,.13,'float',{sh:0}],['p_mug',.65,.62,.13,'float',{sh:0}]],tx:[[0,6,'+ a bar inside Grand Central Market (8–5 daily)','＋グランド・セントラル・マーケット内にも（毎日8〜17時）','type',.3,{cps:26}]],sx:[[0,'type']]},
 {d:5,bg:'la_cafe',tr:'zoom',a:[['c_asmon_5',.5,.9,.46,'shake']],fx:[['sweat',0,5,{x:.42,y:.5}]],tx:[[0,5,'caffeine level: villain again 😈','カフェイン量：また悪役に😈','big',.22]],sx:[[0,'evil']]}
]},
// la12 SAWTELLE food crawl (vlog)
{id:'la12',cat:'la',also:['food'],by:'bean',song:'sweet',seed:5012,bpm:104,likes:208000,cm:9600,note:1,
 cap:['Sawtelle Japantown crawl: tsukemen → cream puffs → ice cream 🍜🍦 #sawtelle #japantown #LAfood','ソーテル・ジャパンタウンはしご：つけ麺→シュークリーム→アイス🍜🍦 #ソーテル'],
 snd:['Sawtelle Stroll','ソーテルさんぽ'],
 com:[['pooh','three stops is a light lunch','3軒は軽めのランチ'],['bronny','tsukemen before games now','試合前はつけ麺に決定']],
 shots:[
 {d:5,bg:'la_sawtelle',cam:[1.1,1.02,.5,.5,.5,.55],a:[['c_bean_1',.5,.9,.44,'bob',{in:'pop'}]],tx:[[0,5,'Sawtelle Japantown crawl 🍜','ソーテル・ジャパンタウンはしご 🍜','big',.2],[1,5,'West LA','ウエストLA','tag',.3]],sx:[[0,'pop']]},
 {d:6,bg:LAS,dots:0,tr:'whip',a:[['p_ramen',.5,.76,.17,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.68}]],tx:[[0,6,'1','1','num',.2,{x:.25}],[.4,6,'📍 Tsujita Artisan Noodle','📍 つじ田','loc',.36,{x:.45}],[1.2,6,'tsukemen · 2057 Sawtelle Blvd','つけ麺・ソーテル通り2057','tag',.46],[2,6,'Sun–Thu 11–10 · Fri–Sat 11–10:30','日〜木11〜22時・金土11〜22:30','tag',.54]],sx:[[0,'whoosh'],[.4,'slurp']]},
 {d:6,bg:LAS,dots:0,tr:'whip',a:[['c_bean_2',.5,.92,.3,'bob']],tx:[[0,6,'2','2','num',.2,{x:.25}],[.4,6,'📍 Beard Papa’s (Sawtelle)','📍 ビアードパパ（ソーテル）','loc',.36,{x:.45}],[1.2,6,'cream puffs · 2130 Sawtelle Blvd','シュークリーム・ソーテル通り2130','tag',.46],[2,6,'Mon–Thu 10:30–10 · Fri–Sun 10–10','月〜木10:30〜22時・金〜日10〜22時','tag',.54]],sx:[[0,'whoosh'],[.4,'chomp']]},
 {d:6,bg:LAS,dots:0,tr:'whip',a:[['p_parfait',.5,.76,.17,'float',{sh:0}]],tx:[[0,6,'3','3','num',.2,{x:.25}],[.4,6,'📍 Wanderlust Creamery','📍 ワンダーラスト・クリーマリー','loc',.36,{x:.45}],[1.2,6,'travel-inspired ice cream, Sawtelle shop','旅がテーマのアイス・ソーテル店','tag',.46]],sx:[[0,'whoosh'],[.4,'pop']]},
 {d:5,bg:'la_sawtelle',tr:'zoom',a:[['c_bean_0',.5,.9,.44,'wiggle']],fx:[['hearts',0,5,{x:.5,y:.5,n:8}]],tx:[[0,5,'no arms. full heart. 🫛','腕はない。心は満タン。🫛','big',.22]],sx:[[0,'aww']]}
]},
// la13 Giant Robot (shop + gallery) — clay stop-motion
{id:'la13',cat:'la',by:'mogu',song:'clay',seed:5013,bpm:110,likes:118000,cm:3800,look:'clay',note:1,
 cap:['stop-motion: Mogu tunnels to Giant Robot on Sawtelle 🤖🎨 #sawtelle #giantrobot #stopmotion','ストップモーション：モグ、ソーテルのジャイアント・ロボットまで掘り進む🤖🎨'],
 snd:['Clay Tunnel','ねんどトンネル'],
 com:[['pinco','he tunneled the whole way 😭','ずっと掘ってきたの😭'],['asmon','closed Mondays. noted.','月曜休み。メモした。']],
 shots:[
 {d:6,bg:'la_sawtelle',a:[['c_mogu_0',.35,.9,.34,'bob']],tx:[[0,6,'destination: Sawtelle 🤖','目的地：ソーテル 🤖','cap',.25]],sx:[[0,'pop']]},
 {d:6,bg:'la_sawtelle',tr:'cut',cam:[1.2,1.2,.4,.6,.5,.6],a:[['c_mogu_2',.5,.9,.3,'hop']],tx:[[0,6,'📍 Giant Robot Store · 2015 Sawtelle Blvd','📍 ジャイアント・ロボット・ストア（ソーテル通り2015）','cap',.25]],sx:[[0,'squeak']]},
 {d:6,bg:'la_sawtelle',tr:'cut',a:[['c_mogu_4',.5,.9,.3,'shake']],tx:[[0,6,'open Tue–Sun, noon–6 pm · closed Mondays','火〜日 12:00〜18:00・月曜休み','cap',.25]],sx:[[0,'squeak']]},
 {d:6,bg:'la_sawtelle',tr:'cut',cam:[1.1,1.15,.6,.4,.5,.5],a:[['c_mogu_5',.5,.9,.3,'bob']],fx:[['sparkle',0,6,{x:.5,y:.4}]],tx:[[0,6,'the gallery is right next door (Thu–Sun)','ギャラリーはすぐ隣（木〜日）','cap',.25]],sx:[[0,'sparkle']]}
]},
// la14 Sawtelle dessert weekend (B Sweet is Fri–Sun only) — Baby Pinco & Pooh babysitting, split
{id:'la14',cat:'la',also:['parent'],by:'pooh',song:'parent',seed:5014,bpm:100,likes:137000,cm:4600,note:1,
 cap:['babysitting on Sawtelle: dessert stop planning 🍰 (B Sweet is weekends only!) #sawtelle #dessert','ソーテルでベビーシッター：デザート計画🍰（B Sweetは週末だけ！）'],
 snd:['Dessert Detour','デザート寄り道'],
 com:[['pinco','she pointed at EVERYTHING 😭','全部指さしてる😭'],['pooping','weekend plan: confirmed','週末の予定：決定']],
 shots:[
 {d:5,bg:'la_sawtelle',a:[['c_pooh_0',.4,.9,.44,'bob'],['babies_0',.75,.86,.26,'hop']],tx:[[0,5,'babysitting on Sawtelle 🍰','ソーテルでベビーシッター 🍰','big',.2]],sx:[[0,'giggle']]},
 {d:9,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:LAS,a:[['p_cupcake',.5,.6,.2,'float',{sh:0}]],tx:[[0,9,'WEEKDAY','平日','pill',.16],[1,9,'B Sweet:\nclosed Mon–Thu','B Sweet：\n月〜木は休み','tag',.32,{x:.5,s:.85}]]},{r:[.5,0,.5,1],bg:LAS,a:[['p_cupcake',.5,.6,.2,'pulse',{sh:0}]],fx:[['sparkle',0,9,{x:.5,y:.55}]],tx:[[0,9,'WEEKEND','週末','pill',.16],[1,9,'Fri 6–11pm\nSat 12–11pm\nSun 12–10pm','金18〜23時\n土12〜23時\n日12〜22時','tag',.32,{x:.5,s:.85}]]}],sx:[[0,'swish'],[1,'ding']]},
 {d:6,bg:'la_sawtelle',tr:'cut',a:[['babies_0',.5,.86,.3,'hop']],fx:[['hearts',0,6,{x:.5,y:.45,n:6}]],tx:[[0,6,'📍 B Sweet Dessert Bar · 2005 Sawtelle Blvd','📍 B Sweet Dessert Bar（ソーテル通り2005）','tag',.22]],sx:[[0,'aww']]},
 {d:5,bg:'la_sawtelle',tr:'zoom',a:[['c_pooh_2',.4,.9,.44,'shake'],['babies_0',.75,.86,.26,'bob']],fx:[['sweat',0,5,{x:.36,y:.5}]],tx:[[0,5,'(the dessert was for her. I ate it.)','（彼女用のデザート。ぼくが食べた）','cap',.22,{wps:3}]],sx:[[0,'chomp']]}
]}
);
