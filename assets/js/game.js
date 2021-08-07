kaboom(
    {
        global: true,
        fullscreen: true,
        scale: 2,
        debug: true,
        clearColor: [0,0,5,1],
    }
);

loadRoot('assets/')

loadSound("break", "sounds/break-block.wav");
loadSound("bump", "sounds/bump.wav");
loadSound("coin", "sounds/coin.wav");
loadSound("life", "sounds/extra-life.wav");
loadSound("flag", "sounds/flagpole.wav");
loadSound("gameover", "sounds/gameover.wav");
loadSound("die", "sounds/hero-die.wav");
loadSound("jump", "sounds/jump.wav");
loadSound("clearlevel", "sounds/level-clear.wav");
loadSound("pause", "sounds/pause.wav");
loadSound("pipe", "sounds/pipe-travel.wav");
loadSound("new", "sounds/powerup-appears.wav");
loadSound("powerup", "sounds/powerup.wav");
loadSound("stomp", "sounds/stomp.wav");
loadSound("time", "sounds/time-warning.wav");
loadSound("clearworld", "sounds/world-clear.wav");

loadSprite("brick", "sprites/brick.png")
loadSprite("brownBrick", "sprites/brown-brick.png")
loadSprite("greyBrick", "sprites/grey-brick.png")
loadSprite("greyBrickExplode", "sprites/grey-brick-explode.png", {
    sliceX: 5,
    anims: {
        explode: {
            from: 0,
            to: 4,
        },
    },
})
loadSprite("coin", "sprites/ci-coin.png")
loadSprite("ground", "sprites/ground.png")
loadSprite("pipeLeftBottom", "sprites/pipe-join-left-bottom.png")
loadSprite("pipeLeftTop", "sprites/pipe-join-left-top.png")
loadSprite("pipeLeft", "sprites/pipe-left.png")
loadSprite("pipeSideBottomEnd", "sprites/pipe-side-bottom-end.png")
loadSprite("pipeSideBottom", "sprites/pipe-side-bottom.png")
loadSprite("pipeSideTopEnd", "sprites/pipe-side-top-end.png")
loadSprite("pipeSideTop", "sprites/pipe-side-top.png")
loadSprite("pipeUpRight", "sprites/pipe-up-right.png")
loadSprite("pipeUpTopLeft", "sprites/pipe-up-top-left.png")
loadSprite("pipeUpTopRight", "sprites/pipe-up-top-right.png")
loadSprite("semi", "sprites/semi-colon-walking.png", {
    sliceX: 5,
    anims: {
        walk: {
            from: 0,
            to: 4,
        },
    },
})
loadSprite("imposter", "sprites/imposter.png")
loadSprite("stack", "sprites/stack-overflow.png")
loadSprite("youtube", "sprites/youtube-coin.png")

loadSprite("jim", "sprites/super-jim-32x32.png", {
    sliceX: 20,
    anims: {
        idle: {
            from: 0,
            to: 0,
        },
        run: {
            from: 2,
            to: 3,
        },
        jump: {
            from: 6,
            to: 6,
        }
    },
})

const MOVE_SPEED = 120
const JUMP_FORCE = 350
const CERTAIN_DEATH = 1500

const BADDIE_SPEED = 60
 
let isJumping = false
let isMoving = false

scene("game", ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj')
    camIgnore(["bg", "ui"]);

    const map = [
        '                                          c                                                        ',
        '                                                                                                   ',
        '                                           b                                                             ',
        '                                                                                                                   ',
        '                                                     b                                                          ',
        '                                                                                                              ',
        '                  c                              b       b                                                     ',
        '                                              b                                                                    ',
        '                b                                                                                    c                 ',
        '    B      b                   y       b                                            c                           c    ',
        '                                             b                         c                             b     c          ',
        '                   i          i                      b           c    b      i          c  c                          ',
        'ggggggggggggggggggggggggg   ggggggggggggggggggggggggg   gggggggggg    gggggggggggggg   g    g    ggggggggggggggggggggg',
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        'b': [sprite('brick'), solid(), scale(0.75), 'destructible'],
        'B': [sprite('brownBrick'), solid(), scale(0.75), 'destructible'],
        'c': [sprite('coin'), scale(0.75), 'coin'],
        'g': [sprite('ground'), solid(), scale(1)],
        'i': [sprite('imposter'), body(), scale(1), 'baddie'],
        's': [sprite('stack'), scale(1)],
        'y': [sprite('youtube'), scale(0.75)],
        // TODO
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    add([text('level ' + 'test', pos(4, 6))])

    const player = add([
        sprite('jim'),
        scale(1),
        solid(),
        pos(30, 0),
        body(),
        origin('bot'),
    ])
    
    player.action(() => {
        camPos(player.pos)
        if (player.grounded() && !isMoving) {
            player.play('idle')
            isJumping = false
        }
        else if (player.grounded() && isMoving) {
            player.play('run')

        }
        if (player.pos.y > CERTAIN_DEATH/3) {
            camScale(4);
        }
        if (player.pos.y >= CERTAIN_DEATH) {
            play('die')
            go('lose', { score: scoreLabel.value})
        }
    })

    player.on("headbutt", (obj) => {
        if (obj.is('destructible')) {
            play('break')
            destroy(obj)
        }
    })

    player.collides('coin', (coin) => {
        play('coin')
        destroy(coin)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    player.collides('baddie', (baddie) => {
        if (isJumping) {
            play('stomp')    
            destroy(baddie)
            player.jump(JUMP_FORCE / 2)
        } else {
            play('die')
            go('lose', { score: scoreLabel.value})
        }
    })

    action('baddie', (baddie) => {
        baddie.move(-BADDIE_SPEED, 0)
      })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
        isMoving = true
        player.scale = vec2(-1, 1)
    })

    keyRelease('left', () => {
        isMoving = false
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
        isMoving = true
        player.scale = vec2(1, 1)
    })

    keyRelease('right', () => {
        isMoving = false
    })

    keyPress('space', () => {
        if (player.grounded()) {
            play('jump')
            isJumping = true
            player.jump(JUMP_FORCE)
            player.play('jump')
        }
    })

})

scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
  })

go("game", {level: 0, score: 0})