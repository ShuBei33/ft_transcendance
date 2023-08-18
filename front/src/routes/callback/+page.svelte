<script lang="ts">
  "use-client";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { token, user } from "$lib/stores";
  import axios from "axios";
  import { axiosInstance } from "$lib/stores/api";
  import { goto } from "$app/navigation";
  onMount(async () => {
    const retrivedToken = $page.url.searchParams.get("token");
    if (!retrivedToken) {
      goto("/login");
    }

    const userApiInstance = axios.create({
      baseURL: "http://localhost:5500",
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrivedToken}`,
      },
    });

    userApiInstance.get("/auth/test").then((res) => console.log(res));
    // token.set(retrivedToken);
    // console.log("!token", token);
  });
</script>

<main>
  <h1>callback page after 42 login</h1>
</main>

<style lang="text/scss"></style>
