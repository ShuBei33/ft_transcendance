<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../Components/Button/Button.svelte";
  import Input from "../../Components/Button/Input.svelte";
  import { createParticles, animate } from "../../utils/particles";
</script>

<main>
  <h1>test components</h1>
  <Button>LARGE</Button>
  <br />
  <Button size="medium">MEDIUM</Button>

  <br />
  <Button size="small">SMALL</Button>
  <br />
  <Input label="large" />
  <br />
  <Input label="medium" size="medium" />
  <br />
  <Input label="small" size="small" />

  <!-- <canvas bind:this={canvas} height="200px" width="200px" /> -->
</main>

<style lang="scss">
</style>
