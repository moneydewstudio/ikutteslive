import React from 'react';
import { DailyQuizShareData } from '../../types/share';
import { RESULT_STYLES } from '../../constants/resultStyles';

interface DailyQuizShareCardProps {
  data: DailyQuizShareData;
}

const DailyQuizShareCard: React.FC<DailyQuizShareCardProps> = ({ data }) => {
  const { percentage, correct, total, generatedAt } = data;

  // Format date as short day label (e.g., "30 Mar 2026")
  const dayLabel = new Date(generatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        backgroundColor: RESULT_STYLES.bgColor,
        fontFamily: RESULT_STYLES.fontFamily,
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 80px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ paddingTop: '80px' }}>
        <img
          src="/ikuttes.png"
          alt="Ikuttes"
          style={{ height: '160px', maxWidth: '160px' }}
        />
      </div>

      {/* Spacer to push hero to vertical center */}
      <div style={{ flex: 1 }} />

      {/* Hero: label + percent + description */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
        {/* Label: HASIL SESI */}
        <div style={RESULT_STYLES.label}>
          Hasil Sesi
        </div>

        {/* Big percent */}
        <div style={{ ...RESULT_STYLES.bigPercent, marginTop: '16px' }}>
          {percentage}%
        </div>

        {/* Description */}
        <div
          style={{
            ...RESULT_STYLES.description,
            marginTop: '24px',
            maxWidth: '80%',
          }}
        >
          Anda menjawab {correct} dari {total} dengan benar.
        </div>
      </div>

      {/* Spacer to push date to bottom */}
      <div style={{ flex: 1 }} />

      {/* Date line */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          opacity: 0.6,
          paddingBottom: '80px',
          textAlign: 'center',
        }}
      >
        {dayLabel}
      </div>
    </div>
  );
};

export default DailyQuizShareCard;
