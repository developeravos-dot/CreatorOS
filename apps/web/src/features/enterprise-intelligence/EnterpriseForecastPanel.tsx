import type {
  IntelligenceForecast,
} from "./enterprise-intelligence-types";

interface EnterpriseForecastPanelProps {
  forecasts: IntelligenceForecast[];
}

export default function EnterpriseForecastPanel({
  forecasts,
}: EnterpriseForecastPanelProps) {
  return (
    <article className="enterprise-intelligence-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            PREDICTIVE INTELLIGENCE
          </span>

          <h3>
            Operational forecasts
          </h3>
        </div>
      </header>

      <div className="enterprise-intelligence-forecasts">
        {forecasts.map((forecast) => {
          const difference =
            forecast.predictedValue -
            forecast.currentValue;

          return (
            <section key={forecast.id}>
              <header>
                <strong>
                  {forecast.label}
                </strong>

                <span>
                  {forecast.confidence}%
                  confidence
                </span>
              </header>

              <div className="enterprise-intelligence-forecast__values">
                <div>
                  <small>Current</small>
                  <strong>
                    {forecast.currentValue}
                  </strong>
                </div>

                <span>→</span>

                <div>
                  <small>Projected</small>
                  <strong>
                    {forecast.predictedValue}
                  </strong>
                </div>
              </div>

              <p>
                {forecast.explanation}
              </p>

              <footer>
                Expected change:
                <strong>
                  {difference >= 0
                    ? ` +${difference}`
                    : ` ${difference}`}
                </strong>
              </footer>
            </section>
          );
        })}
      </div>
    </article>
  );
}
