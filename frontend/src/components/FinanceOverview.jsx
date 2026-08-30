import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
  } from "recharts";
  
  import {
    formatCurrency,
    formatDate,
  } from "../utils/formatters";
  
  import "./FinanceOverview.css";
  
  
  const CHART_COLORS = [
    "#6C63F2",
    "#63A9F2",
    "#62C7A0",
    "#F4BE4F",
    "#ED7A8B",
    "#A6A6C8",
  ];
  
  
  function getTransactionIcon(category = "") {
    const value = category.toLowerCase();
  
    if (value.includes("food")) {
      return "🍴";
    }
  
    if (value.includes("transport")) {
      return "🚕";
    }
  
    if (value.includes("shopping")) {
      return "🛍";
    }
  
    if (value.includes("grocery")) {
      return "🛒";
    }
  
    if (value.includes("entertainment")) {
      return "🎬";
    }
  
    return "💳";
  }
  
  
  function FinanceOverview({
    selectedMonth,
    onMonthChange,
    monthlyTotal,
    categoryData,
    expenses,
    loading,
  }) {
    const categoryTotal = categoryData.reduce(
      (sum, category) =>
        sum + Number(category.value),
      0
    );
  
    const sortedCategories = [...categoryData]
      .sort(
        (a, b) =>
          Number(b.value) -
          Number(a.value)
      )
      .slice(0, 6);
  
    const recentExpenses = [...expenses]
      .sort(
        (a, b) =>
          new Date(b.expenseDate) -
          new Date(a.expenseDate)
      )
      .slice(0, 5);
  
  
    return (
      <aside className="finance-overview">
        <div className="month-control">
          <span>▣</span>
  
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) =>
              onMonthChange(event.target.value)
            }
          />
        </div>
  
        <section className="overview-card monthly-card">
          <div className="card-heading">
            <div>
              <h3>
                Monthly Overview
              </h3>
  
              <p>
                {selectedMonth}
              </p>
            </div>
          </div>
  
          {loading ? (
            <div className="overview-loading">
              Loading...
            </div>
          ) : (
            <div className="monthly-content">
              <div>
                <span className="overview-label">
                  Total spent
                </span>
  
                <strong className="monthly-amount">
                  {formatCurrency(
                    monthlyTotal
                  )}
                </strong>
  
                <span className="transaction-count">
                  {expenses.length} transactions
                </span>
              </div>
  
              <div className="mini-chart">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={27}
                        outerRadius={42}
                        strokeWidth={0}
                      >
                        {categoryData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                CHART_COLORS[
                                  index %
                                    CHART_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">
                    —
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
  
        <section className="overview-card category-card">
          <div className="card-heading">
            <div>
              <h3>
                Top Categories
              </h3>
            </div>
  
            <button>
              View all
            </button>
          </div>
  
          {sortedCategories.length === 0 ? (
            <p className="overview-empty">
              No spending data for this month.
            </p>
          ) : (
            <div className="category-list">
              {sortedCategories.map(
                (category, index) => {
                  const percentage =
                    categoryTotal === 0
                      ? 0
                      : (
                          (Number(
                            category.value
                          ) /
                            categoryTotal) *
                          100
                        ).toFixed(1);
  
                  return (
                    <div
                      className="category-row"
                      key={category.name}
                    >
                      <div
                        className="category-icon"
                        style={{
                          background:
                            `${CHART_COLORS[
                              index %
                                CHART_COLORS.length
                            ]}18`,
                        }}
                      >
                        {getTransactionIcon(
                          category.name
                        )}
                      </div>
  
                      <div className="category-details">
                        <div className="category-top-row">
                          <strong>
                            {category.name}
                          </strong>
  
                          <span>
                            {percentage}%
                          </span>
  
                          <b>
                            {formatCurrency(
                              category.value
                            )}
                          </b>
                        </div>
  
                        <div className="category-progress">
                          <div
                            style={{
                              width:
                                `${percentage}%`,
                              background:
                                CHART_COLORS[
                                  index %
                                    CHART_COLORS.length
                                ],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
  
        <section className="overview-card recent-transactions-card">
          <div className="card-heading">
            <div>
              <h3>
                Recent Transactions
              </h3>
            </div>
  
            <button>
              View all
            </button>
          </div>
  
          {recentExpenses.length === 0 ? (
            <p className="overview-empty">
              No transactions available.
            </p>
          ) : (
            <div className="recent-transactions-list">
              {recentExpenses.map(
                (expense) => (
                  <div
                    className="transaction-row"
                    key={expense.id}
                  >
                    <div className="transaction-icon">
                      {getTransactionIcon(
                        expense.category
                      )}
                    </div>
  
                    <div className="transaction-main">
                      <strong>
                        {expense.description ||
                          expense.category}
                      </strong>
  
                      <span>
                        {expense.category}
                      </span>
                    </div>
  
                    <div className="transaction-value">
                      <strong>
                        {formatCurrency(
                          expense.amount
                        )}
                      </strong>
  
                      <span>
                        {formatDate(
                          expense.expenseDate
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </aside>
    );
  }
  
  export default FinanceOverview;