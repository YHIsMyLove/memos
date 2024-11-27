<script lang="ts">
    import { onMount } from "svelte";
    import {
        globalCurrentDate,
        globalCurrentDay,
        statistics,
    } from "../lib/store";

    let currentDate = new Date();
    onMount(() => {});

    function getContributionLevel(count: number) {
        if (count === 0) return "bg-secondary";
        if (count === 1) return "bg-green-200";
        if (count === 2) return "bg-green-300";
        if (count === 3) return "bg-green-400";
        return "bg-green-500";
    }

    /**
     * 更新月份
     * @param increment
     */
    function changeMonth(increment: number) {
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + increment,
            1,
        );
        globalCurrentDate.set(currentDate);
    }

    const today = new Date().toDateString();
    /**
     * 切换日期
     * @param index
     */
    function switchDate(index: number) {
        const current = $statistics[index];
        console.log(current);
        if (current.count === 0) return;
        globalCurrentDay.set(new Date(current.date));
    }

    $: currentMonthYear = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
</script>

<div class=" flex flex-row mb-2 flex-nowrap">
    <div
        class="p-1 text-primary-content flex flex-col justify-center items-center flex-nowrap"
    >
        <div class="flex justify-center items-center mb-2 w-full">
            <button
                on:click={() => changeMonth(-1)}
                class="px-2 cursor-pointer"
            >
                &lt;
            </button>
            <h2 class="text-lg font-semibold">{currentMonthYear}</h2>
            <button
                on:click={() => changeMonth(1)}
                class=" px-2 cursor-pointer"
            >
                &gt;
            </button>
        </div>
        <div class="flex flex-wrap max-w-44 justify-start items-center">
            {#each $statistics as item, index}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    style="width: 1rem; height: 1rem; "
                    class=" flex-shrink-0 h-3 rounded-sm
                    {getContributionLevel(item.count)} 
                    cursor-pointer transition-colors duration-200 hover:opacity-80 m-1"
                    title={`${item.count} contributions`}
                    on:click={() => switchDate(index)}
                ></div>
            {/each}
        </div>
    </div>
    <div
        class=" flex-1
        flex
        flex-col
        flex-nowrap
        justify-between items-start"
    >
        <div class=" flex flex-col flex-nowrap">
            <p class="font-bold text-base text-primary-content">
                倒数日xxx · 10天
            </p>
            <p class="font-bold text-xs text-secondary-content">
                xxxx纪念日 | 2024年11月12日
            </p>
        </div>
        <div class=" flex flex-col flex-nowrap">
            <p class="font-bold text-base text-primary-content">国庆 · 250天</p>
            <p class="font-bold text-xs text-secondary-content">
                xxxx纪念日 | 2024年11月12日
            </p>
        </div>
        <div class=" flex flex-col flex-nowrap">
            <p class="font-bold text-base text-primary-content">国庆 · 250天</p>
            <p class="font-bold text-xs text-secondary-content">
                xxxx纪念日 | 2024年11月12日
            </p>
        </div>
        <a href="/" class="text-xs text-info-content mt-2">查看更多</a>
    </div>
</div>
