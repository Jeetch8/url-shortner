export interface ITempObject {
  referrer: {
    [key: string]: number;
  };
  platform: {
    [key: string]: number;
  };
  location: {
    [key: string]: number;
  };
  clicks_ip: {
    [key: string]: number;
  };
  topDays: {
    [key: string]: number;
  };
  topHours: {
    [key: string]: number;
  };
}

export interface IChartsData {
  label: string[];
  data: number[];
}

export interface IStats {
  totalClicks: number;
  clicksType: {
    label: ["Unique", "Non-Unique"];
    data: [number, number];
  };
  topDays: IChartsData;
  topHours: IChartsData;
  clicksByDays: IChartsData;
  clicksByMonths: IChartsData;
  clicksByHours: IChartsData;
  devices: {
    label: ["Mobile", "Tablet", "Desktop", "others"];
    data: number[];
  };
  referrer: IChartsData;
  platform: IChartsData;
  browser: {
    label: ["Chrome", "Firefox", "Mozilla", "Others"];
    data: number[];
  };
  location: { country: string; value: number }[];
}
