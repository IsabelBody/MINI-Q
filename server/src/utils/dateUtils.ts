
export const convertDateToPostgresFormat = (DOB: string): string => {
    const [day, month, year] = DOB.split('/').map(Number);

    const dateObj = new Date(year, month - 1, day);

    const formattedYear = dateObj.getFullYear();
    const formattedMonth = ('0' + (dateObj.getMonth() + 1)).slice(-2); 
    const formattedDay = ('0' + dateObj.getDate()).slice(-2);

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};


export const queryDateToPostgresFormat = (DOB: string): string => {
    const dateObj = new Date(DOB);

    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); 
    const day = ('0' + dateObj.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
};


export const convertTimestampToPostgresFormat = (timestampStr: string): string => {
    const [datePart, timePart] = timestampStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const formattedTime = timePart ? timePart : '00:00:00'; 

    const formattedTimestamp = `${formattedDate} ${formattedTime}`;
    return formattedTimestamp;
};


