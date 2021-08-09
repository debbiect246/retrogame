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
loadSprite("exit-sign-top", "sprites/exit-sign-top.png")
loadSprite("exit-sign-lower", "sprites/exit-sign-lower.png")
loadSprite("github", "sprites/github.png")
loadSprite("gold-code-scroll", "sprites/gold-code-scroll.png")
loadSprite("grass-rubble-original", "sprites/grass-rubble-original.png")
loadSprite("grass-rubble-blue", "sprites/grass-rubble-blue.png")
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
loadSprite("angry-jim-head", "sprites/angry-jim-head.png")
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
loadSprite("title", "sprites/title.png")

loadSprite('sky', 'sprites/sky_fc.png')
loadSprite('farMountains', 'sprites/far_mountains_fc.png')
loadSprite('grassyMountains', 'sprites/grassy_mountains_fc.png')
loadSprite('cloudsMid', 'sprites/clouds_mid_fc.png')
loadSprite('hill', 'sprites/hill.png')
loadSprite('cloudsFront', 'sprites/clouds_front_fc.png')


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
 
let isJumping = true
let isMoving = false
let isCrouching = false

let LIVES_REMAINING = 3
let LINES_OF_CODE = 0

scene("splash", () => {
    add([
        sprite("title"),
        origin("center"),
        pos(width() / 2, 100),
        scale(0.7)
    ])

    add([
        text("Help Jim rescue his Portfolio Project Six\n\n from the " + 
        "minions of Imposter Syndrome\n\n and those pesky Semicolons.\n\n" + 
        "\n\nTo earn a Distinction he will need to\n\n gather lines of code," + 
        " peruse Stack Overflow,\n\n" + 
        "check Slack, and drink lots of coffee!\n\n\n\n" + 
        "Hit SPACEBAR to start!"),
        origin("center"),
		pos(width() / 2, 300),
        scale(0.7)
    ])
    keyPress("space", () => {
		go("game", {level: 0, score: 0});
	});
})

scene("game", ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj')
    camIgnore(["bg", "ui"]);

    add([
		sprite("sky"),
		layer("bg"),
		pos(0, 0),
		"background",
        scale(width()/ 384, height() / 216),
	]);
    add([
        sprite("farMountains"),
		layer("bg"),
		pos(0, 0),
		"background",
        scale(width()/ 384, height() / 216),
	]);
    add([
        sprite("grassyMountains"),
		layer("bg"),
		pos(0, 0),
		"background",
        scale(width()/ 384, height() / 216),
	]);
    add([
        sprite("cloudsMid"),
		layer("bg"),
		pos(0, 0),
		"background",
        scale(width()/ 384, height() / 216),
	]);
    add([
        sprite("hill"),
        layer("bg"),
        pos(0, 0),
        "background",
        scale(width()/ 384, height() / 216),
    ]);
    add([
        sprite("cloudsFront"),
        layer("bg"),
        pos(0, 0),
        "background",
        scale(width()/ 384, height() / 216),
    ]);

    const maps = [
        [
            'o                                                                                                                                                                                                                BB',                
            'o                                                                                                                                                                                                                BB',
            'o                                                                                                                                                                                                                BB',
            'o                                                                                                                                                                                                                BB',
            'o                                                                                                                                                                                                                BB',
            'o                     m                                                         bbbbbbbb   bbbN              N           bbb    bNNb                                                        oo                   BB',
            'o                                                                                                                                                                                          ooo                   BB',
            'o                                                                                                                                                                                         oooo                  £BB',
            'o                                                               m                                                                                                                        ooooo        G         $BB',
            'o               M   bNbnb                     ()         ()                  bNb              b     bb    m  N  m     b          bb      o  o          oo  o            bbNb            oooooo                   BB',
            'o                            G        ()      lr         lr                                                                             oo  oo        ooo  oo                          ooooooo                   BB',
            'o                           ()        lr      lr         lr                                                                            ooo  ooo      oooo  ooo     ()              () oooooooo                 12BB',
            'o                           lr    i   lr      lr    ;    lr                                                                           oooo  oooo    ooooo  oooo    lr              lrooooooooo        o        lrBB',
            'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggg   gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  gggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooo   oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  oooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        ],
        [
            'o                                                                                                                                                                                                               ',                
            'o                                                                                                                                                                                                               ',
            'o                                                                                                                                                                                                               ',
            'o                                                                                                                                                                                                               ',
            'o                                                                                                                                                                                                               ',
            'o                     m                                                         bbbbbbbb   bbbNb        bbbbbNbbbbb      bbb   bbNNb                                                        oo                  ',
            'o                                                                                                                                                                                          ooo                  ',
            'o                                                                                                                                                                                         oooo                  ',
            'o                                                               m                                                                                                                        ooooo        G         ',
            'o               M   bNbnb                     ()         ()                  bNb              b     bb    m  m  m     b          bb      o  o          oo  o            bbNb            oooooo                  ',
            'o                                     ()      lr         lr                                                                             oo  oo        ooo  oo                          ooooooo                  ',
            'o                           ()        lr      lr         lr                                                                            ooo  ooo      oooo  ooo     ()              () oooooooo                12',
            'o    ; ; ; ; ; ; ; ; ;      lr    i   lr      lr    ;    lr                                                                           oooo  oooo  i ooooo  oooo    lr         i    lrooooooooo        o       lr',
            'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggg   gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  ggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooo   oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo  ooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        ],
        [
            'z                                                                                                                                                                                                                  ',
            'z                                                                                                                                                                                                                  ',
            'z                                                                                                                                                                                                                BB',
            'z                                                                                                                             @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ #                                              BB',
            'z            uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu                           BB',
            'z                                                                                      uuuu         uu    uu                                                                                                     BB',
            'z                                                                                      uuuu         uu    uu                  cccccc                                                                             BB',
            'z                                                              cccccc              uuuu             uu    uu                  uuuuuu                                                                             BB',
            'z                                                          z   zzzzzz   z          uuuu             uu    uu    uu            uuuuuu                                                                            £BB',
            'z                                                          z c z    z c z          uu           cccCuu    uu    uu  uuuu                          cccccccccc                                                    $BB',
            'z             NMNmN           u  u                         zzzzz    zzzzz          uuuuuuuu     uuuuuu    uucu  uu                          u     uuuuuuuuuu                                                     BB',
            'z                          u  u  u  u      u                                           uuuu               uuuu  uu                       u  u                                                                    BB',
            'z                       u  u  u  u  u      u  u                                        uuuu                                           u  u  u                                         u            G           12BB',
            'z                    u  u  u  u  u  u   ;  u  u                                        uuuu                         u    i         u  u  u  u               u  ;     u     ;          u   u   i    u           lrBB',
            'zRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR  RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR  RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR          RRRRRRRRRRRRRRRRRRRRRRRRRRR   RRRRRRRRRRRRRRRRRRRRRRRRR',
            'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu          uuuuuuuuuuuuuuuuuuuuuuuuuuu   uuuuuuuuuuuuuuuuuuuuuuuuu',
        ]
    ]
    
    const levelCfg = {
        width: 32,
        height: 32,
        '-': [sprite('blank'), solid(), scale(1)],
        'b': [sprite('brick'), solid(), scale(1), 'destructible'],
        'B': [sprite('brownBrick'), solid(), scale(1), 'destructible', 'wall'],
        'z': [sprite('blueBrick'), solid(), scale(1), 'wall', 'destructible'],
        'c': [sprite('coin'), scale(0.8), 'coin'],
        '@': [sprite('code-scroll'), scale(0.75), 'code-scroll'],
        'C': [sprite('coffee'), scale(0.75), 'coffee'],
        '£': [sprite('exit-sign-top')],
        '$': [sprite('exit-sign-lower')],
        'G': [sprite('github'), scale(0.75), 'github'],
        '#': [sprite('gold-code-scroll'), scale(0.75), 'gold-code-scroll'],
        'g': [sprite('grass-rubble-original'), solid()],
        'i': [sprite('imposter'), body(), {dir: -1}, 'baddie', scale(0.8)],
        'm': [sprite('mystery-box'), solid(), 'mystery-box'],
        'M': [sprite('mystery-box'), solid(), 'mystery-box-coin'],
        'n': [sprite('mystery-box'), solid(), 'mystery-box-slack'],
        'N': [sprite('mystery-box'), solid(), 'mystery-box-code'],
        ';': [sprite('semi'), body(), {dir: -1}, 'baddie', 'semi', scale(0.8)],
        'R': [sprite('grass-rubble-blue'), solid()],
        's': [sprite('stack'), scale(1)],
        'S': [sprite('slack'), scale(1), 'slack', body(), scale(0.8), {dir: 1}],
        'o': [sprite('rubble'), solid()],
        'u': [sprite('rubble-blue'), solid(), 'destructible', 'wall'],
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

    add([text('Level ' + parseInt(level + 1) ), pos(width() / 4, height() / 4)])
    add([text(`ARROWS: Move\nSPACE : Jump\nSHIFT : Run\nDOWN  : Enter pipe`), pos(width() / 4, height() / 3)])

    function makeBig() {
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                }
            },
            isBig() {
                return isBig
            },
            shrink() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                CURRENT_PLAYER_SCALE = PLAYER_SCALE_SMALL
                isBig = false
            },
            grow() {
                this.scale = vec2(1.2)
                isBig = true     
            }
        }
    }

    const player = add([
        sprite('jim'),
        pos(64, 64),
        body({maxVel: 420,}),
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
            gameLevel.spawn('@', obj.gridPos.sub(0,1))
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
        slack.dir =- slack.dir
    })

    player.collides('slack', (slack) => {
        play('life')
        destroy(slack)
        scoreLabel.value += 100
        scoreLabel.text = `Score: ${scoreLabel.value}`
        // need to add power up effect discuss with Ed
        LIVES_REMAINING += 1
        livesLabel.value = LIVES_REMAINING
        livesLabel.text = 'Lives Remaining: ' + LIVES_REMAINING
    })

    player.collides('coffee', (coffee) => {
        play('powerup')
        destroy(coffee)
        scoreLabel.value += 10
        scoreLabel.text = `Score: ${scoreLabel.value}`
        player.grow()
    })

    player.collides('coin', (coin) => {
        play('coin')
        destroy(coin)
        scoreLabel.value += 10
        scoreLabel.text = `Score: ${scoreLabel.value}`
    })

    player.collides('code-scroll', (code) => {
        play('code')
        destroy(code)
        LINES_OF_CODE += 10
        codeLabel.text = 'Uncommited Code: ' + LINES_OF_CODE
    })

    player.collides('gold-code-scroll', (code) => {
        play('code')
        destroy(code)
        LINES_OF_CODE += 25
        codeLabel.text = 'Uncommited Code: ' + LINES_OF_CODE
    })
    
    player.collides('github', (g) => {
        play('github')
        destroy(g)
        scoreLabel.value += (LINES_OF_CODE * 100)
        scoreLabel.text = `Score: ${scoreLabel.value}`
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
            if (parseInt(scoreLabel.value) >= 50000) {
                go('you-win',{score: scoreLabel.value})
            } else {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
                })
            }
        })
    })

    player.overlaps('baddie', (baddie) => {
        if (player.isBig()) {
            play('bump')
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
            player.jump(CURRENT_JUMP_FORCE)
            if (!isMoving) {
                player.play('jump')
                isJumping = true
            }
        }
    })

})

scene('lose', ({ score, level }) => {
    add([
        text(`Lives remaining: ${LIVES_REMAINING}\n\nHit SPACE to retry the level!`), 
        origin('left'), 
        pos(width()/2, height()/ 2),
        scale(0.8)
    ])
    LINES_OF_CODE = 0
    keyPress("space", () => {
		go("game", {level: level, score: score});
	});
})

scene('gameover', ({score}) => {
        
    add([
        sprite("angry-jim-head"),
        pos(40,40),
        scale(0.8)
    ])

    const gameOver = add([
        text('Game Over'),
        pos((width()/2), (height()/2)),
        origin('center'),
        scale(0.7)
    ])

    gameOver.action(() => {
        gameOver.scale = Math.sin(time()) * 5;
	});
    
    add([
        text('You let Jim down!'),
        pos(width()/2, (height()/2)+64),
        origin('center'),
        scale(0.8)
    ])

    add([
        text('Your score: ' + score),
        pos((width()/2), (height()/2)+104),
        origin('center'),
        scale(0.8)
    ])

    add([
        text('Hit space to try again'),
        pos((width()/2), (height()/2)+144),
        origin('center'),
        scale(0.8)
    ])

    LINES_OF_CODE = 0
    keyPress("space", () => {
        LIVES_REMAINING = 3; //needed to put LIVES_REMAINING back to 3
        go("game", {level: 0, score: 0});
    });
})
scene('you-win', ({score}) => {
        
    add([
        sprite("jim-head"),
        pos(40,40),
        scale(0.8)
    ])

    const youWin = add([
        text('YOU WIN!'),
        pos((width()/2), (height()/2)),
        origin('center'),
        scale(0.7)
    ])

    youWin.action(() => {
        youWin.scale = Math.sin(time()) * 5;
	});
    
    add([
        text('You saved Jim and made him very happy!'),
        pos(width()/2, (height()/2)+64),
        origin('center'),
        scale(0.8)
    ])

    add([
        text('Your score: ' + score),
        pos((width()/2), (height()/2)+104),
        origin('center'),
        scale(0.8)
    ])

    add([
        text('Hit space to play again'),
        pos((width()/2), (height()/2)+144),
        origin('center'),
        scale(0.8)
    ])

    LINES_OF_CODE = 0
    keyPress("space", () => {
        LIVES_REMAINING = 3; //needed to put LIVES_REMAINING back to 3
        go("game", {level: 0, score: 0});
    });

})

go("splash")