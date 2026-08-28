/* ==============================
   ELEMENTS
============================== */

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


/* ==============================
   SALARY TYPE
============================== */

partTime.addEventListener(
    "change",
    function() {

        partTimeSalary
            .classList
            .remove("hidden");


        fullTimeSalary
            .classList
            .add("hidden");

    }
);


fullTime.addEventListener(
    "change",
    function() {

        fullTimeSalary
            .classList
            .remove("hidden");


        partTimeSalary
            .classList
            .add("hidden");

    }
);


/* ==============================
   LOAD SETTINGS
============================== */

function loadSettings() {

    document.getElementById(
        "jobInput"
    ).value =
        data.jobName || "";


    document.getElementById(
        "workStart"
    ).value =
        data.workStart;


    document.getElementById(
        "workEnd"
    ).value =
        data.workEnd;


    document.getElementById(
        "reminderMinutes"
    ).value =
        data.reminderMinutes;


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


/* ==============================
   SAVE JOB
============================== */

document.getElementById(
    "saveJob"
).addEventListener(
    "click",
    function() {

        const job =
            document.getElementById(
                "jobInput"
            ).value.trim();


        if (!job) {

            alert(
                "Vui lòng nhập tên công việc!"
            );

            return;

        }


        data.jobName =
            job;


        saveData();


        alert(
            "Đã lưu công việc!"
        );

    }
);


/* ==============================
   SAVE SALARY
============================== */

document.getElementById(
    "saveSalary"
).addEventListener(
    "click",
    function() {

        let salary;


        if (
            partTime.checked
        ) {

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


        recalculateSalaries();


        saveData();


        alert(
            "Đã lưu mức lương!"
        );

    }
);


/* ==============================
   RECALCULATE
*/

function recalculateSalaries() {

    Object.keys(
        data.records
    ).forEach(
        dateKey => {

            data.records[
                dateKey
            ].salary =
                calculateDaySalary(
                    dateKey
                );

        }
    );

}


/* 
   SAVE SCHEDULE
 */

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

    }
);


/* 
   INIT
 */

loadSettings();