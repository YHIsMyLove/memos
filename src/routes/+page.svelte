<script lang="ts">
  import { notes } from "$lib/store";
  import "../app.css";
  import GithubCalendar from "../components/GithubCalendar.svelte";
  import NoteBlock from "../components/NoteBlock.svelte";
  import NoteEditor from "../components/NoteEditor.svelte";
</script>

<div
  class="h-full bg-primary overflow-hidden flex flex-col items-center justify-start"
>
  <div class=" px-4 w-full">
    <div
      class=" flex flex-row items-center justify-between align-middle py-4 text-primary-content"
    >
      <h1 class="text-2xl font-bold">MemOS</h1>
      <div class="drawer-content flex flex-row [&_label]:px-1">
        <label
          class="drawer-button btn-primary text-secondary-content"
          for="my-drawer">重组</label
        >
        <label
          class="drawer-button btn-primary text-secondary-content"
          for="my-drawer">设置</label
        >
      </div>
    </div>
    <GithubCalendar />
    <NoteEditor />
  </div>
  <div class=" px-4 w-full overflow-y-auto">
    {#each $notes as note (note.id)}
      <NoteBlock {note} />
    {/each}
    <div class="h-6 p-4 mb-4"></div>
  </div>
</div>
