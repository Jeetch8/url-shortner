const dayjs = require("dayjs");

const getLast24HrObj = (date) => {
  const currentTime = dayjs(date);
  let arr = new Array(24);
  const obj = {};
  let hoursToSubtract = 0;
  for (let i = 23; i >= 0; i--) {
    const temp = currentTime.subtract(hoursToSubtract, "hours");
    arr[i] = temp.format("hh A");
    obj[temp.format("DD/MM/YYYY hh:00 A")] = i;
    hoursToSubtract++;
  }
  return { obj, arr };
};

const getLast12MonthsObj = (date) => {
  const currentDate = dayjs(date);
  const format = "MMMM YYYY";
  const obj = {};
  const arr = new Array(12);
  let monthsToSubtract = 0;
  for (let i = 11; i >= 0; i--) {
    const temp = currentDate
      .subtract(monthsToSubtract, "months")
      .format(format);
    arr[i] = temp;
    obj[temp] = i;
    monthsToSubtract++;
  }
  return { obj, arr };
};

const getLast30DaysObj = (date) => {
  const currentDate = dayjs(date);
  const format = "DD/MM";
  const obj = {};
  const arr = new Array(30);
  let daysToSubtract = 0;
  for (let i = 29; i >= 0; i--) {
    const temp = currentDate.subtract(daysToSubtract, "days");
    arr[i] = temp.format(format);
    obj[temp.format("DD/MM/YYYY")] = i;
    daysToSubtract++;
  }
  return { obj, arr };
};

module.exports = { getLast24HrObj, getLast12MonthsObj, getLast30DaysObj };
