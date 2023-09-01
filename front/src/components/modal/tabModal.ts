import type { SvelteComponent } from "svelte";

export interface modalTab {
  title: string;
  component: typeof SvelteComponent<any>;
}
