// 在 SVG 座標中保護文字的實際邊界，不隨瀏覽器縮放改變安全間距。
const cache=new Map();
export const LABEL_GAP=4;
export function invalidateClearance(){cache.clear()}
export function protectLabels(svg,key){
 if(!svg)return;
 let boxes=cache.get(key);
 if(!boxes){
  boxes=[...svg.querySelectorAll('[data-layer="diagram"] text')].filter(el=>el.textContent.trim()).map(el=>{
   const b=el.getBBox();return {x:b.x-LABEL_GAP,y:b.y-LABEL_GAP,width:b.width+2*LABEL_GAP,height:b.height+2*LABEL_GAP};
  });
  cache.set(key,boxes);
 }
 svg.querySelector('[data-clearance-holes]').innerHTML=boxes.map(b=>`<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="black"/>`).join('');
}
