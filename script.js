let balance = 25000;
let completed = 12;
let todayIncome = 6000;

let currentTask = null;
let timerInterval = null;

const modal = document.getElementById("task-modal");
const timerElement = document.getElementById("timer");
const completeButton = document.getElementById("complete-btn");


function formatMoney(number) {
    return number.toLocaleString("vi-VN") + " ₫";
}


function updateStats() {

    document.getElementById("balance").textContent =
        formatMoney(balance);

    document.getElementById("completed").textContent =
        completed;

    document.getElementById("today-income").textContent =
        formatMoney(todayIncome);
}


function startTask(button) {

    currentTask = button.closest(".task-card");

    const reward =
        Number(currentTask.dataset.reward);

    modal.classList.remove("hidden");

    let time = 30;

    timerElement.textContent = time;

    completeButton.disabled = true;
    completeButton.classList.remove("ready");
    completeButton.textContent = "Đang xem quảng cáo...";

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        time--;

        timerElement.textContent = time;

        if (time <= 0) {

            clearInterval(timerInterval);

            completeButton.disabled = false;
            completeButton.classList.add("ready");

            completeButton.textContent =
                `Nhận ${formatMoney(reward)}`;
        }

    }, 1000);


    completeButton.onclick = function () {

        if (completeButton.disabled) return;

        balance += reward;
        todayIncome += reward;
        completed++;

        updateStats();

        currentTask.remove();

        updateTaskCount();

        addHistory(reward);

        closeModal();
    };
}


function closeModal() {

    clearInterval(timerInterval);

    modal.classList.add("hidden");

    currentTask = null;
}


function updateTaskCount() {

    const tasks =
        document.querySelectorAll(".task-card");

    document.getElementById("task-count")
        .textContent = tasks.length;
}


function addHistory(reward) {

    const history =
        document.querySelector(".history");

    const row =
        document.createElement("div");

    row.className = "history-row";

    row.innerHTML = `

        <div class="history-icon">
            ✓
        </div>

        <div class="history-info">

            <strong>
                Hoàn thành nhiệm vụ
            </strong>

            <small>
                Xem quảng cáo
            </small>

        </div>

        <div class="history-money">
            +${formatMoney(reward)}
        </div>

    `;

    history.prepend(row);
}


updateStats();