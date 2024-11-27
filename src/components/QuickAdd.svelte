<script lang="ts">
    export let items = [
        {
            id: 0,
        },
        {
            id: 1,
        },
        {
            id: 2,
        },
        {
            id: 3,
        },
        {
            id: 4,
        },
        {
            id: 5,
        },
        {
            id: 6,
        },
        {
            id: 7,
        },
        {
            id: 8,
        },
    ];
</script>

<div class="grid grid-cols-4 overflow-auto">
    {#each items as item (item.id)}
        <div class=" flex w-full h-full justify-center items-center p-2">
            <div class=" rounded-lg w-16 h-16 bg-warning m-2"></div>
        </div>
    {/each}
</div>
