const STORAGE_KEY = "worktime_data";


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


/* LOAD*/

function loadData() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (saved) {

        try {

            data = {
                ...data,
                ...JSON.parse(saved)
            };

        }

        catch (error) {

            console.log(
                "Không thể đọc dữ liệu"
            );

        }

    }

}


/*SAVE */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* DATE */

function getDateKey(date = new Date()) {

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


/* MONEY */

function formatMoney(number) {

    return Number(number || 0)
        .toLocaleString("vi-VN")
        + "đ";

}


/* HOURS*/

function formatHours(number) {

    return Number(number || 0)
        .toFixed(2)
        .replace(".00", "")
        + " giờ";

}


/* CALCULATE SALARY */

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


/*GET TODAY */

function getTodayRecord() {

    return data.records[
        getDateKey()
    ];

}


/*INITIALIZE*/

loadData();