<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Input from "../../Input.svelte";

  export let onSubmit: ComponentProps<Input>["onSubmit"] = () => {
    return "";
  };
  export let onChange: ComponentProps<Input>["onChange"] = () => {};
</script>

<div class="messages-container">
  <div class="messages-section">
    <slot name="feed" />
  </div>
  <div class="input-section">
    <Input
      attributes={{
        id: "chatInput",
        type: "text",
        placeholder: "",
        name: "chatInput",
      }}
      class="chat-input"
      onChange={(value) => onChange && onChange(value)}
      onSubmit={(value) => (onSubmit && onSubmit(value)) || (() => "")()}
    />
  </div>
</div>

<style lang="scss">
</style>
