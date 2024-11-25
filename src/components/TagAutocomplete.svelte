<script lang="ts">
  import { tags } from "../lib/store";
  import { createEventDispatcher } from "svelte";

  export let query = "";
  export let position = { top: 0, left: 0 };
  export let visible = false;

  const dispatch = createEventDispatcher();

  $: filteredTags = query
    ? $tags
        .filter((tag) => tag.name.toLowerCase().startsWith(query.toLowerCase()))
        .sort((a, b) => b.noteCount - a.noteCount)
    : $tags.sort((a, b) => b.noteCount - a.noteCount).slice(0, 5);

  function selectTag(tagName: string) {
    dispatch("select", tagName);
  }
</script>

{#if visible}
  <div
    class="absolute z-50 bg-primary rounded-lg shadow-lg border max-h-48 h-48 overflow-y-auto min-w-[200px]"
    style="top: {position.top}px; left: {position.left}px"
  >
    {#if filteredTags.length > 0}
      {#each filteredTags as tag}
        <button
          class="w-full px-4 py-2 text-left hover:bg-accent flex justify-between items-center"
          on:click={() => selectTag(tag.name)}
        >
          <span>#{tag.name}</span>
          <span class="text-sm text-primary-content">{tag.noteCount}</span>
        </button>
      {/each}
    {:else}
      <div class="px-4 py-2 text-primary-content">
        No matching tags. Press space to create.
      </div>
    {/if}
  </div>
{/if}
