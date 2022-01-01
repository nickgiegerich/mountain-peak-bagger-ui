export interface PeakInterface {
  peak_name?: string | number | readonly string[] | undefined;
  peak_description?: string;
  longitude?: number;
  latitude?: number;
  summitted?: boolean;
  attempt_date?: string;
  summit_date?: string;
}
