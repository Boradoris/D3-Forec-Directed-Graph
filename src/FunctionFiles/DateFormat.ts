//기본 날짜 Format ==> YYYY-MM-DD
export function getFormatDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth())).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);

    return  year + '-' + month  + '-' + day;
}

//API 날짜 Format ==> YYYYMMDD
export function changeDateForApi(date: String) {return date.replace(/-/gi, "");} 