<script lang="ts">
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import { twoFa as twoFaApi } from "$lib/apiCalls";
  import Input from "../Input.svelte";

  const twoFa = new twoFaApi();
  let src: string | undefined = undefined;
  let code = "";

  const testTwoFa = async () => {
    await twoFa.generate().then((result) => {
      src = result.data;
      console.log(result);
    });
  };

  const handleCodeSubmit = () => {
    (async () => {
      
    alert("submitting code: " + code);
    })();
    return "";
  };
</script>

<Typography>{"WEEEEEEEEEEH secure !"}</Typography>

<Button on:click={async () => await testTwoFa()}>{"generate"}</Button>
{#if src}
  <img {src} alt="qrcode" />
{:else}
  <Typography>{"Waiting for QRcode"}</Typography>
{/if}
<Input
  attributes={{
    id: "code",
    type: "text",
    placeholder: "Please enter the code provided",
    name: "code",
  }}
  class="chat-input"
  onChange={(_value) => {
    code = _value;
  }}
  onSubmit={handleCodeSubmit}
/>

<style lang="scss">
</style>
