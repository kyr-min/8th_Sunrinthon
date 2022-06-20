<script>
    import Nav from "./page1/Nav.svelte";
    import Main from "./page1/Main.svelte";
    import Seperator from "./page1/Seperator.svelte";
</script>

<div id="full">
    <div id="page" class="grid">
        <div id="contentContainer">
            <Nav />
            <Main />
        </div>
        
        <div id="scrollDown" class="sc6 cream">
            <div>
                <p class="sc4">●</p>
                <p >Scroll down</p>
            </div>
        </div>
        <!-- <div style="height: 300vh; width: 100%"></div> -->
    </div>
    <Seperator/>
</div>

<style>
    #full {
        width:100%;
        height: 100%;
    }

    #contentContainer {
        width: 100%;
        height: 100%;
    }

    #page {
        width: 100%;
        height: 90%;
        background-color: var(--blue-green);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #scrollDown {
        width: 100%;
        height: calc(90% / 10);
        bottom: 0px;
        font-size: 1.8rem;
        display: flex;
        justify-content: center;
        text-align: center;
    }
</style>
