// Shared mutable game state (single object so modules can cooperate without cycles).
export const G={mode:'loading',time:0,clock:0,dim:'over',worlds:{},world:null,mobs:[],items:[],projectiles:[],npcs:[],markers:[],opt:{},flags:{},quest:{i:0,stage:'offer',counts:{}},save:null,stats:{kills:0,mined:0,crafted:0,deaths:0},bossesDown:{}};
export const VERSION='1.0.0';
