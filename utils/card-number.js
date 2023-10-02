function getRandom16DigitNumber() {
    const min = 1000000000000000; // Minimum 16-digit number (10^11)
    const max = 9999999999999999; // Maximum 16-digit number (10^16 - 1)
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number.toString()

}

function formatAsCreditCard(number) {
    const str = number.toString();
    const formatted = str.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
}



module.exports = { formatAsCreditCard, getRandom16DigitNumber }