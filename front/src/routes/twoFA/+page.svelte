<script lang="ts">
  import { axiosConfig, ui, user } from "$lib/stores";
  import { onMount } from "svelte";
  import Typography from "../../components/Typography.svelte";
  import Input from "../../components/Input.svelte";
  import { twoFa as twoFaApi } from "$lib/apiCalls";
  import { goto } from "$app/navigation";
  import type { CreateAxiosDefaults } from "axios";
  import { page } from "$app/stores";
  import { addAnnouncement } from "$lib/stores/session";
  let code = "";
  onMount(() => {
    const retrievedToken = $page.url.searchParams.get("token");
    const config: CreateAxiosDefaults = {
      baseURL: "http://localhost:5500",
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrievedToken}`,
      },
    };
    axiosConfig.set(config);
  });

  const handleCodeSubmit = () => {
    (async () => {
      const twoFa = new twoFaApi();
      await twoFa
        .authenticate(code)
        .then(async (result) => {
            if ($user)
                $user.is2FAAuthenticated = true;
          await goto(`/callback`);
        })
        .catch((e) => {
          addAnnouncement({
            level: "error",
            message: "The code provided is incorrect",
          });
        });
    })();
    return "";
  };
</script>

<div class="twofa">
  <section>
    <Typography big>{"You activated two factor authentification"}</Typography>
    <img src={"/images/twofa.png"} alt="google auth logo" />
    <Input
      attributes={{
        id: "code",
        type: "text",
        placeholder: "Please enter the code provided",
        name: "code",
      }}
      class="chat-input"
      onChange={(_value) => {
        if (_value.length == 7) return code;
        code = _value;
        return code;
      }}
      onSubmit={handleCodeSubmit}
    />
  </section>
</div>

<style lang="scss">
  img {
    width: 10em;
    height: 9em;
    align-self: center;
  }

  section {
    align-self: center;
    display: flex;
    flex-direction: column;
  }

  .twofa {
    height: calc(100vh - 2em);
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
</style>
