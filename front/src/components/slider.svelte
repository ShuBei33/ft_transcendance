<script lang="ts">
  import { onMount } from "svelte";
  import Typography from "./Typography.svelte";

  let selectedLevel = 1;
  export let onChange: (value: string) => void = () => {};
  export let initialValue: string = "";
  export let levels: string[] = [];
  let spanRefs: HTMLSpanElement[] = [];
  let thumbWidth = "";
  let translateThumb = "";
  $: {
    if (spanRefs[selectedLevel]) thumbWidth = `${spanRefs[selectedLevel].offsetWidth + 20}px`;
  }

  onMount(() => {
    if (initialValue.length) selectedLevel = levels.indexOf(initialValue);
  });

  $: isSelected = (index: number) => (selectedLevel == index && "selected") || "";
  function handleSliderChange(event: any) {
    selectedLevel = parseInt(event.target.value);
    console.log(spanRefs[selectedLevel]);
    console.log("!width", spanRefs[selectedLevel].offsetWidth);
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
    data-selected-level={levels[selectedLevel]}
  />
  <div class="slider-labels">
    {#each levels as level, i}
      <div class={`slider-level-wrapper ${(i == selectedLevel && "active") || ""}`}>
        <Typography bind:externalRef={spanRefs[i]} class={`... sliderText ${isSelected(i)}`}
          >{level}</Typography
        >
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../lib/style/colors.scss";
  .slider-container {
    width: 300px;
    position: relative;
    margin: 50px auto;
  }

  .slider-level-wrapper {
    height: auto;
    width: auto;
    border-radius: 10px;
    padding: 0.5em;
  }
  .active {
    background-color: $shipsOfficer;
    cursor: pointer;
  }

  .slider {
    width: calc(100% - 1em);
    padding: 0.5em;
    height: 2em;
    border-radius: 10px;
    background: darken($shipsOfficer, 8%);
    border: 1px solid black;
    appearance: none;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
    z-index: 1;
  }
  .slider::-webkit-slider-thumb {
    opacity: 0;
    width: var(--thumb-width, 50px); /* adjusted for the text */
    height: 30px;
    border-radius: 1em;
    background: #4caf50;
    cursor: pointer;
    appearance: none;
    position: relative;
    font-size: 0.8em;
    color: white;
    text-align: center;
    line-height: 30px;
  }

  .slider::-webkit-slider-thumb::before {
    opacity: 0;
    content: attr(data-selected-level);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .slider::-moz-range-thumb {
    opacity: 0;
    width: var(--thumb-width, 50px);
    height: 30px;
    border-radius: 15px;
    background: #4caf50;
    font-size: 0.8em;
    color: white;
    text-align: center;
    line-height: 30px;
  }

  .slider-labels {
    position: absolute;
    top: 48%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;

    justify-content: space-between;
    padding: 0 15px;
    pointer-events: none;
  }

  :global(.sliderText) {
    color: #666;
    font-size: 0.8em;
    transition: color 0.2s;
  }

  :global(.selected) {
    color: #4caf50;
  }
</style>
