function getRandom12DigitNumber() {
    const min = 100000000000; // Minimum 12-digit number (10^11)
    const max = 999999999999; // Maximum 12-digit number (10^12 - 1)
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number.toString()

}

function formatAsCreditCard(number) {
    const str = number.toString();
    const formatted = str.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
}



module.exports = { formatAsCreditCard, getRandom12DigitNumber }