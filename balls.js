(function(){
'use strict';
function rand(a,b){return a+Math.random()*(b-a);}
function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}
var bgCanvas=document.getElementById('bg-canvas');
if(!bgCanvas)return;
var ctx=bgCanvas.getContext('2d');
var W=0,H=0;
function resize(){
W=bgCanvas.width=window.innerWidth;
H=bgCanvas.height=window.innerHeight;
window._bgRectDirty=true;
}
resize();
window.addEventListener('resize',resize);
var BALL_R=28;
var HUB_R=34;
var RECT_PAD=22;
var contentRect=null;
function refreshContentRect(){
var el=document.querySelector('.slide.active .slide-inner');
if(!el){
contentRect=null;
window._bgRectDirty=false;
return;
}
var r=el.getBoundingClientRect();
contentRect={
x:r.left-RECT_PAD,
y:r.top-RECT_PAD,
right:r.right+RECT_PAD,
bottom:r.bottom+RECT_PAD,
w:r.width+RECT_PAD*2,
h:r.height+RECT_PAD*2
};
window._bgRectDirty=false;
}
window._bgRectDirty=true;
setTimeout(refreshContentRect,200);
window.addEventListener('resize',function(){window._bgRectDirty=true;});
var CATEGORIES=[
{id:'ml',label:'ML',color:'#8b5cf6',rgb:'139,92,246',nodes:['Neural Networks','Decision Trees','Linear Regression','Logistic Regression','Kaggle','Data Cleaning']},
{id:'cloud',label:'Cloud',color:'#0ea5e9',rgb:'14,165,233',nodes:['AWS','Google Cloud','Docker','Kubernetes','CI/CD','GitHub Actions','Linux','Jenkins']},
{id:'backend',label:'Backend',color:'#10b981',rgb:'16,185,129',nodes:['C#','Java','Python','C++','Node.js','Flask','REST APIs','SQL','Entity Framework','PowerShell']},
{id:'frontend',label:'Frontend',color:'#f59e0b',rgb:'245,158,11',nodes:['JavaScript','React','Angular','Svelte','Three.js','HTML/CSS','Bootstrap','jQuery']},
{id:'industrial',label:'Industrial',color:'#ef4444',rgb:'239,68,68',nodes:['PI System','OPC','SCADA']}
];
var INTRA_LINKS=[
['Python','Flask'],['Python','scikit-learn'],['Python','Pandas'],
['AWS','CI/CD'],['Azure','CI/CD'],['Docker','Kubernetes'],['Docker','CI/CD'],
['GH Actions','CI/CD'],['JavaScript','React'],['JavaScript','Angular'],
['Node.js','REST APIs'],['Flask','REST APIs'],['.NET','C#'],
['PI System','PI AF'],['PI System','PI Archive'],['PI System','AVEVA'],
['SQL','SQL Server'],['SQL Server','Entity FW'],['Pandas','SQL'],
['Three.JS','JavaScript'],['Git','GH Actions'],['JavaScript','Node.js']
];
var allNodes=[];
var nodeMap={};
var intraEdges=[];
var crossEdges=[];
var dragNode=null;
var dragTX=0;
var dragTY=0;


function buildGraph(){
allNodes=[];
nodeMap={};
intraEdges=[];
crossEdges=[];
var cornerPositions=[
{x:0.14,y:0.16},
{x:0.86,y:0.16},
{x:0.14,y:0.84},
{x:0.86,y:0.84},
{x:0.18,y:0.50},
{x:0.82,y:0.50}
];
var placed=[];

function fits(x,y,r,gap){
for(var i=0;i<placed.length;i++){
var p=placed[i];
var dx=x-p.x;
var dy=y-p.y;
if(Math.sqrt(dx*dx+dy*dy)<r+p.r+gap)return false;
}
return true;
}

CATEGORIES.forEach(function(cat,catIndex){
var corner=cornerPositions[catIndex%cornerPositions.length];
var targetX=W*corner.x;
var targetY=H*corner.y;
var bx=targetX;
var by=targetY;
var tries=0;

while(!fits(bx,by,HUB_R,70)&&tries<500){
var spread=35+tries*0.35;
bx=clamp(targetX+rand(-spread,spread),HUB_R+25,W-HUB_R-25);
by=clamp(targetY+rand(-spread,spread),HUB_R+25,H-HUB_R-25);
tries++;
}

var hub={
id:cat.id+'*hub',
label:cat.label,
x:bx,
y:by,
vx:rand(-0.035,0.035),
vy:rand(-0.035,0.035),
r:HUB_R,
color:cat.color,
rgb:cat.rgb,
isHub:true,
cat:cat.id,
phase:Math.random()*Math.PI*2,
ds:rand(0.00010,0.00020),
pinned:false
};

placed.push({x:bx,y:by,r:HUB_R});
allNodes.push(hub);

cat.nodes.forEach(function(label,ni){
var nr=BALL_R;
var nx;
var ny;
var tr=0;

do{
var angle=Math.random()*Math.PI*2;
var distance=rand(55,145);
nx=clamp(
bx+Math.cos(angle)*distance,
nr+18,
W-nr-18
);
ny=clamp(
by+Math.sin(angle)*distance,
nr+18,
H-nr-18
);
tr++;
}while(!fits(nx,ny,nr,8)&&tr<700);

var node={
id:cat.id+'*'+ni,
label:label,
x:nx,
y:ny,
vx:rand(-0.05,0.05),
vy:rand(-0.05,0.05),
r:nr,
color:cat.color,
rgb:cat.rgb,
isHub:false,
cat:cat.id,
phase:Math.random()*Math.PI*2,
ds:rand(0.00008,0.00018),
pinned:false,
hub:hub
};

placed.push({x:nx,y:ny,r:nr});
allNodes.push(node);
nodeMap[label]=node;
intraEdges.push({from:hub,to:node});
});
});

INTRA_LINKS.forEach(function(pair){
var a=nodeMap[pair[0]];
var b=nodeMap[pair[1]];
if(!a||!b)return;
if(a.cat===b.cat){
intraEdges.push({from:a,to:b});
}else{
crossEdges.push({from:a,to:b});
}
});
}

buildGraph();
function nodeAt(x,y){
for(var i=allNodes.length-1;i>=0;i--){
var n=allNodes[i];
var dx=x-n.x;
var dy=y-n.y;
if(dx*dx+dy*dy<(n.r+5)*(n.r+5))return n;
}
return null;
}
function startDrag(x,y){
var n=nodeAt(x,y);
if(!n)return false;
dragNode=n;
dragTX=n.x;
dragTY=n.y;
n.pinned=true;
return true;
}
function moveDrag(x,y){
if(!dragNode)return;
dragTX=x;
dragTY=y;
}
function endDrag(){
if(!dragNode)return;
dragNode.vx*=0.3;
dragNode.vy*=0.3;
dragNode.pinned=false;
dragNode=null;
}
bgCanvas.addEventListener('mousedown',function(e){
if(startDrag(e.clientX,e.clientY))e.preventDefault();
});
bgCanvas.addEventListener('mousemove',function(e){
moveDrag(e.clientX,e.clientY);
});
bgCanvas.addEventListener('mouseup',endDrag);
bgCanvas.addEventListener('mouseleave',endDrag);
bgCanvas.addEventListener('touchstart',function(e){
var t=e.touches[0];
if(startDrag(t.clientX,t.clientY))e.preventDefault();
},{passive:false});
bgCanvas.addEventListener('touchmove',function(e){
if(!dragNode)return;
e.preventDefault();
var t=e.touches[0];
moveDrag(t.clientX,t.clientY);
},{passive:false});
bgCanvas.addEventListener('touchend',endDrag);
function applyEdgeSprings(){
for(var i=0;i<intraEdges.length;i++){
var e=intraEdges[i];
var a=e.from;
var b=e.to;
var dx=b.x-a.x;
var dy=b.y-a.y;
var d=Math.sqrt(dx*dx+dy*dy);
if(d<1)continue;
var target=a.isHub||b.isHub?155:200;
var f=(d-target)*0.00026;
var fx=dx/d*f;
var fy=dy/d*f;
if(!a.pinned){
a.vx+=fx;
a.vy+=fy;
}
if(!b.pinned){
b.vx-=fx;
b.vy-=fy;
}
}
}
var PULL_RANGE=220;
var PULL_STR=0.022;
function applyDragPull(){
if(!dragNode)return;
for(var i=0;i<allNodes.length;i++){
var n=allNodes[i];
if(n===dragNode||n.pinned||n.cat!==dragNode.cat)continue;
var dx=dragNode.x-n.x;
var dy=dragNode.y-n.y;
var d=Math.sqrt(dx*dx+dy*dy);
if(d<1||d>PULL_RANGE)continue;
var t=1-d/PULL_RANGE;
var f=t*t*PULL_STR;
n.vx+=dx*f;
n.vy+=dy*f;
}
}
function bounceRect(node){
if(!contentRect)return;
var x=node.x;
var y=node.y;
var r=node.r;
var rx=contentRect.x;
var ry=contentRect.y;
var rr=contentRect.right;
var rb=contentRect.bottom;
if(x>rx&&x<rr&&y>ry&&y<rb){
var dLeft=x-rx;
var dRight=rr-x;
var dTop=y-ry;
var dBottom=rb-y;
var minD=Math.min(dLeft,dRight,dTop,dBottom);
if(minD===dLeft){
node.x=rx-r;
node.vx=-Math.abs(node.vx)*0.55;
}else if(minD===dRight){
node.x=rr+r;
node.vx=Math.abs(node.vx)*0.55;
}else if(minD===dTop){
node.y=ry-r;
node.vy=-Math.abs(node.vy)*0.55;
}else{
node.y=rb+r;
node.vy=Math.abs(node.vy)*0.55;
}
return;
}
var nx=clamp(x,rx,rr);
var ny=clamp(y,ry,rb);
var dx=x-nx;
var dy=y-ny;
var dist=Math.sqrt(dx*dx+dy*dy);
if(dist<r&&dist>0){
var inv=1/dist;
var ox=dx*inv;
var oy=dy*inv;
var ov=r-dist;
node.x+=ox*(ov+1.5);
node.y+=oy*(ov+1.5);
var dot=node.vx*ox+node.vy*oy;
node.vx=(node.vx-2*dot*ox)*0.52;
node.vy=(node.vy-2*dot*oy)*0.52;
}
}
function hexRgb(hex){
return{
r:parseInt(hex.slice(1,3),16),
g:parseInt(hex.slice(3,5),16),
b:parseInt(hex.slice(5,7),16)
};
}
function drawEdge(a,b,alpha,lw,dash,gap){
var dx=b.x-a.x;
var dy=b.y-a.y;
var dist=Math.sqrt(dx*dx+dy*dy);
if(dist<1)return;
var ux=dx/dist;
var uy=dy/dist;
var sx=a.x+ux*a.r;
var sy=a.y+uy*a.r;
var ex=b.x-ux*b.r;
var ey=b.y-uy*b.r;
var px=-uy;
var py=ux;
var bend=Math.sin((a.phase||0)+(b.phase||0))*Math.min(16,dist*0.05);
var mx=(sx+ex)*0.5;
var my=(sy+ey)*0.5;
ctx.save();
ctx.beginPath();
ctx.moveTo(sx,sy);
ctx.quadraticCurveTo(mx+px*bend,my+py*bend,ex,ey);
ctx.strokeStyle='rgba('+a.rgb+','+alpha+')';
ctx.lineWidth=lw;
if(dash)ctx.setLineDash([dash,gap||dash*1.5]);
ctx.stroke();
ctx.setLineDash([]);
ctx.restore();
}

function drawBall(node){
var x=node.x;
var y=node.y;
var r=node.r;
ctx.save();
ctx.beginPath();
ctx.arc(x,y,r,0,Math.PI*2);
ctx.fillStyle=node.color;
ctx.fill();
ctx.restore();
}





bgCanvas.addEventListener('mousemove',function(e){
var n=nodeAt(e.clientX,e.clientY);
if(dragNode){
bgCanvas.style.cursor='grabbing';
moveDrag(e.clientX,e.clientY);
}else{
bgCanvas.style.cursor=n?'grab':'default';
}
});

bgCanvas.addEventListener('mousedown',function(e){
if(startDrag(e.clientX,e.clientY)){
bgCanvas.style.cursor='grabbing';
e.preventDefault();
}
});

bgCanvas.addEventListener('mouseup',function(){
endDrag();
bgCanvas.style.cursor='default';
});

bgCanvas.addEventListener('mouseleave',function(){
endDrag();
bgCanvas.style.cursor='default';
});





function drawBallText(node){
var x=node.x;
var y=node.y;
var r=node.r;
ctx.save();
ctx.beginPath();
ctx.arc(x,y,r*0.84,0,Math.PI*2);
ctx.clip();
ctx.textAlign='center';
ctx.textBaseline='middle';
var maxW=r*1.5;
var maxH=r;
var fontSize=node.isHub?11.5:10.5;
var minFont=7.5;
function splitLines(text,mw){
var words=text.split(/\s+/);
if(words.length===1)return[text];
for(var s=1;s<words.length;s++){
var a=words.slice(0,s).join(' ');
var b=words.slice(s).join(' ');
if(Math.max(ctx.measureText(a).width,ctx.measureText(b).width)<=mw)return[a,b];
}
return[text];
}
var lines;
var lineH;
while(fontSize>=minFont){
ctx.font=(node.isHub?'700':'600')+' '+fontSize+'px "Inter","Segoe UI",sans-serif';
lines=splitLines(node.label,maxW);
lineH=fontSize*1.22;
var ww=0;
for(var i=0;i<lines.length;i++)ww=Math.max(ww,ctx.measureText(lines[i]).width);
if(ww<=maxW&&lines.length*lineH<=maxH)break;
fontSize-=0.5;
}
var bw=0;
for(var j=0;j<lines.length;j++)bw=Math.max(bw,ctx.measureText(lines[j]).width);
var bh=lines.length*lineH;
var px=5;
var py=3;
var br=Math.min(bh*0.38,5);
ctx.beginPath();
if(ctx.roundRect)ctx.roundRect(x-bw/2-px,y-bh/2-py,bw+px*2,bh+py*2,br);
else ctx.rect(x-bw/2-px,y-bh/2-py,bw+px*2,bh+py*2);
ctx.fillStyle='rgba(0,0,0,0.38)';
ctx.fill();
var startY=y-(lines.length-1)*lineH/2;
ctx.shadowColor='rgba(0,0,0,0.7)';
ctx.shadowBlur=3;
ctx.shadowOffsetY=1;
ctx.fillStyle='#fff';
for(var k=0;k<lines.length;k++)ctx.fillText(lines[k],x,startY+k*lineH);
ctx.shadowBlur=0;
ctx.restore();
}
function drawContentBorder(){
if(!contentRect)return;
ctx.save();
ctx.beginPath();
var r=16;
var x=contentRect.x;
var y=contentRect.y;
var w=contentRect.w;
var h=contentRect.h;
ctx.moveTo(x+r,y);
ctx.arcTo(x+w,y,x+w,y+h,r);
ctx.arcTo(x+w,y+h,x,y+h,r);
ctx.arcTo(x,y+h,x,y,r);
ctx.arcTo(x,y,x+w,y,r);
ctx.closePath();
ctx.setLineDash([8,6]);
ctx.strokeStyle='rgba(108,99,255,0.22)';
ctx.lineWidth=1.2;
ctx.stroke();
ctx.setLineDash([]);
ctx.restore();
}
var time=0;
var frameCount=0;
function tick(){
requestAnimationFrame(tick);
time+=16;
frameCount++;
var t=time*0.001;
if(window._bgRectDirty&&frameCount%8===0)refreshContentRect();
ctx.clearRect(0,0,W,H);
if(dragNode){
var ddx=dragTX-dragNode.x;
var ddy=dragTY-dragNode.y;
dragNode.x+=ddx*0.24;
dragNode.y+=ddy*0.24;
dragNode.vx=ddx*0.24;
dragNode.vy=ddy*0.24;
}
applyEdgeSprings();
applyDragPull();
for(var ni=0;ni<allNodes.length;ni++){
var n=allNodes[ni];
if(n.pinned)continue;
n.vx+=Math.sin(t*n.ds*1000+n.phase)*0.002;
n.vy+=Math.cos(t*n.ds*820+n.phase*1.35)*0.0016;
n.vx*=0.975;
n.vy*=0.975;
var spd=Math.sqrt(n.vx*n.vx+n.vy*n.vy);
if(spd>1){
n.vx/=spd;
n.vy/=spd;
}
n.x+=n.vx;
n.y+=n.vy;
var mg=n.r+18;
if(n.x<mg){
n.x=mg;
n.vx=Math.abs(n.vx)*0.48;
}
if(n.x>W-mg){
n.x=W-mg;
n.vx=-Math.abs(n.vx)*0.48;
}
if(n.y<mg){
n.y=mg;
n.vy=Math.abs(n.vy)*0.48;
}
if(n.y>H-mg){
n.y=H-mg;
n.vy=-Math.abs(n.vy)*0.48;
}
bounceRect(n);
}
for(var ai=0;ai<allNodes.length-1;ai++){
for(var bi=ai+1;bi<allNodes.length;bi++){
var a=allNodes[ai];
var b=allNodes[bi];
if(a.pinned&&b.pinned)continue;
var dx=b.x-a.x;
var dy=b.y-a.y;
var d=Math.sqrt(dx*dx+dy*dy);
var ms=a.r+b.r+8;
if(d<ms&&d>0){
var ov=(ms-d)/d*0.5;
var fx=dx*ov;
var fy=dy*ov;
if(!a.pinned){
a.x-=fx;
a.y-=fy;
a.vx-=fx*0.05;
a.vy-=fy*0.05;
}
if(!b.pinned){
b.x+=fx;
b.y+=fy;
b.vx+=fx*0.05;
b.vy+=fy*0.05;
}
}
}
}
drawContentBorder();
for(var ei=0;ei<intraEdges.length;ei++){
var e=intraEdges[ei];
drawEdge(e.from,e.to,0.22,1);
}
for(var ci=0;ci<crossEdges.length;ci++){
var ce=crossEdges[ci];
drawEdge(ce.from,ce.to,0.07,0.7,4,7);
}
for(var di=0;di<allNodes.length;di++)drawBall(allNodes[di]);
for(var ti=0;ti<allNodes.length;ti++)drawBallText(allNodes[ti]);
}
tick();






})();