<script lang="ts">
    import type { Bird } from "./game";
    export let bird: Bird;
</script>

<style>
    #bird-down {
        background-image: url('img/down.png');
        background-size: cover;
        position: absolute;
    }
    #bird-up {
        background-image: url('img/up.png');
        background-size: cover;
        position: absolute;
    }
</style>

{#if !bird.jump }
<section
    style="width: {bird.width}px; height: {bird.height}px; top: {bird.top}px; left: {bird.left}px;"
    id="bird-down"
></section>
{/if}
{#if bird.jump }
<audio autoplay src="https://github.com/Arentalon/DragonGame/blob/main/public/build/audio/wingMovement.mp3?raw=true"/> 
<section
    style="width: {bird.width}px; height: {bird.height}px; top: {bird.top}px; left: {bird.left}px;"
    id="bird-up"
></section>
{/if}