<script lang="ts">
    export let items = [
        {
            id: 0,
            href: "/note",
            title: "笔记",
        },
        {
            id: 1,
            href: "note",
            title: "测试",
        },
        {
            id: 2,
            href: "note",
            title: "测试",
        },
        {
            id: 3,
            href: "note",
            title: "测试",
        },
        {
            id: 4,
            href: "note",
            title: "测试",
        },
        {
            id: 5,
            href: "note",
            title: "测试",
        },
        {
            id: 6,
            href: "note",
            title: "测试",
        },
        {
            id: 7,
            href: "note",
            title: "测试",
        },
        {
            id: 8,
            href: "note",
            title: "测试",
        },
    ];
    export let eventTarget: EventTarget;
    function dispatchCustomEvent(data: string) {
        const customEvent = new CustomEvent<string>("CustomEvent", {
            detail: data,
        });
        eventTarget?.dispatchEvent(customEvent);
    }
</script>

<div class="grid grid-cols-4 overflow-auto p-4">
    {#each items as item (item.id)}
        <div class=" flex w-full h-full justify-center items-center">
            <button
                class=" flex flex-col justify-center items-center rounded-2xl w-16 h-16 bg-accent m-2 gap-2"
                on:click={() => dispatchCustomEvent(item.href)}
            >
                <svg
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    ><path
                        fill="#d9d9d9"
                        d="M101.802667 435.626667l384-298.666667a42.666667 42.666667 0 0 1 52.394666 0l384 298.666667a42.666667 42.666667 0 0 1 16.469334 33.578666V469.333333a42.666667 42.666667 0 0 1-41.813334 42.666667H896a42.666667 42.666667 0 0 1-26.197333-8.96L512 224.682667l-357.802667 278.272a42.666667 42.666667 0 0 1-24.874666 8.96L128 512a42.666667 42.666667 0 0 1-42.666667-41.386667V469.333333a42.666667 42.666667 0 0 1 16.469334-33.706666z"
                    ></path><path
                        fill="#d9d9d9"
                        d="M896 682.666667v-213.333334a42.666667 42.666667 0 1 0-85.333333 0v213.333334q0 53.034667-37.504 90.496Q735.701333 810.666667 682.666667 810.666667v-170.666667a85.333333 85.333333 0 0 0-85.333334-85.333333h-170.666666a85.333333 85.333333 0 0 0-85.333334 85.333333v170.666667q-53.034667 0-90.496-37.504Q213.333333 735.701333 213.333333 682.666667v-213.333334a42.666667 42.666667 0 0 0-85.333333 0v213.333334q0 88.362667 62.464 150.869333Q253.013333 896 341.333333 896h341.333334q88.362667 0 150.826666-62.464Q896 770.986667 896 682.666667z m-469.333333 128h170.666666v-170.666667h-170.666666v170.666667z"
                    ></path></svg
                >
                <p class="text-xs text-primary-content">{item.title}</p>
            </button>
        </div>
    {/each}
</div>
