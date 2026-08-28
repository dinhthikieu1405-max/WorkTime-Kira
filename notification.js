/* 
   ADD NOTIFICATION
 */

function addNotification(
    title,
    message
) {

    data.notifications.unshift({

        id: Date.now(),

        title: title,

        message: message,

        time:
            new Date()
                .toLocaleString(
                    "vi-VN"
                ),

        read: false

    });


    data.notifications =
        data.notifications.slice(
            0,
            30
        );


    saveData();

    renderNotifications();

}


/* 
   RENDER
 */

function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const count =
        document.getElementById(
            "notificationCount"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    if (
        !data.notifications.length
    ) {

        list.innerHTML =
            `
            <p class="empty-text">
                Chưa có thông báo
            </p>
            `;

    }

    else {

        data.notifications.forEach(
            notification => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-item";


                if (
                    !notification.read
                ) {

                    item.classList.add(
                        "unread"
                    );

                }


                item.innerHTML = `

                    <strong>
                        ${notification.title}
                    </strong>

                    <p>
                        ${notification.message}
                    </p>

                    <small>
                        ${notification.time}
                    </small>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        notification.read =
                            true;


                        saveData();

                        renderNotifications();

                    }
                );


                list.appendChild(
                    item
                );

            }
        );

    }


    const unread =
        data.notifications.filter(
            notification =>
                !notification.read
        ).length;


    if (count) {

        count.textContent =
            unread;


        if (unread > 0) {

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

}


/* 
   BUTTON
 */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
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

}


/* 
   MARK READ
 */

const markAllRead =
    document.getElementById(
        "markAllRead"
    );


if (markAllRead) {

    markAllRead.addEventListener(
        "click",
        function() {

            data.notifications.forEach(
                notification => {

                    notification.read =
                        true;

                }
            );


            saveData();

            renderNotifications();

        }
    );

}


/* 
   WORK TIME CHECK
 */

function checkWorkSchedule() {

    const now =
        new Date();


    const current =
        now.getHours() * 60 +
        now.getMinutes();


    const [hour, minute] =
        data.workStart
            .split(":")
            .map(Number);


    const start =
        hour * 60 +
        minute;


    const difference =
        start -
        current;


    /*
       SẮP ĐẾN GIỜ
    */

    if (
        difference ===
        Number(
            data.reminderMinutes
        )
    ) {

        addNotification(

            "⏰ Sắp đến giờ làm",

            `Ca làm bắt đầu lúc ${data.workStart}. Còn ${data.reminderMinutes} phút.`

        );

    }


    /*
       ĐÃ ĐẾN GIỜ
    */

    if (
        difference === 0
    ) {

        addNotification(

            "🔔 Đã đến giờ làm",

            `Đã đến giờ bắt đầu ca ${data.workStart}.`

        );

    }


    /*
       CHƯA CHẤM CÔNG
    */

    if (
        difference < 0
        &&
        difference >= -60
    ) {

        const record =
            data.records[
                getDateKey()
            ];


        const hasWorked =
            record &&
            record.shifts &&
            record.shifts.length;


        if (!hasWorked) {

            addNotification(

                "⚠️ Chưa chấm công",

                `Bạn chưa bắt đầu ca lúc ${data.workStart}.`

            );

        }

    }

}


/* 
   INIT
*/

renderNotifications();


checkWorkSchedule();


setInterval(
    checkWorkSchedule,
    30000
);