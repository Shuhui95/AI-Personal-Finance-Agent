import { useMemo, useState } from "react";

import api from "../api/axios";

import AddExpenseForm from "./AddExpenseForm";
import ExpenseFilters from "./ExpenseFilters";
import ExpenseList from "./ExpenseList";
import Notification from "./Notification";

import "./TransactionsPage.css";


function TransactionsPage({
  expenses,
  onRefresh,
}) {
  const [editingExpense, setEditingExpense] =
    useState(null);

  const [notification, setNotification] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [sortOption, setSortOption] =
    useState("date-desc");


  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        expenses
          .map((expense) => expense.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [expenses]);


  const displayedExpenses = useMemo(() => {
    let result = [...expenses];


    // ---------------- SEARCH ----------------
    if (searchTerm.trim() !== "") {
      const keyword =
        searchTerm.trim().toLowerCase();

      result = result.filter((expense) => {
        const category =
          expense.category?.toLowerCase() ?? "";

        const description =
          expense.description?.toLowerCase() ?? "";

        const paymentMethod =
          expense.paymentMethod?.toLowerCase() ?? "";

        const expenseDate =
          expense.expenseDate?.toLowerCase() ?? "";

        const amount =
          String(expense.amount ?? "").toLowerCase();

        return (
          category.includes(keyword) ||
          description.includes(keyword) ||
          paymentMethod.includes(keyword) ||
          expenseDate.includes(keyword) ||
          amount.includes(keyword)
        );
      });
    }


    // ---------------- CATEGORY ----------------
    if (selectedCategory !== "All") {
      result = result.filter(
        (expense) =>
          expense.category === selectedCategory
      );
    }


    // ---------------- SORT ----------------
    result.sort((first, second) => {
      switch (sortOption) {
        case "date-asc":
          return (
            new Date(first.expenseDate) -
            new Date(second.expenseDate)
          );

        case "amount-desc":
          return (
            Number(second.amount) -
            Number(first.amount)
          );

        case "amount-asc":
          return (
            Number(first.amount) -
            Number(second.amount)
          );

        case "category-asc":
          return (
            first.category?.localeCompare(
              second.category ?? ""
            ) ?? 0
          );

        case "date-desc":
        default:
          return (
            new Date(second.expenseDate) -
            new Date(first.expenseDate)
          );
      }
    });

    return result;
  }, [
    expenses,
    searchTerm,
    selectedCategory,
    sortOption,
  ]);


  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }


  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }


  function handleSortChange(event) {
    setSortOption(event.target.value);
  }


  function handleResetFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOption("date-desc");
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


  async function handleExpenseAdded() {
    showNotification(
      "Expense added successfully."
    );

    await onRefresh();
  }


  async function handleExpenseUpdated() {
    setEditingExpense(null);

    showNotification(
      "Expense updated successfully."
    );

    await onRefresh();
  }


  function handleEditExpense(expense) {
    setEditingExpense(expense);
  }


  async function handleDeleteExpense(expenseId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/expenses/${expenseId}`
      );

      if (
        editingExpense?.id === expenseId
      ) {
        setEditingExpense(null);
      }

      showNotification(
        "Expense deleted successfully."
      );

      await onRefresh();
    } catch (error) {
      console.error(
        "Failed to delete expense:",
        error
      );

      const backendMessage =
        error.response?.data?.message;

      showNotification(
        backendMessage ||
          "Failed to delete expense.",
        "error"
      );
    }
  }


  return (
    <section className="transactions-page">
      <div className="transactions-header">
        <div>
          <h2>Transactions</h2>

          <p>
            Add, edit, search and manage
            your expense records.
          </p>
        </div>
      </div>


      {notification && (
        <Notification
          message={
            notification.message
          }
          type={
            notification.type
          }
          onClose={() =>
            setNotification(null)
          }
        />
      )}


      <div className="transactions-layout">

        <div className="transactions-main">

          <ExpenseFilters
            searchTerm={
              searchTerm
            }
            selectedCategory={
              selectedCategory
            }
            sortOption={
              sortOption
            }
            categories={
              categories
            }
            displayedCount={
              displayedExpenses.length
            }
            totalCount={
              expenses.length
            }
            onSearchChange={
              handleSearchChange
            }
            onCategoryChange={
              handleCategoryChange
            }
            onSortChange={
              handleSortChange
            }
            onReset={
              handleResetFilters
            }
          />


          <ExpenseList
            expenses={
              displayedExpenses
            }
            totalExpenseCount={
              expenses.length
            }
            onEditExpense={
              handleEditExpense
            }
            onDeleteExpense={
              handleDeleteExpense
            }
          />

        </div>


        <div className="transactions-form-column">

          <AddExpenseForm
            editingExpense={
              editingExpense
            }
            onExpenseAdded={
              handleExpenseAdded
            }
            onExpenseUpdated={
              handleExpenseUpdated
            }
            onCancelEdit={() =>
              setEditingExpense(null)
            }
          />

        </div>

      </div>
    </section>
  );
}


export default TransactionsPage;