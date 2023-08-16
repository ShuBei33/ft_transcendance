<script lang="ts">

	let value = "";
	export let placeholder = "";

</script>

<main>

	<input class="input-form" type="text" bind:value={value} placeholder={placeholder}/>

</main>

<style>

	.input-form {
		-webkit-appearance: none;
		appearance: none;
		width: 366px;
		height: 82px;
		flex-shrink: 0;
		border-radius: 49.5px;
		background: #D9D9D9;
		border: 0;
		color: #000;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		padding-left: 40px;
	}

	input::placeholder {
		color: #000;
		opacity: 100%;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		}

</style>