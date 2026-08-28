import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "./api/axios";
import AddExpenseForm from "./components/AddExpenseForm";
import CategoryBreakdown from "./components/CategoryBreakdown";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import Notification from "./components/Notification";
import SummaryCards from "./components/SummaryCards";
import "./App.css";

function getCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const month = String(
    currentDate.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonth()
  );

  const [expenses, setExpenses] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortOption, setSortOption] =
    useState("date-desc");

  const [notification, setNotification] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData(selectedMonth);
  }, [selectedMonth]);

  async function fetchDashboardData(monthValue) {
    if (!monthValue) {
      return;
    }

    const [year, month] = monthValue
      .split("-")
      .map(Number);

    try {
      setLoading(true);
      setError("");

      const [
        expensesResponse,
        monthlyTotalResponse,
        categoryResponse,
      ] = await Promise.all([
        api.get("/expenses/month", {
          params: {
            year,
            month,
          },
        }),

        api.get("/expenses/summary/monthly", {
          params: {
            year,
            month,
          },
        }),

        api.get("/expenses/summary/categories", {
          params: {
            year,
            month,
          },
        }),
      ]);

      setExpenses(expensesResponse.data ?? []);

      setMonthlyTotal(
        Number(
          monthlyTotalResponse.data?.total ?? 0
        )
      );

      setCategoryTotals(
        categoryResponse.data ?? {}
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load dashboard data. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function showNotification(
    message,
    type = "success"
  ) {
    setNotification({
      message,
      type,
    });
  }

  function closeNotification() {
    setNotification(null);
  }

  function handleMonthChange(event) {
    const newMonth = event.target.value;

    if (!newMonth) {
      return;
    }

    setSelectedMonth(newMonth);
    setEditingExpense(null);
    resetFilters();
  }

  async function refreshDashboard() {
    await fetchDashboardData(selectedMonth);
  }

  async function handleExpenseAdded() {
    await refreshDashboard();

    showNotification(
      "Expense added successfully."
    );
  }

  function handleStartEdit(expense) {
    setEditingExpense(expense);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleExpenseUpdated() {
    setEditingExpense(null);
    await refreshDashboard();

    showNotification(
      "Expense updated successfully."
    );
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  async function handleDeleteExpense(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/expenses/${id}`);

      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }

      await refreshDashboard();

      showNotification(
        "Expense deleted successfully."
      );
    } catch (err) {
      console.error(err);

      showNotification(
        "Failed to delete expense.",
        "error"
      );
    }
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  function handleSortChange(event) {
    setSortOption(event.target.value);
  }

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOption("date-desc");
  }

  const categories = useMemo(() => {
    const categoryNames = expenses
      .map((expense) => expense.category)
      .filter(Boolean);

    return [
      ...new Set(categoryNames),
    ].sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    let result = expenses.filter((expense) => {
      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      const searchableText = [
        expense.category,
        expense.description,
        expense.paymentMethod,
        expense.expenseDate,
        expense.amount,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearchTerm === "" ||
        searchableText.includes(
          normalizedSearchTerm
        );

      return matchesCategory && matchesSearch;
    });

    result = [...result];

    switch (sortOption) {
      case "date-asc":
        result.sort(
          (first, second) =>
            new Date(first.expenseDate) -
            new Date(second.expenseDate)
        );
        break;

      case "amount-desc":
        result.sort(
          (first, second) =>
            Number(second.amount) -
            Number(first.amount)
        );
        break;

      case "amount-asc":
        result.sort(
          (first, second) =>
            Number(first.amount) -
            Number(second.amount)
        );
        break;

      case "category-asc":
        result.sort((first, second) =>
          first.category.localeCompare(
            second.category
          )
        );
        break;

      case "date-desc":
      default:
        result.sort(
          (first, second) =>
            new Date(second.expenseDate) -
            new Date(first.expenseDate)
        );
        break;
    }

    return result;
  }, [
    expenses,
    searchTerm,
    selectedCategory,
    sortOption,
  ]);

  const expenseCount = expenses.length;

  const averageExpense =
    expenseCount > 0
      ? monthlyTotal / expenseCount
      : 0;

  return (
    <main className="app-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <header className="dashboard-header">
        <div className="dashboard-heading">
          <h1>Expense Dashboard</h1>

          <p>
            Track and understand your spending.
          </p>
        </div>

        <div className="month-selector">
          <label htmlFor="selectedMonth">
            Dashboard Month
          </label>

          <input
            id="selectedMonth"
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>
      </header>

      <AddExpenseForm
        editingExpense={editingExpense}
        onExpenseAdded={handleExpenseAdded}
        onExpenseUpdated={handleExpenseUpdated}
        onCancelEdit={handleCancelEdit}
      />

      {loading && (
        <p className="loading-message">
          Loading dashboard...
        </p>
      )}

      {error && (
        <>
          <p className="error-message">
            {error}
          </p>

          <button
            className="retry-button"
            type="button"
            onClick={refreshDashboard}
          >
            Try Again
          </button>
        </>
      )}

      {!loading && !error && (
        <>
          <SummaryCards
            monthlyTotal={monthlyTotal}
            expenseCount={expenseCount}
            averageExpense={averageExpense}
          />

          <CategoryBreakdown
            categoryTotals={categoryTotals}
          />

          <ExpenseFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortOption={sortOption}
            categories={categories}
            displayedCount={filteredExpenses.length}
            totalCount={expenses.length}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onReset={resetFilters}
          />

          <ExpenseList
            expenses={filteredExpenses}
            totalExpenseCount={expenses.length}
            onEditExpense={handleStartEdit}
            onDeleteExpense={handleDeleteExpense}
          />
        </>
      )}
    </main>
  );
}

export default App;