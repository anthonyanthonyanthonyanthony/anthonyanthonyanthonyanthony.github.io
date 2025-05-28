const size = 840;
const grid_size = 20;
const grid_amount = size / grid_size;

gs = "start"

let snakes = [
  {
    direction: "right",
    direction2: "right",
    segments: [{x:3, y:1}, {x:2, y:1}, {x:1, y:1}],
    llsegment: {x:1, y:1}
  },
  {
    direction: "left",
    direction2: "left",
    segments: [{x:grid_amount - 4, y:grid_amount - 2}, {x:grid_amount - 3, y:grid_amount - 2}, {x:grid_amount - 2, y:grid_amount - 2}],
    llsegment: {x:grid_amount - 2, y:grid_amount - 2}
    }
]

let results = new Array(snakes.length).fill(false)

function setup() {
createCanvas(size, size)
}

function draw() {
    // makes background, and grid
    if (gs == "start") {
        background(0)
        textAlign(CENTER, CENTER)
        fill(255)
        textSize(36)
        text("Press Space to Play!", size / 2, size / 2)
        text("Player 1: Green, WASD", size / 2, size * 7 / 10)
        text("Player 2: Red, IJKL", size / 2, size * 8 / 10)
    }
    if (gs == "play") {
background(100);
    stroke(100, 100, 100);
    fill(0, 0, 0);
    for (let x = 0; x < grid_amount; x++) {
        rect(x * grid_size, 0, grid_size, grid_size)
        rect(x * grid_size, (grid_amount - 1) * grid_size, grid_size, grid_size)
    }
    for (let y = 1; y < grid_amount - 1; y++) {
        rect(0, y * grid_size, grid_size, grid_size)
        rect((grid_amount - 1) * grid_size, y * grid_size, grid_size, grid_size)
    }

    fill(120, 230, 120);
    for (let y = 1; y < grid_amount - 1; y++) {
        for (let x = 1; x < grid_amount - 1; x++) {
            rect(x * grid_size, y * grid_size, grid_size, grid_size)
        }
    }

    // snakes move
    if (frameCount % 5 == 0) {
        snake_move(snakes[0])
        snake_move(snakes[1])
    }

    // draw snakes
    stroke(0)

    fill(255, 255, 255)
    rect(snakes[0].segments[0].x * grid_size, snakes[0].segments[0].y * grid_size, grid_size, grid_size)
    fill(0, 255, 0)
    snake_draw(snakes[0])

    fill(255, 255, 255)
    rect(snakes[1].segments[0].x * grid_size, snakes[1].segments[0].y * grid_size, grid_size, grid_size)
    fill(255, 0, 0)
    snake_draw(snakes[1])

    // collsion checks -> stores in results
    results = collision(snakes)

    // check if collision: if does, other guy wins. if both collides -> tie
    conclusion(results)

    // lengthen snakes
    if (frameCount % 50 == 0) {
        snake_longer(snakes[0]);
        snake_longer(snakes[1]);
        }
    }
}

function snake_draw (snake) {
    for (let i = 1; i < snake.segments.length; i++) {
        rect(snake.segments[i].x * grid_size, snake.segments[i].y * grid_size, grid_size, grid_size)
    }
}

function snake_move (snake) {
    snake.direction = snake.direction2

    if (snake.direction == 'up') {
        snake.segments.unshift({x: snake.segments[0].x, y: snake.segments[0].y - 1})
    }
    else if (snake.direction == 'left') {
        snake.segments.unshift({x: snake.segments[0].x - 1, y: snake.segments[0].y})
    }
    else if (snake.direction == 'down') {
        snake.segments.unshift({x: snake.segments[0].x, y: snake.segments[0].y + 1})
    }
    else if (snake.direction == 'right') {
        snake.segments.unshift({x: snake.segments[0].x + 1, y: snake.segments[0].y})
    }
    snake.llsegment.x = snake.segments[snake.segments.length - 1].x
    snake.llsegment.y = snake.segments[snake.segments.length - 1].y
    snake.segments.pop()
}

function collision (snakes) {
    let results = new Array(snakes.length).fill(false);
    for (let i = 0; i < snakes.length; i++) {
        // perimeter
        if (snakes[i].segments[0].x == 0 || snakes[i].segments[0].x == grid_amount - 1 || snakes[i].segments[0].y == 0 || snakes[i].segments[0].y == grid_amount - 1) {
            results[i] = true
            continue
        }
        // self
        for (let j = 1; j < snakes[i].segments.length; j++) {
            if (snakes[i].segments[0].x == snakes[i].segments[j].x && snakes[i].segments[0].y == snakes[i].segments[j].y) {
                results[i] = true
                break
            }
        }
        if (results[i]) {
            continue
        }
        // other
        for (let j = 0; j < snakes.length; j++) {
            if (j == i) {
                continue;
            }
            for (let k = 0; k < snakes[j].segments.length; k++) {
                if (snakes[i].segments[0].x == snakes[j].segments[k].x && snakes[i].segments[0].y == snakes[j].segments[k].y) {
                    results[i] = true
                    break
                }
            }
            if (results[i]) {
                break
            }
        }
        if (results[i]) {
            continue
        }
    }
    return results
}


function conclusion (results) {
    let alive = []
    for (let i = 0; i < results.length; i++) {
        if (!results[i]) {
            alive.push(i)
        }
    }

    textAlign(CENTER, CENTER)
    fill(255)
    textSize(36)

    if (alive.length == 0) {
        text("Tie!", size / 2, size / 2)
        gs = "end"
    }
    else if (alive.length == 1) {
        text("Player " + (alive[0] + 1) + " wins!", size / 2, size / 2)
        gs = "end"
    }
}


function snake_longer (snake) {
    snake.segments.push({x: snake.llsegment.x, y: snake.llsegment.y})
}

function keyPressed() {
    //mode
    if(keyCode == 32) {
        if(gs == "start") {
            gs = "play"
        }
        else if(gs == "end") {
            resetGame();
        }
    }

    //movement
    // player 1
    if ((key == 'W' || key == 'w') && snakes[0].direction !== 'down') {
        snakes[0].direction2 = 'up'
    }
    else if ((key == 'A' || key == 'a') && snakes[0].direction !== 'right') {
        snakes[0].direction2 = 'left'
    }
    else if ((key == 'S' || key == 's') && snakes[0].direction !== 'up') {
        snakes[0].direction2 = 'down'
    }
    else if ((key == 'D' || key == 'd') && snakes[0].direction !== 'left') {
        snakes[0].direction2 = 'right'
    }

    // player 2
    if ((key == 'I' || key == 'i') && snakes[1].direction !== 'down') {
        snakes[1].direction2 = 'up'
    }
    else if ((key == 'J' || key == 'j') && snakes[1].direction !== 'right') {
        snakes[1].direction2 = 'left'
    }
    else if ((key == 'K' || key == 'k') && snakes[1].direction !== 'up') {
        snakes[1].direction2 = 'down'
    }
    else if ((key == 'L' || key == 'l') && snakes[1].direction !== 'left') {
        snakes[1].direction2 = 'right'
    }
}

function resetGame() {
snakes = [
  {
    direction: "right",
    direction2: "right",
    segments: [{x:3, y:1}, {x:2, y:1}, {x:1, y:1}],
    llsegment: {x:1, y:1}
  },
  {
    direction: "left",
    direction2: "left",
    segments: [{x:grid_amount - 4, y:grid_amount - 2}, {x:grid_amount - 3, y:grid_amount - 2}, {x:grid_amount - 2, y:grid_amount - 2}],
    llsegment: {x:grid_amount - 2, y:grid_amount - 2}
    }
]

results = new Array(snakes.length).fill(false)
    gs = "start"
}
