<script lang="ts">
  import { marked } from "marked";
  import type { NoteBlock } from "../lib/types";
  import { format } from "date-fns";
  import { notes } from "$lib/stores/notes";

  export let note: NoteBlock;

  $: htmlContent = marked.parse(note.content.substring(0, 20));
  $: formattedDate = format(new Date(note.createdAt), "yyyy-MM-dd HH:mm");
</script>

<div class=" bg-secondary rounded-lg shadow-md p-4 mb-4">
  <div class="flex justify-between items-start text-secondary-content">
    <span class="text-xs">{formattedDate}</span>
    <button on:click={() => notes.deleteNote(note.id)}> 三 </button>
  </div>
  <div class="prose prose-xs max-w-none text-primary-content py-2">
    {@html htmlContent}
  </div>
  <!-- <div class="flex gap-2">
    {#each note.tags as tag}
      <span class=" bg-info text-info-content text-xs px-2 rounded">
        #{tag.name}
      </span>
    {/each}
  </div> -->
</div>
