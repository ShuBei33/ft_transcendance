<script lang="ts">
  import Typography from "../../components/Typography.svelte";
  import Input from "../../components/Input.svelte";
  import ChromaRender from "../../components/chromaRender.svelte";
  import Button from "../../components/Button.svelte";
  import { handle } from "./handlers";
    import { user } from "$lib/stores";
    import type { Chroma } from "$lib/models/prismaSchema";

  const handler = new handle();
  let searchValue = "";
  export let data;
  const handleSearch = () => {
    return "";
  };
  $: matchSearch = (chroma: Chroma): boolean => {
    if (searchValue.length < 3)
      return true;
    return chroma.id.toLowerCase().includes(searchValue.toLowerCase());
  }
  $: ownedChromaIds = $user?.chromas.map(chroma => chroma.id) || [];
  $: chromasNotOwned = data.chromas.filter(chroma => !ownedChromaIds?.includes(chroma.id) && matchSearch(chroma))
</script>

<main>
  <div class="shop-wrapper">
    <section class="header">
      <Typography big class="... title">
        <h1>
          {"Store"}
        </h1>
      </Typography>
    </section>
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
      {#if data && chromasNotOwned.length}
        <div class="render-chromas">
          {#each chromasNotOwned as chroma}
            <div class="card">
              <div class="top">
                <ChromaRender stops={JSON.parse(chroma.fill)} />
              </div>
              <Typography class="... name">{chroma.id}</Typography>
              <Button on:click={() => handler.ChromaBuy(chroma.id)}><Typography>{`Purchase ${chroma.price} 🟡`}</Typography></Button>
            </div>
          {/each}
        </div>
      {/if}
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
    .card {
      height: 200px;
      width: 200px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0.5em;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.5em;
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
