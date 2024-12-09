export interface MarkerData {
    id: string;
    longitude: number;
    latitude: number;
    user_id: string;
    is_private: boolean;
    media_urls: string[]; // Use an array to store multiple media URLs
  }
  