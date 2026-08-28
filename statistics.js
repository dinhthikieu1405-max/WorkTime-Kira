let statisticsDate =
    new Date();


function renderStatistics() {

    const year =
        statisticsDate.getFullYear();


    const month =
        statisticsDate.getMonth();


    document.getElementById(
        "currentMonth"
    ).textContent =

        new Date(
            year,
            month,
            1
        ).toLocaleDateString(
            "vi-VN",
            {
                month: "long",
                year: "numeric"
            }
        );


    let totalDays = 0;

    let totalHours = 0;

    let totalSalary = 0;


    Object.keys(
        data.records
    ).forEach(
        dateKey => {

            const date =
                new Date(
                    dateKey +
                    "T00:00:00"
                );


            if (

                date.getFullYear()
                ===
                year

                &&

                date.getMonth()
                ===
                month

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


/* 
   MONTH BUTTON
 */

document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    () => {

        statisticsDate.setMonth(
            statisticsDate.getMonth() - 1
        );


        renderStatistics();

    }
);


document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    () => {

        statisticsDate.setMonth(
            statisticsDate.getMonth() + 1
        );


        renderStatistics();

    }
);


/* 
   INIT
*/

renderStatistics();