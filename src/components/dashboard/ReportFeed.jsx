import React from 'react';
import Badge from '../ui/Badge';
import { Activity, CheckCircle2 } from 'lucide-react';
import styles from './ReportFeed.module.css';

function ReportFeed({ reports }) {
  if (reports.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Activity size={32} />
        <p>No recent reports.</p>
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

  const getTypeLabel = (type) => {
    return type?.replace('_', ' ').toUpperCase() || 'REPORT';
  };

  return (
    <div className={styles.reportFeed}>
      <h2 className={styles.title}>Crowd Reports Feed</h2>
      {reports.map((report) => (
        <div key={report.id} className={styles.reportItem}>
          <div className={styles.reportHeader}>
            <Badge severity="default">{getTypeLabel(report.type)}</Badge>
            {report.verified && (
              <span className={styles.verified}>
                <CheckCircle2 size={12} />
                Verified
              </span>
            )}
          </div>
          <div className={styles.reportMessage}>
            {report.message || 'No message provided'}
          </div>
          <div className={styles.reportFooter}>
            <span className={styles.location}>
              {report.lat?.toFixed(4)}, {report.lon?.toFixed(4)}
            </span>
            <span className={styles.timestamp}>
              {formatTimestamp(report.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReportFeed;
