import sekyeHughes from "../assets/national Council of elders/Mr Sekyi Hughes-Member.jpg";
import ckTedam from "../assets/national Council of elders/Clement Kubindiwor Tedam-Chairman.jpg";
import yiremia from "../assets/national Council of elders/Alhaji Yiremia-Member.jpg";

// Define the shape of each elder object
export interface Elder {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

// Array of elders
export const elders: Elder[] = [
  {
    id: "elder-ck-tedam",
    name: "Clement Kubindiwor Tedam",
    role: "Chairman - Council of Elders (Late)",
    bio: "Hon. C.K. Tedam was a founding member of the NPP and served as the Chairman of the Council of Elders until his passing in April 2019. He was known for his wisdom and devotion to democratic ideals.",
    image: ckTedam,
  },
  {
    id: "elder-sekyi-hughes",
    name: "Ebenezer Sekyi-Hughes",
    role: "Member - Council of Elders",
    bio: "Rt. Hon. Ebenezer Begyina Sekyi-Hughes is a respected Ghanaian lawyer and former Speaker of Parliament (2005–2009). He is a long-serving elder within the NPP.",
    image: sekyeHughes,
  },
  {
    id: "elder-yiremia",
    name: "Alhaji Sulemana Yiremia",
    role: "Member - Council of Elders",
    bio: "Alhaji Yiremia served diligently on the Executive Committee of the Council of Elders, contributing to strategic decision-making within the NPP.",
    image: yiremia,
  },
];
