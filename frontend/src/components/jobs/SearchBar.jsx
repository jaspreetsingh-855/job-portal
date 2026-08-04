import { useEffect, useState } from "react";
import "../../styles/SearchBar.css";

const FALLBACK_LOCATIONS = [
  "Remote",
  "Chandigarh",
  "Delhi",
  "Noida",
  "Bangalore",
];

function getUniqueLocations(jobs) {
  const locationSet = new Set();

  jobs.forEach((job) => {
    const raw = job.location || "";
    raw.split(",").forEach((part) => {
      const place = part.trim();
      if (place) locationSet.add(place);
    });
  });

  return [...locationSet].sort((a, b) => a.localeCompare(b));
}

function SearchBar({ onSearch, initialFilters }) {
  const [filters, setFilters] = useState({
    search: initialFilters?.search || "",
    location: initialFilters?.location || "All",
    jobType: initialFilters?.jobType || "All",
  });
  const [locations, setLocations] = useState(FALLBACK_LOCATIONS);

  useEffect(() => {
    const controller = new AbortController();

    const loadLocations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const fromApi = getUniqueLocations(data);
          if (fromApi.length > 0) setLocations(fromApi);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.warn("Could not load locations from API:", error.message);
      }
    };

    loadLocations();

    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const locationOptions = [...locations];
  if (
    filters.location &&
    filters.location !== "All" &&
    !locationOptions.includes(filters.location)
  ) {
    locationOptions.unshift(filters.location);
  }

  return (
    <div className="search-container">
      <input
        type="text"
        name="search"
        placeholder="Preference (job, company...)"
        value={filters.search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <select
        name="location"
        value={filters.location}
        onChange={handleChange}
      >
        <option value="All">All Locations</option>
        {locationOptions.map((place) => (
          <option key={place} value={place}>
            {place}
          </option>
        ))}
      </select>

      <select
        name="jobType"
        value={filters.jobType}
        onChange={handleChange}
      >
        <option value="All">All Types</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
        <option value="Contract">Contract</option>
        <option value="Freelance">Freelance</option>
      </select>

      <button type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
