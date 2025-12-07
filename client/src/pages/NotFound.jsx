import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const handleGoHome = () => {
    if (userType === 'admin') {
      navigate('/admin/dashboard');
    } else if (userType === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (userType === 'user') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)',
      direction: 'rtl'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ 
          fontSize: '120px', 
          color: '#4B0082', 
          marginBottom: 0,
          fontWeight: 'bold'
        }}>
          404
        </h1>
        <h2 style={{ 
          color: '#6B46C1', 
          marginBottom: '20px',
          fontSize: '32px'
        }}>
          الصفحة غير موجودة
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '18px'
        }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </p>
        <button 
          onClick={handleGoHome}
          style={{
            background: '#4B0082',
            color: 'white',
            border: 'none',
            padding: '12px 40px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#6B46C1'}
          onMouseOut={(e) => e.target.style.background = '#4B0082'}
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}