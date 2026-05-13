import React from 'react';
import { AlertTriangle, Activity, Bell } from 'lucide-react';
import styles from './StatsCards.module.css';

function StatsCards({ alerts, reports }) {
  const activeAlerts = alerts.filter((a) => a.status === 'active').length;
  const highestSeverity = alerts.some((a) => a.severity === 'CRITICAL')
    ? 'CRITICAL'
    : alerts.some((a) => a.severity === 'HIGH')
      ? 'HIGH'
      : 'LOW';

  const getSeverityColor = () => {
    if (highestSeverity === 'CRITICAL') return 'var(--critical)';
    if (highestSeverity === 'HIGH') return 'var(--high)';
    return 'var(--low)';
  };

  const stats = [
    {
      title: 'Active Alerts',
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'var(--critical)',
      trend: activeAlerts > 0 ? '+ active' : 'none',
    },
    {
      title: 'Highest Severity',
      value: highestSeverity,
      icon: Activity,
      color: getSeverityColor(),
      trend: 'current',
    },
    {
      title: 'Crowd Reports',
      value: reports.length,
      icon: Bell,
      color: 'var(--accent)',
      trend: reports.length > 0 ? 'new' : 'none',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statHeader}>
            <stat.icon size={20} style={{ color: stat.color }} />
            <h3 className={styles.statTitle}>{stat.title}</h3>
          </div>
          <div className={styles.statValue} style={{ color: stat.color }}>
            {stat.value}
          </div>
          {stat.trend !== 'none' && (
            <div className={styles.statTrend}>{stat.trend}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
