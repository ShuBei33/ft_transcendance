<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "./testInput.svelte";
  import Button from "../../components/button/button.svelte";
  const email = field("email", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(email, password);
  let redirectTo = "http://localhost:5500/auth/signin42";
  let google = '../static/google-logo.svg'
  // your script goes here
</script>

  <div class="grid-container">
    <div id="lhs"></div>
    <div id="rhs">
      <div id="small">
        <h1>Sign in</h1>
        <Button class="small-square"
          on:click={() =>
            window.location.href = redirectTo}
          >42</Button
        >
        <Button class="small-square"
          on:click={() =>
            alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
          >G</Button
        >
      </div>
      <TestInput
        attributes={{
          type: "text",
          placeholder: "email",
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
      <button
        on:click={() =>
          alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
        >login</button
      >
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
  padding-bottom: 20px;
}

</style>
