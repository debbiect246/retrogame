kaboom(
    {
        global: true,
        fullscreen: true,
        scale: 1,
        debug: true,
        clearColor: [0,0,1,0.4],
    }
);

loadRoot('assets/')

loadSound("break", "sounds/break-block.wav");
loadSound("bump", "sounds/bump.wav");
loadSound("clearlevel", "sounds/level-clear.wav");
loadSound("clearworld", "sounds/world-clear.wav");
loadSound("code", "sounds/keyboard.wav");
loadSound("coin", "sounds/coin.wav");
loadSound("die", "sounds/hero-die.wav");
loadSound("flag", "sounds/flagpole.wav");
loadSound("gameover", "sounds/gameover.wav");
loadSound("github", "sounds/github.wav");
loadSound("life", "sounds/extra-life.wav");
loadSound("jump", "sounds/jump.wav");
loadSound("new", "sounds/powerup-appears.wav");
loadSound("pause", "sounds/pause.wav");
loadSound("pipe", "sounds/pipe-travel.wav");
loadSound("powerup", "sounds/powerup.wav");
loadSound("stomp", "sounds/stomp.wav");
loadSound("time", "sounds/time-warning.wav");

loadSprite("blank", "sprites/blank-tile-original.png")
loadSprite("brick", "sprites/brick.png")
loadSprite("brownBrick", "sprites/brown-brick.png")
loadSprite("blueBrick", "sprites/brick-blue.png")
loadSprite("coin", "sprites/ci-coin.png")
loadSprite("code-scroll", "sprites/code-scroll.png")
loadSprite("coffee", "sprites/coffee.png")
loadSprite("github", "sprites/github.png")
loadSprite("gold-code-scroll", "sprites/gold-code-scroll.png")
loadSprite("grass-rubble-original", "sprites/grass-rubble-original.png")
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
loadSprite("ground", "sprites/ground2.png")
loadSprite("rubble", "sprites/rubble-original.png")
loadSprite("rubble-blue", "sprites/rubble-blue.png")
loadSprite("rubble-red", "sprites/rubble-red.png")
loadSprite("imposter", "sprites/imposter.png")
loadSprite("mystery-box", "sprites/mystery-box-original.png")
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
loadSprite("slack", "sprites/slack.png")
loadSprite("stack", "sprites/stack-overflow.png")
loadSprite("youtube", "sprites/youtube-coin.png")
loadSprite("jim-head", "sprites/jim-head.png")
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
        },
        crouch: {
            from: 1,
            to: 1,
        },
    },
})

const WALK_SPEED = 120
const RUN_SPEED = 180
const JUMP_FORCE = 500
const BIG_JUMP_FORCE = 600
let CURRENT_JUMP_FORCE = JUMP_FORCE
const CERTAIN_DEATH = 1500
const PLAYER_SCALE_SMALL = 1
const PLAYER_SCALE_BIG = 1.4
let CURRENT_PLAYER_SCALE = PLAYER_SCALE_SMALL

const BADDIE_SPEED = 60
// const BADDIE_JUMP_FORCE = 300
 
let isJumping = true
let isMoving = false
let isCrouching = false

let LIVES_REMAINING = 3
let LINES_OF_CODE = 0
scene("splash", () => {
    add([
        text("Welcome to Super Jim 2021\n\nHit SPACEBAR to start!"),
        origin("center"),
		pos(width() / 2, height() / 2),
    ])
    keyPress("space", () => {
		go("game", {level: 0, score: 0});
	});
})

scene("game", ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj')
    camIgnore(["bg", "ui"]);

    const maps = [
        [
            '                                                                                                                                                                                                                ',                
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                      m                                                         bbbbbbbb   bbbm              m           bbb    bmmb                                                        oo                  ',
            '                                                                                                                                                                                           ooo                  ',
            '                                                                                                                                                                                          oooo                  ',
            '                                                                m                                                                                                                        ooooo        G         ',
            '                M   bNbnb                     ()         12                  bmb              b     bb    m  m  m     b          bb      o  o          oo  o            bbmb            oooooo                  ',
            '                             G        ()      lr         lr                                                                             oo  oo        ooo  oo                          ooooooo                  ',
            '                            ()        lr      lr         lr                                                                            ooo  ooo      oooo  ooo     ()              () oooooooo                  ',
            '                            lr    i   lr      lr    ;    lr                                                                           oooo  oooo    ooooo  oooo    lr              lrooooooooo        o         ',
            'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggg   gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooo   oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        ],
        [
            '                                                                                                                                                                                                                ',                
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                                                                                                                                                                                                                ',
            '                      m                                                         bbbbbbbb   bbbm              m           bbb    bmmb                                                        oo                  ',
            '                                                                                                                                                                                           ooo                  ',
            '                                                                                                                                                                                          oooo                  ',
            '                                                                m                                                                                                                        ooooo        G         ',
            '                M   bNbnb                     ()         ()                  bmb              b     bb    m  m  m     b          bb      o  o          oo  o            bbmb            oooooo                  ',
            '                                      ()      lr         lr                                                                             oo  oo        ooo  oo                          ooooooo                  ',
            '                            ()        lr      lr         lr                                                                            ooo  ooo      oooo  ooo     ()              () oooooooo                12',
            '     ; ; ; ; ; ; ; ; ;      lr    i   lr      lr    ;    lr                                                                           oooo  oooo    ooooo  oooo    lr              lrooooooooo        o       lr',
            'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggg   gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooo   oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        ]
    ]

    const levelCfg = {
        width: 32,
        height: 32,
        '-': [sprite('blank'), solid(), scale(1)],
        'b': [sprite('brick'), solid(), scale(1), 'destructible'],
        'B': [sprite('brownBrick'), solid(), scale(0.75), 'destructible', 'wall'],
        'z': [sprite('blueBrick'), solid(), scale(1), 'wall'],
        'c': [sprite('coin'), scale(0.8), 'coin'],
        '@': [sprite('code-scroll'), scale(0.75), 'code-scroll'],
        'C': [sprite('coffee'), scale(0.75), 'coffee'],
        'G': [sprite('github'), scale(0.75), 'github'],
        '#': [sprite('gold-code-scroll'), scale(0.75), 'gold-code-scroll'],
        'g': [sprite('ground'), solid()],
        'i': [sprite('imposter'), body(), {dir: -1}, 'baddie', {timer: 0}, scale(0.8)],
        'm': [sprite('mystery-box'), solid(), 'mystery-box'],
        'M': [sprite('mystery-box'), solid(), 'mystery-box-coin'],
        'n': [sprite('mystery-box'), solid(), 'mystery-box-slack'],
        'N': [sprite('mystery-box'), solid(), 'mystery-box-code'],
        ';': [sprite('semi'), body(), {dir: -1}, 'baddie', {timer: 0}, 'semi', scale(0.8)],
        's': [sprite('stack'), scale(1)],
        'S': [sprite('slack'), scale(1), 'slack', body(), scale(0.8), {dir: 1}, {timer: 0}],
        'o': [sprite('rubble'), solid()],
        'u': [sprite('rubble-blue'), solid()],
        'l': [sprite('pipeLeft'), solid(), scale(1), 'wall'],
        'r': [sprite('pipeRight'), solid(), scale(1), 'wall'],

        '(': [sprite('pipeUpTopLeft'), solid(), scale(1), 'wall'],
        ')': [sprite('pipeUpTopRight'), solid(), scale(1), 'wall'],
        '1': [sprite('pipeUpTopLeft'), solid(), scale(1), 'pipe'],
        '2': [sprite('pipeUpTopRight'), solid(), scale(1), 'pipe'],
        '3': [sprite('pipeLeftBottom'), solid(), scale(1)],
        '4': [sprite('pipeLeftTop'), solid(), scale(1)],
        '5': [sprite('pipeSideBottomEnd'), solid(), scale(1)],
        '6': [sprite('pipeSideTopEnd'), solid(), scale(1)],
        '7': [sprite('pipeSideBottom'), solid(), scale(1)],
        '8': [sprite('pipeSideTop'), solid(), scale(1)],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text('Score: '+ score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    const livesLabel = add([
        text('Lives Remaining: ' + LIVES_REMAINING),
        pos(width()-30, 6),
        origin('topright'),
        layer('ui'),
        {
            value: LIVES_REMAINING,
        }
    ])

    const codeLabel = add([
        text('Uncommited Code: ' + LINES_OF_CODE),
        pos(width()/2, 6),
        origin('top'),
        layer('ui'),
        {
            value: LINES_OF_CODE,
        }
    ])

    add([text('level ' + parseInt(level + 1) ), pos(40, 32)])

    function makeBig() {
        // let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    CURRENT_PLAYER_SCALE = PLAYER_SCALE_BIG
                    // timer -= dt()
                // if (timer <= 0) {
                //     this.shrink()
                // }
                }
            },
            isBig() {
                return isBig
            },
            shrink() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                CURRENT_PLAYER_SCALE = PLAYER_SCALE_SMALL
                // timer = 0
                isBig = false
            },
            grow() {
                this.scale = vec2(1.2)
                // timer = time
                isBig = true     
            }
        }
    }

    const player = add([
        sprite('jim'),
        // pos(width() / 5, height() / 2),
        pos(64, 64),
        body(),
        scale(PLAYER_SCALE_SMALL),
        makeBig(),
        origin('center'),
    ])
    
    player.action(() => {
        camPos(player.pos.x, height() / 2)
        if (player.grounded()) {
            isJumping = false
            if (!isMoving && !isCrouching) {
                player.play('idle')
            } 
        }
        if (player.pos.y > CERTAIN_DEATH/3) {
            camScale(4);
        }
        if (player.pos.y >= CERTAIN_DEATH) {
            
            LIVES_REMAINING -= 1
            if (LIVES_REMAINING > 0) {
                play('die')
                go('lose', { score: scoreLabel.value, level: level})
            } else {
                play('gameover')
                go('gameover', {score: scoreLabel.value})
            }
        }
    })   

    player.on("headbutt", (obj) => {
        if (obj.is('destructible') && player.isBig()) {
            play('break')
            destroy(obj)
        }

        if (obj.is('mystery-box')) {
            gameLevel.spawn('C', obj.gridPos.sub(-0.15,1))
            destroy(obj)
            gameLevel.spawn('-', obj.gridPos.sub(0,0))
            play('new')
        }

        if (obj.is('mystery-box-coin')) {
            gameLevel.spawn('c', obj.gridPos.sub(-0.1,1))
            destroy(obj)
            gameLevel.spawn('-', obj.gridPos.sub(0,0))
            play('new')
        }

        if (obj.is('mystery-box-slack')) {
            gameLevel.spawn('S', obj.gridPos.sub(0,2))
            destroy(obj)
            gameLevel.spawn('-', obj.gridPos.sub(0,0))
            play('new')
        }

        if (obj.is('mystery-box-code')) {
            gameLevel.spawn('@', obj.gridPos.sub(0,2))
            destroy(obj)
            gameLevel.spawn('-', obj.gridPos.sub(0,0))
            play('new')
        }
    })

    action('slack', (slack) => {
        slack.move(slack.dir * BADDIE_SPEED, 0)
        //s.rotate(2)
    })

    collides('slack', 'wall', (slack) => {
        // TODO: fix scale/tile causing baddies to get stuck on large tiles (e.g. pipes)
        slack.dir =- slack.dir
    })

    player.collides('slack', (slack) => {
        play('life')
        destroy(slack)
        scoreLabel.value += 100
        scoreLabel.text = scoreLabel.value
        // need to add power up effect discuss with Ed
        LIVES_REMAINING += 1
        livesLabel.value = LIVES_REMAINING
        livesLabel.text = 'Lives Remaining: ' + LIVES_REMAINING
    })

    player.collides('coffee', (coffee) => {
        play('powerup')
        destroy(coffee)
        scoreLabel.value += 10
        scoreLabel.text = scoreLabel.value
        player.grow()
    })

    player.collides('coin', (coin) => {
        play('coin')
        destroy(coin)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    player.collides('code-scroll', (code) => {
        play('code')
        destroy(code)
        LINES_OF_CODE += 10
        codeLabel.text = 'Uncommited Code: ' + LINES_OF_CODE
    })
    
    player.collides('github', (g) => {
        play('github')
        destroy(g)
        scoreLabel.value += (LINES_OF_CODE * 100)
        scoreLabel.text = scoreLabel.value
        LINES_OF_CODE = 0
        codeLabel.text = 'Uncommited Code: ' + LINES_OF_CODE
    })

    
    
    player.collides('baddie', (baddie) => {
        if (player.falling()) {
            play('stomp')    
            destroy(baddie)
            player.jump(JUMP_FORCE / 2)
        }
    })
    
    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    player.overlaps('baddie', (baddie) => {
        if (player.isBig()) {
            // play('bump')
            player.shrink()
        } else {
            
            LIVES_REMAINING -= 1
            if (LIVES_REMAINING > 0) {
                play('die')
                go('lose', { score: scoreLabel.value, level: level})
            } else {
                play('gameover')
                go('gameover', {score: scoreLabel.value})
            }
        }
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
        // TODO: fix scale/tile causing baddies to get stuck on large tiles (e.g. pipes)
        baddie.dir =- baddie.dir
    })

    keyDown('left', () => {
        if (keyIsDown('shift')) {
            player.move(-RUN_SPEED, 0)
        } else {
            player.move(-WALK_SPEED, 0)
        }
        player.scale.x = -CURRENT_PLAYER_SCALE
        if (!isMoving) {
            player.play('run')
            isMoving = true
        }
    })

    keyRelease('left', () => {
        isMoving = false
    })

    keyDown('right', () => {
        if (keyIsDown('shift')) {
            player.move(RUN_SPEED, 0)
        } else {
            player.move(WALK_SPEED, 0)
        }
        player.scale.x = CURRENT_PLAYER_SCALE
        if (!isMoving) {
            player.play('run')
            isMoving = true
        }
    })

    keyRelease('right', () => {
        isMoving = false
    })
    
    keyDown('down', () => {
        if (!isMoving) {
            player.play('crouch')
            isCrouching = true
        }
    })

    keyRelease('down', () => {
        isCrouching = false
    })

    keyPress('space', () => {
        if (player.grounded()) {
            play('jump')
            player.jump(JUMP_FORCE)
            if (!isMoving) {
                player.play('jump')
                isJumping = true
            }
        }
    })

})

scene('lose', ({ score, level }) => {
    add([text(`Lives remaining: ${LIVES_REMAINING}\n\nHit SPACE to retry the level!`), origin('left'), pos(width()/2, height()/ 2)])
    keyPress("space", () => {
		go("game", {level: level, score: score});
	});
})

scene('gameover', ({score}) => {
        
    add([
        sprite("jim-head"),
        pos(40,40),
        scale(2)
    ])

    add([
        text('Game Over'),
        pos((width()/2), (height()/2)),
        origin('center'),
        scale(4)
    ])
    
    add([
        text('You let Jim down!'),
        pos(width()/2, (height()/2)+64),
        origin('center'),
        scale(2)
    ])

    add([
        text('Your score: ' + score),
        pos((width()/2), (height()/2)+128),
        origin('center'),
        scale(2)
    ])

    add([
        text('Hit space to try again'),
        pos((width()/2), (height()/2)+192),
        origin('center'),
        scale(2)
    ])

    keyPress("space", () => {
        LIVES_REMAINING = 3; //needed to put LIVES_REMAINING back to 3
        go("game", {level: 0, score: 0});
    });
    // add([
    //     text('Your high-score: ' + highScore),
    //     pos((width()/2), (height()/2)+256),
    //     scale(2)
    // ])
})

go("splash")