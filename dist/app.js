import {lessons,objects} from './content.js?v=3';
import {renderScene,species,activeSpecies} from './scenes.js?v=3';
import {frameAt,advance} from './timeline.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let mode='light',progress=0,playing=false,speed=1,depth=1,textLevel=1,selected='ps2',zoom=1,lastTime=0,lastStep=-1;
const stepDuration=6;
const lesson=()=>lessons[mode];
const index=()=>frameAt(progress,lesson().steps.length).step;
const phase=()=>frameAt(progress,lesson().steps.length).phase;
const clock=n=>`00:${String(Math.round(n)).padStart(2,'0')}`;
function setPlaying(value){playing=value;$('#play').textContent=value?'Ⅱ':'▶';$('#play').setAttribute('aria-label',value?'暫停':'播放');lastTime=0;}
function visualKey(){
 const active=activeSpecies(mode,index());
 const keys=mode==='light'?['photon','electron','proton','oxygen','atp','nadph']:mode==='calvin'?['co2','atp','nadph','g3p']:['photon','oxygen','co2','atp','nadph','g3p','adp','nadp'];
 const chip=id=>{const k=species[id];return `<span class="species-key" style="--species:${k.color};--tint:${k.tint}"><b class="key-symbol ${k.shape}">${k.shape==='light'?'ϟ':k.symbol}</b><span>${k.label===k.symbol?'':k.label}</span></span>`};
 $('#motion-guide').innerHTML='<span class="guide-label">這一步追蹤</span>'+active.map(chip).join('');
 $('#legend').innerHTML=keys.map(chip).join('');
}
function updateText(){visualKey();const i=index(),s=lesson().steps[i];$('#step-label').textContent=`${String(i+1).padStart(2,'0')} / ${lesson().label}`;$('#step-title').textContent=s.title;$('#step-text').textContent=s.text[textLevel];$('#observation').textContent=s.observation;$('#source-ref').textContent=lesson().source;$('#object-title').textContent=objects[selected].title;$('#object-text').textContent=objects[selected].text;}
function highlight(){let seen=false;$$('#diagram [data-object]').forEach(g=>{const on=g.dataset.object===selected;g.classList.toggle('selected',on);g.setAttribute('aria-label',objects[g.dataset.object]?.title||g.dataset.object);g.setAttribute('aria-pressed',String(on));if(on)seen=true});return seen;}
function draw(){const i=index();if(lastStep!==i){lastStep=i;selected=lesson().steps[i].object;updateText();$$('[data-step]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.step)===i);b.setAttribute('aria-current',Number(b.dataset.step)===i?'step':'false')});}$('#diagram').innerHTML=renderScene(mode,i,phase(),depth);highlight();$('#progress').value=progress;$('#elapsed').textContent=clock(progress*lesson().steps.length*stepDuration);$('#step-counter').textContent=`步驟 ${i+1} / ${lesson().steps.length}`;}
function jump(i){setPlaying(false);progress=Math.max(0,Math.min(i,lesson().steps.length-1))/lesson().steps.length;draw()}
function setMode(m){mode=m;progress=0;lastStep=-1;selected=lesson().steps[0].object;setPlaying(false);$$('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===m);b.setAttribute('aria-pressed',String(b.dataset.mode===m))});$('#scene-title').textContent=lesson().title;$('#location').textContent=lesson().location;$('#duration').textContent=clock(lesson().steps.length*stepDuration);$('#step-buttons').innerHTML=lesson().steps.map((s,i)=>`<button data-step="${i}" title="${s.title}">${String(i+1).padStart(2,'0')} ${s.title.split('：')[0].split('，')[0]}</button>`).join('');draw();updateText();}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#play').addEventListener('click',()=>{if(progress>=1){progress=0;lastStep=-1;draw()}setPlaying(!playing)});
$('#restart').addEventListener('click',()=>jump(0));$('#prev').addEventListener('click',()=>jump(index()-1));$('#next').addEventListener('click',()=>jump(index()+1));
$('#step-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)jump(Number(b.dataset.step))});
$('#progress').addEventListener('input',e=>{setPlaying(false);progress=Number(e.target.value);draw()});
$('#speed').addEventListener('change',e=>{speed=Number(e.target.value)});
$$('[data-text]').forEach(b=>b.addEventListener('click',()=>{textLevel=Number(b.dataset.text);$$('[data-text]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b))});updateText()}));
const depthNotes=['只保留主要構造與關係；暫隱藏 H⁺ 濃度差標示、分子數及補充標籤。','顯示課本重要機制：電子、H⁺ 與能量路線分開呈現。','加入教材補充：P680／P700、光能捕獲與反應中心、循環分子數及碳數追蹤。'];
$$('[data-depth]').forEach(b=>b.addEventListener('click',()=>{depth=Number(b.dataset.depth);$$('[data-depth]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b))});$('#depth-note').textContent=depthNotes[depth];draw()}));
function choose(e){let g=e.target.closest('[data-object]');if(!g)return;selected=g.dataset.object;highlight();updateText();if($('.learning-grid').classList.contains('collapsed'))togglePanel();}
$('#diagram').addEventListener('click',choose);$('#diagram').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(e)}});
function togglePanel(){const hidden=$('.learning-grid').classList.toggle('collapsed');$('#panel-toggle').textContent=hidden?'展開解說 ⇤':'收合解說 ⇥';$('#panel-toggle').setAttribute('aria-expanded',String(!hidden))}
$('#panel-toggle').addEventListener('click',togglePanel);
function setZoom(v){zoom=Math.max(1,Math.min(2,v));$('#diagram').style.width=`${zoom*100}%`;$('#zoom-reset').textContent=`${Math.round(zoom*100)}%`}
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+.25));$('#zoom-out').addEventListener('click',()=>setZoom(zoom-.25));$('#zoom-reset').addEventListener('click',()=>setZoom(1));
$('#locate').addEventListener('click',()=>{highlight();const g=$$('[data-object]').find(g=>g.dataset.object===selected);g?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});$('#diagram').classList.add('pulse');setTimeout(()=>$('#diagram').classList.remove('pulse'),1000)});
$('#source-open').addEventListener('click',()=>$('#sources').showModal());$('#source-close').addEventListener('click',()=>$('#sources').close());
// 行動裝置也能直接開啟來源，不依賴收合的章節側欄。
const mobileSource=document.createElement('button');mobileSource.textContent='教材來源與查核 ↗';mobileSource.className='mobile-source';mobileSource.addEventListener('click',()=>$('#sources').showModal());$('footer').before(mobileSource);
document.addEventListener('visibilitychange',()=>{if(document.hidden)setPlaying(false)});
function frame(time){if(playing){if(lastTime){progress=advance(progress,Math.min(.1,(time-lastTime)/1000),speed,lesson().steps.length,stepDuration);draw();if(progress>=1)setPlaying(false)}lastTime=time}requestAnimationFrame(frame)}
setMode('light');$('#depth-note').textContent=depthNotes[depth];requestAnimationFrame(frame);
