'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('superuser@example.com');
  const [password, setPassword] = useState('S3crEtP4ssw0rd!');
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Suminia Login</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.testAccounts}>
          <h3>Test Accounts:</h3>
          <p>
            <strong>Superuser:</strong> superuser@example.com / S3crEtP4ssw0rd!
          </p>
          <p>
            <strong>Admin:</strong> admin@example.com / S3crEtP4ssw0rd!
          </p>
          <p>
            <strong>User:</strong> user@example.com / S3crEtP4ssw0rd!
          </p>
        </div>
      </div>
    </div>
  );
}
