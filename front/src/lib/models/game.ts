
export type fill = string | CanvasGradient | CanvasPattern;

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