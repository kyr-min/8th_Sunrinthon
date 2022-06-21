<script>
    export let currentImage, isOpen;

    $: innerWidth = 0;
    let height;
    let width
    
    $: (currentImage == 6) ? height = (innerWidth / 1536) * 500 : height = (innerWidth / 1536) * 338;
    $: if(!isOpen) {
        height = 0;
    } else {
        (currentImage == 6) ? height = (innerWidth / 1536) * 500 : height = (innerWidth / 1536) * 338;
    }
</script>

<div id="InfoImageSprite" style="background-position : {-innerWidth * ((currentImage) ? (currentImage-1) : 0)}px 0; height: {height}px;">
</div>

<style>
    #InfoImageSprite {
        background: url('/Imageslide.png');
        width: 600%;
        height: 338px;
        transition: all .4s ease-in-out;
        background-size:cover;
    }

    @media only screen and (max-width: 1536px){
        #InfoImageSprite {
            background-size: cover;
        }
    }


</style>

<svelte:window bind:innerWidth />