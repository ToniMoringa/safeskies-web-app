import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

function AppLayout({
  children,
  onSearch,
  alertCount,
  notificationCount,
  onBellClick,
  onGetApp,
  onHelp,
  onToggleAlerts,
  showAlertsPanel,
  activeView,
  onNavigate,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.appLayout}>
      {mobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        onNavigate={onNavigate}
        onGetApp={onGetApp}
        onHelp={onHelp}
        onToggleAlerts={onToggleAlerts}
        showAlertsPanel={showAlertsPanel}
        activeView={activeView}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className={styles.mainContent}>
        <Header
          onSearch={onSearch}
          alertCount={alertCount}
          notificationCount={notificationCount}
          onBellClick={() => {
            onBellClick();
            if (window.innerWidth <= 768) {
              setMobileMenuOpen(false);
            }
          }}
        />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
