
/* Date utils for portal */ 
export const formatDateOfBirth = (dateOfBirth: string | Date): string => {
    const date = new Date(dateOfBirth);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Auckland",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    return new Intl.DateTimeFormat("en-NZ", options).format(date);
};

export const formatSubmissionTime = (submissionTime: string | Date): string => {
    const date = new Date(submissionTime);
    date.setHours(date.getHours() + 13);
    
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Auckland",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    };
    
    return new Intl.DateTimeFormat("en-NZ", options).format(date);
};


/* Date utils for after submission */ 


export const submissionFormatDateOfBirth = (dateOfBirth: string | Date): string => {
    let date: Date;

    if (typeof dateOfBirth === 'string') {
        const [day, month, year] = dateOfBirth.split('/');
        date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
        date = new Date(dateOfBirth);
    }

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Auckland",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-NZ", options).format(date);
    

    return formattedDate;
};


export const submissionformatSubmissionTime = (submissionTime: string | Date): string => {
    const date = new Date(submissionTime);
    
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Auckland",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    };
    
    return new Intl.DateTimeFormat("en-NZ", options).format(date);
};