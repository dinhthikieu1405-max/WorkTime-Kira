let isWorking = false;
let startTime = null;


/* ==============================
   LOAD CA ĐANG LÀM
============================== */

function loadActiveShift() {

    const saved =
        localStorage.getItem("activeShift");


    if (saved) {

        try {

            const activeShift =
                JSON.parse(saved);


            isWorking = true;

            startTime =
                new Date(
                    activeShift.startTime
                );

        }

        catch (error) {

            localStorage.removeItem(
                "activeShift"
            );

        }

    }

}


/* ==============================
   UPDATE DATE
============================== */

function updateAttendanceDate() {

    const today =
        new Date()
            .toLocaleDateString(
                "vi-VN"
            );


    document.getElementById(
        "attendanceDate"
    ).textContent = today;

}


/* ==============================
   BẮT ĐẦU / KẾT THÚC CA
============================== */

function toggleAttendance() {


    /* ==========================
       BẮT ĐẦU CA
    ========================== */

    if (!isWorking) {

        isWorking = true;

        startTime = new Date();


        /*
           Lưu ca đang làm
           để thoát app vẫn còn
        */

        localStorage.setItem(

            "activeShift",

            JSON.stringify({

                startTime:
                    startTime.toISOString()

            })

        );


        updateAttendanceUI();

        return;

    }


    /* ==========================
       KẾT THÚC CA
    ========================== */

    const endTime =
        new Date();


    const milliseconds =
        endTime -
        startTime;


    const hours =
        Math.round(

            milliseconds /
            (1000 * 60 * 60)
            * 100

        ) / 100;


    const dateKey =
        getDateKey();


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


    /*
       XÓA CA ĐANG LÀM
    */

    localStorage.removeItem(
        "activeShift"
    );


    isWorking = false;

    startTime = null;


    updateAttendanceUI();

    renderToday();


    alert(

        "Đã kết thúc ca!\n\n" +

        "Thời gian: " +

        formatHours(hours)

    );

}


/* ==============================
   HIỂN THỊ TRẠNG THÁI
============================== */

function updateAttendanceUI() {

    const button =
        document.getElementById(
            "attendanceBtn"
        );


    const status =
        document.getElementById(
            "attendanceStatus"
        );


    const time =
        document.getElementById(
            "attendanceTime"
        );


    const dot =
        document.getElementById(
            "statusDot"
        );


    if (isWorking) {

        const start =
            startTime.toLocaleTimeString(
                "vi-VN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        status.textContent =
            "Đang làm việc";


        time.textContent =
            "Bắt đầu lúc " + start;


        button.textContent =
            "🔴 KẾT THÚC CA";


        button.style.background =
            "#ef4444";


        dot.style.background =
            "#22c55e";

    }

    else {

        status.textContent =
            "Chưa bắt đầu";


        time.textContent =
            "Chưa có ca làm việc";


        button.textContent =
            "🟢 BẮT ĐẦU CA";


        button.style.background =
            "#22c55e";


        dot.style.background =
            "#aaa";

    }

}


/* ==============================
   HIỂN THỊ CÁC CA HÔM NAY
============================== */

function renderToday() {

    const dateKey =
        getDateKey();


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

        list.innerHTML = `

            <p class="empty-text">
                Chưa có ca làm việc
            </p>

        `;

    }

    else {

        record.shifts.forEach(

            (shift, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "shift-item";


                item.innerHTML = `

                    <div class="shift-top">

                        <span class="shift-time">

                            Ca ${index + 1}
                            :
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
                            Thu nhập
                        </span>


                        <span>

                            ${
                                data.salaryType ===
                                "part-time"

                                ?

                                formatMoney(

                                    shift.hours *
                                    data.salary

                                )

                                :

                                "Theo ngày"

                            }

                        </span>

                    </div>

                `;


                list.appendChild(
                    item
                );

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


/* ==============================
   KHỞI ĐỘNG
============================== */

loadActiveShift();

updateAttendanceDate();

renderToday();

updateAttendanceUI();


document.getElementById(
    "attendanceBtn"
).addEventListener(
    "click",
    toggleAttendance
);