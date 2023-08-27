<script lang="ts">
  import { onMount } from "svelte";
  import { Channel } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores/data";
  import { ui } from "$lib/stores";
  onMount(() => {
    const _Channel = new Channel();
    _Channel.all().then(({ data }) => ($dataStore.channels = data.data));
  });
</script>
