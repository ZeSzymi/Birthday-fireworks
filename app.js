let startShow = false;
window.addEventListener('resize', resizeCanvas, false);
document.getElementById('start').addEventListener('click', function() { 
    this.style.opacity = '0';
    startShow = true; 
    setTimeout(() => this.remove(), 1000);
    setTimeout(() => document.getElementById('birthday').style.opacity = '1', 1000);
}, false);

function resizeCanvas() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");
        main(ctx); 
}

resizeCanvas();

function main(ctx) {

    let fireworkPackages = [];
    let time = 0;
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
    createStartingFireworkPackages(50);
    
    window.onmousedown=(function(e){handleMouseDown(e);});
    window.onmouseup=(function(e){handleMouseUp(e);});

    function animate(time){
        if (startShow) {
            ctx.clearRect(0,0,cw,ch);
            addEveryXTic(40);
            moveFireworkPackages()
        }
        requestAnimationFrame(animate);
    }

    function addEveryXTic(x) {
        if (time > x) {
            createFireworkPackage(fireworkPackages.length, Math.floor(Math.random() * cw - 200) + 200, Math.floor(Math.random() * (ch - 400)), 1.5)
            time = 0;
        } else  {
            time++;
        }
    }

    function createStartingFireworkPackages(amount) {
        for (var i = 0; i < amount; i++) {
            createFireworkPackage(fireworkPackages.length, Math.floor(Math.random() * cw - 200) + 200, Math.floor(Math.random() * (ch - 400)), 1)
        }
    }
    
    function handleMouseDown(e){
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      // save ending position
      startX=parseInt(e.clientX-offsetX);
      startY=parseInt(e.clientY-offsetY);
      // set flag
      createFireworkPackage(fireworkPackages.length, startX, startY, 1.5);
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

    }

    function drawFirework(firework) {
        ctx.beginPath();
        ctx.rect(firework.currentPoint.x, firework.currentPoint.y, firework.width, firework.height);
        ctx.fillStyle = `#${firework.color}`;
        ctx.fill()
    }

    function moveFirework(firework, startPoint, pct) {
        const coords = getXY(startPoint.x, firework.path.dx, startPoint.y, firework.path.dy, pct)
        firework.currentPoint.x = coords.x
        firework.currentPoint.y = coords.y;
    }

    function moveFireworkPackages() {
        fireworkPackages = fireworkPackages.filter(package => package.pctFireworks <= 100);
        fireworkPackages.forEach(package => {
            if (!package.fireworksFired && package.pct > 100) {
                addFireworks(package);
                changeFireworks(package);
                const mySound = new sound(randomSound());
                mySound.play();
                package.fireworksFired = true;
            } else if (package.pct > 100) {
                changeFireworks(package);
            } else if (!package.packageFired){
                package.pct += package.velocity;
                moveFirework(package, package.startPoint, package.pct);
                drawFirework(package);
                package.packageFired = true;
            } else {
                package.pct += package.velocity;
                moveFirework(package, package.startPoint, package.pct);
                drawFirework(package);
            }
        })
    }

    function changeFireworks(fireworkPackage) {
        fireworkPackage.pctFireworks++;
        fireworkPackage.fireworks.forEach(firework => {
            moveFirework(firework, fireworkPackage.currentPoint, fireworkPackage.pctFireworks);
            drawFirework(firework);
        });
    }

    function getXY(startX, dx, startY, dy, percentage) {
        const x = startX + dx * percentage/100;
        const y = startY + dy * percentage/100;
        return { x, y }
    }

    function createFirework(id, startPoint, color) {
        return {
            id,
            width: 3,
            height: 3,
            velocity: 1,
            color: color,
            path: {dx: 0, dy: 0},
            currentPoint: Object.assign({}, startPoint),
            finishPoint: getPoint(Math.floor(Math.random() * 140) + 50, Math.floor(Math.random() * 360), startPoint)
        }
    }
    
    function createFireworkPackage(id, x, y, velocity) {
        const fireworkPackage = {
            id : id,
            fireworks : [],
            fireworksFired: false,
            packageFired: false,
            width: 5,
            height: 5,
            velocity: velocity,
            fireworksAmount: Math.floor(Math.random() * 100) + 50,
            finishPoint: { x: x, y: y},
            startPoint: { x : x, y: ch},
            currentPoint: { x : x, y: y},
            color: Math.floor(Math.random() * 16777215).toString(16),
            path: {dx: 0, dy: 0},
            pct: 1,
            pctFireworks: 1
        }
        fireworkPackage.path.dx = fireworkPackage.finishPoint.x - fireworkPackage.startPoint.x
        fireworkPackage.path.dy = fireworkPackage.finishPoint.y - fireworkPackage.startPoint.y
        addFireworks(fireworkPackage);
        fireworkPackages.push(fireworkPackage);
        return fireworkPackage;
    }

    function addFireworks(fireworkPackage) {
        const color = Math.floor(Math.random() * 16777215).toString(16);
        for (let i = 0; i < fireworkPackage.fireworksAmount; i++) {
            const firework = createFirework(i, fireworkPackage.currentPoint, color);
            firework.path.dx = firework.finishPoint.x - fireworkPackage.currentPoint.x
            firework.path.dy = firework.finishPoint.y - fireworkPackage.currentPoint.y
            fireworkPackage.fireworks.push(firework);
            drawFirework(firework);
        }
        return fireworkPackage;
    }

    function getPoint(radius, angle, startPoint) {
        const x =  (radius * Math.cos(angle)) + startPoint.x;
        const y =  (radius * Math.sin(angle)) + startPoint.y;
        return { x, y };
    }

    requestAnimationFrame(animate);
}

function randomSound() {
    const random = Math.floor(Math.random() * 4);
    if (random === 0) {
        return 'firework-b.mp3'
    } else if ( random === 1){
        return 'firework-double.mp3'
    } else if (2) {
        return 'firework-d.mp3'
    } else {
        return 'firework-l.mp3'
    }
}

function sound(src) {
    
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
