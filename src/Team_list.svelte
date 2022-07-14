<div id="teamlist">
    <div id="contentBox">
        <div id="teamConatainer">
            <div id="textBox">
                <div id="title">
                    <p class="sc5 cream">Sunrinthon Team Lists</p>
                </div>
                <div id="korTitle">
                    <p class="sc7 cream">선린톤 본선 참가팀 목록</p>
                    <p class="sc7 cream" id="pForMobile">참가팀 목록</p>
                </div>
            </div>
            <div id="teamList">
                <div class="listImageContainer">
                    <img src="/game.png" alt="게임 참가팀" />
                    <img src="/web-app.png" alt="웹-앱 참가팀" />
                </div>
            </div>
            <div id="teamList_mobile">
                <div class="listImageContainer">
                    <img src="/mobile_game.png" alt="게임 참가팀" />
                    <img src="/mobile_web.png" alt="웹-앱 참가팀" />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes teamList {
        0% {
            transform: translateX(0%);
        }
        48% {
            transform: translateX(0%);
        }
        50% {
            transform: translateX(-100%);
        }
        98% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(0%);
        }
    }
    #teamList {
        display: inline;
    }
    .listImageContainer {
        display: flex;
        height: fit-content;
    }

    .listImageContainer img {
        min-width: 100vw;
        height: auto;
    }

    .listImageContainer :nth-child(1) {
        animation: teamList 10s infinite;
    }
    .listImageContainer :nth-child(2) {
        animation: teamList 10s infinite;
    }

    #textBox {
        z-index: 10;
        position: absolute;
        margin-left: 15vw;
    }

    #title {
        margin-top: 2vw;
    }
    #title > p {
        font-size: 1.4vw;
    }

    #korTitle {
        font-size: 1.7vw;
    }

    #teamList_mobile {
        display: none;
    }

    #pForMobile {
        display:none;
    }

    @media only screen and (max-width: 570px) {
        #teamList {
            display: none;
        }
        #teamList_mobile {
            display: inline;
        }

        .listImageContainer {
           
        }
        .listImageContainer img {
            
            width: 100%;
        }

        #textBox {
            z-index: 10;
            position: absolute;
            margin-top: 1%;
            margin-left: 5%;
        }

        #title {
            display:none;
        }

        #korTitle {
            font-size: 4.7vw;
            margin-top: 4vw;
        }

        #korTitle :nth-child(1){
            display: none;
        }

        #pForMobile {
            display:inline;
        }
    }
</style>
