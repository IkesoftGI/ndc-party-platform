// src/data/blogPosts.ts
import type { BlogPost } from "../types/Blog";

// 🖼️ Static placeholder (used for all NDC posts for now)
import placeholderImage from "../assets/ChatGPT-NDC.png";

// ✅ Helper for safe media fallback
const withFallback = (media?: string[]) =>
  media && media.length > 0 ? media : ["/No Image Available.png"];

/** --------------------------
 *  NATIONAL DEMOCRATIC CONGRESS BLOG POSTS (2025)
 *  -------------------------- */
export const blogPosts: BlogPost[] = [
  {
    id: "ndc-2025-national-delegates-conference",
    title: "NDC Holds 2025 National Delegates Congress in Kumasi",
    excerpt:
      "A historic gathering of the National Democratic Congress to chart the path for national renewal and progress.",
    content:
      "The National Democratic Congress (NDC) held its 2025 National Delegates Congress in Kumasi. Thousands of party members, leaders, and supporters gathered to reaffirm the principles of unity, accountability, and development as Ghana’s leading social democratic movement...",
    date: "2025-08-01",
    readingTime: "3 min read",
    media: withFallback([placeholderImage]),
    authorId: "ndc-national-team",
    categories: ["National", "Events"],
    scope: "national",
    comments: [],
  },
  {
    id: "ndc-executives-address-2025",
    title: "NDC Executives Address the Nation After 2025 Congress",
    excerpt:
      "The national executives of the NDC delivered messages of unity, inclusiveness, and transformation.",
    content:
      "During the post-congress address, NDC executives outlined key resolutions for the 2028 elections and reaffirmed the party’s dedication to grassroots empowerment and national integrity...",
    date: "2025-08-02",
    readingTime: "2 min read",
    media: withFallback([placeholderImage]),
    authorId: "ndc-communications",
    categories: ["General", "Announcements"],
    scope: "national",
    comments: [],
  },
  {
    id: "ndc-2025-memorable-scenes",
    title: "Scenes from the 2025 NDC Delegates Congress",
    excerpt:
      "Capturing the passion, unity, and vision that defined the NDC’s 2025 Delegates Congress.",
    content:
      "The Congress venue was filled with vibrant energy as delegates sang, danced, and celebrated solidarity under the red, green, white, and black colors of the NDC...",
    date: "2025-08-03",
    readingTime: "1 min read",
    media: withFallback([placeholderImage]),
    authorId: "ndc-national-team",
    categories: ["Events", "Photos"],
    scope: "national",
    comments: [],
  },
  {
    id: "ndc-response-to-media-allegations",
    title: "NDC Pushes Back Against Recent Media Allegations",
    excerpt: "Party leadership issues a strong statement on recent false publications.",
    content:
      "The National Democratic Congress has condemned recent unfounded media allegations, reaffirming its commitment to truth, justice, and fair political discourse...",
    date: "2025-08-04",
    readingTime: "2 min read",
    media: withFallback([placeholderImage]),
    authorId: "ndc-press",
    categories: ["Press", "Defense"],
    scope: "national",
    comments: [],
  },

  // 🟥 Regional - Greater Accra
  {
    id: "greater-accra-2028-target",
    title: "Greater Accra Chairman Declares 'Operation 30 Seats for NDC'",
    excerpt:
      "The Greater Accra Regional Chairman announced a bold mission to win 30 seats in the 2028 general elections.",
    content:
      "Addressing regional delegates, the chairman emphasized teamwork and discipline in pursuit of victory in the 2028 elections. He urged all members to strengthen constituency structures and sustain community engagement across the region.",
    date: "2025-09-01",
    readingTime: "3 min read",
    author: "Greater Accra Regional Communications",
    scope: "regional",
    region: "greater-accra",
    headline: "🎯 Operation 30 Seats for NDC Launched",
    media: withFallback([placeholderImage]),
    comments: [],
  },
  {
    id: "greater-accra-youth-strategy",
    title: "Greater Accra Youth Wing Maps Strategy for 2028 Elections",
    excerpt:
      "Youth leaders across constituencies unite to plan voter mobilization and digital outreach.",
    content:
      "The Greater Accra Youth Wing met to strategize on grassroots mobilization and digital campaigns to engage first-time voters. The session emphasized discipline, volunteer recruitment, and effective communication ahead of the 2028 elections.",
    date: "2025-09-02",
    readingTime: "2 min read",
    author: "Greater Accra Youth Wing",
    scope: "regional",
    region: "greater-accra",
    headline: "👥 Youth Organizers Unite for 2028",
    media: withFallback([placeholderImage]),
    comments: [],
  },
  {
    id: "greater-accra-regional-rally",
    title: "NDC Regional Executives Hold Unity Rally in Accra",
    excerpt:
      "Thousands attend the NDC Unity Rally in Accra to reinforce solidarity ahead of 2028.",
    content:
      "The Greater Accra Regional Executives organized a massive unity rally to energize members and strengthen regional cooperation. The rally emphasized discipline, fairness, and teamwork across the region’s constituencies.",
    date: "2025-09-03",
    readingTime: "2 min read",
    author: "Greater Accra Regional Executives",
    scope: "regional",
    region: "greater-accra",
    headline: "💪 NDC Greater Accra Unity Rally",
    media: withFallback([placeholderImage]),
    comments: [],
  },

  // 🟩 Constituency - Dome-Kwabenya
  {
    id: "dome-kwabenya-health-drive",
    title: "Dome-Kwabenya Constituency Launches Community Health Drive",
    excerpt:
      "The Dome-Kwabenya Constituency has initiated a new public health campaign to support local communities.",
    content:
      "Constituency executives, youth volunteers, and community leaders joined forces to promote healthcare awareness. The event focused on preventive care, environmental cleanliness, and education for healthier living.",
    date: "2025-09-10",
    readingTime: "2 min read",
    author: "Dome-Kwabenya Communications Team",
    scope: "constituency",
    region: "greater-accra",
    constituency: "dome-kwabenya",
    headline: "🩺 Dome-Kwabenya Health Drive Launched",
    media: withFallback([placeholderImage]),
    comments: [],
  },
  {
    id: "dome-kwabenya-executives-press",
    title: "Dome-Kwabenya Executives Hold Press Conference",
    excerpt:
      "Constituency leaders addressed the media on upcoming community initiatives and the road to 2028.",
    content:
      "At the Dome-Kwabenya Secretariat, constituency executives met journalists to outline their plans for youth development, women empowerment, and political education ahead of the next general election.",
    date: "2025-09-12",
    readingTime: "2 min read",
    author: "Dome-Kwabenya Executives",
    scope: "constituency",
    region: "greater-accra",
    constituency: "dome-kwabenya",
    headline: "📢 Executives Outline 2028 Vision",
    media: withFallback([placeholderImage]),
    comments: [],
  },
];
