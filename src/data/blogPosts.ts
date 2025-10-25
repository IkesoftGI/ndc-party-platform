// src/data/blogPosts.ts
import type { BlogPost } from "../types/Blog";

// 🖼️ Static assets (resolved by Vite)
import blockedPushbackImage from "../assets/blocked-pushback.jpg";
import DelegatesScenes from "../assets/2025-Delegates.jpg";
import DelegatesExec from "../assets/2025-npp-delegates-conference-executives.jpg";
import DelegatesMain from "../assets/2025-npp-delegates-conference.jpg";


// ✅ Helper to wrap media with fallback
const withFallback = (media?: string[]) =>
  media && media.length > 0 ? media : ["/No Image Available.png"];

export const blogPosts: BlogPost[] = [
  {
    id: "ndc-delegates-2025-overview",
    title: "NDC Holds 2025 National Delegates Conference in Kumasi",
    excerpt:
      "A historic gathering of party leaders and delegates to shape the party's future.",
    content:
      "The National Democratic Congress held its highly anticipated 2025 National Delegates Conference in Kumasi...",
    date: "2025-08-01",
    readingTime: "3 min read",
    media: withFallback([DelegatesMain]),
    authorId: "ndc-national-team",
    categories: ["Party Activities"],
    scope: "national",
    comments: [],
  },
  {
    id: "ndc-delegates-2025-executives",
    title: "Executives Address the Nation at 2025 Delegates Conference",
    excerpt:
      "National executives of the NPP delivered inspiring messages of unity, progress, and hope.",
    content:
      "At the 2025 Delegates Conference, national executives including the party chairman...",
    date: "2025-08-02",
    readingTime: "2 min read",
    media: withFallback([DelegatesExec]),
    authorId: "ndc-national-team",
    categories: ["General", "Announcements"],
    scope: "national",
    comments: [],
  },
  {
    id: "ndc-delegates-2025-memories",
    title: "Scenes from the 2025 NPP Delegates Conference",
    excerpt:
      "Relive powerful moments from Kumasi as the party came together in grand style.",
    content:
      "The vibrant atmosphere at the Baba Yara Sports Stadium captured the spirit of unity...",
    date: "2025-08-03",
    readingTime: "1 min read",
    media: withFallback([DelegatesScenes]),
    authorId: "ndc-national-team",
    categories: ["Events", "Photos"],
    scope: "national",
    comments: [],
  },
  {
    id: "blocked-pushback-story",
    title: "Party Pushback Against Allegations",
    excerpt: "Party leadership responds to recent media claims.",
    content:
      "The NDC leadership has issued a firm response to allegations circulated...",
    date: "2025-08-04",
    readingTime: "2 min read",
    media: withFallback([blockedPushbackImage]),
    authorId: "ndc-national-team",
    categories: ["Press", "Defense"],
    scope: "national",
    comments: [],
  },
  {
    id: "001",
    title: "NDC Unveils National Policy",
    excerpt: "Details about the newly launched national policy...",
    content: "Details about the newly launched national policy...",
    date: "2025-08-01",
    readingTime: "2 min read",
    author: "National Communications Team",
    scope: "national",
    headline: "📢 NPP Unveils National Policy Direction",
    media: withFallback([]), // ✅ still fallback
    comments: [],
  },
  {
    id: "002",
    title: "Greater Accra Hosts Regional Rally",
    excerpt: "Thousands gathered in Accra for the regional rally...",
    content: "Thousands gathered in Accra for the regional rally...",
    date: "2025-08-01",
    readingTime: "1 min read",
    author: "Greater Accra PR Unit",
    scope: "regional",
    region: "greater-accra",
    headline: "🎤 Greater Accra Hosts Massive NDC Rally",
    media: withFallback([]), // ✅ now real image
    comments: [],
  },
  {
    id: "003",
    title: "Dome-Kwabenya Launches Health Drive",
    excerpt: "The Dome-Kwabenya constituency begins a local health initiative...",
    content: "The Dome-Kwabenya constituency begins a local health initiative...",
    date: "2025-08-01",
    readingTime: "1 min read",
    author: "Constituency Organizer",
    scope: "constituency",
    region: "greater-accra",
    constituency: "dome-kwabenya",
    headline: "🩺 Dome-Kwabenya Launches Health Drive",
    media: withFallback([]), // ✅ now real image
    comments: [],
  },
  // Add into src/data/blogPosts.ts

{
  id: "greater-accra-chairman-2028",
  title: "Greater Accra Chairman Declares 'Operation 30 Seats for NDC' in 2028",
  excerpt:
    "The Greater Accra Regional Chairman has declared a bold mission for the party ahead of the 2028 elections.",
  content:
    "In a charged atmosphere, the Greater Accra Regional Chairman of the New Patriotic Party unveiled a new campaign dubbed 'Operation 30 Seats for NDC'. The initiative seeks to secure at least 30 parliamentary seats in the Greater Accra Region during the 2028 general elections...",
  date: "2025-09-01",
  readingTime: "3 min read",
  author: "Greater Accra Regional Communications",
  scope: "regional",
  region: "greater-accra",
  headline: "🎯 Greater Accra Operation 30 Seats Declared",
  media: ["/Greater Accra image 1.jpeg"], // ✅ from public/
  comments: [],
},
{
  id: "greater-accra-youth-2028",
  title:
    "Greater Accra Youth Organizer Meets Constituency Counterparts to Strategize for 2028",
  excerpt:
    "The Greater Accra Regional Youth Organizer has met with youth leaders from all constituencies to map out campaign strategies.",
  content:
    "As part of preparations towards 2028, the Regional Youth Organizer of the NPP in Greater Accra met with constituency youth organizers. Discussions centered on mobilization, grassroots empowerment, and digital campaigns to reach the youth population...",
  date: "2025-09-02",
  readingTime: "2 min read",
  author: "Greater Accra Youth Wing",
  scope: "regional",
  region: "greater-accra",
  headline: "👥 Greater Accra Youth Strategize for 2028",
  media: ["/Greater-Accra-image-2.webp"], // ✅ from public/
  comments: [],
},
{
  id: "greater-accra-executives-rally",
  title: "Regional Executives Rally Around the Elephant to Energize Support Base",
  excerpt:
    "Greater Accra regional executives gathered in Accra to reaffirm unity and commitment to the party’s vision.",
  content:
    "The Greater Accra Regional Executives of the NPP organized a mass rally to showcase solidarity and motivate the grassroots. With chants of 'Elephant to Victory', speakers emphasized unity, discipline, and commitment to the 2028 agenda...",
  date: "2025-09-03",
  readingTime: "2 min read",
  author: "Greater Accra Regional Executives",
  scope: "regional",
  region: "greater-accra",
  headline: "🐘 Greater Accra Executives Rally Around the Elephant",
  media: ["/npp-race.jpg"], // ✅ from public/
  comments: [],
},
{
  id: "dome-kwabenya-primaries-2024",
  title: "Dome-Kwabenya 2024 NDC Internal Primaries Contestants Smoke Peace Pipe",
  excerpt:
    "After a heated internal primary, contestants in Dome-Kwabenya have united to pledge peace and collaboration.",
  content:
    "The Dome-Kwabenya constituency witnessed a symbolic moment as all contestants in the 2024 NPP internal primaries smoked the peace pipe. This gesture signaled their commitment to unity and a stronger campaign for the upcoming 2028 general elections...",
  date: "2025-09-10",
  readingTime: "2 min read",
  author: "Dome-Kwabenya Communications Team",
  scope: "constituency",
  region: "greater-accra",
  constituency: "dome-kwabenya",
  headline: "🤝 Dome-Kwabenya Contestants Unite",
  media: ["/Dome-Kwabenya-2024-contestants.jpg"], // ✅ from public/
  comments: [],
},
{
  id: "dome-kwabenya-adwoa-safo-apology",
  title: "Former MP Adwoa Safo Apologizes to the NDC Family and Constituency",
  excerpt:
    "Adwoa Safo has rendered an unqualified apology to the party and Dome-Kwabenya constituency for past issues.",
  content:
    "In a heartfelt statement, Dome-Kwabenya’s former MP, Hon. Adwoa Safo, publicly apologized to the NPP national leadership, regional executives, and the entire Dome-Kwabenya constituency. She pledged renewed dedication to the party’s growth and unity...",
  date: "2025-09-11",
  readingTime: "2 min read",
  author: "Dome-Kwabenya Constituency Desk",
  scope: "constituency",
  region: "greater-accra",
  constituency: "dome-kwabenya",
  headline: "🙏 Adwoa Safo Apologizes to NPP",
  media: ["/Dome-Kwabenya-Adwoa-Safo.jpg"], // ✅ from public/
  comments: [],
},
{
  id: "dome-kwabenya-executives-press-2025",
  title: "Dome-Kwabenya NPP Constituency Executives Organize Press Conference",
  excerpt:
    "The constituency executives held a press conference to address pressing issues and reaffirm their loyalty to the party.",
  content:
    "The Dome-Kwabenya NPP Constituency Executives convened a press conference, highlighting the party’s developmental plans, addressing recent controversies, and calling on all members to stand united as the 2028 elections approach...",
  date: "2025-09-12",
  readingTime: "2 min read",
  author: "Constituency Executives",
  scope: "constituency",
  region: "greater-accra",
  constituency: "dome-kwabenya",
  headline: "📢 Dome-Kwabenya Executives Address Press",
  media: ["/Dome-Kwabenya Executives.jpg"], // ✅ from public/
  comments: [],
},

];
