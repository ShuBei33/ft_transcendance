type fill = string | CanvasGradient | CanvasPattern;

interface DefaultSettings {
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

const getDefaultSettings = () => {};

const defaultSettings: DefaultSettings = {
  playerOnePoints: 0,
  playerTwoPoints: 0,
  ballRadius: 10,
  ballInitialX: 800 / 2,
  ballInitialY: 600 / 2,
  ballX: 800 / 2,
  ballY: 600 / 2,
  ballSpeedX: 5,
  ballSpeedY: -5,
  trailLength: 10,
  paddleWidth: 100,
  paddleHeight: 10,
  leftPaddleX: (800 - 100) / 2,
  rightPaddleX: (800 - 100) / 2,
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

export default class Pong {
  settings = defaultSettings;

  // update() {
  //   // Move paddles based on arrow key presses
  //   if (this.settings.leftPressed && this.settings.leftPaddleX > 0) {
  //     this.settings.leftPaddleX -= this.settings.paddleSpeed;
  //   }
  //   if (
  //     this.settings.rightPressed &&
  //     this.settings.leftPaddleX < _canvas.width - this.settings.paddleWidth
  //   ) {
  //     this.settings.leftPaddleX += this.settings.paddleSpeed;
  //   }
  //   if (this.settings.aPressed && this.settings.rightPaddleX > 0) {
  //     this.settings.rightPaddleX -= this.settings.paddleSpeed;
  //   }
  //   if (
  //     this.settings.dPressed &&
  //     this.settings.rightPaddleX < _canvas.width - this.settings.paddleWidth
  //   ) {
  //     this.settings.rightPaddleX += this.settings.paddleSpeed;
  //   }

  //   // Ball collision with paddles
  //   if (
  //     this.settings.ballY + this.settings.ballRadius >
  //       _canvas.height - this.settings.paddleHeight &&
  //     this.settings.ballX > this.settings.leftPaddleX &&
  //     this.settings.ballX <
  //       this.settings.leftPaddleX + this.settings.paddleWidth
  //   ) {
  //     const relativeIntersectX =
  //       this.settings.ballX -
  //       (this.settings.leftPaddleX + this.settings.paddleWidth / 2);
  //     const normalizedRelativeIntersectX =
  //       relativeIntersectX / (this.settings.paddleWidth / 2);
  //     const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

  //     this.settings.ballSpeedX =
  //       this.settings.ballSpeedY * Math.tan(bounceAngle);
  //     this.settings.ballSpeedY = -this.settings.ballSpeedY;
  //   }

  //   if (
  //     this.settings.ballY - this.settings.ballRadius <
  //       this.settings.paddleHeight &&
  //     this.settings.ballX > this.settings.rightPaddleX &&
  //     this.settings.ballX <
  //       this.settings.rightPaddleX + this.settings.paddleWidth
  //   ) {
  //     const relativeIntersectX =
  //       this.settings.ballX -
  //       (this.settings.rightPaddleX + this.settings.paddleWidth / 2);
  //     const normalizedRelativeIntersectX =
  //       relativeIntersectX / (this.settings.paddleWidth / 2);
  //     const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

  //     this.settings.ballSpeedX =
  //       this.settings.ballSpeedY * Math.tan(bounceAngle);
  //     this.settings.ballSpeedY = -this.settings.ballSpeedY;
  //   }

  //   // Update ball position
  //   this.settings.ballX += this.settings.ballSpeedX;
  //   this.settings.ballY += this.settings.ballSpeedY;

  //   // Ball collision with walls
  //   if (
  //     this.settings.ballX + this.settings.ballRadius > _canvas.width ||
  //     this.settings.ballX - this.settings.ballRadius < 0
  //   ) {
  //     this.settings.ballSpeedX = -this.settings.ballSpeedX;
  //   }
  //   // if (this.settings.ballY - this.settings.ballRadius < 0) {
  //   //   this.settings.ballSpeedY = -this.settings.ballSpeedY;
  //   // }
  //   if (this.settings.ballY > _canvas.height || this.settings.ballY < 0) {
  //     if (this.settings.ballY < 0) this.settings.playerOnePoints++;
  //     else this.settings.playerTwoPoints++;
  //     this.settings.ballY = this.settings.ballInitialY;
  //     this.settings.ballX = this.settings.ballInitialX;

  //     // Generate a random direction (left or right) for the ball's respawn
  //     const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
  //     const randomDirectionY = Math.random() < 0.5 ? -1 : 1;

  //     // Generate random initial speeds for the ball
  //     const randomSpeedX = Math.random() * 4 + 2; // Speed between 2 and 6
  //     const randomSpeedY = Math.random() * 4 + 2; // Speed between 2 and 6

  //     // Set the ball's initial speed towards the randomly chosen direction
  //     this.settings.ballSpeedX = randomSpeedX * randomDirectionX;
  //     this.settings.ballSpeedY = randomSpeedY * randomDirectionY;

  //     // Calculate the respawn position based on the direction
  //     const respawnOffsetX =
  //       this.settings.ballSpeedX > 0
  //         ? -this.settings.ballRadius
  //         : this.settings.ballRadius;
  //     const respawnOffsetY =
  //       this.settings.ballSpeedY > 0
  //         ? -this.settings.ballRadius
  //         : this.settings.ballRadius;

  //     // Set the ball's respawn position while keeping it within the _canvas boundaries
  //     this.settings.ballX = Math.max(
  //       Math.min(
  //         this.settings.ballInitialX + respawnOffsetX,
  //         _canvas.width - this.settings.ballRadius,
  //       ),
  //       this.settings.ballRadius,
  //     );
  //     this.settings.ballY = Math.max(
  //       Math.min(
  //         this.settings.ballInitialY + respawnOffsetY,
  //         _canvas.height - this.settings.ballRadius,
  //       ),
  //       this.settings.ballRadius,
  //     );
  //   }
  // }

  gameLoop() {
    requestAnimationFrame(this.gameLoop);
  }
  constructor(settings?: DefaultSettings) {}
}
