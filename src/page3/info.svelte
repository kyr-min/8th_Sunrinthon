<script>
    export let select = 1,
        isOpen = false;

    let checkSame;
    const changeSelection = (num) => () => {
        if (checkSame == num) {
            checkSame = null;
            select = num;
            isOpen = false;
        } else {
            isOpen = true;
            select = num;
            checkSame = num;
        }
    };

    $: innerWidth = 0;
    let height;
    let lastHeight;
    $: lastHeight = (innerWidth / 1536) * 500;
    $: height = (innerWidth / 1536) * 500;
</script>

<div id="Information">
    <div id="InfoTextBox">
        <p class="sc5 grey">2022 8th Sunrinthon Information</p>
        <p class="sc8 black">2022 8th 선린톤 안내</p>
    </div>
    <div id="sectionsBox">
        <div class="section" on:click={changeSelection(1)}>
            <div class="svgContainer">
                <object
                    data="/svgs/whatsHackathon.svg"
                    type="image/svg+xml"
                    title="whatsHackathon"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">선린 해커톤?</p>
            </div>
        </div>
        <div class="section" on:click={changeSelection(2)}>
            <div class="svgContainer">
                <object
                    data="/svgs/offlineInfo.svg"
                    type="image/svg+xml"
                    title="offlineInfo"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">오프라인 안내</p>
            </div>
        </div>
        <div class="section" on:click={changeSelection(3)}>
            <div class="svgContainer">
                <object
                    data="/svgs/finalInfo.svg"
                    type="image/svg+xml"
                    title="finalInfo"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">본선 관련 안내</p>
            </div>
        </div>
        <div class="section" on:click={changeSelection(4)}>
            <div class="svgContainer">
                <object
                    data="/svgs/qualificationInfo.svg"
                    type="image/svg+xml"
                    title="qualificationInfo"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">예선 관련 안내</p>
            </div>
        </div>
        <div class="section" on:click={changeSelection(5)}>
            <div class="svgContainer">
                <object
                    data="/svgs/questionSNS.svg"
                    type="image/svg+xml"
                    title="offlineInfo"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">문의 / SNS</p>
            </div>
        </div>
        <div class="section" on:click={changeSelection(6)}>
            <div class="svgContainer">
                <object
                    data="/svgs/guideline.svg"
                    type="image/svg+xml"
                    title="guidline"
                    >이 브라우저는 svg를 지원하지않습니다.</object
                >
            </div>
            <div class="sectionText">
                <p class="sc7 sectionP">심사기준</p>
            </div>
        </div>
    </div>






    
    <div id="infoForMobile">
        <div id="infoForMobileContainer">
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/whatsHackathon.svg"
                        type="image/svg+xml"
                        title="whatsHackathon"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img1" style="background-size: auto {height}px; height: {height}px;  ">

                </div>

            </div>
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/offlineInfo.svg"
                        type="image/svg+xml"
                        title="offlineInfo"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img2" style="background-size: auto {height}px; height: {height}px; background-position: {-innerWidth * 1}px 0px;">

                </div>

            </div>
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/finalInfo.svg"
                        type="image/svg+xml"
                        title="finalInfo"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img3" style="background-size: auto {height}px; height: {height}px; background-position: {-innerWidth * 2}px 0px;">

                </div>

            </div>
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/qualificationInfo.svg"
                        type="image/svg+xml"
                        title="qualificationInfo"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img4" style="background-size: auto {height}px; height: {height}px; background-position: {-innerWidth * 3}px 0px;">

                </div>

            </div>
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/questionSNS.svg"
                        type="image/svg+xml"
                        title="offlineInfo"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img5" style="background-size: auto {height}px; height: {height}px; background-position: {-innerWidth * 4}px 0px;">

                </div>

            </div>
            <div class="sectionMobile">
                <div class="svgMobile">
                    <object
                        data="/svgs/guideline.svg"
                        type="image/svg+xml"
                        title="guidline"
                        >이 브라우저는 svg를 지원하지않습니다.</object
                    >
                </div>
                <div class="infoImgMobile img6" style="background-size: auto {lastHeight}px; height: {lastHeight}px; background-position: {-innerWidth * 5}px 0px;">

                </div>

            </div>
        </div>
    </div>
</div>

<style>
    #Information {
        display: flex;
        flex-direction: column;
        width: 70%;
    }
    #InfoTextBox :nth-child(1) {
        font-size: 1.8rem;
    }

    #InfoTextBox :nth-child(2) {
        font-size: 2.4rem;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    #InfoTextBox {
    }

    #sectionsBox {
        align-items: stretch;
        height: 100%;
        display: flex;
    }
    .sectionText {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .sectionP {
        color: #5e5e60;
        font-size: 2.4rem;
    }

    object {
        width: 40%;
    }

    .section {
        padding-top: 3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 15%;
        background-color: var(--cream);
        box-shadow: 0px 3px 12px 2px rgba(0, 0, 0, 0.41);
        border-radius: 10px;
        justify-content: center;
        height: 150%;
    }

    .svgContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        min-height: 70%;
    }

    .section:not(:last-child) {
        margin-right: 20px;
    }

    #infoForMobile {
        display:none;
    }

    @media only screen and (max-width: 1600px) {
        .sectionP {
            font-size: 2rem;
        }
    }

    @media only screen and (max-width: 1400px) {
        .sectionP {
            font-size: 1.8rem;
        }
    }

    @media only screen and (max-width: 1200px) {
        .sectionP {
            font-size: 1.6rem;
        }
    }

    @media only screen and (max-width: 1010px) {
        .sectionP {
            font-size: 1.4rem;
        }
    }

    @media only screen and (max-width: 900px) {
        .sectionP {
            font-size: 1.2rem;
        }
    }

    @media only screen and (max-width: 820px) {
        #sectionsBox {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }
        .section:not(:last-child) {
            margin-right: 10px;
        }
        .section {
            width: 25%;
            height: 40%;
            margin: 1em;
        }
        .sectionP {
            font-size: 1rem;
        }
    }

    @media only screen and (max-width:480px) {
        #Information {
            width: 100%;
            height: 45%;
        }
        #sectionsBox {
            display: none;
        }
        #infoForMobile{
            display: inline;
        }
        #infoForMobileContainer {
            width: 100%;
        }

        .sectionMobile:first-child {
            margin-top: 10%;
            
        }
        .svgMobile {
            position: absolute;
            display:flex;
            justify-content: center;
            align-items: center;
            margin-left: 5%;
            padding-top: 4%;
            padding-bottom: 4%;
            margin-top: -10%;
            z-index: 2;
            width:15%;
            background: #F8F0DE;
            border-radius: 10px;
            box-shadow: 0px 3px 12px 2px rgba(0, 0, 0, 0.41);
        }

        .infoImgMobile {
            outline: 1px beige solid;
            background-image: url('/Imageslide.png');
            width: 100vw;
        }
    } 


</style>

<svelte:window bind:innerWidth />