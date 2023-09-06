<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "./testInput.svelte";
  import Typography from "../../components/Typography.svelte";
  import Button from "../../components/Button.svelte";
  import Input from "../../components/Input.svelte";
  import { browser } from "$app/environment";

  const email = field("email", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(email, password);
</script>

<div class="login-grid-layout">
  <div class="lhs">
    <Typography big>{"Transcendance"}</Typography>
  </div>
  <div class="rhs">
    <Input
      attributes={{
        id: "email",
        type: "text",
        placeholder: "email",
        name: "email",
      }}
    />
    <Input
      attributes={{
        id: "password",
        type: "password",
        placeholder: "password",
        name: "password",
      }}
    />
    <Button
      on:click={() => {
        if (browser)
          window.location.href = "http://localhost:5500/auth/signin42";
      }}><Typography>{"Sign in"}</Typography></Button
    >
  </div>
</div>

<!-- <a href="http://localhost:5500/auth/signin42">
  <h1>test42</h1>
</a> -->

<style lang="scss">
  @import "../../lib/style/colors.scss";
  :global(body) {
    background-color: $georgiaPeach;
  }
  .login-grid-layout {
    display: grid;
    grid-template-columns: 5fr 1fr;
    height: calc(100vh - 2em);
  }
  .rhs {
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
    justify-content: center;
  }
  .lhs {
  }
</style>
