(function () {
  'use strict';
  const TAU = Math.PI * 2;
  class Battle {
    constructor(canvas, callbacks={}) {
      this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.callbacks=callbacks;
      this.pieces=[]; this.running=false; this.lastTime=0; this.elapsed=0; this.animationId=0;
      this.resize=()=>this.resizeCanvas(); window.addEventListener('resize',this.resize); this.resizeCanvas();
    }
    resizeCanvas(){ const r=this.canvas.parentElement.getBoundingClientRect(); const d=Math.min(devicePixelRatio||1,2); this.canvas.width=r.width*d;this.canvas.height=r.height*d;this.canvas.style.width=r.width+'px';this.canvas.style.height=r.height+'px';this.ctx.setTransform(d,0,0,d,0,0);this.width=r.width;this.height=r.height; }
    start(selection){ this.stop();this.resizeCanvas();this.pieces=[];this.elapsed=0; let i=0; Object.entries(selection).forEach(([type,count])=>{ for(let n=0;n<count;n++) this.pieces.push(this.createPiece(type,i++)); }); this.separateInitialPieces();this.running=true;this.lastTime=performance.now();this.callbacks.onStart?.();this.animationId=requestAnimationFrame(t=>this.loop(t)); }
    createPiece(type,index){ const c=MBTI_CONFIG[type], angle=Math.random()*TAU, r=Math.min(this.width,this.height)*(.12+Math.random()*.28); return { id:index,type,c,x:this.width/2+Math.cos(angle)*r,y:this.height/2+Math.sin(angle)*r,vx:Math.cos(angle+Math.PI)*(c.speed*.55),vy:Math.sin(angle+Math.PI)*(c.speed*.55),angle:Math.random()*TAU,hp:c.hp,maxHp:c.hp,turnTimer:Math.random()*.8,flash:0 }; }
    separateInitialPieces(){ for(let pass=0;pass<15;pass++) for(let i=0;i<this.pieces.length;i++) for(let j=i+1;j<this.pieces.length;j++){const a=this.pieces[i],b=this.pieces[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,min=a.c.radius+b.c.radius+4;if(d<min){const push=(min-d)/2,nx=dx/d,ny=dy/d;a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push;}} }
    stop(){this.running=false;cancelAnimationFrame(this.animationId);}
    loop(time){ if(!this.running)return;const dt=Math.min((time-this.lastTime)/1000,GAME_CONFIG.maxDelta);this.lastTime=time;this.elapsed+=dt;this.update(dt);this.draw();this.checkEnd();if(this.running)this.animationId=requestAnimationFrame(t=>this.loop(t)); }
    update(dt){ const alive=this.pieces.filter(p=>p.hp>0); alive.forEach(p=>{this.steer(p,alive,dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.c.rotationSpeed*dt;p.flash=Math.max(0,p.flash-dt*5);this.wallCollision(p);}); for(let i=0;i<alive.length;i++)for(let j=i+1;j<alive.length;j++)this.pieceCollision(alive[i],alive[j]); this.pieces=this.pieces.filter(p=>p.hp>0); }
    steer(p,all,dt){ const c=p.c, speed=Math.hypot(p.vx,p.vy)||1; let target=c.speed, turn=0;p.turnTimer-=dt;
      if(c.movementType==='erratic'&&p.turnTimer<=0){turn=(Math.random()-.5)*3.8;p.turnTimer=.16+Math.random()*.5;}
      if(c.movementType==='wander')turn=Math.sin(this.elapsed*2.1+p.id)*1.1;
      if(c.movementType==='charger'){const enemy=this.nearest(p,all);if(enemy)turn=this.angleDiff(Math.atan2(enemy.y-p.y,enemy.x-p.x),Math.atan2(p.vy,p.vx))*1.9;}
      if(c.movementType==='avoid'){const enemy=this.nearest(p,all);if(enemy){const d=Math.hypot(enemy.x-p.x,enemy.y-p.y);if(d<170)turn=this.angleDiff(Math.atan2(p.y-enemy.y,p.x-enemy.x),Math.atan2(p.vy,p.vx))*2.5;}}
      if(c.movementType==='steady')turn=this.angleDiff(Math.atan2(this.height/2-p.y,this.width/2-p.x),Math.atan2(p.vy,p.vx))*.25*c.aggression;
      const a=Math.atan2(p.vy,p.vx)+turn*dt;p.vx=Math.cos(a)*(speed+(target-speed)*dt*2);p.vy=Math.sin(a)*(speed+(target-speed)*dt*2);
    }
    nearest(p,all){let best=null,dist=Infinity;all.forEach(q=>{if(q===p||q.type===p.type)return;const d=(q.x-p.x)**2+(q.y-p.y)**2;if(d<dist){dist=d;best=q;}});return best;}
    angleDiff(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b));}
    wallCollision(p){const r=p.c.radius+GAME_CONFIG.arenaPadding;if(p.x<r){p.x=r;p.vx=Math.abs(p.vx)*.88;}if(p.x>this.width-r){p.x=this.width-r;p.vx=-Math.abs(p.vx)*.88;}if(p.y<r){p.y=r;p.vy=Math.abs(p.vy)*.88;}if(p.y>this.height-r){p.y=this.height-r;p.vy=-Math.abs(p.vy)*.88;}}
    pieceCollision(a,b){let dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||.01,min=a.c.radius+b.c.radius;if(dist>=min)return;const nx=dx/dist,ny=dy/dist,overlap=min-dist,total=a.c.weight+b.c.weight;a.x-=nx*overlap*(b.c.weight/total);a.y-=ny*overlap*(b.c.weight/total);b.x+=nx*overlap*(a.c.weight/total);b.y+=ny*overlap*(a.c.weight/total);const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const impulse=-(1.72)*rel/(1/a.c.weight+1/b.c.weight);a.vx-=impulse*nx/a.c.weight;a.vy-=impulse*ny/a.c.weight;b.vx+=impulse*nx/b.c.weight;b.vy+=impulse*ny/b.c.weight;const impact=Math.min(2,Math.abs(rel)/120);a.hp-=Math.max(1,b.c.attack-a.c.defense*.55)*impact*.42;b.hp-=Math.max(1,a.c.attack-b.c.defense*.55)*impact*.42;a.flash=b.flash=1;}}
    checkEnd(){const types=[...new Set(this.pieces.map(p=>p.type))];if(types.length<=1||this.elapsed>GAME_CONFIG.matchTimeLimit){if(types.length>1){const scores={};this.pieces.forEach(p=>scores[p.type]=(scores[p.type]||0)+p.hp/p.maxHp);types.sort((a,b)=>scores[b]-scores[a]);}this.stop();this.callbacks.onEnd?.(types[0]||null);}}
    draw(){const x=this.ctx;x.clearRect(0,0,this.width,this.height);this.pieces.forEach(p=>this.drawPiece(x,p));}
    path(ctx,shape,r){ctx.beginPath();if(shape==='soft'){ctx.arc(0,0,r,0,TAU);return;}const points=shape==='star'?10:shape==='spike'?12:shape==='burst'?14:shape==='diamond'?4:8;for(let i=0;i<points;i++){let rr=r;if(shape==='star')rr=i%2?r*.48:r;if(shape==='spike')rr=i%2?r*.58:r;if(shape==='burst')rr=i%2?r*(.4+(i%4)*.06):r;if(shape==='diamond')rr=i%2?r*.7:r;if(shape==='shield')rr=i%2?r*.88:r;const a=-Math.PI/2+i*TAU/points;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
    drawPiece(ctx,p){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.shadowColor='rgba(20,35,28,.2)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;this.path(ctx,p.c.shape,p.c.radius);ctx.fillStyle=p.flash?'#fff':p.c.color;ctx.fill();ctx.shadowColor='transparent';ctx.strokeStyle='#183027';ctx.lineWidth=1.5;ctx.stroke();ctx.rotate(-p.angle);ctx.fillStyle='#15231e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 8px Inter, sans-serif';ctx.fillText(p.type,0,0);ctx.restore();const w=p.c.radius*1.35;ctx.fillStyle='rgba(23,33,29,.14)';ctx.fillRect(p.x-w/2,p.y+p.c.radius+7,w,2);ctx.fillStyle='#274d3f';ctx.fillRect(p.x-w/2,p.y+p.c.radius+7,w*Math.max(0,p.hp/p.maxHp),2);}
  }
  window.Battle=Battle;
})();
