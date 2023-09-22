<script lang="ts">
  import AvatarFrame from "../nav/social/avatarFrame.svelte";
  import { user } from "$lib/stores";
</script>

<div class="user-widget">
  <div class="lhs">
    <AvatarFrame userId={String($user?.id)} />
  </div>
  <div class="rhs" />
</div>

<style lang="scss">
</style>
