export function formatData(date){
    return date.toLocalDateString('en-us',{
        month :'short',
        day: 'numeric',
        year:'numeric'
    })

}