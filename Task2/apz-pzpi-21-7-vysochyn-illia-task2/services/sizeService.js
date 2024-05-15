const units = {
    'ft': {
        'in': 12,
        'm': 0.3048,
        'yd': 0.333333,
        'ft':1
    },
    'in': {
        'ft': 0.0833333,
        'm': 0.0254,
        'yd': 0.0277778,
        'in': 1
    },
    'm': {
        'ft': 3.28084,
        'in': 39.3701,
        'yd': 1.09361,
        'm':1
    },
    'yd': {
        'ft': 3,
        'in': 36,
        'm': 0.9144,
        'yd':1
    }
};
function getOtherMeasurement (volumeBefore, unitAfter){
    const conversionFactor = units[volumeBefore.unit][unitAfter];
    const height = volumeBefore.height * conversionFactor;
    const width = volumeBefore.width * conversionFactor;
    const length = volumeBefore.length * conversionFactor;

    return { height, width, length };
}
module.exports = {getOtherMeasurement}