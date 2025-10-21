// src/types/User.ts

export interface Role {
  scope: string;
  unit: string;
  position: string;
  region?: string;             
  constituency?: string;

  // ✅ Optional fields inside role
  electoralAreaName?: string;
  pollingStationName?: string;

  // ✅ Term info
  termStart?: string;
  termEnd?: string;
  termStartDate?: string;
  termEndDate?: string;

  // ✅ Slug keys
  regionKey?: string;
  constituencyKey?: string;
  electoralAreaKey?: string;
  positionKey?: string;

  isActive?: boolean;
}

export interface User {
  _id: string;
  name: string;
  photo?: string;
  ghanaCard?: string;
  voterId?: string;
  partyCard?: string;
  region: string;
  constituency: string;
  isOfficial?: boolean;
  role?: Role;
  bio?: string;

}
