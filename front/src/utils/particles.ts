// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// canvas.width = 200;
// canvas.height = 100;

// <script>
//   import { onMount } from 'svelte';

//   let canvas;

//   onMount(() => {
//     const ctx = canvas.getContext('2d');
//     // your canvas drawing code goes here
//     // for example:
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#FF0000';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   });
// </script>

// <canvas bind:this={canvas} width="640" height="480"></canvas>

const particles: Particle[] = [];
const numParticles = 10;

class Particle {
  canvas: any = undefined;
  ctx: any = undefined;
  x: number = -1;
  xDirection: number = -1;
  y: number = -1;
  speed: number = -1;
  radius: number = -1;
  color: string = "";
  constructor(canvas: any, ctx: any) {
    if (!canvas || !ctx) return;
    this.canvas = canvas;
    this.canvas.width = 331;
    this.canvas.height = 105;
    this.ctx = canvas.getContext("2d");
    this.x = Math.random() * canvas.width;
    this.xDirection = Math.random() < 0.5 ? -1 : 1; // -1 for left, 1 for right
    this.y = 0;
    this.speed = Math.random() * 1 + 0.05;
    console.log("speed", this.speed);
    this.radius = Math.random() * 1 + 2;
    this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${
      Math.random() * 255
    })`;
  }

  update() {
    this.y += this.speed;
    this.x += this.xDirection * (Math.random() * 2); // Adjust this factor for the horizontal movement
    if (this.y > this.canvas.height) {
      this.y = 0;
      this.x = Math.random() * this.canvas.width;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

export function createParticles(canvas: any, ctx: any) {
  if (!canvas || !ctx) return;
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(canvas, ctx));
  }
}

export function animate(canvas: any, ctx: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(() => animate(canvas, ctx));
}

// createParticles();
// animate();
