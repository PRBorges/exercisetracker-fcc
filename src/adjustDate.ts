// adjustDate.ts

// Returns a new date = date in local time
const adjustDate = (date: Date): Date =>
  new Date(date.getTime() + date.getTimezoneOffset() * msInOneMinute);

const msInOneMinute = 60000;

export default adjustDate;
