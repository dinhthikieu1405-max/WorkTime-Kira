/* =========================================================
   WORKTIME APP
========================================================= */

const STORAGE_KEY = "worktime_data";


/* =========================================================
   DATA
========================================================= */

let data = {

    jobName: "",

    salaryType: "part-time",

    salary: 0,

    workStart: "08:00",

    workEnd: "17:00",

    reminderMinutes: 15,

    records: {},

    notifications: []

};


let isWorking = false;

let startTime = null;


/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (saved) {

        try {

            const oldData =
                JSON.parse(saved);


            data = {

                ...data,

                ...oldData

            };

        } catch (error) {

            console.log(
                "Không đọc được dữ liệu"
            );

        }

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   DATE
========================================================= */

function formatDateKey(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatMoney(number) {

    return Number(number || 0)
        .toLocaleString("vi-VN") + "đ";

}


function formatHours(hours) {

    return Number(hours || 0)
        .toFixed(2)
        .replace(".00", "") + " giờ";

}


function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


/* =========================================================
   TODAY
========================================================= */

function updateTodayDisplay() {

    const today =
        new Date();


    const text =
        today.toLocaleDateString(
            "vi-VN"
        );


    document.getElementById(
        "today"
    ).textContent = text;


    document.getElementById(
        "attendanceDate"
    ).textContent = text;

}


/* =========================================================
   NAVIGATION
========================================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


navItems.forEach(function(item) {

    item.addEventListener(
        "click",
        function() {

            const pageId =
                item.dataset.page;


            pages.forEach(
                page =>
                    page.classList.add(
                        "hidden"
                    )
            );


            document.getElementById(
                pageId
            ).classList.remove(
                "hidden"
            );


            navItems.forEach(
                nav =>
                    nav.classList.remove(
                        "active"
                    )
            );


            item.classList.add(
                "active"
            );


            if (
                pageId ===
                "calendarPage"
            ) {

                renderCalendar();

                showSelectedDay(
                    selectedDateKey
                );

            }


            if (
                pageId ===
                "statisticsPage"
            ) {

                renderStatistics();

            }


            if (
                pageId ===
                "attendancePage"
            ) {

                renderTodayAttendance();

            }

        }
    );

});


/* =========================================================
   ATTENDANCE
========================================================= */

function updateWorkingUI() {

    const buttons = [

        document.getElementById(
            "attendanceBtn"
        ),

        document.getElementById(
            "attendanceBtn2"
        )

    ];


    const statuses = [

        document.getElementById(
            "workStatus"
        ),

        document.getElementById(
            "attendanceStatus"
        )

    ];


    const times = [

        document.getElementById(
            "workTime"
        ),

        document.getElementById(
            "attendanceTime"
        )

    ];


    if (isWorking) {

        const time =
            startTime.toLocaleTimeString(
                "vi-VN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        statuses.forEach(
            element =>
                element.textContent =
                    "Đang làm việc"
        );


        times.forEach(
            element =>
                element.textContent =
                    "Bắt đầu lúc " + time
        );


        buttons.forEach(
            button => {

                button.textContent =
                    "🔴 KẾT THÚC CA";

                button.style.background =
                    "#ef4444";

            }
        );

    }

    else {

        buttons.forEach(
            button => {

                button.textContent =
                    "🟢 BẮT ĐẦU CA";

                button.style.background =
                    "#22c55e";

            }
        );

    }

}


function toggleAttendance() {

    /* BẮT ĐẦU CA */

    if (!isWorking) {

        isWorking = true;

        startTime =
            new Date();


        updateWorkingUI();

        return;

    }


    /* KẾT THÚC CA */

    const endTime =
        new Date();


    const diff =
        endTime -
        startTime;


    const hours =
        Math.round(
            (
                diff /
                (1000 * 60 * 60)
            ) * 100
        ) / 100;


    const dateKey =
        formatDateKey(
            new Date()
        );


    if (!data.records[dateKey]) {

        data.records[dateKey] = {

            shifts: [],

            totalHours: 0,

            salary: 0

        };

    }


    const record =
        data.records[dateKey];


    record.shifts.push({

        start:
            startTime.toLocaleTimeString(
                "vi-VN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        end:
            endTime.toLocaleTimeString(
                "vi-VN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        hours: hours

    });


    record.totalHours =
        record.shifts.reduce(
            (total, shift) =>
                total +
                Number(
                    shift.hours
                ),
            0
        );


    record.salary =
        calculateDaySalary(
            dateKey
        );


    saveData();


    isWorking = false;

    startTime = null;


    updateWorkingUI();

    updateAll();


    addNotification(

        "🏁 Hoàn thành ca",

        `Bạn vừa hoàn thành ${formatHours(hours)} làm việc.`

    );


    alert(
        "Đã kết thúc ca!\n\n" +
        "Thời gian: " +
        formatHours(hours)
    );

}


document.getElementById(
    "attendanceBtn"
).addEventListener(
    "click",
    toggleAttendance
);


document.getElementById(
    "attendanceBtn2"
).addEventListener(
    "click",
    toggleAttendance
);


/* =========================================================
   DAY SALARY
========================================================= */

function calculateDaySalary(
    dateKey
) {

    const record =
        data.records[dateKey];


    if (!record) {

        return 0;

    }


    if (
        data.salaryType ===
        "part-time"
    ) {

        return Math.round(

            Number(
                record.totalHours || 0
            )

            *

            Number(
                data.salary || 0
            )

        );

    }


    if (
        data.salaryType ===
        "full-time"
    ) {

        return Number(
            data.salary || 0
        );

    }


    return 0;

}


function calculateShiftSalary(
    hours
) {

    if (
        data.salaryType ===
        "part-time"
    ) {

        return Math.round(

            Number(hours)

            *

            Number(
                data.salary || 0
            )

        );

    }


    return 0;

}


/* =========================================================
   TODAY ATTENDANCE
========================================================= */

function renderTodayAttendance() {

    const dateKey =
        formatDateKey(
            new Date()
        );


    const record =
        data.records[dateKey];


    const list =
        document.getElementById(
            "todayShiftList"
        );


    list.innerHTML = "";


    if (
        !record ||
        !record.shifts.length
    ) {

        list.innerHTML =
            `<p class="empty-text">
                Chưa có ca làm việc
            </p>`;

    }

    else {

        record.shifts.forEach(
            function(shift, index) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "shift-item";


                div.innerHTML = `

                    <div class="shift-top">

                        <span class="shift-time">

                            Ca ${index + 1}:
                            ${shift.start}
                            →
                            ${shift.end}

                        </span>

                        <span class="shift-hours">

                            ${formatHours(
                                shift.hours
                            )}

                        </span>

                    </div>


                    <div class="shift-bottom">

                        <span>
                            Thời gian làm
                        </span>

                        <span>

                            ${
                                data.salaryType ===
                                "part-time"

                                ?

                                formatMoney(
                                    calculateShiftSalary(
                                        shift.hours
                                    )
                                )

                                :

                                "Theo ngày công"
                            }

                        </span>

                    </div>

                `;


                list.appendChild(div);

            }
        );

    }


    const totalHours =
        record
        ?
        record.totalHours
        :
        0;


    document.getElementById(
        "attendanceTotalHours"
    ).textContent =
        formatHours(
            totalHours
        );


    document.getElementById(
        "attendanceSalary"
    ).textContent =
        formatMoney(
            calculateDaySalary(
                dateKey
            )
        );


    document.getElementById(
        "totalHours"
    ).textContent =
        formatHours(
            totalHours
        );


    document.getElementById(
        "todaySalary"
    ).textContent =
        formatMoney(
            calculateDaySalary(
                dateKey
            )
        );

}


/* =========================================================
   CALENDAR
========================================================= */

const now =
    new Date();


let calendarYear =
    now.getFullYear();


let calendarMonth =
    now.getMonth();


let selectedDateKey =
    formatDateKey(now);


function renderCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );


    grid.innerHTML = "";


    const firstDay =
        new Date(
            calendarYear,
            calendarMonth,
            1
        );


    const lastDay =
        new Date(
            calendarYear,
            calendarMonth + 1,
            0
        );


    let startDay =
        firstDay.getDay();


    if (startDay === 0) {

        startDay = 6;

    }

    else {

        startDay--;

    }


    const monthName =
        firstDay.toLocaleDateString(
            "vi-VN",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "currentMonth"
    ).textContent =
        capitalize(
            monthName
        );


    document.getElementById(
        "currentMonthStats"
    ).textContent =
        capitalize(
            monthName
        );


    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        grid.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const date =
            new Date(
                calendarYear,
                calendarMonth,
                day
            );


        const dateKey =
            formatDateKey(
                date
            );


        const button =
            document.createElement(
                "button"
            );


        button.className =
            "calendar-day";


        if (
            data.records[dateKey] &&
            data.records[dateKey]
                .shifts.length
        ) {

            button.classList.add(
                "worked"
            );

        }


        if (
            dateKey ===
            formatDateKey(
                new Date()
            )
        ) {

            button.classList.add(
                "today"
            );

        }


        if (
            dateKey ===
            selectedDateKey
        ) {

            button.classList.add(
                "selected"
            );

        }


        button.innerHTML = `

            <span class="day-number">
                ${day}
            </span>

            ${
                data.records[dateKey] &&
                data.records[dateKey]
                    .shifts.length

                ?

                `<span class="day-mark">
                    ●
                </span>`

                :

                ""
            }

        `;


        button.addEventListener(
            "click",
            function() {

                selectedDateKey =
                    dateKey;


                renderCalendar();


                showSelectedDay(
                    dateKey
                );

            }
        );


        grid.appendChild(
            button
        );

    }

}


/* =========================================================
   SELECTED DAY
========================================================= */

function showSelectedDay(
    dateKey
) {

    const title =
        document.getElementById(
            "selectedDayTitle"
        );


    const content =
        document.getElementById(
            "selectedDayContent"
        );


    const date =
        new Date(
            dateKey +
            "T00:00:00"
        );


    title.textContent =
        "📅 " +

        date.toLocaleDateString(
            "vi-VN",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const record =
        data.records[dateKey];


    if (
        !record ||
        !record.shifts.length
    ) {

        content.innerHTML = `

            <p class="empty-text">
                ○ Chưa có dữ liệu chấm công
            </p>

        `;


        return;

    }


    let html = "";


    record.shifts.forEach(
        function(shift, index) {

            html += `

                <div class="shift-item">

                    <div class="shift-top">

                        <span class="shift-time">

                            Ca ${index + 1}:
                            ${shift.start}
                            →
                            ${shift.end}

                        </span>


                        <span class="shift-hours">

                            ${formatHours(
                                shift.hours
                            )}

                        </span>

                    </div>


                    <div class="shift-bottom">

                        <span>
                            Thời gian làm
                        </span>


                        <span>

                            ${
                                data.salaryType ===
                                "part-time"

                                ?

                                formatMoney(
                                    calculateShiftSalary(
                                        shift.hours
                                    )
                                )

                                :

                                "Theo ngày công"
                            }

                        </span>

                    </div>

                </div>

            `;

        }
    );


    html += `

        <div class="info-row">

            <span>
                Tổng giờ
            </span>

            <strong>
                ${formatHours(
                    record.totalHours
                )}
            </strong>

        </div>


        <div class="info-row">

            <span>
                Lương
            </span>

            <strong>
                ${formatMoney(
                    calculateDaySalary(
                        dateKey
                    )
                )}
            </strong>

        </div>

    `;


    content.innerHTML =
        html;

}


/* =========================================================
   MONTH
========================================================= */

function changeMonth(
    amount
) {

    calendarMonth += amount;


    if (
        calendarMonth < 0
    ) {

        calendarMonth = 11;

        calendarYear--;

    }


    if (
        calendarMonth > 11
    ) {

        calendarMonth = 0;

        calendarYear++;

    }


    const firstDate =
        new Date(
            calendarYear,
            calendarMonth,
            1
        );


    selectedDateKey =
        formatDateKey(
            firstDate
        );


    renderCalendar();

    showSelectedDay(
        selectedDateKey
    );

    renderStatistics();

}


document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    () => changeMonth(-1)
);


document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    () => changeMonth(1)
);


document.getElementById(
    "prevMonthStats"
).addEventListener(
    "click",
    () => changeMonth(-1)
);


document.getElementById(
    "nextMonthStats"
).addEventListener(
    "click",
    () => changeMonth(1)
);


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

    let totalDays = 0;

    let totalHours = 0;

    let totalSalary = 0;


    Object.keys(
        data.records
    ).forEach(
        function(dateKey) {

            const date =
                new Date(
                    dateKey +
                    "T00:00:00"
                );


            if (

                date.getFullYear() ===
                calendarYear

                &&

                date.getMonth() ===
                calendarMonth

            ) {

                const record =
                    data.records[
                        dateKey
                    ];


                if (
                    record &&
                    record.shifts.length
                ) {

                    totalDays++;

                    totalHours +=
                        Number(
                            record.totalHours
                        );


                    totalSalary +=
                        calculateDaySalary(
                            dateKey
                        );

                }

            }

        }
    );


    document.getElementById(
        "monthDays"
    ).textContent =
        totalDays +
        " ngày";


    document.getElementById(
        "monthHours"
    ).textContent =
        formatHours(
            totalHours
        );


    document.getElementById(
        "monthSalary"
    ).textContent =
        formatMoney(
            totalSalary
        );


    document.getElementById(
        "monthIncome"
    ).textContent =
        formatMoney(
            totalSalary
        );


    document.getElementById(
        "salaryMonth"
    ).textContent =
        formatMoney(
            totalSalary
        );


    document.getElementById(
        "totalIncomeMonth"
    ).textContent =
        formatMoney(
            totalSalary
        );

}


/* =========================================================
   JOB
========================================================= */

document.getElementById(
    "saveJob"
).addEventListener(
    "click",
    function() {

        const value =
            document.getElementById(
                "jobInput"
            ).value.trim();


        if (!value) {

            alert(
                "Vui lòng nhập tên công việc!"
            );

            return;

        }


        data.jobName =
            value;


        saveData();

        updateJobName();


        alert(
            "Đã lưu công việc!"
        );

    }
);


function updateJobName() {

    document.getElementById(
        "jobName"
    ).textContent =
        data.jobName ||
        "Chưa thiết lập";


    document.getElementById(
        "jobInput"
    ).value =
        data.jobName || "";

}


/* =========================================================
   SALARY
========================================================= */

const partTime =
    document.getElementById(
        "partTime"
    );


const fullTime =
    document.getElementById(
        "fullTime"
    );


const partTimeSalary =
    document.getElementById(
        "partTimeSalary"
    );


const fullTimeSalary =
    document.getElementById(
        "fullTimeSalary"
    );


partTime.addEventListener(
    "change",
    function() {

        if (partTime.checked) {

            partTimeSalary
                .classList
                .remove("hidden");


            fullTimeSalary
                .classList
                .add("hidden");

        }

    }
);


fullTime.addEventListener(
    "change",
    function() {

        if (fullTime.checked) {

            fullTimeSalary
                .classList
                .remove("hidden");


            partTimeSalary
                .classList
                .add("hidden");

        }

    }
);


document.getElementById(
    "saveSalary"
).addEventListener(
    "click",
    function() {

        let salary;


        if (partTime.checked) {

            salary =
                Number(
                    document.getElementById(
                        "hourSalaryInput"
                    ).value
                );


            if (salary <= 0) {

                alert(
                    "Vui lòng nhập lương / giờ!"
                );

                return;

            }


            data.salaryType =
                "part-time";

        }

        else {

            salary =
                Number(
                    document.getElementById(
                        "daySalaryInput"
                    ).value
                );


            if (salary <= 0) {

                alert(
                    "Vui lòng nhập lương / ngày!"
                );

                return;

            }


            data.salaryType =
                "full-time";

        }


        data.salary =
            salary;


        recalculateAllSalaries();


        alert(
            "Đã lưu mức lương!"
        );


        updateAll();

    }
);


/* =========================================================
   RECALCULATE
========================================================= */

function recalculateAllSalaries() {

    Object.keys(
        data.records
    ).forEach(
        function(dateKey) {

            data.records[
                dateKey
            ].salary =
                calculateDaySalary(
                    dateKey
                );

        }
    );


    saveData();

}


/* =========================================================
   LOAD SALARY
========================================================= */

function loadSalarySettings() {

    if (
        data.salaryType ===
        "part-time"
    ) {

        partTime.checked =
            true;


        fullTime.checked =
            false;


        partTimeSalary
            .classList
            .remove("hidden");


        fullTimeSalary
            .classList
            .add("hidden");


        document.getElementById(
            "hourSalaryInput"
        ).value =
            data.salary || "";

    }

    else {

        fullTime.checked =
            true;


        partTime.checked =
            false;


        fullTimeSalary
            .classList
            .remove("hidden");


        partTimeSalary
            .classList
            .add("hidden");


        document.getElementById(
            "daySalaryInput"
        ).value =
            data.salary || "";

    }

}


/* =========================================================
   WORK SCHEDULE
========================================================= */

function loadScheduleSettings() {

    document.getElementById(
        "workStart"
    ).value =
        data.workStart ||
        "08:00";


    document.getElementById(
        "workEnd"
    ).value =
        data.workEnd ||
        "17:00";


    document.getElementById(
        "reminderMinutes"
    ).value =
        data.reminderMinutes ||
        15;

}


document.getElementById(
    "saveSchedule"
).addEventListener(
    "click",
    function() {

        const start =
            document.getElementById(
                "workStart"
            ).value;


        const end =
            document.getElementById(
                "workEnd"
            ).value;


        const reminder =
            Number(
                document.getElementById(
                    "reminderMinutes"
                ).value
            );


        if (!start || !end) {

            alert(
                "Vui lòng nhập giờ làm!"
            );

            return;

        }


        data.workStart =
            start;


        data.workEnd =
            end;


        data.reminderMinutes =
            reminder;


        saveData();


        alert(
            "Đã lưu lịch làm việc!"
        );


        checkWorkSchedule();

    }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

function addNotification(
    title,
    message
) {

    const notification = {

        id:
            Date.now(),

        title:
            title,

        message:
            message,

        time:
            new Date()
                .toLocaleString(
                    "vi-VN"
                ),

        read:
            false

    };


    data.notifications.unshift(
        notification
    );


    /*
       Giữ tối đa 30 thông báo
    */

    data.notifications =
        data.notifications.slice(
            0,
            30
        );


    saveData();

    renderNotifications();

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const count =
        document.getElementById(
            "notificationCount"
        );


    list.innerHTML = "";


    if (
        !data.notifications.length
    ) {

        list.innerHTML =
            `<p class="empty-text">
                Chưa có thông báo
            </p>`;

    }

    else {

        data.notifications.forEach(
            function(item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "notification-item" +

                    (
                        item.read
                        ?
                        ""
                        :
                        " unread"
                    );


                div.innerHTML = `

                    <strong>
                        ${item.title}
                    </strong>

                    <p>
                        ${item.message}
                    </p>

                    <small>
                        ${item.time}
                    </small>

                `;


                div.addEventListener(
                    "click",
                    function() {

                        item.read =
                            true;


                        saveData();

                        renderNotifications();

                    }
                );


                list.appendChild(
                    div
                );

            }
        );

    }


    const unread =
        data.notifications.filter(
            item =>
                !item.read
        ).length;


    if (unread > 0) {

        count.textContent =
            unread;

        count.classList.remove(
            "hidden"
        );

    }

    else {

        count.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   NOTIFICATION BUTTON
========================================================= */

document.getElementById(
    "notificationBtn"
).addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        document.getElementById(
            "notificationPanel"
        ).classList.toggle(
            "hidden"
        );

    }
);


/* =========================================================
   MARK ALL READ
========================================================= */

document.getElementById(
    "markAllRead"
).addEventListener(
    "click",
    function() {

        data.notifications.forEach(
            item => {

                item.read =
                    true;

            }
        );


        saveData();

        renderNotifications();

    }
);


/* =========================================================
   CLICK OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const panel =
            document.getElementById(
                "notificationPanel"
            );


        const button =
            document.getElementById(
                "notificationBtn"
            );


        if (
            !panel.contains(event.target)
            &&
            !button.contains(event.target)
        ) {

            panel.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   WORK SCHEDULE CHECK
========================================================= */

function checkWorkSchedule() {

    const now =
        new Date();


    const currentHour =
        now.getHours();


    const currentMinute =
        now.getMinutes();


    const currentTotal =
        currentHour * 60 +
        currentMinute;


    const parts =
        data.workStart.split(":");


    const startTotal =
        Number(parts[0]) * 60 +
        Number(parts[1]);


    const reminder =
        Number(
            data.reminderMinutes
        );


    const todayKey =
        formatDateKey(
            now
        );


    const todayRecord =
        data.records[
            todayKey
        ];


    /*
       Nếu đã có ca hôm nay
       thì không nhắc "chưa chấm công"
    */

    const hasWorked =
        todayRecord &&
        todayRecord.shifts &&
        todayRecord.shifts.length > 0;


    /*
       Kiểm tra khoảng thời gian nhắc
    */

    const difference =
        startTotal -
        currentTotal;


    if (
        difference === reminder
        &&
        !hasNotificationToday(
            "Sắp đến giờ làm"
        )
    ) {

        addNotification(

            "⏰ Sắp đến giờ làm",

            `Ca làm của bạn bắt đầu lúc ${data.workStart}. Còn ${reminder} phút.`

        );

    }


    /*
       Đúng giờ bắt đầu
    */

    if (
        difference === 0
        &&
        !hasNotificationToday(
            "Đã đến giờ làm"
        )
    ) {

        addNotification(

            "🔔 Đã đến giờ làm",

            `Đã đến giờ bắt đầu ca ${data.workStart}.`

        );

    }


    /*
       Sau giờ bắt đầu mà chưa chấm công
    */

    if (
        currentTotal > startTotal
        &&
        !hasWorked
        &&
        currentTotal <= startTotal + 60
        &&
        !hasNotificationToday(
            "Chưa chấm công"
        )
    ) {

        addNotification(

            "⚠️ Chưa chấm công",

            `Hôm nay bạn chưa bắt đầu ca làm lúc ${data.workStart}.`

        );

    }

}


/* =========================================================
   CHECK DUPLICATE NOTIFICATION
========================================================= */

function hasNotificationToday(
    title
) {

    const today =
        new Date()
            .toLocaleDateString(
                "vi-VN"
            );


    return data.notifications.some(
        function(item) {

            return (

                item.title.includes(
                    title
                )

                &&

                item.time.includes(
                    today
                )

            );

        }
    );

}


/* =========================================================
   REQUEST BROWSER NOTIFICATION
========================================================= */

function requestNotificationPermission() {

    if (
        "Notification" in window
    ) {

        if (
            Notification.permission ===
            "default"
        ) {

            Notification.requestPermission();

        }

    }

}


function showBrowserNotification(
    title,
    message
) {

    if (
        "Notification" in window
        &&
        Notification.permission ===
        "granted"
    ) {

        new Notification(
            title,
            {
                body: message
            }
        );

    }

}


/* =========================================================
   UPDATE ALL
========================================================= */

function updateAll() {

    updateJobName();

    renderTodayAttendance();

    renderCalendar();

    renderStatistics();

    renderNotifications();

    updateWorkingUI();

}


/* =========================================================
   INIT
========================================================= */

loadData();

updateTodayDisplay();

loadSalarySettings();

loadScheduleSettings();

updateAll();

requestNotificationPermission();


/*
   Kiểm tra lịch làm việc
   mỗi 30 giây
*/

checkWorkSchedule();


setInterval(
    function() {

        checkWorkSchedule();

    },
    30000
);