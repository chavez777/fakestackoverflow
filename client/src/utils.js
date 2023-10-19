// date MM DD, YYYY format date string by Date Object
export function getDateString (date) {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
  return `${formatter.format(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

// get hh:mm time string by Date Object
export function getTimeString (date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}
