/**
 * Type definitions for MassSafe application
 */

export interface City {
  id: string;
  name: string;
  county: string;
  population: number;
  latitude: number;
  longitude: number;
  state: string;
}

export interface CrimeData {
  violentCrime: number;
  propertyCrime: number;
  year: number;
}

export interface SavedLocation {
  id: string;
  userId: string;
  cityId: string;
  safetyScore: number | null;
  createdAt: Date;
  city: City;
}

export interface CityWithCrime extends City {
  crimeData: CrimeData;
  safetyScore: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
}
