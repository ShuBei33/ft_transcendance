<script lang="ts">
  import { onMount } from "svelte";

  let _canvas: HTMLCanvasElement;
  //   cwidth="800" height="600"
  $: context = _canvas != undefined && _canvas.getContext("2d");
  let playerOnePoints = 0;
  let playerTwoPoints = 0;

  // Ball properties
  const ballRadius = 10;
  const ballInitialX = 800 / 2;
  const ballInitialY = 600 / 2;
  let ballX = ballInitialX;
  let ballY = ballInitialY;
  let ballSpeedX = 5;
  let ballSpeedY = -5;

  const trailLength = 10; // Number of trail segments to draw
  const trailOpacity = 0.08; // Opacity of each trail segment

  // Paddle properties
  const paddleWidth = 100;
  const paddleHeight = 10;
  let leftPaddleX = (800 - paddleWidth) / 2;
  let rightPaddleX = (800 - paddleWidth) / 2;
  const paddleSpeed = 7;

  // Keyboard controls
  let leftPressed = false;
  let rightPressed = false;
  let aPressed = false;
  let dPressed = false;

  function keyDownHandler(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      leftPressed = true;
    } else if (event.key === "ArrowRight") {
      rightPressed = true;
    }
    if (event.key === "a") {
      aPressed = true;
    } else if (event.key === "d") {
      dPressed = true;
    }
  }

  function keyUpHandler(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === "ArrowRight") {
      rightPressed = false;
    }
    if (event.key === "a") {
      aPressed = false;
    } else if (event.key === "d") {
      dPressed = false;
    }
  }

  // Update game state
  function update() {
    // Move paddles based on arrow key presses
    if (leftPressed && leftPaddleX > 0) {
      leftPaddleX -= paddleSpeed;
    }
    if (rightPressed && leftPaddleX < _canvas.width - paddleWidth) {
      leftPaddleX += paddleSpeed;
    }
    if (aPressed && rightPaddleX > 0) {
      rightPaddleX -= paddleSpeed;
    }
    if (dPressed && rightPaddleX < _canvas.width - paddleWidth) {
      rightPaddleX += paddleSpeed;
    }

    // Ball collision with paddles
    if (
      ballY + ballRadius > _canvas.height - paddleHeight &&
      ballX > leftPaddleX &&
      ballX < leftPaddleX + paddleWidth
    ) {
      const relativeIntersectX = ballX - (leftPaddleX + paddleWidth / 2);
      const normalizedRelativeIntersectX =
        relativeIntersectX / (paddleWidth / 2);
      const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

      ballSpeedX = ballSpeedY * Math.tan(bounceAngle);
      ballSpeedY = -ballSpeedY;
    }

    if (
      ballY - ballRadius < paddleHeight &&
      ballX > rightPaddleX &&
      ballX < rightPaddleX + paddleWidth
    ) {
      const relativeIntersectX = ballX - (rightPaddleX + paddleWidth / 2);
      const normalizedRelativeIntersectX =
        relativeIntersectX / (paddleWidth / 2);
      const bounceAngle = (normalizedRelativeIntersectX * Math.PI) / 3;

      ballSpeedX = ballSpeedY * Math.tan(bounceAngle);
      ballSpeedY = -ballSpeedY;
    }

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with walls
    if (ballX + ballRadius > _canvas.width || ballX - ballRadius < 0) {
      ballSpeedX = -ballSpeedX;
    }
    // if (ballY - ballRadius < 0) {
    //   ballSpeedY = -ballSpeedY;
    // }
    if (ballY > _canvas.height || ballY < 0) {
      if (ballY < 0) playerOnePoints++;
      else playerTwoPoints++;
      ballY = ballInitialY;
      ballX = ballInitialX;

      // Generate a random direction (left or right) for the ball's respawn
      const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
      const randomDirectionY = Math.random() < 0.5 ? -1 : 1;

      // Generate random initial speeds for the ball
      const randomSpeedX = Math.random() * 4 + 2; // Speed between 2 and 6
      const randomSpeedY = Math.random() * 4 + 2; // Speed between 2 and 6

      // Set the ball's initial speed towards the randomly chosen direction
      ballSpeedX = randomSpeedX * randomDirectionX;
      ballSpeedY = randomSpeedY * randomDirectionY;

      // Calculate the respawn position based on the direction
      const respawnOffsetX = ballSpeedX > 0 ? -ballRadius : ballRadius;
      const respawnOffsetY = ballSpeedY > 0 ? -ballRadius : ballRadius;

      // Set the ball's respawn position while keeping it within the _canvas boundaries
      ballX = Math.max(
        Math.min(ballInitialX + respawnOffsetX, _canvas.width - ballRadius),
        ballRadius
      );
      ballY = Math.max(
        Math.min(ballInitialY + respawnOffsetY, _canvas.height - ballRadius),
        ballRadius
      );
    }
  }

  // Draw game objects
  function draw() {
    if (!context) return;
    context.clearRect(0, 0, _canvas.width, _canvas.height);

    // Draw ball effect
    for (let i = 0; i < trailLength; i++) {
      const opacity = (trailOpacity * (trailLength - i)) / trailLength; // Adjusted opacity calculation
      context.fillStyle = `rgba(8, 0, 255, ${opacity})`;
      context.beginPath();
      context.arc(
        ballX - i * ballSpeedX,
        ballY - i * ballSpeedY,
        ballRadius,
        0,
        Math.PI * 2
      ); // Adjusted position based on speed
      context.fill();
    }

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();

    // Draw left paddle
    context.beginPath();
    context.rect(
      leftPaddleX,
      _canvas.height - paddleHeight,
      paddleWidth,
      paddleHeight
    );
    context.fillStyle = "red";
    context.fill();
    context.closePath();

    // Draw right paddle
    context.beginPath();
    context.rect(rightPaddleX, 0, paddleWidth, paddleHeight);
    context.fillStyle = "green";
    context.fill();
    context.closePath();
  }

  onMount(() => {
    function gameLoop() {
      update();
      draw();
      console.log("ballX", ballX);
      console.log("ballY", ballY);
      console.log("playerTwo", playerTwoPoints);
      console.log("playerOne", playerOnePoints);
      requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    gameLoop();
  });
</script>

<main>
  <canvas bind:this={_canvas} id="game_canvas" width="800px" height="600px" />
</main>

<style>
  canvas {
    border: 1px solid black;
    display: block;
    margin: 0 auto;
  }
</style>
