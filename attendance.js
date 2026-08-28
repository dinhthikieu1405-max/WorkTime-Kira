let isWorking = false;

let startTime = null;


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
   START / END SHIFT
============================== */

function toggleAttendance() {

    /* BẮT ĐẦU */

    if (!isWorking) {

        isWorking = true;

        startTime = new Date();


        updateAttendanceUI();

        return;

    }


    /* KẾT THÚC */

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
   UI
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
   RENDER TODAY
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

        list.innerHTML =
            `
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
   INIT
============================== */

if (
    document.getElementById(
        "attendanceBtn"
    )
) {

    updateAttendanceDate();

    renderToday();

    updateAttendanceUI();


    document.getElementById(
        "attendanceBtn"
    ).addEventListener(
        "click",
        toggleAttendance
    );

}