<script lang="ts">
    import { goto } from "$app/navigation";

</script>

<main>

	<button class="small-button" on:click={() => goto('/guest-lobby')}>
		<slot></slot>
	</button>

</main>

<style>
	.small-button {
		-webkit-appearance: none;
		appearance: none;
		width: 288px;
		height: 46px;
		flex-shrink: 0;
		border-radius: 49.5px;
		background: #BBE3FF;
		color: #000;
		border: 0;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
</style>