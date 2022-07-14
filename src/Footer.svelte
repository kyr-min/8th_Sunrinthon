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
                <span class="sc7 white">개발</span> <span>김동건</span> <span>민경록</span>
            </p>
            <p class="sc4 white">
                <span class="sc7 white">디자인</span> <span>임동하</span> <span>이수빈</span> <span>김유진</span>
            </p>

            <p id="snsicons">

            </p>
        </div>
        <div id="staff">
            <p class="sc7 white">준비위원</p>
            <span class="sc4 white"><span>정연수</span> <span>지민경</span> <span>김동건</span> <span>김서윤</span> <span>김세희</span> <span>이종서</span> <span>송우진</span> <span>이제윤</span> <span>이진우</span> <span>김유진</span> <span>김유라</span> <span>임동하</span> <span>조승현</span> <span>강현빈</span> <span>김정은</span> <span>문정윤</span> <span>신동민</span> <span>이수빈</span> <span>최소영</span> <span>민경록</span> <span>윤서영</span> </span>
        </div>
    </div>
</footer>

<style>
    footer {
        width: 100%;
        height: fit-content;
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