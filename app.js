window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");
        main(ctx); 
}
resizeCanvas();

function main(ctx) {

    let fireworkPackages = [];
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function reOffset(){
        var BB=canvas.getBoundingClientRect();
        offsetX=BB.left;
        offsetY=BB.top;        
    }

    var offsetX,offsetY;
    reOffset();
    window.onscroll=function(e){ reOffset(); }
    window.onresize=function(e){ reOffset(); }
    
    // animating vars
    var pct=101;
    var startX,startY,endX,endY,dx,dy;
    
    // canvas styles
    ctx.strokeStyle='skyblue';
    ctx.fillStyle='blue';
    
    window.onmousedown=(function(e){handleMouseDown(e);});
    window.onmouseup=(function(e){handleMouseUp(e);});
    //addFireworkPackages(10);
    
    // constantly running loop
    // will animate bullet 
    function animate(time){
        // return if there's no bullet to animate
        //if(++fireworkPackageTest.pct>100){requestAnimationFrame(animate);return;}
        // update
        // draw
        ctx.clearRect(0,0,cw,ch);
        moveFireworkPackages()
        // request another animation loop
        requestAnimationFrame(animate);
    }
    
    function handleMouseDown(e){
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      // save ending position
      console.log(e.clientX, e.clientY)
      startX=parseInt(e.clientX-offsetX);
      startY=parseInt(e.clientY-offsetY);
      // set flag
      createFireworkPackage(fireworkPackages.length, startX, startY);
      pct=101;
    }
    
    function handleMouseUp(e){
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      // save ending position and vector
      endX=parseInt(e.clientX-offsetX);
      endY=parseInt(e.clientY-offsetY);
      dx=endX-startX;
      dy=endY-startY;
      // set pct=0 to start animating
      pct=0;
    }

    function drawFirework(firework) {
        ctx.beginPath();
        ctx.rect(firework.currentPoint.x, firework.currentPoint.y, firework.width, firework.height);
        ctx.fill()
    }

    function moveFirework(firework, startPoint, pct) {
        firework.currentPoint.x = startPoint.x + firework.path.dx*pct/100;
        firework.currentPoint.y = startPoint.y + firework.path.dy*pct/100;
    }

    function createFirework(id, startPoint) {
        return {
            id,
            width: 3,
            height: 3,
            velocityX: 0.2,
            velocityY: 0.2,
            path: {dx: 0, dy: 0},
            currentPoint: Object.assign({}, startPoint),
            finishPoint: getPoint(Math.floor(Math.random() * 140) + 50, Math.floor(Math.random() * 360), startPoint)
        }
    }
    
    function createFireworkPackage(id, x, y) {
        const fireworkPackage = {
            id : id,
            fireworks : [],
            fireworksAmount: Math.floor(Math.random() * 40) + 10,
            startPoint: { x : x, y: y},
            pct: 1
        }
        addFireworks(fireworkPackage);
        fireworkPackages.push(fireworkPackage);
        return fireworkPackage;
    }

    function addFireworkPackages(amount) {
        for (var i = 0; i < amount; i++) { 
            createFireworkPackage(i);
        }
    }

    function addFireworks(fireworkPackage) {
        for (let i = 0; i < fireworkPackage.fireworksAmount; i++) {
            const firework = createFirework(i, fireworkPackage.startPoint);
            firework.velocityX = firework.currentPoint.x > firework.finishPoint.x ? -0.2 : 0.2,
            firework.path.dx = firework.finishPoint.x - fireworkPackage.startPoint.x
            firework.path.dy = firework.finishPoint.y - fireworkPackage.startPoint.y
            fireworkPackage.fireworks.push(firework);
            drawFirework(firework);
        }
        return fireworkPackage;
    }

    function moveFireworkPackages() {
        fireworkPackages = fireworkPackages.filter(package => package.pct <= 100);
        fireworkPackages.forEach(package => {
            changeFireworks(package);
        })
    }

    function changeFireworks(fireworkPackage) {
        fireworkPackage.pct++;
        fireworkPackage.fireworks.forEach(firework => {
            moveFirework(firework, fireworkPackage.startPoint, fireworkPackage.pct);
            drawFirework(firework);
        });
    }

    function getPoint(radius, angle, startPoint) {
        const x =  (radius * Math.cos(angle)) + startPoint.x;
        const y =  (radius * Math.sin(angle)) + startPoint.y;
        return { x, y };
    }
    
    requestAnimationFrame(animate);
}
