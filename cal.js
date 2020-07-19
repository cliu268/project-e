const calculator = {
    outputString: '0',
    currentValue: 0,
    operator: null,
    operand1: null,
    operand2: null,
    isPrevKeyOp: false,
    needDec: false,
};

const calButtons = document.querySelector('#Keyboard');
calButtons.addEventListener('click', e => {
    console.log(e.target);
    switch (e.target.className) {
        case 'top':
            if (e.target.value === "AC") {
                hitClear();
            } else if (e.target.value === "PM") {
                hitPMSign();
            } else if (e.target.value === "Percent") {
                hitPercent();
            }
            calculator.isPrevKeyOp = false;
            break;
        case 'right':
            hitOp(e.target);
            calculator.isPrevKeyOp = true;
            break;
        default: // this would be digit or decimal point
            if (calculator.isPrevKeyOp) {
                calculator.currentValue = 0;
            }    
            hit(e.target.id);
            calculator.isPrevKeyOp = false;
            break;      
    }
});

function printResult() {
    let el = document.getElementById("Output");
    calculator.outputString = Number(calculator.currentValue).toLocaleString('en-US', {maximumFractionDigits: 20}); 
    if (calculator.needDec) {
        calculator.outputString += '.';
    }
    el.textContent = calculator.outputString;
    if (calculator.outputString.length <= 7) {
        el.style.fontSize = "100px";
    } else if (calculator.outputString.length === 8) {
        el.style.fontSize = "80px";
    } else if (calculator.outputString.length === 9) {
        el.style.fontSize = "80px";
    } else if (calculator.outputString.length === 10) {
        el.style.fontSize = "75px";
    } else if (calculator.outputString.length === 11) {
        el.style.fontSize = "70px";
    } else { // length >= 12
        el.style.fontSize = "65px";
    }
}

// check if next input digit is allowed
function allowOneMoreHit() {
    // replace negative sign and decimal points to count number of digits less than 9
    return ((calculator.currentValue + '').replace('-', '').replace('.', '').length >= 9) ? false : true;
}

function hit(clicked_id) {
    const {currentValue, outputString, needDec} = calculator;
    if (allowOneMoreHit()) {
        let newValue = Math.abs(currentValue);
        let neg = (currentValue < 0)? true : false;
        
        if (clicked_id === '.') {
            if (Number.isInteger(newValue)) {
                calculator.needDec = true;
                printResult();
            }
            return;
        } else {
            calculator.needDec = false;
        }

        if (Number.isInteger(newValue) && !needDec) {
            newValue = newValue * 10 + parseInt(clicked_id);   
        } else {
            // find out number of decimal points d
            let d = needDec? 0 : outputString.split(".")[1].length;
            newValue = parseFloat(newValue) + parseFloat(Math.pow(10, -(d+1)) * parseInt(clicked_id));
            newValue = parseFloat(newValue).toFixed(d+1);
        }

        calculator.currentValue = neg ? -(newValue):newValue;

        printResult();
    }

    // if you hit any gray button (number or decimal), flip AC to C
    if (calculator.currentValue) {
        document.getElementById("AC").textContent = "C";
    }
}

function hitClear() {
    // if you hit AC button, flip AC button back to AC
    document.getElementById("AC").textContent = "AC";
    calculator.currentValue = 0;
    calculator.outputString = '0';
    calculator.operator = null;
    calculator.operand1 = null;
    calculator.operand2 = null;
    calculator.isPrevKeyOp = false;
    calculator.needDec = false;
    printResult();
}

function hitPMSign() {
    calculator.currentValue = -(calculator.currentValue);
    printResult();
}

function hitPercent() {
    const {outputString, currentValue} = calculator;
    // find out number of decimal points d
    let dec = outputString.split(".")[1];
    let d = dec? dec.length : 0;
    // apply % and add 2 decimals to it
    calculator.currentValue = parseFloat(currentValue*0.01).toFixed(d+2);
    printResult();
}

function hitOp(target) {
    const {currentValue, operand1, operand2, operator, isPrevKeyOp} = calculator;
    // set action buttons color
    let actionButtons = document.getElementsByClassName('right');
    for (let button of actionButtons) {
        if (button.value === target.value && target.value !== 'equal') {
            button.setAttribute("style", "color:darkorange; background-color:white");
        } else {
            button.setAttribute("style", "color:white; background-color:darkorange");
        }
    }

    if (operator === null) {
        calculator.operand1 = calculator.currentValue;
    } else if (target.value === 'equal'|| !isPrevKeyOp) {
        // need to compute when equal is hit
        if (calculator.operand2 === null) {
            calculator.operand2 = calculator.currentValue;
        }
        compute(operand1, operator, calculator.operand2);
        calculator.operand1 = calculator.currentValue;
    } else if (operand2 !== null) {
        if (calculator.operator !== target.value && target.value !== 'add' && target.value !== 'subtract') {
            // need to recompute display value think of key seq '1+2+x'
            if (operator === 'add') {
                compute(operand1, 'subtract', operand2);
            } else if (operator === 'subtract') {
                compute(operand1, 'add', operand2);
            }
        } else {
            calculator.operand2 = calculator.currentValue;
            //compute();
        }
    }

    // switch (target.value) {
    //     case 'divide':
    //         // compute and update display if all exist
    //         if (operand2 !== null) {
    //             if (operator === 'multiply' || operator === 'divide') {
    //                 compute(operand1, operator, operand2);
    //             } else if (operator === 'add' || operator === 'subtract') {

    //             }
    //         }
    //         break;
    //     case 'multiply':
    //         break;
    //     case 'subtract':
    //         break;
    //     case 'add':
    //         break;
    //     case 'equal':
    //         break;
    //     default:
    //         break;
    // }
    if (target.value !== 'equal') {
        calculator.operator = target.value;
    }
    calculator.isPrevKeyOp = true;
}

function compute(op1, op, op2) {
    console.log(op1, op, op2);
    if (op2 === null) {
        op2 = calculator.currentValue;
    }
    switch (op) {
        case 'divide':
            calculator.currentValue = op1/op2;
            break;
        case 'multiply':
            calculator.currentValue = op1*op2;
            break;
        case 'subtract':
            calculator.currentValue = op1-op2;
            break;
        case 'add':
            calculator.currentValue = op1+op2;
            break;
        case 'equal':
            calculator.currentValue = calculator.operand1 = compute(op1, calculator.operator, op2);
            break;
        default:
            break;
    }
    printResult();
}