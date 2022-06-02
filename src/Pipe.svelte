<script lang="ts">
    import type { PipePair } from "./game";
    export let pipe: PipePair;
</script>

<style>
    .stalagmite {
        position: absolute;
        background-image: url('img/stalagmit.png');
        background-repeat: no-repeat;
        background-size: cover;
    }
    .stalactite {
        position: absolute;
        background-image: url('img/stalaktyt.png');
        background-size: 100% auto;
    }
</style>

{#if pipe.show }
<section
    style="left: {pipe.left}px; top: {pipe.topPipe.top}px; width: {pipe.width}px; height: {pipe.topPipe.height}px;"
    class="top-pipe stalagmite"
></section>
<section
    style="left: {pipe.left}px; top: {pipe.bottomPipe.top}px; width: {pipe.width}px; height: {pipe.bottomPipe.height}px;"
    class="top-bottom stalactite"
></section>
{/if}