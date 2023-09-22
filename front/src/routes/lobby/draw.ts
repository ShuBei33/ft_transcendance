import type { DefaultSettings } from "$lib/models/game";
import type { chromaGradient } from "$lib/models/chroma";

const paddleGradient = (context: CanvasRenderingContext2D, fill: string): CanvasGradient => {
  const stops: chromaGradient["stops"] = JSON.parse(fill);
  const gradient = context.createLinearGradient(0, 0, 400, 0);
  stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
  return gradient;
};

export default function draw(
  canvas: HTMLCanvasElement,
  context: false | CanvasRenderingContext2D | null,
  data: DefaultSettings | undefined
) {
  if (!context || !data) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball effect
  for (let i = 0; i < data.trailLength; i++) {
    // const opacity = (data.trailOpacity * (trailLength - i)) / trailLength; // Adjusted opacity calculation
    context.fillStyle = data.trailFill;
    context.beginPath();
    context.arc(
      data.ballX - i * data.ballSpeedX,
      data.ballY - i * data.ballSpeedY,
      data.ballRadius,
      0,
      Math.PI * 2
    ); // Adjusted position based on speed
    context.fill();
  }

  // Draw ball
  context.beginPath();
  context.arc(data.ballX, data.ballY, data.ballRadius, 0, Math.PI * 2);
  context.fillStyle = data.ballFill;
  context.fill();
  context.closePath();

  // Draw left paddle
  context.beginPath();
  context.rect(
    data.leftPaddleX,
    canvas.height - data.paddleHeight,
    data.paddleWidth,
    data.paddleHeight
  );
  context.fillStyle = paddleGradient(context, String(data.playerOnePaddleFill));
  context.fill();
  context.closePath();

  // Draw right paddle
  context.beginPath();
  context.rect(data.rightPaddleX, 0, data.paddleWidth, data.paddleHeight);
  context.fillStyle = paddleGradient(context, String(data.playerTwoPaddleFill));
  context.fill();
  context.closePath();
}
