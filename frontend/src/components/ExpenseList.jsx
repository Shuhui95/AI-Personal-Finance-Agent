import { formatCurrency } from "../utils/formatters";
import "./ExpenseList.css";

function ExpenseList({
  expenses,
  totalExpenseCount,
  onEditExpense,
  onDeleteExpense,
}) {
  if (expenses.length === 0) {
    return (
      <section className="expense-list-section">
        <h2>Expenses</h2>

        <p className="empty-expense-message">
          {totalExpenseCount === 0
            ? "No expenses found for this month."
            : "No expenses match the current filters."}
        </p>
      </section>
    );
  }

  return (
    <section className="expense-list-section">
      <div className="expense-list-header">
        <h2>Expenses</h2>

        <span className="expense-count-badge">
          {expenses.length}{" "}
          {expenses.length === 1
            ? "record"
            : "records"}
        </span>
      </div>

      <div className="expense-table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.expenseDate}</td>

                <td>
                  <span className="category-badge">
                    {expense.category}
                  </span>
                </td>

                <td>{expense.description || "-"}</td>
                <td>{expense.paymentMethod || "-"}</td>

                <td className="expense-amount">
                  {formatCurrency(expense.amount)}
                </td>

                <td>
                  <div className="expense-actions">
                    <button
                      className="edit-expense-button"
                      type="button"
                      onClick={() =>
                        onEditExpense(expense)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-expense-button"
                      type="button"
                      onClick={() =>
                        onDeleteExpense(expense.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ExpenseList;