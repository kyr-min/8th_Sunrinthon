<div id="descBubble">

</div>


<style>
    #descBubble {
        background-color: var(--cream);
        width: 20%;
        height: 70%;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
    }

    #descBubble:before{
        content: "본선시작";
        background-color: #F2C72B;
        width: 10px;
        height: 10px;
    }

    #descBubble:after{
        content: "";
        border-style: solid;
        top: 80%;
        border-top: 30px solid black;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 30px solid transparent;
    }
</style>