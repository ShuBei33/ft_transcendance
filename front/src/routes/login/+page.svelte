<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "./testInput.svelte";
  import Button from "../../components/button/button.svelte";
  const email = field("email", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(email, password);
  let redirectTo = "http://localhost:5500/auth/signin42";
  import { goto } from "$app/navigation";
</script>

  <div class="grid-container">
    <div id="lhs"></div>
    <div id="rhs">
      <h1>Sign in</h1>
      <div id="small">
        <Button class="small-square"
          on:click={() =>
            window.location.href = redirectTo}
          ><img src={"/images/42_logo.png"} alt="42 Logo"/>
        </Button>
        <Button class="small-square"
          on:click={() =>
            alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
          ><img src={"/images/Googlelogo.png"} alt="Google Logo"/>
        </Button>
      </div>
      <div class="flexbox">
        <TestInput
          attributes={{
            type: "text",
            placeholder: "@",
            name: "email",
          }}
          setter={email.set}
        />
        <TestInput
          attributes={{
            type: "password",
            placeholder: "🔒",
            name: "password",
          }}
          setter={password.set}
        />
        <div class="line-msg">
          <div class="msg">Forgot your password ?</div><div class="link">Reset my password</div>
        </div>
        <Button class="red-rectangle"
          on:click={() =>
            alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
          >Log in</Button
        >
        <div class="line-msg2">
          <div class="msg">Don't have an account yet ?</div><button class="link" on:click={() => goto('/signup')}>Sign up</button>
        </div>
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

#small {
  display: flex;
  padding-bottom: 20px;
  justify-content: space-between;
  margin-right:150px;
}

.flexbox {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg {
  color: #8F8F8F;
  font-family: 'Noto Sans Tamil';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
}

.line-msg {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin: 10px;
  margin-top: -10px;
  margin-bottom: 5px;
}

.line-msg2 {
  -webkit-appearance: none;
	appearance: none;
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin: 30px;
  margin-top: -10px;
  margin-bottom: 7px;
}

.link {
  color: #FFF;
  font-family: 'Noto Sans Tamil';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-top: -2px;
}

button {
  background-color: #2C2C33;
  border: 1px solid #2C2C33;
  color: #eee;
}

</style>
