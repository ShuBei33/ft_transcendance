<script lang="ts">
  import Typography from "../../components/Typography.svelte";
  import Input from "../../components/Input.svelte";
  import ChromaRender from "../../components/chromaRender.svelte";
  import Button from "../../components/Button.svelte";
  import { classNames as cn } from "$lib/utils/classNames";
  import type { ClassNamesObject } from "$lib/utils/classNames";
  import { ui, user } from "$lib/stores";
  import { onMount } from "svelte";
  import type { Chroma } from "$lib/models/prismaSchema";

  onMount(() => {
    if ($ui.game.selectedChroma == "" && $user?.chromas.length)
      $ui.game.selectedChroma = $user.chromas[0].id;
  });

  let searchValue = "";
  const handleSearch = () => {
    return "";
  };

  $: chromaCardCn = (chroma?: Chroma): ClassNamesObject => {
    return {
      card: true,
      selected: {
        subClass: $ui.game.selectedChroma == chroma?.id || $ui.game.selectedChroma == "",
      },
    };
  };

  $: matchSearch = (chroma: Chroma): boolean => {
    if (searchValue.length < 3) return true;
    const test = chroma.id.toLowerCase().includes(searchValue.toLowerCase());
    return test;
  };
  $: ownedChromaIds = $user?.chromas.map((chroma) => chroma.id) || [];
  $: chromasOwned =
    $user?.chromas.filter((chroma) => ownedChromaIds?.includes(chroma.id) && matchSearch(chroma)) ||
    [];
</script>

<main>
  <div class="shop-wrapper">
    <section class="chroma">
      <div class="header">
        <Typography big class="... title">
          <h2>
            {"Chroma"}
          </h2>
        </Typography>
        <Input
          attributes={{
            id: "search",
            type: "text",
            placeholder: "search",
            name: "search",
          }}
          class="chat-input"
          onChange={(_value) => (searchValue = _value)}
          onSubmit={handleSearch}
        />
      </div>
        <div class="render-chromas">
          <button
            class={cn(chromaCardCn())}
            on:click={() => {
              $ui.game.selectedChroma = "";
            }}
          >
            <div class="top">
              <ChromaRender
                stops={JSON.parse(
                  JSON.stringify([
                    { offset: 0, color: "#000000" },
                    { offset: 1, color: "#000000" },
                  ])
                )}
              />
            </div>
            <Typography class="... name">{"NONE"}</Typography>
          </button>
          {#each chromasOwned as chroma}
            <button
              class={cn(chromaCardCn(chroma))}
              on:click={() => {
                $ui.game.selectedChroma = chroma.id;
              }}
            >
              <div class="top">
                <ChromaRender stops={JSON.parse(chroma.fill)} />
              </div>
              <Typography class="... name">{chroma.id}</Typography>
            </button>
          {/each}
        </div>
    </section>
  </div>
</main>

<style lang="scss">
  .shop {
    .header {
      :global(.title) {
        align-self: center;
      }
    }
  }
  .chroma {
    .header {
      :global(.title) {
        align-self: center;
      }
      display: flex;
      flex-direction: row;
      justify-content: center;
      column-gap: 0.5em;
      width: 20em;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 0.5em;
  }
  .shop-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  section {
    align-self: center;
  }
  .render-chromas {
    width: 80vw;
    display: flex;
    column-gap: 0.5em;
    .card,
    .card-selected {
      height: 200px;
      width: 200px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0.5em;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.5em;
      cursor: pointer;
      border: 0;
      &-selected {
        border: 3px solid white;
      }
      .top {
        align-self: center;
        // align-items: center;
      }
    }
  }
  :global(.name) {
    display: flex;
    justify-content: center;
  }
</style>
