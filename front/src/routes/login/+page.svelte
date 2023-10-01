<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "./testInput.svelte";
  import Typography from "../../components/Typography.svelte";
  import Button from "../../components/Button.svelte";
  import Input from "../../components/Input.svelte";
  import { browser } from "$app/environment";
  import FtLogo from "../../components/svg/FTLogo.svelte";
  import GoogleLogo from "../../components/svg/GoogleLogo.svelte";
  import Divider from "../../components/divider.svelte";

  const email = field("email", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(email, password);
</script>

<div class="landing">
  <section class="sign-in">
    <Button
      class="zero-auth-ft"
      on:click={() => {
        if (browser)
          window.location.href = "http://localhost:5500/auth/signin42";
      }}
    >
      <div class="zero-auth-flex">
        <Typography class="typo-Regular color-black">{"Forty two"}</Typography>
        <FtLogo class="FtLogo" />
      </div></Button
    >
  </section>
</div>

<style lang="scss">
  @use "../../lib/style/mixins.scss" as mix;
  @import "../../lib/style/colors.scss";
  :global(body) {
    background-color: $shipsOfficer;
  }
  .landing {
    display: flex;
    height: calc(100vh - 2em);
    justify-content: center;
  }
  .sign-in {
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
    align-self: center;
    padding: 0.5em;
    width: 15em;
  }
  .zero-auth-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  :global(.FtLogo .GoogleLogo) {
    display: flex;
    align-items: center;
  }
  :global(.FtLogo svg) {
    height: auto;
    width: 18px;
  }
  :global(.GoogleLogo svg) {
    height: 18px;
    width: 18px;
  }
  :global(.zero-auth-ft) {
    @include mix.button-style(white);
  }
  :global(.zero-auth-google) {
    @include mix.button-style(white);
  }
  :global(.typo-Regular.color-black) {
    color: black;
    display: flex;
    align-items: center;
  }
</style>
