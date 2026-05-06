import { useParams } from 'react-router';

export function ReportBuilderTest() {
  const { reportId } = useParams<{ reportId: string }>();
  
  return (
    <div style={{ padding: '40px', background: 'white', color: 'black' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🚀 REPORT BUILDER TEST PAGE 🚀
      </h1>
      <p style={{ fontSize: '18px' }}>Report ID from params: <strong>{reportId || 'NO ID'}</strong></p>
      <p style={{ marginTop: '20px', color: 'green' }}>
        ✅ If you see this, the route is working!
      </p>
    </div>
  );
}
