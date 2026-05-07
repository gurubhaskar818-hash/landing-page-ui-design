export default function CtaSection({ email, setEmail, onSubmit, subscribed }) {
  return (
    <section id="pricing" className="cta container">
      <h2>Start collecting leads today</h2>
      <form onSubmit={onSubmit} className="cta-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button className="btn" type="submit">Subscribe</button>
      </form>
      {subscribed && <p className="success">Thanks! You are subscribed.</p>}
    </section>
  );
}
