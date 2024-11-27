<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import { onMount } from "svelte";
  import "../app.css";
  import GithubCalendar from "../components/GithubCalendar.svelte";
  import Header from "../components/Header.svelte";
  import Navbar from "../components/Navbar.svelte";
  import Popup from "../components/Popup.svelte";
  import QuickAdd from "../components/QuickAdd.svelte";
  let eventTarget: EventTarget;
  onMount(() => {
    eventTarget = new EventTarget();
    eventTarget.addEventListener("CustomEvent", handleCustomEvent);
  });
  let isOpen = false;
  function handleCustomEvent(event: any) {
    const code = event.detail;
    console.log("get msg ", code);
    if (code === "add") {
      isOpen = true;
    } else if (code === "closePop") {
      isOpen = false;
    } else {
      // 跳转页面
      location.href = code;
    }
  }
</script>

<div class=" relative h-full w-full">
  <div
    class="h-full bg-primary overflow-hidden flex flex-col items-center justify-start absolute w-full"
  >
    <div class=" px-4 w-full">
      <Header />
      <GithubCalendar />
    </div>
    <div class=" px-4 w-full overflow-y-auto text-primary-content">
      <Router {routes} />
    </div>
  </div>
  <Navbar {eventTarget} />
  {#if isOpen}
    <Popup {eventTarget}>
      <QuickAdd></QuickAdd>
    </Popup>
  {/if}
</div>
