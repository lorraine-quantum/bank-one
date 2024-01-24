function getRandom16DigitNumber() {
    const min = 100000000000000; // Minimum 16-digit number (10^11)
    const max = 999999999999999; // Maximum 16-digit number (10^16 - 1)
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    const stringifiedNumber= number.toString()
    return "5"+stringifiedNumber

}


function formatAsCreditCard(number) {
    const str = number.toString();
    const formatted = str.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
}

// console.log(formatAsCreditCard(getRandom16DigitNumber()))


module.exports = { formatAsCreditCard, getRandom16DigitNumber }