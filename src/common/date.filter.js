import { format } from "date-fns";

export default date => {
  return format(new Date(date), "HH:mm xxx 'UTC', MMMM dd, yyyy");
};
