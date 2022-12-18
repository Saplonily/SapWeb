"https://gamebanana.com/mods/download/150789#FileInfo_884281"

const mirrorLinkBase = "https://celeste.weg.fan/api/v2/download/gamebanana-files/";
console.log("hello here, i known you open the console.")

let inputBox = document.getElementById("input-link");
let result_a =  document.getElementById("result-a");
inputBox.oninput = () => {
    var pattern = /#FileInfo_884281\s*$/,
        str = inputBox.value;

    var r = pattern.exec(str);
    if (r != null) {
        let resultId = r[0].substring("#FileInfo_".length);
        let result = mirrorLinkBase + resultId;
        result_a.innerText = result;
        result_a.href = result;
    }
}