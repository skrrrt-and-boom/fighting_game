const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 568

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './Assets/background.png',
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 134
  },
  imageSrc: './Assets/shop.png',
  scale: 2.7,
  framesMax: 6,
})



const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './Assets/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './Assets/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './Assets/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './Assets/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './Assets/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './Assets/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: './Assets/samuraiMack/Attack2.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './Assets/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './Assets/samuraiMack/Death.png',
      framesMax: 6,
    }

  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 150,
    height: 50,
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './Assets/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './Assets/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './Assets/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './Assets/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './Assets/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './Assets/kenji/Attack1.png',
      framesMax: 4,
    },
    attack2: {
      imageSrc: './Assets/kenji/Attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './Assets/kenji/Take hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './Assets/kenji/Death.png',
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 140,
    height: 50,
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //    Player movement
  if (keys.a.pressed && player.lastKey === 'a'  && player.position.x !== 0) {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x !== 975) {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
  player.switchSprite('idle')
  }

  //  jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //    Enemy movement
  if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft' && enemy.position.x !== 0) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight' && enemy.position.x !== 975) {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //    detect for collisions && get hits
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
      player.isAttacking && player.frameCurrent === 4 &&
      player.health > 0
  ) {
    enemy.takeHit()
    player.isAttacking = false
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

  //  if attack miss
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
      enemy.isAttacking && enemy.frameCurrent === 2 &&
      enemy.health > 0
  ) {
    player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  //  if attack miss
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false
  }


  //  end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerID})
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
        if (player.position.y === 330) {
          player.velocity.y -= 20
        }
        break
      case 's':
        player.attack()
        break
    }
  }
  if (!enemy.dead) {

    switch  (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.position.y === 330) {
          enemy.velocity.y -= 20
        }
        break
      case 'ArrowDown':
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

    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break

  }
})
