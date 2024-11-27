<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import Popup from "../components/Popup.svelte";
  import QuickAdd from "../components/QuickAdd.svelte";
  import { theme } from "$lib/stores/theme";

  let eventTarget: EventTarget;
  let previousPath = "/";

  onMount(() => {
    eventTarget = new EventTarget();
    eventTarget.addEventListener("CustomEvent", handleCustomEvent);
    theme.initialize();
  });

  let isOpen = false;
  function handleCustomEvent(event: any) {
    const code: string = event.detail;
    if (code === "add") {
      isOpen = true;
    } else if (code === "closePop") {
      isOpen = false;
    } else if (code.startsWith("/")) {
      // 跳转页面前保存当前路径
      if (code === $page.url.pathname) {
        return;
      }
      previousPath = $page.url.pathname;
      // 跳转页面
      location.href = code;
    } else {
    }
  }
</script>

<div
  class="h-full bg-primary overflow-hidden flex flex-col items-center justify-start absolute w-full"
>
  <div class="px-4 h-full w-full text-primary-content">
    {#key $page.url.pathname}
      <slot />
    {/key}
  </div>
  <Navbar {eventTarget} />
  {#if isOpen}
    <Popup {eventTarget}>
      <QuickAdd {eventTarget} />
    </Popup>
  {/if}
</div>
