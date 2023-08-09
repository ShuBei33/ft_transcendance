const particles: Particle[] = [];
const numParticles = 80;

class Particle {
  isStar: boolean = false;
  canvas: any = undefined;
  ctx: any = undefined;
  x: number = -1;
  xDirection: number = -1;
  y: number = -1;
  speed: number = -1;
  radius: number = -1;
  sizeVariation: number = -1;
  color: string = "";
  constructor(canvas: any, ctx: any) {
    if (!canvas || !ctx) return;
    this.isStar = Math.random() < 0.5;
    this.canvas = canvas;
    this.canvas.width = 331;
    this.canvas.height = 105;
    this.ctx = canvas.getContext("2d");
    this.x = Math.random() * canvas.width;
    this.xDirection = Math.random() < 0.5 ? -1 : 1; // -1 for left, 1 for right
    this.y = 0;
    this.speed = Math.random() * 0.2 + 0.1;
    this.radius = Math.random() * 0.0001 + 0.0001;
    this.sizeVariation = Math.random() * 2 + 1;
    this.color = "rgb(255, 255, 255)";
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
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, 1, 1); // Draw a single pixel
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
