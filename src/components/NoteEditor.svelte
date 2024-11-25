<script lang="ts">
  import { createEventDispatcher } from "svelte";
  // import { generateTags } from "../lib/openai";
  import { notes } from "../lib/store";
  import TagAutocomplete from "./TagAutocomplete.svelte";

  let content = "";
  let textarea: HTMLTextAreaElement;
  let tagAutocomplete = {
    visible: false,
    query: "",
    position: { top: 0, left: 0 },
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    const cursorPos = target.selectionStart;

    // Check for # character
    const textBeforeCursor = value.slice(0, cursorPos);
    const match = textBeforeCursor.match(/#(\w*)$/);

    if (match) {
      const position = getCaretCoordinates();
      tagAutocomplete = {
        visible: true,
        query: match[1],
        position: {
          top: position.top + position.lineHeight * 2,
          left: position.left,
        },
      };
    } else {
      tagAutocomplete.visible = false;
    }
  }

  function handleTagSelect(event: CustomEvent<string>) {
    const tagName = event.detail;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPos);
    const textAfterCursor = content.slice(cursorPos);
    const lastHashIndex = textBeforeCursor.lastIndexOf("#");

    content =
      textBeforeCursor.slice(0, lastHashIndex) +
      `#${tagName} ` +
      textAfterCursor;

    tagAutocomplete.visible = false;
    textarea.focus();
  }

  /**
   * 添加日记
   */
  async function handleSubmit() {
    if (content.trim()) {
      notes.addNote(content);
      content = "";
      tagAutocomplete.visible = false;

      await notes.fetchNotes();
    }
  }

  /**
   * 获取坐标
   */
  function getCaretCoordinates() {
    const textBeforeCursor = content.slice(0, textarea.selectionStart);
    const lines = textBeforeCursor.split("\n");
    const currentLineNumber = lines.length - 1;
    const currentLineText = lines[currentLineNumber];

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const fontSize = parseFloat(computedStyle.fontSize);
    return {
      top: currentLineNumber * lineHeight,
      left: currentLineText.length * (fontSize * 0.6),
      lineHeight,
      fontSize,
    };
  }

  const dispatch = createEventDispatcher();

  async function testAI() {
    if (content.trim()) {
      // const result = await generateTags(content);
      // if (result) {
      //   console.log(result);
      //   content += " " + result.response;
      // }
    }
  }
</script>

<div
  class=" bg-secondary text-secondary-content rounded-lg shadow-md p-4 mb-6 relative"
>
  <textarea
    bind:value={content}
    bind:this={textarea}
    on:input={handleInput}
    class="w-full p-2 rounded-lg mb-2 outline-none text-primary-content bg-secondary h-16 transition-all resize-none"
    placeholder="开始记录吧...  输入 #tag 添加标签."
    on:focus={() => {
      dispatch("focus");
    }}
  ></textarea>

  {#if tagAutocomplete.visible}
    <TagAutocomplete
      visible={tagAutocomplete.visible}
      query={tagAutocomplete.query}
      position={tagAutocomplete.position}
      on:select={handleTagSelect}
    />
  {/if}

  <div class=" flex flex-row justify-end items-center gap-2">
    <button
      on:click={testAI}
      class="text-accent-content px-4 py-2 rounded-lg font-bold"
    >
      #AI
    </button>
    <button
      on:click={handleSubmit}
      class=" bg-accent text-accent-content px-4 py-2 rounded-lg"
    >
      Add
    </button>
  </div>
</div>
