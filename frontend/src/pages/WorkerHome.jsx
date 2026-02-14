import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerHome.css";

function WorkerHome() {
  const navigate = useNavigate();

  const [workerId, setWorkerId] = useState(null);
  const [workerDetails, setWorkerDetails] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [availableWorkers, setAvailableWorkers] = useState([]);

  // 🔹 Load workerId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("workerId");

    if (!id) {
      navigate("/login-worker");
    } else {
      setWorkerId(id);
      loadWorkerDetails(id);
    }
  }, [navigate]);

  // 🔹 Load this worker details
  const loadWorkerDetails = async (id) => {
    try {
      const response = await fetch("https://get-help.onrender.com/workers");
      const data = await response.json();

      if (data.success) {
        const currentWorker = data.workers.find(
          (w) => String(w.id) === String(id)
        );

        if (currentWorker) {
          setWorkerDetails(currentWorker);
          setIsAvailable(currentWorker.is_available);
        }
      }
    } catch (err) {
      console.log("Failed to load worker details");
    }
  };

  // 🔹 Toggle availability
  const toggleAvailability = async () => {
    if (!workerId) return;

    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    try {
      const response = await fetch(
        "https://get-help.onrender.com/worker/toggle-availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            workerId: workerId,
            isAvailable: newStatus
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatusMessage(
          newStatus
            ? "You are now Available 🟢"
            : "You are now Offline ⚪"
        );
      } else {
        setStatusMessage("Update failed");
      }
    } catch (err) {
      setStatusMessage("Server error");
    }
  };

  // 🔹 FindME → Show all available workers
  const handleFindMe = async () => {
    try {
      const response = await fetch("https://get-help.onrender.com/workers");
      const data = await response.json();

      if (data.success) {
        const available = data.workers.filter(
          (worker) => worker.is_available === true
        );

        setAvailableWorkers(available);
      }
    } catch (err) {
      console.log("Error loading available workers");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("workerId");
    navigate("/login-worker");
  };

  return (
    <div className="workerhome-container">

      {/* Top Bar */}
      <div className="topbar">
        <h2 className="welcome-text">Worker Dashboard</h2>

        <div className="diamond-btn" onClick={handleFindMe}>
          <span>FindME</span>
        </div>
      </div>

      {/* Worker Profile */}
      {workerDetails && (
        <div className="details-card">
          <h3>Your Details</h3>

          <p><strong>Name:</strong> {workerDetails.name}</p>
          <p><strong>Profession:</strong> {workerDetails.profession}</p>
          <p><strong>Locality:</strong> {workerDetails.locality}</p>

          <label className="availability-toggle">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailability}
            />
            Available for Work
          </label>

          {statusMessage && (
            <p className="status-message">{statusMessage}</p>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Available Workers List */}
      {availableWorkers.length > 0 && (
        <div className="available-section">
          <h3>Currently Available Workers 🟢</h3>

          <div className="workers-grid">
            {availableWorkers.map((worker, index) => (
              <div key={index} className="worker-card">
                <h4>{worker.name}</h4>
                <p>{worker.profession}</p>
                <p>{worker.locality}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default WorkerHome;
