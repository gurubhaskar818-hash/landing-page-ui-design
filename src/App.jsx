import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

const featureData = [
  { title: 'Fast setup', description: 'Ship your landing page in minutes with reusable sections.' },
  { title: 'Responsive by default', description: 'Optimized for desktop, tablet, and mobile breakpoints.' },
  { title: 'Conversion focused', description: 'CTA-first content blocks to guide users toward action.' },
];

export default function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="page">
      <Navbar />
      <Hero />
      <Features items={featureData} />
      <CtaSection
        email={email}
        setEmail={setEmail}
        onSubmit={handleSubscribe}
        subscribed={subscribed}
      />
      <Footer />
    </div>
  );
}
