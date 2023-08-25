import { clearInterval } from 'timers';

type fill = string | CanvasGradient | CanvasPattern;
type pongOnUpdateCallback = (gameData: DefaultSettings) => void;
type pongOnGameEndCallback = (gameData: DefaultSettings) => void;

interface PongCallback {
  onUpdate?: pongOnUpdateCallback;
  onGameEnd?: pongOnGameEndCallback;
}

export interface DefaultSettings {
  width: number;
  height: number;
  // back
  playerOnePoints: number;
  playerTwoPoints: number;
  ballRadius: number;
  ballInitialX: number;
  ballInitialY: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  trailLength: number;
  paddleWidth: number;
  paddleHeight: number;
  leftPaddleX: number;
  rightPaddleX: number;
  paddleSpeed: number;
  leftPressed: boolean;
  rightPressed: boolean;
  aPressed: boolean;
  dPressed: boolean;
  //front
  trailFill: fill;
  ballFill: fill;
  playerOnePaddleFill: fill;
  playerTwoPaddleFill: fill;
}

export const getDefaultSettings = (
  width: number,
  height: number,
): DefaultSettings => {
  return {
    width,
    height,
    playerOnePoints: 0,
    playerTwoPoints: 0,
    ballRadius: 10,
    ballInitialX: width / 2,
    ballInitialY: height / 2,
    ballX: width / 2,
    ballY: height / 2,
    ballSpeedX: 5,
    ballSpeedY: -5,
    trailLength: 10,
    paddleWidth: 100,
    paddleHeight: 10,
    leftPaddleX: (width - 100) / 2,
    rightPaddleX: (width - 100) / 2,
    paddleSpeed: 7,
    leftPressed: false,
    rightPressed: false,
    aPressed: false,
    dPressed: false,
    trailFill: 'rgba(8, 0, 255, 0.08)',
    playerOnePaddleFill: 'green',
    playerTwoPaddleFill: 'red',
    ballFill: 'blue',
  };
};

const defaultSettings: DefaultSettings = getDefaultSettings(800, 600);

export default class Pong {
  settings = defaultSettings;
  intervalId = -1;
  public static targetFPS = 60;
  public static intervalTime = 1000 / this.targetFPS;

  callBacks: PongCallback = {
    onUpdate() {},
  };

  update() {
    // Move paddles based on arrow key presses
    if (this.settings.leftPressed && this.settings.leftPaddleX > 0) {
      this.settings.leftPaddleX -= this.settings.paddleSpeed;
    }
    if (
      this.settings.rightPressed &&
      this.settings.leftPaddleX <
        this.settings.width - this.settings.paddleWidth
    ) {
      this.settings.leftPaddleX += this.settings.paddleSpeed;
    }
    if (this.settings.aPressed && this.settings.rightPaddleX > 0) {
      this.settings.rightPaddleX -= this.settings.paddleSpeed;
    }
    if (
      this.settings.dPressed &&
      this.settings.rightPaddleX <
        this.settings.width - this.settings.paddleWidth
    ) {
      this.settings.rightPaddleX += this.settings.paddleSpeed;
    }

    // Ball collision with paddles
    if (
      this.settings.ballY + this.settings.ballRadius >
        this.settings.height - this.settings.paddleHeight &&
      this.settings.ballX > this.settings.leftPaddleX &&
      this.settings.ballX <
        this.settings.leftPaddleX + this.settings.paddleWidth
    ) {
      const relativeIntersectX =
        this.settings.ballX -
        (this.settings.leftPaddleX + this.settings.paddleWidth / 2);
      const normalizedRelativeIntersectX =
        relativeIntersectX / (this.settings.paddleWidth / 2);
      const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

      this.settings.ballSpeedX =
        this.settings.ballSpeedY * Math.tan(bounceAngle);
      this.settings.ballSpeedY = -this.settings.ballSpeedY;
    }

    if (
      this.settings.ballY - this.settings.ballRadius <
        this.settings.paddleHeight &&
      this.settings.ballX > this.settings.rightPaddleX &&
      this.settings.ballX <
        this.settings.rightPaddleX + this.settings.paddleWidth
    ) {
      const relativeIntersectX =
        this.settings.ballX -
        (this.settings.rightPaddleX + this.settings.paddleWidth / 2);
      const normalizedRelativeIntersectX =
        relativeIntersectX / (this.settings.paddleWidth / 2);
      const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

      this.settings.ballSpeedX =
        this.settings.ballSpeedY * Math.tan(bounceAngle);
      this.settings.ballSpeedY = -this.settings.ballSpeedY;
    }

    // Update ball position
    this.settings.ballX += this.settings.ballSpeedX;
    this.settings.ballY += this.settings.ballSpeedY;

    // Ball collision with walls
    if (
      this.settings.ballX + this.settings.ballRadius > this.settings.width ||
      this.settings.ballX - this.settings.ballRadius < 0
    ) {
      this.settings.ballSpeedX = -this.settings.ballSpeedX;
    }
    // if (this.settings.ballY - this.settings.ballRadius < 0) {
    //   this.settings.ballSpeedY = -this.settings.ballSpeedY;
    // }
    if (this.settings.ballY > this.settings.height || this.settings.ballY < 0) {
      if (this.settings.ballY < 0) this.settings.playerOnePoints++;
      else this.settings.playerTwoPoints++;
      this.settings.ballY = this.settings.ballInitialY;
      this.settings.ballX = this.settings.ballInitialX;

      // Generate a random direction (left or right) for the ball's respawn
      const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
      const randomDirectionY = Math.random() < 0.5 ? -1 : 1;

      // Generate random initial speeds for the ball
      const randomSpeedX = Math.random() * 4 + 2; // Speed between 2 and 6
      const randomSpeedY = Math.random() * 4 + 2; // Speed between 2 and 6

      // Set the ball's initial speed towards the randomly chosen direction
      this.settings.ballSpeedX = randomSpeedX * randomDirectionX;
      this.settings.ballSpeedY = randomSpeedY * randomDirectionY;

      // Calculate the respawn position based on the direction
      const respawnOffsetX =
        this.settings.ballSpeedX > 0
          ? -this.settings.ballRadius
          : this.settings.ballRadius;
      const respawnOffsetY =
        this.settings.ballSpeedY > 0
          ? -this.settings.ballRadius
          : this.settings.ballRadius;

      // Set the ball's respawn position while keeping it within the _canvas boundaries
      this.settings.ballX = Math.max(
        Math.min(
          this.settings.ballInitialX + respawnOffsetX,
          this.settings.width - this.settings.ballRadius,
        ),
        this.settings.ballRadius,
      );
      this.settings.ballY = Math.max(
        Math.min(
          this.settings.ballInitialY + respawnOffsetY,
          this.settings.height - this.settings.ballRadius,
        ),
        this.settings.ballRadius,
      );
    }
    this.callBacks.onUpdate(this.settings);
  }

  gameLoop() {
    this.update();
  }

  startGame() {
    this.intervalId = Number(
      setInterval(() => this.gameLoop(), Pong.intervalTime),
    );
  }

  stopGame(summary?: PongCallback['onGameEnd']) {
    if (this.intervalId) clearInterval(this.intervalId);
    summary && summary(this.settings);
    this.callBacks.onGameEnd(this.settings);
  }

  constructor(
    callBackFunctions: PongCallback,
    dimensions?: { width: number; height: number },
    settings?: DefaultSettings,
  ) {
    if (settings) this.settings = settings;
    if (dimensions) {
      this.settings.width = dimensions.width;
      this.settings.height = dimensions.height;
    }
    this.callBacks = callBackFunctions;
  }
}
