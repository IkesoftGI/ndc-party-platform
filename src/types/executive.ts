/* src/types/executive.ts */

export interface Executive {
  _id?: string;                // from MongoDB
  id?: string;                 // fallback id for placeholders
  name: string;
  ghanaCard?: string;
  voterId?: string;
  partyCard?: string;
  email?: string;
  region?: string;
  constituency?: string;
  electoralAreaName?: string;
  pollingStationName?: string;

  // ✅ image fields
  img?: string;                // legacy field
  photo?: string;              // uploaded filename

  // ✅ placement info
  bio: string;
  scope?: "National" | "Regional" | "Constituency";
  unit?: string;
  position: string;

  // ✅ term info
  termStart?: string;          // e.g. "2020" or "2024-2028"
  termEnd?: string;            // e.g. "2024"
  termStartDate?: string;      // e.g. "1996-01-21"
  termEndDate?: string;        // e.g. "2000-06-15"
}
