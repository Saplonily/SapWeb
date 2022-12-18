const ex1 = "https://gamebanana.com/mods/download/150789#FileInfo_884281";
const ex2 = "https://gamebanana.com/dl/906767";

const mirrorLinkBase = "https://celeste.weg.fan/api/v2/download/gamebanana-files/";
console.log("hello here, i known you open the console.")

let inputBox = document.getElementById("input-link");
let result_a = document.getElementById("result-a");
inputBox.oninput = () => {
    var pattern = /#FileInfo_[0-9]+\s*$/;
    var pattern2 = /\/dl\/[0-9]+\s*$/;
    str = inputBox.value;

    var r = pattern.exec(str);
    var r2 = pattern2.exec(str);
    if (r != null) {
        let resultId = r[0].substring("#FileInfo_".length);
        let result = mirrorLinkBase + resultId;
        result_a.innerText = result;
        result_a.href = result;
    }
    if (r2 != null) {
        let resultId = r2[0].substring("\/dl\/".length);
        let result = mirrorLinkBase + resultId;
        result_a.innerText = result;
        result_a.href = result;
    }
}