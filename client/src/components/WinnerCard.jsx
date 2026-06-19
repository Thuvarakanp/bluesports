import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

function WinnerCard({ position, name }) {
  const config = {
    gold: { icon: <FaTrophy />, label: '1st Place', accentText: 'Champion' },
    silver: { icon: <FaMedal />, label: '2nd Place', accentText: 'Runner-Up' },
    bronze: { icon: <FaAward />, label: '3rd Place', accentText: 'Finalist' }
  };

  const { icon, label, accentText } = config[position];

  return (
    <div className={`winner-card ${position} animate-in`}>
      <div className="winner-rank-pill">{accentText}</div>
      <div className={`winner-medal ${position}`}>{icon}</div>
      <div className="winner-info">
        <h3>{name || 'Not Announced'}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default WinnerCard;
