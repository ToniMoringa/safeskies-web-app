import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bell,
  Smartphone,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import styles from './Sidebar.module.css';

function Sidebar({
  onNavigate,
  onGetApp,
  onHelp,
  activeView,
  mobileOpen,
  setMobileOpen,
  onToggleAlerts,
  showAlertsPanel,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: showAlertsPanel ? Eye : EyeOff,
      isToggle: true,
    },
    { id: 'getapp', label: 'Get App', icon: Smartphone, isButton: true },
    { id: 'help', label: 'Help', icon: HelpCircle, isButton: true },
  ];

  const handleItemClick = (item) => {
    if (item.isButton) {
      if (item.id === 'getapp') onGetApp();
      if (item.id === 'help') onHelp();
    } else if (item.isToggle) {
      if (onToggleAlerts) onToggleAlerts();
    } else {
      onNavigate(item.id);
    }
    // Close mobile menu on clicking
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className={styles.hamburgerButton}
        onClick={() => setMobileOpen && setMobileOpen(true)}
      >
        ☰
      </button>

      <div
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}
      >
        {/* Close button on mobile */}
        {mobileOpen && (
          <button
            className={styles.closeButton}
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        )}

        <div className={styles.logo}>
          <div className={styles.logoIcon}>SS</div>
          {!isCollapsed && <span className={styles.logoText}>SafeSkies</span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.collapseButton}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
