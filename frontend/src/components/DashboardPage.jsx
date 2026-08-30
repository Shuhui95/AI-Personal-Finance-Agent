import SummaryCards from "./SummaryCards";
import CategoryBreakdown from "./CategoryBreakdown";

import "./DashboardPage.css";


function DashboardPage({
  selectedMonth,
  onMonthChange,
  expenses,
  monthlyTotal,
  categorySummary,
  loading,
  error,
  onRetry,
}) {
  const expenseCount = expenses.length;

  const averageExpense =
    expenseCount === 0
      ? 0
      : Number(monthlyTotal) / expenseCount;


  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>

          <p>
            Track your monthly spending and
            understand where your money goes.
          </p>
        </div>

        <div className="dashboard-month-picker">
          <span>▣</span>

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) =>
              onMonthChange(event.target.value)
            }
          />
        </div>
      </div>

      {error ? (
        <div className="dashboard-error">
          <strong>
            Unable to load finance data
          </strong>

          <p>{error}</p>

          <button onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <SummaryCards
            monthlyTotal={monthlyTotal}
            expenseCount={expenseCount}
            averageExpense={averageExpense}
            loading={loading}
          />

          <div className="dashboard-grid">
          <CategoryBreakdown
            categoryTotals={categorySummary}
        />

            <div className="dashboard-info-card">
              <h3>Monthly Snapshot</h3>

              <div className="snapshot-row">
                <span>
                  Selected month
                </span>

                <strong>
                  {selectedMonth}
                </strong>
              </div>

              <div className="snapshot-row">
                <span>
                  Transactions
                </span>

                <strong>
                  {expenseCount}
                </strong>
              </div>

              <div className="snapshot-row">
                <span>
                  Categories
                </span>

                <strong>
                  {
                    Object.keys(
                      categorySummary
                    ).length
                  }
                </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;