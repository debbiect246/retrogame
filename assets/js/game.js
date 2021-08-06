kaboom(
    {
        global: true,
        fullscreen: true,
        scale: 2,
        debug: true,
        clearColor: [0,0,0,1],
    }
);

loadSprite("mark", "https://kaboomjs.com/assets/sprites/mark.png")

const MOVE_SPEED = 120
const JUMP_FORCE = 350

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '                                                  ',
        '         =   =    =    =    =                     ',
        '      =                                           ',
        '                                                  ',
        '                                                  ',
        '======================================            ',
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('mark'), solid()],
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
        sprite('mark'), solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ])

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE)
        }
    })

    player.action(() => {
        camPos(player.pos)
      })
})

go("game")