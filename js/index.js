section1.onclick = function() {
    showPercent()
};
section2.onclick = function() {
    showPercent()
};
next.onclick = function() {
    nextQuestion();
};

const twitch = new tmi.client({
    channels: [
        'AhmetOzkaan', 'Hype'
    ]
});

//var index = 0;
var debug = false;
var question = undefined;
var active = false;
var votes = {
    option1: [],
    option2: []
};

var voteTimeout = 0;

//debug = true;


showQuestion();


const changeProgress = (value) => {
    progress.style.width = `${value}%`;
};




function showQuestion() {
    //index = Math.floor(Math.random() * questions.length);
    question = questions[Math.floor(Math.random() * questions.length)];
    text1.innerHTML = question.option1.text;
    text2.innerHTML = question.option2.text;
    next.style.visibility = "hidden";

    updateChatPercent(false);

}

function calculatePercent(vote1, vote2) {
    return Math.round((100 * vote1) / (vote1 + vote2));
}

var interval = undefined;

function showPercent() {
    if (active) return;
    active = true;
    var i = 0;
    var a = 0;
    var c = calculatePercent(question.option1.votes, question.option2.votes);
    var q = question.option1.votes;
    var e = question.option2.votes;
    var d = 0;
    var h = 0;
    var u = 0; //hard code
    interval = setInterval(function() {
        i++;
        a += c * 0.01;
        d += (100 - c) * 0.01;
        h += q * 0.01;
        u += e * 0.01;
        percent1.innerHTML = "Global Veriler: %" + Math.round(a) + " (" + Math.round(h) + ")";
        percent2.innerHTML = "Global Veriler: %" + Math.round(d) + " (" + Math.round(u) + ")";

        if (i == 100) {
            clearInterval(interval);
            next.style.visibility = "visible";
        }
    }, 25);

    updateChatPercent(true);
}

function nextQuestion() {
    active = false;
    percent1.innerHTML = "";
    percent2.innerHTML = "";
    showQuestion();

    votes.option1 = [];
    votes.option2 = [];
    chatPercent1.innerHTML = "";
    chatPercent2.innerHTML = "";

    voteTimeout = 5;
    updateInfo();

    progress.style.visibility = "hidden";
    progressContainer.style.visibility = "hidden";
}

async function updateInfo() {
    while (voteTimeout > 0) {
        chatInfo1.innerHTML = "Oylama <span class = \"input\">" + voteTimeout + "</span> saniye sonra başlayacak.";
        chatInfo2.innerHTML = "Oylama <span class = \"input\">" + voteTimeout + "</span> saniye sonra başlayacak.";
        await new Promise(resolve => setTimeout(resolve, 1000));
        voteTimeout--;
    }
    chatInfo1.innerHTML = "Sohbete \"<span class = \"input\">1</span>\" yazarak oylamaya katıl!";
    chatInfo2.innerHTML = "Sohbete \"<span class = \"input\">2</span>\" yazarak oylamaya katıl!";
}

function updateChatPercent(forceShow) {
    option1Percent = calculatePercent(votes.option1.length, votes.option2.length);

    if (isNaN(option1Percent)) {
        if (!forceShow) return;
        chatPercent1.innerHTML = "Chat oylamaya daha katılmadı.";
        chatPercent2.innerHTML = "Chat oylamaya daha katılmadı.";
    } else {

        chatPercent1.innerHTML = "Chat: %" + option1Percent + " (" + votes.option1.length + ")";
        chatPercent2.innerHTML = "Chat: %" + (100 - option1Percent) + " (" + votes.option2.length + ")";

        progressContainer.style.visibility = "visible";
        progress.style.visibility = "visible";
        console.log(progressContainer.style.visibility)
        changeProgress(option1Percent);
    }

}

/*** TWITCH INTEGRATION  ***/




twitch.on('chat', (channel, userState, message) => {
    if (voteTimeout > 0 || question === undefined) return;

    var username = userState["display-name"];

    if (!debug && (votes.option1.includes(username) || votes.option2.includes(username))) return;

    if ("1" == message.toLocaleUpperCase('tr-TR')) votes.option1.push(username);
    else if ("2" == message.toLocaleUpperCase('tr-TR')) votes.option2.push(username);
    else return;

    updateChatPercent();

});

twitch.on('connected', (address, port) => {
    console.log(`* Connected to ${address}:${port}`);

    updateInfo();
});

twitch.connect().catch(console.error);
