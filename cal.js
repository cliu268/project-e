let currentValue = 0;
function hit(clicked_id) {
    currentValue = currentValue * 10 + parseInt(clicked_id);
    document.getElementById("Output").innerHTML = currentValue;
}