document.addEventListener('DOMContentLoaded',()=>{
  const ui=new GameUI();
  const battle=new Battle(document.querySelector('#battle-canvas'),{onStart:()=>ui.battleStarted(),onEnd:type=>ui.battleEnded(type)});
  ui.bindStart(selection=>battle.start(selection));
  ui.bindReset(()=>{battle.stop();battle.ctx.clearRect(0,0,battle.width,battle.height);ui.resetView();});
});
