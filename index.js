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
        y: 180
    },
    sprites: {
        idle: {
            imageSrc: './img/skiidex/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/skiidex/Run.png',
            framesMax: 8
        }
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

    player.update()
    //enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -8
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 8
    }
    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -8
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 8
    }

    // detect for collusion
    // player
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && 
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHp').style.width = enemy.health + '%'
        console.log('player')
    }

    // enemy
    if (rectangularCollision({ 
        rectangle1: player, 
        rectangle2: enemy 
        }) && 
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHp').style.width = player.health + '%'
        console.log('enemy')
    }

    // end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {

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
            enemy.isAttacking = true
            break
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

