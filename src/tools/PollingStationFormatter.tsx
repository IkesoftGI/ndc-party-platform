// src/tools/PollingStationTemplateFormatter.tsx
import React, { useState } from "react";

function toTokens(s: string) {
  return s.trim().split(/\s+/).filter(Boolean);
}

function endsWithTokens(base: string[], suffix: string[]) {
  if (!suffix.length || base.length < suffix.length) return false;
  for (let i = 0; i < suffix.length; i++) {
    if (base[base.length - suffix.length + i] !== suffix[i]) return false;
  }
  return true;
}

export default function PollingStationTemplateFormatter() {
  const [template, setTemplate] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [output, setOutput] = useState("");

  const parseTemplate = (tpl: string) => {
    const up = tpl.toUpperCase().trim();
    // allow either " - " or " _ " with spaces around the separator
    let parts = up.split(/\s[-_]\s/);
    if (parts.length !== 5) {
      // fallback: try strict " - "
      parts = up.split(" - ");
    }
    if (parts.length !== 5) {
      // fallback: try strict " _ "
      parts = up.split(" _ ");
    }
    return parts.map((p) => p.trim());
  };

  const handleConvert = () => {
    const parts = parseTemplate(template);
    if (parts.length !== 5) {
      alert(
        "Template must have 5 parts:\nCODE - NAME - CONSTITUENCY - DISTRICT - REGION\n(e.g. A140101A - RC DAY NURSERY AKROPONG - AMENFI EAST - WASSA AMENFI EAST - WESTERN)"
      );
      return;
    }

    const [tplCode, tplName, tplCon, tplDist, tplRegion] = parts;

    const conTokens = toTokens(tplCon);
    const distTokens = toTokens(tplDist);
    const regTokens = toTokens(tplRegion);
    const regionFlat = tplRegion.replace(/\s+/g, "").toUpperCase();

    const lines = rawInput
      .toUpperCase()
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const formatted = lines
      .map((line) => {
        // remove leading numeric/commas like "2,159"
        const cleanLine = line.replace(/^[\d,]+\s+/, "");
        const tokens = cleanLine.split(/\s+/).filter(Boolean);

        const codeIndex = tokens.findIndex((t) => /^[A-Z]\d{6}[A-Z]?$/.test(t));
        if (codeIndex === -1) return null;

        const code = tokens[codeIndex];
        let nameTokens = tokens.slice(codeIndex + 1);

        // Helper: exact suffix strip
        const stripExact = (suffix: string[]) => {
          if (endsWithTokens(nameTokens, suffix)) {
            nameTokens = nameTokens.slice(0, -suffix.length);
            return true;
          }
          return false;
        };

        // Helper: glued region strip (handles ABREMCENTRAL etc.)
        const stripGluedRegion = () => {
          if (!nameTokens.length) return false;
          const last = nameTokens[nameTokens.length - 1];
          const lastFlat = last.replace(/\s+/g, "");
          if (lastFlat.endsWith(regionFlat)) {
            // remove the *whole* glued tail token; earlier tokens still contain district/constituency to be stripped
            nameTokens = nameTokens.slice(0, -1);
            return true;
          }
          return false;
        };

        // Loop until stable: region → district → constituency (repeat)
        let changed = true;
        let guard = 0;
        while (changed && guard++ < 20) {
          changed = false;

          // Strip explicit region at tail
          if (stripExact(regTokens)) changed = true;
          // If still glued, strip the glued last token (e.g., ABREMCENTRAL)
          else if (stripGluedRegion()) changed = true;

          // After region is off, strip district (can repeat)
          while (stripExact(distTokens)) changed = true;

          // Then strip constituency (can repeat)
          while (stripExact(conTokens)) changed = true;
        }

        const name = nameTokens.join(" ").replace(/\s{2,}/g, " ").trim();

        return `{ code: "${code}", name: "${name}", constituency: "${tplCon}", district: "${tplDist}", region: "${tplRegion}" },`;
      })
      .filter(Boolean)
      .join("\n");

    setOutput(`// ${tplCon} Polling Stations\n${formatted}`);
  };

  const handleClear = () => {
    setTemplate("");
    setRawInput("");
    setOutput("");
  };

  return (
    <div className="container py-4">
      <h2>Polling Station Template Formatter</h2>
      <p>
        Enter one gold template line using either <code> - </code> or{" "}
        <code> _ </code> as separators:
        <br />
        <code>CODE - NAME - CONSTITUENCY - DISTRICT - REGION</code>
      </p>

      <textarea
        rows={2}
        placeholder="B010101 - M/A PRI. SCH. DOMINASE EAST - KOMENDA EDINA EGUAFO ABREM - KOMENDA EDINA EGUAFO ABREM - CENTRAL"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="form-control mb-3"
      />

      <h5>Raw EC Data</h5>
      <textarea
        rows={8}
        placeholder="Paste EC polling station lines here..."
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        className="form-control mb-3"
      />

      <div className="mb-3">
        <button onClick={handleConvert} className="btn btn-primary me-2">
          Convert
        </button>
        <button onClick={handleClear} className="btn btn-danger">
          Clear
        </button>
      </div>

      <h5>Refined Output</h5>
      <textarea rows={10} readOnly value={output} className="form-control" />
    </div>
  );
}
