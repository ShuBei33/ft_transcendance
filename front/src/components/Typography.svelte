<script lang="ts">
  import { onMount } from "svelte";
  export let big = false;
  export let weight:
    | "Black"
    | "Bold"
    | "ExtraBold"
    | "ExtraLight"
    | "Light"
    | "Medium"
    | "Regular"
    | "SemiBold"
    | "Thin" = "Regular";

  let className: string | undefined = undefined;
  export let externalRef: HTMLSpanElement | undefined = undefined;
  export { className as class };

  const parseClass = (className: string): string => {
    let result = "";
    if (className && className.length > 3) {
      if (className.substring(0, 3) == "...") {
        const appendClass = big ? "bigTypo" : `typo-${weight}`;
        result = `${appendClass} ${className.substring(3).trim()}`;
      }
    }
    return result;
  };
</script>

{#if className}
  <span bind:this={externalRef} class={parseClass(className)}><slot /></span>
{:else if big}
  <span bind:this={externalRef} class="bigTypo"><slot /></span>
{:else}
  <span bind:this={externalRef} class={`typo-${weight}`}><slot /></span>
{/if}

<style lang="scss">
  @mixin custom-typo($font-family, $color) {
    font-family: $font-family;
    color: $color;
  }

  @font-face {
    src: url("$lib/fonts/ConcertOne/ConcertOne-Regular.ttf");
    font-family: "ConcertOne-Regular.ttf";
    font-weight: normal;
    font-style: normal;
  }
  .bigTypo {
    @include custom-typo("ConcertOne-Regular.ttf", white);
  }
  $font-folder: "$lib/fonts/Inter";

  @each $font-file
    in (
      "Inter-Black.ttf",
      "Inter-Bold.ttf",
      "Inter-ExtraBold.ttf",
      "Inter-ExtraLight.ttf",
      "Inter-Light.ttf",
      "Inter-Medium.ttf",
      "Inter-Regular.ttf",
      "Inter-SemiBold.ttf",
      "Inter-Thin.ttf"
    )
  {
    @font-face {
      font-family: quote("#{$font-file}");
      src: unquote("url('#{$font-folder}/#{$font-file}') format('truetype')");
      font-weight: normal;
      font-style: normal;
    }
  }

  .typo-Black {
    @include custom-typo("Inter-Black.ttf", white);
  }

  .typo-Bold {
    @include custom-typo("Inter-Bold.ttf", white);
  }

  .typo-ExtraBold {
    @include custom-typo("Inter-ExtraBold.ttf", white);
  }

  .typo-ExtraLight {
    @include custom-typo("Inter-ExtraLight.ttf", white);
  }

  .typo-Light {
    @include custom-typo("Inter-Light.ttf", white);
  }

  .typo-Medium {
    @include custom-typo("Inter-Medium.ttf", white);
  }

  .typo-Regular {
    @include custom-typo("Inter-Regular.ttf", white);
  }

  .typo-SemiBold {
    @include custom-typo("Inter-SemiBold.ttf", white);
  }

  .typo-Thin {
    @include custom-typo("Inter-Thin.ttf", white);
  }
</style>
