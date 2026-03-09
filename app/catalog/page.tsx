'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlipBook from '../components/FlipBook';
import { catalogPages, catalogConfig } from '../data/catalog';
import styles from './page.module.css';

export default function CatalogPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSent(true);
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch {
      // Handle error
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <main className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2>Email Sent Successfully!</h2>
          <p>Redirecting to homepage...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{catalogConfig.title}</h1>
        <p className={styles.subtitle}>{catalogConfig.subtitle}</p>
        <p className={styles.description}>{catalogConfig.description}</p>
      </header>

      <section className={styles.flipbookSection}>
        <FlipBook 
          pages={catalogPages}
          width={800}
          height={600}
        />
      </section>

      <section className={styles.emailSection}>
        <p className={styles.emailLabel}>Send catalog info to your email:</p>
        <div className={styles.emailForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={styles.emailInput}
          />
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className={styles.sendButton}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 Elite Affairs - All rights reserved</p>
      </footer>
    </main>
  );
}
