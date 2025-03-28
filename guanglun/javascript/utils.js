const leading = "http://bwglobal.inetfile.org/LR-mp3/001-160/";

function minsec2sec(minsec) {
    var tokens = minsec.split(":")
    if (tokens.length == 1)
        return parseInt(minsec);
    else if (tokens.length == 2) {
        return parseInt(tokens[0]) * 60 + parseInt(tokens[1]);
    }
    else return 0;
}
function sectominsec(secs){
    min = Math.floor(secs/60);
    sec = secs - min*60;
    return `${min}:${sec}`
}
function setYinDang(event) {
    var data = event.target.innerText;
    data = data.substring(1, data.length-1)
    tokens= data.split(":")
    vol = tokens[0];
    starttimeinsecs=parseInt(tokens[1])*60+parseInt(tokens[2])
    audio.pause();
    let src = leading + vol.padStart(4,'0').toUpperCase() + ".mp3";
    if (src!=audio.src){
        audio.src=src;
        audio.load();
        audio.currentTime = starttimeinsecs
        audio.play();
    } else {
        audio.currentTime = starttimeinsecs
        audio.play();
    }
}

function toggleQuote(){
    var elements = document.getElementsByClassName("quote");
    for(var i=0;i<elements.length;i++){
            elements[i].hidden = !elements[i].hidden
    }
}

function audioUpdatetime(event){
    a = event.target;
    //console.log(a.currentTime);
    var src = a.src;
    src = src.substring(leading.length,src.length-4);
    //console.log(src);
    msgSpan.innerText = `${src}:${sectominsec(a.currentTime)}`;
}

