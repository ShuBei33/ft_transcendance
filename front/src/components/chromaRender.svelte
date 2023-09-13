<script lang="ts">
  import type { chromaGradient } from "$lib/models/chroma";
  export let stops: chromaGradient["stops"] = [];
  let _canvas: HTMLCanvasElement;
  $: context = _canvas && _canvas.getContext("2d");
  let gradient: CanvasGradient | undefined = undefined;
  $: (() => {
    if (!context || !_canvas) return;
    gradient = context.createLinearGradient(0, 0, 400, 0);
    stops.forEach((stop) => gradient?.addColorStop(stop.offset, stop.color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 200, 200);
  })();
</script>

<canvas bind:this={_canvas} id="game_canvas" width={`150px`} height={`150px`} />

<style lang="scss">
</style>
