<script>
    const scrollTo = (where) => () => {
        const el = document.querySelector(where);
        
        el.scrollIntoView({
            behavior: 'smooth'
        });
    }
</script>

<nav>
    <div id="imageBox">
        <img src="/logo.PNG" alt="로고" id="nav_logo" />
    </div>
    <div id="nav_list_box">
        <ul id="nav_list">
            <li class="nav_item" on:click={scrollTo("main")}>메인화면</li>
            <li class="nav_item" on:click={scrollTo("#page2")}>타이머 & 일정</li>
            <li class="nav_item" on:click={scrollTo("#teamlist")}>참가팀</li>
            <li class="nav_item" on:click={scrollTo("#Information")}>대회 안내</li>
            <li class="nav_item" on:click={scrollTo("#page3contentBox")}>카드뉴스</li>
        </ul>
    </div>
</nav>

<style>
    /**일단 임시로 박아논 css 수정 맘대로해봐요*/
    nav {
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: space-around;
    }
    #imageBox {
        max-width: 50%;
        max-height: 100%;
    }
    #nav_logo {
        max-width: 100%;
        max-height: 100%;
        margin-top: 60px;
        width: 168px;
        height: 41px;
    }
    #nav_list_box {
    }
    #nav_list {
        list-style: none;
        user-select: none;
    }
    .nav_item {
        display: list-item;
        font-size: 1.8em;
        margin-left: 40px;
        margin-top: 15px;
        font-family: "SCDream7";
        color: white;
        float: left;
        cursor: pointer;
    }

    @media only screen and (max-width: 750px) {
        .nav_item {
            font-size: 1.5em;
            margin-left: 40px;
            margin-top: 3em;
            font-family: "SCDream7";
            color: white;
            float: left;
            cursor: pointer;
        }
        
    }

    @media only screen and (max-width: 700px) {
        #nav_list_box {
            display: none;
        }
    }

    

    @media only screen and (max-width: 480px) {
        #nav_list_box {
            display: none;
        }
    }
</style>
