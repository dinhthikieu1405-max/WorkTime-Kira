let currentDate =
    new Date();


let selectedDateKey =
    getDateKey();


function renderCalendar() {

    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    let start =
        firstDay.getDay();


    if (start === 0) {

        start = 6;

    }

    else {

        start--;

    }


    document.getElementById(
        "currentMonth"
    ).textContent =

        firstDay.toLocaleDateString(
            "vi-VN",
            {
                month: "long",
                year: "numeric"
            }
        );


    const grid =
        document.getElementById(
            "calendarGrid"
        );


    grid.innerHTML = "";


    for (
        let i = 0;
        i < start;
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
                year,
                month,
                day
            );


        const dateKey =
            getDateKey(
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
            getDateKey()
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
                data.records[dateKey]
                &&
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
            () => {

                selectedDateKey =
                    dateKey;


                renderCalendar();

                showSelectedDay();

            }
        );


        grid.appendChild(
            button
        );

    }

}


/* 
   SELECTED DAY
 */

function showSelectedDay() {

    const date =
        new Date(
            selectedDateKey +
            "T00:00:00"
        );


    document.getElementById(
        "selectedDayTitle"
    ).textContent =

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


    const content =
        document.getElementById(
            "selectedDayContent"
        );


    const record =
        data.records[
            selectedDateKey
        ];


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
        (shift, index) => {

            html += `

                <div class="shift-item">

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
                        selectedDateKey
                    )
                )}
            </strong>

        </div>

    `;


    content.innerHTML =
        html;

}


/*
   CHANGE MONTH
*/

document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar();

    }
);


document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar();

    }
);


/* 
   INIT
 */

renderCalendar();

showSelectedDay();