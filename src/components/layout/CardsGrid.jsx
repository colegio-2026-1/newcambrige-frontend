import "./CardsGrid.css";

const CardsGrid = ({ cards, roles, onCardClick, loading = false }) => {
  if (loading) {
    return (
      <div className="status-message status-message--loading">
        Verificando credenciales institucionales...
      </div>
    );
  }

  const filteredCards = cards.filter(
    (card) =>
      card &&
      Array.isArray(card.roles) &&
      card.roles.length > 0 &&
      roles.some((rol) => card.roles.includes(rol))
  );

  if (filteredCards.length === 0) {
    return (
      <div className="status-message status-message--empty">
        Tu usuario no tiene módulos asignados.
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {filteredCards.map((card) => (
        <div
          className="dashboard-card"
          key={card.title}
          onClick={() => onCardClick(card.path)}
        >
          <h2>{card.title}</h2>
          <div className="card-icon">
            <img src={card.icon} alt={card.title} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardsGrid;