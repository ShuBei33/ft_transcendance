<script lang="ts">
    import { onMount } from "svelte";
    import Typography from "./Typography.svelte";
    import AvatarFrame from "./nav/social/avatarFrame.svelte";
    import type { User } from "$lib/models/prismaSchema";
    import { data, user as userStore} from "$lib/stores";
    import { get } from "svelte/store";
    import { axiosInstance } from "$lib/stores";
    import Button from "./Button.svelte";
    import { handle } from "./nav/social/friend/handlers";
    import { gameInvite } from "$lib/stores/session";

    const friendHandler = new handle();
    const handleInviteToPlay = (userId: string | undefined) => {
        if (!userId)
            return ;
        $gameInvite = userId;
        // alert("invite" + id);
    }
    export let id: string = "";
    export let user: User | undefined = undefined;
    onMount(async () => {
        if (!user) return;
        const api = get(axiosInstance);
        api.get(`user/${id}`)
            .then((res) => (user = res.data.data))
            .catch((e) => {
                //TODO handle error
            });
    });
    $: idNumber = Number(id);
    $: isOwnProfile = id == String($userStore?.id);
    $: isFriend = $data.friends.find(_user => _user.id == idNumber);
    $: hasFriendship = !isFriend && $data.friendShips.find(friendship => friendship.receiverId == idNumber || friendship.senderId == idNumber);
    $: hasBlocked = hasFriendship && ((): boolean => {
        const isUserSender = hasFriendship.senderId == $userStore?.id;
        if (isUserSender) return hasFriendship.receiverIsBlocked;
    return hasFriendship.senderIsBlocked;
    })() || false;
</script>

{#if user}
    <div class="userInfo">
        <div class="lhs">
            <Typography big class="... title"
                ><h1>{`${user.pseudo}`}</h1></Typography
            >
            <div class="info">
                <AvatarFrame userId={id} />
                <div class="rankAndActions">
                    <Typography>{`rank ${user.rank}`}</Typography>
                    <div class="actions">
                        {#if !isFriend}
                        <Button on:click={async () => await friendHandler.AddFriend(Number(id))}>{"➕"}</Button>
                        {/if}
                        <Button on:click={() => handleInviteToPlay(id)}>{"🏓"}</Button>
                        <Button>{"🚫"}</Button>
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
</style>
