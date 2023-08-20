const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 147
    },
    imageSrc: './img/shop.png',
    scale: 2.65,
    frameMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/skiidex/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 151
    },
    sprites: {
        idle: {
            imageSrc: './img/skiidex/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/skiidex/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/skiidex/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/skiidex/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/skiidex/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/skiidex/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/skiidex/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})



const enemy = new Fighter({
    position: {
        x: 400,
        y: 200
    }, 
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/crusto/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/crusto/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/crusto/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/crusto/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/crusto/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/crusto/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/crusto/Take Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/crusto/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})



console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.12)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -8
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 8
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
        // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }


    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -8
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 8
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

        // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collusion & enemy gets hit
    // player
    if (
        rectangularCollision({ 
            rectangle1: player, 
            rectangle2: enemy 
        }) && 
        player.isAttacking && 
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHp', { 
            width: enemy.health + '%' 
        })
        
    }

    // if player attack misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // enemy
    if (rectangularCollision({ 
        rectangle1: player, 
        rectangle2: enemy 
        }) && 
        enemy.isAttacking && 
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHp', { 
            width: player.health + '%' 
        })
    }

    // if enemy attack misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }   
    
    if(!enemy.dead) {
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'Enter':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    
})

