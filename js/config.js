/* MBTIの個性はこのファイルだけで調整できます。エンジンは値を汎用的に解釈します。 */
window.MBTI_CONFIG = {
  ESTJ: { label:'統率する突撃者', color:'#ef684c', hp:110, attack:18, defense:8, rotationSpeed:1.6, speed:100, weight:1.2, radius:24, shape:'star', movementType:'steady', aggression:.9 },
  ISTJ: { label:'揺るがない守護者', color:'#355e52', hp:145, attack:9, defense:15, rotationSpeed:.5, speed:55, weight:1.8, radius:25, shape:'shield', movementType:'steady', aggression:.35 },
  ESTP: { label:'瞬発のチャレンジャー', color:'#f5b83b', hp:90, attack:16, defense:5, rotationSpeed:2.5, speed:155, weight:.9, radius:23, shape:'spike', movementType:'charger', aggression:1 },
  ENTP: { label:'予測不能な発明家', color:'#8d6bd1', hp:95, attack:13, defense:6, rotationSpeed:3, speed:125, weight:1, radius:23, shape:'burst', movementType:'erratic', aggression:.72 },
  ESFP: { label:'自由なムードメーカー', color:'#ef6da1', hp:82, attack:11, defense:4, rotationSpeed:2.2, speed:145, weight:.65, radius:22, shape:'diamond', movementType:'wander', aggression:.58 },
  INFP: { label:'静かな理想主義者', color:'#55a6a4', hp:105, attack:7, defense:8, rotationSpeed:1.1, speed:108, weight:.8, radius:19, shape:'soft', movementType:'avoid', aggression:.15 }
};
window.GAME_CONFIG = { maxPerType:5, maxDelta:.025, baseCollisionDamage:10, arenaPadding:20, matchTimeLimit:75 };
