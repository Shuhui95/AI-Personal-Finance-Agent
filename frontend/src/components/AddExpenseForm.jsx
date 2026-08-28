import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AddExpenseForm.css";

const initialFormData = {
  amount: "",
  category: "",
  description: "",
  expenseDate: "",
  paymentMethod: "",
};

function AddExpenseForm({
  editingExpense,
  onExpenseAdded,
  onExpenseUpdated,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount ?? "",
        category: editingExpense.category ?? "",
        description: editingExpense.description ?? "",
        expenseDate: editingExpense.expenseDate ?? "",
        paymentMethod: editingExpense.paymentMethod ?? "",
      });

      setFormError("");
    } else {
      setFormData(initialFormData);
    }
  }, [editingExpense]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");

      const requestBody = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingExpense) {
        const response = await api.put(
          `/expenses/${editingExpense.id}`,
          requestBody
        );

        await onExpenseUpdated(response.data);
      } else {
        const response = await api.post(
          "/expenses",
          requestBody
        );

        await onExpenseAdded(response.data);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error(error);

      const backendMessage = error.response?.data?.message;

      setFormError(
        backendMessage ||
          `Failed to ${
            editingExpense ? "update" : "add"
          } expense. Please check your input.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setFormData(initialFormData);
    setFormError("");
    onCancelEdit();
  }

  return (
    <section className="expense-form-section">
      <h2>
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>

      {formError && (
        <p className="error-message">{formError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="expense-form-grid">
          <div className="expense-form-group">
            <label htmlFor="amount">Amount</label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              onInvalid={(event) => {
                event.target.setCustomValidity(
                  "Please enter an amount greater than 0."
                );
              }}
              onInput={(event) => {
                event.target.setCustomValidity("");
              }}
              placeholder="e.g. 12.50"
              required
            />
          </div>

          <div className="expense-form-group">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(event) => {
                event.target.setCustomValidity("");
                handleChange(event);
              }}
              onInvalid={(event) => {
                event.target.setCustomValidity(
                  "Please select a category."
                );
              }}
              required
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">
                Entertainment
              </option>
              <option value="Education">Education</option>
              <option value="Utilities">Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="expense-form-group">
            <label htmlFor="expenseDate">Date</label>

            <input
              id="expenseDate"
              name="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={handleChange}
              onInvalid={(event) => {
                event.target.setCustomValidity(
                  "Please select an expense date."
                );
              }}
              onInput={(event) => {
                event.target.setCustomValidity("");
              }}
              required
            />
          </div>

          <div className="expense-form-group">
            <label htmlFor="paymentMethod">
              Payment Method
            </label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">
                Select a payment method
              </option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">
                Credit Card
              </option>
              <option value="Debit Card">
                Debit Card
              </option>
              <option value="PayNow">PayNow</option>
              <option value="Bank Transfer">
                Bank Transfer
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="expense-form-group full-width">
            <label htmlFor="description">
              Description
            </label>

            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Lunch at canteen"
            />
          </div>
        </div>

        <div className="expense-form-actions">
          <button
            className="add-expense-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? editingExpense
                ? "Updating..."
                : "Adding..."
              : editingExpense
                ? "Update Expense"
                : "Add Expense"}
          </button>

          {editingExpense && (
            <button
              className="cancel-edit-button"
              type="button"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AddExpenseForm;