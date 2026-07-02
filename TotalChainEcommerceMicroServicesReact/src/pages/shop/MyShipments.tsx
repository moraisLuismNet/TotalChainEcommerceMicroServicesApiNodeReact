import { useEffect, useState, useRef } from "react";
import { shipmentsService } from "../../services/shipments.service";
import type { IShipment } from "../../interfaces/ecommerce.interfaces";
import Footer from "../../components/layout/Footer";

const MyShipments = () => {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<IShipment | null>(null);

  const mapRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const activeShipment = selectedShipment
    ? shipments.find((s) => s.id === selectedShipment.id) || selectedShipment
    : null;

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await shipmentsService.getMy();
        setShipments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
    const interval = setInterval(fetchShipments, 5000);
    return () => clearInterval(interval);
  }, []);

  // Clean up refs when modal is closed
  useEffect(() => {
    if (!selectedShipment) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      currentMarkerRef.current = null;
      polylineRef.current = null;
    }
  }, [selectedShipment]);

  // Handle Leaflet Map Initialization and Updates
  useEffect(() => {
    if (!activeShipment) return;

    let isMounted = true;
    let map: any = null;

    const initMap = () => {
      if (!isMounted) return;
      const L = (window as any).L;
      if (!L) return;

      const container = document.getElementById("shipment-map");
      if (!container) return;

      const origin: [number, number] = [
        activeShipment.originLatitude,
        activeShipment.originLongitude,
      ];
      const dest: [number, number] = [
        activeShipment.destinationLatitude,
        activeShipment.destinationLongitude,
      ];
      const current: [number, number] = [
        activeShipment.currentLatitude || activeShipment.originLatitude,
        activeShipment.currentLongitude || activeShipment.originLongitude,
      ];

      if (!mapRef.current) {
        container.innerHTML = "";
        map = L.map("shipment-map").setView(current, 13);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const originIcon = L.divIcon({
          className: "custom-map-marker origin-marker",
          html: `<div style="background-color: #6c757d; color: white; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">A</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const destIcon = L.divIcon({
          className: "custom-map-marker dest-marker",
          html: `<div style="background-color: #198754; color: white; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">B</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        L.marker(origin, { icon: originIcon }).addTo(map).bindPopup(`<b>Origin:</b> ${activeShipment.originAddress}`);
        L.marker(dest, { icon: destIcon }).addTo(map).bindPopup(`<b>Destination:</b> ${activeShipment.destinationAddress}`);

        const bounds = L.latLngBounds([origin, dest]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      const activeMap = mapRef.current;

      // Update current location marker
      if (activeShipment.status !== "Delivered" && activeShipment.status !== "Pending") {
        const currentIcon = L.divIcon({
          className: "custom-map-marker current-marker",
          html: `<div style="background-color: #0dcaf0; color: white; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(13,202,240,0.6); animation: pulse 1.5s infinite;"><span style="transform: rotate(45deg); display: inline-block;">🚚</span></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        if (currentMarkerRef.current) {
          currentMarkerRef.current.setLatLng(current);
          currentMarkerRef.current.getPopup().setContent(`<b>Current Location</b><br/>Status: ${activeShipment.status}`);
        } else {
          const marker = L.marker(current, { icon: currentIcon }).addTo(activeMap).bindPopup(`<b>Current Location</b><br/>Status: ${activeShipment.status}`);
          currentMarkerRef.current = marker;
        }
      } else {
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
          currentMarkerRef.current = null;
        }
      }

      // Update polyline
      const routeCoordinates = [origin, current, dest];
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(routeCoordinates);
      } else {
        const polyline = L.polyline(routeCoordinates, {
          color: "#0d6efd",
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 8"
        }).addTo(activeMap);
        polylineRef.current = polyline;
      }
    };

    const L = (window as any).L;
    if (L) {
      const timer = setTimeout(initMap, 100);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }

    let cssLink = document.querySelector('link[href*="leaflet.css"]');
    if (!cssLink) {
      cssLink = document.createElement("link");
      (cssLink as any).rel = "stylesheet";
      (cssLink as any).href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(cssLink);
    }

    let jsScript = document.querySelector('script[src*="leaflet.js"]');
    if (!jsScript) {
      jsScript = document.createElement("script");
      (jsScript as any).src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      (jsScript as any).async = true;
      document.body.appendChild(jsScript);
    }

    const handleScriptLoad = () => {
      initMap();
    };

    jsScript.addEventListener("load", handleScriptLoad);

    return () => {
      isMounted = false;
      if (jsScript) {
        jsScript.removeEventListener("load", handleScriptLoad);
      }
    };
  }, [activeShipment]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      OutForDelivery: "bg-warning text-dark",
      InTransit: "bg-info",
      Delivered: "bg-success",
      Pending: "bg-secondary",
    };
    return map[status] || "bg-secondary";
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status" /></div>;

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">My Shipments</h2>
        {shipments.length === 0 ? (
          <div className="alert alert-info">No shipments found</div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Status</th>
                <th>Destination</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td className="fw-bold">{s.trackingNumber}</td>
                  <td>
                    <span className={`badge ${statusBadge(s.status)}`}>{s.status}</span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>{s.destinationAddress}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedShipment(s)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedShipment && activeShipment && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13,202,240,0.7); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(13,202,240,0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13,202,240,0); }
              }
              .custom-map-marker {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}</style>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Shipment #{activeShipment.trackingNumber}</h5>
                  <button className="btn-close" onClick={() => setSelectedShipment(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Origin:</strong> {activeShipment.originAddress}</p>
                      <p><strong>Destination:</strong> {activeShipment.destinationAddress}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Status:</strong> <span className={`badge ${statusBadge(activeShipment.status)}`}>{activeShipment.status}</span></p>
                      <p><strong>Order ID:</strong> #{activeShipment.orderId}</p>
                    </div>
                  </div>

                  <div className="progress mb-3" style={{ height: "25px" }}>
                    <div className="progress-bar bg-info" role="progressbar"
                      style={{ width: activeShipment.status === "OutForDelivery" ? "33%" : activeShipment.status === "InTransit" ? "66%" : activeShipment.status === "Delivered" ? "100%" : "0%" }}>
                      {activeShipment.status}
                    </div>
                  </div>

                  {activeShipment.originLatitude && activeShipment.originLongitude && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Live Tracking Map</label>
                      <div id="shipment-map" style={{ height: "350px", borderRadius: "8px", border: "1px solid #dee2e6" }} />
                      <div className="alert alert-info mt-2 mb-0">
                        <p className="mb-0">
                          <strong>Origin:</strong> {activeShipment.originLatitude}, {activeShipment.originLongitude}<br />
                          <strong>Destination:</strong> {activeShipment.destinationLatitude}, {activeShipment.destinationLongitude}
                          {activeShipment.currentLatitude !== undefined && activeShipment.currentLongitude !== undefined && (
                            <><br /><strong>Current Position:</strong> {activeShipment.currentLatitude.toFixed(6)}, {activeShipment.currentLongitude.toFixed(6)}</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedShipment(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyShipments;