let rainbow = new Rainbow();
let best = 0;
rainbow.setSpectrum("#933DE9", "#E93DD8", "#FD0054");
rainbow.setNumberRange(0, 25000);
window.addEventListener('wheel', mouseWheelEvent);
let lastSecond = [];

function mouseWheelEvent(e) {
    lastSecond.push({
        delta: Math.floor(Math.abs(e.deltaY)),
        timestamp: new Date().getTime()
    });
}
setInterval(function() {
    let pixelsPerSecond = displayLastSecond();
    if (pixelsPerSecond > best) {
        best = pixelsPerSecond;
    }
    $(".pixels").text(numberWithCommas(pixelsPerSecond) + " пикселей в секунду");
    console.log(makeGradient(pixelsPerSecond));
    $("body").css("background", "#" + rainbow.colourAt(pixelsPerSecond));
    $(".pixels").css("font-size", fontSize(pixelsPerSecond) + "px");
    if (pixelsPerSecond > 0) {
        $(".headline").css("display", "none");
        $(".container").css("display", "block");
    } else {
        let headline = "Скролль так быстро, на сколько сможешь";
        if (best > 0) {
            headline += "<div class='best'>Твой лучший результат " + numberWithCommas(best) + " пикселей в секунду</div>";
            $(".headline").css("height", "100px");
        }
        $(".headline").html(headline);
        $(".headline").css("display", "block");
        $(".container").css("display", "none");
    }
}, 50);

function displayLastSecond() {
    let now = new Date().getTime();
    let total = 0;
    let timestamps = 0;
    for (let x = 0; x < lastSecond.length; x++) {
        if (now - lastSecond[x].timestamp <= 1000) {
            total += lastSecond[x].delta;
            timestamps++;
        } else {
            lastSecond.splice(x, 1);
            x--;
        }
    }
    if (timestamps == 0) {
        return 0;
    }
    return Math.round(total);
}

function fontSize(pps) {
    return 32 + 20 * pps / 25000;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makeGradient(pps) {
    let color1 = rainbow.colourAt(pps);
    let color2 = rainbow.colourAt(pps + 5000);
    return "radial-gradient(40% 40% at center, #" + color2 + ", #" + color1 + ")";
}