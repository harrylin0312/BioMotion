// 唯一的播放狀態是 progress；倒退、跳轉與播放都由它推導畫面。
export function frameAt(progress, count) {
  const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));
  const position=p*count;
  return {progress:p,step:Math.min(count-1,Math.floor(position)),phase:p===1?1:position%1};
}
export function advance(progress, seconds, speed, count, secondsPerStep=6) {
  return Math.max(0,Math.min(1,progress+Math.max(0,seconds)*speed/(count*secondsPerStep)));
}
