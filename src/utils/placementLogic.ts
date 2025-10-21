// src/utils/placementLogic.ts

interface PlacementInput {
  isOfficial: boolean;
  scope: string;
  unit: string;
  position: string;
  electoralAreaName?: string;
  pollingStationName?: string;
}

interface RoleAssignment {
  scope: string;
  unit: string;
  position: string;
  electoralAreaName?: string;
  pollingStationName?: string;
}

export function determinePlacement(input: PlacementInput): RoleAssignment | null {
  if (!input.isOfficial) return null;

  const role: RoleAssignment = {
    scope: input.scope,
    unit: input.unit,
    position: input.position,
  };

  if (input.unit === "Electoral Area Coordinators") {
    role.electoralAreaName = input.electoralAreaName || "";
  }

  if (input.unit === "Polling Station Executives") {
    role.electoralAreaName = input.electoralAreaName || "";
    role.pollingStationName = input.pollingStationName || "";
  }

  return role;
}
