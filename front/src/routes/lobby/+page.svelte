<script lang="ts">
    import Button from "../../components/button/button.svelte";
    let redirectTo = "http://localhost:5500/game/joinQueue";
</script>


<div class="profile">
</div>
<div class="grid-container">
  <div class="header">
    <span><a href="/lobby">LOBBY</a></span>
    <span><a href="/store">STORE</a></span>
    <span><a href="/leaderboard">LEADERBOARD</a></span>
  </div>
  <div class="main">

  </div>
    <div class="play">
      <Button class="red-rectangle"
      on:click={() =>
      window.location.href = redirectTo}
      >Play!</Button></div>
    <div class="chat-toggle">
      <Button class="red-mini-square"
        on:click={() =>
        alert("not implemented yet")}>8</Button></div>
</div>

<style lang="text/scss">

.profile {
  position: absolute;
  top: 1em;
  left: 1em;
  width: 87px;
  height: 87px;
  flex-shrink: 0;
  border-radius: 13px;
  border: 2px solid rgba(255, 255, 255, 0.20);
  background: rgba(255, 255, 255, 0.20);
}

.grid-container {
  display: grid;
  width: 100%;
  height: inherit;
  grid-template-rows: 1fr 3fr 1fr;
}

.header {
  display: flex;
  justify-content: center;
  column-gap: 1em;
  text-align: center;
  margin-top: 1em;
}

.play {
  display: flex;
  justify-content: center;
}

.chat-toggle {
  position: absolute;
  bottom: 1em;
  right: 1em;
}

a {
  color: #FFF;
  font-family: Noto Sans Tamil;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  text-decoration: none;
}

a:active {
  text-decoration: underline;
  text-decoration-color: #FF004C;
  text-decoration-thickness: 5px;
  text-underline-offset: 8px;
}

a:hover {
  text-decoration: underline;
  text-decoration-color: #FF004C;
  text-decoration-thickness: 5px;
  text-underline-offset: 8px;
}


</style>