// 这里可以添加 JavaScript 逻辑

let questions = [];
let currentQuestion = null;
let answered = [];
let isTestActive = false; // 标志变量，表示当前是否有测试进行
let timerInterval = null; // 计时器的 interval ID
let elapsedTime = 0; // 记录经过的时间（秒）

function sendStatusUpdate(type, answered = null) {
    const payload = {
        Type: type,
        QuestionID: currentQuestion.id,
        Answered: answered,
    };

    fetch("https://dst.saplonily.top/sts/st", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).catch((error) => {
        console.error("Failed to send status update:", error);
    });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function fetchQuestions() {
    return fetch("questions.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load questions.");
            }
            return response.json();
        })
        .then((data) => {
            questions = data;

            // 根据 query string 中的 id 参数选择试题
            const queryId = parseInt(getQueryParam("id"), 10);
            const selectedQuestion = questions.find((q) => q.id === queryId);

            currentQuestion = selectedQuestion || questions[0]; // 如果未找到对应试题，默认选中第一题
            initialize(); // 初始化页面
        })
        .catch((error) => {
            console.error("Error loading questions:", error);
        });
}

function switchQuestion(index, listItem) {
    document.querySelectorAll(".question-list li").forEach((item) => {
        item.classList.remove("selected");
    });
    listItem.classList.add("selected");
    currentQuestion = questions[index];

    // 更新地址栏的 query string
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("id", currentQuestion.id);
    window.history.pushState({}, "", newUrl);

    updateQuestionUI();
}

function updateQuestionUI() {
    const progress = document.querySelector(".progress");
    const correctAnswers = document.querySelector(".correct-answers");
    const input = document.querySelector(".answer-input");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const startButton = document.querySelector(".start-button");

    // 更新标题、描述和进度
    document.querySelector(".title").textContent = currentQuestion.title;
    document.querySelector(".description").textContent = currentQuestion.description;
    progress.textContent = `默写进度: 0/${currentQuestion.content.length}`;

    // 清空已答对区域
    correctAnswers.innerHTML = "";

    // 重置按钮和输入框状态
    input.classList.add("hidden");
    input.value = ""; // 清空输入框
    giveUpButton.classList.add("hidden");
    retryButton.classList.add("hidden");
    startButton.classList.remove("hidden");

    // 停止计时器并隐藏
    stopTimer();

    // 重置测试状态
    answered = [];
    isTestActive = false;
}

function initialize() {
    const menuButton = document.querySelector(".menu-button");
    const drawer = document.querySelector(".drawer");
    const closeDrawerButton = document.querySelector(".close-drawer");
    const questionLists = document.querySelectorAll(".question-list"); // 包括 PC 和移动端的试题列表
    const startButton = document.querySelector(".start-button");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const input = document.querySelector(".answer-input");
    const answerArea = document.querySelector(".answer-area");

    // 添加计时器元素
    const timerElement = document.createElement("div");
    timerElement.className = "timer";
    timerElement.textContent = "计时: 0:00"; // 初始计时器显示
    answerArea.prepend(timerElement);

    // 菜单按钮功能
    menuButton.addEventListener("click", () => {
        if (drawer.classList.contains("show")) {
            drawer.classList.remove("show");
            drawer.classList.add("hide"); // 添加向左滑出动画类
            setTimeout(() => drawer.classList.add("hidden"), 300); // 动画结束后隐藏
        } else {
            drawer.classList.remove("hidden", "hide"); // 确保移除 hidden 和 hide 类
            drawer.classList.add("show");
        }
    });

    // 关闭抽屉按钮功能
    closeDrawerButton.addEventListener("click", () => {
        drawer.classList.remove("show");
        drawer.classList.add("hide"); // 添加向左滑出动画类
        setTimeout(() => drawer.classList.add("hidden"), 300); // 动画结束后隐藏
    });

    // 动态生成试题项
    questionLists.forEach((list) => {
        list.innerHTML = ""; // 清空列表，避免重复添加
        questions.forEach((q, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = q.title;

            // 根据当前选中的试题设置选中状态
            if (currentQuestion.id === q.id) {
                listItem.classList.add("selected");
            }

            listItem.addEventListener("click", () => {
                if (!isTestActive) {
                    // 未开始测试，直接切换
                    switchQuestion(index, listItem);
                    drawer.classList.remove("show"); // 关闭抽屉
                    drawer.classList.add("hidden");
                } else {
                    showModal("切换默写会自动放弃当前默写，确定要切换吗？", () => {
                        handleSwitchQuestionGiveUp(() => {
                            switchQuestion(index, listItem);
                            drawer.classList.remove("show"); // 关闭抽屉
                            drawer.classList.add("hidden");
                        });
                    });
                }
            });

            list.appendChild(listItem); // 添加试题项到列表
        });
    });

    // 开始按钮功能
    startButton.addEventListener("click", startTest);

    // 放弃按钮功能
    giveUpButton.addEventListener("click", handleGiveUp);

    // 再试一次按钮功能
    retryButton.addEventListener("click", startTest);

    // 输入框实时检测
    input.addEventListener("input", handleInput);

    // 初始化默认试题
    updateQuestionUI();
}

function handleSwitchQuestionGiveUp(callback) {
    const input = document.querySelector(".answer-input");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const progress = document.querySelector(".progress");

    // 隐藏输入框和放弃按钮
    input.classList.remove("show");
    giveUpButton.classList.remove("show");

    setTimeout(() => {
        input.classList.add("hidden");
        giveUpButton.classList.add("hidden");
        retryButton.classList.add("hidden");
        isTestActive = false; // 标记测试为未进行
        callback(); // 执行切换试题的回调
    }, 300); // 等待动画结束后隐藏
}

function startTest() {
    const progress = document.querySelector(".progress");
    const correctAnswers = document.querySelector(".correct-answers");
    const input = document.querySelector(".answer-input");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const startButton = document.querySelector(".start-button");

    // 初始化测试
    answered = [];
    progress.textContent = `默写进度: ${answered.length}/${currentQuestion.content.length}`;
    correctAnswers.innerHTML = "";
    correctAnswers.classList.remove("hidden");

    // 隐藏开始和再试一次按钮，显示输入框和放弃按钮
    startButton.classList.add("hidden");
    retryButton.classList.add("hidden");
    input.classList.remove("hidden");
    giveUpButton.classList.remove("hidden");

    // 启动计时器
    startTimer();

    // 添加动画类
    setTimeout(() => {
        input.classList.add("show");
        giveUpButton.classList.add("show");
    }, 10); // 延迟以触发动画

    isTestActive = true; // 标记测试为进行中

    // 发送开始状态更新
    sendStatusUpdate("Start", null);
}

function handleInput() {
    const input = document.querySelector(".answer-input");
    const progress = document.querySelector(".progress");
    const correctAnswers = document.querySelector(".correct-answers");

    const userInput = input.value.trim().replace(/[^\w\u4e00-\u9fa5]/g, ""); // 忽略标点符号
    const correctIndex = currentQuestion.content.findIndex(
        (word) => word.replace(/[^\w\u4e00-\u9fa5]/g, "") === userInput
    );

    if (correctIndex !== -1 && !answered.includes(currentQuestion.content[correctIndex])) {
        // 答对题目
        answered.push(currentQuestion.content[correctIndex]);
        input.value = ""; // 清空输入框

        // 更新已答对区域
        const correctAnswer = document.createElement("div");
        correctAnswer.className = "correct-answer";
        correctAnswer.textContent = currentQuestion.content[correctIndex];
        correctAnswers.prepend(correctAnswer);

        // 动态添加动画类
        setTimeout(() => {
            correctAnswer.style.opacity = "1"; // 显示已答对词语
        }, 10);

        // 更新进度
        progress.textContent = `默写进度: ${answered.length}/${currentQuestion.content.length}`;

        // 检查是否完成所有词语
        if (answered.length === currentQuestion.content.length) {
            handleSuccess(); // 调用成功处理函数
        }
    }
}

function handleSuccess() {
    const input = document.querySelector(".answer-input");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const progress = document.querySelector(".progress");

    // 停止计时器
    stopTimer();

    // 显示成功消息
    const timerElement = document.querySelector(".timer");
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const elapsedSeconds = elapsedTime % 60;
    const timeUsed = `${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, "0")}`;
    progress.textContent = `恭喜！您已成功完成默写！用时: ${timeUsed}`;

    // 隐藏输入框和放弃按钮，显示再试一次按钮
    input.classList.add("hidden");
    giveUpButton.classList.add("hidden");
    retryButton.classList.remove("hidden");

    isTestActive = false; // 标记测试为未进行

    // 发送完成状态更新
    sendStatusUpdate("Finish", null);
}

function showModal(message, onConfirm, onCancel) {
    const modal = document.querySelector(".modal");
    const modalMessage = modal.querySelector(".modal-message");
    const confirmButton = modal.querySelector(".modal-confirm");
    const cancelButton = modal.querySelector(".modal-cancel");

    modalMessage.textContent = message;
    modal.classList.remove("hidden", "hide"); // 移除 hidden 和隐藏动画类
    modal.classList.add("show"); // 添加显示动画类

    const handleConfirm = () => {
        modal.classList.remove("show");
        modal.classList.add("hide"); // 添加隐藏动画类
        setTimeout(() => {
            modal.classList.add("hidden"); // 动画完成后隐藏
            modal.classList.remove("hide"); // 移除隐藏动画类
        }, 300); // 动画持续时间
        confirmButton.removeEventListener("click", handleConfirm);
        cancelButton.removeEventListener("click", handleCancel);
        if (onConfirm) onConfirm();
    };

    const handleCancel = () => {
        modal.classList.remove("show");
        modal.classList.add("hide"); // 添加隐藏动画类
        setTimeout(() => {
            modal.classList.add("hidden"); // 动画完成后隐藏
            modal.classList.remove("hide"); // 移除隐藏动画类
        }, 300); // 动画持续时间
        confirmButton.removeEventListener("click", handleConfirm);
        cancelButton.removeEventListener("click", handleCancel);
        if (onCancel) onCancel();
    };

    confirmButton.addEventListener("click", handleConfirm);
    cancelButton.addEventListener("click", handleCancel);
}

function handleGiveUp() {
    const input = document.querySelector(".answer-input");
    const giveUpButton = document.querySelector(".give-up-button");
    const retryButton = document.querySelector(".retry-button");
    const correctAnswers = document.querySelector(".correct-answers");
    const progress = document.querySelector(".progress");

    showModal("确定要放弃默写吗？", () => {
        input.classList.remove("show");
        giveUpButton.classList.add("hidden"); // 添加隐藏类，触发过渡效果

        // 显示未答出的词语
        const unansweredWords = currentQuestion.content.filter(
            (word) => !answered.includes(word)
        );
        unansweredWords.forEach((word) => {
            const unanswered = document.createElement("div");
            unanswered.className = "unanswered";
            unanswered.textContent = word;
            correctAnswers.prepend(unanswered);

            // 动态添加动画类
            setTimeout(() => {
                unanswered.style.opacity = "1"; // 显示未答词语
            }, 10);
        });

        input.classList.add("hidden");
        retryButton.classList.remove("hidden"); // 移除隐藏类，触发过渡效果
        isTestActive = false; // 标记测试为未进行

        // 停止计时器但保持显示
        clearInterval(timerInterval);
        timerInterval = null;

        // 发送放弃状态更新
        sendStatusUpdate("GiveUp", answered);
    });
}

function startTimer() {
    const timerElement = document.querySelector(".timer");
    elapsedTime = 0; // 重置时间
    timerElement.textContent = "计时: 0:00"; // 初始化显示
    timerElement.classList.add("show"); // 显示计时器

    timerInterval = setInterval(() => {
        elapsedTime++;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timerElement.textContent = `计时: ${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000); // 每秒更新一次
}

function stopTimer() {
    const timerElement = document.querySelector(".timer");
    clearInterval(timerInterval); // 停止计时器
    timerInterval = null;
    timerElement.classList.remove("show"); // 隐藏计时器
}

fetchQuestions();