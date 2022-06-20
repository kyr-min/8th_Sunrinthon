<script>
    export let formatedNow;

    const MissionTimeLine = [
        "00 : 00",
        "00 : 00",
        "00 : 00",
        "00 : 00",
        "00 : 00",
        "00 : 00"
    ]
</script>

<div>
    <div id="progressBarDescription">
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
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
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
                <p class="sc8">레크레이션</p>
                <p class="sc5">{MissionTimeLine[2]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
                <p class="sc8">멘토링</p>
                <p class="sc5">{MissionTimeLine[3]}</p>
            </div>
            <object class="markerSvg"type="image/svg+xml" data="/svgs/markerIcon.svg" title="marker">이 브라우저는 svg를 지원하지않습니다.</object>
        </div>
        <div class="MarkerBox">
            <div class="ScheduleTextBox">
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
        <div id="progressBar" />
        <div id="description">
            <span class="sc5 bluegreen">* 아이콘을 클릭하여 정보를 볼 수 있습니다</span>
            <span class="sc7 bluegreen">현재 시각 : {formatedNow}</span>
        </div>
    </div>
</div>

<style>
    #barDescription {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: center;
    }
    #progressBar {
        width: 95%;
        height: 9px;
        background-image: linear-gradient(
            to right,
            var(--blue-green) 20%,
            var(--grey) 1px
        );
        border-radius: 10px;
    }

    #progressBarDescription {
        display: flex;
        justify-content: space-evenly;
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
    }

    @media only screen and (max-width: 860px) {
        
    }
</style>
