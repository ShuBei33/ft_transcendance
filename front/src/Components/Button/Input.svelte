<script lang="ts">
  export let size: "small" | "medium" | "large" = "large";
  export let type: "text" | "password" = "text";
  export let label: string | undefined = undefined;
  $: inputClass = `input ${size}`;
</script>

<main>
  <div class="inputContainer">
    {#if label}
      <label for={label} class="label">{label}</label>
    {/if}
    <input
      id={(label && label) || ""}
      name={(label && label) || ""}
      class={inputClass}
      {type}
    />
  </div>
</main>

<style lang="scss">
  .inputContainer {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
  }
  .label {
    font-family: "Heavitas";
    font-size: 3em;
    color: white;
    -webkit-text-stroke: 3px rgb(0, 0, 0); /* For WebKit browsers (Chrome, Safari) */
  }
  .input {
    border-radius: 20px;
    border: 4px solid #000;
    background: linear-gradient(
      180deg,
      #888 0%,
      rgba(255, 255, 255, 0.24) 100%
    );
    color: black;
    &.small {
      height: 65px;
      font-size: 1em;
      width: 165px * 2;
    }
    &.large {
      width: 250px * 2;
      height: 90px;
      font-size: 3em;
    }
    &.medium {
      height: 70px;
      font-size: 2em;
      width: 200px * 2;
    }
    &:focus {
      + label {
        color: red;
      }
    }
  }
</style>
