<script lang="ts">
  import type buttonProps from "../types";
  import { onMount } from "svelte";
  import { createParticles, animate } from "../../utils/particles";
  let canvas: any;
  let ctx: any;

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      console.log("source ctx", ctx);
      createParticles(canvas, ctx);
      animate(canvas, ctx);
    }
  });
  //   export let props: buttonProps | undefined;
</script>

<main>
  <button class="button">
    <canvas bind:this={canvas} height="100%" width="100%" />
    <slot />
  </button>
</main>

<style>
  .button {
    border-radius: 20px;
    border: 4px solid #000;
    background: linear-gradient(
      180deg,
      #ff7a00 0%,
      rgba(255, 214, 0, 0.24) 100%
    );
    width: 331px;
    height: 105px;
    flex-shrink: 0;
    cursor: pointer;
  }
</style>
