<script lang="ts">
  import { onMount } from "svelte";
  import { Channel } from "$lib/apiCalls";
  import { data } from "$lib/stores/data";
  onMount(() => {
    const _Channel = new Channel();
    _Channel.all().then((data) => {
      console.log("!!!!!!!!!!!!!!data", data.data);
    });
    // _Channel.all().then((data) => ($data.channels = data));
  });
</script>
