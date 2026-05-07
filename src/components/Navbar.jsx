export default function Navbar() {
  return (
    <header className="navbar container">
      <div className="brand">BrandName</div>
      <nav>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="btn btn-outline">Sign In</button>
    </header>
  );
}
