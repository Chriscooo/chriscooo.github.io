const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height);

c.font = "30px Arial";
c.textAlign = "center";
c.textBaseline = "middle";

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.rotation = 0
    }

    draw(){
        c.save()

        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y )

        c.beginPath()

        c.moveTo(this.position.x, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y + 5);
        c.moveTo(this.position.x, this.position.y);
        c.lineTo(this.position.x + 10, this.position.y + 5);

        c.moveTo(this.position.x, this.position.y - 22.5);
        c.lineTo(this.position.x - 10, this.position.y + 5);
        c.moveTo(this.position.x, this.position.y - 22.5);
        c.lineTo(this.position.x + 10, this.position.y + 5);

        c.closePath()

        c.strokeStyle = 'white'
        c.stroke()

        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    getVertices() {
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)

        return [
            {
                x: this.position.x + cos * 30 - sin * 0,
                y: this.position.y + sin * 30 + cos * 0,
            },
            {
                x: this.position.x + cos * -10 - sin * 10,
                y: this.position.y + sin * -10 + cos * 10,
            },
            {
                x: this.position.x + cos * -10 - sin * -10,
                y: this.position.y + sin * -10 + cos * -10,
            },
        ]
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw (){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false)
        c.closePath()
        c.fillStyle = 'white'
        c.fill()
    }

    update (){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Asteroid {
    constructor({position, velocity, radius}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw (){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false)
        c.closePath()
        c.strokeStyle = 'white'
        c.stroke()
    }

    update (){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Box {
    constructor({x, y, w, h}) {
        this.x = x
        this.y = y
        //this.velocity = velocity
        //this.rotation = 0
        this.w = w
        this.h = h
    }

    draw(){
        /*
        c.beginPath()
        
        c.moveTo(this.position.x + 150, this.position.y - 30)
        c.lineTo(this.position.x - 150, this.position.y - 30)
        c.moveTo(this.position.x + 150, this.position.y - 30)
        c.lineTo(this.position.x + 150, this.position.y + 30)
        
        c.moveTo(this.position.x - 150, this.position.y + 30)
        c.lineTo(this.position.x + 150, this.position.y + 30)
        c.moveTo(this.position.x - 150, this.position.y + 30)
        c.lineTo(this.position.x - 150, this.position.y - 30)
        
        c.closePath()
        */

        c.strokeRect(this.x, this.y, this.w, this.h);
        
        c.strokeText("Portfolio", (this.x + this.w / 2), (this.y + this.h / 2));
        
        c.strokeStyle = 'white'
        c.stroke()
    }

    update(){
        this.draw()
    }
}

const player = new Player({
    position: {x:canvas.width / 2, y:canvas.height / 2},
    velocity: {x:0, y:0}})

const portfolio = new Box({
    w: canvas.width / 8,
    h: canvas.height / 12,
    x: (canvas.width / 2) - (canvas.width / 8 / 2),
    y: (canvas.height / 4) - (canvas.height / 12 / 2),
})

player.draw()

const keys = {
    w: {
        pressed: false
    },
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

const speed = 2
const rotSpeed = 0.03
const intertia = .99
const projectileVelocity = 3

const projectiles = []
const asteroids = []

const intervalId = window.setInterval(() => {
    const index = Math.floor(Math.random() * 4)
    let x,y
    let vx, vy
    let radius = 50 * Math.random() + 10

    switch (index) {
        case 0:
            x = 0 - radius
            y = Math.random() * canvas.height
            vx = Math.random() + 1
            vy = Math.random()
            break
        case 1:
            x = Math.random() * canvas.width
            y = canvas.height + radius
            vx = Math.random()
            vy = -Math.random() - 1
            break
        case 2:
            x = canvas.width + radius
            y = Math.random() * canvas.height
            vx = -Math.random() - 1
            vy = Math.random()
            break
        case 3:
            x = Math.random() * canvas.width
            y = 0 - radius
            vx = Math.random() 
            vy = Math.random() + 1
            break
    }

    asteroids.push(
        new Asteroid({
            position: {
                x: x,
                y: y
            },
            velocity: {
                x: vx,
                y: vy,
            },
            radius,
        }
    ))
}, (Math.random() * 4000))

function circleCollision(circle1, circle2){
    const xDifference = circle2.position.x - circle1.position.x
    const yDifference = circle2.position.y - circle1.position.y
    
    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference)
    
    if (distance <= circle1.radius + circle2.radius) {
        return true
    }
    return false
}

function circleTriangleCollision(circle, triangle) {
    // Check if the circle is colliding with any of the triangle's edges
    for (let i = 0; i < 3; i++) {
        let start = triangle[i]
        let end = triangle[(i + 1) % 3]

        let dx = end.x - start.x
        let dy = end.y - start.y
        let length = Math.sqrt(dx * dx + dy * dy)

        let dot =
            ((circle.position.x - start.x) * dx +
                (circle.position.y - start.y) * dy) /
            Math.pow(length, 2)

        let closestX = start.x + dot * dx
        let closestY = start.y + dot * dy

        if (!isPointOnLineSegment(closestX, closestY, start, end)) {
            closestX = closestX < start.x ? start.x : end.x
            closestY = closestY < start.y ? start.y : end.y
        }

        dx = closestX - circle.position.x
        dy = closestY - circle.position.y

        let distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= circle.radius) {
            return true
        }
    }

    // No collision
    return false
}


/*
function circleBoxCollision(circle, box) {
    
    edgeX = 0
    edgeY = 0
    
    if (box.position.x > circle.position.x + circle.radius) {
        edgeX = circle.position.x + circle.radius;
    } else if (box.position.x < circle.position.x) {
        edgeX = circle.position.x;
    }

    if (box.position.y > circle.position.y + circle.radius) {
        edgeY = circle.position.y + circle.radius;
    } else if (box.position.y < circle.position.y) {
        edgeY = circle.position.y;
    }
    
    distX = edgeX - circle.position.x;
    distY = edgeY - circle.position.y;
    let dist = Math.sqrt((distX * distX) + (distY * distY))
    
    if (dist <= circle.radius) {
        return true
    }
    
    return false
}


 */

function circleBoxCollision(circle,rect){
    var distX = Math.abs(circle.position.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.position.y - rect.y-rect.h/2);
    
    if (distX > (rect.w/2 + circle.radius)) { return false; }
    if (distY > (rect.h/2 + circle.radius)) { return false; }

    if (distX <= (rect.w/2)) { return true; }
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<(circle.radius*circle.radius));
}

function isPointOnLineSegment(x, y, start, end) {
    return (
        x >= Math.min(start.x, end.x) &&
        x <= Math.max(start.x, end.x) &&
        y >= Math.min(start.y, end.y) &&
        y <= Math.max(start.y, end.y)
    )
}
function animate() {
    const animationId = window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update()
    portfolio.update()

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i]
        projectile.update()
        
        if (circleBoxCollision(projectile, portfolio)) {
            window.location.href = "portfolio.html";
        }
        
        if (projectile.position.x + projectile.radius < 0 ||
            projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile.radius > canvas.height ||
            projectile.position.y + projectile.radius < 0)  {
            projectiles.splice(i, 1)
        }
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i]
        asteroid.update()
        
        if (circleTriangleCollision(asteroid, player.getVertices())) {
            GameOver()
        }
        
        if (asteroid.position.x + asteroid.radius < 0 ||
            asteroid.position.x - asteroid.radius > canvas.width ||
            asteroid.position.y - asteroid.radius > canvas.height ||
            asteroid.position.y + asteroid.radius < 0)  {
            //asteroids.splice(i, 1)
        }

        for (let x = i - 1; x >= 0; x--) {
            const asteroid2 = asteroids[x]
            if (circleCollision(asteroid, asteroid2)){
                asteroid.velocity.x = -asteroid.velocity.x
                asteroid.velocity.y = -asteroid.velocity.y
                asteroid2.velocity.x = -asteroid2.velocity.x
                asteroid2.velocity.y = -asteroid2.velocity.y
            }
        }
        
        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j]

            if (circleCollision(asteroid, projectile)){
                asteroids.splice(i, 1)
                projectiles.splice(j, 1)
            }
        }
    }

    if (keys.w.pressed) {
        player.velocity.x = Math.sin(player.rotation) * speed
        player.velocity.y = -Math.cos(player.rotation) * speed
    } else if (!keys.w.pressed) {
        player.velocity.x *= intertia
        player.velocity.y *= intertia
    }

    if (keys.d.pressed) player.rotation += rotSpeed
    else if (keys.a.pressed) player.rotation -= rotSpeed
}

function reset(array) {
    array.splice(0, array.length)
}

function GameOver() {
    asteroids.forEach(reset(asteroids))
    projectiles.forEach(reset(projectiles))
    
    //CANT DELETE PLAYER?
}

animate()

window.addEventListener('keydown', (event)=>{
    switch(event.code){
        case 'KeyW':
            keys.w.pressed = true
            break
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        case 'Space':
            projectiles.push(new Projectile({
                position: {
                    x: (player.position.x - Math.sin(player.rotation) * -25),
                    y: (player.position.y - Math.cos(player.rotation) * 25)
                },
                velocity: {
                    x: (Math.sin(player.rotation) * projectileVelocity) + player.velocity.x,
                    y: (-Math.cos(player.rotation) * projectileVelocity) + player.velocity.y
                }
            }))

            break
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.code){
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
    }
})