<script lang="ts">
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import { twoFa as twoFaApi } from "$lib/apiCalls";
  import Input from "../Input.svelte";
  import { goto } from "$app/navigation";
  import { token, ui } from "$lib/stores";

  const twoFa = new twoFaApi();
  let src: string | undefined = undefined;
  let code = "";

  const testTwoFa = async () => {
    await twoFa.generate().then((result) => {
      src = result.data;
      // console.log(result);
    });
  };

  const tunrOn = async () => {
    await twoFa
      .turnOn(code)
      .then(async (result) => {
        alert("twoFa turned on");
      })
      .catch((e) => {
        alert("twoFa error");
        console.error(e);
      });
  };

  const tunrOff = async () => {
    await twoFa
      .turnOff(code)
      .then((result) => {
        alert("twoFa turned off X");
      })
      .catch((e) => {
        alert("twoFa error");
        console.error(e);
      });
  };

  const auth = async () => {
    await twoFa
      .authenticate(code)
      .then(async (result) => {
        alert("Auth 2fa ok");
        $ui.modal = "NONE";
        await goto(`/callback`);
      })
      .catch((e) => {
        alert("X Auth 2fa error");
      });
  };

  const handleCodeSubmit = () => {
    (async () => {
      alert("submitting code: " + code);
    })();
    return "";
  };
</script>

<Button on:click={async () => await testTwoFa()}>{"generate"}</Button>
<Button on:click={async () => await tunrOn()}>{"turn on"}</Button>
<Button on:click={async () => await tunrOff()}>{"turn off"}</Button>
<Button on:click={async () => await auth()}>{"-> login"}</Button>
<Button
  on:click={() => {
    $ui.modal = "NONE";
    token.clear();
  }}>{"X logout"}</Button
>
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
