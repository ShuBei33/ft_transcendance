<script lang="ts">
  import { Channel as ChannelApi } from "$lib/apiCalls";
  import { axiosConfig, data as dataStore, ui } from "$lib/stores";
  import { onMount } from "svelte";
  import Input from "../Input.svelte";
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import type { ChannelExtended } from "$lib/models/prismaSchema";
  import Slider from "../slider.svelte";
  import { get } from "svelte/store";
  import { addAnnouncement, removeAnnouncement } from "$lib/stores/session";
  const Channel = new ChannelApi();
  const ChatChannel = new ChannelApi(`${get(axiosConfig)?.baseURL}/chat/channel`);
  const itemsPerPage = 10;
  const levels = ["PROTECTED", "ALL", "PUBLIC"];
  // none, ascending, descending
  let sort: 0 | 1 | -1 = 0;
  let sortString: "○" | "+" | "-" = "○";
  let search = "";
  let selectedLevel = levels[1];
  let currentPage = 0;

  const setSort = () => {
    if (sort == 0) {
      sort = 1;
      sortString = "+";
    } else if (sort == 1) {
      sort = -1;
      sortString = "-";
    } else {
      sort = 0;
      sortString = "○";
    }
  };

  const fetchChannel = async () => {
    await Channel.all()
      .then(({ data }) => ($dataStore.channels = data.data))
      .catch((e) => {});
  };

  const joinChannel = async (channel: ChannelExtended, password?: string) => {
    let data: {
      password?: string;
    } = {};
    if (password) data["password"] = password;
    await ChatChannel.join(channel.id, data)
      .then((res) => {
        addAnnouncement({
          level: "success",
          message: `You joined channel ${channel.name}`,
        });
      })
      .catch((e) => {
        addAnnouncement({
          level: "error",
          message: `Failed to join channel ${channel.name}`,
        });
      });
  };

  const handleJoin = async (channel: ChannelExtended) => {
    if ($dataStore.myChannels.find((chanUsr) => chanUsr.channel.id == channel.id)) {
      addAnnouncement({
        level: "success",
        message: "Already member",
      });
      return;
    }
    if (channel.visibility == "PROTECTED") {
      $ui.confirmInput = "";
      const timeOutId = addAnnouncement({
        level: "success",
        message: `Channel ${channel.name} is password protected`,
        persist: true,
        confirm: {
          isInput: {
            attributes: {
              id: "password",
              type: "password",
              placeholder: "password",
              name: "password",
            },
            onChange: (value) => ($ui.confirmInput = value),
            onSubmit: () => {
              (async () => {
                joinChannel(channel, $ui.confirmInput);
              })();
              $ui.confirmInput = "";
              return "";
            },
          },
          yes: {
            label: "Submit",
            callback: () => {
              (async () => await joinChannel(channel, $ui.confirmInput))();
              $ui.confirmInput = "";
            },
          },
          no: {
            label: "Cancel",
            callback: (id) => removeAnnouncement(id),
          },
        },
      });
      clearTimeout(timeOutId);
    } else {
      await joinChannel(channel);
    }
    // alert("join" + channel.id);
  };

  onMount(() => {
    fetchChannel();
  });
  $: channels = $dataStore.channels;
  // # Pagination
  $: totalPages = Math.ceil(channels.length / itemsPerPage);
  $: paginatedChannels = channels.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
  // # Filtering
  // ## search and visibility
  $: {
    if (search || selectedLevel)
      channels = $dataStore.channels.filter((chan) => {
        const matchVisibility = (() => {
          if (selectedLevel == "ALL") return true;
          return chan.visibility == selectedLevel;
        })();
        const matchSearch = (() => {
          if (!(search.length > 2)) return true;
          const nameToLower = chan.name.toLowerCase();
          const searchToLower = search.toLowerCase();
          return nameToLower.includes(searchToLower);
        })();

        return matchSearch && matchVisibility;
      });
    else channels = $dataStore.channels;
  }
  // ## members length
  $: {
    switch (sort) {
      case 0:
        channels = channels.sort();
        break;
      case 1:
        channels = channels.sort((a, b) => b.channelUsers.length - a.channelUsers.length);
        break;
      case -1:
        channels = channels.sort((a, b) => a.channelUsers.length - b.channelUsers.length);
        break;
      default:
        break;
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
          selectedLevel = value;
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
          placeholder: "search by name",
          name: "search",
        }}
        onChange={(value) => (search = value)}
      />
      <Button variant="error" disabled={search.length == 0} on:click={() => (search = "")}>
        <Typography>{"x"}</Typography>
      </Button>
      <Button on:click={async () => await fetchChannel()}>
        <Typography>{"refresh"}</Typography>
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
            <th class="members" on:click={() => setSort()}
              ><Typography>{`Members ${sortString}`}</Typography></th
            >
          </tr>
        </thead>
        <tbody>
          {#each paginatedChannels as channel (channel.id)}
            <tr on:click={async () => await handleJoin(channel)}>
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
  :global(.slider-container) {
    margin: 0 !important;
  }
  .joinchan {
    min-height: 50vh;
    max-height: 70vh;
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
    justify-content: center;
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
    .members {
      cursor: pointer;
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
