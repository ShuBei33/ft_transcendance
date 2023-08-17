<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "./testInput.svelte";
  const email = field("email", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(email, password);
  // your script goes here
</script>

<main>
  <h1>login</h1>
  <button
    on:click={() =>
      alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
    >42</button
  >
  <button
    on:click={() =>
      alert("login not implemented yet." + JSON.stringify($loginForm.summary))}
    >G</button
  >
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
</main>

<style lang="text/scss"></style>
