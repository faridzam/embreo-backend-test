export const extractAuthHeader = (authHeader: string | undefined) => {
  const token = authHeader && authHeader.split(' ')[1];
  return token || ""
}

export function formatDateToString(date: Date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}