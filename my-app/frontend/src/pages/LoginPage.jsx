import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { supabaseLogin } from '../services/api';
import { InlineError } from '../components/Common/LoadingSpinner';
import { useScrollReveal } from '../AnimationUtils';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Check if user is already logged into Django
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (token) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  // 2. Check for Supabase session after redirect
  useEffect(() => {
    const handleAuthRedirect = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session && session.provider_token) {
          // We got a successful redirect from Google via Supabase
          const res = await supabaseLogin({
            access_token: session.access_token,
            provider_token: session.provider_token,
            email: session.user.email
          });
          
          if (res.data.access) {
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            
            const finalName = res.data.user?.name || session.user.user_metadata?.full_name || '';
            const finalEmail = res.data.user?.email || session.user.email || '';
            if (finalName) localStorage.setItem('admin_name', finalName);
            if (finalEmail) localStorage.setItem('admin_email', finalEmail);
            
            if (res.data.role === 'admin') {
              localStorage.setItem('is_admin', 'true');
              navigate('/admin');
            } else {
              localStorage.setItem('is_admin', 'false');
              navigate('/my-bookings');
            }
          }
        }
      } catch (err) {
        console.error(err);
        // Supabase might throw errors during hash parsing, check if it's a real login attempt error
        if (window.location.hash.includes('error=')) {
           setError('Google login failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    handleAuthRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleAuthRedirect();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to initialize Google Login.');
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', paddingTop: 'var(--navbar-height)' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 'var(--space-6)' }}>
        <div className="card card-body reveal" style={{ padding: 'var(--space-10)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', margin: '0 auto var(--space-4)' }}>LRC</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>Welcome Back</h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>Leema Raj Cottage Stay</p>
          </div>

          {error && <InlineError message={error} />}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
            <button 
              className="btn btn-outline w-full" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
            >
              <FcGoogle size={22} />
              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
