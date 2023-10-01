<script lang="ts">
</script>

<div class="member-label">
  <div class="lhs">
    <slot name="lhs" />
  </div>
  <div class="rhs">
    <slot name="rhs" />
  </div>
</div>

<style lang="scss">
  .member-label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .rhs {
    display: flex;
    flex-direction: row;
    column-gap: 0.3em;
  }
</style>
