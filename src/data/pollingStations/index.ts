// ===============================
// MASTER EXPORT FOR ALL REGIONS
// ===============================

import type { AllPollingStations } from "../../types/pollingStations"; 

// Import all once
import { G_ACCRA_POLLING_STATIONS } from "./G-Accra_PollingStations";
import { Eastern_PollingStations } from "./Eastern_PollingStations";
import { Western_PollingStations } from "./Western_PollingStations";
import { Central_PollingStations } from "./Central_PollingStations";
import { Volta_PollingStations } from "./Volta_PollingStations";
import { Ashanti_PollingStations } from "./Ashanti_PollingStations";
import { WesternNorth_PollingStations } from "./Western-North_PollingStations";
import { Ahafo_PollingStations } from "./Ahafo_PollingStations";
import { Bono_PollingStations } from "./Bono_PollingStations";
import { BonoEast_PollingStations } from "./BonoEast_PollingStations";
import { Oti_PollingStations } from "./Oti_PollingStations";
import { Northern_PollingStations } from "./Northern_PollingStations";
import { Savannah_PollingStations } from "./Savannah_PollingStations";
import { UpperWest_PollingStations } from "./Upper-West_PollingStations";
import { NorthEast_PollingStations } from "./North-East_PollingStations";
import { UpperEast_PollingStations } from "./Upper-East_PollingStations";

// ===============================
// RE-EXPORT INDIVIDUAL REGIONS
// ===============================
export {
  G_ACCRA_POLLING_STATIONS,
  Eastern_PollingStations,
  Western_PollingStations,
  Central_PollingStations,
  Volta_PollingStations,
  Ashanti_PollingStations,
  WesternNorth_PollingStations,
  Ahafo_PollingStations,
  Bono_PollingStations,
  BonoEast_PollingStations,
  Oti_PollingStations,
  Northern_PollingStations,
  Savannah_PollingStations,
  UpperWest_PollingStations,
  NorthEast_PollingStations,
  UpperEast_PollingStations,
};

// ===============================
// MERGED NATIONAL EXPORT
// ===============================
export const ALL_POLLING_STATIONS: AllPollingStations = {
  GREATER_ACCRA: G_ACCRA_POLLING_STATIONS,
  EASTERN: Eastern_PollingStations,
  WESTERN: Western_PollingStations,
  CENTRAL: Central_PollingStations,
  VOLTA: Volta_PollingStations,
  ASHANTI: Ashanti_PollingStations,
  WESTERN_NORTH: WesternNorth_PollingStations,
  AHAFO: Ahafo_PollingStations,
  BONO: Bono_PollingStations,
  BONO_EAST: BonoEast_PollingStations,
  OTI: Oti_PollingStations,
  NORTHERN: Northern_PollingStations,
  SAVANNAH: Savannah_PollingStations,
  UPPER_WEST: UpperWest_PollingStations,
  NORTH_EAST: NorthEast_PollingStations,
  UPPER_EAST: UpperEast_PollingStations,
};
