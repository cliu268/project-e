const calculator = {
    outputString: '0',
    currentValue: 0,
    operator1: null,
    operator2: null,
    operand1: null,
    operand2: null,
    isPrevKeyOp: false,
    needDec: false,
    numZero: 0,
    negZero: false,
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
                calculator.outputString = '0';
                calculator.needDec = false;
                calculator.numZero = 0;
                calculator.negZero = false;
            }    
            hit(e.target.id);
            calculator.isPrevKeyOp = false;
            break;      
    }
});

function printResult() {
    let el = document.getElementById("Output");
    //calculator.outputString = Number(calculator.currentValue).toLocaleString('en-US', {maximumFractionDigits: 20}); 
    calculator.outputString = (parseFloat(Number(calculator.currentValue).toFixed(8))).toLocaleString('en-US', {maximumFractionDigits: 8});     
    if (calculator.needDec || (calculator.numZero && !calculator.outputString.includes('.'))) {
        calculator.outputString += '.';
    }
    for (let i = calculator.numZero; i > 0; i--) {
        calculator.outputString += '0';
    }
    if (calculator.negZero) {
        calculator.outputString = '-' + calculator.outputString;
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

function resetActionButtons(action) {
    let actionButtons = document.getElementsByClassName('right');
    for (let button of actionButtons) {
        if (button.value === action && 'equal' !== action) {
            button.setAttribute("style", "color:darkorange; background-color:white");
        } else {
            button.setAttribute("style", "color:white; background-color:darkorange");
        }
    }
}

// check if next input digit is allowed
function allowOneMoreHit() {
    // replace negative sign and decimal points to count number of digits less than 9
    return ((calculator.currentValue + '').replace('-', '').replace('.', '').length >= 9) ? false : true;
}

function hit(clicked_id) {
    const {currentValue, outputString, needDec, numZero} = calculator;
    if (allowOneMoreHit()) {
        let newValue = Math.abs(currentValue);
        let neg = (currentValue < 0)? true : false;
        
        // if you hit 0 we need to handle cases like 1.2000 cases differently
        if (clicked_id === '0' && outputString.includes('.')) {
            calculator.numZero += 1;
        } else if (clicked_id !== '.') {
            calculator.numZero = 0;
        }
        // if you hit '.' we need to print decimal if no dot yet but don't recompute value
        if (clicked_id === '.') {
            if (outputString.endsWith('.') || !outputString.includes('.')) {
                calculator.needDec = true;
            }
        } else {
            calculator.needDec = false;
        }
        // do not recompute if you hit '.'
        if (clicked_id !== '.') {
            if (Number.isInteger(newValue) && !needDec && !numZero) {
                newValue = newValue * 10 + parseInt(clicked_id);   
            } else {
                // find out number of decimal points d
                let d = needDec? 0 : outputString.split(".")[1].length;
                newValue = parseFloat(newValue) + parseFloat(Math.pow(10, -(d+1)) * parseInt(clicked_id));
                newValue = parseFloat(newValue).toFixed(d+1);
            }
            calculator.currentValue = neg ? -(newValue):newValue;
        }
        printResult();
    }

    // if you hit any gray button (number or decimal), flip AC to C
    if (calculator.currentValue || clicked_id === '.') {
        document.getElementById("AC").textContent = "C";
    }
    resetActionButtons(null);
}

function hitClear() {
    // if you hit AC button, flip AC button back to AC
    document.getElementById("AC").textContent = "AC";
    calculator.currentValue = 0;
    calculator.outputString = '0';
    calculator.operator1 = null;
    calculator.operator2 = null;
    calculator.operand1 = null;
    calculator.operand2 = null;
    calculator.isPrevKeyOp = false;
    calculator.needDec = false;
    calculator.numZero = 0;
    calculator.negZero = false;
    printResult();
    resetActionButtons(null);
}

function hitPMSign() {
    calculator.currentValue = -(calculator.currentValue);
    if (calculator.currentValue === 0) {
        calculator.negZero = !calculator.negZero;
    }
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
    const {currentValue, operand1, operand2, operator1, operator2, isPrevKeyOp} = calculator;

    // set action buttons color
    resetActionButtons(target.value);

    if (operator1 === null) {
        calculator.operand1 = calculator.currentValue;
    } else if (target.value === 'equal'|| !isPrevKeyOp) {
        // need to compute when equal is hit
        if (calculator.operand2 === null) {
            calculator.operand2 = calculator.currentValue;
        }
        // if you hit + or - following a number, compute first
        if (target.value === 'add' || target.value === 'subtract') {
            calculator.operand2 = calculator.currentValue;            
            compute(operand1, operator1, calculator.operand2);
            calculator.operand1 = calculator.currentValue;
            calculator.operand2 = calculator.currentValue;
        } else if (target.value == 'multiply' || target.value === 'divide') {
            calculator.operand2 = calculator.currentValue; 
            // need to recompute display value think of key seq '1+2+x'
            if (operator1 === 'add') {
                compute(operand1, 'subtract', calculator.operand2);
            } else if (operator1 === 'subtract') {
                compute(operand1, 'add', calculator.operand2);
            } else { // multiply or divide
                compute(operand1, operator1, calculator.operand2);
            }
            calculator.operand1 = calculator.currentValue;
            calculator.operand2 = calculator.currentValue;            
        } else { // target.value === 'equal'
            if (!isPrevKeyOp) {
                calculator.operand2 = calculator.currentValue;
            }
            compute(operand1, operator1, calculator.operand2);
            calculator.operand1 = calculator.currentValue;
        }
    } else if (operand2 !== null) {
        if (calculator.operator1 !== target.value && target.value !== 'add' && target.value !== 'subtract') {
            // need to recompute display value think of key seq '1+2+x'
            if (operator1 === 'add') {
                compute(operand1, 'subtract', operand2);
            } else if (operator1 === 'subtract') {
                compute(operand1, 'add', operand2);
            }
        } else { // ????this part is still wrong??????
            // case: '1+2=.3=' ==> 3.3 or 2.3 ?? 
            calculator.operand2 = calculator.currentValue;
            //compute();
        }
    }

    if (target.value !== 'equal') {
        calculator.operator1 = target.value;
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
            calculator.currentValue = (Number(op1)/Number(op2)).toFixed(8);
            break;
        case 'multiply':
            calculator.currentValue = (Number(op1)*Number(op2)).toFixed(8);
            break;
        case 'subtract':
            calculator.currentValue = (Number(op1)-Number(op2)).toFixed(8);
            break;
        case 'add':
            calculator.currentValue = (Number(op1)+Number(op2)).toFixed(8);
            break;
        case 'equal':
            compute(op1, calculator.operator1, op2);
            calculator.operand1 = calculator.currentValue;
            break;
        default:
            break;
    }
    calculator.needDec = false;
    calculator.numZero = 0;
    calculator.negZero = false;
    printResult();
}

// test cases:
// '1234567890PM' ==> show -123,456,789
// '0PM' ==> show -0
// '0.000000PM' ==> show -0.000000
// '.2xPM' ==> show -0  (*****)
// '0.' ==> show 0.
// '.10' ==> show 0.10
// '1.0' ==> show 1.0
// '1.02' ==> show 1.02 
// '1.0.' ==> show 1.0
// '1.0PM2' ==> show -1.02
// '1.0PM+' ==> show -1.0
// '1.0PM++' ==> show -1 (**-1.0)
// '1.0====' ==> show 1.0
// '1+2+3=' ==> show 6
// '1+2+3+' ==> show 6
// '1+2+3+4=' ==> show 10
// '1+2+3+4+' ==> show 10 
// '1+2+3+4+=' ==> show 20
// '1+2==' ==> 5
// '1+2+==' ==> 9
// '1+2+3+4=+=' ==> show 20
// '2x3==' ==> 18
// '2x3x=' ==> 36
// '1+2x3=' ==> 7 (**)
// '1+2+x3=' ==> 7 (when x is hit, display reverts from 3 to 2) (**)
// '1+2=.3=' ==> 3.3 ?? iphone shows 2.3 