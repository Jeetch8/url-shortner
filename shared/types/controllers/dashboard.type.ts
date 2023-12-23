export interface ILogs {
  browser: string;
  platform: string;
  referrer: string;
  location: { country: string; city: string };
  date: { elDate: string; elTime: string };
}
