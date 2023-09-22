<script lang="ts">
  import { onMount } from "svelte";

  let selectedLevel = 1;
  export let onChange: (value: string) => void = () => {};
  export let initialValue: string = "";
  export let levels: string[] = [];

  onMount(() => {
    if (initialValue.length) selectedLevel = levels.indexOf(initialValue);
  });

  function handleSliderChange(event: any) {
    console.log(event.target.value);
    selectedLevel = parseInt(event.target.value);
    onChange(levels[selectedLevel]);
  }
</script>

<div class="slider-container">
  <input
    type="range"
    min="0"
    max={levels.length - 1}
    step="1"
    class="slider"
    bind:value={selectedLevel}
    on:input={handleSliderChange}
  />
  <p>Selected: {levels[selectedLevel]}</p>
</div>

<style>
  .slider-container {
    width: 300px;
    margin: 50px auto;
  }

  .slider {
    width: 100%;
    height: 15px;
    border-radius: 10px;
    background: #ccc;
    appearance: none;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
</style>
