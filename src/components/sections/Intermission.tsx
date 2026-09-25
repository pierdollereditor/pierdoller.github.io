import FeedbackLoop from "./FeedbackLoop";

export default function Intermission() {
  return (
    <section id="intermission" className="intermission-section">
      <div className="results-heading">
        <div className="results-kicker"><i /> Field results / vidIQ verified</div>
        <h2>Cuts that <span>multiply.</span></h2>
        <p>High-view releases, retention-led editing and measurable reach.</p>
      </div>

      <FeedbackLoop />
    </section>
  );
}
