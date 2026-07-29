'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/services/suminiaApi';
import styles from './login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('superuser@example.com');
  const [password, setPassword] = useState('S3crEtP4ssw0rd!');
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      // Login exitoso, redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const errorMessage = error?.data?.message || error?.message || null;

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Suminia Login</h1>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

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

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Logging in...' : 'Login'}
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
