<script lang="ts">
    import Button from "../../components/button/button.svelte";
    let redirectTo = "http://localhost:5500/game/joinQueue";
</script>

<div class="grid-container"> 

  <div class="header">
    <div class="profile"></div>
    <div class="upgrade">
      <div class="lvl"></div>
      <div class="money"></div>
    </div>
    <div class="minicub-lvl">lv</div>
    <div class="minicub-money">$</div>
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

.upgrade {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 7.5em;
  row-gap: 0.5em;
}

.lvl {
  width: 91px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  border: 2px solid rgba(255, 255, 255, 0.20);
  background: rgba(255, 255, 255, 0.20);
}

.money {
  width: 91px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  border: 2px solid rgba(255, 255, 255, 0.20);
  background: rgba(255, 255, 255, 0.20);
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

.minicub-lvl {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 8em;
  top:0.5em;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 9px;
  border: 2px solid rgba(255, 255, 255, 0.20);
  background: radial-gradient(95.61% 95.61% at 50.00% 4.39%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #00FF1A 0%, #03BB0A 100%);
  color: #FFF;
  text-align: center;
  font-family: Noto Sans Tamil;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}

.minicub-money {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 8em;
  top: 2.4em;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 9px;
  border: 2px solid rgba(255, 255, 255, 0.20);
  background: radial-gradient(95.61% 95.61% at 50.00% 4.39%, rgba(250, 255, 0, 0.30) 0%, rgba(138, 69, 5, 0.00) 100%), linear-gradient(180deg, #FAFF00 0%, #D98200 100%);
  color: #FFF;
  text-align: center;
  font-family: Noto Sans Tamil;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
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