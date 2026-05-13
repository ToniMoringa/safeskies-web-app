import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import AppLayout from './components/layout/AppLayout';
import StatsCards from './components/dashboard/StatsCards';
import MapView from './components/dashboard/MapView';
import AlertList from './components/dashboard/AlertList';
import ReportFeed from './components/dashboard/ReportFeed';
import QRCodeModal from './components/ui/QRCodeModal';
import HelpModal from './components/ui/HelpModal';
import './styles/global.css';
import './styles/leaflet-overrides.css';
import styles from './App.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// FAST REAL NASA ALERTS - with timeout fallback
const fetchRealAlerts = async () => {
  try {
    // Timeout after 3 seconds 
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    return data.events.slice(0, 15).map((event) => {
      const category = event.categories[0]?.title || 'Natural Disaster';
      let severity = 'MEDIUM';
      if (category.includes('Wildfire') || category.includes('Severe'))
        severity = 'HIGH';
      if (category.includes('Volcano')) severity = 'CRITICAL';

      const latestGeo = event.geometry[event.geometry.length - 1];
      return {
        id: event.id,
        severity: severity,
        message_en: event.title,
        type: category,
        lat: latestGeo.coordinates[1],
        lon: latestGeo.coordinates[0],
        created_at: latestGeo.date || new Date().toISOString(),
        status: 'active',
        source: 'NASA',
      };
    });
  } catch (error) {
    console.log('Using fast local alerts');
    //  FALLBACK 
    return [
      {
        id: '1',
        severity: 'HIGH',
        message_en: '⚠️ Thunderstorm - Nairobi',
        lat: -1.2921,
        lon: 36.8219,
        status: 'active',
        source: 'LOCAL',
      },
      {
        id: '2',
        severity: 'MEDIUM',
        message_en: '🌊 Flood warning - Mombasa',
        lat: -4.0435,
        lon: 39.6682,
        status: 'active',
        source: 'LOCAL',
      },
      {
        id: '3',
        severity: 'HIGH',
        message_en: '🔥 Wildfire - Mt Kenya',
        lat: -0.1521,
        lon: 37.3086,
        status: 'active',
        source: 'LOCAL',
      },
      {
        id: '4',
        severity: 'LOW',
        message_en: '🌧️ Heavy rain - Kisumu',
        lat: -0.1022,
        lon: 34.7617,
        status: 'active',
        source: 'LOCAL',
      },
    ];
  }
};

// FAST REPORTS - instant load
const getFastReports = () => [
  {
    id: 'r1',
    type: 'traffic_jam',
    message: 'Heavy traffic - Mombasa Road',
    lat: -1.3123,
    lon: 36.8167,
    created_at: new Date().toISOString(),
    verified: true,
  },
  {
    id: 'r2',
    type: 'accident',
    message: 'Accident - Westlands, Nairobi',
    lat: -1.2697,
    lon: 36.8003,
    created_at: new Date().toISOString(),
    verified: false,
  },
  {
    id: 'r3',
    type: 'fire',
    message: 'Smoke visible - CBD Nairobi',
    lat: -1.2833,
    lon: 36.8167,
    created_at: new Date().toISOString(),
    verified: true,
  },
];

// FAST CITY SEARCH - preloaded common cities
const QUICK_CITIES = {
  nairobi: { lat: -1.2921, lon: 36.8219 },
  mombasa: { lat: -4.0435, lon: 39.6682 },
  kampala: { lat: 0.3136, lon: 32.5811 },
  'dar es salaam': { lat: -6.7924, lon: 39.2083 },
  atlanta: { lat: 33.749, lon: -84.388 },
  'new york': { lat: 40.7128, lon: -74.006 },
  london: { lat: 51.5074, lon: -0.1278 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  paris: { lat: 48.8566, lon: 2.3522 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  cairo: { lat: 30.0444, lon: 31.2357 },
  'cape town': { lat: -33.9249, lon: 18.4241 },
  lagos: { lat: 6.5244, lon: 3.3792 },
  'addis ababa': { lat: 9.032, lon: 38.7469 },
};

// Search any city via API (fast, 1 second)
const searchCityAPI = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } },
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

function App() {
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastViewedCount, setLastViewedCount] = useState(0);
  const [showAlertsPanel, setShowAlertsPanel] = useState(true);

  const mockZones = [
    { id: 'KE-NBI-001', name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219 },
    { id: 'KE-MSA-001', name: 'Mombasa, Kenya', lat: -4.0435, lon: 39.6682 },
    { id: 'TZ-DAR-001', name: 'Dar es Salaam', lat: -6.7924, lon: 39.2083 },
    { id: 'UG-KLA-001', name: 'Kampala, Uganda', lat: 0.3136, lon: 32.5811 },
  ];

  // LOAD FAST - show alerts immediately
  useEffect(() => {
    const loadFast = async () => {
      // Show reports instantly
      setReports(getFastReports());

      // Load alerts (takes 1-3 seconds)
      const realAlerts = await fetchRealAlerts();
      setAlerts(realAlerts);
      localStorage.setItem('safeskies_alerts', JSON.stringify(realAlerts));
    };

    loadFast();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Notification count
  useEffect(() => {
    if (alerts.length > lastViewedCount)
      setNotificationCount(alerts.length - lastViewedCount);
  }, [alerts, lastViewedCount]);

  // FAST SEARCH 
  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;

    const term = searchTerm.toLowerCase().trim();
    console.log(`🔍 Searching: ${term}`);

    // Check quick cities first 
    if (QUICK_CITIES[term]) {
      const city = QUICK_CITIES[term];
      if (window.mapInstance) {
        window.mapInstance.flyTo([city.lat, city.lon], 10);
        console.log(`✈️ Flew to ${term}`);
      }
      return;
    }

    // Try API search 
    const result = await searchCityAPI(searchTerm);
    if (result && window.mapInstance) {
      window.mapInstance.flyTo([result.lat, result.lon], 10);
      console.log(`✈️ Flew to ${result.name}`);
    } else {
      console.log(`❌ City not found: ${searchTerm}`);
    }
  };

  const handleBellClick = () => {
    setLastViewedCount(alerts.length);
    setNotificationCount(0);
    const el = document.querySelector('[class*="alertList"]');
    if (el && window.innerWidth > 768)
      el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRespond = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'responding',
              message_en: `[RESPONDING] ${a.message_en}`,
            }
          : a,
      ),
    );
  };

  const handleResolve = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <AppLayout
      onSearch={handleSearch}
      alertCount={activeAlerts.length}
      notificationCount={notificationCount}
      onBellClick={handleBellClick}
      onGetApp={() => setShowQRModal(true)}
      onHelp={() => setShowHelpModal(true)}
      onToggleAlerts={() => setShowAlertsPanel(!showAlertsPanel)}
      showAlertsPanel={showAlertsPanel}
      activeView={activeView}
      onNavigate={setActiveView}
    >
      <div className={styles.dashboard}>
        <StatsCards alerts={alerts} reports={reports} />
        <div className={styles.mainGrid}>
          <div className={styles.mapSection}>
            <MapView
              alerts={alerts}
              mockZones={mockZones}
              onLocationFound={(loc) => console.log('📍', loc)}
            />
          </div>
          <div className={styles.panelsSection}>
            {showAlertsPanel ? (
              <>
                <div className={styles.panel}>
                  <AlertList
                    alerts={activeAlerts}
                    onRespond={handleRespond}
                    onResolve={handleResolve}
                  />
                </div>
                <div className={styles.panel}>
                  <ReportFeed reports={reports} />
                </div>
              </>
            ) : (
              <div
                className={styles.panel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ textAlign: 'center' }}>
                  👈 Alerts hidden
                  <br />
                  Click "Alerts" to show
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </AppLayout>
  );
}

export default App;
