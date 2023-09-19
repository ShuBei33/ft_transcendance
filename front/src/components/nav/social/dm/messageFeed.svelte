<script lang="ts">
  import type { Discussion, DiscussionMsg } from "$lib/models/prismaSchema";

  export let discussion: Discussion[] = [];

  interface feed {
    userId: number;
    messages: DiscussionMsg[];
  }
</script>

<style lang="scss">
</style>
