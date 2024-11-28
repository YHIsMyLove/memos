<script lang="ts">
    import { isWeb } from "$lib/env";
</script>

<div
    class=" flex flex-row items-center justify-between align-middle py-4 text-primary-content"
>
    <h1 class="text-2xl font-bold">MemOS {isWeb ? "-Web" : "-Windows"}</h1>
    <slot></slot>
</div>
