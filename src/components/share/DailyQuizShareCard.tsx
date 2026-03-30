import React from 'react';
import { DailyQuizShareData } from '../../types/share';

interface DailyQuizShareCardProps {
  data: DailyQuizShareData;
}

const DailyQuizShareCard: React.FC<DailyQuizShareCardProps> = ({ data }) => {
  const { userName, percentage, correct, total, readiness, generatedAt } = data;

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        backgroundColor: '#f5f5dc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '300px',
          height: '300px',
          border: '40px solid #000',
          borderRadius: '50%',
          opacity: 0.1,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: '80px' }}>
        <img
          src="/ikuttes.png"
          alt="Ikuttes"
          style={{ height: '120px', marginBottom: '20px' }}
        />
        <div style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hasil Latihan
        </div>
      </div>

      {/* User info */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
          {userName}
        </div>
        <div style={{ fontSize: '24px', color: '#666' }}>
          {new Date(generatedAt).toLocaleDateString('id-ID')}
        </div>
      </div>

      {/* Main score */}
      <div
        style={{
          backgroundColor: '#000',
          color: '#f5f5dc',
          padding: '60px',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '60px',
        }}
      >
        <div style={{ fontSize: '200px', fontWeight: '900', lineHeight: 1, marginBottom: '20px' }}>
          {percentage}%
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          {correct} dari {total} benar
        </div>
      </div>

      {/* Readiness level */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Tingkat Kesiapan</div>
        <div
          style={{
            backgroundColor: '#fff',
            border: '4px solid #000',
            padding: '30px',
            borderRadius: '16px',
            textAlign: 'center',
            fontSize: '48px',
            fontWeight: '900',
            textTransform: 'uppercase',
          }}
        >
          {readiness}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>ikuttes.my.id</div>
        <div style={{ fontSize: '24px', color: '#666' }}>
          Baru saja mempersiapkan diri untuk lolos tes CPNS! Di https://ikuttes.my.id
        </div>
      </div>
    </div>
  );
};

export default DailyQuizShareCard;
