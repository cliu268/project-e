let currentValue = 0;
let operand = 0;

function printResult() {
    let el = document.getElementById("Output");
    let outputString = Number(currentValue).toLocaleString('en-US', {maximumFractionDigits: 20}); 
    el.innerHTML = outputString;
    if (outputString.length <= 7) {
        el.style.fontSize = "100px";
    } else if (outputString.length === 8) {
        el.style.fontSize = "80px";
    } else if (outputString.length === 9) {
        el.style.fontSize = "80px";
    } else if (outputString.length === 10) {
        el.style.fontSize = "75px";
    } else if (outputString.length === 11) {
        el.style.fontSize = "70px";
    } else { // length >= 12
        el.style.fontSize = "65px";
    }
}

// check if next input digit is allowed
function allowOneMoreHit() {
    // replace negative sign and decimal points to count number of digits less than 9
    return ((currentValue + '').replace('-', '').replace('.', '').length >= 9) ? false : true;
}

function hit(clicked_id) {
    if (allowOneMoreHit()) {
        let neg = (currentValue < 0)? true : false;
        currentValue = Math.abs(currentValue);
        
        if (Number.isInteger(currentValue)) {
            currentValue = currentValue * 10 + parseInt(clicked_id);   
        } else {
            // find out number of decimal points d
            let d = currentValue.toString().split(".")[1].length;
            currentValue = parseFloat(currentValue) + parseFloat(Math.pow(10, -(d+1)) * parseInt(clicked_id));
            currentValue = parseFloat(currentValue).toFixed(d+1);
        }

        currentValue = neg ? -(currentValue):currentValue;

        printResult();
    }

    // if you hit any gray button (number or decimal), flip AC to C
    if (currentValue) {
        document.getElementById("AC").innerHTML = "C";
    }
}

function hitClear() {
    // if you hit AC button, flip AC button back to AC
    document.getElementById("AC").innerHTML = "AC";
    currentValue = 0;
    printResult();
}

function hitPMSign() {
    currentValue = -(currentValue);
    printResult();
}

function hitPercent() {
    // find out number of decimal points d
    let d = 0;
    if (!Number.isInteger(currentValue)) {
        d = currentValue.toString().split(".")[1].length;
    }
    // apply % and add 2 decimals to it
    currentValue = parseFloat(currentValue*0.01).toFixed(d+2);
    printResult();
}

function hitDiv() {
    operand = currentValue;
}

function hitMulti() {

}

function hitMinus() {

}

function hitPlus() {

}

function hitEqual() {

}