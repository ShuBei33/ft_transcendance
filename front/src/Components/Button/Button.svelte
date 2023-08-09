<script lang="ts">
  import { onMount } from "svelte";
  import { createParticles, animate } from "../../utils/particles";
  import { invertBoolean } from "../../utils";

  export let size: "small" | "medium" | "large" = "large";
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let diffuseParticles = false;
  let buttonPressed = false;
  $: buttonClass = `button ${size}`;

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      createParticles(canvas, ctx);
      animate(canvas, ctx);
    }
  });
</script>

<main>
  <button
    class={buttonClass}
    on:mouseenter={() => {
      diffuseParticles = invertBoolean(diffuseParticles);
    }}
    on:mouseleave={() => {
      diffuseParticles = invertBoolean(diffuseParticles);
      buttonPressed = false;
    }}
    on:click|preventDefault
    on:mousedown={() => (buttonPressed = invertBoolean(buttonPressed))}
    on:mouseup={() => (buttonPressed = invertBoolean(buttonPressed))}
  >
    <div class="canvas-container">
      <canvas
        bind:this={canvas}
        class={(!diffuseParticles && "hide-canvas") || ""}
      />
    </div>
    <span class={(buttonPressed && "gradient-text") || ""}>
      <slot />
    </span>
  </button>
</main>

<style lang="scss">
  .hide-canvas {
    display: none;
  }
  .button {
    --initial-saturation: 1;
    --active-saturation: 1.2;
    border-radius: 20px;
    border: 4px solid #0336c4;
    background: linear-gradient(
      180deg,
      #0067ff 0%,
      rgba(0, 240, 255, 0.24) 100%
    );
    // size variants
    &.small {
      height: 65px;
      width: 165px;
    }
    &.large {
      width: 250px;
      height: 90px;
    }
    &.medium {
      height: 70px;
      width: 200px;
    }

    flex-shrink: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:active {
      background: linear-gradient(
        180deg,
        #0047ff 0%,
        rgba(0, 240, 255, 0.24) 100%
      );
    }
    // text
    &::first-line {
      font-family: "Heavitas";
      font-size: 3em;
      color: white;
      -webkit-text-stroke: 3px purple; /* For WebKit browsers (Chrome, Safari) */
    }
    // glossy effect
    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.5), transparent);
      opacity: 0;
      transform: rotate(-45deg) scale(0);
      transition: opacity 0.4s, transform 0.4s;
    }

    &:hover::before {
      opacity: 1;
      transform: rotate(-45deg) scale(2);
    }
  }
  // particles
  .canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
  }
  .gradient-text {
    background-image: linear-gradient(
      180deg,
      #ffd600 10.44%,
      #ff7a00 84.38%,
      #ff2e00 95.83%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
</style>
