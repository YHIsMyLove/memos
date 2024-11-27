<script>
  import { notes } from "$lib/stores/notes";
  import GithubCalendar from "../../components/GithubCalendar.svelte";
  import Header from "../../components/Header.svelte";
  import NoteBlock from "../../components/NoteBlock.svelte";
</script>

<div class="h-full w-full flex flex-col">
  <div class="px-4 w-full">
    <Header />
  </div>
  <GithubCalendar />
  <!-- <NoteEditor /> -->
  <div class="w-full flex flex-col overflow-y-auto">
    {#each $notes as note}
      <NoteBlock {note} />
    {/each}
    <div class=" pb-10"></div>
  </div>
</div>
