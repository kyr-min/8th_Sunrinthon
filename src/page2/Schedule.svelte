<script>
    export let formatedNow, click =0, isOpen= false, progpercentage;

    const MissionTimeLine = [
        "10 : 00",
        "15 : 00",
        "20 : 00",
        "1 : 00",
        "7 : 00",
        "11 : 00"
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
        <div class="MarkerBox first" on:click={changeInfo(0)}>
            <div class="ScheduleTextBox firstText">
                <p class="sc8">본선 시작</p>
                <p class="sc5">{MissionTimeLine[0]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div>
            
        </div>
        <div class="MarkerBox second" on:click={changeInfo(1)}>
            <div class="ScheduleTextBox">
                <p class="sc8">기획 멘토링</p>
                <p class="sc5">{MissionTimeLine[1]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div>
            
        </div>
        <div class="MarkerBox third" on:click={changeInfo(2)}>
            <div class="ScheduleTextBox rec" >
                <p class="sc8">개발 멘토링</p>
                <p class="sc5">{MissionTimeLine[2]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div>
            
        </div>
        <div class="MarkerBox fourth" on:click={changeInfo(3)}>
            <div class="ScheduleTextBox mentor" >
                <p class="sc8">이벤트</p>
                <p class="sc5">{MissionTimeLine[3]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div>
            
        </div>
        <div class="MarkerBox fifth" on:click={changeInfo(4)}>
            <div class="ScheduleTextBox" >
                <p class="sc8">제출</p>
                <p class="sc5">{MissionTimeLine[4]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div>
            
        </div>
        <div class="MarkerBox sixth">
            <div class="ScheduleTextBox">
                <p class="sc8">시상식</p>
                <p class="sc5">{MissionTimeLine[5]}</p>
                <div class="markerDiv"><object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object></div>
            </div> 
            
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
    .markerDiv {
        display:flex;
        justify-content: center;
        
    }

    #progressBarDescription {
        display: flex;
        min-width: 397px;
    }
    .MarkerBox {
        display: flex;
        
        flex-direction: column;
        width: calc(90% /6);
    }

    .ScheduleTextBox {
        width: fit-content;
        text-align: center;
        font-size: 1vw;
    }
    .markerSvg {
        max-width: 51px;
        width: 5vw;
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

    .first {
        margin-left: 0%;
    }
    .second {
        
        margin-left: calc(68% * 19/100 - 20% /6);
    }
    .third {
        
        margin-left: calc(68% * 19/100 - 20% /6);
    }
    .fourth {
        margin-left: calc(68% * 12/100 - 20% /6);
    }

    .fifth {
        margin-left: calc(68% * 23/100 - 20% /6);
    }

    .sixth {
        margin-left: calc(68% * 23/100 - 20% /6);
    }

    @media only screen and (max-width: 1100px) {
        .ScheduleTextBox {
            width: fit-content;
            text-align: center;
            font-size: 1vw;
        }
    }

    @media only screen and (max-width: 860px) {

        .firstText {
            
        }
        .mentor {
            margin-left: 12%;
        }

        .rec {
            margin-left: 0;
        }

        .ScheduleTextBox {
            font-size: 1vw;
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
