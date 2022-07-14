<script>
    import Timer from './page2/Timer.svelte';
    import Schedule from './page2/Schedule.svelte';
    import MarkerDescCont from './page2/MarkerDescCont.svelte'
    //피곤해

    const handleUndefined = variable => variable || '00:00:00'
    const qualificationDue = new Date("6/19/22");
    const today = new Date('6/5/22');
    const end = new Date("7/16/22 12:00:00");
    const start = new Date("7/15/22 10:00:00");
    const full = end-start;
    let hour, min, sec;
    let nowH, nowM, nowS;
    let formatedRemaining;
    let formatedNow;

    let percentage;
    const time = setInterval(() => {
        
        let now = Date.now() - today + 1000;
        let remaining = start - Date.now();
        console.log(remaining)
        let fromStart = (now - start <= 0) ? 0 : (now - start);
        percentage = (parseInt(fromStart / full * 100) >= 100) ? 100 : parseInt(fromStart / full * 100);

        hour = Math.floor(remaining/1000  / 60 / 60);
        remaining -= hour* 1000 * 60 * 60
        min = Math.floor(remaining / 1000 / 60);
        remaining -= min * 1000 * 60
        sec = Math.floor(remaining / 1000);

        nowH = Math.floor(now/1000  / 60 / 60);
        now -= nowH* 1000 * 60 * 60
        nowM = Math.floor(now / 1000 / 60);
        now -= nowM * 1000 * 60
        nowS = Math.floor(now / 1000);

        nowH = nowH % 24;

        formatedRemaining = `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
        formatedNow = `${nowH.toString().padStart(2,'0')}:${nowM.toString().padStart(2,'0')}:${nowS.toString().padStart(2,'0')}`
    }, 1000);


    let click;
    let open;
</script>

<div id="page2" class="grid">
    <div id="contentBox">
        <div>
            <div id="title"><p class="sc5">Timer & Schedule</p></div>
        </div>
        <div id="components">
            <Timer formatedRemaining={handleUndefined(formatedRemaining)}></Timer>
            <MarkerDescCont currentMarker={click} isOpen={open}></MarkerDescCont>
            <Schedule formatedNow = {handleUndefined(formatedNow)} progpercentage= {percentage} bind:click={click} bind:isOpen={open}></Schedule>
        </div>
    </div>
</div>

<style>
    #page2 {
        /* 스케줄 표 있을 때 */
        height: 98.7%;
        /* 스케줄 표 없을 때 */
        /* height: 40%; */
        width: 100%;
        background-color: var(--cream);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 10%;
    }
    
    #title > p {
        font-size: 1.8rem;
    }

    #contentBox {
        width: 70%;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
    }

    #components {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        
    }
    @media only screen and (max-width: 1500px) {
        #page2 {
            height: 80%;
        }
    }

    @media only screen and (max-width: 860px) {
        #page2 {
            height: 80%;
        }
    }


    @media only screen and (max-width: 480px) {
        #contentBox {
            width: 85%;
        }
        #title > p {
            font-size: 1.4em;
            color: var(--grey)
        }
    }
</style>