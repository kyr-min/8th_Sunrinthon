<script>
    export let currentMarker, isOpen;

    let texts = [
        "2022 8th 선린톤의 본 무대가 00월 00일 00시 00분에 시작합니다. \n모든 팀은 체육관으로 모여주세요.",
        "",
        "여러가지 이벤트를 통해 간식을 살 수 있는 코인을 드립니다.",
        "개발하면서 어렵거나 잘 하고 있는지 궁금할 때 멘토 선배님들의 멘토링을 받아보세요!",
        "스태프와의 대결을 통해 코인을 얻고 간식을 얻으세요!",
        ""
    ];

    let now = 0;
    let style;
    $: now = currentMarker;
    $: if(isOpen == false) {
        now = "No"
        style = "display: none;"
    } else {
        now = currentMarker;
        style = " ";

    }

</script>


<div id="markerDescCont">
    <div id="descBubble" class="on{now}" style={style}>
        <div id="topBubble">
            <p id="descText" class="sc6 brown">{texts[now]}</p>
            
        </div>
        <div id="bottomBubble">
            
        </div>
    </div>
</div>

<style>
    #markerDescCont {
        height: 44%;
        display: flex;
        flex-direction: column-reverse;
    }

    #descBubble {
        display: flex;
        flex-direction: column;
        
        width: fit-content;
        max-width: 20%;
        height: fit-content;
        
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));
        margin-bottom: 5%;
    }
    #topBubble {
        width:100%;
        height: 100%;
        background-color: var(--cream);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 16% 7%;
    }

    #bottomBubble {
        background-color: transparent;
        width: 100%;
        height: 10%;
    }

    #bottomBubble:before {
        content: "";
        position: absolute;
        margin-left: 12%;
        z-index: 3;
        border-top: 30px solid var(--cream);
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 25px solid transparent;
    }

    #bottomBubble:after {
        content: "";
        position: absolute;
        left: 90%;
        margin-top: -5%;
        border-top: 25px solid #F2C72B;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 20px solid transparent;
        border-top-right-radius: 10%;
        border-top-left-radius: 10%;
        border-bottom-left-radius: 10%;
        border-bottom-right-radius: 10%;
    }
    
    #descText {
        font-size: 1vw;
    }

    @media only screen and (max-width: 1100px) {
        #descText {
            font-size: 1.7vw;
        }

        #descBubble {
            display: flex;
            flex-direction: column;
        
            width: fit-content;
            max-width: 40%;
            height: fit-content;
        
            filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));
            margin-bottom: 5%;
        }
    }

    .on0 {
        margin-left: 0;
        
    }

    .on1 {
        margin-left: calc(calc(100% /6) * 1);
    }

    .on2 {
        margin-left: calc(calc(100% /6) * 2);
    }

    .on3 {
        margin-left: calc(calc(100% /6) * 3);
    }

    .on4 {
        margin-left: calc(calc(100% /6) * 4);
    }

    .on5 {
        margin-left: calc(calc(100% /6) * 5);
    }

    .onNo {
        display: none;
    }

    .on0:before {
        content: "본선 시작";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }
    .on1:before {
        content: "미션 1";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }
    .on2:before {
        content: "레크레이션";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }
    .on3:before {
        content: "멘토링";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }
    .on4:before {
        content: "스텝 대전";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }
    .on5:before {
        content: "미션 2";
        font-family: "SCDream7";
        color: #766143;
        font-size: 1vw;
        background-color: #F2C72B;
        z-index: 3;
        position: absolute;
        top: -7%;
        left: -7%;
        padding: 3px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 10px;
    }

    

    @media only screen and (max-width: 397px) {
        #markerDescCont {
            display:none;
        }
        
    }

    


</style>