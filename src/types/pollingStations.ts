// src/types/pollingStations.ts

// One polling station entry
export interface PollingStation {
  code: string;       // e.g. "A010101"
  name: string;       // e.g. "RC Primary School Dome"
  constituency: string;
  district: string;
  region: string;
}

// Map of constituencies -> array of polling stations
export type RegionPollingStations = Record<string, PollingStation[]>;

// Map of all regions -> their RegionPollingStations
export interface AllPollingStations {
  GREATER_ACCRA: RegionPollingStations;
  EASTERN: RegionPollingStations;
  WESTERN: RegionPollingStations;
  CENTRAL: RegionPollingStations;
  VOLTA: RegionPollingStations;
  ASHANTI: RegionPollingStations;
  WESTERN_NORTH: RegionPollingStations;
  AHAFO: RegionPollingStations;
  BONO: RegionPollingStations;
  BONO_EAST: RegionPollingStations;
  OTI: RegionPollingStations;
  NORTHERN: RegionPollingStations;
  SAVANNAH: RegionPollingStations;
  UPPER_WEST: RegionPollingStations;
  NORTH_EAST: RegionPollingStations;
  UPPER_EAST: RegionPollingStations;
}
