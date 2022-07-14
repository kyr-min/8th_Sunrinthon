<script>
    const openLink = () => () => {
        window.open("https://bit.ly/8th_sunrinthon_tryout")
    }
</script>

<main>
    <div id="page1_cont1">
        <div id="content1Box">
            <div id="textBox">
                <p class="sc5 cream">선린인터넷 고등학교 최대규모 대회</p>
                <p class="sc7 cream">Sunrinthon</p>
            </div>
            <div id="assign">
                <div id="linkBox" on:click={openLink()}>
                    <span class="sc7">신청하기</span>
                </div>
            </div>
        </div>
    </div>
    <div id="page1_cont2">
        <img src="/textBubble.png" alt="선린 인터넷" id="textBubble" />
        <img src="/cursor.png" alt="커서 " id="handCursor" />
    </div>
</main>

<style>
    main {
        margin-top: 5%;
        display: flex;
        height: 75%;
    }

    #page1_cont1 {
        width: 55vw;
        height: 100%;
        display: flex;
        justify-content: center;
    }
    #page1_cont2 {
        width: 55vw;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }

    #content1Box {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    #textBox :nth-child(1) {
        font-size: 2.4rem;
    }

    #textBox :nth-child(2) {
        font-size: 5rem;
    }


    #linkBox {
        width: fit-content;
        background-color: #f7e79e;
        color: #a07f4e;
        border-radius: 10px;
        padding: 5px 40px 5px;
        box-shadow: 0px 10px 27px 2px rgba(0, 0, 0, 0.08);
        cursor: pointer;
    }

    #linkBox > span {
        font-size: 2.8rem;
    }

    #textBubble {
        position: relative;
        z-index: 1;
        width: 70%;
        filter: drop-shadow(0.6em 1em 0.5em var(--grey-for-shadow));
        animation: float 7s infinite;
    }

    #handCursor {
        position: absolute;
        z-index: 3;
        width: 5%;
        margin-left: 30%;
        margin-top: 15%;
        animation: float 7s infinite;
    }

    @keyframes float{
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(3%);
        }
        100% {
            transform: translateY(0);
        }
    }

    @media only screen and (max-width: 750px) {
        #textBox :nth-child(1) {
            font-size: 2.2rem;
        }
    }


    @media only screen and (max-width: 700px) {
        #page1_cont2 {
            display: none;
        }

        #page1_cont1 {
            width: 100%;
            text-align:center;
        }
        #assign {
            display: grid;
            place-items: center;
        }
    }

    @media only screen and (max-width: 480px) {
        #textBox :nth-child(1) {
            font-size: 2rem;
        }
        #textBox :nth-child(2) {
            font-size: 4rem;
        }
        #content1Box {
            margin-top: 8vh;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    @media only screen and (max-height: 445px) {
        #page1_cont2 {
            display: none;
        }
    }

</style>
