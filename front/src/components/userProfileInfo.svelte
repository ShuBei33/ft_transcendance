<script lang="ts">
  import { onMount } from "svelte";
  import Typography from "./Typography.svelte";
  import AvatarFrame from "./nav/social/avatarFrame.svelte";
  import type { User } from "$lib/models/prismaSchema";
  import { axiosConfig, data, user as userStore } from "$lib/stores";
  import { get } from "svelte/store";
  import { axiosInstance } from "$lib/stores";
  import Button from "./Button.svelte";
  import { handle } from "./nav/social/friend/handlers";
  import { addAnnouncement, gameInvite, token } from "$lib/stores/session";
  import type { CreateAxiosDefaults } from "axios";
  import axios from "axios";

  const friendHandler = new handle();
  const handleInviteToPlay = (userId: string | undefined) => {
    if (!userId) return;
    $gameInvite = userId;
    // alert("invite" + id);
  };
  export let id: string = "";
  export let user: User | undefined = undefined;
  const fetchUserInfo = async () => {
    if (!user) return;
    const api = get(axiosInstance);
    api
      .get(`user/${id}`)
      .then((res) => (user = res.data.data))
      .catch((e) => {
        //TODO handle error
      });
  };
  onMount(async () => {
    await fetchUserInfo();
  });
  $: id,
    (async () => {
      await fetchUserInfo();
    })();
  $: idNumber = Number(id);
  $: isOwnProfile = id == String($userStore?.id);
  $: isFriend = $data.friends.find((_user) => _user.id == idNumber);
  $: hasFriendship =
    !isFriend &&
    $data.friendShips.find(
      (friendship) => friendship.receiverId == idNumber || friendship.senderId == idNumber
    );
  $: hasBlocked =
    (hasFriendship &&
      ((): boolean => {
        const isUserSender = hasFriendship.senderId == $userStore?.id;
        if (isUserSender) return hasFriendship.receiverIsBlocked;
        return hasFriendship.senderIsBlocked;
      })()) ||
    false;
  $: console.warn(JSON.stringify(user));

  const configFs: CreateAxiosDefaults = {
    baseURL: "http://localhost:5170/avatar",
    withCredentials: true,
    timeout: 10000,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${$token}`,
    },
  };

  // Image
  let fileInput: HTMLInputElement;
  const handleFile = async (e: any) => {
    const image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async (e) => {
      let form = new FormData();
      form.append("file", image);
      console.log("📸 form", form.get("file"));
      await axios
        .create(configFs)
        .post("upload", form)
        .then((result) => {
          addAnnouncement({
            level: "success",
            message: "Avatar updated",
          });
        })
        .catch((e) => {
          addAnnouncement({
            level: "error",
            message: "Make sure your avatar is a gif,jpeg or png and less than 50Mb",
          });
        });
    };
  };
</script>

{#if user}
  <div class="userInfo">
    <div class="lhs">
      <Typography big class="... title"><h1>{`${user.pseudo}`}</h1></Typography>
      <div class="info">
        <AvatarFrame userId={id} />
        <div class="rankAndActions">
          <Typography>{`rank ${user.rank}`}</Typography>
          <div class="actions">
            {#if $userStore?.id == user.id}
              <Button on:click={() => fileInput.click()}>{"📸"}</Button>
              <input
                id="avatar"
                type="file"
                accept=".jpg, .jpeg, .png"
                on:change={async (e) => await handleFile(e)}
                bind:this={fileInput}
              />
            {:else}
              {#if !isFriend}
                <Button on:click={async () => await friendHandler.AddFriend(Number(id))}
                  >{"➕"}</Button
                >
              {/if}
              <Button on:click={() => handleInviteToPlay(id)}>{"🏓"}</Button>
              <Button>{"🚫"}</Button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .userInfo {
    display: flex;
    flex-direction: row;
  }
  .info {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
  }
  .rankAndActions {
    display: flex;
    flex-direction: column;
  }
  .actions {
    display: flex;
    flex-direction: row;
    column-gap: 0.3em;
  }
  #avatar {
    display: none;
  }
</style>
