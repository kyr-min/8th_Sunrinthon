<script>
    export let formatedNow, click =0, isOpen= false, progpercentage;

    const MissionTimeLine = [
        "10 : 00",
        "00 : 00",
        "17 : 00",
        "20 : 00",
        "01 : 00",
        "00 : 00"
    ]

    let checkSame;
    const changeInfo = (num) => () => {
        if (checkSame == num) {
            checkSame = null;
            click = num;
            isOpen = false;
        } else {
            isOpen = true;
            click = num;
            checkSame = num;
        }
    };

    $: console.log(progpercentage);


</script>

<div id="progWrapper">
    <div id="progressBarDescription">
        <div class="MarkerBox" on:click={changeInfo(0)}>
            <div class="ScheduleTextBox firstText">
                <p class="sc8">본선 시작</p>
                <p class="sc5">{MissionTimeLine[0]}</p>
            </div>
            <object class="markerSvg" type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
                <p class="sc8">미션 1</p>
                <p class="sc5">{MissionTimeLine[1]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox" on:click={changeInfo(2)}>
            <div class="ScheduleTextBox rec" >
                <p class="sc8">레크레이션</p>
                <p class="sc5">{MissionTimeLine[2]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox" on:click={changeInfo(3)}>
            <div class="ScheduleTextBox mentor" >
                <p class="sc8">멘토링</p>
                <p class="sc5">{MissionTimeLine[3]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox" on:click={changeInfo(4)}>
            <div class="ScheduleTextBox" >
                <p class="sc8">스텝 대전</p>
                <p class="sc5">{MissionTimeLine[4]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
                <p class="sc8">미션 2</p>
                <p class="sc5">{MissionTimeLine[5]}</p>
            </div> 
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
    </div>
    <div id="barDescription">
        <div id="progressBar" style="background-image: linear-gradient(
            to right,
            var(--blue-green) {progpercentage}%,
            var(--grey) 1px
        );"/>
        <div id="description">
            <span class="sc5 bluegreen" id="clickIcon">* 텍스트를 클릭하여 정보를 볼 수 있습니다</span>
            <span class="sc5 bluegreen" id="scrollMobile">* 좌우로 스크롤 해주세요</span>
            <span class="sc7 bluegreen">현재 시각 : {formatedNow}</span>
        </div>
    </div>
</div>

<style>

    #progWrapper {
        height: 15%;
        
    }
    #barDescription {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: center;
        min-width: 397px;
    }
    #progressBar {
        width: 95%;
        height: 9px;
        background-image: linear-gradient(
            to right,
            var(--blue-green) 0%,
            var(--grey) 1px
        );
        border-radius: 10px;
        
    }

    #progressBarDescription {
        display: flex;
        justify-content: space-evenly;
        min-width: 397px;
    }
    .MarkerBox {
        display: flex;
        flex-direction: column;
        width: calc(90%/6);
    }

    .ScheduleTextBox {
        width: fit-content;
        text-align: center;
        font-size: 1.8em;
    }
    .markerSvg {
        margin-left: 9px;
        width: 51px;
    }
    #description {
        width:95%;
        display: flex;
        justify-content: space-between;
        font-size: 1.2vw;
    }

    #scrollMobile {
        display: none;
    }
    @media only screen and (max-width: 1100px) {
        .rec {
            margin-left: -10%;
        }
    }

    @media only screen and (max-width: 860px) {

        .firstText {
            margin-left: 9%;
        }
        .mentor {
            margin-left: 12%;
        }

        .rec {
            margin-left: 0;
        }

        .ScheduleTextBox {
            font-size: 1.5vw;
            margin-left: 19%;
            text-align: center;

        }
    }
    
    @media only screen and (max-width: 397px) {
        #scrollMobile {
            display: inline;
        }

        #clickIcon {
            display:none;
        }
        
    }

    @media only screen and (max-width: 396px) {
        #progWrapper {
            height:max-content;
            overflow-x: scroll;
        }
    }

    @media only screen and (max-width: 570px) {
        object {
            display: none;
        }
    }
</style>
