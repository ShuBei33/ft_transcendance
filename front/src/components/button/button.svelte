<script lang="ts">
	let className = '';
	export { className as class}
</script>

<button class="{className}" on:click|preventDefault>
  <slot />
</button>

<style lang="scss">
</style>
