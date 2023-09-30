import colors from 'colors'

export default (data) => {
    var currentdate = new Date();
    let logstring = ` ${`${`${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`.brightBlue.bold} ${`│`.brightMagenta.bold}`}`;
    if (typeof data == "string") {
        console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
    } else if (typeof data == "object") {
        console.log(logstring, JSON.stringify(data, null, 3).green)
    } else if (typeof data == "boolean") {
        console.log(logstring, String(data).cyan)
    } else {
        console.log(logstring, data)
    }
}