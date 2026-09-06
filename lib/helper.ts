export type Salutation =
  | "Good Morning"
  | "Good Afternoon"
  | "Good Evening"
  | "Good Night";

export function getSalutation(date = new Date()): Salutation {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
}
