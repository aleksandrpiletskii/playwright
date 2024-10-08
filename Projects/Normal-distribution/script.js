const BALL_SIZE = 0.15;
const NAIL_SIZE = BALL_SIZE * 4;
const LANE_SIZE = BALL_SIZE * 6;
const LANE_NUM = 25;
const SIZE = LANE_SIZE * LANE_NUM * 2;
const LANE_MARGIN = 1.75;
const xPos = (x, y) => {
    return (x * 2 - Math.abs(y)) * LANE_SIZE;
};

const yPos = (y) => {
    return SIZE - y * LANE_SIZE * LANE_MARGIN;
};

const LANE_TOP_YPOS = yPos(LANE_NUM);
const LANE_LENGTH = SIZE / 1.6 + LANE_TOP_YPOS;
const BALL_NUM = 1000;
const pl = planck,
    Vec2 = pl.Vec2;
const world = pl.World({
    gravity: Vec2(0, -70)
});

var world1 = world;
const board = world1.createBody();
board.render = { fill: "#1e5f74", stroke: "#1e5f74" };
board.createFixture(
    //
    pl.Chain([
        Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, yPos(-3)),
        Vec2(xPos(0, -3), yPos(-3)),
        Vec2(xPos(0, -1), yPos(-1)),
        Vec2(xPos(0, 1), yPos(1)),
        Vec2(xPos(0, LANE_NUM), LANE_TOP_YPOS),
        Vec2(xPos(0, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
        Vec2(xPos(0, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
        Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
        Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
        Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
        Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS)
    ])
);

board.createFixture(
    pl.Chain([
        Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, yPos(-3)),
        Vec2(xPos(3, -3), yPos(-3)),
        Vec2(xPos(1, -1), yPos(-1)),
        Vec2(xPos(1, 1), yPos(1)),
        Vec2(xPos(LANE_NUM, LANE_NUM), LANE_TOP_YPOS),
        Vec2(xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
        Vec2(xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
        Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
        Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
        Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
        Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS)
    ])
);

for (let x = 1; x < LANE_NUM; x++) {
    //
    board.createFixture(
        pl.Chain([
            Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH),
            Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
            Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
            Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH)
        ])
    );
}
for (let y = 1; y <= LANE_NUM; y++) {
    for (let x = 0; x <= Math.abs(y); x++) {
        //
        board.createFixture(pl.Circle(Vec2(xPos(x, y), yPos(y)), NAIL_SIZE));
    }
}

let dropBallsId = 0;
let balls = [];

const dropBall = () => {
    const ball = world1.createDynamicBody({
        position: Vec2(xPos(2, -2) * 2 * Math.random() - xPos(2, -2), yPos(-2))
    });
    ball.render = { fill: "#fcdab7", stroke: "#1e5f74" };
    ball.createFixture(pl.Circle(BALL_SIZE), {
        density: 1000.0,
        friction: 10,
        restitution: 0.3
    });
    balls.push(ball);
};

const dropBalls = (ballNum) => {
    dropBallsId = setInterval(() => {
        dropBall();
        ballNum--;
        if (ballNum <= 0) {
            clearInterval(dropBallsId);
        }
    }, 200);
};

const clearBalls = () => {
    balls.forEach((ball) => {
        world1.destroyBody(ball);
    });
    balls = [];
    clearInterval(dropBallsId);
};

testbed.keydown = (code, char) => {

    switch (char) {

        case "X":
            clearBalls();
            dropBalls(BALL_NUM);
            break;

        case "D":
            dropBall();
            break;

        case "C":
            clearBalls();
            break;
    }
};

dropBalls(BALL_NUM);

return world1;
});