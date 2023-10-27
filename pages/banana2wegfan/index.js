const ex1 = "https://gamebanana.com/mods/download/150789#FileInfo_884281";
const ex2 = "https://gamebanana.com/dl/906767";

const mirrorLinkBase = "https://celeste.weg.fan/api/v2/download/gamebanana-files/";
console.log("hello here, i known you open the console.")

let inputBox = document.getElementById("input-link");
let result_a = document.getElementById("result-a");
let result_p = document.getElementById("result-p");
let result_p_logo = document.getElementById("result-p-logo");
inputBox.oninput = () => {
    var pattern = /#FileInfo_[0-9]+\s*$/;
    var pattern2 = /\/dl\/[0-9]+\s*$/;
    str = inputBox.value;

    var r = pattern.exec(str);
    var r2 = pattern2.exec(str);
    if (r != null) {
        let resultId = r[0].substring("#FileInfo_".length);
        let result = mirrorLinkBase + resultId;
        applyEffect(result);
        updateLogo(result);
        return;
    }
    if (r2 != null) {
        let resultId = r2[0].substring("\/dl\/".length);
        let result = mirrorLinkBase + resultId;
        applyEffect(result);
        updateLogo(result);
        return;
    }
    updateLogo(null);
}

function applyEffect(result) {
    result_a.innerText = result;
    result_a.href = result;
}

function updateLogo(result) {
    if (result != null) {
        result_p_logo.style.display = "inline";
        result_p_logo.href = `everest:${result}`;
    }
    else {
        result_p_logo.style.display = "none";
    }
}