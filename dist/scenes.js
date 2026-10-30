const txt=(x,y,t,cls='',extra='')=>`<text x="${x}" y="${y}" class="${cls}" ${extra}>${t}</text>`;
const path=(d,color='#a7b59a',w=2,extra='')=>`<path d="${d}" class="path" stroke="${color}" stroke-width="${w}" ${extra}/>`;
const arrow=(d,c='#a7b59a',w=2)=>path(d,c,w,`marker-end="url(#arrow-${c.slice(1)})"`);
const obj=(id,body)=>`<g data-object="${id}" role="button" tabindex="0" aria-label="${id}">${body}</g>`;
const node=(id,x,y,w,h,title,sub,color='#e4edda')=>{const key=/^(\d+ )?ATP$/.test(title)?species.atp:title==='NADPH'?species.nadph:null;return obj(id,`<rect class="body" x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="${key?key.tint:color}" stroke="${key?key.color:'#c1d0b0'}"/>${txt(x+w/2,y+h/2+1,title,'', `text-anchor="middle" font-weight="600" ${key?`style="fill:${key.color}"`:''}`)}${sub?txt(x+w/2,y+h/2+20,sub,'minor','text-anchor="middle"'):''}`)};
export const species={
 electron:{label:'電子',symbol:'e⁻',color:'#7241ba',tint:'#f0e9fb',shape:'circle'},
 proton:{label:'氫離子',symbol:'H⁺',color:'#c46014',tint:'#fff0df',shape:'circle'},
 photon:{label:'光能',symbol:'光',color:'#9b7400',tint:'#fff5c9',shape:'light'},
 oxygen:{label:'氧氣',symbol:'O₂',color:'#2275ad',tint:'#e3f3ff',shape:'pill'},
 co2:{label:'二氧化碳',symbol:'CO₂',color:'#526171',tint:'#edf1f5',shape:'pill'},
 atp:{label:'ATP',symbol:'ATP',color:'#007b80',tint:'#dff5f3',shape:'pill'},
 nadph:{label:'NADPH',symbol:'NADPH',color:'#b33a70',tint:'#fce7ef',shape:'pill'},
 g3p:{label:'三碳糖',symbol:'G3P',color:'#397a35',tint:'#e7f4df',shape:'pill'},
 adp:{label:'ADP + Pᵢ',symbol:'ADP',color:'#527478',tint:'#edf3f3',shape:'pill'},
 nadp:{label:'NADP⁺',symbol:'NADP⁺',color:'#965b76',tint:'#f5edf1',shape:'pill'}
};
export function activeSpecies(mode,step){return mode==='light'?[['photon'],['electron','proton','oxygen'],['electron','proton'],['photon','electron'],['electron','nadph'],['proton','atp'],['atp','nadph']][step]:mode==='calvin'?[['co2'],['atp','nadph'],['g3p'],['g3p','atp']][step]:[['photon','oxygen'],['atp','nadph'],['co2','g3p'],['adp','nadp']][step]}
const particle=(x,y,type='electron')=>{const k=species[type];if(!k)throw Error('Unknown particle: '+type);const w=k.shape==='circle'?24:k.shape==='light'?24:Math.max(38,k.symbol.length*8+14);return `<g class="moving-species" data-species="${type}" transform="translate(${x} ${y})"><title>${k.label} ${k.symbol}</title>${k.shape==='circle'?`<circle r="12" fill="${k.tint}" stroke="${k.color}" stroke-width="2"/>`:k.shape==='light'?`<path d="M2 -17 L-10 1 L-1 1 L-4 17 L11 -4 L2 -4Z" fill="${k.tint}" stroke="${k.color}" stroke-width="2"/>`:`<rect x="${-w/2}" y="-12" width="${w}" height="24" rx="7" fill="${k.tint}" stroke="${k.color}" stroke-width="2"/>`}${k.shape==='light'?'':`<text text-anchor="middle" y="4" style="fill:${k.color};font-size:11px;font-weight:800">${k.symbol}</text>`}</g>`};
const lerp=(a,b,t)=>a+(b-a)*t;
const lineParticle=(x1,y1,x2,y2,t,type='electron',n=1)=>Array.from({length:n},(_,i)=>{let q=(t+i/n)%1;return particle(lerp(x1,x2,q),lerp(y1,y2,q),type)}).join('');
const curveParticle=(x1,y1,cx,cy,x2,y2,t,type='electron',n=1)=>Array.from({length:n},(_,i)=>{const q=(t+i/n)%1,u=1-q;return particle(u*u*x1+2*u*q*cx+q*q*x2,u*u*y1+2*u*q*cy+q*q*y2,type)}).join('');
const note=(x,y,type,label)=>{const k=species[type],w=label.length*12+22;return `<g class="route-note" data-note="${type}"><rect x="${x}" y="${y-17}" width="${w}" height="25" rx="7" fill="${k.tint}" stroke="${k.color}" stroke-opacity=".35"/><text x="${x+11}" y="${y}" style="fill:${k.color};font-size:11px;font-weight:700">${label}</text></g>`};
export const defs=`<defs>${[...new Set(['#a7b59a','#7241ba','#c46014','#91aa7e','#8fa782',...Object.values(species).map(k=>k.color)])].map(c=>`<marker id="arrow-${c.slice(1)}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="${c}"/></marker>`).join('')}<marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#8fa782"/></marker><marker id="arrPurple" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#7241ba"/></marker><marker id="arrOrange" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#c46014"/></marker><linearGradient id="membrane" x2="0" y2="1"><stop stop-color="#c9d9b5"/><stop offset=".5" stop-color="#e3ebd4"/><stop offset="1" stop-color="#c9d9b5"/></linearGradient><linearGradient id="protein" x2="0" y2="1"><stop stop-color="#e0e5db"/><stop offset="1" stop-color="#bac7b2"/></linearGradient></defs>`;
function photosystem(id,x,name,p,full){return obj(id,`<path class="body" d="M${x-35} 205 Q${x-40} 173 ${x-12} 165 Q${x} 157 ${x+12} 165 Q${x+40} 173 ${x+35} 205 L${x+31} 261 Q${x+28} 276 ${x} 277 Q${x-28} 276 ${x-31} 261Z" fill="url(#protein)" stroke="#ad9cbe" stroke-width="1.5"/>${[[-18,-18],[16,-17],[-22,12],[21,13],[-12,42],[13,43]].map(([dx,dy])=>`<ellipse cx="${x+dx}" cy="${211+dy}" rx="7" ry="9" fill="#72976a" stroke="#62815b"/>`).join('')}<rect x="${x-11}" y="201" rx="5" width="22" height="31" fill="#88769f"/>${txt(x,191,name,'tag','text-anchor="middle"')}${txt(x,223,full?p:'a','tag','text-anchor="middle"')}${txt(x,310,name==='PS II'?'光系統 II':'光系統 I','','text-anchor="middle"')}`)}
export function lightScene(step,t,depth){const full=depth===2,standard=depth>=1;let s=`${txt(27,40,'光反應','title')}${txt(27,61,'LIGHT REACTIONS','minor')}<rect x="30" y="240" width="700" height="178" rx="78" fill="#eef2e3" stroke="#d1ddc3"/>${txt(55,85,'基質 STROMA','region')}${txt(60,367,'囊腔 LUMEN','region')}<rect x="32" y="215" width="696" height="37" rx="18" fill="url(#membrane)" stroke="#c2d1af"/>`;
s+=Array.from({length:47},(_,i)=>`<circle cx="${43+i*14.6}" cy="219" r="4.4" fill="#b2c69a"/><circle cx="${43+i*14.6}" cy="249" r="4.4" fill="#b2c69a"/>`).join('');
s+=`${txt(54,282,'葉綠囊膜','minor')}${photosystem('ps2',160,'PS II','P680',full)}${photosystem('ps1',421,'PS I','P700',full)}`;
s+=obj('etc',`<rect class="body" x="270" y="200" width="45" height="68" rx="15" fill="#cad8be" stroke="#9db28a"/><path d="M280 216 L303 216 M280 228 L303 228 M280 240 L303 240" stroke="#9caf8f"/>${txt(292,310,'電子傳遞鏈','','text-anchor="middle"')}`);
s+=arrow('M174 198 Q212 167 267 210','#7241ba')+arrow('M316 210 Q358 166 407 199','#7241ba')+arrow('M440 190 Q480 145 505 161','#7241ba');
s+=node('nadph',510,139,112,56,standard?'NADP⁺ 還原酶':'NADPH 形成','基質側','#e6e1ed');
s+=obj('atp',`<rect class="body" x="658" y="205" width="23" height="78" rx="8" fill="#b5c7a0" stroke="#8aa473"/><path class="body" d="M646 188 Q648 170 669 168 Q692 171 694 188 L694 199 Q669 210 646 199Z" fill="#ccdabc" stroke="#8aa473"/>${txt(669,310,'ATP 合酶','','text-anchor="middle"')}`);
s+=arrow('M669 333 L669 213','#c46014',2.5)+arrow('M669 165 L669 122','#c46014',2.5)+node('atp',614,73,110,35,'ATP',null,species.atp.tint);
if(standard)s+=txt(650,141,'ADP + Pᵢ','minor')+arrow('M723 148 Q739 118 714 108');
s+=obj('water',`<rect class="body" x="81" y="328" width="75" height="33" rx="16" fill="#e0eaf0" stroke="#bfd0d9"/>${txt(119,350,'H₂O','','text-anchor="middle"')}${arrow('M127 328 Q126 298 149 278')}${arrow('M88 348 L53 348',species.oxygen.color)}${txt(37,331,'O₂','minor')}`);
if(standard)s+=arrow('M285 158 L285 196','#c46014')+arrow('M285 271 L285 325','#c46014')+txt(307,338,'H⁺ 累積','minor')+txt(290,148,'H⁺','minor');
s+=path('M124 115 l9 16 -7 15 13 14 -7 15 16 13','#9b7400',2.5)+path('M385 108 l10 16 -7 15 14 14 -7 15 15 15','#9b7400',2.5)+note(96,97,'photon','光能')+note(365,93,'photon','光能');
if(standard)s+=txt(525,114,'NADPH','', 'style="fill:#b33a70" font-weight="700"')+arrow('M562 138 L546 119');
s+=node('calvin',472,354,199,44,'供卡爾文循環使用',null,'#e0ead6');
s+=arrow('M563 197 L636 197 L636 349 L606 349 L606 354',species.nadph.color)+arrow('M725 91 L741 91 L741 389 L677 389',species.atp.color);
if(full)s+=`<rect x="218" y="34" width="244" height="67" rx="9" fill="#f4f2e5" stroke="#e1dbbd"/>${txt(231,54,'光能捕獲 → 反應中心 → 電子受器','minor')}${txt(231,76,'能量在色素間傳遞；電子由反應中心傳出','minor')}${txt(60,391,'水光解也提供囊腔 H⁺','minor')}`;
let a=step===0||step===3; if(a){let x=step===0?160:421;s+=`<circle cx="${x}" cy="215" r="${20+9*Math.sin(t*Math.PI)}" fill="#e4c957" opacity=".25"/>`;s+=particle(x-26*(1-t),180+30*t,'photon');}
if(step===1)s+=lineParticle(125,326,151,277,t,'electron',2)+lineParticle(135,331,205,354,t,'proton',2)+lineParticle(83,347,42,347,t,'oxygen',1);
if(step===2){s+=curveParticle(174,198,212,167,267,210,t,'electron',2)+curveParticle(316,210,358,166,407,199,t,'electron',2);if(standard)s+=lineParticle(286,155,286,328,t,'proton',3);}
if(step>=2&&standard)s+=[330,370,420,470,520,570].map((x,i)=>particle(x,350+Math.sin(i)*18,'proton',4)).join('');
if(step===4)s+=curveParticle(440,190,480,145,505,161,t,'electron',2)+lineParticle(563,135,548,114,t,'nadph',1)+`<circle cx="550" cy="110" r="${19+4*t}" fill="#dfd4ec" opacity=".3"/>`;
if(step===5)s+=lineParticle(669,333,669,146,t,'proton',3)+lineParticle(714,112,682,93,t,'atp',1);
if(step===6)s+=lineParticle(741,114,741,380,t,'atp',1)+lineParticle(636,211,636,340,t,'nadph',1);
s+=note(183,139,'electron','e⁻ 電子傳遞')+note(336,399,'proton','H⁺ 氫離子')+note(487,437,'nadph','NADPH')+note(635,437,'atp','ATP');
if(step===1)s+=note(33,405,'oxygen','O₂ 氧氣');
return s;}
function carbons(x,y,count,num,label,depth,id,color='#dce8d0'){let w=Math.max(102,count*18+30);return obj(id,`<rect class="body" x="${x-w/2}" y="${y-23}" width="${w}" height="65" rx="11" fill="${color}" stroke="#b9ccaa"/>${depth>0?Array.from({length:count},(_,i)=>`<circle cx="${x-(count-1)*9+i*18}" cy="${y}" r="7" fill="#687d5e"/>${txt(x-(count-1)*9+i*18,y+3,'C','tag','text-anchor="middle" style="font-size:8px"')}`).join(''):txt(x,y+5,label,'','text-anchor="middle"')}${txt(x,y+28,depth>0?`${depth===2?num+' × ':''}${label}`:'','minor','text-anchor="middle"')}`)}
export function calvinScene(step,t,depth){let s=txt(27,40,'卡爾文循環','title')+txt(27,61,'CALVIN CYCLE · 基質','minor');s+=`<circle cx="367" cy="242" r="136" fill="none" stroke="#edf1e4" stroke-width="40"/>`;
s+=arrow('M283 137 Q371 82 455 148','#91aa7e',10)+arrow('M495 185 Q535 255 469 322','#91aa7e',10)+arrow('M425 354 Q328 403 252 323','#91aa7e',10)+arrow('M227 282 Q193 220 242 164','#91aa7e',10);
s+=txt(365,223,'把碳帶入','', 'text-anchor="middle" fill="#718568"')+txt(365,253,'有機物','title','text-anchor="middle"')+txt(365,278,depth===2?'3 CO₂ → 淨輸出 1 G3P':'固碳 → 還原 → 再生','minor','text-anchor="middle"');
s+=carbons(256,130,5,3,'RuBP',depth,'rubp')+carbons(494,166,3,6,'PGA',depth,'pga')+carbons(476,326,3,6,'G3P',depth,'g3p')+carbons(247,318,3,5,'G3P',depth,'regen');
s+=node('rubp',330,24,106,37,depth===2?'3 CO₂':'CO₂',null,'#e3e9e9')+arrow('M386 66 L412 113',species.co2.color)+txt(444,96,depth>0?'Rubisco':'固碳','minor');
s+=node('pga',572,201,148,61,depth===2?'6 ATP + 6 NADPH':'ATP + NADPH','來自光反應','#e9e2cc')+arrow('M572 230 L522 243');
if(depth>0)s+=txt(563,285,depth===2?'6 ADP、6 NADP⁺、Pᵢ':'ADP、NADP⁺、Pᵢ','minor')+arrow('M520 262 L563 278');
s+=node('regen',41,190,120,49,depth===2?'3 ATP':'ATP','接受器再生','#e9e2cc')+arrow('M163 213 L211 224');if(depth>0)s+=txt(89,262,depth===2?'3 ADP':'ADP','minor');
s+=arrow('M441 367 Q454 395 500 421',species.g3p.color)+node('sugar',487,402,169,51,depth===2?'1 G3P 淨輸出':'三碳糖淨輸出','形成其他有機物','#d9e8d2');
s+=txt(170,88,'① 固碳','minor')+txt(570,334,'② 還原','minor')+txt(91,320,'③ 再生','minor');
if(depth===2)s+=txt(34,410,'碳數追蹤','minor')+txt(34,432,step===2?'18 C = 3 C 輸出 + 15 C 留下':step===3?'5 × 3 C = 3 × 5 C':'3 C + 15 C = 18 C','','font-size="12"')+txt(34,452,'合計使用 9 ATP、6 NADPH','minor');
if(step===0)s+=lineParticle(386,69,416,113,t,'co2',1);
if(step===1)s+=lineParticle(575,214,529,226,t,'atp',1)+lineParticle(575,250,529,262,t,'nadph',1);
if(step===2){s+=lineParticle(444,368,498,420,t,'g3p',1);s+=lineParticle(425,362,293,352,t,'g3p',2);}
if(step===3)s+=lineParticle(228,282,243,168,t,'g3p',2)+lineParticle(163,213,211,224,t,'atp',1);
s+=note(285,453,'g3p','G3P 三碳糖');return s;}
export function bridgeScene(step,t,depth){let s=txt(27,40,'從光能到有機物','title')+txt(27,61,'ONE CONNECTED PROCESS','minor');s+=`<rect x="45" y="84" width="673" height="341" rx="100" fill="#f0f4e7" stroke="#c4d5b4" stroke-width="2"/><rect x="57" y="96" width="649" height="317" rx="90" fill="none" stroke="#dce6d2"/>`+txt(603,390,'葉綠體','minor');s+=node('light',106,190,166,102,'光反應','葉綠囊膜','#ddd3e7')+node('calvin',483,190,166,102,'卡爾文循環','基質','#dce9cf');
s+=obj('energy',`${arrow('M280 212 Q370 116 478 209','#8fa782',3)}${txt(376,160,'ATP + NADPH','','text-anchor="middle" font-weight="700"')}`)+obj('return',`${arrow('M478 280 Q371 373 280 280','#8fa782',2)}${txt(376,342,depth===0?'分子再利用':'ADP + Pᵢ + NADP⁺','minor','text-anchor="middle"')}`);
s+=path('M153 110 l12 15 -7 12 15 13 -7 14 17 18','#9b7400',3)+txt(121,107,'光能','minor')+arrow('M187 133 L187 183');s+=obj('water',txt(78,340,'H₂O')+arrow('M112 332 L145 299')+arrow('M113 268 L75 294')+txt(61,312,'O₂'));
s+=txt(566,136,'CO₂','','text-anchor="middle"')+arrow('M566 144 L566 182');s+=node('sugar',489,343,157,45,'三碳糖 → 有機物',null,'#e5eddc')+arrow('M566 299 L566 337');
s+=txt(80,455,'能量由光輸入；可再利用的分子在兩種反應之間往返。','minor');
if(step===0)s+=particle(lerp(161,185,t),lerp(112,182,t),'photon')+lineParticle(113,268,75,294,t,'oxygen',1);
if(step===1)s+=curveParticle(280,212,370,116,478,209,t,'atp',1)+curveParticle(280,212,370,116,478,209,(t+.5)%1,'nadph',1);
if(step===2)s+=lineParticle(566,303,566,338,t,'g3p',1)+lineParticle(566,145,566,182,t,'co2',1);
if(step===3)s+=curveParticle(478,280,371,373,280,280,t,'adp',1)+curveParticle(478,280,371,373,280,280,(t+.5)%1,'nadp',1);s+=note(284,103,'atp','ATP')+note(361,103,'nadph','NADPH')+note(295,388,'adp','ADP + Pᵢ')+note(427,388,'nadp','NADP⁺');return s;}
export function renderScene(mode,step,t,depth){return `<svg viewBox="0 0 760 480" role="group" aria-label="${mode==='light'?'光反應葉綠囊膜互動圖':mode==='calvin'?'卡爾文循環互動圖':'光反應與碳反應的連結'}">${defs}${mode==='light'?lightScene(step,t,depth):mode==='calvin'?calvinScene(step,t,depth):bridgeScene(step,t,depth)}</svg>`}
