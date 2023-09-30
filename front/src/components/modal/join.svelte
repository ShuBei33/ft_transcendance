<script lang="ts">
  import { Channel } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores";
  import { onMount } from "svelte";
  import Input from "../Input.svelte";
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import type { ChannelExtended } from "$lib/models/prismaSchema";
  import Slider from "../slider.svelte";

  const _Channel = new Channel();
  let search = "";
  let currentPage = 0;
  const itemsPerPage = 10;
  const levels = ["PROTECTED", "ALL", "PUBLIC"];

  const fetchChannel = async () => {
    await _Channel
      .all()
      .then(({ data }) => ($dataStore.channels = data.data))
      .catch((e) => {});
  };

  onMount(() => {
    fetchChannel();
  });
  $: channels = $dataStore.channels;
  $: totalPages = Math.ceil(channels.length / itemsPerPage);
  $: paginatedChannels = channels.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  $: {
    if (search.length > 3)
      channels = $dataStore.channels.filter((chan) => {
        const nameToLower = chan.name.toLowerCase();
        const searchToLower = search.toLowerCase();

        return nameToLower.includes(searchToLower);
      });
    else channels = $dataStore.channels;
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
    }
  }
</script>

<div class="joinchan">
  <div class="filter">
    <div class="slider-result">
      <Slider
        {levels}
        initialValue={"ALL"}
        onChange={(value) => {
          // payload["visibility"] = value;
          console.log("slider change", value);
        }}
      />
      <Typography class="... result">{`${paginatedChannels.length} / 10`}</Typography>
    </div>
    <div class="search">
      <Input
        attributes={{
          id: "search",
          type: "text",
          placeholder: "search",
          name: "search",
        }}
        onChange={(value) => (search = value)}
      />
      <Button variant="error" disabled={search.length == 0} on:click={() => (search = "")}>
        <Typography>{"x"}</Typography>
      </Button>
    </div>
  </div>
  <div class="bot">
    <div class="content">
      <table>
        <thead>
          <tr>
            <th><Typography>{"Name"}</Typography></th>
            <th><Typography>{"Visibility"}</Typography></th>
            <th><Typography>{"Members"}</Typography></th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedChannels as channel (channel.id)}
            <tr>
              <td
                ><Typography>
                  {channel.name}
                </Typography></td
              >
              <td
                ><Typography>
                  {channel.visibility}
                </Typography></td
              >
              <td>
                <Typography>
                  {channel.channelUsers.length}
                </Typography>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <Button on:click={previousPage} disabled={currentPage === 0}>
        <Typography>
          {"Previous"}
        </Typography></Button
      >
      <Typography>{currentPage + 1} / {totalPages}</Typography>
      <Button on:click={nextPage} disabled={currentPage === totalPages - 1}>
        <Typography>
          {"Previous"}
        </Typography>
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../lib/style/colors.scss";
  .joinchan {
    height: 70vh;
    width: 60vw;
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
  }
  .top {
    display: flex;
  }
  .slider-result {
    column-gap: 0.5em;
    display: flex;
  }
  .search {
    width: inherit;
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
  }
  :global(#search) {
    width: calc(100% - 1em);
  }
  table {
    width: 100%;
    border-collapse: separate; // Changed to use border-radius on table cells
    border-spacing: 0; // Removes spacing between cells

    thead:after {
      content: "";
      display: block;
      height: 0.3em; // Adjust this for desired "margin" height
    }

    th,
    td {
      border: 1px solid black;
      padding: 0.5em;
      text-align: left;
    }

    th {
      background-color: darken($shipsOfficer, 8%);
    }

    tbody tr {
      background-color: darken($shipsOfficer, 4%);
      cursor: pointer;
    }

    tbody tr:hover {
      background-color: darken($shipsOfficer, 8%);
      // background-color: #fafafa;
    }

    // Rounded top corners for the first row's first and last cell
    tbody tr:first-child > td:first-child {
      border-top-left-radius: 8px;
    }

    tbody tr:first-child > td:last-child {
      border-top-right-radius: 8px;
    }

    // Rounded bottom corners for the last row's first and last cell
    tbody tr:last-child > td:first-child {
      border-bottom-left-radius: 8px;
    }

    tbody tr:last-child > td:last-child {
      border-bottom-right-radius: 8px;
    }

    thead tr:first-child > th:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    thead tr:last-child > th:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
  }
  :global(.result) {
    align-self: center;
  }
</style>
