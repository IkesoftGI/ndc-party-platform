// src/data/pollingStationExecutives.ts
import type { User} from '../types/User';

// Example structure: mapping polling station codes to arrays of executives
export const pollingStationExecutives: Record<string, User[]> = {
  "C060901": [
    {
      _id: "exec-1",
      name: "Kwame Mensah",
      photo: "/No Image Available.png",
      region: "Greater Accra", 
      constituency: "Dome-Kwabenya",
      role: {
        scope: "Constituency",
        unit: "Polling Station Executives",
        position: "Chairman",
        isActive: true
      }
    },
    {
      _id: "exec-2",
      name: "Ama Owusu",
      photo: "/No Image Available.png",
      region: "Greater Accra",          
      constituency: "Dome-Kwabenya",
      role: {
        scope: "Constituency",
        unit: "Polling Station Executives",
        position: "Secretary",
        isActive: true
      }
    }
  ],
  "C060902": [
    {
      _id: "exec-3",
      name: "Kojo Adjei",
      photo: "/No Image Available.png",
      region: "Greater Accra",          
      constituency: "Dome-Kwabenya",
      role: {
        scope: "Constituency",
        unit: "Polling Station Executives",
        position: "Chairman",
        isActive: true
      }
    }
  ]
};
