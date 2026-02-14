import { useState, useEffect } from "react";
import "./UserHome.css";

function UserHome() {

  const [services, setServices] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [workers, setWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState("services");
  const [showMap, setShowMap] = useState(false);

  /* =============================
     LOAD SERVICES & LOCALITIES
  ============================= */
  useEffect(() => {
    loadServices();
    loadLocalities();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch("https://get-help.onrender.com/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.log("Failed to load services");
    }
  };

  const loadLocalities = async () => {
    try {
      const res = await fetch("https://get-help.onrender.com/localities");
      const data = await res.json();
      setLocalities(data);
    } catch (err) {
      console.log("Failed to load localities");
    }
  };

  /* =============================
     SEARCH WORKERS
  ============================= */
  const searchWorkers = async () => {

    if (!selectedService || !selectedLocality) {
      alert("Please select service and locality");
      return;
    }

    try {
      const response = await fetch("https://get-help.onrender.com/search-workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service: selectedService,
          locality: selectedLocality,
          availableOnly: availableOnly
        })
      });

      const data = await response.json();
      setWorkers(data);

    } catch (err) {
      console.log("Search failed");
    }
  };

  /* =============================
     LOAD ALL WORKERS
  ============================= */
  const loadAllWorkers = async () => {
    try {
      const response = await fetch("https://get-help.onrender.com/workers");
      const data = await response.json();

      if (data.success) {
        setWorkers(data.workers);
      }
    } catch (err) {
      console.log("Failed to load workers");
    }
  };

  /* =============================
     LOCATE ME (OpenStreetMap)
  ============================= */
  const handleLocateMe = () => {
    setShowMap(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const iframe = document.getElementById("mapFrame");
        iframe.src =
          `https://www.openstreetmap.org/export/embed.html?bbox=${
            lon - 0.01
          },${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`;
      });
    }
  };

  /* =============================
     FILTER LOCALITY AUTOCOMPLETE
  ============================= */
  const filteredLocalities = localities.filter(loc =>
    loc.locality_name
      .toLowerCase()
      .includes(selectedLocality.toLowerCase())
  );

  return (
    <div className="userhome-container">

      {/* TOP BAR */}
      <div className="topbar">
        <h2>User Dashboard</h2>

        <div className="locate-btn" onClick={handleLocateMe}>
          LocateME
        </div>
      </div>

      {/* TAB BUTTONS */}
      <div className="tab-buttons">
        <button
          className={activeTab === "services" ? "active-tab" : ""}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>

        <button
          className={activeTab === "workers" ? "active-tab" : ""}
          onClick={() => {
            setActiveTab("workers");
            loadAllWorkers();
          }}
        >
          Workers
        </button>
      </div>

      {/* SERVICES SEARCH SECTION */}
      {activeTab === "services" && (
        <div className="search-section">

          {/* SERVICE DROPDOWN */}
          <select
            className="custom-dropdown"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option
                key={service.service_name}
                value={service.service_name}
              >
                {service.service_name}
              </option>
            ))}
          </select>

          {/* LOCALITY INPUT WITH AUTOCOMPLETE */}
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Type Locality..."
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="locality-input"
            />

            {selectedLocality && (
              <div className="suggestions-box">
                {filteredLocalities.map((loc) => (
                  <div
                    key={loc.locality_name}
                    className="suggestion-item"
                    onClick={() =>
                      setSelectedLocality(loc.locality_name)
                    }
                  >
                    {loc.locality_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AVAILABLE ONLY */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={() =>
                setAvailableOnly(!availableOnly)
              }
            />
            Available Only
          </label>

          <button className="search-btn" onClick={searchWorkers}>
            Search
          </button>

        </div>
      )}

      {/* WORKERS RESULT SECTION */}
      <div className="workers-container">
        {workers.length === 0 ? (
          <p className="no-workers">No workers found</p>
        ) : (
          workers.map((worker) => (
            <div key={worker.id} className="worker-card">
              <h3>
                {worker.is_available ? "🟢" : "⚪"} {worker.name}
              </h3>
              <p><strong>Profession:</strong> {worker.profession}</p>
              <p><strong>Phone:</strong> {worker.phone}</p>
              <p><strong>Locality:</strong> {worker.locality}</p>
            </div>
          ))
        )}
      </div>

      {/* MAP */}
      {showMap && (
        <div className="map-container">
          <iframe
            id="mapFrame"
            title="OpenStreetMap"
            width="100%"
            height="300"
            style={{ border: 0 }}
          ></iframe>
        </div>
      )}

    </div>
  );
}

export default UserHome;
