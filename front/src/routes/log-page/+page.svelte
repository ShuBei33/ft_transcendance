<script lang="ts">

	import InputForm from "../../components/input-form.svelte";
	import Button from "../../components/button.svelte";
</script>

<main>

<div class="main-container">
	
	<div class="container">
		<div class="sign">Sign up</div>
		<div><InputForm placeholder="e-mail"/>
		</div>
		<div><InputForm placeholder="password"/>
		</div>
		<div><Button>Create new account</Button>
		</div>
		<div class="msg">you can choose your avatar
			and nickname later.</div>
	</div>
</div>

</main>

<style>
	.sign {
		display: flex;
		justify-content: center;
		height: 120px;
		color: #000;
		font-family: Shippori Antique;
		font-size: 48px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		text-align: center;
		
	}
	.main-container {
		display: flex;
		justify-content: flex-end;
		margin-right: 2rem;
	}

	.container {
		display: flex;
		margin-left: 20em;
		margin-top: 18em;
		flex-direction: column;
		gap: 2em;
	}

	.msg {
		display: flex;
		width: 300px;
		margin-top: 1em;
		margin-left: 1em;
		color: #000;
		font-family: Shippori Antique;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	/* .button-box {
		padding: 1em;
		height: 100px;
		background-color: red;
		transition-duration: 500ms;

	}
	.button-box:hover {
		padding: 1em;
		height: 100px;
		background-color: green;
		transition-duration: 500ms;
	} */
</style>