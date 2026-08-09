(function(){
'use strict';
var slides=Array.from(document.querySelectorAll('.slide'));
var dots=Array.from(document.querySelectorAll('.dot'));
var flipInner=document.getElementById('flip-inner');
var flipDigit=document.getElementById('current-page');
var totalPagesEl=document.getElementById('total-pages');
var nextBtn=document.getElementById('arrow-next');
var prevBtn=document.getElementById('arrow-prev');
var current=0;
var TOTAL=slides.length;
var animating=false;
var wheelLocked=false;
var touchStartX=0;
var touchStartY=0;
if(!TOTAL)return;
if(totalPagesEl)totalPagesEl.textContent=String(TOTAL).padStart(2,'0');
function clamp(v,lo,hi){
return Math.max(lo,Math.min(hi,v));
}
function updatePageNumber(index){
var number=String(index+1).padStart(2,'0');
if(flipDigit){
flipDigit.textContent=number;
return;
}
if(flipInner){
flipInner.innerHTML='';
var d=document.createElement('div');
d.className='flip-digit';
d.textContent=number;
flipInner.appendChild(d);
}
}
function resetSlide(slide){
gsap.killTweensOf(slide);
gsap.set(slide,{opacity:0,x:0,y:0,clearProps:'transform'});
slide.classList.remove('active');
}
function setActive(index){
slides.forEach(function(slide,i){
if(i!==index)resetSlide(slide);
});
slides[index].classList.add('active');
gsap.set(slides[index],{opacity:1,x:0,y:0});
}
function updateDots(index){
dots.forEach(function(dot,i){
dot.classList.toggle('active',i===index);
});
}
function goTo(index){
if(TOTAL<2)return;
index=clamp(index,0,TOTAL-1);
if(index===current)return;
var previous=current;
var direction=index>previous?1:-1;
current=index;
animating=true;
gsap.killTweensOf(slides[previous]);
gsap.killTweensOf(slides[index]);
slides.forEach(function(slide,i){
if(i!==previous&&i!==index)resetSlide(slide);
});
var prevSlide=slides[previous];
var nextSlide=slides[index];
nextSlide.classList.add('active');
gsap.set(nextSlide,{opacity:0,x:direction*34,y:0});
gsap.set(prevSlide,{opacity:1,x:0,y:0});
var tl=gsap.timeline({
defaults:{overwrite:true},
onComplete:function(){
resetSlide(prevSlide);
gsap.set(nextSlide,{opacity:1,x:0,y:0,clearProps:'transform'});
animating=false;
window._bgRectDirty=true;
}
});
tl.to(prevSlide,{
opacity:0,
x:-direction*20,
duration:0.18,
ease:'power2.in'
},0);
tl.to(nextSlide,{
opacity:1,
x:0,
duration:0.28,
ease:'power3.out'
},0);
updateDots(current);
updatePageNumber(current);
}
function navigate(step){
if(animating)return;
goTo(current+step);
}
if(nextBtn){
nextBtn.addEventListener('click',function(e){
e.preventDefault();
navigate(1);
});
}
if(prevBtn){
prevBtn.addEventListener('click',function(e){
e.preventDefault();
navigate(-1);
});
}
dots.forEach(function(dot){
dot.addEventListener('click',function(e){
e.preventDefault();
var index=parseInt(dot.dataset.index,10);
if(!Number.isNaN(index)&&!animating)goTo(index);
});
});
window.addEventListener('wheel',function(e){
if(Math.abs(e.deltaY)<8||wheelLocked||animating)return;
wheelLocked=true;
navigate(e.deltaY>0?1:-1);
setTimeout(function(){
wheelLocked=false;
},280);
},{passive:true});
window.addEventListener('touchstart',function(e){
if(!e.touches.length)return;
touchStartX=e.touches[0].clientX;
touchStartY=e.touches[0].clientY;
},{passive:true});
window.addEventListener('touchend',function(e){
if(!e.changedTouches.length||animating)return;
var dx=touchStartX-e.changedTouches[0].clientX;
var dy=touchStartY-e.changedTouches[0].clientY;
if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){
navigate(dx>0?1:-1);
}
else if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)){
navigate(dy>0?1:-1);
}
},{passive:true});
window.addEventListener('keydown',function(e){
if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown'){
e.preventDefault();
navigate(1);
}
else if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){
e.preventDefault();
navigate(-1);
}
else if(e.key==='Home'){
e.preventDefault();
goTo(0);
}
else if(e.key==='End'){
e.preventDefault();
goTo(TOTAL-1);
}
});
setActive(0);
updateDots(0);
updatePageNumber(0);
})();


(function(){
'use strict';
var el=document.getElementById('typed-role');
if(!el)return;
var roles=['Software Developer','Cloud & DevOps','Machine Learning','Web Developer'];
var roleIndex=0;
var charIndex=0;
var deleting=false;
function type(){
var role=roles[roleIndex];
el.textContent=role.substring(0,charIndex);
if(!deleting){
charIndex++;
if(charIndex>role.length){
deleting=true;
setTimeout(type,1400);
return;
}
setTimeout(type,70);
}else{
charIndex--;
if(charIndex<0){
charIndex=0;
deleting=false;
roleIndex=(roleIndex+1)%roles.length;
setTimeout(type,350);
return;
}
setTimeout(type,35);
}
}
type();
})();