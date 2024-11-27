<script lang="ts">
    import { fly } from "svelte/transition";
    export let eventTarget: EventTarget;
    function dispatchCustomEvent(data: string) {
        const customEvent = new CustomEvent<string>("CustomEvent", {
            detail: data,
        });
        eventTarget?.dispatchEvent(customEvent);
    }
</script>

<div
    class=" absolute w-full h-full z-10"
    role="button"
    tabindex="0"
    on:click={() => dispatchCustomEvent("closePop")}
    on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
            dispatchCustomEvent("closePop");
        }
    }}
></div>
<div
    class="absolute bottom-0 h-1/2 w-full z-20 bg-secondary text-secondary-content"
    transition:fly={{ y: 200, duration: 250 }}
>
    <slot></slot>
</div>
