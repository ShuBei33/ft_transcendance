<script lang="ts">

	import InputForm from "../../components/input-form.svelte";
	import Button from "../../components/button.svelte";
	import SmallButton from "../../components/small-button.svelte";
</script>

<main>

	<div class="main-container">
		
		<div class="container">
			<div class="sign">Sign in</div>
			<div><InputForm placeholder="e-mail"/></div>
			<div><InputForm placeholder="password"/></div>
			<div><Button>Login</Button></div>
			<div class="msg">create an account</div>
			<div class=guest>
				<div><SmallButton>continue as guest</SmallButton></div>
			</div>
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
			margin-top: 13em;
			flex-direction: column;
			gap: 2em;
		}
	
		.msg {
			display: flex;
			justify-content: center;
			height:fit-content;
			margin: -1em;
			color: #000;
			font-family: Shippori Antique;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			text-decoration-line: underline;
		}

		.guest {
			display:flex;
			margin: 5em;
			height:fit-content;
		}
</style>