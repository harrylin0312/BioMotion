import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,objects} from '../dist/content.js';
import {renderScene} from '../dist/scenes.js';
import {frameAt,advance} from '../dist/timeline.js';

test('seeking backward reconstructs exactly the same animation state',()=>{
  for (const [mode,lesson] of Object.entries(lessons)) {
    const frame=p=>{const f=frameAt(p,lesson.steps.length);return renderScene(mode,f.step,f.phase,2)};
    const before=frame(.23); frame(.95);assert.equal(frame(.23),before);
    assert.notEqual(frame(.23),frame(.24));
  }
});
test('timeline endpoints and speed remain bounded and coherent',()=>{
  assert.deepEqual(frameAt(1,7),{progress:1,step:6,phase:1});
  assert.deepEqual(frameAt(-.2,7),{progress:0,step:0,phase:0});
  assert.equal(frameAt(3/7,7).step,3);
  assert.equal(advance(0,3,2,7),advance(0,6,1,7));
  assert.equal(advance(.99,5,2,7),1);
});
test('every lesson step has three source-bounded text versions and a visible target at all depths',()=>{
  for(const [mode,lesson] of Object.entries(lessons)) for (const [i,s] of lesson.steps.entries()) {
    assert.ok(lesson.source);assert.equal(s.text.length,3);s.text.forEach(t=>assert.ok(t.length>10));
    assert.ok(objects[s.object]);
    for(const depth of [0,1,2]) for(const phase of [0,.5,1]){
      const svg=renderScene(mode,i,phase,depth);
      assert.ok(svg.includes(`data-object="${s.object}"`),`${mode}/${i}/${depth}: selected object must be visible`);
      assert.ok(!/NaN|undefined/.test(svg));
      for(const [,id] of svg.matchAll(/data-object="(.*?)"/g)) assert.ok(objects[id],id);
    }
  }
});
test('Calvin-cycle diagram retains the textbook carbon split and ATP totals',()=>{
  const svg=renderScene('calvin',2,.5,2);
  for(const label of ['3 CO₂','3 × RuBP','6 × PGA','6 × G3P','5 × G3P','1 G3P 淨輸出','6 ATP + 6 NADPH','3 ATP','18 C = 3 C 輸出 + 15 C 留下'])assert.ok(svg.includes(label),label);
  const simple=renderScene('calvin',2,.5,0);
  assert.ok(!simple.includes('6 × PGA'));
});
