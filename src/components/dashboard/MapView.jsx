import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import FullScreenButton from '../ui/FullScreenButton';
import styles from './MapView.module.css';
import 'leaflet/dist/leaflet.css';

function MapView({ alerts, mockZones, onLocationFound }) {
  const mapRef = useRef(null);
  const defaultCenter = [-1.2921, 36.8219];

  // Make map available for searching
  useEffect(() => {
    if (mapRef.current) {
      // Get the actual Leaflet map instance
      const map = mapRef.current;
      window.mapInstance = map;
      console.log(' Map instance set:', !!window.mapInstance);

      // Test if flyTo works
      console.log('flyTo method available:', typeof map.flyTo === 'function');
    }
    return () => {
      window.mapInstance = null;
    };
  }, []);
  //fallback
  useEffect(() => {
    //  get the map instance after a short delay
    const timer = setTimeout(() => {
      if (mapRef.current && mapRef.current._leaflet_id) {
        window.mapInstance = mapRef.current;
        console.log('✅ Map instance via ref:', !!window.mapInstance);
      } else if (mapRef.current && mapRef.current.getCenter) {
        window.mapInstance = mapRef.current;
        console.log('✅ Map instance direct:', !!window.mapInstance);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () =>
    mapRef.current && mapRef.current.setZoom(mapRef.current.getZoom() + 1);
  const handleZoomOut = () =>
    mapRef.current && mapRef.current.setZoom(mapRef.current.getZoom() - 1);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.flyTo(
            [position.coords.latitude, position.coords.longitude],
            12,
          );
          onLocationFound?.({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error('Geolocation error:', error),
      );
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: '#ef4444',
      HIGH: '#f97316',
      MEDIUM: '#eab308',
      LOW: '#22c55e',
    };
    return colors[severity] || '#3b82f6';
  };

  const getRadius = (severity) => {
    const radii = { CRITICAL: 50000, HIGH: 30000, MEDIUM: 20000, LOW: 10000 };
    return radii[severity] || 15000;
  };

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        ref={mapRef}
        className={styles.map}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* ALERT CIRCLES from NASA */}
        {alerts
          .filter((a) => a.lat && a.lon)
          .map((alert) => (
            <Circle
              key={alert.id}
              center={[alert.lat, alert.lon]}
              radius={getRadius(alert.severity)}
              pathOptions={{
                color: getSeverityColor(alert.severity),
                fillColor: getSeverityColor(alert.severity),
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{alert.severity} ALERT</strong>
                <br />
                {alert.message_en}
                <br />
                <small>Source: {alert.source || 'NASA'}</small>
              </Popup>
            </Circle>
          ))}

        {/* ZONE MARKERS */}
        {mockZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lon]}
            radius={8000}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.15,
              weight: 1,
              dashArray: '5,5',
            }}
          >
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              Monitoring Zone
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <div className={styles.mapControls}>
        <button
          onClick={handleZoomIn}
          className={styles.controlBtn}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className={styles.controlBtn}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleLocate}
          className={styles.controlBtn}
          title="My Location"
        >
          <LocateFixed size={18} />
        </button>
        <FullScreenButton targetRef={mapRef} />
      </div>
    </div>
  );
}

export default MapView;
