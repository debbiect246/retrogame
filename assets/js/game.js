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
 loadSprite("pipeRight", "sprites/pipe-up-right.png")
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
const PLAYER_JUMP_FORCE = 350
const CERTAIN_DEATH = 1500

const BADDIE_SPEED = 60
const BADDIE_JUMP_FORCE = 300
 
let isJumping = true
let isMoving = false

scene("game", ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj')
    camIgnore(["bg", "ui"]);

    const map = [
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                            ',
        '                                                                                      12    ',
        '        12                    12                                                b     lr    ',
        '        lr          ;         lr                                                      lr    ',
        'gggggggggggggggggggggggggggggggg   gggggggggg   gggggggggggggg   g  g  ggggggggggggggggggggg',
    ]

    const levelCfg = {
        width: 32,
        height: 32,
        'b': [sprite('brick'), solid(), scale(0.75), 'destructible', 'wall'],
        'B': [sprite('brownBrick'), solid(), scale(0.75), 'destructible', 'wall'],
        'c': [sprite('coin'), scale(0.75), 'coin'],
        'g': [sprite('ground'), solid()],
        'i': [sprite('imposter'), body(), {dir: -1}, 'baddie', {timer: 0}],
        ';': [sprite('semi'), body(), {dir: -1}, 'baddie', {timer: 0}, 'semi'],
        's': [sprite('stack'), scale(1)],
        'l': [sprite('pipeLeft'), solid(), scale(1), 'wall'],
        'r': [sprite('pipeRight'), solid(), scale(1), 'wall'],
        '1': [sprite('pipeUpTopLeft'), solid(), scale(1), 'next-level'],
        '2': [sprite('pipeUpTopRight'), solid(), scale(1), 'next-level'],
        // '1': [sprite('pipeLeftBottom'), solid(), scale(1)],
        // '2': [sprite('pipeLeftTop'), solid(), scale(1)],
        // '4': [sprite('pipeSideBottomEnd'), solid(), scale(1)],
        // '5': [sprite('pipeSideBottom'), solid(), scale(1)],
        // '6': [sprite('pipeSideTopEnd'), solid(), scale(1)],
        // '7': [sprite('pipeSideTop'), solid(), scale(1)],
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
            player.jump(PLAYER_JUMP_FORCE / 2)
        }
    })

    player.overlaps('baddie', () => {
        play('die')
        go('lose', { score: scoreLabel.value})
    })

    action('baddie', (baddie) => {
        baddie.move(baddie.dir * BADDIE_SPEED, 0)
        // baddie.timer -= dt()
        // if (baddie.timer <=0) {
        //     baddie.jump()
        //     baddie.timer = rand(10)
        // }
    })

    collides('baddie', 'wall', (baddie) => {
        baddie.dir =- baddie.dir
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
            player.jump(PLAYER_JUMP_FORCE)
            player.play('jump')
        }
    })

})

scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
  })

go("game", {level: 0, score: 0})