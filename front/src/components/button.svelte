<script lang="ts">
    import { goto } from "$app/navigation";

</script>

<main>

	<button class="button" on:click={() => goto('/signup')}>
		<slot></slot>
	</button>

</main>

<style>

	.button {
		-webkit-appearance: none;
		appearance: none;
		width: 400px;
		height: 82px;
		flex-shrink: 0;
		border-radius: 49.5px;
		background: #0085FF;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
		border: 0;
		color: #000;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	button::placeholder {
		text-align: center;
		color: #000;
		opacity: 100%;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		}

</style>