'use strict';
// v1.5.7: Pooh & the gang do the "LeBron, LeBron, LeBroooon" chant. Original backing beat ('chant' style) + formant-synth chant voices.
// The chant hook is the viral fan chant; music, melody pitches and all other text are original. No league/team logos.
window.CLIPS=window.CLIPS||[];
(()=>{
// one chant cycle = 8 beats: Le-Bron (b0), Le-Bron (b2), Le-Broooooon (b4, held). [beat,midi,durBeats,vowel,who,amp,glide,cons,vib,grump]
const cyc=(who,top,a,o)=>{o=o||{};const g=o.grump?1:0;return [
 [0,67,.45,'e',who,a,0,'l',0,g],[.5,71,1.2,'o',who,a,0,'b',0,g],
 [2,67,.45,'e',who,a,0,'l',0,g],[2.5,71,1.2,'o',who,a,0,'b',0,g],
 [4,67,.45,'e',who,a,0,'l',0,g],[4.5,top,o.hold||3.3,'o',who,a*1.1,o.gl||0,'b',o.vib||0,g]]};
const G1=['pooh'],G2=['pooh','pinco','bean'],G3=['pooh','pinco','bean','pooping','bronny'],G4=G3.concat('asmon');
const K=(t0,dur,en,ja,st,y,o)=>[t0,t0+dur,en,ja,st||'big',y||.2,o];
// karaoke lines for one cycle (times in beats inside the shot)
const kar=(big,longEN,longJA,y)=>[K(0,2,'LeBron,','レブロン、','big',y||.18),K(2,2,'LeBron,','レブロン、','big',y||.18),K(4,4,longEN,longJA,big?'neon':'big',y||.18,big?{g:'#ffd84a'}:undefined)];
CLIPS.push(
{id:'lb01',cat:'comedy',also:['la'],by:'pooh',song:'chant',seed:7101,bpm:100,likes:612000,cm:24800,
 cap:['the gang tried the LeBron chant and it got out of hand 🎤👑 #lebronchant #pooh #bronny','みんなで「レブロン」チャントをやったら止まらなくなった🎤👑 #レブロン #プー #ブロニー'],
 snd:['LeBron Chant (Pooh & the Gang)','レブロン・チャント（プーと仲間たち）'],
 com:[['bronny','I am not crying, you are 😭👑','泣いてない、泣いてるのはそっち😭👑'],['asmon','I was forced. @pooh.cooks knows what he did.','無理やりだった。@pooh.cooks のせい。'],['pinco','the third LeBroooon gave me chills','3回目のレブローーンで鳥肌'],['bean','I held the note with my one tooth','歯1本で音を伸ばした'],['pooping','@bronny9 you’re welcome','@bronny9 どういたしまして']],
 shots:[
 {d:8,bg:'stage',cam:[1.15,1.05,.5,.55,.5,.5],a:[['c_pooh_1',.5,.9,.46,'bob',{in:'pop'}]],fx:[['spot',0,8,{x:.5}],['notes',0,8]],tx:kar(0,'LeBroooon','レブローーン').concat([K(0,8,'Pooh: “just once, for Bronny”','プー「ブロニーのために1回だけ」','tag',.32)]),sing:cyc(G1,74,1)},
 {d:8,bg:'stage',tr:'whip',a:[['c_pinco_1',.26,.86,.28,'dance'],['c_bean_2',.75,.86,.26,'hop'],['c_pooh_1',.5,.92,.36,'bob']],fx:[['notes',0,8],['sparkle',4,8]],tx:kar(0,'LeBrooooon','レブローーン').concat([K(0,8,'(Pinco and Mr Bean join)','（ピンコとミスター・ビーンも参加）','tag',.32)]),sing:cyc(G2,76,1.1,{hold:3.4})},
 {d:8,bg:'stage',tr:'zoom',a:[['c_pinco_1',.26,.8,.24,'dance'],['c_pooping_1',.75,.8,.23,'dance'],['c_bronny_3',.5,.8,.3,'bob'],['c_bean_2',.32,.95,.23,'hop'],['c_pooh_1',.68,.95,.26,'bob']],fx:[['confetti',4,8,{n:30}],['rays',4,8,{c:'#ffe7a0'}]],tx:kar(1,'LeBROOOOON','レブローーーン').concat([K(0,8,'Bronny: 🥹👑','ブロニー：🥹👑','tag',.32)]),sing:cyc(G3,79,1.2,{hold:3.4,vib:6})},
 {d:8,bg:'stage',tr:'cut',cam:[1,1.25,.5,.55,.5,.5],a:[['c_asmon_0',.5,.92,.5,'idle']],fx:[['sweat',0,8,{x:.62,y:.3}]],tx:[K(0,8,'Asmon:','アスモン：','tag',.2),K(1,8,'“I don’t do chants.”','「チャントはやらない」','bub',.28,{who:'asmon'}),K(4.5,8,'(everyone stares)','（全員が見つめる）','tag',.4)],sing:cyc(G3,79,.5,{hold:3.4}),sx:[[4.5,'tick']]},
 {d:8,bg:'stage',tr:'flash',a:[['c_asmon_0',.5,.92,.48,'tremble']],fx:[['lines',0,8]],tx:[K(0,2,'…LeBron.','…レブロン。','big',.2),K(2,2,'…LeBron.','…レブロン。','big',.2),K(4,4,'…LeBroooon.','…レブローーン。','big',.2),K(0,8,'(grumpy, but in tune)','（不機嫌だけど音程は正確）','tag',.32)],sing:cyc(['asmon'],74,1.3,{grump:1,hold:3.3})},
 {d:8,bg:'stage',tr:'zoom',a:[['c_pinco_1',.26,.8,.23,'dance'],['c_asmon_1',.75,.8,.26,'bob'],['c_bronny_1',.5,.8,.31,'hop'],['c_bean_2',.28,.96,.21,'hop'],['c_pooping_1',.5,.97,.2,'dance'],['c_pooh_1',.72,.96,.23,'bob']],fx:[['rays',0,8,{c:'#ffd84a'}],['confetti',3,8,{n:60}],['notes',0,8]],tx:kar(1,'LeBROOOOOON!!','レブローーーン！！').concat([K(0,8,'EVERYONE (even Asmon)','全員（アスモンも）','tag',.32)]),sing:cyc(G4,83,1.3,{hold:3.5,vib:6.5})},
 {d:6,bg:'stage',tr:'cut',a:[['c_bronny_1',.5,.9,.46,'hop'],['c_asmon_0',.76,.9,.3,'idle'],['c_pooh_2',.25,.9,.29,'bob']],fx:[['hearts',0,6,{n:10}],['confetti',0,6,{n:20}]],tx:[K(0,6,'Bronny: “again!!”','ブロニー「もう1回！！」','big',.18),K(2,6,'Asmon: “absolutely not.” (he’s smiling)','アスモン「絶対イヤだ」（笑ってる）','tag',.32)],sx:[[0,'cheer'],[2,'giggle']]}
 ]}
);
})();
