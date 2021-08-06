kaboom(
    {
        global: true,
        fullscreen: true,
        scale: 2,
        debug: true,
        clearColor: [0,0,5,1],
    }
);

loadRoot('assets/sprites/')
loadSprite("brick", "brick.png")
loadSprite("coin", "ci-coin.png")
loadSprite("ground", "ground.png")
loadSprite("imposter", "imposter.png")
loadSprite("stack", "stack-overflow.png")
loadSprite("youtube", "youtube-coin.png")
loadSprite("jim", "super-jim-32x32.png", {
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

let isJumping = false
let isMoving = false

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                  c                               ',
        '                                                  ',
        '                b                                 ',
        '          b                   y                   ',
        '                                                  ',
        '                   i          i                   ',
        'ggggggggggggggggggggggggggggggggggggggggggggggggggg',
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        'b': [sprite('brick'), solid(), scale(0.75)],
        'c': [sprite('coin'), scale(0.75)],
        'g': [sprite('ground'), solid(), scale(1)],
        'i': [sprite('imposter'), body(), scale(1)],
        's': [sprite('stack'), scale(1)],
        'y': [sprite('youtube'), scale(0.75)],
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
        text('test'),
        pos(30, 6),
        layer('ui'),
        {
            value: 'test'
        }
    ])

    add([text('level ' + 'test', pos(4, 6))])

    const player = add([
        sprite('jim'),
        scale(1, 1),
        solid(),
        pos(30, 0),
        body(),
        origin('bot'),
    ])
    
    player.action(() => {
        if (player.grounded() && !isMoving) {
            player.play('idle')
            isJumping = false
        }
        else if (player.grounded() && isMoving) {
            player.play('run')
        }
        camPos(player.pos)
        // console.log(player.curAnim());
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
            isJumping = true
            player.jump(JUMP_FORCE)
            player.play('jump')
        }
    })

})

go("game")