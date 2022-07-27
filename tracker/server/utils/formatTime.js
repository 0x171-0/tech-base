"use strict";
// @ts-ignore
Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (1 +
        Math.round(((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7));
    // 86400000 ms = 24 hour
};
class Time {
    constructor() {
        this.forMatDay = (howLongBefore, endDate) => {
            const days = [];
            for (let i = howLongBefore; i >= 0; i--) {
                const time = new Date(endDate.getTime() - i * 1 * 24 * 60 * 60 * 1000);
                const day = time.toISOString().slice(0, 10);
                days.push([day]);
            }
            return days;
        };
        this.forMatWeek = (howLongBefore, endDate) => {
            const weeks = [];
            for (let i = howLongBefore; i >= 0; i--) {
                const time = new Date(endDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
                const year = time.getUTCFullYear();
                // @ts-ignore
                const week = time.getWeek();
                weeks.push([`${year} w${week}`]);
            }
            return weeks;
        };
        this.forMatMonth = (howLongBefore, endDate) => {
            const months = [];
            for (let i = howLongBefore; i >= 0; i--) {
                const time = new Date(endDate.getTime() - i * 30 * 24 * 60 * 60 * 1000);
                const year = time.getUTCFullYear();
                const month = time.getUTCMonth() + 1;
                months.push([`${year}/${month}`]);
            }
            return months;
        };
    }
}
module.exports = new Time();
