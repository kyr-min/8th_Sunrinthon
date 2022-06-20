<div id="teamlist">
    <div id="contentBox">
        <div id="textBox">
            <div id="title"><p class="sc5 cream">Sunrinthon Team Lists</p></div>
            <div id ="korTitle"><p class="sc7 cream">선린톤 본선 참가팀 목록</p></div>
        </div>
        <div id="borderbox">
            <div class="slider">
                <input type="radio" name="slide" id="game" checked>
                <input type="radio" name="slide" id="web-app">
                    <ul class="slidelist">
                        <li class="slideitem"> 
                            <div>
                                <label for="web-app" class="left"></label>
                                <label for="web-app" class="right"></label>
                                <a><img src="/game.png"></a>
                            </div>
                        </li>
                        <li class="slideitem"> 
                            <div>
                                <label for="game" class="left"></label>
                                <label for="game" class="right"></label>
                                <a><img src="/web-app.png"></a>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>     
    </div>
</div>
<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #teamlist{
        width: 100%;
        height: 70%;
        background-color: green;
        display: flex;
        align-content: center;
        justify-content: center;   
    }

    #contentBox{
        width: 70%;
        height: 90%;
    }

    #title{
        margin-top: 45px;
        
    }

    #title > p{
        font-size: 1.8rem;
    }
    
    #korTitle{
        font-size: 2.4rem;
    }

    #text1{
        font-size: 6.4rem;
        margin-top: 13%;
    }

    ul, li{list-style: none;}

    [name = "slide"] {display: none;}
    .slider{
        max-width: 153.6rem;
        max-height: 52rem;
        margin: 0 auto;
        
    }
    .slider img{
        max-width: 100%;
    }
    .slider .slidelist{
        white-space: nowrap;
        font-size: 0;
        overflow: hidden;
    }
    .slider .slideitem{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
        transition:all .35s;
    }

    .slider .slideitem label{
        position: absolute;
        z-index: 1;
        transform: translateY(-50%);
        padding: 20px;
        border-radius: 50%;
        cursor: pointer;
    }
    label.left{
        left: 2rem;
        background-position: center center;
        background-size: 50%;
        background-repeat: no-repeat; 
    }
    label.right{
        right: 2rem;
        background-position: center center;
        background-size: 50%;
        background-repeat: no-repeat; 
    }

    #game:checked ~ .slidelist .slideitem {transform: translateX(0); animation:game 10s infinite;}
    #web-app:checked ~ .slidelist .slideitem {transform: translateX(-100%); animation:web-app 10s infinite;}

    @keyframes game{
        0% {left: 0%;}
        48% {left: 0%;}
        50% {left: -100%;}
        98% {left: -100%;}
        100%{left: 0%;}

    }

    @media only screen and (max-width: 570px) {
        #text1{
            font-size: 4rem;
            margin-top: 50%;
        }
    }

    
</style>