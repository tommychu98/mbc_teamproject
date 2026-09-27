import './DiptyqueHistory.css';
import HistoryFabric from './HistoryFabric';
import HistoryObjects from './HistoryObjects';
import HistoryCollectTransform from './HistoryCollectTransform';
import HistoryScent from './HistoryScent';
import HistoryMaison from './HistoryMaison';

export default function DiptyqueHistory() {
  return (
    <main className="diptyque-history" aria-labelledby="history-opening-title">
      <section className="diptyque-history__opening">
        <h1 id="history-opening-title" className="diptyque-history__title">
          BEFORE SCENT, THERE WAS CREATION.
        </h1>
      </section>
      <HistoryFabric />
      <HistoryObjects />
      <HistoryCollectTransform />
      <HistoryScent />
      <HistoryMaison />
    </main>
  );
}
