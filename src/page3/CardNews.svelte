<script>
    let count = 1;
    let bigCount = 1;
    $: innerWidth = 0;
    let offset = 10;
    let bigOffset = 12;

    let final;

    setInterval(() => {
        if (innerWidth <= 480) {
            if (count < 5) {
                offset -= 95;
                count++;
            } else {
                offset += 95;
                count++;
            }
            if (count >= 9) {
                count = 1;
            }
            final = offset;
        } else {
            if(bigCount < 4) {
                bigOffset  -= 31;
                bigCount++;
            } else {
                bigOffset += 31;
                bigCount++;
            }
            if(bigCount >= 7){
                bigCount = 1;
            }
            final = bigOffset;
        }
    }, 5000);
</script>

<div id="page3contentBox">
    <div id="cardNewsTextBox">
        <div id="title"><p class="sc5">Card News</p></div>
        <div id="kr-title"><p class="sc8">카드 뉴스</p></div>
    </div>
    
    <div class="cardNews">
        <div id="slideContainer" style="left: {final}vw;">
            <div class="slide">
                <img src="./cards/card1.png" alt="카드뉴스" />
            </div>
            <div class="slide">
                <img src="/cards/card2.png" alt="카드뉴스" />
            </div>
            <div class="slide">
                <img src="/cards/card3.png" alt="카드뉴스" />
            </div>
            <div class="slide">
                <img src="/cards/card4.png" alt="카드뉴스" />
            </div>
            <div class="slide">
                <img src="/cards/card5.png" alt="카드뉴스" />
            </div>
        </div>
    </div>
    <div class="cardNewsDummy"></div>
</div>

<svelte:window bind:innerWidth />

<style>
    #cardNewsTextBox {
        margin-left: 15%;
    }
    #slideContainer {
        display: flex;
        position: absolute;
        left: 12vw;
        transition: all 0.4s ease-in-out;
    }

    

    #slideContainer :after {
    }

    .cardNews {
        display: flex;
        width: 100%;
        filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.4));
    }

    .cardNews:after {
        background-image: linear-gradient(
            to right,
            var(--rgba-grey) 1px,
            transparent 100px
        );
    }

    /* .cardNews:hover {
        animation-play-state: paused;
    } */

    .slide {
        display: flex;
        align-items: center;
        perspective: 10em;
        transition: transform 0.4s;
        width: 30%;
        margin-right: 20px;
    }

    .slide:hover {
        transform: scale(1.02);
    }

    #title > p {
        font-size: 1.8rem;
    }

    #kr-title > p {
        font-size: 2.4rem;
    }

    

    @keyframes scroll {
        0% {
            transform: translateX(-50%);
        }
        100% {
            transform: translateX(5%);
        }
    }

    @media only screen and (max-height: 650px) {
        .cardNewsDummy {
            width: 100%;
            height: 40vw;
        }
    }

    @media only screen and (max-width: 480px) {
        #slideContainer {
            position: absolute;
            display: flex;
            animation: none;
            left: 10vw;
        }

        .cardNewsDummy {
            width: 100%;
            height: 100vw;
        }
        .slide {
            width: 90vw;
        }

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
