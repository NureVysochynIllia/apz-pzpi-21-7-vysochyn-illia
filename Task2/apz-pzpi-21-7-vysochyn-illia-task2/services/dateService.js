function calculateHourDifference(fromDate, toDate) {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const differenceInMs = toDateObj - fromDateObj;
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return Math.ceil(differenceInHours);
}
module.exports = calculateHourDifference;