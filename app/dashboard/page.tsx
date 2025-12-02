'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
 
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  role?: string;
  phone?: string;
  cnic?: string;
  grade?: string;
 }

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();  

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  const copyToClipboard = async (value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      // small visual feedback could be added here
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="errorContainer">
        <div className="errorCard">
          <h1 className="errorTitle">Error</h1>
          <p className="errorText">{error || 'Failed to load user data'}</p>
          <button onClick={() => router.push('/login')} className="primaryButton">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pageWrap">
      <div className="card">
        <div className="cardHeader">
          <div className="userTop">
            <img
              src={user.avatar || '/images/user-avatar.png'}
              alt={`${user.first_name} ${user.last_name}`}
              className="avatar"
            />
            <div className="titleWrap">
              <h2 className="userName">
                {user.first_name} {user.last_name}
              </h2>
              <p className="userRole">{user.role || 'Approver'}</p>
              <div className="headerActions">
                <button
                  className="ghostButton"
                  onClick={() => {
                    const mailto = `mailto:${user.email}`;
                    window.location.href = mailto;
                  }}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="sectionTitle">Contact Information</h3>

        <div className="grid">
          <div className="infoCard">
            <div className="infoIcon">👤</div>
            <div>
              <div className="infoLabel">First Name</div>
              <div className="infoValue">{user.first_name}</div>
            </div>
          </div>

          <div className="infoCard">
            <div className="infoIcon">👥</div>
            <div>
              <div className="infoLabel">Last Name</div>
              <div className="infoValue">{user.last_name}</div>
            </div>
          </div>

          <div className="infoCard">
            <div className="infoIcon">✉️</div>
            <div>
              <div className="infoLabel">Email</div>
              <div className="infoValue">{user.email}</div>
            </div>
          </div>

          
        </div>

        <div className="cardFooter">
          <button onClick={handleLogout} className="primaryButton">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

