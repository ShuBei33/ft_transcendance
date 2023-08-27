<script lang="ts">
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import TestInput from "../login/testInput.svelte";
  import Button from "../../components/button/button.svelte";
  const nickname = field("nickname", "", [required()]);
</script>

<div class="flex-container">
  <div>
    <h1 id="text">Welcome ! Feel free to customize your nickname and avatar.</h1>
    <div class="ready">
      <TestInput
        attributes={{
          type: "nickname",
          placeholder: "nickname",
          name: "nickname",
        }}
        setter={nickname.set}
      /></div>
      <div class="ready">
        <div class="avatar"></div>
      </div>
      <div class="ready">
        <Button class="plus"
          on:click={() =>
          alert("This is not implemented yet.")}
        >+</Button></div>
      <div class="ready">
      <Button class="red-rectangle"
        on:click={() =>
          alert("This is not implemented yet.")}
      >Ready !</Button></div>
  </div>
</div>

<style lang="text/scss">

    .flex-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: inherit;
    }

    #text {
      display: grid;
      color: #FFF;
      font-size: 36px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      text-align: center;
      margin-top: 4em;
      margin-bottom: 100px;
    }

    .avatar {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: 13px;
      border: 2px solid rgba(255, 255, 255, 0.20);
      background: rgba(255, 255, 255, 0.20);
    }

    .ready {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
</style>