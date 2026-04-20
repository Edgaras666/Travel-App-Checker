import { useMemo, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belarus",
  "Belgium", "Belize", "Bolivia", "Bosnia and Herzegovina", "Brazil",
  "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic",
  "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania",
  "Luxembourg", "Malaysia", "Mexico", "Moldova", "Mongolia", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway",
  "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "South Africa", "South Korea", "Spain", "Sweden",
  "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
];

const COUNTRY_CODES = {
  Afghanistan: "af",
  Albania: "al",
  Algeria: "dz",
  Argentina: "ar",
  Armenia: "am",
  Australia: "au",
  Austria: "at",
  Azerbaijan: "az",
  Bahamas: "bs",
  Bahrain: "bh",
  Bangladesh: "bd",
  Belarus: "by",
  Belgium: "be",
  Belize: "bz",
  Bolivia: "bo",
  "Bosnia and Herzegovina": "ba",
  Brazil: "br",
  Bulgaria: "bg",
  Cambodia: "kh",
  Cameroon: "cm",
  Canada: "ca",
  Chile: "cl",
  China: "cn",
  Colombia: "co",
  Croatia: "hr",
  Cuba: "cu",
  Cyprus: "cy",
  "Czech Republic": "cz",
  Denmark: "dk",
  "Dominican Republic": "do",
  Ecuador: "ec",
  Egypt: "eg",
  Estonia: "ee",
  Ethiopia: "et",
  Finland: "fi",
  France: "fr",
  Georgia: "ge",
  Germany: "de",
  Ghana: "gh",
  Greece: "gr",
  Hungary: "hu",
  Iceland: "is",
  India: "in",
  Indonesia: "id",
  Iran: "ir",
  Iraq: "iq",
  Ireland: "ie",
  Israel: "il",
  Italy: "it",
  Jamaica: "jm",
  Japan: "jp",
  Jordan: "jo",
  Kazakhstan: "kz",
  Kenya: "ke",
  Kuwait: "kw",
  Latvia: "lv",
  Lebanon: "lb",
  Lithuania: "lt",
  Luxembourg: "lu",
  Malaysia: "my",
  Mexico: "mx",
  Moldova: "md",
  Mongolia: "mn",
  Morocco: "ma",
  Netherlands: "nl",
  "New Zealand": "nz",
  Nigeria: "ng",
  "North Korea": "kp",
  Norway: "no",
  Pakistan: "pk",
  Peru: "pe",
  Philippines: "ph",
  Poland: "pl",
  Portugal: "pt",
  Qatar: "qa",
  Romania: "ro",
  Russia: "ru",
  "Saudi Arabia": "sa",
  Serbia: "rs",
  Singapore: "sg",
  Slovakia: "sk",
  Slovenia: "si",
  "South Africa": "za",
  "South Korea": "kr",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Thailand: "th",
  Turkey: "tr",
  Ukraine: "ua",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States": "us",
  Uruguay: "uy",
  Venezuela: "ve",
  Vietnam: "vn"
};

function App() {
  const [country, setCountry] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState(null);
  const [searchedCountry, setSearchedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = useMemo(() => {
    const value = country.trim().toLowerCase();
    if (!value) return [];

    return COUNTRIES.filter((item) =>
      item.toLowerCase().includes(value)
    ).slice(0, 6);
  }, [country]);

  const handleSelectCountry = (name) => {
    setCountry(name);
    setShowSuggestions(false);
    setError("");
  };

  const findCanonicalCountry = (value) => {
    const trimmed = value.trim().toLowerCase();
    return (
      COUNTRIES.find((item) => item.toLowerCase() === trimmed) || value.trim()
    );
  };

  const handleCheck = async () => {
    if (loading) return;

    const trimmed = country.trim();

    if (!trimmed) {
      setError("Please enter a country.");
      setResult(null);
      return;
    }

    const canonicalCountry = findCanonicalCountry(trimmed);

    setLoading(true);
    setError("");
    setResult(null);
    setShowSuggestions(false);

    try {
      const res = await fetch(`${API_BASE_URL}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ country: canonicalCountry })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
      setSearchedCountry(canonicalCountry);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Request failed. Check browser console and backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 71) return "#22c55e";
    if (score >= 41) return "#f59e0b";
    return "#ef4444";
  };

  const getSafetyLabelColor = (safety) => {
    if (safety === "Safe") return "#4ade80";
    if (safety === "Caution") return "#fbbf24";
    return "#f87171";
  };

  const getFlagUrl = (name) => {
    const canonical = findCanonicalCountry(name);
    const code = COUNTRY_CODES[canonical];
    if (!code) return null;
    return `https://flagcdn.com/w80/${code}.png`;
  };

  const flagUrl = result ? getFlagUrl(searchedCountry) : null;
  const score = Number(result?.score || 0);

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.badge}>AI travel assistant</div>
          <h1 style={styles.title}>Travel Safety Checker</h1>
          <p style={styles.subtitle}>
            Search a country and get a quick safety overview with a risk score,
            disruptions, and practical travel advice.
          </p>
        </div>

        <div style={styles.searchCard}>
          <label style={styles.label}>Destination country</label>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={country}
              placeholder="Type a country name..."
              style={styles.input}
              onChange={(e) => {
                setCountry(e.target.value);
                setShowSuggestions(true);
                setError("");
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleCheck();
                }
              }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div style={styles.dropdown}>
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={styles.suggestionButton}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCountry(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || !country.trim()}
            style={{
              ...styles.primaryButton,
              opacity: loading || !country.trim() ? 0.85 : 1,
              cursor: loading || !country.trim() ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Checking safety..." : "Check safety"}
          </button>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultTop}>
              <div style={styles.resultHeaderLeft}>
                <div style={styles.resultLabel}>Result for</div>

                <div style={styles.resultCountryRow}>
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${searchedCountry} flag`}
                      style={styles.smallFlag}
                    />
                  )}
                  <div style={styles.resultCountry}>{searchedCountry}</div>
                </div>
              </div>

              <div
                style={{
                  ...styles.scorePill,
                  background: getScoreColor(score)
                }}
              >
                {result.score ?? "?"}/100
              </div>
            </div>

            <div style={styles.scoreBarWrap}>
              <div style={styles.scoreBarTrack}>
                <div style={styles.scoreBarRed} />
                <div style={styles.scoreBarYellow} />
                <div style={styles.scoreBarGreen} />
              </div>

              <div
                style={{
                  ...styles.scoreNeedle,
                  left: `calc(${score}% - 2px)`
                }}
              />

              <div style={styles.scoreScale}>
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div style={styles.resultGrid}>
              <div style={styles.resultBlock}>
                <div style={styles.resultBlockTitle}>🛡️ Safety</div>
                <div
                  style={{
                    ...styles.resultBlockText,
                    color: getSafetyLabelColor(result.safety),
                    fontWeight: 700
                  }}
                >
                  {result.safety}
                </div>
              </div>

              <div style={styles.resultBlock}>
                <div style={styles.resultBlockTitle}>🌪️ Natural disasters</div>
                <div style={styles.resultBlockText}>{result.disasters}</div>
              </div>

              <div style={styles.resultBlock}>
                <div style={styles.resultBlockTitle}>⚠️ Conflicts / protests</div>
                <div style={styles.resultBlockText}>{result.conflicts}</div>
              </div>
            </div>

            <div style={styles.adviceCard}>
              <div style={styles.resultBlockTitle}>💡 Advice</div>
              <div style={styles.resultBlockText}>{result.advice}</div>
            </div>
          </div>
        )}

        <p style={styles.footer}>
          AI-generated information. Always verify with official travel advisories and local sources.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#ffffff",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px 16px 40px",
    boxSizing: "border-box"
  },
  glowOne: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.20)",
    filter: "blur(85px)"
  },
  glowTwo: {
    position: "absolute",
    bottom: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(168,85,247,0.18)",
    filter: "blur(85px)"
  },
  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 900,
    margin: "0 auto"
  },
  hero: {
    textAlign: "center",
    maxWidth: 680,
    margin: "20px auto 28px"
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    color: "#cbd5e1",
    marginBottom: 14
  },
  title: {
    margin: 0,
    fontSize: "clamp(32px, 6vw, 54px)",
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-0.03em"
  },
  subtitle: {
    margin: "14px auto 0",
    color: "#94a3b8",
    fontSize: "clamp(15px, 2.8vw, 18px)",
    lineHeight: 1.6,
    maxWidth: 620
  },
  searchCard: {
    background: "rgba(15,23,42,0.74)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
    borderRadius: 28,
    padding: 24,
    marginBottom: 22
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#cbd5e1",
    marginBottom: 10
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: 58,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    padding: "0 18px",
    fontSize: 16,
    outline: "none"
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
    zIndex: 20
  },
  suggestionButton: {
    width: "100%",
    background: "transparent",
    color: "#ffffff",
    border: "none",
    padding: "14px 16px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 15
  },
  primaryButton: {
    width: "100%",
    height: 58,
    border: "none",
    borderRadius: 18,
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
    boxShadow: "0 10px 30px rgba(59,130,246,0.28)"
  },
  errorBox: {
    marginTop: 12,
    borderRadius: 14,
    padding: "12px 14px",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    fontSize: 14
  },
  resultCard: {
    background: "rgba(15,23,42,0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
    borderRadius: 28,
    padding: 24
  },
  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap"
  },
  resultHeaderLeft: {
    minWidth: 0
  },
  resultLabel: {
    color: "#94a3b8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 8
  },
  resultCountryRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap"
  },
  smallFlag: {
    width: 42,
    height: 28,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.20)",
    background: "rgba(255,255,255,0.06)",
    display: "block",
    flexShrink: 0
  },
  resultCountry: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.05
  },
  scorePill: {
    minWidth: 118,
    textAlign: "center",
    padding: "16px 18px",
    borderRadius: 18,
    fontWeight: 800,
    fontSize: 18,
    color: "#0f172a",
    flexShrink: 0
  },
  scoreBarWrap: {
    marginBottom: 24
  },
  scoreBarTrack: {
    display: "grid",
    gridTemplateColumns: "40fr 30fr 30fr",
    height: 20,
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(255,255,255,0.08)"
  },
  scoreBarRed: {
    background: "#ef4444"
  },
  scoreBarYellow: {
    background: "#f59e0b"
  },
  scoreBarGreen: {
    background: "#22c55e"
  },
  scoreNeedle: {
    position: "relative",
    top: 4,
    width: 4,
    height: 14,
    background: "#e2e8f0",
    borderRadius: 999,
    boxShadow: "0 0 0 2px rgba(15,23,42,0.6)"
  },
  scoreScale: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 8,
    padding: "0 2px"
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 14
  },
  resultBlock: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 18,
    minHeight: 150
  },
  adviceCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 18
  },
  resultBlockTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10
  },
  resultBlockText: {
    color: "#dbeafe",
    lineHeight: 1.6,
    fontSize: 15
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
    marginTop: 16
  }
};

export default App;