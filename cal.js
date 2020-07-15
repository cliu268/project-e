let currentValue = 0;

function hit(clicked_id) {
    let el = document.getElementById("Output");
    let oldValue = currentValue;
    currentValue = currentValue * 10 + parseInt(clicked_id);   
    let outputString = currentValue.toLocaleString(); 
    if (outputString.length >= 12) {
        currentValue = oldValue;
        outputString = currentValue.toLocaleString();        
    }
    el.innerHTML = outputString;
    if (outputString.length <= 7) {
        el.style.fontSize = "100px";
        //el.style.paddingTop = "0px";
    } else if (outputString.length === 8) {
        el.style.fontSize = "80px";
        //el.style.paddingTop = "10px";
    } else if (outputString.length === 9) {
        el.style.fontSize = "80px";
        //el.style.paddingTop = "10px";
    } else if (outputString.length === 10) {
        el.style.fontSize = "75px";
        //el.style.paddingTop = "25px";
    } else if (outputString.length === 11) {
        el.style.fontSize = "70px";
        //el.style.paddingTop = "30px";
    } else {
        el.style.fontSize = "10px";
    }
    //el.style.paddingBottom = "0px"
}

function hitClear() {
    let el = document.getElementById("Output");
    currentValue = 0;
    el.innerHTML = currentValue.toLocaleString();
    el.style.fontSize = "100px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";
}