<script lang="ts">
  import { Channel } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores";
  import { onMount } from "svelte";
  import Input from "../Input.svelte";
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import type { ChannelExtended } from "$lib/models/prismaSchema";

  const _Channel = new Channel();
  let search = "";
  let currentPage = 0;
  const itemsPerPage = 2;

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
  <div class="top">
    <Input
      attributes={{
        id: "search",
        type: "text",
        placeholder: "search",
        name: "search",
      }}
      onChange={(value) => (search = value)}
    />
    <Button variant="error" disabled={search.length == 0}>
      <Typography>{"x"}</Typography>
    </Button>
  </div>
  <div class="bot">
    <div class="content">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Visibility</th>
            <th>Members</th>
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
  .joinchan {
    height: 70vh;
    width: 60vw;
  }
  .top {
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
    border-collapse: collapse;

    th,
    td {
      border: 1px solid #e1e1e1;
      padding: 0.5em;
      text-align: left;
    }

    th {
      background-color: #f7f7f7;
    }

    tbody tr:hover {
      background-color: #fafafa;
    }
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
  }
</style>
