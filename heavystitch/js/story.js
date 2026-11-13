/* Heavy Stitch: original story scenes, anime opening script and UI strings (EN/JA). */
'use strict';
// Shot fields: bg, chars:[{id,x,s,armor}], who, en, ja, fx ('lines','flash','shake','zoom','slash','red'), sting
const SCENES={
 s_m1:[
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Welcome to Scrapyard 9, Patchwork Brigade. I’m Chief. I run the yard and I yell on the radio.',ja:'第9スクラップヤードへようこそ、パッチワーク旅団。俺はチーフ。ヤードを仕切って、無線でどなる係だ。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.35,armor:1},{id:'max',x:.72,s:.85}],who:'max',en:'First plates are welded on. Feel the weight? Good. That weight keeps you alive out there.',ja:'最初の装甲は溶接した。重さを感じる？いいね。その重さが外で命を守る。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.5,armor:1,s:1.15}],who:'pinco',fx:'zoom',en:'It fits like a winter coat made of trucks. I love it.',ja:'トラックでできた冬のコートみたい。気に入ったわ。'},
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Training drones are up. Boost, lock on, shoot, slash. Try not to dent my floor.',ja:'訓練ドローンを上げた。ブースト、ロックオン、射撃、斬撃。床をへこますなよ。'},
 ],
 d_m1:[
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Those were real LOOMCORP drones. They were scouting us.',ja:'あれは本物のルームコープのドローンだ。俺たちを偵察してた。'},
  {bg:'bg_hangar',chars:[{id:'pooh',x:.3,armor:1},{id:'bean',x:.72,armor:1}],who:'pooh',en:'Then we should get ready. And maybe have a snack first.',ja:'じゃあ準備しなきゃ。まずはおやつかな。'},
 ],
 s_m2:[
  {bg:'bg_highway',chars:[{id:'party',x:.5}],who:'party',en:'Party Hat Guy here, your friendly data broker. Three honey-fuel haulers cross the dead highway tonight.',ja:'パーティーハット・ガイだ。親切なデータ屋さ。今夜、ハニー燃料の輸送車3台が廃ハイウェイを渡る。'},
  {bg:'bg_highway',chars:[{id:'party',x:.5}],who:'party',en:'LOOMCORP wants that fuel. It keeps every light on in the scrap districts.',ja:'ルームコープはその燃料を狙ってる。スクラップ地区の明かりは全部それで灯ってるんだ。'},
  {bg:'bg_highway',chars:[{id:'pooh',x:.5,armor:1,s:1.15}],who:'pooh',fx:'zoom',en:'Nobody takes the honey. Not tonight.',ja:'ハチミツはだれにも渡さない。今夜はね。'},
 ],
 d_m2:[
  {bg:'bg_town',chars:[{id:'pooh',x:.5,armor:1}],who:'pooh',en:'The district sent a jar of thanks. And Max built me something.',ja:'地区のみんながお礼にひとびんくれたよ。それに、マックスがなにか作ってくれた。'},
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'The Hunny Mortar. Lobs sticky shells. Enemies get stuck. You’re welcome.',ja:'ハニー・モーター。ねばねば弾を撃ち出す。敵は動けなくなる。どういたしまして。'},
 ],
 s_m3:[
  {bg:'bg_factory',fx:'red',chars:[{id:'pooping',x:.5}],who:'pooping',en:'This is the Glimmer Refinery. It pumps raw Glimmer out of the ground and into LOOMCORP war machines.',ja:'ここがグリマー精製所。地下から生のグリマーを吸い上げて、ルームコープの戦闘機械に流し込んでる。'},
  {bg:'bg_factory',chars:[{id:'bean',x:.5,armor:1,s:1.15}],who:'bean',fx:'zoom',en:'Four pumps. One gate. Zero problem. ...Probably one problem.',ja:'ポンプ4つ、ゲート1つ。問題ゼロ。……たぶん問題1つ。'},
 ],
 d_m3:[
  {bg:'bg_factory',chars:[{id:'dkermit',x:.5,armor:'ace',s:1.1}],who:'dkermit',fx:'red',en:'You scrap-heap plushies think you can cut our power? LOOMCORP logs every weld.',ja:'スクラップのぬいぐるみが、我らの電力を断てるとでも？ルームコープはすべての溶接を記録している。'},
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'The foreman got away. But the refinery is dark. That’s a win.',ja:'監督官は逃げた。だが精製所は止まった。勝ちだ。'},
 ],
 s_m4:[
  {bg:'bg_hangar',fx:'red',sting:'alarm',chars:[{id:'pooping',x:.5}],who:'pooping',en:'They found the yard. Big push incoming. If the generator goes, we all go dark.',ja:'ヤードがバレた。大攻勢が来る。発電機がやられたら、全員おしまいだ。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.3,armor:1},{id:'pooh',x:.55,armor:1},{id:'bean',x:.8,armor:1}],who:'pinco',fx:'slash',en:'Then nobody touches the generator. Brigade, positions!',ja:'なら発電機にはだれも近づけない。旅団、配置について！'},
 ],
 d_m4:[
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'Yard’s still standing. Pinco, your monowire saber is done. Very sharp. Very rude.',ja:'ヤードは無事だ。ピンコ、モノワイヤー・セイバーが仕上がった。すごく鋭い。すごく失礼なやつ。'},
  {bg:'bg_court',chars:[{id:'party',x:.5}],who:'party',en:'Bad news. LOOMCORP hired the Courtside Lancers. Their ace wants a one-on-one.',ja:'悪い知らせだ。ルームコープがコートサイド・ランサーズを雇った。そのエースが一騎打ちを望んでる。'},
 ],
 s_m5:[
  {bg:'bg_court',fx:'lines',chars:[{id:'bronny',x:.5,armor:'ace',s:1.15}],who:'bronny',sting:'hit',en:'Name’s Bronny. Slam Ward. I don’t care who signs the checks. I care who’s good.',ja:'ブロニーだ。機体はスラム・ワード。だれが金を払うかはどうでもいい。強いかどうかだ。'},
  {bg:'bg_court',chars:[{id:'pinco',x:.5,armor:1,s:1.1}],who:'pinco',fx:'zoom',en:'Then let’s find out.',ja:'なら、確かめましょう。'},
  {bg:'bg_court',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Watch his balance meter. When it breaks, he’s wide open. Make it count.',ja:'奴のバランスゲージを見ろ。崩れたら隙だらけだ。そこで決めろ。'},
 ],
 d_m5:[
  {bg:'bg_court',chars:[{id:'bronny',x:.5,armor:'ace'}],who:'bronny',en:'Good game. Real good. I’m done working for LOOMCORP. Call me if you need a fifth.',ja:'いい試合だった。ほんとに。ルームコープの仕事はやめだ。人手がいるなら呼んでくれ。'},
 ],
 s_m6:[
  {bg:'bg_canyon',chars:[{id:'party',x:.5}],who:'party',en:'Three relay towers in the crater district. Scan them and we learn where LOOMCORP keeps its heart.',ja:'クレーター地区に中継塔が3つ。スキャンすれば、ルームコープの心臓がどこにあるかわかる。'},
  {bg:'bg_canyon',chars:[{id:'bean',x:.5,armor:1}],who:'bean',en:'Scan, smash the jammer, run away fast. My favorite kind of plan.',ja:'スキャンして、ジャマーをこわして、全力で逃げる。いちばん好きな作戦だ。'},
 ],
 d_m6:[
  {bg:'bg_spire',fx:'red',sting:'hit',chars:[{id:'party',x:.5}],who:'party',en:'Got it. The LOOMCORP Spire. And something huge just walked out of it, heading our way.',ja:'わかった。ルームコープ・スパイアだ。そこから、なにか巨大なものがこっちへ歩いてくる。'},
 ],
 s_m7:[
  {bg:'bg_canyon',fx:'shake',sting:'boom',en:'BOOM. BOOM. BOOM.',ja:'ズン。ズン。ズン。'},
  {bg:'bg_canyon',chars:[{id:'pooping',x:.5}],who:'pooping',en:'LOOM Walker. Four legs, one core. Break the legs and it has to kneel.',ja:'ルーム・ウォーカー。脚4本、コア1つ。脚を壊せば、ひざをつく。'},
  {bg:'bg_canyon',chars:[{id:'pooh',x:.5,armor:1,s:1.15}],who:'pooh',fx:'zoom',en:'It is very big. But we are very brave.',ja:'すごく大きいね。でも、ぼくたちもすごく勇敢だよ。'},
 ],
 d_m7:[
  {bg:'bg_canyon',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'I ripped the grav gear off that thing. Gravlift Walkers. Try not to float away.',ja:'あいつから重力装置を引っぺがした。グラヴリフト・ウォーカーだ。飛んでいかないようにね。'},
  {bg:'bg_city',fx:'lines',sting:'rise',chars:[{id:'asmon',x:.5,armor:'ace',s:1.1}],who:'asmon',en:'So the little Brigade broke my walker. Fine. I will come see you myself.',ja:'小さな旅団が、わたしのウォーカーを壊したと。いいだろう。わたし自ら会いに行こう。'},
 ],
 s_m8:[
  {bg:'bg_city',fx:'lines',sting:'title',chars:[{id:'asmon',x:.5,armor:'ace',s:1.2}],who:'asmon',en:'I am Asmon. Violet Override. LOOMCORP’s best, and frankly, its only reason to exist.',ja:'わたしはアズモン。ヴァイオレット・オーバーライド。ルームコープ最強。いや、ルームコープが存在する唯一の理由だ。'},
  {bg:'bg_city',chars:[{id:'pooping',x:.5}],who:'pooping',fx:'red',en:'Do NOT try to win this. Hurt him enough and he’ll back off. Then come home.',ja:'勝とうとするな。じゅうぶん痛めつければ引く。そしたら帰ってこい。'},
 ],
 d_m8:[
  {bg:'bg_city',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'Ha! You actually scratched the paint. Keep that. I’ll want it back at the Spire.',ja:'はは！本当に塗装に傷をつけたな。それは取っておけ。スパイアで返してもらう。'},
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'He dropped parts when you hit him. A halo sensor and a plasma blade. And... purple paint?',ja:'当てたとき部品を落としていった。ヘイローセンサーとプラズマブレード。それと……紫の塗料？'},
 ],
 s_m9:[
  {bg:'bg_spire',fx:'lines',sting:'rise',en:'The LOOMCORP Spire. Every watt in the city is being pulled toward it.',ja:'ルームコープ・スパイア。街じゅうの電力が、そこへ吸い寄せられている。'},
  {bg:'bg_spire',chars:[{id:'pinco',x:.3,armor:1},{id:'pooh',x:.55,armor:1},{id:'bean',x:.8,armor:1}],who:'pinco',fx:'slash',sting:'clank',en:'Cut the anchors. Beat the ace. Kill the reactor. Brigade, sortie!',ja:'アンカーを断ち、エースを倒し、リアクターを止める。旅団、出撃！'},
 ],
 d_m9:[
  {bg:'bg_spire',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'They told me the Heart Reactor would make me unbeatable. They lied. It was making me theirs.',ja:'ハート・リアクターでわたしは無敵になると言われた。嘘だった。わたしを奴らのものにしていたんだ。'},
  {bg:'bg_town',fx:'lines',en:'The Spire went dark. The grid came back to the districts. But LOOMCORP’s machines were still out there.',ja:'スパイアは沈黙し、電力は地区に戻った。だが、ルームコープの機械はまだ残っていた。'},
 ],
 s_m10:[
  {bg:'bg_town',chars:[{id:'party',x:.5}],who:'party',en:'Festival night in the slums. Leftover LOOMCORP machines just woke up, and they are angry.',ja:'スラムの祭りの夜。ルームコープの残存機械が目を覚ました。しかもご機嫌ななめだ。'},
  {bg:'bg_town',chars:[{id:'pooh',x:.3,armor:1},{id:'bean',x:.72,armor:1}],who:'bean',en:'Protect the big beacon. Nobody cancels a festival on my watch.',ja:'大ビーコンを守れ。ぼくの目の前で、祭りは中止させない。'},
 ],
 d_m10:[
  {bg:'bg_town',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'Don’t look at me like that. I owed you one. Maybe two.',ja:'そんな目で見るな。借りがあっただけだ。ひとつ、いや、ふたつかな。'},
  {bg:'bg_town',chars:[{id:'pinco',x:.35,armor:1},{id:'asmon',x:.68,armor:'ace'}],who:'pinco',en:'The Brigade has room for one more. Even a corporate ace.',ja:'旅団には、あと一人ぶん席があるわ。元エースでもね。'},
  {bg:'bg_hangar',chars:[{id:'asmon',x:.5,armor:1,s:1.15}],who:'asmon',fx:'slash',sting:'title',en:'Then weld something purple on me. I’m in.',ja:'なら、紫の何かを溶接してくれ。乗った。'},
  {bg:'bg_city',fx:'lines',sting:'rise',en:'ASMON JOINED THE PATCHWORK BRIGADE. Free sorties are open. Keep welding.',ja:'アズモンがパッチワーク旅団に加わった。フリー出撃が解放された。溶接をつづけよう。'},
  {bg:'bg_city',credits:1},
 ],
};
// Anime opening: auto-timed cuts (t = seconds on screen)
const OPENING=[
 {t:1.7,kind:'cap',bg:'bg_city',big:{en:'NEO SEAM CITY',ja:'ネオシーム・シティ'},small:{en:'YEAR 2189 · AFTER THE COLLAPSE',ja:'2189年・崩壊のあと'}},
 {t:1.6,kind:'cap',bg:'bg_factory',red:1,big:{en:'LOOMCORP OWNS THE SKY',ja:'空はルームコープのもの'},small:{en:'The grid. The water. The light.',ja:'電力も、水も、光も。'}},
 {t:1.6,kind:'cap',bg:'bg_town',big:{en:'WE OWN THE SCRAP',ja:'スクラップは俺たちのもの'},small:{en:'And Glimmer welds anything to anything.',ja:'そしてグリマーは、何でも何にでも溶接する。'}},
 {t:1.25,kind:'cut',id:'pinco',col:'#ff4fa0',name:{en:'PINCO',ja:'ピンコ'},role:{en:'BALANCED STRIKER',ja:'バランス型ストライカー'}},
 {t:1.25,kind:'cut',id:'pooh',col:'#ffc21f',name:{en:'POOH',ja:'プー'},role:{en:'HEAVY FORTRESS',ja:'重装フォートレス'},flip:1},
 {t:1.25,kind:'cut',id:'bean',col:'#7dff4a',name:{en:'MR BEAN',ja:'ミスター・ビーン'},role:{en:'AGILE SKIRMISHER',ja:'高機動スカーミッシャー'}},
 {t:1.8,kind:'cap',bg:'bg_hangar',squad:1,big:{en:'NO PILOTS. NO COCKPIT.',ja:'パイロットなし。コクピットなし。'},small:{en:'Steel welded straight on.',ja:'鋼鉄を、直接溶接。'}},
 {t:1.35,kind:'cut',id:'asmon',col:'#b05cff',name:{en:'ASMON',ja:'アズモン'},role:{en:'LOOMCORP ACE',ja:'ルームコープのエース'},villain:1,flip:1},
 {t:.32,kind:'flash',bg:'bg_spire'},{t:.32,kind:'flash',bg:'bg_court'},{t:.32,kind:'flash',bg:'bg_zone'},{t:.32,kind:'flash',bg:'bg_highway'},
 {t:3.2,kind:'title'},
];
// in-combat radio lines
const COMMS={
 c_m1raid:{who:'pooping',en:'Those aren’t training drones! Light them up!',ja:'訓練用じゃないぞ！撃ち落とせ！'},
 c_m3kermit:{who:'dkermit',en:'Who let the scrap into my refinery?',ja:'わたしの精製所にスクラップを入れたのはだれだ？'},
 c_m8asmon:{who:'asmon',en:'Show me something worth remembering.',ja:'覚えておく価値のあるものを見せてみろ。'},
 c_m9asmon:{who:'asmon',en:'No retreat this time. For either of us.',ja:'今度は退かない。どちらもな。'},
 c_m9heart:{who:'pooping',en:'The Heart Reactor is exposed! Hit it with everything!',ja:'ハート・リアクターがむき出しだ！全部ぶつけろ！'},
 c_m10:{who:'pooping',en:'Keep them off the beacon!',ja:'ビーコンに近づけるな！'},
 c_ally:{who:'asmon',en:'Move over. The Override is cutting in.',ja:'どけ。オーバーライドが割り込むぞ。'},
 c_break:{who:'pooping',en:'He’s staggered! Punish him!',ja:'崩れた！叩き込め！'},
 c_lowap:{who:'max',en:'Your plating is shredded! Use a repair kit!',ja:'装甲がボロボロだ！リペアキットを使え！'},
 c_retreat:{who:'pooping',en:'Target is withdrawing. Good work.',ja:'目標が撤退していく。よくやった。'},
 c_boss2:{who:'pooping',en:'It’s kneeling! The core is open!',ja:'ひざをついた！コアが開いたぞ！'},
 z_start:{who:'pooping',en:'Husks in the quarantine zone. They’re slow now. They won’t stay slow.',ja:'隔離区域にハスクだ。今はのろい。いつまでもそうじゃないぞ。'},
 z_door:{who:'party',en:'New area open. More room to move... and more ways in for them.',ja:'新エリア解放。動ける場所は増えた……あいつらの入り口もな。'},
 z_smart:{who:'max',en:'They’re learning! Watch your flanks!',ja:'あいつら学習してる！側面に気をつけろ！'},
 z_climb:{who:'pooping',en:'They’re climbing the walls now!',ja:'壁をよじ登ってきたぞ！'},
 z_boss:{who:'party',en:'Big one inbound. That’s a Brute.',ja:'デカいのが来る。ブルートだ。'},
};
// character banter (random during fights)
const BANTER={
 pinco:[{en:'Too slow! Try to keep up!',ja:'おそい！ついてきなさい！'},{en:'Pink means danger, darling.',ja:'ピンクは危険の色よ。'},{en:'That’s my favorite move. Again!',ja:'お気に入りの技よ。もう一回！'}],
 pooh:[{en:'Sorry! That was a very big hug.',ja:'ごめんね！とっても大きなハグだったね。'},{en:'Hunny power, full blast!',ja:'ハニーパワー、全開！'},{en:'I think we are winning!',ja:'ぼくたち、勝ってると思う！'}],
 bean:[{en:'No arms. No problem!',ja:'うでなし。問題なし！'},{en:'Hehe. Pod coming through!',ja:'へへ。ポッドが通るよ！'},{en:'Was that me? That was me!',ja:'今のぼく？ぼくだよね！'}],
 asmon:[{en:'Kneel. Or don’t. You’ll fall anyway.',ja:'ひざまずけ。いや、どうせ倒れる。'},{en:'Violet looks good on everything.',ja:'紫は何にでも似合う。'},{en:'Too easy. Send more.',ja:'簡単すぎる。もっと来い。'}],
 chief:[{en:'That’s what I’m talking about!',ja:'そうこなくちゃ！'},{en:'Keep that combo going!',ja:'コンボを切らすな！'},{en:'The whole yard is watching!',ja:'ヤードのみんなが見てるぞ！'}],
};
// hype announcer (combo milestones)
const HYPE=[[5,{en:'NICE!',ja:'ナイス！'}],[10,{en:'GREAT!',ja:'グレート！'}],[20,{en:'SMASHING!',ja:'スマッシング！'}],[35,{en:'UNSTOPPABLE!',ja:'アンストッパブル！'}],[50,{en:'LEGENDARY!!',ja:'レジェンダリー！！'}],[80,{en:'HEAVY STITCH!!!',ja:'ヘビー・スティッチ！！！'}]];
// UI strings: [en, ja]
const UI={
 tap:['TAP TO START','タップしてスタート'],story:['Story','ストーリー'],cont:['Continue','つづきから'],newg:['New game','はじめから'],
 newgQ:['Start a new game? Your current save (parts, credits, FLUX and progress) will be erased.','新しくはじめますか？今のセーブ（パーツ・クレジット・FLUX・進行）は消えます。'],
 yes:['Yes, start over','はい、はじめから'],no:['Cancel','キャンセル'],noSave:['No save yet','セーブなし'],
 hangar:['Hangar','ハンガー'],sortie:['Sortie','出撃'],missions:['Missions','ミッション'],options:['Options','オプション'],
 gacha:['Gacha','ガチャ'],zombies:['Dead Zone','デッドゾーン'],zsub:['Zombie survival','ゾンビ・サバイバル'],gsub:['Banners · FLUX','バナー・FLUX'],
 allgames:['All games','ゲーム一覧'],back:['Back','もどる'],menu:['Menu','メニュー'],resume:['Resume','再開'],retry:['Retry','リトライ'],
 quit:['Quit to menu','メニューへ'],tohangar:['To hangar','ハンガーへ'],next:['Next episode','次のエピソード'],skip:['Skip','スキップ'],
 credits:['Credits','クレジット'],buy:['Buy','購入'],equip:['Equip','装備'],equipped:['Equipped','装備中'],owned:['Owned','所持'],
 locked:['Locked','ロック中'],clearTo:['Clear','クリアで解放：'],paint:['Paint','ペイント'],parts:['Parts','パーツ'],
 cat_wpn:['Weapons','武器'],cat_frame:['Frame','フレーム'],cat_sys:['Systems','システム'],cat_paint:['Paint','ペイント'],
 slot_head:['Head','ヘッド'],slot_core:['Core','コア'],slot_arms:['Arms','アーム'],slot_legs:['Legs','レッグ'],slot_booster:['Booster','ブースター'],
 slot_gen:['Generator','ジェネレーター'],slot_fcs:['Targeting','照準ユニット'],slot_wr:['Right weapon','右武器'],slot_wl:['Left weapon','左武器'],
 slot_sh:['Shoulder','ショルダー'],slot_bk:['Back','バック'],slot_arms_pod:['Side pylons','サイドパイロン'],slot_legs_float:['Hover rings','ホバーリング'],
 slot_legs_pod:['Tail drive','テイルドライブ'],
 st_ap:['AP','AP'],st_def:['Defense','防御'],st_spd:['Speed','スピード'],st_en:['Energy','エネルギー'],st_fire:['Firepower','火力'],st_load:['Load','積載'],
 st_stab:['Balance','バランス'],overweight:['OVERWEIGHT: slower','重量オーバー：減速'],
 opt_lang:['Language','言語'],opt_sound:['Sound','サウンド'],opt_music:['Music','音楽'],opt_sfx:['Effects','効果音'],opt_shake:['Screen shake','画面ゆれ'],
 opt_quality:['Graphics','グラフィック'],q_low:['Fast','軽量'],q_high:['Pretty','高画質'],on:['On','オン'],off:['Off','オフ'],
 opt_cam:['Camera','カメラ'],cam_fp:['1st person','一人称'],cam_sh:['Shoulder','肩越し'],cam_tp:['3rd person','三人称'],
 cheat:['Cheat code','チートコード'],cheatPh:['Enter code','コードを入力'],apply:['Apply','適用'],
 cheatOk:['AMSABABY! +1,000,000 credits, +100,000 FLUX, every part and paint, every mission, Asmon unlocked. Overdrive on: no damage, triple damage.','AMSABABY！ +1,000,000クレジット、+100,000 FLUX、全パーツ・全ペイント・全ミッション、アズモン解放。オーバードライブ：ダメージなし・攻撃3倍。'],
 cheatOff:['Turn Overdrive off','オーバードライブを切る'],cheatOn:['Overdrive is on (AMSABABY).','オーバードライブ有効（AMSABABY）'],cheatBad:['Nope, that code does nothing.','そのコードは効かないよ。'],
 reset:['Reset progress','進行をリセット'],resetQ:['Erase all progress?','すべての進行を消しますか？'],
 howto:['How to play','あそびかた'],
 howtoTxt:['Left stick — move. Drag the screen — look around.\nR / L — fire your right and left weapons. Targets lock on automatically; LOCK switches.\nSLASH — sword combo, up to 3 hits. Locked on, you lunge at the target.\nDRIFT — skid into a sharp turn with a speed burst. You can’t be hit mid-drift.\nDASH — quick boost. ▲ — fly up. AB — assault boost into your target.\nSP — shoulder or back weapon; ⇄ swaps them. + — repair kit.\nSUPER — when the meter is full, unleash your super move.\nCAM — switch between 1st person, shoulder and 3rd person views.\nFill an enemy’s balance meter to break it, then hit hard. Hold a blade button to charge a big slash.',
  '左スティック — 移動。画面をドラッグ — 視点移動。\nR / L — 右・左の武器を撃つ。ロックは自動、LOCKで切替。\nSLASH — 最大3段の斬撃コンボ。ロック中は敵へ踏み込む。\nDRIFT — 急旋回のスピードドリフト。ドリフト中は無敵。\nDASH — クイックブースト。▲ — 上昇。AB — 敵へアサルトブースト。\nSP — 肩・背中の武器、⇄で切替。+ — リペアキット。\nSUPER — ゲージ満タンで必殺技。\nCAM — 一人称・肩越し・三人称を切替。\n敵のバランスゲージを満タンにすると崩れる。そこで大技を。ブレードボタン長押しでチャージ斬り。'],
 ep:['EPISODE','第'],epSuf:['','話'],free:['FREE SORTIE','フリー出撃'],
 rank:['Rank','ランク'],time:['Time','タイム'],apLeft:['AP left','残りAP'],kills:['Destroyed','撃破'],reward:['Reward','報酬'],
 newPart:['New part','新パーツ'],zrec:['Record','記録'],mclear:['MISSION COMPLETE','ミッション完了'],mfail:['MISSION FAILED','ミッション失敗'],
 brief:['Briefing','ブリーフィング'],launch:['Launch','出撃'],best:['Best','最高'],wave:['Wave','ウェーブ'],
 break:['BREAK','ブレイク'],staggered:['STAGGERED','スタッガー'],punish:['PUNISH!','叩き込め！'],enout:['EN OUT','EN切れ'],
 lockon:['LOCK','ロック'],reload:['RELOAD','リロード'],kits:['Repair','リペア'],noTarget:['No target','ターゲットなし'],noAmmo:['NO AMMO','弾切れ'],
 tip_move:['Push the left stick to move. Tap DASH for a quick boost, DRIFT for a sharp skid turn.','左スティックで移動。DASHでクイックブースト、DRIFTで急旋回ドリフト。'],
 tip_fire:['Targets lock on automatically. Hold R to fire. LOCK switches targets.','ロックは自動。Rを押しっぱなしで射撃。LOCKで対象切替。'],
 tip_blade:['Shoot a drone until its balance meter breaks, then tap SLASH. Tap it again for a 3-hit combo.','バランスゲージが崩れるまで撃ち、SLASHで斬れ。連打で3段コンボ。'],
 tip_dash:['Dodge shots with DRIFT or DASH. SP fires missiles. Fill the meter, then hit SUPER!','DRIFTかDASHで弾をかわせ。SPでミサイル。ゲージがたまったらSUPER！'],
 tip_escort:['Stay close to the haulers. Drones target them first.','輸送車のそばにいろ。ドローンは輸送車を先に狙う。'],
 tip_defend:['Drones go for the generator. Intercept them early.','ドローンは発電機を狙う。早めに迎え撃て。'],
 tip_stagger:['Fill his balance meter, then use a charged blade, a SLASH combo or your SUPER.','バランスゲージを満たし、チャージ斬りかSLASHコンボかSUPERを。'],
 tip_boss:['Shoot the glowing leg joints. When it kneels, hit the core. Fly up with ▲ to clear its shockwave.','光る脚の関節を撃て。ひざをついたらコアを叩け。衝撃波は▲で上昇してかわせ。'],
 tip_zombie:['Shoot and slash Husks for points. Spend points on gates, barricades and the supply station.','ハスクを撃って斬ってポイントを稼げ。ポイントでゲート、バリケード、補給ステーションを使え。'],
 obj_trucks:['Haulers','輸送車'],obj_gen:['Generator','発電機'],obj_lantern:['Beacon','ビーコン'],scan:['Scanning','スキャン中'],
 asmonJoined:['Asmon can now be selected in the hangar.','ハンガーでアズモンを選べるようになった。'],
 updated:['Update available — tap to reload','アップデートあり — タップで再読み込み'],
 sel:['Select','選択'],free_t:['Free sorties','フリー出撃'],story_t:['Story episodes','ストーリー'],cleared:['Cleared','クリア'],
 shop:['Shop','ショップ'],cost:['Cost','価格'],notEnough:['Not enough credits','クレジットが足りない'],
 bodyOnly:['Only for','専用：'],compare:['vs equipped','装備中と比較'],brand:['A LANZAGAMES production','LANZAGAMES 制作'],
 title_sub:['Weld-on mech action','溶接メカアクション'],tapAudio:['Tap anywhere for sound','タップでサウンドON'],
 creditsTxt:['HEAVY STITCH\nA LANZAGAMES production\n\nStarring Pinco, Pooh and Mr Bean\nwith Asmon, Bronny, Mr Pooping, Max, Party Hat Guy and Dark Kermit\n\nThank you for playing.','ヘビー・スティッチ\nLANZAGAMES 制作\n\n出演：ピンコ、プー、ミスター・ビーン\nアズモン、ブロニー、ミスター・プーピング、マックス、パーティーハット・ガイ、ダーク・カーミット\n\nプレイしてくれてありがとう。'],
 // fun
 hits:['HITS','HITS'],super:['SUPER','必殺'],superReady:['SUPER READY!','必殺技OK！'],drift:['DRIFT','ドリフト'],slash:['SLASH','斬撃'],dodge:['DODGE','回避'],
 // gacha
 flux:['FLUX','FLUX'],alloy:['Alloy','アロイ'],pull1:['Pull ×1','1回引く'],pull10:['Pull ×10','10回引く'],odds:['Odds','提供割合'],
 normalB:['Standard','通常'],eventB:['EVENT','イベント'],endsIn:['Ends in','残り'],pity:['Pity','天井'],featured:['Featured','ピックアップ'],
 rateUp:['RATE UP','確率アップ'],notEnoughFlux:['Not enough FLUX. Earn it in missions, Dead Zone rounds and first clears.','FLUXが足りない。ミッション、デッドゾーンのラウンド、初回クリアで手に入る。'],
 dupe:['Duplicate → Alloy','重複 → アロイ'],newItem:['NEW!','NEW!'],tapCont:['Tap to continue','タップでつづける'],gNote:['FLUX is earned by playing. No real money, ever.','FLUXはプレイで手に入る。課金は一切なし。'],
 guarantee:['10-pull: at least one SR or better','10連：SR以上1つ確定'],pityNote:['Featured UR guaranteed by pull','ピックアップUR確定まで'],
 upgrade:['Upgrade','強化'],lv:['Lv','Lv'],maxLv:['MAX','MAX'],notEnoughAlloy:['Not enough Alloy','アロイが足りない'],gachaOnly:['Gacha','ガチャ限定'],
 welcomeV2:['Heavy Stitch 2.0! Your parts are safe. Here is 1,000 FLUX to try the new Gacha.','ヘビー・スティッチ2.0！パーツはそのまま。新ガチャ用に1,000 FLUXをどうぞ。'],
 // zombies
 round:['ROUND','ラウンド'],points:['Points','ポイント'],open:['Open','開ける'],rebuild:['Rebuild','修理'],supply:['Supply','補給'],
 zbest:['Best round','最高ラウンド'],zover:['OVERRUN','全滅'],zroundsT:['Rounds survived','生存ラウンド'],zscore:['Score','スコア'],
 newBest:['NEW BEST!','自己ベスト！'],husks:['Husks','ハスク'],fluxEarned:['FLUX earned','獲得FLUX'],zstart:['Start','スタート'],
 zhowto:['Husks come through the barricades. Rebuild boards for points, buy gates to reach bigger areas, and use the supply station to refill ammo and armor. The more area you open, the smarter they get.','ハスクはバリケードから入ってくる。板を直してポイント、ゲートを買って広いエリアへ、補給ステーションで弾と装甲を回復。エリアを広げるほど、あいつらは賢くなる。'],
 zgo:['Enter the Dead Zone','デッドゾーンへ'],
};
