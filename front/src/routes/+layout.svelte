<script lang="ts">
  import Nav from "../components/nav/nav.svelte";
  import AuthRouter from "$lib/utils/authRouter.svelte";
  import { onMount, type ComponentProps } from "svelte";
  import type NavButton from "../components/nav/navButton.svelte";
  import { user } from "$lib/stores";
  import { get } from "svelte/store";

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
  ];
</script>

<AuthRouter>
  <span slot="nav">
    <Nav {navItems} />
  </span>
  <slot />
</AuthRouter>
