// src/components/OnboardingForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// Define categories as a type with specific keys
const categories: { [key in 'national' | 'region' | 'constituency']: string[] } = {
  national: ["National Executives", "Council of Elders"],
  region: ["Regional Executives", "Regional Council of Elders"],
  constituency: [
    "Constituency Executives",
    "Constituency Council of Elders",
    "Electoral Area Coordinators",
    "Polling Station Executives",
  ],
};

const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1); // Step 1: Ordinary Member, Step 2: Party Official
  const [formData, setFormData] = useState({
    name: "",
    ghanaCard: "",
    partyCard: "",
    voterID: "",
    region: "",
    constituency: "",
    roleCategory: "",
    position: "",
    photo: "",
  });

  const navigate = useNavigate(); // Hook to navigate to the homepage

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = () => {
    // Perform form submission here (e.g., store data in backend)
    alert("Form submitted successfully!");
    setStep(3); // Proceed to confirmation or next step
    navigate("/home"); // Redirect to home page after submission
  };

  return (
    <div className="onboarding-form">
      <h1>Party Member Registration</h1>

      {/* Step 1: Ordinary Member Form */}
      {step === 1 && (
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Ghana Card Number</label>
          <input
            type="text"
            name="ghanaCard"
            value={formData.ghanaCard}
            onChange={handleChange}
            required
          />
          <label>Party Card (Optional)</label>
          <input
            type="text"
            name="partyCard"
            value={formData.partyCard}
            onChange={handleChange}
          />
          <label>Voter’s ID (Optional)</label>
          <input
            type="text"
            name="voterID"
            value={formData.voterID}
            onChange={handleChange}
          />
          <label>Region</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          />
          <label>Constituency</label>
          <input
            type="text"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
            required
          />
          <button onClick={() => setStep(2)}>Next</button>
        </form>
      )}

      {/* Step 2: Party Official Form */}
      {step === 2 && (
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Role Category</label>
          <select name="roleCategory" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="national">National</option>
            <option value="region">Region</option>
            <option value="constituency">Constituency</option>
          </select>

          {formData.roleCategory && (
            <div>
              <label>Position</label>
              <select name="position" onChange={handleChange} required>
                <option value="">Select Position</option>
                {categories[formData.roleCategory as 'national' | 'region' | 'constituency']?.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label>Upload Photo</label>
          <input type="file" onChange={handlePhotoUpload} accept="image/*" required />
          <button onClick={handleSubmit}>Submit</button>
        </form>
      )}

      {/* Confirmation or Next Steps */}
      {step === 3 && <h2>Thank you for registering! Your role has been assigned.</h2>}
    </div>
  );
};

export default OnboardingForm;
