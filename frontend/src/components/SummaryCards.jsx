import { formatCurrency } from "../utils/formatters";
import "./SummaryCards.css";

function SummaryCards({
  monthlyTotal,
  expenseCount,
  averageExpense,
}) {
  return (
    <section className="summary-grid">
      <article className="summary-card total-card">
        <p className="summary-card-label">
          Monthly Total
        </p>

        <p className="summary-card-value">
          {formatCurrency(monthlyTotal)}
        </p>
      </article>

      <article className="summary-card">
        <p className="summary-card-label">
          Expense Count
        </p>

        <p className="summary-card-value">
          {expenseCount}
        </p>
      </article>

      <article className="summary-card">
        <p className="summary-card-label">
          Average Expense
        </p>

        <p className="summary-card-value">
          {formatCurrency(averageExpense)}
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;