class Sprite {
    constructor({ position, imageSrc, scale = 1, frameMax = 1, offset = {x: 0, y: 0} }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = frameMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.offset = offset
    }

    draw() {
        canvasContext.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }


    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        color = 'red',  
        imageSrc, 
        scale = 1, 
        frameMax = 1,
        offset = {x: 0, y: 0},
        sprites
    }) {

        super({ position, imageSrc, scale, frameMax, offset })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.sprites = sprites

        for (const sprite in this.sprites) {
           sprites[sprite].image = new Image()
           sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        console.log(this.sprites);
    }

    update() {
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 90) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}
