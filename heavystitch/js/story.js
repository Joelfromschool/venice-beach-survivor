/* Heavy Stitch: original story scenes and UI strings (EN/JA). */
'use strict';
// Shot fields: bg, chars:[{id,x,s,armor,face}], who, en, ja, fx ('lines','flash','shake','zoom','slash','red','halftone'), sting
const SCENES={
 opening:[
  {bg:'bg_sky',fx:'lines',sting:'rise',en:'After the Kingdom was mended, the leftover thread did not stop glowing.',ja:'王国が縫い直されたあとも、余った糸は光りつづけた。'},
  {bg:'bg_town',en:'The Free Seams grew up around it. Patchwork towns, honey, lanterns, and nobody in charge.',ja:'そのまわりに「フリーシーム」が生まれた。つぎはぎの町、ハチミツ、ランタン、そして支配者なし。'},
  {bg:'bg_factory',fx:'red',sting:'hit',en:'Then the Grey Loom Consortium came to harvest the Glimmer Thread for their war-looms.',ja:'そこへグレイルーム・コンソーシアムがやって来た。戦争織機のために、グリマースレッドを刈り取るために。'},
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'Plush folk are too small for cockpits. So I stopped building cockpits.',ja:'ぬいぐるみにコクピットは大きすぎる。だから、コクピットを作るのをやめたんだ。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.3,armor:1},{id:'pooh',x:.55,armor:1},{id:'bean',x:.8,armor:1}],fx:'slash',sting:'clank',en:'No pilots. No cockpit. Steel bolted straight on, held by Glimmer stitches.',ja:'パイロットなし。コクピットなし。鋼鉄を直接ボルト留め。グリマーの縫い目でつなぎとめる。'},
  {bg:'bg_sky',fx:'lines',sting:'title',title:1},
 ],
 s_m1:[
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Welcome to the Bobbin Yard, Patchwork Brigade. I’m Chief. I run the yard and I yell on the radio.',ja:'ボビン・ヤードへようこそ、パッチワーク旅団。俺はチーフ。ヤードを仕切って、無線でどなる係だ。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.35,armor:1},{id:'max',x:.72,s:.85}],who:'max',en:'First plates are on. Feel the weight? Good. That weight is what keeps you alive.',ja:'最初の装甲はつけた。重さを感じる？いいね。その重さが命を守る。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.5,armor:1,s:1.15}],who:'pinco',fx:'zoom',en:'It fits like a winter coat made of trucks. I love it.',ja:'トラックでできた冬のコートみたい。気に入ったわ。'},
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Training drones are up. Boost, lock on, shoot. Try not to scratch my floor.',ja:'訓練ドローンを上げた。ブースト、ロックオン、撃て。床に傷はつけるなよ。'},
 ],
 d_m1:[
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Those were real Loom drones. They were scouting us.',ja:'あれは本物のルームのドローンだ。俺たちを偵察してた。'},
  {bg:'bg_hangar',chars:[{id:'pooh',x:.3,armor:1},{id:'bean',x:.72,armor:1}],who:'pooh',en:'Then we should get ready. And maybe have a snack first.',ja:'じゃあ準備しなきゃ。まずはおやつかな。'},
 ],
 s_m2:[
  {bg:'bg_highway',chars:[{id:'party',x:.5}],who:'party',en:'Party Hat Guy here, your friendly information broker. Three honey haulers cross the desert tonight.',ja:'パーティーハット・ガイだ。親切な情報屋さ。今夜、ハチミツ輸送車3台が砂漠を渡る。'},
  {bg:'bg_highway',chars:[{id:'party',x:.5}],who:'party',en:'The Loom wants that honey. It runs every lantern in the Free Seams.',ja:'ルームはそのハチミツを狙ってる。フリーシームのランタンは全部それで灯ってるんだ。'},
  {bg:'bg_highway',chars:[{id:'pooh',x:.5,armor:1,s:1.15}],who:'pooh',fx:'zoom',en:'Nobody takes the honey. Not tonight.',ja:'ハチミツはだれにも渡さない。今夜はね。'},
 ],
 d_m2:[
  {bg:'bg_town',chars:[{id:'pooh',x:.5,armor:1}],who:'pooh',en:'The town gave us a jar of thanks. And Max made me something.',ja:'町のみんながお礼にひとびんくれたよ。それに、マックスがなにか作ってくれた。'},
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'The Hunny Mortar. Lobs sticky shells. Enemies get stuck. You’re welcome.',ja:'ハニー・モーター。ねばねば弾を撃ち出す。敵は動けなくなる。どういたしまして。'},
 ],
 s_m3:[
  {bg:'bg_factory',fx:'red',chars:[{id:'pooping',x:.5}],who:'pooping',en:'This is Spindle Works. It pumps Glimmer Thread out of the ground and into Loom machines.',ja:'ここがスピンドル工廠。地中からグリマースレッドを吸い上げて、ルームの機械に流し込んでる。'},
  {bg:'bg_factory',chars:[{id:'bean',x:.5,armor:1,s:1.15}],who:'bean',fx:'zoom',en:'Four pumps. One gate. Zero problem. ...Probably one problem.',ja:'ポンプ4つ、ゲート1つ。問題ゼロ。……たぶん問題1つ。'},
 ],
 d_m3:[
  {bg:'bg_factory',chars:[{id:'dkermit',x:.5,armor:'ace',s:1.1}],who:'dkermit',fx:'red',en:'You plush scraps think you can cut our thread? The Loom remembers every stitch.',ja:'ぬいぐるみの切れはしが、我らの糸を断てるとでも？ルームはすべての縫い目を覚えている。'},
  {bg:'bg_hangar',chars:[{id:'pooping',x:.5}],who:'pooping',en:'The Regent got away. But the factory is dark. That’s a win.',ja:'リージェントは逃げた。だが工場は止まった。勝ちだ。'},
 ],
 s_m4:[
  {bg:'bg_hangar',fx:'red',sting:'alarm',chars:[{id:'pooping',x:.5}],who:'pooping',en:'They found the yard. Big push incoming. If the generator goes, we all go dark.',ja:'ヤードがバレた。大攻勢が来る。発電機がやられたら、全員おしまいだ。'},
  {bg:'bg_hangar',chars:[{id:'pinco',x:.3,armor:1},{id:'pooh',x:.55,armor:1},{id:'bean',x:.8,armor:1}],who:'pinco',fx:'slash',en:'Then nobody touches the generator. Brigade, positions!',ja:'なら発電機にはだれも近づけない。旅団、配置について！'},
 ],
 d_m4:[
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'Yard’s still standing. Pinco, I finished your rapier. Overlocked edge. Very rude.',ja:'ヤードは無事だ。ピンコ、レイピアが仕上がった。オーバーロック刃。とても失礼なやつ。'},
  {bg:'bg_court',chars:[{id:'party',x:.5}],who:'party',en:'Bad news. The Loom hired the Courtside Lancers. Their ace wants a one-on-one.',ja:'悪い知らせだ。ルームがコートサイド・ランサーズを雇った。そのエースが一騎打ちを望んでる。'},
 ],
 s_m5:[
  {bg:'bg_court',fx:'lines',chars:[{id:'bronny',x:.5,armor:'ace',s:1.15}],who:'bronny',sting:'hit',en:'Name’s Bronny. Slam Ward. I don’t care who signs the checks. I care who’s good.',ja:'ブロニーだ。機体はスラム・ワード。だれが金を払うかはどうでもいい。強いかどうかだ。'},
  {bg:'bg_court',chars:[{id:'pinco',x:.5,armor:1,s:1.1}],who:'pinco',fx:'zoom',en:'Then let’s find out.',ja:'なら、確かめましょう。'},
  {bg:'bg_court',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Watch his balance meter. When it breaks, he’s wide open. Make it count.',ja:'奴のバランスゲージを見ろ。崩れたら隙だらけだ。そこで決めろ。'},
 ],
 d_m5:[
  {bg:'bg_court',chars:[{id:'bronny',x:.5,armor:'ace'}],who:'bronny',en:'Good game. Real good. I’m done flying for the Loom. Call me if you need a fifth.',ja:'いい試合だった。ほんとに。ルームのために飛ぶのはやめだ。人手がいるなら呼んでくれ。'},
 ],
 s_m6:[
  {bg:'bg_canyon',chars:[{id:'party',x:.5}],who:'party',en:'Three relay beacons in the canyon. Scan them and we learn where the Loom keeps its heart.',ja:'峡谷に中継ビーコンが3つ。スキャンすれば、ルームの心臓がどこにあるかわかる。'},
  {bg:'bg_canyon',chars:[{id:'bean',x:.5,armor:1}],who:'bean',en:'Scan, smash the jammer, run away fast. My favorite kind of plan.',ja:'スキャンして、ジャマーをこわして、全力で逃げる。いちばん好きな作戦だ。'},
 ],
 d_m6:[
  {bg:'bg_spire',fx:'red',sting:'hit',chars:[{id:'party',x:.5}],who:'party',en:'Got it. The Loom Spire. And something huge is walking out of it toward us.',ja:'わかった。ルーム・スパイアだ。そこから、なにか巨大なものがこっちへ歩いてくる。'},
 ],
 s_m7:[
  {bg:'bg_canyon',fx:'shake',sting:'boom',en:'BOOM. BOOM. BOOM.',ja:'ズン。ズン。ズン。'},
  {bg:'bg_canyon',chars:[{id:'pooping',x:.5}],who:'pooping',en:'Loom Walker. Four legs, one core. Break the legs and it has to kneel.',ja:'ルーム・ウォーカー。脚4本、コア1つ。脚を壊せば、ひざをつく。'},
  {bg:'bg_canyon',chars:[{id:'pooh',x:.5,armor:1,s:1.15}],who:'pooh',fx:'zoom',en:'It is very big. But we are very brave.',ja:'すごく大きいね。でも、ぼくたちもすごく勇敢だよ。'},
 ],
 d_m7:[
  {bg:'bg_canyon',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'I pulled the hover gear off that thing. Cloudwalker. Try not to float away.',ja:'あいつからホバー装置を引っぺがした。クラウドウォーカーだ。飛んでいかないようにね。'},
  {bg:'bg_sky',fx:'lines',sting:'rise',chars:[{id:'asmon',x:.5,armor:'ace',s:1.1}],who:'asmon',en:'So the little Brigade broke my walker. Fine. I will come see you myself.',ja:'小さな旅団が、わたしのウォーカーを壊したと。いいだろう。わたし自ら会いに行こう。'},
 ],
 s_m8:[
  {bg:'bg_sky',fx:'lines',sting:'title',chars:[{id:'asmon',x:.5,armor:'ace',s:1.2}],who:'asmon',en:'I am Asmon. The Violet Sovereign. The Loom’s best, and frankly, its only reason to exist.',ja:'わたしはアズモン。ヴァイオレット・ソヴリン。ルーム最強。いや、ルームが存在する唯一の理由だ。'},
  {bg:'bg_sky',chars:[{id:'pooping',x:.5}],who:'pooping',fx:'red',en:'Do NOT try to win this. Hurt him enough and he’ll back off. Then come home.',ja:'勝とうとするな。じゅうぶん痛めつければ引く。そしたら帰ってこい。'},
 ],
 d_m8:[
  {bg:'bg_sky',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'Ha! You actually scratched the paint. Keep that. I’ll want it back at the Spire.',ja:'はは！本当に塗装に傷をつけたな。それは取っておけ。スパイアで返してもらう。'},
  {bg:'bg_hangar',chars:[{id:'max',x:.5,s:.9}],who:'max',en:'He dropped parts when you hit him. A halo sensor and a blade. And... purple paint?',ja:'当てたとき部品を落としていった。ヘイローセンサーとブレード。それと……紫の塗料？'},
 ],
 s_m9:[
  {bg:'bg_spire',fx:'lines',sting:'rise',en:'The Loom Spire. Every thread in the Free Seams is being pulled toward it.',ja:'ルーム・スパイア。フリーシームのすべての糸が、そこへ引き寄せられている。'},
  {bg:'bg_spire',chars:[{id:'pinco',x:.3,armor:1},{id:'pooh',x:.55,armor:1},{id:'bean',x:.8,armor:1}],who:'pinco',fx:'slash',sting:'clank',en:'Cut the anchors. Beat the king. Stop the heart. Brigade, sortie!',ja:'アンカーを断ち、王を倒し、心臓を止める。旅団、出撃！'},
 ],
 d_m9:[
  {bg:'bg_spire',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'They told me the Heart Loom would make me unbeatable. They lied. It was making me theirs.',ja:'ハート・ルームでわたしは無敵になると言われた。嘘だった。わたしを奴らのものにしていたんだ。'},
  {bg:'bg_town',fx:'lines',en:'The Spire went quiet. The thread stopped pulling. But the Loom’s machines were still out there.',ja:'スパイアは沈黙し、糸は引かれなくなった。だが、ルームの機械はまだ残っていた。'},
 ],
 s_m10:[
  {bg:'bg_town',chars:[{id:'party',x:.5}],who:'party',en:'Festival night in the Free Seams. Leftover Loom machines just woke up, and they are angry.',ja:'フリーシームの祭りの夜。ルームの残存機械が目を覚ました。しかもご機嫌ななめだ。'},
  {bg:'bg_town',chars:[{id:'pooh',x:.3,armor:1},{id:'bean',x:.72,armor:1}],who:'bean',en:'Protect the big lantern. Nobody cancels a festival on my watch.',ja:'大ランタンを守れ。ぼくの目の前で、祭りは中止させない。'},
 ],
 d_m10:[
  {bg:'bg_town',chars:[{id:'asmon',x:.5,armor:'ace'}],who:'asmon',en:'Don’t look at me like that. I owed you one. Maybe two.',ja:'そんな目で見るな。借りがあっただけだ。ひとつ、いや、ふたつかな。'},
  {bg:'bg_town',chars:[{id:'pinco',x:.35,armor:1},{id:'asmon',x:.68,armor:'ace'}],who:'pinco',en:'The Brigade has room for one more. Even a king.',ja:'旅団には、あと一人ぶん席があるわ。王様でもね。'},
  {bg:'bg_hangar',chars:[{id:'asmon',x:.5,armor:1,s:1.15}],who:'asmon',fx:'slash',sting:'title',en:'Then bolt something purple on me. I’m in.',ja:'なら、紫の何かをボルト留めしてくれ。乗った。'},
  {bg:'bg_sky',fx:'lines',sting:'rise',en:'ASMON JOINED THE PATCHWORK BRIGADE. Free sorties are open. Keep bolting.',ja:'アズモンがパッチワーク旅団に加わった。フリー出撃が解放された。ボルト留めをつづけよう。'},
  {bg:'bg_sky',credits:1},
 ],
};
// in-combat radio lines
const COMMS={
 c_m1raid:{who:'pooping',en:'Those aren’t training drones! Light them up!',ja:'訓練用じゃないぞ！撃ち落とせ！'},
 c_m3kermit:{who:'dkermit',en:'Who let the scraps into my factory?',ja:'わたしの工場に切れはしを入れたのはだれだ？'},
 c_m8asmon:{who:'asmon',en:'Show me something worth remembering.',ja:'覚えておく価値のあるものを見せてみろ。'},
 c_m9asmon:{who:'asmon',en:'No retreat this time. For either of us.',ja:'今度は退かない。どちらもな。'},
 c_m9heart:{who:'pooping',en:'The Heart Loom is exposed! Hit it with everything!',ja:'ハート・ルームがむき出しだ！全部ぶつけろ！'},
 c_m10:{who:'pooping',en:'Keep them off the lantern!',ja:'ランタンに近づけるな！'},
 c_ally:{who:'asmon',en:'Move over. The Sovereign is cutting in.',ja:'どけ。ソヴリンが割り込むぞ。'},
 c_break:{who:'pooping',en:'He’s staggered! Punish him!',ja:'崩れた！叩き込め！'},
 c_lowap:{who:'max',en:'Your plating is shredded! Use a patch kit!',ja:'装甲がボロボロだ！パッチキットを使え！'},
 c_retreat:{who:'pooping',en:'Target is withdrawing. Good work.',ja:'目標が撤退していく。よくやった。'},
 c_boss2:{who:'pooping',en:'It’s kneeling! The core is open!',ja:'ひざをついた！コアが開いたぞ！'},
};
// UI strings: [en, ja]
const UI={
 tap:['TAP TO START','タップしてスタート'],story:['Story','ストーリー'],cont:['Continue','つづきから'],newg:['New game','はじめから'],
 hangar:['Hangar','ハンガー'],sortie:['Sortie','出撃'],missions:['Missions','ミッション'],options:['Options','オプション'],
 allgames:['All games','ゲーム一覧'],back:['Back','もどる'],menu:['Menu','メニュー'],resume:['Resume','再開'],retry:['Retry','リトライ'],
 quit:['Quit to menu','メニューへ'],tohangar:['To hangar','ハンガーへ'],next:['Next episode','次のエピソード'],skip:['Skip','スキップ'],
 credits:['Credits','クレジット'],buy:['Buy','購入'],equip:['Equip','装備'],equipped:['Equipped','装備中'],owned:['Owned','所持'],
 locked:['Locked','ロック中'],clearTo:['Clear','クリアで解放：'],paint:['Paint','ペイント'],parts:['Parts','パーツ'],
 slot_head:['Head','ヘッド'],slot_core:['Core','コア'],slot_arms:['Arms','アーム'],slot_legs:['Legs','レッグ'],slot_booster:['Booster','ブースター'],
 slot_gen:['Generator','ジェネレーター'],slot_fcs:['Targeting','照準ユニット'],slot_wr:['Right weapon','右武器'],slot_wl:['Left weapon','左武器'],
 slot_sh:['Shoulder','ショルダー'],slot_bk:['Back','バック'],slot_arms_pod:['Side pylons','サイドパイロン'],slot_legs_float:['Hover rings','ホバーリング'],
 slot_legs_pod:['Tail drive','テイルドライブ'],
 st_ap:['AP','AP'],st_def:['Defense','防御'],st_spd:['Speed','スピード'],st_en:['Energy','エネルギー'],st_fire:['Firepower','火力'],st_load:['Load','積載'],
 st_stab:['Balance','バランス'],overweight:['OVERWEIGHT: slower','重量オーバー：減速'],
 opt_lang:['Language','言語'],opt_sound:['Sound','サウンド'],opt_music:['Music','音楽'],opt_sfx:['Effects','効果音'],opt_shake:['Screen shake','画面ゆれ'],
 opt_quality:['Graphics','グラフィック'],q_low:['Fast','軽量'],q_high:['Pretty','高画質'],on:['On','オン'],off:['Off','オフ'],
 cheat:['Cheat code','チートコード'],cheatPh:['Enter code','コードを入力'],apply:['Apply','適用'],
 cheatOk:['AMSABABY! +1,000,000 credits, every part and paint, every mission, Asmon unlocked. Overdrive on: no damage, triple damage.','AMSABABY！ +1,000,000クレジット、全パーツ・全ペイント・全ミッション、アズモン解放。オーバードライブ：ダメージなし・攻撃3倍。'],
 cheatOff:['Turn Overdrive off','オーバードライブを切る'],cheatOn:['Overdrive is on (AMSABABY).','オーバードライブ有効（AMSABABY）'],cheatBad:['Nope, that code does nothing.','そのコードは効かないよ。'],
 reset:['Reset progress','進行をリセット'],resetQ:['Erase all progress?','すべての進行を消しますか？'],
 howto:['How to play','あそびかた'],
 howtoTxt:['Move — stick or WASD\nBoost up — ▲ or Space\nDash — DASH or Shift\nAssault boost — AB or E (rush your target)\nFire right / left — the R and L buttons, the mouse, or J / K\nShoulder / back — SP or F; swap with ⇄ or Q\nChange target — LOCK or Tab\nPatch kit — + or the R key\nFill an enemy’s balance meter to break it, then hit hard.\nHold a blade button to charge a big slash.',
  '移動 — スティック / WASD\n上昇 — ▲ / Space\nダッシュ — DASH / Shift\nアサルトブースト — AB / E（ロック中の敵へ突撃）\n射撃（右・左） — R・Lボタン、マウス、または J・K\n肩・背中武器 — SP / F、⇄ / Q で切替\nターゲット切替 — LOCK / Tab\nパッチキット — + / Rキー\n敵のバランスゲージを満タンにすると崩れる。そこで大技を叩き込め。\nブレードはボタン長押しでチャージ斬り。'],
 ep:['EPISODE','第'],epSuf:['','話'],free:['FREE SORTIE','フリー出撃'],
 rank:['Rank','ランク'],time:['Time','タイム'],apLeft:['AP left','残りAP'],kills:['Destroyed','撃破'],reward:['Reward','報酬'],
 newPart:['New part','新パーツ'],mclear:['MISSION COMPLETE','ミッション完了'],mfail:['MISSION FAILED','ミッション失敗'],
 brief:['Briefing','ブリーフィング'],launch:['Launch','出撃'],best:['Best','最高'],wave:['Wave','ウェーブ'],
 break:['BREAK','ブレイク'],staggered:['STAGGERED','スタッガー'],punish:['PUNISH!','叩き込め！'],enout:['EN OUT','EN切れ'],
 lockon:['LOCK','ロック'],reload:['RELOAD','リロード'],kits:['Patch','パッチ'],noTarget:['No target','ターゲットなし'],
 tip_move:['Push the stick (or WASD) to move. Tap DASH for a quick boost.','スティック（WASD）で移動。DASHでクイックブースト。'],
 tip_fire:['Targets lock on automatically. Hold R or J to fire. LOCK switches targets.','ロックは自動。RまたはJを押しっぱなしで射撃。LOCKで対象切替。'],
 tip_blade:['Shoot a drone until its balance meter breaks, then press L to slash. Hold L to charge.','バランスゲージが崩れるまで撃ち、Lで斬れ。長押しでチャージ。'],
 tip_dash:['Dodge shots with DASH. SP fires missiles. ⇄ swaps shoulder and back.','DASHで弾をかわせ。SPでミサイル。⇄で肩と背中を切替。'],
 tip_escort:['Stay close to the haulers. Drones target them first.','輸送車のそばにいろ。ドローンは輸送車を先に狙う。'],
 tip_defend:['Drones go for the generator. Intercept them early.','ドローンは発電機を狙う。早めに迎え撃て。'],
 tip_stagger:['Fill his balance meter, then use a charged blade or a heavy shot.','バランスゲージを満たし、チャージ斬りか重い一撃を。'],
 tip_boss:['Shoot the glowing leg joints. When it kneels, hit the core. Boost up to jump its shockwave.','光る脚の関節を撃て。ひざをついたらコアを叩け。衝撃波は上昇でかわせ。'],
 obj_trucks:['Haulers','輸送車'],obj_gen:['Generator','発電機'],obj_lantern:['Lantern','ランタン'],scan:['Scanning','スキャン中'],
 asmonJoined:['Asmon can now be selected in the hangar.','ハンガーでアズモンを選べるようになった。'],
 updated:['Update available — tap to reload','アップデートあり — タップで再読み込み'],
 sel:['Select','選択'],free_t:['Free sorties','フリー出撃'],story_t:['Story episodes','ストーリー'],cleared:['Cleared','クリア'],
 shop:['Shop','ショップ'],cost:['Cost','価格'],notEnough:['Not enough credits','クレジットが足りない'],
 bodyOnly:['Only for','専用：'],compare:['vs equipped','装備中と比較'],brand:['A LANZAGAMES production','LANZAGAMES 制作'],
 title_sub:['Bolt-on mech action','ボルトオン・メカアクション'],tapAudio:['Tap anywhere for sound','タップでサウンドON'],
 creditsTxt:['HEAVY STITCH\nA LANZAGAMES production\n\nStarring Pinco, Pooh and Mr Bean\nwith Asmon, Bronny, Mr Pooping, Max, Party Hat Guy and Dark Kermit\n\nThank you for playing.','ヘビー・スティッチ\nLANZAGAMES 制作\n\n出演：ピンコ、プー、ミスター・ビーン\nアズモン、ブロニー、ミスター・プーピング、マックス、パーティーハット・ガイ、ダーク・カーミット\n\nプレイしてくれてありがとう。'],
};
