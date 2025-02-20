
export interface City {
  name: string;
  country: string;
  timezone: string;
  lat?: number;
  lon?: number;
}
export interface Weather {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  }

export interface MailProps {
    email:string,
    subject:string,
    message:string
}