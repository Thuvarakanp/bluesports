function CategoryCard({ icon, title, description, onClick }) {
  return (
    <div className="category-card animate-in" onClick={onClick}>
      <div className="card-glow"></div>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="card-arrow">→</span>
    </div>
  );
}

export default CategoryCard;
