<script lang="ts">
  import { onMount } from "svelte";
  import Page from "../routes/+page.svelte";

  let className: string | undefined = undefined;
  let useVariant = false;
  export const defaultClass = "generic-button";
  export { className as class };

  const parseClass = (className: string): string => {
    let result = "";
    if (className && className.length > 3) {
      if (className.substring(0, 3) == "...") {
        result = `${defaultClass} ${className.substring(3).trim()}`;
      }
    }
    return result;
  };

  onMount(() => {
    if (!className) className = defaultClass;
    else className = parseClass(className);
    useVariant = true;
  });

  $: {
    if (useVariant) className = `${className} ${variant}`;
  }

  export let variant: "error" | "warning" | "success" | "default" = "default";
  export let disabled: boolean = false;
</script>

<!-- prettier-ignore -->
<button on:click|preventDefault class={className} disabled={disabled}>
  <slot />
</button>

<style lang="scss">
  @use "../lib/style/mixins";
  @use "../lib/style/variables.scss" as var;

  button {
    &:disabled {
      pointer-events: none;
      opacity: 0.4;
    }
  }
  .generic-button.error {
    @include mixins.button-style(var.$errorColor);
  }

  .generic-button.warning {
    @include mixins.button-style(var.$warningColor);
  }

  .generic-button.success {
    @include mixins.button-style(var.$successColor);
  }

  .generic-button.default {
    @include mixins.button-style(var.$defaultColor);
  }
</style>
