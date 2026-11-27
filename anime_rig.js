/* ===== Anime character rig: draws a 2D anime bust from parameters ===== */
(function(){
const OPT={
 gender:["boy","girl","man","woman"],
 age:["teen","young","adult","old"],
 face:["oval","round","sharp","square"],
 skin:["#f6d7bf","#eec3a0","#dfab84","#c98f67","#a8714d","#7f5236"],
 eyes:["big","sharp","sleepy","round"],
 eyeColor:["#3b2a20","#4b3626","#1f2a44","#2d4a2f","#6b3a1f","#111111"],
 hair:["spiky","side","messy","short","long","ponytail","bun","bald","curly","mohawk"],
 hairColor:["#1b1b1f","#3a2618","#5a3a22","#8a5a2b","#c9a14a","#7a1f2b","#2b3a6b","#e8e8e8","#9a9a9a"],
 outfit:["tshirt","shirt","hoodie","jacket","kurta","saree","vest","uniform"],
 outfitColor:["#2f3863","#b5523b","#2f6b4f","#c8902a","#6b3fa0","#1d1d24","#e9e4d8","#3b82c4","#c2417a","#7a5a3a"],
 accent:["#c8902a","#ffffff","#1d1d24","#e04a3a","#3fb5c9","#9ad14b"],
 extras:["sunglasses","glasses","goldChain","headphones","mustache","beard","bindi","earrings","cap","blush","mole","scar","pen","towel","flowers"],
 expr:["neutral","happy","smiling","laugh","angry","sad","crying","surprised","shock","scared","confident","confused","shy","serious","evil","cool","panic","smirk","worried","love","sleepy"],
 bg:["#dfe5f5","#f5e6d0","#e3f1e6","#f3dede","#ece3f5","#1f2438","#fff4c9","#d9eef2"]
};
const DEF={name:"New character",gender:"boy",age:"young",face:"oval",skin:"#dfab84",eyes:"big",eyeColor:"#3b2a20",hair:"spiky",hairColor:"#1b1b1f",outfit:"tshirt",outfitColor:"#2f3863",accent:"#c8902a",extras:[],expr:"neutral",bg:"#dfe5f5"};
const sh=(hex,a)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return "#"+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,"0")).join("")};
const EX={ // brows, eyes mode, mouth, effects
 neutral:{b:"flat",e:"open",m:"small",fx:[]},
 happy:{b:"up",e:"open",m:"smile",fx:["blush"]},
 laugh:{b:"up",e:"closed",m:"laugh",fx:["blush"]},
 cool:{b:"flat",e:"half",m:"smirk",fx:[]},
 angry:{b:"angry",e:"open",m:"shout",fx:["vein"]},
 shock:{b:"raised",e:"shock",m:"o",fx:["lines"]},
 panic:{b:"worried",e:"shock",m:"wavy",fx:["sweat","sweat2"]},
 sad:{b:"worried",e:"open",m:"frown",fx:["tear"]},
 smirk:{b:"oneup",e:"half",m:"smirk",fx:[]},
 worried:{b:"worried",e:"open",m:"wavy",fx:["sweat"]},
 love:{b:"up",e:"heart",m:"smile",fx:["blush"]},
 sleepy:{b:"flat",e:"sleep",m:"small",fx:["zzz"]},
 smiling:{b:"flat",e:"open",m:"smile",fx:[]},
 crying:{b:"worried",e:"closed",m:"cry",fx:["tears"]},
 surprised:{b:"raised",e:"open",m:"o",fx:[]},
 scared:{b:"worried",e:"shock",m:"wavy",fx:["sweat","shade"]},
 confident:{b:"oneup",e:"half",m:"grin",fx:["sparkle"]},
 confused:{b:"confused",e:"open",m:"side",fx:["question"]},
 shy:{b:"worried",e:"look",m:"small",fx:["blush"]},
 serious:{b:"serious",e:"open",m:"line",fx:[]},
 evil:{b:"angry",e:"half",m:"evil",fx:["shade"]}
};
function draw(p0,exprOver,opts){
 const p=Object.assign({},DEF,p0||{});p.extras=p.extras||[];const ex=EX[exprOver||p.expr]||EX.neutral;const has=x=>p.extras.includes(x);
 const fem=p.gender==="girl"||p.gender==="woman",old=p.age==="old",adult=p.age==="adult"||old;
 const S=p.skin,Sd=sh(S,-.16),Sdd=sh(S,-.3),H=p.hairColor,Hd=sh(H,-.35),Hl=sh(H,.28),O=p.outfitColor,Od=sh(O,-.28),Ol=sh(O,.18),A=p.accent;
 const W=400,Hh=500,id="a"+Math.random().toString(36).slice(2,7);
 const cy=0; // head offset
 // face shape
 const chin={oval:[300,165,235],round:[296,158,242],sharp:[306,172,228],square:[296,150,250]}[p.face]||[300,165,235];
 const jawW=adult?6:0;
 const face=`M120 170 Q118 95 200 88 Q282 95 280 170 Q${281+jawW} 228 ${chin[2]+jawW} ${chin[0]-28} Q215 ${chin[0]} 200 ${chin[0]} Q185 ${chin[0]} ${chin[1]-jawW} ${chin[0]-28} Q${119-jawW} 228 120 170Z`;
 let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" ${opts&&opts.size?`width="${opts.size}" height="${opts.size*1.25}"`:""}><defs>
<linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(p.bg,.25)}"/><stop offset="1" stop-color="${sh(p.bg,-.08)}"/></linearGradient>
<radialGradient id="${id}ir" cx=".5" cy=".38" r=".62"><stop offset="0" stop-color="${sh(p.eyeColor,.55)}"/><stop offset=".55" stop-color="${p.eyeColor}"/><stop offset="1" stop-color="${sh(p.eyeColor,-.5)}"/></radialGradient>
<linearGradient id="${id}hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Hl}"/><stop offset=".5" stop-color="${H}"/><stop offset="1" stop-color="${Hd}"/></linearGradient>
<clipPath id="${id}fc"><path d="${face}"/></clipPath></defs>
<rect width="${W}" height="${Hh}" fill="url(#${id}bg)"/>`;
 if(!(opts&&opts.plain))o+=`<g opacity=".18" fill="#fff"><circle cx="58" cy="70" r="26"/><circle cx="350" cy="120" r="14"/><circle cx="330" cy="420" r="34"/><circle cx="40" cy="380" r="10"/></g>`;
 // back hair
 const hb={
  spiky:`M110 190 L88 150 L112 140 L92 96 L130 104 L132 58 L168 84 L196 40 L218 82 L258 52 L262 100 L304 92 L288 138 L314 150 L292 196 Z`,
  side:`M112 200 Q96 120 140 84 Q200 46 262 78 Q306 104 290 200 Z`,
  messy:`M108 205 L92 168 L106 156 L96 118 L126 112 L132 72 L170 86 L196 52 L222 84 L262 66 L270 108 L302 112 L294 160 L310 176 L292 205 Z`,
  short:`M114 190 Q104 118 150 90 Q200 66 250 90 Q298 118 286 190 Z`,
  long:`M108 200 Q92 110 150 82 Q200 62 252 82 Q310 110 292 200 Q306 300 318 380 L262 380 Q276 300 280 230 L120 230 Q124 300 138 380 L82 380 Q94 300 108 200Z`,
  ponytail:`M112 196 Q100 112 152 86 Q200 66 250 86 Q302 112 288 196 Z M282 120 Q340 140 330 240 Q326 300 300 330 Q312 260 290 180Z`,
  bun:`M112 196 Q100 112 152 86 Q200 66 250 86 Q302 112 288 196 Z M200 70 m-40 0 a40 34 0 1 0 80 0 a40 34 0 1 0 -80 0`,
  bald:`M116 196 Q114 170 122 150 L130 196 Z M284 196 Q286 170 278 150 L270 196 Z`,
  curly:`M110 200 Q86 170 104 140 Q88 108 122 96 Q122 62 160 66 Q176 40 206 52 Q236 38 252 66 Q290 62 286 98 Q318 108 300 142 Q318 172 290 200 Z`,
  mohawk:`M118 196 Q112 150 128 128 L272 128 Q288 150 282 196 Z M176 130 L170 40 L200 64 L214 30 L230 70 L240 46 L232 130Z`
 }[p.hair]||"";
 const HT="translate(200 200) scale(1.14) translate(-200 -200)";
 const iB0=o.length;
 if(p.hair!=="bald")o+=`<g transform="${HT}"><path d="${hb}" fill="url(#${id}hr)" stroke="${Hd}" stroke-width="3" stroke-linejoin="round"/></g>`;
 const iBody0=o.length;o+=`<g transform="translate(0 6)">`;
 // body
 const sw=fem?0:14;
 o+=`<path d="M${44-sw} 500 Q${52-sw/2} 372 168 340 L232 340 Q${348+sw/2} 372 ${356+sw} 500Z" fill="${O}" stroke="${Od}" stroke-width="3"/>`;
 o+=`<path d="M300 380 Q${336+sw/2} 420 ${350+sw} 500 L310 500Z" fill="${Od}" opacity=".45"/>`;
 // neck
 o+=`<path d="M176 268 L176 344 Q200 362 224 344 L224 268Z" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/><path d="M176 290 Q200 312 224 290 L224 270 L176 270Z" fill="${Sd}" opacity=".75"/>`;
 // outfit details
 const of={
  tshirt:`<path d="M162 342 Q200 382 238 342" fill="none" stroke="${Od}" stroke-width="7"/><path d="M162 342 Q200 376 238 342" fill="none" stroke="${A}" stroke-width="3"/><path d="M168 420 L232 420 L222 470 L178 470Z" fill="${A}" opacity=".85"/><text x="200" y="455" font-family="Arial Black,Arial" font-weight="900" font-size="26" text-anchor="middle" fill="${O}">DJ</text>`,
  shirt:`<path d="M168 338 L200 380 L232 338 L248 352 L214 400 L200 384 L186 400 L152 352Z" fill="${Ol}" stroke="${Od}" stroke-width="2.5"/><line x1="200" y1="384" x2="200" y2="500" stroke="${Od}" stroke-width="3"/><circle cx="208" cy="420" r="4" fill="${A}"/><circle cx="208" cy="452" r="4" fill="${A}"/><circle cx="208" cy="484" r="4" fill="${A}"/><path d="M110 430 L150 430 L150 470 L110 470Z" fill="none" stroke="${Od}" stroke-width="2.5"/>`,
  hoodie:`<path d="M124 362 Q200 300 276 362 Q260 392 200 392 Q140 392 124 362Z" fill="${Od}" stroke="${sh(O,-.45)}" stroke-width="3"/><path d="M184 392 L180 450 M216 392 L220 450" stroke="${A}" stroke-width="4" stroke-linecap="round"/><circle cx="180" cy="454" r="5" fill="${A}"/><circle cx="220" cy="454" r="5" fill="${A}"/><path d="M150 470 Q200 456 250 470 L250 500 L150 500Z" fill="${Od}" opacity=".6"/>`,
  jacket:`<path d="M168 340 L200 400 L232 340Z" fill="${A}"/><path d="M200 500 L200 400 L168 340 L140 350 L176 420 L160 500Z" fill="${Od}"/><path d="M200 500 L200 400 L232 340 L260 350 L224 420 L240 500Z" fill="${Od}"/><path d="M168 340 L150 372 L176 386 L200 400Z M232 340 L250 372 L224 386 L200 400Z" fill="${Ol}" stroke="${sh(O,-.45)}" stroke-width="2.5"/>`,
  kurta:`<path d="M176 340 Q200 352 224 340 L224 352 Q200 364 176 352Z" fill="${A}"/><path d="M200 356 L200 440" stroke="${A}" stroke-width="5"/><circle cx="200" cy="378" r="3.5" fill="${Od}"/><circle cx="200" cy="400" r="3.5" fill="${Od}"/><circle cx="200" cy="422" r="3.5" fill="${Od}"/><path d="M60 470 Q200 452 340 470" fill="none" stroke="${A}" stroke-width="4" stroke-dasharray="10 6"/>`,
  saree:`<path d="M232 340 Q290 360 312 500 L262 500 Q250 420 200 380Z" fill="${A}" opacity=".95"/><path d="M240 352 Q286 380 300 500" fill="none" stroke="${sh(A,-.3)}" stroke-width="4" stroke-dasharray="2 8"/><path d="M168 342 Q200 370 232 342" fill="none" stroke="${Od}" stroke-width="5"/>`,
  vest:`<path d="M168 340 Q200 372 232 340 L232 500 L168 500Z" fill="#f2efe8"/><path d="M168 340 L150 352 L176 500 L196 500 L200 380Z M232 340 L250 352 L224 500 L204 500 L200 380Z" fill="${Od}"/><circle cx="210" cy="420" r="3.5" fill="${A}"/><circle cx="210" cy="450" r="3.5" fill="${A}"/>`,
  uniform:`<path d="M168 338 L200 376 L232 338 L246 350 L214 392 L200 380 L186 392 L154 350Z" fill="#f4f4f4" stroke="#bdbdbd" stroke-width="2"/><path d="M194 380 L206 380 L212 470 L200 486 L188 470Z" fill="${A}"/><path d="M110 430 L150 430 L150 466 L110 466Z" fill="none" stroke="${Od}" stroke-width="2.5"/><circle cx="130" cy="446" r="7" fill="${A}"/>`
 }[p.outfit]||"";
 o+=of;
 if(has("goldChain"))o+=`<path d="M170 346 Q200 404 230 346" fill="none" stroke="#e6b83a" stroke-width="5" stroke-dasharray="7 3"/><circle cx="200" cy="394" r="9" fill="#f2c94c" stroke="#a8801f" stroke-width="2.5"/>`;
 if(has("towel"))o+=`<path d="M150 340 Q130 380 140 500 L176 500 Q166 400 182 346Z" fill="#ffffff" stroke="#c9c9c9" stroke-width="2"/><path d="M146 380 L170 380 M144 420 L168 420" stroke="${A}" stroke-width="4"/>`;
 if(has("pen"))o+=`<rect x="118" y="410" width="6" height="38" rx="2" fill="#2b62c4" transform="rotate(8 121 429)"/>`;
 if(has("flowers"))o+=`<g fill="#fff6d6" stroke="#e0b84a" stroke-width="1.5"><circle cx="284" cy="132" r="7"/><circle cx="296" cy="142" r="7"/><circle cx="288" cy="156" r="7"/></g>`;
 o+=`</g>`;const iBody1=o.length;o+=`<g transform="${HT}">`;
 // ears
 const TU=(opts&&opts.turn)||0;if(TU<=8)o+=`<ellipse cx="279" cy="196" rx="13" ry="20" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/><path d="M282 188 Q276 196 280 206" fill="none" stroke="${Sd}" stroke-width="3"/>`;if(TU>=-8)o+=`<ellipse cx="121" cy="196" rx="13" ry="20" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/><path d="M118 188 Q124 196 120 206" fill="none" stroke="${Sd}" stroke-width="3"/>`;
 if(has("earrings"))o+=`<circle cx="121" cy="220" r="6" fill="#f2c94c" stroke="#a8801f" stroke-width="2"/><circle cx="279" cy="220" r="6" fill="#f2c94c" stroke="#a8801f" stroke-width="2"/>`;
 // face
 o+=`<path d="${face}" fill="${S}" stroke="${Sdd}" stroke-width="3" stroke-linejoin="round"/>`;
 o+=`<g clip-path="url(#${id}fc)"><path d="M110 150 Q200 ${p.hair==="bald"?150:178} 290 150 L290 80 L110 80Z" fill="${Sd}" opacity="${p.hair==="bald"?0:.55}"/><ellipse cx="200" cy="${chin[0]+6}" rx="70" ry="22" fill="${Sd}" opacity=".35"/></g>`;
 if(old)o+=`<path d="M150 150 Q170 144 186 150 M214 150 Q230 144 250 150" fill="none" stroke="${Sd}" stroke-width="2.5"/><path d="M146 248 Q152 262 150 272 M254 248 Q248 262 250 272" fill="none" stroke="${Sd}" stroke-width="2.5"/>`;
 // blush
 if(ex.fx.includes("blush")||has("blush"))o+=`<g fill="#ff7a8a" opacity=".38"><ellipse cx="150" cy="236" rx="20" ry="9"/><ellipse cx="250" cy="236" rx="20" ry="9"/></g><g stroke="#ff6b7d" stroke-width="2" opacity=".6"><path d="M140 232 l6 -6 M150 232 l6 -6 M160 232 l6 -6 M240 232 l6 -6 M250 232 l6 -6 M260 232 l6 -6"/></g>`;
 const TX=(opts&&opts.turn)||0;o+=`<g transform="translate(${TX} 0)">`;
 // eyes
 const eye=(x,flip)=>{const f=flip?-1:1;const st=p.eyes;let g="";const em=ex.e;
  if(em==="closed")return `<path d="M${x-22} 202 Q${x} 180 ${x+22} 202" fill="none" stroke="#1d1416" stroke-width="5" stroke-linecap="round"/>`;
  if(em==="sleep")return `<path d="M${x-22} 198 Q${x} 210 ${x+22} 198" fill="none" stroke="#1d1416" stroke-width="5" stroke-linecap="round"/>`;
  if(em==="heart")return `<path d="M${x} 214 C${x-30} 194 ${x-18} 172 ${x} 186 C${x+18} 172 ${x+30} 194 ${x} 214Z" fill="#e8406b" stroke="#a0213f" stroke-width="2.5"/><circle cx="${x-8}" cy="188" r="3.5" fill="#fff"/>`;
  const ry={big:24,sharp:17,sleepy:19,round:22}[st]||22,rx={big:19,sharp:18,sleepy:18,round:18}[st]||18;
  const shock=em==="shock";
  g+=`<ellipse cx="${x}" cy="200" rx="${rx+3}" ry="${ry+2}" fill="#fff" stroke="#2a1d1f" stroke-width="2"/>`;
  if(shock)g+=`<circle cx="${x}" cy="202" r="7" fill="url(#${id}ir)" stroke="#120b0c" stroke-width="2"/><circle cx="${x-2}" cy="199" r="2" fill="#fff"/>`;
  else if(em==="look")g+=`<ellipse cx="${x-6}" cy="210" rx="${rx-4}" ry="${ry-5}" fill="url(#${id}ir)"/><ellipse cx="${x-6}" cy="212" rx="${(rx-4)*.5}" ry="${(ry-5)*.55}" fill="#120b0c"/><ellipse cx="${x-11}" cy="203" rx="5" ry="6" fill="#fff"/>`;
  else g+=`<ellipse cx="${x+f*1}" cy="${204}" rx="${rx-3}" ry="${ry-3}" fill="url(#${id}ir)"/><ellipse cx="${x+f*1}" cy="206" rx="${(rx-3)*.5}" ry="${(ry-3)*.55}" fill="#120b0c"/><ellipse cx="${x-6*f}" cy="194" rx="6" ry="7.5" fill="#fff"/><circle cx="${x+7*f}" cy="214" r="3" fill="#fff" opacity=".85"/>`;
  // upper lid / lashes
  const lidY=em==="half"||st==="sleepy"?194:180;
  if(em==="half"||st==="sleepy")g+=`<path d="M${x-rx-6} 184 L${x+rx+6} 184 L${x+rx+6} ${lidY+4} Q${x} ${lidY-2} ${x-rx-6} ${lidY+4}Z" fill="${S}"/>`;
  const tilt=st==="sharp"?(flip?-8:8):0;
  g+=`<path d="M${x-rx-7} ${lidY+8+(flip?-tilt:tilt)*.4} Q${x} ${lidY-10} ${x+rx+8} ${lidY+6-(flip?-tilt:tilt)*.4}" fill="none" stroke="#1d1416" stroke-width="${st==="sharp"?7:6}" stroke-linecap="round"/>`;
  g+=`<path d="M${x+(rx+6)*f} ${lidY+4} l${8*f} -6" stroke="#1d1416" stroke-width="4" stroke-linecap="round"/>`;
  g+=`<path d="M${x-rx+2} ${200+ry} Q${x} ${204+ry} ${x+rx-2} ${200+ry}" fill="none" stroke="#3a2a2c" stroke-width="2" opacity=".7"/>`;
  return g};
 o+=eye(165,false)+eye(235,true);
 // brows
 const bw={flat:["M140 160 Q165 152 188 160","M212 160 Q235 152 260 160"],up:["M140 154 Q165 142 188 152","M212 152 Q235 142 260 154"],angry:["M142 150 Q168 158 190 170","M210 170 Q232 158 258 150"],raised:["M140 146 Q165 132 188 144","M212 144 Q235 132 260 146"],worried:["M142 162 Q168 150 188 146","M212 146 Q232 150 258 162"],oneup:["M140 160 Q165 154 188 160","M212 150 Q235 138 260 148"],confused:["M140 150 Q165 140 188 150","M212 164 Q235 160 260 166"],serious:["M140 156 Q165 156 190 164","M210 164 Q235 156 260 156"]}[ex.b]||["M140 160 Q165 152 188 160","M212 160 Q235 152 260 160"];
 const bc=p.hair==="bald"?"#8a8a8a":Hd;
 o+=`<path d="${bw[0]}" fill="none" stroke="${bc}" stroke-width="${old?8:6}" stroke-linecap="round"/><path d="${bw[1]}" fill="none" stroke="${bc}" stroke-width="${old?8:6}" stroke-linecap="round"/>`;
 // nose
 o+=`<path d="M202 222 Q206 236 198 240" fill="none" stroke="${Sdd}" stroke-width="2.5" stroke-linecap="round"/>`;
 // mouth
 const mo={small:`<path d="M188 262 Q200 266 212 262" fill="none" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`,
  smile:`<path d="M180 258 Q200 276 220 258" fill="none" stroke="#5a2a2a" stroke-width="4" stroke-linecap="round"/>`,
  laugh:`<path d="M176 254 Q200 254 224 254 Q220 288 200 290 Q180 288 176 254Z" fill="#7a2230" stroke="#4a1418" stroke-width="3"/><path d="M178 256 L222 256 L218 264 L182 264Z" fill="#fff"/><ellipse cx="200" cy="280" rx="12" ry="6" fill="#ff7a8a"/>`,
  smirk:`<path d="M184 264 Q204 266 220 254" fill="none" stroke="#5a2a2a" stroke-width="4" stroke-linecap="round"/>`,
  shout:`<path d="M178 252 L222 252 L214 284 L186 284Z" fill="#7a2230" stroke="#4a1418" stroke-width="3" stroke-linejoin="round"/><path d="M180 254 L220 254 L218 260 L182 260Z" fill="#fff"/>`,
  o:`<ellipse cx="200" cy="266" rx="11" ry="15" fill="#7a2230" stroke="#4a1418" stroke-width="3"/>`,
  wavy:`<path d="M180 264 Q186 256 192 264 Q198 272 204 264 Q210 256 216 264 Q220 270 224 264" fill="none" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`,
  frown:`<path d="M184 270 Q200 256 216 270" fill="none" stroke="#5a2a2a" stroke-width="4" stroke-linecap="round"/>`,
  cry:`<path d="M180 270 Q190 254 200 262 Q210 254 220 270 Q210 282 200 278 Q190 282 180 270Z" fill="#7a2230" stroke="#4a1418" stroke-width="3"/>`,
  grin:`<path d="M178 256 Q200 274 224 252 Q214 270 200 272 Q186 272 178 256Z" fill="#fff" stroke="#4a1418" stroke-width="3"/><path d="M186 262 L188 268 M196 264 L196 271 M206 264 L206 270 M215 260 L214 266" stroke="#c9b9b9" stroke-width="1.5"/>`,
  line:`<path d="M186 264 L214 264" stroke="#5a2a2a" stroke-width="4" stroke-linecap="round"/>`,
  side:`<path d="M188 266 Q200 262 214 258" fill="none" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`,
  evil:`<path d="M172 252 Q200 268 230 248 Q222 276 200 278 Q180 278 172 252Z" fill="#fff" stroke="#4a1418" stroke-width="3"/><path d="M180 258 L184 266 L188 258 M212 258 L216 266 L220 256" fill="none" stroke="#4a1418" stroke-width="2"/>`}[ex.m];
 o+=mo||"";
 if(has("mustache"))o+=`<path d="M200 246 Q182 238 168 252 Q182 252 200 250 Q218 252 232 252 Q218 238 200 246Z" fill="${p.hair==="bald"?"#7d7d7d":Hd}"/>`;
 if(has("beard"))o+=`<path d="M128 214 Q136 270 170 292 Q200 ${chin[0]+18} 230 292 Q264 270 272 214 Q266 262 236 276 Q220 284 200 284 Q180 284 164 276 Q134 262 128 214Z" fill="${p.hair==="bald"?"#7d7d7d":Hd}" opacity=".95"/>`;
 if(has("mole"))o+=`<circle cx="232" cy="250" r="3.5" fill="#3a2418"/>`;
 if(has("scar"))o+=`<path d="M246 150 L262 182 M248 166 L260 160 M252 176 L262 170" stroke="#a8523d" stroke-width="3" stroke-linecap="round"/>`;
 if(has("bindi"))o+=`<circle cx="200" cy="150" r="5" fill="#d8202f"/>`;
 o+=`</g>`;
 // front hair
 const hf={
  spiky:`M116 178 L124 120 L140 150 L148 98 L170 140 L182 92 L198 136 L214 90 L226 138 L246 96 L254 146 L268 112 L284 178 Q292 120 260 92 Q200 62 140 92 Q108 120 116 178Z`,
  side:`M116 190 Q110 110 170 92 Q236 78 278 120 Q290 150 284 190 Q272 150 248 140 Q214 168 150 160 Q178 150 190 128 Q150 150 116 190Z`,
  messy:`M116 186 L128 132 L142 156 L152 118 L170 150 L186 112 L200 148 L218 110 L230 150 L250 118 L258 156 L274 132 L284 186 Q296 112 250 88 Q200 66 150 88 Q104 112 116 186Z`,
  short:`M118 170 Q114 104 200 92 Q286 104 282 170 Q262 136 230 132 Q214 146 200 140 Q186 146 170 132 Q138 136 118 170Z`,
  long:`M116 200 Q108 108 200 90 Q292 108 284 200 Q270 140 240 130 L224 160 L210 128 Q200 124 190 128 L176 160 L160 130 Q130 140 116 200Z`,
  ponytail:`M116 186 Q108 108 200 92 Q292 108 284 186 Q268 136 220 132 Q190 150 150 146 Q128 160 116 186Z`,
  bun:`M118 184 Q110 106 200 94 Q290 106 282 184 Q262 138 226 134 Q200 150 174 134 Q138 138 118 184Z`,
  bald:`M126 160 Q132 120 160 112 M274 160 Q268 120 240 112`,
  curly:`M112 186 Q100 150 122 134 Q118 104 148 104 Q156 80 184 90 Q200 74 218 90 Q246 80 254 104 Q284 104 280 134 Q300 150 288 186 Q272 156 250 152 Q246 168 226 160 Q214 176 200 164 Q186 176 174 160 Q154 168 150 152 Q128 156 112 186Z`,
  mohawk:`M150 132 Q200 118 250 132 L246 150 Q200 140 154 150Z`
 }[p.hair]||"";
 if(p.hair==="bald")o+=`<path d="${hf}" fill="none" stroke="#9a9a9a" stroke-width="10" stroke-linecap="round"/><ellipse cx="176" cy="112" rx="22" ry="8" fill="#fff" opacity=".45" transform="rotate(-18 176 112)"/>`;
 else o+=`<path d="${hf}" fill="url(#${id}hr)" stroke="${Hd}" stroke-width="3" stroke-linejoin="round"/><path d="M150 112 Q176 100 204 106" fill="none" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/>`;
 // accessories on head
 if(has("headphones"))o+=`<path d="M108 196 Q104 70 200 64 Q296 70 292 196" fill="none" stroke="#1d1d24" stroke-width="12" stroke-linecap="round"/><rect x="94" y="172" width="30" height="52" rx="12" fill="${A}" stroke="#1d1d24" stroke-width="4"/><rect x="276" y="172" width="30" height="52" rx="12" fill="${A}" stroke="#1d1d24" stroke-width="4"/>`;
 if(has("cap"))o+=`<path d="M112 150 Q114 74 200 70 Q286 74 288 150 Q200 128 112 150Z" fill="${A}" stroke="${sh(A,-.4)}" stroke-width="3"/><path d="M112 150 Q200 128 288 150 Q300 158 312 154 Q296 168 200 152 Q120 160 112 150Z" fill="${sh(A,-.25)}"/><circle cx="200" cy="74" r="6" fill="${sh(A,-.3)}"/>`;
 if(has("sunglasses"))o+=`<path d="M132 184 L190 184 Q192 216 168 222 Q140 224 134 206Z M210 184 L268 184 L266 206 Q260 224 232 222 Q208 216 210 184Z" fill="#14141c" stroke="#05050a" stroke-width="3"/><path d="M190 190 Q200 184 210 190" fill="none" stroke="#05050a" stroke-width="4"/><path d="M132 186 L118 184 M268 186 L282 184" stroke="#05050a" stroke-width="4"/><path d="M144 192 L160 192 M222 192 L238 192" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>`;
 if(has("glasses"))o+=`<rect x="138" y="180" width="54" height="42" rx="12" fill="#ffffff" fill-opacity=".12" stroke="#2a2a2a" stroke-width="4"/><rect x="208" y="180" width="54" height="42" rx="12" fill="#ffffff" fill-opacity=".12" stroke="#2a2a2a" stroke-width="4"/><path d="M192 196 Q200 190 208 196" fill="none" stroke="#2a2a2a" stroke-width="4"/>`;
 // effects
 if(ex.fx.includes("sweat"))o+=`<path d="M292 140 Q304 162 300 172 Q292 182 284 172 Q280 162 292 140Z" fill="#8fd3ff" stroke="#3a8fc4" stroke-width="2.5"/>`;
 if(ex.fx.includes("sweat2"))o+=`<path d="M110 150 Q120 168 116 176 Q110 184 104 176 Q100 168 110 150Z" fill="#8fd3ff" stroke="#3a8fc4" stroke-width="2.5"/>`;
 if(ex.fx.includes("vein"))o+=`<g stroke="#d8202f" stroke-width="5" stroke-linecap="round" fill="none"><path d="M258 110 q6 8 0 16 M270 110 q-6 8 0 16 M252 120 q8 -6 16 0 M252 132 q8 6 16 0"/></g>`;
 if(ex.fx.includes("lines"))o+=`<g stroke="#1d1d24" stroke-width="4" stroke-linecap="round"><path d="M80 120 L100 132 M74 160 L98 164 M320 120 L300 132 M326 160 L302 164 M200 30 L200 52"/></g>`;
 if(ex.fx.includes("tear"))o+=`<path d="M244 220 Q250 240 246 250 Q240 258 236 250 Q234 240 244 220Z" fill="#8fd3ff" stroke="#3a8fc4" stroke-width="2"/>`;
 if(ex.fx.includes("tears"))o+=`<path d="M150 206 Q146 250 156 300 L168 300 Q160 250 162 206Z M250 206 Q254 250 244 300 L232 300 Q240 250 238 206Z" fill="#8fd3ff" opacity=".85" stroke="#3a8fc4" stroke-width="2"/>`;
 if(ex.fx.includes("shade"))o+=`<g stroke="#4a3a7a" stroke-width="3" opacity=".55"><path d="M150 108 L150 146 M164 104 L164 142 M178 102 L178 138 M222 102 L222 138 M236 104 L236 142 M250 108 L250 146"/></g>`;
 if(ex.fx.includes("sparkle"))o+=`<path d="M300 110 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6Z" fill="#f2c94c" stroke="#c8902a" stroke-width="2"/>`;
 if(ex.fx.includes("question"))o+=`<text x="296" y="128" font-family="Arial Black,Arial" font-size="56" font-weight="900" fill="#3b82c4" stroke="#fff" stroke-width="3" paint-order="stroke">?</text>`;
 if(ex.fx.includes("zzz"))o+=`<text x="300" y="110" font-family="Arial Black,Arial" font-size="30" fill="#2f3863" font-weight="900">Z<tspan font-size="22" dy="-14">z</tspan><tspan font-size="16" dy="-10">z</tspan></text>`;
 o+=`</g>`;
 if(opts&&opts.headOnly){const defs=(o.match(/<defs>[\s\S]*?<\/defs>/)||[""])[0];return defs+o.slice(iB0,iBody0)+o.slice(iBody1)}
 if(opts&&opts.label)o+=`<rect x="0" y="456" width="400" height="44" fill="rgba(20,22,40,.72)"/><text x="200" y="486" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#fff">${String(opts.label).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</text>`;
 return o+`</svg>`}
window.ANIME={OPT,DEF,draw,EXPR:Object.keys(EX),EXDEF:k=>EX[k]||EX.neutral};
})();
