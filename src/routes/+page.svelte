<script lang="ts">
  import "../app.css";
  import { invoke } from "@tauri-apps/api/core";
  import { FileHelper, type DirEntryEx } from "../lib/fileHelper";
  import { onMount } from "svelte";
  import type { DirEntry } from "@tauri-apps/plugin-fs";
  import { Child } from "@tauri-apps/plugin-shell";
  import GithubCalendar from "../components/GithubCalendar.svelte";
  let name = $state("");
  let content = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    if (!name) return;
    const file = name + ".txt";
    await FileHelper.createFile(file, content);
    greetMsg = await invoke("greet", { name });
  }
  let files: DirEntryEx[] = $state([]);
  async function listFiles() {
    files = await FileHelper.getFiles("notes", true);
    console.log(files);
  }

  onMount(async () => {
    // await listFiles();
  });
</script>

<div class="min-h-screen bg-primary overflow-hidden drawer drawer-end">
  <div class="container mx-auto px-4 max-w-3xl">
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
  </div>
  <div
    class=" overflow-auto container mx-auto px-4 max-w-3xl"
    style=" height:calc(100vh - 192px);"
  >
    <div class="flex flex-col">
      <div class="h-6 p-4 mb-4 pb-20"></div>
    </div>
  </div>
</div>

<!-- 
<main class=" w-full h-full">
  {#if files.length > 0}
    <ul>
      {#each files as file}
        <div class=" flex flex-row">
          {#if file.isDirectory}
            ⭐
            <li>{file.name}</li>
            {#if file.children}
              <ul>
                {#each file.children as child}
                  <li>{child.name}</li>
                {/each}
              </ul>
            {/if}
          {:else}
            <li>{file.name}</li>
          {/if}
        </div>
      {/each}
    </ul>
  {/if}

  <form
    class=" flex flex-col items-center justify-start px-2 py-2 gap-2"
    onsubmit={greet}
  >
    <input id="greet-input" placeholder="Enter a name..." bind:value={name} />
    <input id="greet-input" placeholder="Enter content" bind:value={content} />
    <button type="submit">Greet</button>
  </form>
  <p>{greetMsg}</p>
</main> -->
