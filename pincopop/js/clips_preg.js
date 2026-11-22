'use strict';
// PREGNANCY advice clips (times in beats). General, mainstream guidance only; every clip shows a "not medical advice" note.
window.CLIPS=window.CLIPS||[];
// simple, tasteful seat-belt pictogram (abstract shapes only)
function beltDiagram(step){return (x,lt,R)=>{const W=R.w,H=R.h,cx=R.x+W*.5,cy=R.y+H*.55;x.save();
 const a=Math.min(1,lt/.3);x.globalAlpha=a;
 x.fillStyle='rgba(255,255,255,.92)';x.beginPath();x.roundRect?x.roundRect(cx-W*.27,cy-H*.2,W*.54,H*.36,W*.05):x.rect(cx-W*.27,cy-H*.2,W*.54,H*.36);x.fill();
 // seat
 x.fillStyle='#c9b8e8';x.beginPath();x.roundRect?x.roundRect(cx-W*.12,cy-H*.17,W*.24,H*.3,W*.04):x.rect(cx-W*.12,cy-H*.17,W*.24,H*.3);x.fill();
 // person: head + body capsule + round tummy
 x.fillStyle='#ffd8c2';x.beginPath();x.arc(cx,cy-H*.12,W*.05,0,7);x.fill();
 x.fillStyle='#ff9fc2';x.beginPath();x.roundRect?x.roundRect(cx-W*.075,cy-H*.075,W*.15,H*.17,W*.05):x.rect(cx-W*.075,cy-H*.075,W*.15,H*.17);x.fill();
 x.fillStyle='#ff7fb0';x.beginPath();x.ellipse(cx+W*.012,cy+H*.032,W*.05,W*.046,0,0,7);x.fill();
 x.lineCap='round';x.lineWidth=W*.022;
 if(step>=1){x.strokeStyle='#2a6df4';x.beginPath();x.moveTo(cx-W*.1,cy+H*.075);x.lineTo(cx+W*.1,cy+H*.075);x.stroke()}
 if(step>=2){x.strokeStyle='#2a6df4';x.beginPath();x.moveTo(cx+W*.06,cy-H*.1);x.quadraticCurveTo(cx-W*.07,cy-H*.06,cx-W*.088,cy+H*.02);x.lineTo(cx-W*.095,cy+H*.075);x.stroke()}
 if(step>=3){x.strokeStyle='#ff2d55';x.setLineDash([W*.02,W*.02]);x.beginPath();x.moveTo(cx-W*.1,cy+H*.032);x.lineTo(cx+W*.1,cy+H*.032);x.stroke();x.setLineDash([])}
 x.restore()}}
const NB='#fff3f8/#ffe1ee';
CLIPS.push(
{id:'n01',cat:'preg',by:'pinco',song:'sweet',seed:701,bpm:100,likes:91200,cm:2300,
 cap:['Pregnancy hydration 101 💧 sip all day, check the color, go easy on caffeine #pregnancy #hydration','妊娠中の水分補給💧 こまめに飲んで、色をチェック、カフェインはほどほどに'],
 snd:['Sip Sip Lullaby','ちびちびララバイ'],
 com:[['pooh','I fill the water bottle every morning 💛','毎朝ボトルに水をいれる係です💛'],['prof','Pale yellow is the goal. Correct.','目標は薄い黄色。正確です。']],
 shots:[
 {d:5,bg:'yoga',a:[['c_pinco_0',.5,.9,.5,'bob',{in:'pop'}]],tx:[[0,5,'pregnancy hydration 101 💧','妊娠中の水分補給 💧','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:NB,tr:'whip',a:[['p_water',.34,.62,.24,'float',{in:'pop',sh:0}],['p_glass',.66,.64,.18,'float',{in:'pop',sh:0,t:[1,7]}]],fx:[['sparkle',1,7,{x:.5,y:.55,r:.25}]],tx:[[0,7,'sip water through the day','1日を通して、こまめに水分を','pill',.2],[1.5,7,'many guides say about 8–12 cups a day','目安はコップ8〜12杯くらい','pillk',.3]],sx:[[0,'pop'],[1,'pop']]},
 {d:6,bg:NB,tr:'whip',a:[['c_pinco_5',.5,.9,.48,'nod']],fx:[['check',1,6,{x:.5,y:.4}]],tx:[[0,6,'pale yellow pee = a good sign 👍','おしっこが薄い黄色ならOKのサイン 👍','pill',.2]],sx:[[1,'ding']]},
 {d:8,bg:NB,tr:'whip',a:[['p_tea',.5,.6,.22,'float',{in:'pop',sh:0}]],fx:[['steam',0,8,{x:.48,y:.47}]],tx:[[0,8,'caffeine: keep it under 200 mg a day','カフェインは1日200mgまでを目安に','pill',.2],[1.5,8,'about one 12-oz (350 ml) coffee','コーヒーならマグカップ1〜2杯ほど','pillk',.3],[3,8,'tea & cola count too','お茶やコーラにも入っています','tag',.75]],sx:[[0,'pop'],[3,'chime']]},
 {d:6,bg:'yoga',tr:'cut',a:[['c_bean_5',.5,.88,.42,'bob']],tx:[[0,6,'noted. drinking water now 💧','了解。いま水飲んでます 💧','bub',.4,{who:'bean',tx:.5,ty:.5}]],sx:[[0,'gulp'],[2,'giggle']]}
]},
{id:'n02',cat:'preg',by:'pinco',song:'parent',seed:702,bpm:96,likes:78300,cm:1900,
 cap:['Moving safely during pregnancy 🧘 walking, swimming, prenatal yoga, with your doctor’s OK #prenatalyoga','妊娠中の安全な運動🧘 医師のOKがあれば、ウォーキング・水泳・マタニティヨガ'],
 snd:['Breathe In, Breathe Out','すって、はいて'],
 com:[['bronny','the talk test is real','トークテストはガチ'],['pooh','I do the walks too. moral support.','散歩はぼくも一緒に。応援係。']],
 shots:[
 {d:5,bg:'yoga',a:[['pinco_preg_0',.5,.88,.4,'sway',{in:'pop'}]],tx:[[0,5,'gentle moves for moms-to-be 🧘','プレママのためのやさしい運動 🧘','big',.17]],sx:[[0,'chime']]},
 {d:7,bg:'yoga',tr:'wipe',a:[['pinco_preg_0',.5,.88,.4,'sway']],tx:[[0,7,'if your doctor says it’s OK:','医師のOKがあれば：','pill',.2],[1.5,7,'about 150 minutes a week of moderate activity','週150分くらいの適度な運動が目安','pillk',.3]],sx:[[1.5,'ding']]},
 {d:7,bg:'park',tr:'whip',a:[['c_bronny_0',.3,.86,.42,'bob',{mv:[.7,.86],mvd:6,me:'lin'}]],fx:[['check',1,7,{x:.78,y:.36}]],tx:[[0,7,'good picks: walking, swimming, prenatal yoga','おすすめ：ウォーキング・水泳・マタニティヨガ','pill',.2],[2,7,'talk test: you can still chat while moving','会話ができるくらいの強さで','pillk',.3]],sx:[[1,'ding']]},
 {d:6,bg:NB,tr:'whip',a:[['c_prof_2',.5,.88,.42,'shake']],fx:[['cross',.5,6,{x:.5,y:.42}]],tx:[[0,6,'skip: hot yoga, contact sports, anything with a fall risk','控えたい：ホットヨガ・接触するスポーツ・転びやすい運動','pill',.2]],sx:[[.5,'buzz']]},
 {d:7,bg:'yoga',tr:'cut',a:[['pinco_preg_2',.5,.9,.48,'idle']],tx:[[0,7,'stop & call your provider if you feel dizzy, have pain, bleeding or leaking fluid','めまい・痛み・出血・水っぽいものが出たら、すぐ中止して受診先へ連絡を','pill',.2]],sx:[[0,'chime']]}
]},
{id:'n03',cat:'preg',by:'pinco',song:'sweet',seed:703,bpm:88,likes:84400,cm:2100,
 cap:['Comfy sleep in later pregnancy 🌙 side sleeping + a pillow between your knees #pregnancysleep','妊娠後期のラクな寝方🌙 横向き寝＋ひざの間にクッション'],
 snd:['Pillow Fort Waltz','まくらのワルツ'],
 com:[['pooh','I brought 4 pillows. is that enough?','まくら4つ持ってきた。足りる？'],['pinco','left or right, both are fine 💕','右でも左でもOK💕']],
 shots:[
 {d:5,bg:'bedtime',a:[['c_pinco_0',.5,.9,.48,'bob',{in:'pop'}]],fx:[['zzz',1,5,{x:.62,y:.4}]],tx:[[0,5,'comfy sleep in later pregnancy 🌙','妊娠後期のラクな寝方 🌙','big',.17]],sx:[[0,'chime']]},
 {d:8,bg:'bedtime',tr:'wipe',a:[['pinco_preg_1',.5,.82,.27,'sway']],fx:[['zzz',2,8,{x:.4,y:.55}]],tx:[[0,8,'side sleeping is recommended, especially in the third trimester','とくに妊娠後期は、横向きで寝るのがおすすめ','pill',.2],[2.5,8,'left or right: both are fine','右向きでも左向きでもOK','pillk',.32]],sx:[[2.5,'ding']]},
 {d:6,bg:'bedtime',tr:'cut',cam:[1.2,1.3,.5,.5,.6,.62],a:[['pinco_preg_1',.5,.82,.27,'idle']],fx:[['hearts',1,6,{x:.5,y:.7,n:6}]],tx:[[0,6,'a pillow between your knees = happier hips','ひざの間にクッションで、腰がラクに','pill',.2]],sx:[[1,'aww']]},
 {d:6,bg:'bedtime',tr:'whip',a:[['c_pinco_1',.5,.9,.48,'nod']],tx:[[0,6,'woke up on your back? don’t worry, just roll back onto your side','あおむけで目が覚めても大丈夫。横向きに戻ればOK','pill',.2]],sx:[[0,'pop']]},
 {d:5,bg:'bedtime',tr:'zoom',a:[['pooh_partner_1',.5,.88,.46,'hop']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.3}]],tx:[[0,5,'Pooh brought backup pillows 🛏️','プーが予備のまくらを持ってきた 🛏️','pill',.2]],sx:[[0,'boing'],[1,'giggle']]}
]},
{id:'n04',cat:'preg',by:'pooh',song:'food',seed:704,bpm:104,likes:96700,cm:2700,
 cap:['Pregnancy snack ideas 🍌 plus folic acid, the little vitamin that matters early #pregnancysnacks','妊娠中のおやつアイデア🍌 と、初期に大事な葉酸'],
 snd:['Snack Attack (gentle mix)','おやつタイム（やさしめ）'],
 com:[['bean','the banana is my favorite','バナナが一番好き'],['pinco','yogurt bowl every morning 💙','毎朝ヨーグルトボウル💙']],
 shots:[
 {d:5,bg:'kitchen',a:[['c_pooh_1',.5,.86,.48,'hop',{in:'pop'}]],tx:[[0,5,'snack ideas for moms-to-be 🍌','プレママのおやつアイデア 🍌','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'kitchen',tr:'whip',a:[['c_pooh_3',.5,.86,.48,'talk']],tx:[[0,6,'no need to “eat for two”','「2人分」食べなくて大丈夫','pill',.2],[1.5,6,'just a little extra later in pregnancy','中期以降に少しプラスすればOK','pillk',.3]],sx:[[0,'pop']]},
 {d:7,bg:NB,tr:'whip',a:[['p_yogurt',.28,.5,.15,'float',{in:'pop',sh:0}],['p_banana',.72,.5,.13,'float',{in:'pop',sh:0,t:[1,7]}],['p_nuts',.3,.75,.13,'float',{in:'pop',sh:0,t:[2,7]}],['p_crackers',.7,.76,.14,'float',{in:'pop',sh:0,t:[3,7]}]],tx:[[0,7,'easy snacks: yogurt, fruit, nuts, whole-grain crackers','手軽なおやつ：ヨーグルト・果物・ナッツ・全粒粉クラッカー','pill',.2]],sx:[[0,'pop'],[1,'pop'],[2,'pop'],[3,'pop']]},
 {d:6,bg:NB,tr:'whip',a:[['p_salmon',.5,.62,.2,'float',{in:'pop',sh:0}]],fx:[['check',1,6,{x:.72,y:.46}]],tx:[[0,6,'well-cooked, low-mercury fish like salmon (2–3 servings a week)','サケなど水銀の少ない魚は、しっかり加熱して取り入れて','pill',.2]],sx:[[1,'ding']]},
 {d:7,bg:NB,tr:'whip',a:[['p_vitamin',.5,.62,.2,'pulse',{in:'pop',sh:0}]],fx:[['shine',0,3]],tx:[[0,7,'folic acid: 400 mcg a day, before and in early pregnancy','葉酸：1日400μg。妊娠前〜初期がとくに大切','pill',.2],[2,7,'ask your provider which prenatal vitamin fits you','どのサプリが合うかは医師に相談を','pillk',.32]],sx:[[0,'chime']]},
 {d:5,bg:'kitchen',tr:'cut',a:[['bean_food_2',.5,.88,.42,'bob']],fx:[['hearts',0,5,{x:.5,y:.5,n:8}]],tx:[[0,5,'Bean approves the banana 🍌','ビーンはバナナに満足 🍌','pill',.2]],sx:[[0,'aww']]}
]},
{id:'n05',cat:'preg',by:'prof',song:'food',seed:705,bpm:96,likes:88800,cm:3100,
 cap:['Foods to skip while pregnant 🚫 cook it through, skip alcohol, watch the mercury #pregnancydiet','妊娠中に控えたい食べもの🚫 しっかり加熱・お酒はなし・水銀に注意'],
 snd:['Kitchen Safety Swing','キッチン安全スウィング'],
 com:[['pooh','I heat the deli ham until it steams now','ハムは湯気が出るまで温めるようにした'],['pinco','saving this list 📌','このリスト保存📌']],
 shots:[
 {d:5,bg:'kitchen',a:[['c_prof_0',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'foods to skip while pregnant 🚫','妊娠中に控えたい食べもの 🚫','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:NB,tr:'whip',a:[['c_prof_2',.5,.88,.42,'nod']],fx:[['cross',.5,6,{x:.5,y:.42}]],tx:[[0,6,'alcohol: no amount is known to be safe','お酒：安全な量はわかっていないので控えて','pill',.2]],sx:[[.5,'buzz']]},
 {d:6,bg:NB,tr:'whip',a:[['p_egg',.5,.6,.18,'float',{in:'pop',sh:0}]],tx:[[0,6,'raw or undercooked meat & eggs → cook until done','生や半生の肉・卵 → 中までしっかり加熱','pill',.2]],sx:[[0,'sizzle']]},
 {d:7,bg:NB,tr:'whip',a:[['c_prof_1',.5,.88,.42,'talk']],tx:[[0,7,'unpasteurized milk & soft cheeses: skip','加熱殺菌していない牛乳・ナチュラルチーズは避けて','pill',.2],[1.5,7,'deli meats: only if heated until steaming','ハムや生ハムなどは、湯気が出るまで加熱したものを','pillk',.32]],sx:[[0,'pop'],[1.5,'pop']]},
 {d:6,bg:NB,tr:'whip',a:[['c_prof_2',.5,.88,.42,'shake']],tx:[[0,6,'high-mercury fish (swordfish, shark, king mackerel): avoid','水銀の多い魚（メカジキ・キンメダイなど）は食べる量に注意','pill',.2]],sx:[[0,'buzz']]},
 {d:5,bg:'clinic',tr:'cut',a:[['c_prof_1',.5,.88,.44,'hop']],tx:[[0,5,'not sure? ask your doctor or midwife 🩺','迷ったら医師・助産師に相談を 🩺','pill',.2]],sx:[[0,'chime']]}
]},
{id:'n06',cat:'preg',by:'pinco',song:'sweet',seed:706,bpm:92,likes:102000,cm:3900,
 cap:['Morning sickness survival tips 🫖 crackers, small meals, ginger, and knowing when to call #morningsickness','つわりを乗り切るコツ🫖 クラッカー・少量ずつ・しょうが、そして受診の目安'],
 snd:['Ginger Tea Time','しょうが湯タイム'],
 com:[['pooh','room service is open 24/7','ルームサービスは24時間営業です'],['pooping','the crackers by the bed trick saved us','枕元クラッカー作戦に助けられた']],
 shots:[
 {d:5,bg:'bedtime',a:[['c_pinco_1',.5,.9,.48,'bob',{in:'pop'}]],tx:[[0,5,'morning sickness survival tips','つわりを乗り切るコツ','big',.17]],sx:[[0,'chime']]},
 {d:6,bg:NB,tr:'whip',a:[['p_crackers',.5,.6,.22,'float',{in:'pop',sh:0}]],tx:[[0,6,'keep plain crackers by the bed; nibble before you get up','枕元にクラッカーを。起き上がる前に少しつまんで','pill',.2]],sx:[[0,'chomp']]},
 {d:6,bg:NB,tr:'whip',a:[['c_pinco_5',.5,.9,.46,'nod']],tx:[[0,6,'small, frequent meals','少しずつ、こまめに食べる','pill',.2],[1.5,6,'step away from strong smells','においの強いものからは離れて','pillk',.3]],sx:[[0,'pop'],[1.5,'pop']]},
 {d:6,bg:NB,tr:'whip',a:[['p_tea',.5,.6,.22,'float',{in:'pop',sh:0}]],fx:[['steam',0,6,{x:.48,y:.47}]],tx:[[0,6,'ginger tea or candies help some people','しょうが湯やしょうがキャンディが効く人も','pill',.2]],sx:[[0,'pop']]},
 {d:7,bg:'clinic',tr:'whip',a:[['c_prof_1',.5,.88,.44,'talk']],tx:[[0,7,'can’t keep fluids down, or losing weight? call your provider','水分もとれない・体重が減ってきた時は、早めに受診を','pill',.2]],sx:[[0,'chime']]},
 {d:5,bg:'living',tr:'zoom',a:[['pooh_partner_0',.5,.88,.46,'hop']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.25}]],tx:[[0,5,'room service! (nothing smelly) 🫖','ルームサービスです！（においひかえめ）🫖','bub',.36,{who:'pooh',tx:.5,ty:.46}]],sx:[[0,'ding']]}
]},
{id:'n07',cat:'preg',by:'prof',song:'parent',seed:707,bpm:96,likes:69100,cm:1500,
 cap:['Kick counting 👣 get to know your baby’s pattern, and call right away if it changes #kickcounts','胎動カウント👣 赤ちゃんのリズムを知って、変化があればすぐ連絡を'],
 snd:['Tiny Feet Tempo','ちいさな足のテンポ'],
 com:[['pinco','“don’t wait” is the key part 💛','「待たない」が大事💛'],['pooh','I hold the stopwatch. very serious job.','ぼくはストップウォッチ係。大事な仕事。']],
 shots:[
 {d:5,bg:'clinic',a:[['c_prof_0',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'kick counting 101 👣','胎動カウントの基本 👣','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'clinic',tr:'whip',a:[['p_calendar',.5,.6,.2,'float',{in:'pop',sh:0}]],tx:[[0,6,'from about 28 weeks, many providers suggest it','妊娠28週ごろから、すすめられることが多いです','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:'bedtime',tr:'whip',a:[['pinco_preg_1',.5,.82,.27,'idle']],tx:[[0,6,'pick a time baby is usually active; lie on your side','赤ちゃんがよく動く時間に、横になって','pill',.2]],sx:[[0,'chime']]},
 {d:7,bg:NB,tr:'whip',a:[['p_phone',.5,.62,.2,'pulse',{in:'pop',sh:0}]],tx:[[0,7,'time how long it takes to feel 10 movements','10回動くまでの時間をはかる','pill',.2],[2,7,'it’s usually well under 2 hours','ふつうは2時間以内に感じられます','pillk',.3]],sx:[[0,'tick'],[1,'tick'],[2,'tick'],[3,'tick'],[4,'tick'],[5,'ding']]},
 {d:7,bg:'clinic',tr:'cut',a:[['c_prof_1',.5,.88,.44,'nod']],fx:[['glow',0,7,{x:.5,y:.4,c:'#ffd6e6'}]],tx:[[0,7,'fewer movements than usual? call your provider right away, don’t wait','いつもより少ないと感じたら、待たずにすぐ連絡を','pill',.2]],sx:[[0,'chime']]}
]},
{id:'n08',cat:'preg',by:'pooping',song:'parent',seed:708,bpm:100,likes:58800,cm:1200,
 cap:['Don’t skip your prenatal checkups 📅 bring your questions (and your partner) #prenatalcare','妊婦健診、忘れずに📅 質問メモとパートナーも一緒に'],
 snd:['Appointment Groove','健診グルーヴ'],
 com:[['pooh','perfect attendance 🏅','皆勤賞です🏅'],['prof','Writing questions down is excellent practice.','質問をメモするのは素晴らしい習慣。']],
 shots:[
 {d:5,bg:'clinic',a:[['c_pooping_0',.5,.86,.42,'bob',{in:'pop'}]],tx:[[0,5,'don’t skip your prenatal checkups 📅','妊婦健診、忘れずに 📅','big',.17]],sx:[[0,'pop']]},
 {d:8,bg:NB,tr:'whip',a:[['p_calendar',.5,.64,.2,'float',{in:'pop',sh:0}]],tx:[[0,8,'a common schedule:','よくあるスケジュール：','pill',.2],[1,8,'monthly until 28 weeks','〜23週：4週間に1回','pillk',.3],[2,8,'every 2 weeks until 36 weeks','24〜35週：2週間に1回','pillk',.3],[3,8,'weekly after that','36週〜：毎週','pillk',.3]],sx:[[1,'tick'],[2,'tick'],[3,'ding']]},
 {d:6,bg:'clinic',tr:'whip',a:[['pinco_preg_2',.5,.9,.48,'nod']],tx:[[0,6,'write your questions down before you go','聞きたいことは、メモして持っていこう','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:'clinic',tr:'whip',a:[['c_pooping_2',.32,.86,.38,'bob'],['pooh_partner_2',.7,.88,.4,'hop']],fx:[['hearts',1,6,{x:.5,y:.5,n:6}]],tx:[[0,6,'partners welcome. Pooh never misses one','パートナーも一緒に。プーは皆勤賞','pill',.2]],sx:[[0,'cheer']]},
 {d:5,bg:'clinic',tr:'cut',a:[['c_prof_1',.5,.88,.44,'nod']],tx:[[0,5,'bring your ID, insurance card & notes','保険証・母子健康手帳・診察券を忘れずに','pill',.2]],sx:[[0,'chime']]}
]},
{id:'n09',cat:'preg',by:'pinco',song:'makeup',seed:709,bpm:108,likes:112000,cm:4400,
 cap:['Hospital bag checklist 👜 pack it by about 36 weeks #hospitalbag #checklist','入院バッグ チェックリスト👜 36週ごろまでに準備を'],
 snd:['Pack It Up','パッキング・ポップ'],
 com:[['pooh','bag has been in the car since week 20','バッグは20週から車に積んであります'],['party','the long charger tip 🙌','長い充電ケーブルの件🙌']],
 shots:[
 {d:5,bg:'nursery',a:[['pinco_preg_2',.5,.9,.5,'bob',{in:'pop'}]],tx:[[0,5,'hospital bag checklist 👜','入院バッグ チェックリスト 👜','big',.17]],sx:[[0,'pop']]},
 {d:5,bg:'nursery',tr:'whip',a:[['p_bag',.5,.62,.22,'float',{in:'pop',sh:0}]],tx:[[0,5,'pack it by about 36 weeks','36週ごろまでに準備しておくと安心','pill',.2]],sx:[[0,'pop']]},
 {d:12,bg:NB,tr:'whip',a:[['p_bag',.5,.85,.16,'idle',{sh:0}]],tx:[[0,12,'✓ ID, insurance card, birth plan','✓ 保険証・母子健康手帳・診察券','tag',.22],[1.5,12,'✓ phone + a long charger','✓ スマホ＋長めの充電ケーブル','tag',.22],[3,12,'✓ comfy clothes, nursing bra, slippers','✓ 楽な服・授乳ブラ・スリッパ','tag',.22],[4.5,12,'✓ toiletries & lip balm','✓ 洗面用具・リップクリーム','tag',.22],[6,12,'✓ baby’s going-home outfit','✓ 赤ちゃんの退院着','tag',.22],[7.5,12,'✓ car seat installed (if driving home)','✓ 車で帰るならチャイルドシートを設置','tag',.22]],sx:[[0,'ding'],[1.5,'ding'],[3,'ding'],[4.5,'ding'],[6,'ding'],[7.5,'ding']]},
 {d:6,bg:'living',tr:'zoom',a:[['pooh_partner_2',.5,.88,.46,'hop']],fx:[['sparkle',0,6,{x:.5,y:.5,r:.3}]],tx:[[0,6,'bag is in the car. since week 20.','バッグはもう車に。20週から。','bub',.36,{who:'pooh',tx:.5,ty:.46}]],sx:[[0,'boing'],[1,'laugh']]}
]},
{id:'n10',cat:'preg',by:'pooh',song:'sweet',seed:710,bpm:96,likes:134000,cm:5200,
 cap:['How to be a supportive partner 💛 by Pooh: chores, appointments, snacks, and lots of listening #partner','サポート上手なパートナーになる方法💛 by プー：家事・健診・おやつ・話を聞くこと'],
 snd:['Best Partner Ballad','最高のパートナー・バラード'],
 com:[['pooping','taking notes 📝','メモしてます📝'],['pinco','the litter box tip!! 🐾','猫トイレの件！！🐾']],
 shots:[
 {d:5,bg:'living',a:[['pooh_partner_1',.5,.88,.46,'bob',{in:'pop'}]],fx:[['hearts',1,5,{x:.5,y:.5,n:6}]],tx:[[0,5,'how to be a supportive partner 💛','サポート上手なパートナーになる方法 💛','big',.17],[1,5,'by Pooh','by プー','pillk',.3]],sx:[[0,'aww']]},
 {d:7,bg:'living',tr:'whip',a:[['c_pooh_3',.5,.86,.46,'talk']],tx:[[0,7,'take over chores, especially the cat litter box','家事を代わろう。とくに猫のトイレ掃除は交代して','pill',.2],[2,7,'(cat litter can carry toxoplasmosis)','（トキソプラズマ感染の予防のため）','pillk',.32]],sx:[[0,'pop']]},
 {d:6,bg:'clinic',tr:'whip',a:[['pooh_partner_2',.5,.88,.44,'hop']],tx:[[0,6,'come to appointments & learn the signs of labor together','健診に付き添って、陣痛のサインを一緒に学ぼう','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:'living',tr:'whip',a:[['pooh_partner_0',.5,.88,.46,'bob']],tx:[[0,6,'back rubs, snacks, and lots of listening','マッサージ、おやつ、そしてたくさん話を聞くこと','pill',.2]],sx:[[0,'ding']]},
 {d:7,bg:'living',tr:'cut',a:[['c_pooh_5',.5,.86,.46,'nod']],fx:[['glow',0,7,{x:.5,y:.45,c:'#ffe8a8'}]],tx:[[0,7,'check in on feelings too: mood changes are common, so ask for help early','気持ちの変化もよくあること。つらい時は早めに相談を','pill',.2]],sx:[[0,'chime']]},
 {d:5,bg:'living',tr:'zoom',a:[['pooh_partner_1',.5,.88,.46,'hop']],fx:[['confetti',0,5,{n:50}]],tx:[[0,5,'best partner award 🏆','ベストパートナー賞 🏆','big',.17,{c:'#ffd84a'}]],sx:[[0,'cheer']]}
]},
{id:'n11',cat:'preg',by:'pooping',song:'parent',seed:711,bpm:100,likes:61400,cm:1100,
 cap:['Seat belt the safe way during pregnancy 🚗 lap belt low, shoulder belt to the side #roadsafety','妊娠中のシートベルトの正しい付け方🚗 腰ベルトは低く、肩ベルトはお腹の横へ'],
 snd:['Buckle Up Bop','カチッとバップ'],
 com:[['bronny','every ride. got it.','毎回ね。了解。'],['prof','Correct placement protects both of you.','正しい位置が2人を守ります。']],
 shots:[
 {d:5,bg:'promenade',a:[['c_pooping_0',.5,.86,.42,'bob',{in:'pop'}],['p_car',.82,.84,.1,'idle',{sh:0}]],tx:[[0,5,'seat belt the safe way 🚗','シートベルトの正しい付け方 🚗','big',.17]],sx:[[0,'pop']]},
 {d:5,bg:'promenade',tr:'whip',a:[['c_pooping_2',.5,.86,.42,'nod']],fx:[['check',1,5,{x:.5,y:.4}]],tx:[[0,5,'always buckle up, every single ride','毎回かならず着用を','pill',.2]],sx:[[1,'ding']]},
 {d:6,bg:NB,tr:'whip',post:beltDiagram(1),tx:[[0,6,'lap belt LOW: under your bump, across your hips','腰ベルトは低く：お腹のふくらみの下、腰骨にかける','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:NB,tr:'cut',post:beltDiagram(2),tx:[[0,6,'shoulder belt between your breasts and to the side of your bump','肩ベルトは胸の間を通して、お腹の横へ','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:NB,tr:'cut',post:beltDiagram(3),fx:[['cross',.5,6,{x:.72,y:.36}]],tx:[[0,6,'never across the top of your bump','ベルトがお腹の上を通らないように','pill',.2]],sx:[[.5,'buzz']]}
]},
{id:'n12',cat:'preg',by:'prof',song:'parent',seed:712,bpm:92,likes:76500,cm:2000,
 cap:['When to call your doctor or midwife right away 📞 calling is never a bother #pregnancy #safety','すぐに受診先へ連絡してほしいサイン📞 電話は遠慮しなくて大丈夫'],
 snd:['Better Safe Melody','念のためのメロディ'],
 com:[['pinco','saving this one 📌','これは保存📌'],['pooh','the number is on our fridge','番号は冷蔵庫に貼ってあります']],
 shots:[
 {d:5,bg:'clinic',a:[['c_prof_0',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'when to call right away 📞','すぐ連絡してほしいサイン 📞','big',.17]],sx:[[0,'chime']]},
 {d:13,bg:NB,tr:'whip',a:[['p_phone',.5,.86,.14,'pulse',{sh:0}]],tx:[[0,13,'• bleeding, or fluid leaking','・出血、または水っぽいものが出る','tag',.22],[1.5,13,'• severe headache, vision changes or sudden swelling','・ひどい頭痛、目がチカチカする、急なむくみ','tag',.22],[3,13,'• baby moving less than usual','・胎動がいつもより少ない','tag',.22],[4.5,13,'• regular contractions before 37 weeks','・37週より前の規則的なお腹の張りや痛み','tag',.22],[6,13,'• fever, or pain that won’t go away','・発熱、またはおさまらない痛み','tag',.22]],sx:[[0,'tick'],[1.5,'tick'],[3,'tick'],[4.5,'tick'],[6,'tick']]},
 {d:6,bg:'clinic',tr:'zoom',a:[['c_prof_1',.36,.88,.4,'nod'],['pooh_partner_1',.72,.88,.38,'bob']],fx:[['hearts',1,6,{x:.5,y:.5,n:6}]],tx:[[0,6,'trust your gut. calling is never a bother 💛','迷ったら電話を。遠慮はいりません 💛','pill',.2]],sx:[[0,'aww']]}
]}
);
