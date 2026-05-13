import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { ShieldAlert } from 'lucide-react';
import styles from './AlertList.module.css';

function AlertList({ alerts, onRespond, onResolve }) {
  if (alerts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ShieldAlert size={32} />
        <p>No active alerts. All clear.</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);

    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 minute ago';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 120) return '1 hour ago';
    return `${Math.floor(diff / 60)} hours ago`;
  };

  return (
    <div className={styles.alertList}>
      <h2 className={styles.title}>Active Alerts</h2>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${styles.alertItem} ${styles[alert.severity?.toLowerCase()]}`}
        >
          <div className={styles.alertHeader}>
            <Badge severity={alert.severity?.toLowerCase() || 'low'}>
              {alert.severity || 'LOW'}
            </Badge>
            {alert.source && (
              <span className={styles.alertId}>{alert.source}</span>
            )}
          </div>
          <div className={styles.alertMessage}>
            {alert.message_en || alert.message}
          </div>
          <div className={styles.alertFooter}>
            <span className={styles.timestamp}>
              {formatTimestamp(alert.created_at)}
            </span>
            <div className={styles.alertActions}>
              <Button variant="secondary" onClick={() => onRespond(alert.id)} size="small">
                Respond
              </Button>
              <Button variant="danger" onClick={() => onResolve(alert.id)} size="small">
                Resolve
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertList;