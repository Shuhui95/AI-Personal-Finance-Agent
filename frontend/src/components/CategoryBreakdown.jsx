import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "../utils/formatters";
import "./CategoryBreakdown.css";

function CategoryBreakdown({ categoryTotals }) {
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount: Number(amount),
    }))
    .filter((item) => Number.isFinite(item.amount))
    .sort((first, second) => second.amount - first.amount);

  if (chartData.length === 0) {
    return (
      <section className="category-section">
        <h2>Category Breakdown</h2>

        <p className="empty-category-message">
          No category data available for this month.
        </p>
      </section>
    );
  }

  const chartHeight = Math.max(
    260,
    chartData.length * 58
  );

  return (
    <section className="category-section">
      <div className="category-section-header">
        <div>
          <h2>Category Breakdown</h2>

          <p>
            Compare spending across categories.
          </p>
        </div>
      </div>

      <div
        className="category-chart-container"
        style={{ height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              bottom: 10,
              left: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              tickFormatter={(value) =>
                formatCurrency(value)
              }
            />

            <YAxis
              type="category"
              dataKey="category"
              width={100}
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(value),
                "Amount",
              ]}
              cursor={{
                fill: "rgba(37, 99, 235, 0.06)",
              }}
            />

            <Bar
              dataKey="amount"
              fill="#2563eb"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default CategoryBreakdown;