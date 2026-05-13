import React, { useState, useEffect } from 'react';
import { Search, Clock, Wifi, CloudLightning, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import useDebounce from '../../hooks/useDebounce';
import styles from './Header.module.css';

function Header({ onSearch, alertCount, notificationCount, onBellClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.statusPills}>
        <div className={`${styles.pill} ${styles.pillCritical}`}>
          <span className={styles.pulse}></span>
          DEFCON 3
        </div>
        <div className={`${styles.pill} ${styles.pillWarning}`}>
          <CloudLightning size={12} />
          Storm Advisory
        </div>
        <div className={`${styles.pill} ${styles.pillSuccess}`}>
          <Wifi size={12} />
          LIVE
        </div>
      </div>

      <div className={styles.rightSection}>
        <button onClick={onBellClick} className={styles.bellButton}>
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className={styles.badge}>{notificationCount}</span>
          )}
        </button>
        <ThemeToggle />
        <div className={styles.timeDisplay}>
          <Clock size={14} />
          <span>{formatTime(currentTime)} UTC</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
