<script>
    import Timer from './page2/Timer.svelte';
    import Schedule from './page2/Schedule.svelte';
    //피곤해

    const handleUndefined = variable => variable || '00:00:00'
    const qualificationDue = new Date("6/19/22");
    const today = new Date('6/5/22');
    let hour, min, sec;
    let nowH, nowM, nowS;
    let formatedRemaining;
    let formatedNow;
    const time = setInterval(() => {
        let now = Date.now() - today + 1000;
        let remaining = qualificationDue - Date.now();

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

</script>

<div id="page2" class="grid">
    <div id="contentBox">
        <div>
            <div id="title"><p class="sc5">Timer & Schedule</p></div>
        </div>
        <div id="components">
            <Timer formatedRemaining={handleUndefined(formatedRemaining)}></Timer>
            <!-- <Schedule formatedNow = {handleUndefined(formatedNow)}></Schedule> -->
        </div>
    </div>
</div>

<style>
    #page2 {
        /* 스케줄 표 있을 때 */
        /* height: 100%; */
        /* 스케줄 표 없을 때 */
        height: 40%;
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