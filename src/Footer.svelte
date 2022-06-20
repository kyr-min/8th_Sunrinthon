<script>
    

</script>

<footer>
    <div id="leftDiv">
        <div id="dummy"></div>
        <div id="copyright" class="sc4 white">
            <p >© 2022. 선린인터넷고등학교</p>
            <p>All Rights Reserved.</p>
        </div>
    </div>
    <div id="rightDiv">
        <div id="web">
            <p class="sc7 white">웹사이트</p>
            <p class="sc4 white">
                <span class="sc7 white">개발</span> 김동건 민경록
            </p>
            <p class="sc4 white">
                <span class="sc7 white">디자인</span> 임동하 이수빈 김유진
            </p>

            <p id="snsicons">

            </p>
        </div>
        <div id="staff">
            <p class="sc7 white">준비위원</p>
            <span class="sc4 white">정연수 지민경 김동건 김서윤 김세희 이종서 송우진 이제윤 이진우 김유진 김유라 임동하 조승현 강현빈 김정은 문정윤 신동민 이수빈 최소영 민경록 윤서영</span>
        </div>
    </div>
</footer>

<style>
    footer {
        width: 100%;
        height: 40%;
        background-color: var(--blue-green);
        display: flex;
        justify-content: space-around;
        font-size: 1.6em;
    }
    #leftDiv {
        width: 40%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        
    }
    #dummy {
        width: 100%;
        height: 30%;
    }
    #rightDiv {
        
        width: 40%;
        max-height: 100%;
        display: flex;
        justify-content: center;
    }
    #snsicons{
        height: 30%;
    }
    #web {
        display: flex;
        flex-direction: column;
        text-align: right;
        justify-content: flex-start;
        margin-right: 3em;
        margin-top: 3em;
        margin-bottom: 3em;
    }

    #web :not( :first-child){
        margin-top: 1em;
    }

    #web > p > span {
        margin-right: 1em;
    }
    #staff {
        display: flex;
        flex-direction: column;
        text-align: right;
        justify-content: flex-start;
        width: 15rem;
        margin-top: 3em;
    }

    @media only screen and (max-width: 1050px) {
        footer {
            width:100%;
            flex-direction: column-reverse;
        }
        #leftDiv{
            width: 100%;
            font-size: x-small;
        }
        #rightDiv {
            width: 100%;
            font-size: 1.3rem;
        }
        #web > p > span {
            margin-right: 0.5em;
        }
        #web {
            width: 37%;
        }
        #staff {
            width: 60%;
            margin-right: 0.3em;
        }
    }
</style>