/* ===== Flat cartoon style (explainer-video look): heads, bust, dining room ===== */
(function(){
const A=window.ANIME,OL="#3b2b22";
const sh=(hex,a)=>{const n=parseInt(String(hex||"#888888").slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return "#"+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,"0")).join("")};
let N=0;const uid=()=>"fl"+(++N)+Math.random().toString(36).slice(2,5);
const HT="translate(200 200) scale(1.14) translate(-200 -200)";
/* hair caps (front view), two-tone handled by clip */
function hairFront(p){const H=p.hairColor;switch(p.hair){
 case "bald":return {back:"",front:`<path d="M116 210 Q112 172 128 150 L136 214Z M284 210 Q288 172 272 150 L264 214Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "bun":return {back:`<circle cx="200" cy="66" r="38" fill="${H}" stroke="${OL}" stroke-width="6"/>`,front:`<path d="M112 196 Q104 86 200 80 Q296 86 288 196 Q276 132 200 124 Q124 132 112 196Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "long":return {back:`<path d="M108 170 Q96 300 116 380 L284 380 Q304 300 292 170Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`,front:`<path d="M110 200 Q102 84 200 78 Q298 84 290 200 Q272 128 210 120 L200 140 L190 120 Q128 128 110 200Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "ponytail":return {back:`<path d="M268 110 Q330 130 318 240 Q300 200 286 180Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`,front:`<path d="M112 192 Q104 86 200 80 Q296 86 288 192 Q270 130 200 126 Q130 130 112 192Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "spiky":return {back:"",front:`<path d="M112 184 L104 130 L124 136 L120 96 L148 104 L156 70 L180 92 L200 62 L220 92 L244 70 L252 104 L280 96 L276 136 L296 130 L288 184 Q272 128 200 122 Q128 128 112 184Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "curly":return {back:"",front:`<path d="M110 190 Q92 160 112 140 Q102 108 136 100 Q144 72 176 78 Q200 58 226 78 Q258 72 264 100 Q298 108 288 140 Q308 160 290 190 Q272 132 200 126 Q128 132 110 190Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "mohawk":return {back:"",front:`<path d="M176 128 L170 50 L200 40 L230 50 L224 128Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/><path d="M118 186 Q114 150 130 134 M282 186 Q286 150 270 134" stroke="${H}" stroke-width="10" fill="none"/>`};
 case "side":return {back:"",front:`<path d="M112 196 Q100 84 196 78 Q292 82 290 170 Q262 118 186 128 Q150 140 112 196Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 case "messy":return {back:"",front:`<path d="M112 190 L106 140 L126 146 L128 104 L156 116 L170 80 L196 102 L220 78 L236 106 L266 92 L270 132 L292 136 L288 190 Q270 128 200 124 Q130 128 112 190Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};
 default:return {back:"",front:`<path d="M114 186 Q106 84 200 78 Q294 84 286 186 Q270 126 200 120 Q130 126 114 186Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`};}}
function eyes(p,ex,dx){const em=ex.e,st=p.eyes,x1=165+dx,x2=235+dx,y=200;let g="";
 const lid=(x)=>`<path d="M${x-19} ${y-2} Q${x} ${y-20} ${x+19} ${y-2}Z" fill="${p.skin}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`;
 [x1,x2].forEach((x,i)=>{
  if(em==="closed"||em==="sleep"){g+=`<path d="M${x-16} ${y+(em==="closed"?4:0)} Q${x} ${y+(em==="closed"?-12:12)} ${x+16} ${y+(em==="closed"?4:0)}" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>`;return}
  if(em==="heart"){g+=`<path d="M${x} ${y+14} C${x-24} ${y-2} ${x-14} ${y-20} ${x} ${y-8} C${x+14} ${y-20} ${x+24} ${y-2} ${x} ${y+14}Z" fill="#e8406b" stroke="${OL}" stroke-width="4"/>`;return}
  if(st==="round"&&em!=="shock"){g+=`<circle cx="${x+(em==="look"?-5:0)}" cy="${y+4}" r="9" fill="${OL}"/>`;return}
  const r=em==="shock"?21:17,pr=em==="shock"?5:8,px=em==="look"?-7:(em==="shock"?0:(i?-2:2)),py=em==="look"?6:2;
  g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${OL}" stroke-width="5"/><circle cx="${x+px}" cy="${y+py}" r="${pr}" fill="${OL}"/>`;
  if(st==="sharp"||st==="sleepy"||em==="half")g+=lid(x)});
 return g}
function brows(ex,dx,col){const b={flat:[[146,166,184,164],[216,164,254,166]],up:[[146,160,184,154],[216,154,254,160]],angry:[[146,156,188,172],[212,172,254,156]],raised:[[146,150,184,142],[216,142,254,150]],worried:[[146,168,186,154],[214,154,254,168]],oneup:[[146,166,184,164],[216,152,254,146]],confused:[[146,154,184,148],[216,170,254,166]],serious:[[146,162,188,168],[212,168,254,162]]}[ex.b]||[[146,166,184,164],[216,164,254,166]];
 return b.map(c=>`<path d="M${c[0]+dx} ${c[1]} L${c[2]+dx} ${c[3]}" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`).join("")}
function mouth(ex,dx){const x=200+dx;const m={small:`<path d="M${x-12} 262 Q${x} 266 ${x+12} 262" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 smile:`<path d="M${x-18} 256 Q${x} 274 ${x+18} 256" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 laugh:`<path d="M${x-22} 252 L${x+22} 252 Q${x+18} 282 ${x} 284 Q${x-18} 282 ${x-22} 252Z" fill="#7a2a2a" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/><path d="M${x-18} 254 L${x+18} 254 L${x+16} 260 L${x-16} 260Z" fill="#fff"/>`,
 smirk:`<path d="M${x-14} 264 Q${x+6} 266 ${x+18} 254" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 shout:`<path d="M${x-20} 250 L${x+20} 250 L${x+14} 280 L${x-14} 280Z" fill="#7a2a2a" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`,
 o:`<ellipse cx="${x}" cy="266" rx="10" ry="13" fill="#7a2a2a" stroke="${OL}" stroke-width="5"/>`,
 wavy:`<path d="M${x-20} 264 Q${x-14} 256 ${x-7} 264 Q${x} 272 ${x+7} 264 Q${x+14} 256 ${x+20} 264" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 frown:`<path d="M${x-16} 270 Q${x} 254 ${x+16} 270" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 cry:`<path d="M${x-18} 272 Q${x} 250 ${x+18} 272Z" fill="#7a2a2a" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`,
 grin:`<path d="M${x-22} 254 Q${x} 278 ${x+22} 254Z" fill="#fff" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`,
 line:`<path d="M${x-14} 264 L${x+14} 264" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 side:`<path d="M${x-12} 266 L${x+14} 258" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
 evil:`<path d="M${x-26} 250 Q${x} 272 ${x+26} 248 Q${x+16} 278 ${x} 278 Q${x-16} 278 ${x-26} 250Z" fill="#fff" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`}[ex.m];return m||""}
function fx(ex){let o="";const f=ex.fx||[];
 if(f.includes("blush"))o+=`<ellipse cx="150" cy="238" rx="16" ry="8" fill="#e0706a" opacity=".45"/><ellipse cx="250" cy="238" rx="16" ry="8" fill="#e0706a" opacity=".45"/>`;
 if(f.includes("sweat"))o+=`<path d="M292 140 Q304 162 300 172 Q292 182 284 172 Q280 162 292 140Z" fill="#8fd3ff" stroke="${OL}" stroke-width="4"/>`;
 if(f.includes("sweat2"))o+=`<path d="M108 150 Q118 168 114 176 Q108 184 102 176 Q98 168 108 150Z" fill="#8fd3ff" stroke="${OL}" stroke-width="4"/>`;
 if(f.includes("vein"))o+=`<g stroke="#c0392b" stroke-width="6" stroke-linecap="round" fill="none"><path d="M256 112 q6 8 0 16 M268 112 q-6 8 0 16 M250 122 q8 -6 16 0 M250 134 q8 6 16 0"/></g>`;
 if(f.includes("tear")||f.includes("tears"))o+=`<path d="M236 220 Q242 250 236 268" stroke="#6ec3f2" stroke-width="8" stroke-linecap="round" fill="none"/>${f.includes("tears")?`<path d="M164 220 Q158 250 164 268" stroke="#6ec3f2" stroke-width="8" stroke-linecap="round" fill="none"/>`:""}`;
 if(f.includes("lines"))o+=`<g stroke="${OL}" stroke-width="5" stroke-linecap="round"><path d="M80 120 L100 132 M74 160 L98 164 M320 120 L300 132 M326 160 L302 164"/></g>`;
 if(f.includes("shade"))o+=`<g stroke="#4a3a7a" stroke-width="4" opacity=".5"><path d="M150 120 L150 150 M170 116 L170 146 M230 116 L230 146 M250 120 L250 150"/></g>`;
 if(f.includes("question"))o+=`<text x="296" y="128" font-family="Arial Black,Arial" font-size="56" font-weight="900" fill="#3b82c4" stroke="${OL}" stroke-width="3" paint-order="stroke">?</text>`;
 if(f.includes("sparkle"))o+=`<path d="M300 110 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6Z" fill="#f2c94c" stroke="${OL}" stroke-width="3"/>`;
 if(f.includes("zzz"))o+=`<text x="300" y="110" font-family="Arial Black,Arial" font-size="30" fill="#2f3863" font-weight="900">Z<tspan font-size="22" dy="-14">z</tspan><tspan font-size="16" dy="-10">z</tspan></text>`;
 return o}
function headFront(p,ex,turn){const S=p.skin,Sd=sh(S,-.13),id=uid(),has=x=>(p.extras||[]).includes(x),dx=turn?Math.round(turn*.7):0;const hr=hairFront(p);const kid=p.age==="teen";
 const face=kid?`M200 92 C266 92 296 140 296 196 C296 262 254 300 200 300 C146 300 104 262 104 196 C104 140 134 92 200 92Z`:`M200 86 C262 86 286 130 286 186 C286 256 248 300 200 300 C152 300 114 256 114 186 C114 130 138 86 200 86Z`;
 let o=`<defs><clipPath id="${id}"><path d="${face}"/></clipPath></defs>`+hr.back;
 const eL=turn<=8,eR=turn>=-8;
 if(eL)o+=`<path d="M118 186 A18 22 0 0 0 118 226" fill="${S}" stroke="${OL}" stroke-width="5" transform="translate(-6 0)"/>`;
 if(eR)o+=`<path d="M282 186 A18 22 0 0 1 282 226" fill="${Sd}" stroke="${OL}" stroke-width="5" transform="translate(6 0)"/>`;
 o+=`<path d="${face}" fill="${S}"/><g clip-path="url(#${id})"><rect x="${206+dx}" y="60" width="140" height="260" fill="${Sd}"/>${has("beard")?`<path d="M110 220 Q140 300 200 304 Q260 300 290 220 Q260 270 200 272 Q140 270 110 220Z" fill="${sh(p.hairColor,.25)}" opacity=".55"/>`:""}</g><path d="${face}" fill="none" stroke="${OL}" stroke-width="6"/>`;
 if(p.age==="old")o+=`<path d="M${150+dx} 140 Q${170+dx} 134 ${186+dx} 140 M${214+dx} 140 Q${230+dx} 134 ${250+dx} 140" stroke="${Sd}" stroke-width="4" fill="none"/>`;
 o+=eyes(p,ex,dx)+brows(ex,dx,p.hair==="bald"?"#7d7d7d":sh(p.hairColor,-.2));
 o+=`<path d="M${202+dx} 224 Q${208+dx} 236 ${198+dx} 240" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`;
 o+=mouth(ex,dx);
 if(has("mustache"))o+=`<path d="M${200+dx} 242 Q${178+dx} 234 ${166+dx} 254 Q${178+dx} 250 ${200+dx} 250 Q${222+dx} 250 ${234+dx} 254 Q${222+dx} 234 ${200+dx} 242Z" fill="${p.hair==="bald"?"#6d6d6d":sh(p.hairColor,-.1)}" stroke="${OL}" stroke-width="3"/>`;
 if(has("mole"))o+=`<circle cx="${232+dx}" cy="250" r="4" fill="${OL}"/>`;
 if(has("bindi"))o+=`<circle cx="${200+dx}" cy="152" r="6" fill="#c0392b"/>`;
 if(has("scar"))o+=`<path d="M${246+dx} 150 L${260+dx} 178" stroke="#a8523d" stroke-width="5" stroke-linecap="round"/>`;
 if(has("earrings"))o+=`<circle cx="112" cy="232" r="6" fill="#f2c94c" stroke="${OL}" stroke-width="3"/><circle cx="288" cy="232" r="6" fill="#f2c94c" stroke="${OL}" stroke-width="3"/>`;
 o+=hr.front;
 if(has("glasses"))o+=`<circle cx="${165+dx}" cy="200" r="24" fill="#fff" fill-opacity=".1" stroke="${OL}" stroke-width="5"/><circle cx="${235+dx}" cy="200" r="24" fill="#fff" fill-opacity=".1" stroke="${OL}" stroke-width="5"/><path d="M${189+dx} 198 L${211+dx} 198" stroke="${OL}" stroke-width="5"/>`;
 if(has("sunglasses"))o+=`<rect x="${138+dx}" y="184" width="54" height="34" rx="10" fill="#1d1d24" stroke="${OL}" stroke-width="4"/><rect x="${208+dx}" y="184" width="54" height="34" rx="10" fill="#1d1d24" stroke="${OL}" stroke-width="4"/><path d="M${192+dx} 196 L${208+dx} 196" stroke="${OL}" stroke-width="5"/>`;
 if(has("cap"))o+=`<path d="M112 160 Q112 80 200 78 Q288 80 288 160Z" fill="${p.accent}" stroke="${OL}" stroke-width="6"/><path d="M200 160 L${300+dx} 160 Q${304+dx} 172 ${290+dx} 174 L200 174Z" fill="${sh(p.accent,-.25)}" stroke="${OL}" stroke-width="5"/>`;
 if(has("headphones"))o+=`<path d="M108 196 Q104 70 200 64 Q296 70 292 196" fill="none" stroke="${OL}" stroke-width="12"/><rect x="92" y="176" width="28" height="48" rx="10" fill="${p.accent}" stroke="${OL}" stroke-width="5"/><rect x="280" y="176" width="28" height="48" rx="10" fill="${p.accent}" stroke="${OL}" stroke-width="5"/>`;
 if(has("flowers"))o+=`<g fill="#fff6d6" stroke="${OL}" stroke-width="2"><circle cx="262" cy="70" r="8"/><circle cx="274" cy="82" r="8"/><circle cx="262" cy="92" r="8"/></g>`;
 o+=fx(ex);
 return `<g transform="${HT}">${o}</g>`}
function headSide(p,ex){const S=p.skin,Sd=sh(S,-.13),id=uid(),H=p.hairColor,has=x=>(p.extras||[]).includes(x);const em=ex.e;
 const face=`M196 88 C258 88 284 128 286 176 L300 214 L286 220 C286 268 252 300 210 300 C160 300 120 262 120 196 C120 132 148 88 196 88Z`;
 let o=`<defs><clipPath id="${id}"><path d="${face}"/></clipPath></defs>`;
 if(p.hair==="long")o+=`<path d="M130 150 Q100 280 124 380 L220 380 Q196 280 200 200Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`;
 if(p.hair==="ponytail")o+=`<path d="M128 150 Q86 190 104 280 Q120 230 150 200Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`;
 if(p.hair==="bun")o+=`<circle cx="130" cy="104" r="36" fill="${H}" stroke="${OL}" stroke-width="6"/>`;
 o+=`<path d="${face}" fill="${S}"/><g clip-path="url(#${id})"><rect x="100" y="60" width="90" height="260" fill="${Sd}"/></g><path d="${face}" fill="none" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`;
 o+=`<path d="M176 190 A18 22 0 1 0 176 232" fill="${Sd}" stroke="${OL}" stroke-width="5"/>`;
 if(em==="closed"||em==="sleep")o+=`<path d="M252 200 Q262 ${em==="closed"?190:210} 272 200" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>`;
 else if(p.eyes==="round")o+=`<circle cx="264" cy="202" r="8" fill="${OL}"/>`;
 else o+=`<circle cx="260" cy="200" r="15" fill="#fff" stroke="${OL}" stroke-width="5"/><circle cx="266" cy="202" r="${em==="shock"?4:7}" fill="${OL}"/>`;
 const by={angry:170,raised:150,worried:162,up:156,serious:166}[ex.b]||164;
 o+=`<path d="M244 ${by} L276 ${by+(ex.b==="angry"?8:0)}" stroke="${p.hair==="bald"?"#7d7d7d":sh(H,-.2)}" stroke-width="10" stroke-linecap="round"/>`;
 o+=({smile:`<path d="M262 256 Q274 266 284 254" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,laugh:`<path d="M258 250 L286 250 Q282 274 268 274Z" fill="#7a2a2a" stroke="${OL}" stroke-width="5"/>`,shout:`<path d="M258 248 L286 248 L282 274 L264 274Z" fill="#7a2a2a" stroke="${OL}" stroke-width="5"/>`,o:`<ellipse cx="276" cy="262" rx="7" ry="10" fill="#7a2a2a" stroke="${OL}" stroke-width="4"/>`,frown:`<path d="M264 266 Q274 254 284 264" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`}[ex.m])||`<path d="M266 262 L284 260" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
 if(has("mustache"))o+=`<path d="M258 238 Q276 230 292 240 Q278 248 258 246Z" fill="${p.hair==="bald"?"#6d6d6d":H}" stroke="${OL}" stroke-width="3"/>`;
 if(has("bindi"))o+=`<circle cx="282" cy="160" r="5" fill="#c0392b"/>`;
 const cap={bald:`<path d="M126 210 Q122 176 134 156" stroke="#8a8a8a" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  spiky:`<path d="M124 210 L110 172 L126 168 L112 128 L144 128 L140 92 L174 104 L184 70 L206 92 L232 72 L240 106 L272 102 L268 134 Q240 116 200 124 Q160 140 160 210Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`,
  curly:`<path d="M120 214 Q100 186 116 160 Q104 128 136 116 Q142 86 176 88 Q200 66 230 84 Q266 80 272 112 Q250 116 220 122 Q176 140 164 214Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`}[p.hair]||`<path d="M122 212 Q110 100 196 86 Q262 82 280 140 Q252 116 214 120 Q170 128 162 212Z" fill="${H}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`;
 o+=cap;
 if(has("glasses")||has("sunglasses"))o+=`<rect x="242" y="184" width="40" height="32" rx="10" fill="${has("sunglasses")?"#1d1d24":"#fff"}" fill-opacity="${has("sunglasses")?1:.1}" stroke="${OL}" stroke-width="5"/><path d="M242 196 L182 200" stroke="${OL}" stroke-width="5"/>`;
 if(has("cap"))o+=`<path d="M124 158 Q126 84 204 82 Q276 88 282 150Z" fill="${p.accent}" stroke="${OL}" stroke-width="6"/><path d="M270 146 Q314 148 330 160 Q300 166 268 160Z" fill="${sh(p.accent,-.25)}" stroke="${OL}" stroke-width="5"/>`;
 o+=fx(Object.assign({},ex,{fx:(ex.fx||[]).filter(x=>["sweat","question","sparkle","zzz","vein"].includes(x))}));
 return `<g transform="${HT}">${o}</g>`}
function headBack(p){const S=p.skin,H=p.hairColor;const face=`M200 86 C262 86 286 130 286 186 C286 256 248 300 200 300 C152 300 114 256 114 186 C114 130 138 86 200 86Z`;
 let o=`<path d="M112 186 A18 22 0 0 0 112 226" fill="${S}" stroke="${OL}" stroke-width="5"/><path d="M288 186 A18 22 0 0 1 288 226" fill="${S}" stroke="${OL}" stroke-width="5"/><path d="${face}" fill="${S}" stroke="${OL}" stroke-width="6"/>`;
 if(p.hair==="bald")o+=`<path d="M120 210 Q130 260 200 270 Q270 260 280 210 Q250 236 200 238 Q150 236 120 210Z" fill="#8a8a8a" stroke="${OL}" stroke-width="5"/>`;
 else if(p.hair==="long")o+=`<path d="M112 200 Q100 84 200 80 Q300 84 288 200 Q300 300 296 380 L104 380 Q100 300 112 200Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`;
 else o+=`<path d="M114 240 Q100 90 200 82 Q300 90 286 240 Q200 264 114 240Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`+(p.hair==="bun"?`<circle cx="200" cy="120" r="38" fill="${H}" stroke="${OL}" stroke-width="6"/>`:p.hair==="ponytail"?`<path d="M186 230 Q172 300 200 350 Q228 300 214 230Z" fill="${H}" stroke="${OL}" stroke-width="6"/>`:"");
 return `<g transform="${HT}">${o}</g>`}
/* bust for expressions / gallery */
function bust(p0,exK,opts){opts=opts||{};const p=Object.assign({},A.DEF,p0||{});const ex=A.EXDEF(exK||p.expr);const O=p.outfitColor,Od=sh(O,-.15);
 let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${p.bg||"#d9b48f"}"/>`;
 if(!opts.plain)o+=`<rect y="380" width="400" height="120" fill="${sh(p.bg||"#d9b48f",-.08)}"/>`;
 const cid=uid();o+=`<defs><clipPath id="${cid}"><path d="M70 500 L84 390 Q90 350 150 342 L250 342 Q310 350 316 390 L330 500Z"/></clipPath></defs><path d="M70 500 L84 390 Q90 350 150 342 L250 342 Q310 350 316 390 L330 500Z" fill="${O}"/><g clip-path="url(#${cid})"><rect x="206" y="330" width="140" height="180" fill="${Od}"/></g><path d="M70 500 L84 390 Q90 350 150 342 L250 342 Q310 350 316 390 L330 500" fill="none" stroke="${OL}" stroke-width="5"/>`;
 o+=`<path d="M176 280 L176 350 Q200 362 224 350 L224 280Z" fill="${sh(p.skin,-.13)}" stroke="${OL}" stroke-width="5"/>`;
 o+=headFront(p,ex,0);
 if(opts.label)o+=`<rect x="0" y="456" width="400" height="44" fill="rgba(20,22,40,.72)"/><text x="200" y="486" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#fff">${String(opts.label).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</text>`;
 return o+`</svg>`}
const orig=A.draw;A.draw=function(p,e,o){if(p&&p.style==="flat"&&!(o&&o.headOnly))return bust(p,e,o);if(p&&p.style==="flat"&&o&&o.headOnly)return headFront(Object.assign({},A.DEF,p),A.EXDEF(e||p.expr),o.turn||0);return orig(p,e,o)};
A.FLAT={headFront,headSide,headBack,OL,sh};
/* dining room (like the reference) — background + table in front */
A.DINING_FG=(W,H,n)=>{const ty=H*.6;let o=`<rect x="${W*.08}" y="${ty}" width="${W*.92}" height="${H-ty}" fill="#8a5a36"/><rect x="${W*.06}" y="${ty-18}" width="${W*.96}" height="34" rx="12" fill="#a8703f" stroke="${OL}" stroke-width="4"/>`;
 const k=Math.max(1,n||3);for(let i=0;i<k;i++){const x=W/(k+1)*(i+1);o+=`<ellipse cx="${x}" cy="${ty-12}" rx="${Math.min(110,W/(k+1)*.38)}" ry="22" fill="#fbfbf7" stroke="${OL}" stroke-width="3"/>`}
 return o};
A.BGS.dining="Dining room (flat style, with table)";A.BGS.flatroom="Warm room (flat style)";
const ob=A.bgArt;A.bgArt=function(k,W,H,base){if(k==="dining"||k==="flatroom"){const wy=H*.5;return `<rect width="${W}" height="${H}" fill="#b5835a"/><rect y="${wy}" width="${W}" height="${H-wy}" fill="#a8774f"/><path d="M0 ${wy} H${W}" stroke="#8f6340" stroke-width="5"/><rect x="${W*.1}" y="0" width="${W*.13}" height="${H*.09}" fill="#c8a06a" stroke="#6e4a2c" stroke-width="8"/><rect x="${W*.42}" y="0" width="${W*.3}" height="${H*.3}" fill="#22306e" stroke="#f4ead8" stroke-width="10"/><path d="M${W*.57} 0 V${H*.3}" stroke="#f4ead8" stroke-width="8"/>${[...Array(12)].map((_,i)=>{const x=W*.43+i*W*.024,h=H*(.08+((i*37)%5)*.03);return `<rect x="${x}" y="${H*.3-h}" width="${W*.022}" height="${h}" fill="#162257"/><rect x="${x+4}" y="${H*.3-h+8}" width="4" height="5" fill="#f2e7b0"/><rect x="${x+12}" y="${H*.3-h+20}" width="4" height="5" fill="#f2e7b0"/>`}).join("")}<rect x="${W*.41}" y="${H*.3}" width="${W*.32}" height="${H*.02}" fill="#f4ead8"/>`}return ob(k,W,H,base)};
})();
