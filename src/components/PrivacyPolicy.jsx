import { useState } from 'react';

export default function PrivacyPolicy({ onClose }) {
  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={e => e.stopPropagation()} style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.title}>Privacy Policy</div>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.body}>
          <p style={styles.updated}>Last updated: May 2026</p>

          <Section title="Overview">
            Raging Flag-It ("we", "us", or "our") operates the website ragingflagit.vercel.app.
            This page informs you of our policies regarding the collection, use, and disclosure
            of personal data when you use our service.
          </Section>

          <Section title="Data We Collect">
            We do not require you to create an account or provide any personal information to
            use Raging Flag-It. The only data we collect is anonymous usage data through
            Google Analytics, which includes pages visited, time spent on site, device type,
            and general geographic location (country level). No personally identifiable
            information is collected.
          </Section>

          <Section title="Google AdSense & Advertising">
            We use Google AdSense to display advertisements on our site. Google AdSense may
            use cookies and web beacons to serve ads based on your prior visits to our website
            or other websites. Google's use of advertising cookies enables it and its partners
            to serve ads based on your visit to our site. You may opt out of personalized
            advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={styles.link}>Google Ad Settings</a>.
          </Section>

          <Section title="Google Analytics">
            We use Google Analytics to monitor and analyze web traffic. Google Analytics
            collects information such as how often users visit the site, what pages they
            visit, and what other sites they used prior to coming to our site. We use this
            information to improve our site. Google Analytics collects only the IP address
            assigned to you on the date you visit, not your name or other identifying
            information. For more information on how Google uses your data, visit{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={styles.link}>Google's Privacy Policy</a>.
          </Section>

          <Section title="Payments">
            All payments are processed securely through Stripe. We do not store or have
            access to your credit card information. Stripe's privacy policy can be found
            at <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" style={styles.link}>stripe.com/privacy</a>.
          </Section>

          <Section title="Game Data">
            When you interact with Raging Flag-It, we store anonymous game data including
            which flags have been claimed and how many times. This data is stored in our
            database provided by Supabase and is not linked to any personal identity.
          </Section>

          <Section title="Cookies">
            We use cookies for Google Analytics and Google AdSense. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being sent.
            However, if you do not accept cookies, some portions of our site may not
            function properly.
          </Section>

          <Section title="Children's Privacy">
            Our service is not directed to anyone under the age of 13. We do not knowingly
            collect personally identifiable information from children under 13.
          </Section>

          <Section title="Changes to This Policy">
            We may update our Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page. Changes are effective
            immediately upon posting.
          </Section>

          <Section title="Contact Us">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@ragingflagit.com" style={styles.link}>privacy@ragingflagit.com</a>.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, color: '#c9a84c', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: '#908070', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 150,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modal: {
    background: '#0e0e0b',
    border: '1px solid rgba(201,168,76,0.22)',
    borderRadius: 10,
    width: 'min(600px, 96vw)',
    maxHeight: '85vh',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 22px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  title:    { fontSize: 18, color: '#f0e8d8' },
  closeBtn: { background: 'none', border: 'none', color: '#5a5040', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 },
  body:     { overflowY: 'auto', padding: '20px 22px 28px', flex: 1 },
  updated:  { fontSize: 11, color: '#5a5040', fontFamily: 'monospace', marginBottom: 24 },
  link:     { color: '#c9a84c', textDecoration: 'none' },
};