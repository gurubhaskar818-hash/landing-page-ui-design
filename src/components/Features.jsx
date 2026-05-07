export default function Features({ items }) {
  return (
    <section id="features" className="features container">
      {items.map((item) => (
        <article key={item.title} className="feature-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}
