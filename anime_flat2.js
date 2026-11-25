/* ===== Flat cartoon style v2 — cutout/puppet look (inspired by the MIT "GrowKaz Cutout Tales" style bible) ===== */
(function(){
const A=window.ANIME;if(!A)return;
const LINE="#2b1c17",LW=3.2;
const hx=h=>{const n=parseInt(String(h||"#888888").slice(1),16);return [n>>16,n>>8&255,n&255]};
const dk=(h,k)=>{const [r,g,b]=hx(h);k=k==null?.78:k;return "#"+[r,g,b].map(v=>Math.round(v*k).toString(16).padStart(2,"0")).join("")};
const lt=(h,a)=>{const [r,g,b]=hx(h);return "#"+[r,g,b].map(v=>Math.round(v+(255-v)*a).toString(16).padStart(2,"0")).join("")};
let N=0;const uid=()=>"k"+(++N).toString(36)+Math.random().toString(36).slice(2,6);
const rr=(x,y,w,h,r)=>{r=Math.min(r,w/2,h/2);return `M${x+r} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+h-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+h}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+h-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}Z`};
const fs=(d,fill,lw)=>`<path d="${d}" fill="${fill}" stroke="${LINE}" stroke-width="${lw||LW}" stroke-linejoin="round" stroke-linecap="round"/>`;
const shade=(d,sd,base,dark,lw)=>{const id=uid();return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${base}"/><path d="${sd}" fill="${dark}" clip-path="url(#${id})"/><path d="${d}" fill="none" stroke="${LINE}" stroke-width="${lw||LW}" stroke-linejoin="round"/>`};
const rect=(x,y,w,h)=>`M${x} ${y}H${x+w}V${y+h}H${x}Z`;
const D=r=>r*57.29578;
/* expression map: our 21 expressions -> brow (-9 worried .. +6 angry), smile, mouth type, look, effects */
const EXM={neutral:{b:0,s:0},happy:{b:-3,s:6,fx:["blush"]},smiling:{b:-1,s:5},laugh:{b:-4,m:"laugh",fx:["blush"],closed:true},angry:{b:7,s:-3,m:"shout",fx:["vein"]},sad:{b:-7,s:-6,fx:["tear"]},crying:{b:-8,m:"cry",closed:true,fx:["tears"]},surprised:{b:-8,m:"o"},shock:{b:-9,m:"o",small:true,fx:["lines"]},scared:{b:-8,m:"wavy",small:true,fx:["sweat","shade"]},confident:{b:3,s:6,m:"grin",half:true,fx:["sparkle"]},confused:{b:-4,s:-1,look:3,m:"side",fx:["question"]},shy:{b:-5,s:2,look:-3,fx:["blush"]},serious:{b:4,s:-1},evil:{b:7,m:"evil",half:true,fx:["shade"]},cool:{b:2,s:3,half:true},panic:{b:-9,m:"wavy",small:true,fx:["sweat","sweat2"]},smirk:{b:3,s:4,m:"smirk",look:2},worried:{b:-6,s:-4,m:"wavy",fx:["sweat"]},love:{b:-3,s:6,heart:true,fx:["blush"]},sleepy:{b:0,s:0,sleep:true,fx:["zzz"]}};
/* poses (radians, like the cutout kit): ba = back arm (viewer's left), fa = front arm; legs: lg [left angle, right angle, lift] */
const PZ={stand:{ba:[.12,-.12],fa:[-.12,.12],lg:[0,0]},walk:{ba:[-.25,-.2],fa:[.3,.25],lg:[-.18,.22,14]},run:{ba:[.9,-1.4],fa:[-.9,1.3],lg:[-.45,.5,30],y:-10},sit:{ba:[.1,-1.2],fa:[-.1,1.2],lg:[0,0],sit:true},study:{ba:[-.25,-1.6],fa:[.25,1.6],lg:[0,0],sit:true,both:true,book:true},talk:{ba:[.12,-.12],fa:[-1.2,-.3],lg:[0,0],bubble:true},laugh:{ba:[-.2,-1.9],fa:[.2,1.9],lg:[0,0],both:true},fight:{ba:[.55,-2.5],fa:[-.55,2.5],lg:[-.2,.2],both:true,fist:true,spark:true},jump:{ba:[2.6,-.35],fa:[-2.6,.35],lg:[-.35,.35,0],y:-60,shadow:true},think:{ba:[-.25,-1.75],fa:[-.35,2.75],lg:[0,0],both:true,q:true},lookback:{ba:[.12,-.12],fa:[-.12,.12],lg:[0,0],look:true},pockets:{ba:[.38,-1.25],fa:[-.38,1.25],lg:[-.05,.05],hide:true},relaxed:{ba:[.12,-.12],fa:[-2.9,-1.3],lg:[0,.12],hide1:true}};
function look(p){const fem=p.gender==="girl"||p.gender==="woman",chibi=p.age==="teen";const O=p.outfit||"tshirt";
 return {fem,chibi,old:p.age==="old",skin:p.skin,hair:p.hair,hc:p.hairColor,shirt:O==="jacket"||O==="vest"||O==="uniform"?(O==="vest"?"#f2efe8":lt(p.accent,.55)):p.outfitColor,jacket:O==="jacket"?p.outfitColor:O==="vest"?p.outfitColor:null,vest:O==="vest",
  tie:O==="uniform"||O==="vest"?p.accent:null,dress:O==="saree",kurta:O==="kurta",hoodie:O==="hoodie",collar:O==="shirt"||O==="uniform",pants:p.bottomColor||(O==="kurta"?"#efeadc":"#3a3f4c"),shoes:p.shoeColor||"#2d2a2a",acc:p.accent,
  ex:p.extras||[],wid:{slim:.9,average:1,broad:1.12,chubby:1.25}[p.build]||1,tall:{short:.92,average:1,tall:1.07}[p.height]||1,eyes:p.eyes,face:p.face}}
/* ---------- head (front / turn), engine units: face ~ ±40 wide, eyes at y=-6 ---------- */
function headF(L,e,turn,blink){const sk=L.skin,sd=dk(sk,.84),hc=L.hc,has=x=>L.ex.includes(x);const t=turn||0,dx=t*.45;let o="";
 if(L.hair==="long")o+=fs(rr(-46,-48,92,124,40),hc);
 if(L.hair==="bun")o+=fs(`M22 -62A22 22 0 1 1 -22 -62A22 22 0 1 1 22 -62Z`,hc);
 if(L.hair==="ponytail")o+=fs(`M30 -40C64 -36 66 10 50 40C46 10 40 -14 26 -26Z`,hc);
 [-1,1].forEach(s=>{if((s<0&&t<-6)||(s>0&&t>6))return;o+=fs(`M${s*38-8} 4A8 13 0 1 0 ${s*38+8} 4A8 13 0 1 0 ${s*38-8} 4Z`,sk)});
 let face;if(L.chibi)face=`M50 0A50 50 0 1 1 -50 0A50 50 0 1 1 50 0Z`;
 else if(L.fem)face=`M-37 -30C-40 10 -32 36 -12 50C-4 55 4 55 12 50C32 36 40 10 37 -30C30 -62 -30 -62 -37 -30Z`;
 else if(L.face==="square")face=`M-40 -30C-43 14 -38 38 -20 52C-8 58 8 58 20 52C38 38 43 14 40 -30C32 -62 -32 -62 -40 -30Z`;
 else if(L.face==="round")face=`M-40 -28C-44 14 -34 40 -14 52C-5 57 5 57 14 52C34 40 44 14 40 -28C32 -64 -32 -64 -40 -28Z`;
 else face=`M-38 -30C-42 10 -36 34 -16 52C-6 60 6 60 16 52C36 34 42 10 38 -30C30 -62 -30 -62 -38 -30Z`;
 o+=shade(face,`M${14+dx} -70C${30+dx} 0 ${30+dx} 30 ${8+dx} 70L60 70L60 -70Z`,sk,sd);
 if(has("beard")||(L.old&&!L.fem)){const id=uid();o+=`<clipPath id="${id}"><path d="${face}"/></clipPath><path d="M-40 12C-30 30 -20 40 0 42C20 40 30 30 40 12L40 70L-40 70Z" fill="rgba(52,36,28,${has("beard")?.55:.3})" clip-path="url(#${id})"/>`}
 else if(!L.fem&&!L.chibi&&L.face==="square"){const id=uid();o+=`<clipPath id="${id}"><path d="${face}"/></clipPath><path d="M-40 12C-30 30 -20 40 0 42C20 40 30 30 40 12L40 70L-40 70Z" fill="rgba(52,36,28,.22)" clip-path="url(#${id})"/>`}
 if(!L.chibi)o+=`<path d="M${2+dx} -6L${10+dx} 14L${-2+dx} 16Z" fill="${sd}"/>`;
 // eyes
 [-1,1].forEach(s=>{const x=s*16+dx;
  if(blink||e.closed){o+=`<path d="M${x-8} -6Q${x} ${e.closed?-12:-6} ${x+8} -6" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;return}
  if(e.sleep){o+=`<path d="M${x-8} -5Q${x} 0 ${x+8} -5" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;return}
  if(e.heart){o+=`<path d="M${x} 2C${x-12} -6 ${x-8} -16 ${x} -10C${x+8} -16 ${x+12} -6 ${x} 2Z" fill="#e0405e" stroke="${LINE}" stroke-width="2"/>`;return}
  if(L.chibi||L.eyes==="round"){o+=`<circle cx="${x+(e.look||0)}" cy="-4" r="${e.small?3.5:5}" fill="${LINE}"/>`;return}
  const ew=L.eyes==="big"?8.6:7.7,eh=L.eyes==="big"?6.6:5.5;
  o+=`<ellipse cx="${x}" cy="-6" rx="${ew}" ry="${e.small?eh+1.5:eh}" fill="#faf2e6"/><circle cx="${x+1.5+(e.look||0)}" cy="-6" r="${e.small?2:3.6}" fill="${LINE}"/>`;
  if(e.half||L.eyes==="sleepy"||L.eyes==="sharp")o+=`<path d="M${x-ew-1} -6L${x+ew+1} -6L${x+ew+1} -14L${x-ew-1} -14Z" fill="${sk}"/><path d="M${x-ew-1} -7L${x+ew+1} -7" stroke="${LINE}" stroke-width="2.6" stroke-linecap="round"/>`;
  if(L.fem)o+=`<path d="M${x-9} -10L${x+(s>0?9:8)} -11" stroke="${LINE}" stroke-width="2.6" stroke-linecap="round"/>`});
 // brows (carry the emotion)
 const b=e.b||0;[-1,1].forEach(s=>{const x=s*16+dx,inner=b>0?b:b*.4,outer=b>0?0:b,by=-21,xi=x-s*11,xo=x+s*12;
  o+=`<path d="M${xo} ${by+outer*.6}L${xi} ${by+inner*.6+(b>0?2:b<0?-2:0)}" stroke="${L.hair==="bald"?"#6f6f6f":hc}" stroke-width="${L.fem||L.chibi?5:7}" stroke-linecap="round"/>`});
 // mustache, mouth
 if(has("mustache"))o+=`<path d="M${-20+dx} 26C${-10+dx} 18 ${10+dx} 18 ${20+dx} 26" fill="none" stroke="${L.hair==="bald"?"#6f6f6f":hc}" stroke-width="7" stroke-linecap="round"/>`;
 const sm=e.s||0,mx=dx,my=35;const MO={o:`<ellipse cx="${mx}" cy="${my+1}" rx="5.6" ry="7" fill="#5a1f1a"/>`,laugh:`<path d="M${mx-11} ${my-3}L${mx+11} ${my-3}Q${mx+9} ${my+11} ${mx} ${my+11}Q${mx-9} ${my+11} ${mx-11} ${my-3}Z" fill="#5a1f1a" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/><path d="M${mx-9} ${my-2}L${mx+9} ${my-2}L${mx+8} ${my+1}L${mx-8} ${my+1}Z" fill="#fff"/>`,shout:`<path d="M${mx-10} ${my-4}L${mx+10} ${my-4}L${mx+7} ${my+10}L${mx-7} ${my+10}Z" fill="#5a1f1a" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/>`,cry:`<path d="M${mx-10} ${my+4}Q${mx} ${my-8} ${mx+10} ${my+4}Z" fill="#5a1f1a" stroke="${LINE}" stroke-width="2.4"/>`,wavy:`<path d="M${mx-11} ${my}Q${mx-7} ${my-4} ${mx-3} ${my}Q${mx+1} ${my+4} ${mx+5} ${my}Q${mx+9} ${my-4} ${mx+12} ${my}" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`,grin:`<path d="M${mx-12} ${my-2}Q${mx} ${my+12} ${mx+12} ${my-2}Z" fill="#fff" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>`,evil:`<path d="M${mx-14} ${my-4}Q${mx} ${my+8} ${mx+14} ${my-6}Q${mx+8} ${my+12} ${mx} ${my+12}Q${mx-8} ${my+12} ${mx-14} ${my-4}Z" fill="#fff" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>`,smirk:`<path d="M${mx-9} ${my+1}Q${mx+3} ${my+3} ${mx+11} ${my-5}" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`,side:`<path d="M${mx-8} ${my+2}L${mx+9} ${my-3}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`};
 o+=MO[e.m]||`<path d="M${mx-10} ${my}C${mx-4} ${my+sm} ${mx+4} ${my+sm} ${mx+10} ${my}" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
 if(has("mole"))o+=`<circle cx="${14+dx}" cy="26" r="2" fill="${LINE}"/>`;
 if(has("bindi"))o+=`<circle cx="${dx}" cy="-24" r="3.2" fill="#b8322c"/>`;
 if(has("scar"))o+=`<path d="M${22+dx} -26L${30+dx} -10" stroke="#a8523d" stroke-width="2.6" stroke-linecap="round"/>`;
 if(has("earrings"))o+=`<circle cx="-38" cy="18" r="3.4" fill="#e8c04a" stroke="${LINE}" stroke-width="1.6"/><circle cx="38" cy="18" r="3.4" fill="#e8c04a" stroke="${LINE}" stroke-width="1.6"/>`;
 // blush/tears on face
 if((e.fx||[]).includes("blush")||has("blush"))o+=`<ellipse cx="${-22+dx}" cy="14" rx="8" ry="4" fill="#e06a6a" opacity=".45"/><ellipse cx="${22+dx}" cy="14" rx="8" ry="4" fill="#e06a6a" opacity=".45"/>`;
 if((e.fx||[]).includes("tear"))o+=`<path d="M${18+dx} 2Q${21+dx} 14 ${18+dx} 24" stroke="#7cc7f0" stroke-width="4" fill="none" stroke-linecap="round"/>`;
 if((e.fx||[]).includes("tears"))o+=`<path d="M${-16+dx} 0Q${-19+dx} 20 ${-15+dx} 40M${16+dx} 0Q${19+dx} 20 ${15+dx} 40" stroke="#7cc7f0" stroke-width="5" fill="none" stroke-linecap="round"/>`;
 // hair top
 const hs=L.hair;
 if(hs==="curly"){let c="";for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8;c+=`<circle cx="${(42*Math.cos(a)).toFixed(1)}" cy="${(-22+38*Math.sin(a)).toFixed(1)}" r="15" fill="${hc}" stroke="${LINE}" stroke-width="2.5"/>`}o+=c}
 else if(hs==="bald")o+=`<path d="M-38 -18C-40 -6 -40 4 -38 10M38 -18C40 -6 40 4 38 10" stroke="${hc==="#1b1b1f"?"#9a9a9a":hc}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="-12" cy="-46" rx="12" ry="4" fill="#fff" opacity=".35" transform="rotate(-15 -12 -46)"/>`;
 else{let top;
  if(hs==="spiky")top=`M-41 -14L-48 -40L-36 -38L-42 -60L-24 -56L-20 -74L-4 -62L6 -78L16 -62L32 -72L32 -54L48 -56L40 -36L48 -30L41 -14C30 -36 -10 -44 -36 -26Z`;
  else if(hs==="messy")top=`M-41 -14L-46 -44L-32 -42L-30 -64L-12 -56L0 -72L12 -58L28 -66L30 -50L46 -46L41 -14C30 -36 -10 -44 -36 -26Z`;
  else if(hs==="mohawk")top=`M-12 -40L-10 -84L0 -78L10 -86L12 -40Z`;
  else if(hs==="side")top=`M-41 -14C-46 -64 46 -72 41 -14C34 -44 10 -50 -16 -34C-28 -28 -36 -22 -41 -14Z`;
  else if(hs==="long"||hs==="bun"||hs==="ponytail")top=`M-41 -14C-46 -64 46 -72 41 -14C20 -46 -20 -46 -41 -14Z`;
  else top=`M-41 -14C-46 -64 46 -72 41 -14C30 -36 -10 -44 -36 -26Z`;
  o+=hs==="mohawk"?fs(top,hc,2.8)+`<path d="M-38 -10C-40 -20 -38 -28 -34 -32M38 -10C40 -20 38 -28 34 -32" stroke="${hc}" stroke-width="6" fill="none" stroke-linecap="round"/>`:shade(top,rect(14+dx,-90,46,90),hc,dk(hc,.75),2.8)}
 if(has("glasses"))o+=`<circle cx="${-16+dx}" cy="-6" r="11" fill="#fff" fill-opacity=".12" stroke="${LINE}" stroke-width="2.6"/><circle cx="${16+dx}" cy="-6" r="11" fill="#fff" fill-opacity=".12" stroke="${LINE}" stroke-width="2.6"/><path d="M${-5+dx} -7L${5+dx} -7" stroke="${LINE}" stroke-width="2.6"/>`;
 if(has("sunglasses"))o+=`<path d="${rr(-30+dx,-14,26,15,6)}${rr(4+dx,-14,26,15,6)}" fill="#1c1c24" stroke="${LINE}" stroke-width="2.4"/><path d="M${-4+dx} -9L${4+dx} -9" stroke="${LINE}" stroke-width="3"/><path d="M${-25+dx} -10L${-15+dx} -10M${9+dx} -10L${19+dx} -10" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`;
 if(has("cap")){o+=shade(`M-42 -24C-44 -72 44 -72 42 -24Z`,rect(14,-80,40,60),L.acc,dk(L.acc));o+=fs(`M-44 -24L66 -24L60 -14L-44 -16Z`,dk(L.acc,.8))}
 if(has("headphones"))o+=`<path d="M-44 0C-50 -80 50 -80 44 0" fill="none" stroke="${LINE}" stroke-width="7"/>`+fs(rr(-52,-12,14,28,6),L.acc,2.4)+fs(rr(38,-12,14,28,6),L.acc,2.4);
 if(has("flowers"))o+=`<g fill="#fff6d6" stroke="${LINE}" stroke-width="1.5"><circle cx="30" cy="-50" r="5"/><circle cx="37" cy="-44" r="5"/><circle cx="30" cy="-38" r="5"/></g>`;
 // face effects
 const f=e.fx||[];
 if(f.includes("sweat"))o+=`<path d="M48 -40Q55 -28 52 -22Q47 -16 43 -22Q40 -28 48 -40Z" fill="#8fd3ff" stroke="${LINE}" stroke-width="2"/>`;
 if(f.includes("sweat2"))o+=`<path d="M-50 -34Q-43 -22 -46 -16Q-51 -10 -55 -16Q-58 -22 -50 -34Z" fill="#8fd3ff" stroke="${LINE}" stroke-width="2"/>`;
 if(f.includes("vein"))o+=`<g stroke="#c0392b" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M26 -44q3 4 0 8M33 -44q-3 4 0 8M23 -39q4 -3 8 0M23 -33q4 3 8 0"/></g>`;
 if(f.includes("lines"))o+=`<g stroke="${LINE}" stroke-width="3" stroke-linecap="round"><path d="M-62 -40L-52 -34M-66 -14L-54 -12M62 -40L52 -34M66 -14L54 -12"/></g>`;
 if(f.includes("shade"))o+=`<g stroke="#4a3a7a" stroke-width="2.4" opacity=".5"><path d="M-24 -40V-26M-12 -42V-28M12 -42V-28M24 -40V-26"/></g>`;
 if(f.includes("question"))o+=`<text x="44" y="-40" font-family="Arial Black,Arial" font-size="40" font-weight="900" fill="#3b82c4" stroke="${LINE}" stroke-width="2" paint-order="stroke">?</text>`;
 if(f.includes("sparkle"))o+=`<path d="M52 -52l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4l10 -4Z" fill="#f2c94c" stroke="${LINE}" stroke-width="2"/>`;
 if(f.includes("zzz"))o+=`<text x="44" y="-50" font-family="Arial Black,Arial" font-size="20" fill="#2f3863" font-weight="900">Z<tspan font-size="15" dy="-9">z</tspan><tspan font-size="11" dy="-7">z</tspan></text>`;
 return o}
function headS(L,e){const sk=L.skin,sd=dk(sk,.84),hc=L.hc,has=x=>L.ex.includes(x);let o="";
 if(L.hair==="long")o+=fs(`M-30 -30C-56 10 -50 60 -30 80L6 80C-6 40 -4 0 4 -20Z`,hc);if(L.hair==="bun")o+=fs(`M-14 -60A20 20 0 1 1 -54 -60A20 20 0 1 1 -14 -60Z`,hc);if(L.hair==="ponytail")o+=fs(`M-34 -30C-66 -20 -64 30 -50 56C-46 20 -40 0 -26 -12Z`,hc);
 const face=L.chibi?`M50 0A50 50 0 1 1 -50 0A50 50 0 1 1 50 0Z`:`M-4 -58C30 -58 42 -36 42 -16L50 4L42 8C42 30 32 50 10 54C-24 56 -42 30 -42 0C-42 -34 -30 -58 -4 -58Z`;
 o+=shade(face,`M-60 -70H-8C-20 -20 -20 20 -8 70H-60Z`,sk,sd);
 if(has("beard")){const id=uid();o+=`<clipPath id="${id}"><path d="${face}"/></clipPath><path d="M-30 20C-10 40 20 44 46 20L46 70L-30 70Z" fill="rgba(52,36,28,.5)" clip-path="url(#${id})"/>`}
 o+=fs(`M-14 -2A8 13 0 1 0 -14 24A8 13 0 1 0 -14 -2Z`,sd);
 if(e.closed||e.sleep)o+=`<path d="M18 -6Q24 ${e.closed?-12:-2} 30 -6" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
 else if(L.chibi||L.eyes==="round")o+=`<circle cx="26" cy="-4" r="4.5" fill="${LINE}"/>`;
 else o+=`<ellipse cx="25" cy="-6" rx="6" ry="6" fill="#faf2e6"/><circle cx="28" cy="-6" r="${e.small?2:3.3}" fill="${LINE}"/>`;
 const b=e.b||0;o+=`<path d="M14 ${-21+(b>0?0:b*.6)}L34 ${-21+(b>0?b*.6+2:b*.25)}" stroke="${L.hair==="bald"?"#6f6f6f":hc}" stroke-width="${L.fem||L.chibi?5:7}" stroke-linecap="round"/>`;
 if(has("mustache"))o+=`<path d="M28 24C34 18 42 20 46 24" fill="none" stroke="${L.hair==="bald"?"#6f6f6f":hc}" stroke-width="6" stroke-linecap="round"/>`;
 o+=e.m==="o"?`<ellipse cx="36" cy="36" rx="4" ry="6" fill="#5a1f1a"/>`:e.m==="laugh"||e.m==="shout"?`<path d="M28 31L44 31L40 42L32 42Z" fill="#5a1f1a" stroke="${LINE}" stroke-width="2.2"/>`:`<path d="M30 36C34 ${36+(e.s||0)*.6} 38 ${36+(e.s||0)*.6} 42 34" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
 if(has("bindi"))o+=`<circle cx="38" cy="-24" r="3" fill="#b8322c"/>`;
 const hs=L.hair;if(hs==="bald")o+=`<path d="M-30 -14C-34 -4 -34 8 -30 16" stroke="#9a9a9a" stroke-width="8" fill="none" stroke-linecap="round"/>`;
 else if(hs==="curly"){for(let i=0;i<8;i++){const a=Math.PI*1.05+i*Math.PI/9;o+=`<circle cx="${(-6+42*Math.cos(a)).toFixed(1)}" cy="${(-20+38*Math.sin(a)).toFixed(1)}" r="14" fill="${hc}" stroke="${LINE}" stroke-width="2.4"/>`}}
 else{const top=hs==="spiky"?`M-42 4L-54 -20L-42 -22L-50 -44L-30 -42L-30 -64L-10 -56L0 -72L12 -58L28 -62L26 -46L42 -40L30 -34C10 -40 -10 -30 -20 4Z`:`M-42 6C-50 -50 10 -72 40 -36C20 -40 0 -36 -14 -20C-20 -10 -22 0 -22 6Z`;o+=shade(top,rect(-60,-90,30,100),hc,dk(hc,.75),2.8)}
 if(has("glasses")||has("sunglasses"))o+=`<path d="${rr(16,-14,20,14,5)}" fill="${has("sunglasses")?"#1c1c24":"#fff"}" fill-opacity="${has("sunglasses")?1:.12}" stroke="${LINE}" stroke-width="2.4"/><path d="M16 -8L-12 -4" stroke="${LINE}" stroke-width="2.4"/>`;
 if(has("cap")){o+=shade(`M-40 -20C-40 -70 40 -72 42 -26Z`,rect(-60,-80,30,60),L.acc,dk(L.acc));o+=fs(`M30 -30L70 -24L64 -16L28 -20Z`,dk(L.acc,.8))}
 if((e.fx||[]).includes("sweat"))o+=`<path d="M-30 -60Q-23 -48 -26 -42Q-31 -36 -35 -42Q-38 -48 -30 -60Z" fill="#8fd3ff" stroke="${LINE}" stroke-width="2"/>`;
 return o}
function headB(L){const sk=L.skin,hc=L.hc;let o="";[-1,1].forEach(s=>o+=fs(`M${s*38-8} 4A8 13 0 1 0 ${s*38+8} 4A8 13 0 1 0 ${s*38-8} 4Z`,sk));
 const face=L.chibi?`M50 0A50 50 0 1 1 -50 0A50 50 0 1 1 50 0Z`:`M-38 -30C-42 10 -36 34 -16 52C-6 60 6 60 16 52C36 34 42 10 38 -30C30 -62 -30 -62 -38 -30Z`;
 o+=fs(face,dk(sk,.9));
 if(L.hair==="bald")o+=fs(`M-38 10C-30 40 30 40 38 10C24 26 -24 26 -38 10Z`,"#9a9a9a",2.4)+`<ellipse cx="0" cy="-36" rx="16" ry="6" fill="#fff" opacity=".3"/>`;
 else if(L.hair==="curly"){for(let i=0;i<12;i++){const a=i*Math.PI*2/12;o+=`<circle cx="${(34*Math.cos(a)).toFixed(1)}" cy="${(-14+34*Math.sin(a)).toFixed(1)}" r="16" fill="${hc}" stroke="${LINE}" stroke-width="2.4"/>`}o+=`<circle cx="0" cy="-14" r="30" fill="${hc}"/>`}
 else{o+=shade(L.hair==="long"?`M-44 30C-50 -70 50 -70 44 30L46 80L-46 80Z`:`M-42 30C-50 -70 50 -70 42 30C20 40 -20 40 -42 30Z`,rect(10,-90,50,180),hc,dk(hc,.75),2.8);
  if(L.hair==="bun")o+=fs(`M22 -48A22 22 0 1 1 -22 -48A22 22 0 1 1 22 -48Z`,hc);if(L.hair==="ponytail")o+=fs(`M-8 20C-14 50 -4 76 0 84C6 70 14 50 8 20Z`,hc)+fs(rr(-10,12,20,10,4),L.acc,2);}
 if(L.ex.includes("cap"))o+=shade(`M-42 -24C-44 -72 44 -72 42 -24Z`,rect(14,-80,40,60),L.acc,dk(L.acc));
 return o}
/* ---------- arms / legs ---------- */
function arm(sx,sy,a1,a2,col,skin,opt){opt=opt||{};const ua=88,fa=80,w=26,dc=dk(col);let o=`<g transform="translate(${sx} ${sy}) rotate(${D(a1).toFixed(1)})">`;
 o+=shade(rr(-w/2,-6,w,ua+8,w/2),rect(w*.15,-10,w,ua+30),col,dc);
 o+=`<g transform="translate(0 ${ua-4}) rotate(${D(a2).toFixed(1)})">`+shade(rr(-w/2+1,-6,w-2,fa,w/2-1),rect(w*.12,-10,w,fa+20),opt.fore||col,dk(opt.fore||col));
 if(!opt.hide)o+=opt.fist?`<circle cx="0" cy="${fa+4}" r="15.5" fill="${skin}" stroke="${LINE}" stroke-width="${LW}"/><path d="M-7 ${fa}h14M-7 ${fa+6}h14" stroke="${LINE}" stroke-width="2"/>`:`<circle cx="0" cy="${fa+4}" r="13.5" fill="${skin}" stroke="${LINE}" stroke-width="${LW}"/>`;
 return o+`</g></g>`}
/* full character, origin at feet centre, engine units */
function charG(p,view,poseK,exK){const L=look(p),P=PZ[poseK]||PZ.stand,e=EXM[exK]||EXM.neutral;const side=view==="side",back=view==="back"||view==="threeback",three=view==="three"||view==="threeback";
 const wid=L.wid,legh=(L.chibi?150:230)*L.tall*(P.sit?.55:1);let o="";const skin=L.skin;
 const sleeve=L.jacket||(L.kurta||L.hoodie||L.collar||L.dress?L.shirt:L.shirt),fore=(L.jacket||L.kurta||L.hoodie||L.collar)?sleeve:skin;
 // legs
 const legs=(sx)=>{let g="";const ls=[[-24,P.lg[0]],[24,P.lg[1]]];ls.forEach(([lx,a],i)=>{const lift=(i===1?(P.lg[2]||0):0);const x=side?(i?6:-6):lx;
  g+=`<g transform="translate(${x*(three?.85:1)} ${-legh}) rotate(${D(side?a*1.6:a).toFixed(1)}) translate(0 ${legh})">`;
  if(!L.dress)g+=shade(`M${-22*wid} ${-legh}L${22*wid} ${-legh}L19 -26L-19 -26Z`,rect(6,-legh-10,34,legh),i&&side?dk(L.pants,.9):L.pants,dk(L.pants));
  g+=fs(rr(side?-18:(lx>0?-22:-30),-30-lift,side?52:46,30,12),L.shoes)+`</g>`});return g};
 if(P.sit)o+=fs(rr(-110,-legh-16,220,22,8),"#9a6a44")+fs(rr(-100,-legh+6,16,legh-6,4),"#6a4228")+fs(rr(84,-legh+6,16,legh-6,4),"#6a4228");
 if(L.dress){o+=legs();}
 else o+=legs();
 const tw=(side?36:56)*wid*(three?.9:1);
 let t=`<g transform="translate(0 ${-legh+2})">`;
 const BA=P.ba,FA=P.fa;
 if(!side&&!P.both&&!back)t+=arm(-52*wid*(three?.9:1),-150,BA[0],BA[1],sleeve,skin,{fore,hide:P.hide,fist:P.fist});
 if(side)t+=arm(-6,-150,-FA[0]*.6,FA[1]*.6,dk(sleeve,.85),skin,{fore:dk(fore,.9),hide:P.hide,fist:P.fist});
 if(back){t+=arm(-52*wid,-150,-BA[0],-BA[1],sleeve,skin,{fore,hide:P.hide,fist:P.fist});t+=arm(52*wid,-150,-FA[0],-FA[1],sleeve,skin,{fore,hide:P.hide||P.hide1,fist:P.fist})}
 // torso
 const body=`M${-tw} -168C${-tw-4} -100 ${-tw+6} -40 ${-tw+10} 6L${tw-10} 6C${tw-6} -40 ${tw+4} -100 ${tw} -168C30 -182 -30 -182 ${-tw} -168Z`;
 if(L.dress)t+=shade(`M${-tw} -168C${-tw-4} -100 ${-tw+6} -40 ${-tw-28} ${legh-6}L${tw+28} ${legh-6}C${tw-6} -40 ${tw+4} -100 ${tw} -168C30 -182 -30 -182 ${-tw} -168Z`,rect(18,-200,90,legh+220),L.shirt,dk(L.shirt))+(back?"":fs(`M${tw-6} -172C${tw-30} -90 ${-tw+10} -40 ${-tw-10} 40L${-tw+16} 52C${-tw+30} -20 ${tw-14} -70 ${tw+10} -150Z`,L.acc,2.6))+`<path d="M${-tw-24} ${legh-16}L${tw+24} ${legh-16}" stroke="${L.acc}" stroke-width="8"/>`;
 else if(L.kurta)t+=shade(`M${-tw} -168C${-tw-4} -100 ${-tw+4} -20 ${-tw-6} 70L${tw+6} 70C${tw-4} -20 ${tw+4} -100 ${tw} -168C30 -182 -30 -182 ${-tw} -168Z`,rect(18,-200,90,290),L.shirt,dk(L.shirt))+(back?"":`<path d="M0 -176V-110" stroke="${L.acc}" stroke-width="4"/><path d="M${-tw-4} 58H${tw+4}" stroke="${L.acc}" stroke-width="3" stroke-dasharray="7 5"/>`);
 else t+=shade(body,rect(18,-200,90,230),L.shirt,dk(L.shirt));
 if(L.hoodie&&!side)t+=fs(back?`M-40 -176C-40 -140 40 -140 40 -176C20 -150 -20 -150 -40 -176Z`:`M-34 -178C-30 -150 30 -150 34 -178C14 -164 -14 -164 -34 -178Z`,dk(L.shirt,.85),2.6)+(back?"":`<path d="M-8 -158V-120M8 -158V-120" stroke="${L.acc}" stroke-width="3.2" stroke-linecap="round"/>`);
 if(L.tie&&!back&&!side)t+=fs(`M-8 -168L8 -168L12 -60L0 -44L-12 -60Z`,L.tie,2.6);
 if(L.jacket&&!side){if(back)t+=shade(body,rect(0,-200,90,230),L.jacket,dk(L.jacket));else{t+=shade(`M${-tw-2} -166C${-tw-6} -100 ${-tw+4} -40 ${-tw+8} 10L-14 10L-16 -70L-26 -170Z`,rect(0,0,0,0),L.jacket,dk(L.jacket));t+=shade(`M${tw+2} -166C${tw+6} -100 ${tw-4} -40 ${tw-8} 10L14 10L16 -70L26 -170Z`,rect(0,-200,90,230),L.jacket,dk(L.jacket))}}
 if(L.jacket&&side)t+=shade(body,rect(10,-200,90,230),L.jacket,dk(L.jacket));
 if(!L.dress&&!L.kurta)t+=fs(rr(-tw+8,-4,2*tw-16,14,3),"#3a2a22",2.6)+(back||side?"":fs(rr(-9,-5,18,16,3),"#e2b33c",2.2));
 if(L.ex.includes("goldChain")&&!back&&!side)t+=`<path d="M-16 -176Q0 -130 16 -176" fill="none" stroke="#e2b33c" stroke-width="3.4" stroke-dasharray="5 2.4"/><circle cx="0" cy="-140" r="5.5" fill="#f2c94c" stroke="${LINE}" stroke-width="1.8"/>`;
 if(L.ex.includes("towel")&&!side)t+=fs(`M${-tw+6} -176C${-tw-10} -120 ${-tw-6} -70 ${-tw+2} -40L${-tw+24} -40C${-tw+18} -90 ${-tw+16} -130 ${-tw+30} -172Z`,"#f4f1ea",2.6);
 if(L.ex.includes("pen")&&!back&&!side)t+=fs(rr(22,-140,5,26,2),"#2b62c4",1.8);
 // neck + collar
 t+=fs(rr(-15,-194,30,30,8),dk(skin,.86));
 if(L.collar&&!back&&!side)t+=fs(`M-24 -176L0 -150L24 -176L0 -168Z`,L.collar&&L.tie?"#f4f4f4":lt(L.shirt,.25),2.6);
 else if(L.jacket&&!back&&!side)t+=fs(`M-24 -176L0 -150L24 -176L0 -168Z`,L.shirt,2.6);
 // head
 const H_=L.chibi?{y:-175-40*1.9,s:1.9}:{y:-238,s:1};let head;
 if(back&&P.look)head=`<g transform="translate(0 0) scale(1)">${headS(L,e)}</g>`;else if(back)head=headB(L);else if(side)head=headS(L,e);else head=headF(L,e,three?14:0,false);
 t+=`<g transform="translate(0 ${H_.y}) scale(${H_.s}) rotate(${e.b<-6?-3:0})">${head}</g>`;
 if(!back){if(side)t+=arm(6,-150,FA[0]*.6,FA[1]*.6,sleeve,skin,{fore,hide:P.hide,fist:P.fist});
  else{if(P.both)t+=arm(-52*wid*(three?.9:1),-150,BA[0],BA[1],sleeve,skin,{fore,hide:P.hide,fist:P.fist});t+=arm(52*wid*(three?.9:1),-150,FA[0],FA[1],sleeve,skin,{fore,hide:P.hide||P.hide1,fist:P.fist})}}
 if(P.book&&!back)t+=`<g transform="translate(0 -96)">`+fs(`M-46 -6L0 4L46 -6L46 34L0 44L-46 34Z`,"#fbf8ee",2.6)+`<path d="M0 4V44" stroke="${LINE}" stroke-width="2.4"/><path d="M-36 6h26M-36 14h26M10 6h26M10 14h26" stroke="#9aa" stroke-width="2"/>`+fs(rr(-50,32,100,10,3),L.acc,2.2)+`</g>`;
 t+=`</g>`;o+=t;
 let g=`<g>${o}</g>`;if(L.chibi)g=`<g transform="scale(.62)">${o}</g>`;
 if(P.y)g=`<g transform="translate(0 ${P.y})">${g}</g>`;
 if(P.shadow)g=`<ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity=".15"/>`+g;
 return {g,P,L}}
/* overlays */
function popFx(P,L,x){let o="";
 if(P.bubble)o+=`<g transform="translate(${x+96} 70)">`+fs(rr(-6,-30,150,64,30),"#fffdf7",3.2)+fs(`M10 30L-6 52L30 32Z`,"#fffdf7",3.2)+`<path d="M12 30L28 30" stroke="#fffdf7" stroke-width="6"/><text x="69" y="10" font-family="Arial Black,Arial" font-size="26" text-anchor="middle" fill="${LINE}">…!</text></g>`;
 if(P.q)o+=`<text x="${x+80}" y="90" font-family="Arial Black,Arial" font-size="60" font-weight="900" fill="#3b82c4" stroke="${LINE}" stroke-width="3" paint-order="stroke">?</text>`;
 if(P.spark)o+=`<g fill="#f2c94c" stroke="${LINE}" stroke-width="2.4"><path d="M${x-120} 300l8 20l20 8l-20 8l-8 20l-8 -20l-20 -8l20 -8Z"/><path d="M${x+120} 270l6 15l15 6l-15 6l-6 15l-6 -15l-15 -6l15 -6Z"/></g>`;
 if(PZ.run===P)o+=`<g stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".7"><path d="M${x-170} 360h70M${x-190} 430h90M${x-160} 500h60"/></g>`;
 return o}
function tagSvg(x,y,title,sub){const w=Math.max(150,title.length*20+50),h=sub?78:56;const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 return `<g transform="translate(${x} ${y}) rotate(-3)"><path d="${rr(-w/2+6,-h/2+8,w,h,14)}" fill="#000" opacity=".25"/><path d="${rr(-w/2,-h/2,w,h,14)}" fill="#fbf8f0" stroke="${LINE}" stroke-width="4"/><text x="0" y="${sub?-2:12}" text-anchor="middle" font-family="Poppins,Arial Black,Arial" font-weight="800" font-size="32" fill="${LINE}">${E(title)}</text>${sub?`<text x="0" y="26" text-anchor="middle" font-family="Poppins,Arial" font-size="17" fill="#5a4c47">${E(sub)}</text>`:""}</g>`}
function stampSvg(x,y,txt){const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));const w=Math.max(170,txt.length*19+50);
 return `<g transform="translate(${x} ${y}) rotate(6)"><path d="${rr(-w/2,-34,w,68,6)}" fill="#f6ecd9" stroke="#c8261f" stroke-width="5"/><path d="${rr(-w/2+7,-27,w-14,54,4)}" fill="none" stroke="#c8261f" stroke-width="2.5"/><text x="0" y="11" text-anchor="middle" font-family="Poppins,Arial Black,Arial" font-weight="900" font-size="30" fill="#c8261f">${E(txt)}</text></g>`}
/* sets (flat): richer rooms, inspired by the cutout kit */
const MOOD={night:{sky:["#0f1430","#1d2550","#34407a"],win:"#f2c46d",city:"#161c3a",far:"#1c2448",moon:true},day:{sky:["#6fa8de","#a9d0ef","#dcecf6"],win:"#e6f0f8",city:"#7f97b3",far:"#8aa6c2"},dusk:{sky:["#3d2a5c","#c4566a","#f6a65a"],win:"#f6c46d",city:"#4a2e52",far:"#7d4a72"}};
function skyG(id,m){return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sky[0]}"/><stop offset=".55" stop-color="${m.sky[1]}"/><stop offset="1" stop-color="${m.sky[2]}"/></linearGradient>`}
function skyline(x0,base,w,m,seed){let o="",x=x0,r=seed||7;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};while(x<x0+w){const bw=18+rnd()*26,bh=30+rnd()*70;o+=`<rect x="${x.toFixed(1)}" y="${(base-bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${m.city}"/>`;for(let wy=base-bh+8;wy<base-6;wy+=12)for(let wx=x+4;wx<x+bw-6;wx+=9)if(rnd()<.35)o+=`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="${m.win}" opacity=".85"/>`;x+=bw+rnd()*4}return o}
function win(x,y,w,h,m){const id=uid(),cid=uid();return `<defs>${skyG(id,m)}<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><path d="${rr(x-10,y-10,w+20,h+20,5)}" fill="#f0e6d6" stroke="${LINE}" stroke-width="3"/><g clip-path="url(#${cid})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>${m.moon?[...Array(14)].map((_,i)=>`<circle cx="${x+(i*53)%w}" cy="${y+(i*29)%(h*.5)}" r="${1+i%2}" fill="#fff" opacity=".7"/>`).join("")+`<circle cx="${x+w*.75}" cy="${y+h*.22}" r="${h*.09}" fill="#fff4d6"/><circle cx="${x+w*.75}" cy="${y+h*.22}" r="${h*.2}" fill="#fff4d6" opacity=".15"/>`:`<circle cx="${x+w*.7}" cy="${y+h*.35}" r="${h*.1}" fill="#fff3c4"/>`}${skyline(x-10,y+h,w+20,{city:m.far,win:m.win},3)}${skyline(x-6,y+h+6,w+20,m,11)}</g><path d="M${x+w/2} ${y}V${y+h}M${x} ${y+h/2}H${x+w}" stroke="#f0e6d6" stroke-width="6"/><path d="${rr(x,y,w,h,3)}" fill="none" stroke="${LINE}" stroke-width="3"/><path d="${rr(x-18,y+h+8,w+36,14,4)}" fill="#e2d6c4" stroke="${LINE}" stroke-width="3"/>`}
function lampG(x,y){return `<circle cx="${x}" cy="${y-120}" r="160" fill="url(#lampglow)"/>`+fs(rr(x-6,y-110,12,110,4),"#5a4a3a")+fs(rr(x-32,y-10,64,12,5),"#5a4a3a")+fs(`M${x-44} ${y-110}L${x+44} ${y-110}L${x+28} ${y-170}L${x-28} ${y-170}Z`,"#f2d79a")}
function frameP(x,y,w,h,c){return fs(rr(x,y,w,h,4),"#6a4a34")+fs(rr(x+8,y+8,w-16,h-16,2),c,2)}
function dustV(W,H,warm){let o="",r=5;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};for(let i=0;i<40;i++)o+=`<circle cx="${(rnd()*W).toFixed(0)}" cy="${(rnd()*H).toFixed(0)}" r="${(1+rnd()*2).toFixed(1)}" fill="${warm?"#ffe8c4":"#dde6ff"}" opacity="${(.15+rnd()*.3).toFixed(2)}"/>`;
 return o+`<rect width="${W}" height="${H}" fill="url(#vig)"/>`}
function defsCommon(){return `<defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#0d050d" stop-opacity="0"/><stop offset="1" stop-color="#0d050d" stop-opacity=".5"/></radialGradient><radialGradient id="lampglow"><stop offset="0" stop-color="#ffd98a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>`}
function room(W,H,o){const fy=H*(o.fy||.82),wc=o.wall||"#b5835a",fc=o.floor||"#8a5a36",id=uid(),fid=uid();let s=defsCommon()+`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk(wc,.8)}"/><stop offset="1" stop-color="${wc}"/></linearGradient><linearGradient id="${fid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fc}"/><stop offset="1" stop-color="${dk(fc,.7)}"/></linearGradient></defs><rect width="${W}" height="${fy}" fill="url(#${id})"/><rect y="${fy-H*.14}" width="${W}" height="${H*.14}" fill="${dk(wc,.86)}"/><path d="M0 ${fy-H*.14}H${W}" stroke="${dk(wc,.6)}" stroke-width="3"/><rect y="${fy}" width="${W}" height="${H-fy}" fill="url(#${fid})"/>`;
 for(let i=-4;i<Math.ceil(W/60)+5;i++)s+=`<path d="M${i*60} ${fy}L${(i*60-120+(i*60-W/2)*.4).toFixed(0)} ${H}" stroke="${dk(fc,.82)}" stroke-width="2"/>`;
 return s+`<path d="M0 ${fy}H${W}" stroke="${LINE}" stroke-width="3"/>`}
function setArt(k,W,H){switch(k){
 case "dining":return room(W,H,{fy:.86})+frameP(W*.1,-6,W*.14,H*.1,"#c8a06a")+win(W*.42,H*.04,W*.3,H*.26,MOOD.night)+frameP(W*.86,H*.06,W*.1,H*.14,"#7fa383")+lampG(W*.94,H*.82);
 case "flatroom":return room(W,H,{})+win(W*.36,H*.08,W*.34,H*.28,MOOD.night)+frameP(W*.08,H*.1,W*.16,H*.13,"#c8a06a")+lampG(W*.86,H*.82)+fs(rr(W*.06,H*.82-90,90,90,8),"#c4704a");
 case "apartment":return room(W,H,{wall:"#9fb3a8",floor:"#a8774f"})+win(W*.1,H*.1,W*.32,H*.3,MOOD.day)+lampG(W*.88,H*.82)+fs(rr(W*.5,H*.82-120,W*.42,80,24),"#6b3fa0")+fs(rr(W*.48,H*.82-60,W*.46,50,20),"#7d52b0")+frameP(W*.56,H*.12,W*.14,H*.12,"#e6b87a");
 case "office":return room(W,H,{wall:"#c9c3b8",floor:"#7a7a82"})+win(W*.62,H*.08,W*.3,H*.28,MOOD.day)+fs(rr(W*.06,H*.82-110,W*.42,16,5),"#8a5a3a")+fs(rr(W*.1,H*.82-94,10,94,3),"#6a4228")+fs(rr(W*.42,H*.82-94,10,94,3),"#6a4228")+fs(rr(W*.16,H*.82-200,W*.18,90,6),"#2e3240")+`<rect x="${W*.17}" y="${H*.82-192}" width="${W*.16}" height="74" fill="#7ab8e0"/>`+fs(rr(W*.4,H*.82-140,24,30,6),"#e8e0d4");
 case "stage":{let s=defsCommon()+`<rect width="${W}" height="${H}" fill="#241a2a"/><circle cx="${W/2}" cy="${H*.45}" r="${W*.5}" fill="url(#lampglow)"/><rect y="${H*.8}" width="${W}" height="${H*.2}" fill="#7a4a2e"/><path d="M0 ${H*.8}H${W}" stroke="${LINE}" stroke-width="3"/>`;for(let i=0;i<5;i++){s+=fs(`M${i*26} 0C${i*26+18} ${H*.3} ${i*26-12} ${H*.6} ${i*26+6} ${H*.8}L${i*26+30} ${H*.8}C${i*26+12} ${H*.6} ${i*26+40} ${H*.3} ${i*26+26} 0Z`,i%2?"#9a2a2a":"#7a1e22",2.4);s+=fs(`M${W-i*26} 0C${W-i*26-18} ${H*.3} ${W-i*26+12} ${H*.6} ${W-i*26-6} ${H*.8}L${W-i*26-30} ${H*.8}C${W-i*26-12} ${H*.6} ${W-i*26-40} ${H*.3} ${W-i*26-26} 0Z`,i%2?"#9a2a2a":"#7a1e22",2.4)}return s}
 case "street_night":{const m=MOOD.night,id=uid();return defsCommon()+`<defs>${skyG(id,m)}</defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`+[...Array(30)].map((_,i)=>`<circle cx="${(i*97)%W}" cy="${(i*41)%(H*.4)}" r="${1+i%2}" fill="#fff" opacity=".6"/>`).join("")+`<circle cx="${W*.8}" cy="${H*.14}" r="26" fill="#fff4d6"/>`+skyline(-20,H*.72,W+40,{city:m.far,win:m.win},5)+skyline(-20,H*.76,W+40,m,13)+`<rect y="${H*.76}" width="${W}" height="${H*.06}" fill="#8a8a90" stroke="${LINE}" stroke-width="3"/><rect y="${H*.82}" width="${W}" height="${H*.18}" fill="#3a3a44"/>`+[...Array(Math.ceil(W/180))].map((_,i)=>`<rect x="${i*180+30}" y="${H*.9}" width="90" height="10" rx="4" fill="#f2d98a" opacity=".8"/>`).join("")+`<circle cx="${W*.12+34}" cy="${H*.42}" r="120" fill="url(#lampglow)"/>`+fs(rr(W*.12-6,H*.42,12,H*.34,4),"#2e2e36")+fs(rr(W*.12+18,H*.42-6,32,14,6),"#ffe0a0")}
 }return null}
const prevBg=A.bgArt;A.bgArt=function(k,W,H,base){const s=setArt(k,W,H);return s||prevBg(k,W,H,base)};
A.BGS.apartment="Apartment (flat style)";A.BGS.office="Office (flat style)";A.BGS.stage="Stage (flat style)";A.BGS.street_night="City street at night (flat style)";
A.DINING_FG=(W,H,n)=>{const ty=H*.6;let o=`<rect x="${W*.06}" y="${ty}" width="${W*.94}" height="${H-ty}" fill="#8a5a36" stroke="${LINE}" stroke-width="3"/>`+fs(rr(W*.04,ty-16,W*.98,30,10),"#9a6a44");const k=Math.max(1,n||3);for(let i=0;i<k;i++){const x=W/(k+1)*(i+1);o+=`<ellipse cx="${x}" cy="${ty-10}" rx="${Math.min(100,W/(k+1)*.34)}" ry="20" fill="#fbfaf5" stroke="${LINE}" stroke-width="3"/>`}return o};
/* public: full picture (400x800 frame) & group & bust, used when p.style==="flat" */
const SC=1.3;
function inner(p,o){const view0=o.view||"front";let view=view0;const P=PZ[o.pose||"stand"]||PZ.stand;if(P.look&&view==="front")view="back";
 const v=view==="side2"?"side":view==="threeback"?"back":view;const {g}=charG(p,v,o.pose||"stand",o.expr||p.expr);
 let s=`<g transform="translate(200 762) scale(${SC})">${g}</g>`;if(view==="side2"||view==="threeback")s=`<g transform="translate(400 0) scale(-1 1)">${s}</g>`;
 return s+popFx(P,null,200)}
const prevFull=A.drawFull;A.drawFull=function(p,o){o=o||{};if(!(p&&p.style==="flat"))return prevFull(p,o);const W=400,H=800,bg=o.bg||p.bgScene||"plain";
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${A.bgArt(bg,W,H,o.base||p.bg)}${inner(p,o)}`;
 if(bg==="dining")s+=A.DINING_FG(W,H,1);if(o.tag)s+=tagSvg(200,46,o.tag,o.tagSub);if(o.stamp)s+=stampSvg(292,610,o.stamp);
 if(!["plain","none"].includes(bg))s+=dustV(W,H,true);
 if(o.label)s+=`<rect x="0" y="${H-46}" width="${W}" height="46" fill="rgba(20,22,40,.72)"/><text x="${W/2}" y="${H-15}" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#fff">${String(o.label).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</text>`;
 return s+`</svg>`};
const prevGroup=A.group;A.group=function(chars,o){o=o||{};if(!chars.some(c=>c.p&&c.p.style==="flat"))return prevGroup(chars,o);const n=chars.length,W=Math.max(900,n*340),H=800,bg=o.bg||"dining";
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${A.bgArt(bg,W,H)}`;
 chars.forEach((c,i)=>{const x=(W/(n+1))*(i+1);const view=c.view||(bg==="dining"?"front":"three");const pp=c.p&&c.p.style==="flat"?c.p:Object.assign({},c.p,{style:"flat"});const {g}=charG(pp,view==="side2"?"side":view,c.pose||"stand",c.expr||pp.expr);
  s+=`<g transform="translate(${x} 762) scale(${SC})">${g}</g>`});
 if(bg==="dining")s+=A.DINING_FG(W,H,n);s+=dustV(W,H,true);return s+`</svg>`};
const prevDraw=A.draw;A.draw=function(p,e,o){o=o||{};if(!(p&&p.style==="flat")||o.headOnly)return prevDraw(p,e,o);const L=look(Object.assign({},A.DEF,p)),ex=EXM[e||p.expr]||EXM.neutral;
 const bgc=p.bg||"#d9b48f";let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${bgc}"/>`;if(!o.plain)s+=`<circle cx="200" cy="200" r="230" fill="#fff" opacity=".12"/>`;
 const q=Object.assign({},p);const {g}=charG(Object.assign({},q,{age:q.age==="teen"?"young":q.age}),"front","stand",e||p.expr);
 s+=`<g transform="translate(200 ${L.chibi?1180:1240}) scale(${L.chibi?2.15:2.35})">${L.chibi?`<g transform="translate(0 0)">${g}</g>`:g}</g>`;
 if(L.chibi){s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${bgc}"/><g transform="translate(200 250) scale(2.3)">${headF(L,ex,0,false)}</g><path d="M90 500C96 430 150 410 200 410C250 410 304 430 310 500Z" fill="${L.shirt}" stroke="${LINE}" stroke-width="5"/>`}
 if(o.label)s+=`<rect x="0" y="456" width="400" height="44" fill="rgba(20,22,40,.72)"/><text x="200" y="486" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#fff">${String(o.label).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</text>`;
 return s+`</svg>`};
A.FLAT2={tagSvg,stampSvg,charG,headF};
})();
