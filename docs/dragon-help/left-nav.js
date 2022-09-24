window.addEventListener("load", generateLeftNavBar);

function generateLeftNavBar() {
    //获取模板,然后后面会克隆这个模板然后贴入内容
    //然后会将其删除节省空间
    let leftNavDataDiv = document.getElementById("left-nav-data-div");

    let templateCmd = document.getElementById("nav-cmd-template");
    let templateCmdSetTitle = document.getElementById("nav-cmd-sets-title-template");
    templateCmd.id = ""; templateCmd.className = "";
    templateCmdSetTitle.id = ""; templateCmdSetTitle.className = "";

    //获取所有指令集单元框
    let commandSets = document.getElementsByClassName("commandSets");

    //遍历
    for (let i = 0; i < commandSets.length; i++) {
        let commandSetTitle = commandSets[i].children[0];
        let commands = commandSets[i].getElementsByClassName("command-name");
        templateCmdSetTitle.children[0].innerHTML = commandSetTitle.innerHTML;
        let copy = document.importNode(templateCmdSetTitle, true);
        copy.id = "js-cmdSetsTitle-" + i;
        leftNavDataDiv.appendChild(copy);

        for (let j = 0; j < commands.length; j++) {
            let hrefId = "js-cmd-" + j + "-in-" + i;
            let aEle = templateCmd.children[0];
            aEle.innerHTML = commands[j].innerHTML;
            aEle.href = "#" + hrefId;

            let a = document.createElement("a");
            a.className = "href-offset-a-element";
            commands[j].appendChild(a);
            a.id = hrefId;
            let copy = document.importNode(templateCmd, true);
            copy.addEventListener("click", function () {
                let cmdSpan = commands[j];
                cmdSpan.style.animation = "aHrefAnim 0.5s ease 0.3s 2 alternate none";
                cmdSpan.addEventListener("animationend", function () {
                    cmdSpan.style.animation = "none";
                });
            });
            leftNavDataDiv.appendChild(copy);
        }
    }


    templateCmd.remove();
    templateCmdSetTitle.remove();
};