<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../Components/Button/Button.svelte";
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
  // onMount(() => {
  //   const ctx = canvas.getContext("2d");
  //   createParticles(canvas, ctx);
  //   animate(canvas, ctx);
  // });
</script>

<main>
  <h1>test components</h1>
  <Button>LOGIN</Button>
  <!-- <canvas bind:this={canvas} height="200px" width="200px" /> -->
</main>

<style lang="scss">
</style>
