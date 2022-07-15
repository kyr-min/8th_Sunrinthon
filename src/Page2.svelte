<script>
    import Timer from "./page2/Timer.svelte";
    import Schedule from "./page2/Schedule.svelte";
    import MarkerDescCont from "./page2/MarkerDescCont.svelte";
    //피곤해

    const handleUndefined = (variable) => variable || "00:00:00";
    const qualificationDue = new Date("6/19/22");
    const today = new Date("6/5/22");
    const end = new Date("7/16/22 12:00:00");
    const start = new Date("7/15/22 10:00:00");
    const lunch = {
        TimeEnd: new Date("7/15/22 13:00:00"),
        title: "점심 식사"
    }
    const develop0 = {
        TimeEnd: new Date("7/15/22 15:00:00"),
        title: "개발"
    }

    const planMentoring = {
        TimeEnd: new Date("7/15/22 17:00:00"),
        title: "기획 멘토링"
    };
    const develop1 = {
        TimeEnd: new Date("7/15/22 17:30:00"),
        title: "개발"
    };
    const event1 = {
        TimeEnd: new Date("7/15/22 18:00:00"),
        title: "이벤트(추억의 뽑기 1차)"
    };
    const dinner = {
        TimeEnd: new Date("7/15/22 19:00:00"),
        title: "저녁 식사"
    };
    const develop2 = {
        TimeEnd: new Date("7/15/22 20:00:00"),
        title: "개발"
    };
    const devMentoring = {
        TimeEnd: new Date("7/15/22 22:30:00"),
        title: "개발 멘토링"
    };
    const develop3 = {
        TimeEnd: new Date("7/16/22 00:00:00"),
        title: "개발"
    };
    const yashik = {
        TimeEnd: new Date("7/16/22 01:00:00"),
        title: "야식(치킨)"
    };
    const event2_kahoot = {
        TimeEnd: new Date("7/16/22 01:30:00"),
        title: "이벤트(카훗, 스텝대전 1차)"
    };
    const dev_with_event3 = {
        TimeEnd: new Date("7/16/22 02:00:00"),
        title: "개발 및 이벤트(스텝대전 1차)"
    };
    const event4 = {
        TimeEnd: new Date("7/16/22 02:30:00"),
        title: "이벤트(추억의 뽑기 2차, 스텝대전 1차)"
    };
    const dev_with_event5 = {
        TimeEnd: new Date("7/16/22 03:00:00"),
        title: "개발 및 이벤트(스텝대전 1차)"
    };
    const dev_with_event6 = {
        TimeEnd: new Date("7/16/22 05:00:00"),
        title: "개발 및 이벤트(스텝대전 2차)"
    };
    const develop4 = {
        TimeEnd: new Date("7/16/22 06:00:00"),
        title: "개발"
    };
    const breakfast = {
        TimeEnd: new Date("7/16/22 06:30:00"),
        title: "아침 식사"
    };
    const submit = {
        TimeEnd: new Date("7/16/22 07:00:00"),
        title: "개발 및 제출"
    };
    const cleanup = {
        TimeEnd: new Date("7/16/22 08:00:00"),
        title: "책상 정리"
    };
    const judge = {
        TimeEnd: new Date("7/16/22 11:00:00"),
        title: "심사"
    };
    const finale = {
        TimeEnd: new Date("7/16/22 12:00:00"),
        title: "시상식"
    };

    const timeTable = [lunch, develop0, planMentoring, develop1, event1, dinner, develop2, 
    devMentoring, develop3, yashik, event2_kahoot, dev_with_event3, event4, dev_with_event5, dev_with_event6,
    develop4, breakfast, submit, cleanup, judge, finale    
]
    const full = end - start;
    let hour, min, sec;
    let nowH, nowM, nowS;
    let formatedRemaining;
    let allInfo;
    let formatedNow;

    let percentage;
    const time = setInterval(() => {
        let now = Date.now() - today + 1000;
        let eventOn;
        timeTable.forEach(el => {
            
            if((el.TimeEnd - Date.now()) <= 0) {
            } else {
                if(eventOn === undefined){
                    eventOn = el;
                }
                
                
            }
        });
        let remaining = eventOn.TimeEnd - Date.now();
        let fromStart = (Date.now() - start <= 0) ? 0 : (Date.now() - start);
        percentage =
            (parseInt((fromStart / full) * 100) >= 100)
                ? 100
                : parseInt((fromStart / full) * 100);

        hour = Math.floor(remaining / 1000 / 60 / 60);
        remaining -= hour * 1000 * 60 * 60;
        min = Math.floor(remaining / 1000 / 60);
        remaining -= min * 1000 * 60;
        sec = Math.floor(remaining / 1000);

        nowH = Math.floor(now / 1000 / 60 / 60);
        now -= nowH * 1000 * 60 * 60;
        nowM = Math.floor(now / 1000 / 60);
        now -= nowM * 1000 * 60;
        nowS = Math.floor(now / 1000);

        nowH = nowH % 24;

        formatedRemaining = `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
        formatedNow = `${nowH.toString().padStart(2, "0")}:${nowM
            .toString()
            .padStart(2, "0")}:${nowS.toString().padStart(2, "0")}`;
        allInfo = {
            formated: formatedRemaining,
            info: eventOn.title
        }
        
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
            <Timer formatedRemaining={handleUndefined(allInfo)} />
            <MarkerDescCont currentMarker={click} isOpen={open} />
            <Schedule
                formatedNow={handleUndefined(formatedNow)}
                progpercentage={percentage}
                bind:click
                bind:isOpen={open}
            />
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
            color: var(--grey);
        }
    }
</style>
