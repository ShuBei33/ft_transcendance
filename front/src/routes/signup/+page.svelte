<script lang="ts">
	import { form, field } from "svelte-forms";
	import { required } from "svelte-forms/validators";
	import TestInput from "../login/testInput.svelte";
	import Button from "../../components/button/button.svelte";
	const email = field("email", "", [required()]);
	const password = field("password", "", [required()]);
	const signupForm = form(email, password);
</script>

<div class="grid-container">
    <div id="lhs"></div>
    <div id="rhs">
      <h1 id="sign">Sign up</h1>
      <div class="flexbox">
        <TestInput
          attributes={{
            type: "text",
            placeholder: "e-mail",
            name: "email",
          }}
          setter={email.set}
        />
        <TestInput
          attributes={{
            type: "password",
            placeholder: "password",
            name: "password",
          }}
          setter={password.set}
        />
		<div class="create-acc">
        <Button class="red-rectangle"
          on:click={() =>
            alert("login not implemented yet." + JSON.stringify($signupForm.summary))}
          >Create account</Button></div>
      </div>
    </div>
</div>

<style lang="text/scss">

	.grid-container {
	  display: grid;
	  width: 100%;
	  height: inherit;
	  grid-template-columns: 2fr 1fr;
	}
	
	#lhs {
	  
	}
	
	#rhs {
	  display: grid;
	  justify-content: center;
	  align-content: center;
	}
	
	#sign {
	  color: #FFF;
	  font-size: 36px;
	  font-style: normal;
	  font-weight: 800;
	  line-height: normal;
	  text-align: center;
	  padding-bottom: 30px;
	}
	
	.flexbox {
	  display: flex;
	  flex-direction: column;
	  gap: 20px;
	}

	.create-acc {
		display: flex;
		margin-top: 35px;
	}

</style>