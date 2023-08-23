<script lang="ts">
  import Nav from "../components/nav/nav.svelte";
  import AuthRouter from "$lib/utils/authRouter.svelte";
  import { onMount, type ComponentProps } from "svelte";
  import type NavButton from "../components/nav/navButton.svelte";
  import { user } from "$lib/stores";
  import { get } from "svelte/store";
  import SocialModal from "../components/nav/social/socialModal.svelte";
  import { ui } from "$lib/stores/ui";

  onMount(() => {
    console.log($user);
  });

  let navItems: ComponentProps<NavButton>[];
  $: navItems = [
    {
      name: "profile",
      href: "/profile/" + $user?.id,
    },
    {
      name: "play",
      href: "/play",
    },
    {
      name: "store",
      href: "/store",
    },
    {
      name: "leaderboard",
      href: "/leaderboard",
    },
    {
      name: "inventory",
      href: "/inventory",
    },
    {
      name: "game",
      href: "/game",
    },
  ];
</script>

<AuthRouter>
  <span slot="nav">
    <Nav {navItems} />
  </span>
  <slot />
  <SocialModal />
  <div class="bottom-acion-section">
    <button
      class="chat-toggle"
      on:click={() => ($ui.chat.toggle = !$ui.chat.toggle)}
      >chat {(!$ui.chat.toggle && "+") || "-"}</button
    >
    <div />
  </div></AuthRouter
>

<style lang="scss">
  .chat-toggle {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
</style>
