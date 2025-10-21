// src\pages\UserSelfPlacement.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { G_ACCRA_POLLING_STATIONS } from "@data/pollingStations/G-Accra_PollingStations";
import { createUser, assignRole } from "@api/users";

// --- Constants ---
const REGIONS = ["Greater Accra", "Eastern", "Ashanti", "Central", "Volta", "Western", "Northern", 
  "Upper East", "Upper West", "Oti", "Bono", "Bono East", "Savannah", "North East", "Western North", 
  "Ahafo"];

const CONSTITUENCIES_MAP: Record<string, string[]> = {
  "Greater Accra": [ "Dome-Kwabenya", "Ablekuma North", "Ablekuma Central",
    "Ablekuma South", "Okaikwei North", "Okaikwei South",  "Ayawaso West Wuogon",
    "Ayawaso East", "Ayawaso North", "Ayawaso Central", "La Dadekotopon",
    "Ledzokuku", "Tema Central", "Tema East", "Tema West", "Ashaiman",
    "Klottey Korle", "Odododiodio"
  ],

  "Eastern": [ "Abetifi", "New Juaben South", "New Juaben North",
    "Kade", "Nkawkaw", "Akwatia", "Nsawam-Adoagyiri", "Abirem",
    "Suhum", "Fanteakwa North", "Fanteakwa South"
  ],

  "Ashanti": [ "Bantama", "Subin", "Manhyia South", "Manhyia North",
    "Asawase", "Oforikrom", "Asante Akim Central", "Asante Akim North",
    "Ejisu", "Kwadaso", "Bosomtwe", "Atwima Nwabiagya North",
    "Atwima Nwabiagya South"
  ],

  "Central": [ "Cape Coast South", "Cape Coast North", "Komenda-Edina-Eguafo-Abrem",
    "Mfantsiman", "Assin Central", "Assin North",
    "Ajumako-Enyan-Essiam", "Agona West", "Agona East"
  ],

  "Western": [ "Sekondi", "Effia", "Takoradi", "Shama", "Ahanta West",
    "Tarkwa-Nsuaem", "Mpohor", "Esikado-Ketan"
  ],

  "Western North": [ "Sefwi Wiawso", "Bodi", "Juaboso",
    "Aowin", "Suaman", "Bia East", "Bia West"
  ],

  "Volta": [ "Ho Central", "Hohoe", "Ketu North",  "Ketu South",
    "Keta", "South Dayi", "North Dayi", "Adaklu", "Afadjato South"
  ],

  "Oti": [ "Krachi East", "Krachi Nchumuru", "Krachi West", "Nkwanta South",
    "Nkwanta North", "Jasikan", "Biakoye"
   ],

  "Northern": [ "Tamale South", "Tamale Central", "Tamale North",
    "Yendi", "Gushegu", "Karaga", "Saboba", "Zabzugu",
    "Tatale-Sanguli", "Mion", "Savelugu"
  ],

  "North East": [ "Walewale", "Bunkpurugu", "Yunyoo",
    "Chereponi", "Nalerigu-Gambaga", "Yagaba-Kubori"
  ],

  "Savannah": [ "Damongo", "Bole-Bamboi", "Sawla-Tuna-Kalba",
    "Salaga North", "Salaga South"
  ],

  "Upper East": [ "Bolgatanga Central", "Bawku Central", "Bawku West",
    "Binduri", "Zebilla", "Garu", "Navrongo Central"
  ],

  "Upper West": [ "Wa Central", "Wa East", "Wa West", "Nadowli-Kaleo",
    "Sissala East", "Sissala West", "Lambussie-Karni"
  ],

  "Bono": [ "Sunyani East", "Sunyani West", "Dormaa East",
    "Dormaa Central", "Berekum East", "Berekum West", "Jaman South"
  ],

  "Bono East": [ "Techiman South", "Techiman North", "Kintampo North",
    "Kintampo South", "Nkoranza North", "Nkoranza South", "Atebubu-Amantin"
  ],

  "Ahafo": [ "Goaso", "Asunafo North", "Asunafo South",
    "Tano North", "Tano South"
  ]
};

const ELECTORAL_AREA_MAP: Record<string, string[]> = {
  // ✅ Greater Accra Region
  "Dome-Kwabenya": [ "Abokobi", "Atomic", "Atomic Hills", "Dome East",
    "Dome West", "Haatso", "Kwabenya", "Ashongman-Ablor-Adjei", "Taifa North",
    "Taifa South"
  ],
  "Ablekuma North": [ "Darkuman North", "Darkuman South", "Odorkor", 
    "Auntie Aku", "Sakaman", "Awoshie"
  ],
  "Ablekuma West": ["Dansoman", "Sahara", "Agege", "Glefe", "Sakaman"],
  "Odododiodio": ["Korle Wokon", "Akoto Lante", "Amamomo", "Bukom"],

  // ✅ Eastern Region
  "Abetifi": ["Nkwatia", "Abetifi", "Mpraeso", "Obomeng"],
  "New Juaben South": ["Zongo", "Koforidua Central", "Nsukwao", "Adweso"],
  "Kade": ["Kade", "Asuom", "Kwaebibirem"],
  
  // ✅ Ashanti Region
  "Bantama": ["Bantama", "Abrepo", "Rex", "North Suntreso"],
  "Subin": ["Amakom", "Ash-Town", "Afful Nkwanta"],
  "Manhyia South": ["Ashanti New Town", "Buokrom", "Sepe Timpom"],

  // ✅ Central Region
  "Cape Coast South": ["Kotokraba", "Kakumdo", "Abura", "Pedu"],
  "Komenda-Edina-Eguafo-Abrem": ["Komenda", "Edina", "Eguafo", "Abrem"],
  "Mfantsiman": ["Saltpond", "Biriwa", "Anomabo"],

  // ✅ Volta Region
  "Ho Central": ["Ho Zongo", "Anlokordzi", "Bankoe", "Ahoe"],
  "Ketu South": ["Aflao", "Denu", "Agbozume", "Klikor"],

  // ✅ Western Region
  "Effia": ["Effia", "Anaji", "Kojokrom"],
  "Sekondi": ["Sekondi", "Bakano", "Essaman"],

  // ✅ Northern Region
  "Tamale South": ["Kalpohin", "Lamashegu", "Choggu", "Nyohini"],
  "Yendi": ["Yendi East", "Yendi West", "Zabzugu", "Tatale"],

  // ✅ Upper East Region
  "Bolgatanga Central": ["Zuarungu", "Yikene", "Soe", "Sumbrungu"],

  // ✅ Upper West Region
  "Wa Central": ["Wa Zongo", "Dobile", "Kambali", "Mangu"],

  // ✅ Oti Region
  "Krachi East": ["Dambai", "Tokuroano", "Borae"],

  // ✅ Bono Region
  "Sunyani East": ["Penkwase", "Abesim", "Kotokrom"],

  // ✅ Bono East Region
  "Techiman South": ["Tanoso", "Anyinasu", "Krobo", "Forikrom"],

  // ✅ Savannah Region
  "Damongo": ["Larabanga", "Busunu", "Canteen", "Yagbon"],

  // ✅ North East Region
  "Walewale": ["Gbimsi", "Wulugu", "Wungu"],

  // ✅ Western North Region
  "Sefwi Wiawso": ["Dwinase", "Asawinso", "Sefwi Bekwai"],

  // ✅ Ahafo Region
  "Goaso": ["Fawohoyeden", "Goaso", "Kasapin", "Mim"]
};


const ROLE_OPTIONS: Record<string, string[]> = {
  "National Executives": [
    "National Chairman", "1st Vice Chairman", "2nd Vice Chairman", "3rd Vice Chairman",
    "General Secretary", "1st Deputy General Secretary", "2nd Deputy General Secretary",
    "National Treasurer", "1st Deputy Treasurer", "2nd Deputy Treasurer",
    "National Organizer", "Deputy National Organizer",
    "National Youth Organizer", "Deputy National Youth Organizer",
    "National Women's Organizer", "Deputy National Women's Organizer",
    "National Nasara Coordinator", "Deputy National Nasara Coordinator",
    "Communications Director", "1st Deputy Communications Director", "2nd Deputy Communications Director"
  ],

  "National Council of Elders": [  "Council Chairman", "Council Vice Chairman",
  "Council Secretary", "Council Deputy Secretary",  "Council Member 1", "Council Member 2", "Council Member 3",
  "Council Member 4", "Council Member 5", "Council Member 6"
],


  "Regional Executives": [
    "Regional Chairman", "1st Vice Chairman", "2nd Vice Chairman", "3rd Vice Chairman",
    "Regional Secretary", "Deputy Regional Secretary",
    "Regional Treasurer", "Deputy Regional Treasurer",
    "Regional Organizer", "Deputy Regional Organizer",
    "Regional Youth Organizer", "Deputy Regional Youth Organizer",
    "Regional Women's Organizer", "Deputy Regional Women's Organizer",
    "Regional Nasara Coordinator", "Deputy Regional Nasara Coordinator"    
  ],

  "Regional Council of Elders": ["Council Chairman", "Council Vice Chairman",
  "Council Secretary", "Council Deputy Secretary",
  "Council Member 1", "Council Member 2", "Council Member 3",
  "Council Member 4", "Council Member 5", "Council Member 6"],

  "Constituency Executives": [
    "Constituency Chairman", "1st Vice Chairman", "2nd Vice Chairman", "3rd Vice Chairman",
    "Constituency Secretary", "Deputy Constituency Secretary",
    "Constituency Treasurer", "Deputy Constituency Treasurer",
    "Constituency Organizer", "Deputy Constituency Organizer",
    "Constituency Youth Organizer", "Deputy Constituency Youth Organizer",
    "Constituency Women's Organizer", "Deputy Constituency Women's Organizer",
    "Constituency Nasara Coordinator", "Deputy Constituency Nasara Coordinator"
  ],

  "Constituency Council of Elders": [
  "Council Chairman", "Council Vice Chairman",
  "Council Secretary", "Council Deputy Secretary",
  "Council Member 1", "Council Member 2", "Council Member 3",
  "Council Member 4", "Council Member 5", "Council Member 6"
],


  "Electoral Area Coordinators": [
    "Chairman", "Secretary", "Vice Chair", "Youth Organizer", "Organizer", "Treasurer", "Women's Organizer"
  ],

  "Polling Station Executives": [
    "Chairman", "Secretary", "Treasurer", "Organizer", "Youth Organizer", "Women's Organizer"
  ],

  "Member of Parliament": ["Member of Parliament"],
  "District Chief Executive": ["District Chief Executive"],
  "Municipal Chief Executive": ["Municipal Chief Executive"],
  "Metropolitan Chief Executive": ["Metropolitan Chief Executive"],
};


const SCOPE_UNITS_MAP: Record<string, string[]> = {
  National: ["National Executives", "National Council of Elders"],
  Regional: ["Regional Executives", "Regional Council of Elders"],
  Constituency: [
    "Constituency Executives",
    "Constituency Council of Elders",
    "Electoral Area Coordinators",
    "Polling Station Executives",
    "Member of Parliament",
    "Municipal Chief Executive",
    "Metropolitan Chief Executive",
    "District Chief Executive",
  ],
};

const noPositionUnits = [
  "Member of Parliament",
  "District Chief Executive",
  "Municipal Chief Executive",
  "Metropolitan Chief Executive",
];

const UserSelfPlacement: React.FC = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    ghanaCard: "",
    voterId: "",
    partyCard: "",
    email: "",
    region: "",
    constituency: "",
    isOfficial: false,
    scope: "National",
    unit: "",
    position: "",
    electoralAreaName: "",
    pollingStationName: "",
    pollingStationCode: "",   
    termStart: "",
    termEnd: "",
    termStartDate: "",
    termEndDate: "",
    isActive: true,
  });

  useEffect(() => {
  const saved = localStorage.getItem("userSelfPlacementForm");
  if (saved) {
    setForm(JSON.parse(saved)); // ✅ Load saved data if available
  } else {
    // ✅ Otherwise, initialize with defaults
    setForm({
      name: "",
      ghanaCard: "",
      voterId: "",
      partyCard: "",
      email: "",
      region: "",
      constituency: "",
      isOfficial: false,
      scope: "National",
      unit: "",
      position: "",
      electoralAreaName: "",
      pollingStationName: "",
      pollingStationCode: "",
      termStart: "",
      termEnd: "",
      termStartDate: "",
      termEndDate: "",
      isActive: true,
    });
  }
}, []);

// ✅ Warm-up Render backend (prevents mobile timeouts)
useEffect(() => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  if (!API_BASE) return;

  const ping = async () => {
    try {
      await fetch(`${API_BASE}/health`, { mode: "cors" });
      console.log("🌐 Backend ping successful");
    } catch (err) {
      console.warn("⚠️ Backend warm-up failed:", err);
    }
  };

  ping(); // immediate warm-up
  const interval = setInterval(ping, 60000); // every 60s
  return () => clearInterval(interval);
}, []);

// ✅ Auto-save form to localStorage
useEffect(() => {
  localStorage.setItem("userSelfPlacementForm", JSON.stringify(form));
}, [form]);

// ✅ Handle field changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  const finalValue =
    type === "checkbox" && "checked" in e.target
      ? (e.target as HTMLInputElement).checked
      : value;

  setForm((prev) => ({
    ...prev,
    [name]: finalValue,
    ...(name === "region" && { constituency: "" }),
    ...(name === "scope" && { unit: "", position: "" }),
    ...(name === "unit" && { position: "" }),
  }));
};

// ✅ Handle photo compression & preview
const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const options = { maxSizeMB: 2, maxWidthOrHeight: 300, useWebWorker: true };

  try {
    const compressedFile = await imageCompression(file, options);
    setPhoto(compressedFile);
    setPreviewUrl(URL.createObjectURL(compressedFile));
  } catch (error) {
    console.error("❌ Image compression failed:", error);
    alert("Photo processing failed. Please choose another image.");
  }
};

// ✅ Validation helpers
const isValidGhanaCard = (card: string) => /^GHA-\d{9}-\d{1}$/.test(card.trim());
const isValidVoterId = (id: string) => /^\d{10}$/.test(id.trim());
const isValidPartyCard = (id: string) => /^[A-Z]{3}-[A-Z]{3}-\d{10}$/.test(id.trim());

const [isLoading, setIsLoading] = useState(false);

// ✅ Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("🚀 handleSubmit triggered");

  setResponse("");
  setIsLoading(true);

  try {
    console.log("🟢 Running validation...");
    if (!isValidGhanaCard(form.ghanaCard))
      return setResponse("❌ Invalid Ghana Card number (Format: GHA-123456789-0).");
    if (form.voterId && !isValidVoterId(form.voterId))
      return setResponse("❌ Invalid Voter ID number (must be 10 digits).");
    if (form.partyCard && !isValidPartyCard(form.partyCard))
      return setResponse("❌ Invalid Party Card format (e.g., GRA-DMK-1234567890).");
    if (!form.name.trim()) return setResponse("❌ Name is required.");
    if (!form.region) return setResponse("❌ Region is required.");
    if (!form.constituency) return setResponse("❌ Constituency is required.");

    console.log("📦 Creating FormData...");
    const formData = new FormData();
    formData.append("name", form.name?.trim() || "");
    formData.append("ghanaCard", form.ghanaCard?.trim() || "");
    formData.append("voterId", form.voterId?.trim() || "");
    formData.append("partyCard", form.partyCard?.trim() || "");
    formData.append("email", form.email?.trim() || "");
    formData.append("region", form.region?.trim() || "");
    formData.append("constituency", form.constituency?.trim() || "");
    if (photo) formData.append("photo", photo);
    formData.append("isOfficial", form.isOfficial ? "true" : "false");

    console.log("📡 Calling createUser()");
    const resCreate = await createUser(formData);
    console.log("✅ createUser() response:", resCreate);

    const user = resCreate?.data?.data || resCreate?.data || resCreate?.user;
    if (!user || !user._id) {
      console.error("❌ Invalid response structure:", resCreate);
      setResponse("❌ User creation failed. Please try again.");
      return;
    }

    // ✅ Cache last user
    localStorage.setItem("lastUser", JSON.stringify(user));

    if (form.isOfficial) {
      console.log("🧩 Assigning official role...");
      const rolePayload = {
        scope: form.scope?.trim() || "",
        unit: form.unit?.trim() || "",
        position: form.position?.trim() || "",
        electoralAreaName: form.electoralAreaName?.trim() || "",
        pollingStationName: form.pollingStationName?.trim() || "",
        pollingStationCode: form.pollingStationCode?.trim() || "",
        termStart: form.termStart?.trim() || "",
        termEnd: form.termEnd?.trim() || "",
        termStartDate: form.termStartDate?.trim() || "",
        termEndDate: form.termEndDate?.trim() || "",
        isActive: form.isActive ?? true,
        isOfficial: true,
      };
      await assignRole(user._id!, rolePayload);
      console.log("✅ Role assigned successfully");
    }

    console.log("🎯 Redirecting to dashboard...");
    navigate("/dashboard", { replace: true });
    setResponse("✅ User successfully submitted.");
  } catch (err: any) {
    console.error("❌ Submission failed:", err);
    setResponse(`❌ Error: ${err.response?.data?.error || err.message || "Submission failed."}`);
  } finally {
    console.log("🔴 handleSubmit finished");
    setIsLoading(false);
  }
};

// ✅ Keep region/constituency in sync
useEffect(() => {
  localStorage.setItem("region", form.region);
  localStorage.setItem("constituency", form.constituency);
}, [form.region, form.constituency]);

// ✅ Precompute dropdown options
const availableUnits = SCOPE_UNITS_MAP[form.scope] || [];
const availablePositions = ROLE_OPTIONS[form.unit] || [];
const availableConstituencies = CONSTITUENCIES_MAP[form.region] || [];
const availableElectoralAreas = ELECTORAL_AREA_MAP[form.constituency] || [];

  
  
  return (
  <div className="container mt-4">
    <h2>Party Member Self-Placement</h2>

    <div
      className="p-4 shadow-sm"
      style={{
        backgroundColor: "#7d8a97ff",
        border: "1px solid #546474ff",
        borderRadius: "12px",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* ✅ Basic Info */}
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* ✅ Ghana Card - Required */}
        <div className="mb-3">
          <label>
            Ghana Card Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="ghanaCard"
            value={form.ghanaCard}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Ghana Card (e.g., GHA-000814239-9)"
            required
          />
          <small className="text-muted">
             Your Ghana Card is required for verification purposes.
          </small>
        </div>


        {/* ✅ Voter ID - Optional */}
        <div className="mb-3">
          <label>
            Voter ID Number <small className="text-muted">(optional)</small>
          </label>
          <input
            type="text"
            name="voterId"
            value={form.voterId}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Voter ID if available"
          />
          <small className="text-muted">
            If you don’t have a Voter ID yet, you can leave this field blank.
          </small>
        </div>

        {/* ✅ Party Card - Optional */}
        <div className="mb-3">
          <label>
            Party Card Number <small className="text-muted">(optional)</small>
          </label>
          <input
            type="text"
            name="partyCard"
            value={form.partyCard}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Party Card (e.g., GRA-DMK-1234567890)"
          />
          <small className="text-muted">
            If your party card is old or unavailable, you can skip this for now.
          </small>
        </div>      

        <div className="mb-3">
          <label>Region</label>
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Region</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Constituency</label>
          <select
            name="constituency"
            value={form.constituency}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Constituency</option>
            {availableConstituencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Checkbox toggle */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isOfficial"
            checked={form.isOfficial}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">I am a party official</label>
        </div>

        {/* ✅ Official fields */}
        {form.isOfficial && (
          <>
            <div className="mb-3">
              <label>Scope</label>
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Scope</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Constituency">Constituency</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Unit</option>
                {availableUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Position</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Position</option>
                {availablePositions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Mark as Past Executive */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="isActive"
                checked={!form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: !e.target.checked }))
                }
                className="form-check-input"
              />
              <label className="form-check-label">
                This is a past executive
              </label>
            </div>

            {/* ✅ Term dates */}
            <div className="mb-3">
              <label>Executive Term (Exact Dates)</label>
              <div className="d-flex gap-2">
                <input
                  type="date"
                  name="termStartDate"
                  value={form.termStartDate}
                  onChange={handleChange}
                  className="form-control"
                />
                <input
                  type="date"
                  name="termEndDate"
                  value={form.termEndDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {form.unit === "Electoral Area Coordinators" && (
              <div className="mb-3">
                <label>Electoral Area Name</label>
                <select
                  name="electoralAreaName"
                  value={form.electoralAreaName}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Electoral Area</option>
                  {availableElectoralAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.unit === "Polling Station Executives" && (
  <div className="mb-3">
    <label>Polling Station</label>
    <input
      type="text"
      name="pollingStationCode"
      value={form.pollingStationCode}
      onChange={(e) => {
        const code = e.target.value;
        const allStations = Object.values(G_ACCRA_POLLING_STATIONS).flat();
        const station = allStations.find((s) => s.code === code);
        
        setForm((prev) => ({
          ...prev,
          pollingStationCode: code,
          pollingStationName: station ? station.name : "", // ✅ save full name too
        }));
      }}
      className="form-control"
      placeholder="Enter polling station code (e.g. C060901)"
      list="pollingStations"
      required
    />
    <datalist id="pollingStations">
      {Object.values(G_ACCRA_POLLING_STATIONS).flat().map((st) => (
        <option key={`${st.code}-${st.name}`} value={st.code}>
          {st.name}
        </option>
      ))}
    </datalist>
  </div>
)}

                
            {/* ✅ Upload Photo */}
            <div className="mb-3">
              <label>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="form-control"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "150px", marginTop: "10px" }}
                />
              )}
            </div>
          </>
        )}

        <button type="submit"  className="btn btn-primary"  disabled={isLoading}
>         {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"  role="status"
              aria-hidden="true"  ></span>
              Submitting...
           </>
         ) : (
           "Submit"
         )}
       </button>

       {/* ✅ Feedback Message */}
       {response && (
         <div
           className={`mt-3 fw-bold text-center ${
             response.startsWith("✅") ? "text-success" :
             response.startsWith("❌") ? "text-danger" :
             "text-white"
           }`}
        >
           {response}
        </div>

       )}

      </form>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light" role="status"></div>
          <div>Submitting your details...</div>
        </div>
      )}
    </div>
  </div>
);
}

export default UserSelfPlacement;