var interval = undefined;

section1.onclick = function() {
    showPercent()
};
section2.onclick = function() {
    showPercent()
};
next.onclick = function() {
    nextOption()
};


var index = 0;

var active = false;

showOption();


function showOption() {
    index = Math.floor(Math.random() * questions.length);
    text1.innerHTML = questions[index].option1.text;
    text2.innerHTML = questions[index].option2.text;
    next.style.visibility = "hidden";
}

function showPercent() {
    if (active) return;
    active = true;
    var i = 0;
    var a = 0;
    var c = Math.round((100 * questions[index].option1.votes) / (questions[index].option1.votes + questions[index].option2.votes));
    var q = questions[index].option1.votes;
    var e = questions[index].option2.votes;
    var d = 0;
    var h = 0;
    var u = 0;//hard code
    interval = setInterval(function() {
        i++;
        a += c * 0.01;
        d += (100 - c) * 0.01;
        h += q * 0.01;
        u += e * 0.01;
        percent1.innerHTML = "%" + Math.round(a) + " (" + Math.round(h) + ")";
        percent2.innerHTML = "%" + Math.round(d) + " (" + Math.round(u) + ")";

        if (i == 100) {
            clearInterval(interval);
            next.style.visibility = "visible";
        }
    }, 25);

}

function nextOption() {
    active = false;
    percent1.innerHTML = "";
    percent2.innerHTML = "";
    showOption();

}
