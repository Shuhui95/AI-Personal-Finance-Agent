import "./ExpenseFilters.css";

function ExpenseFilters({
  searchTerm,
  selectedCategory,
  sortOption,
  categories,
  displayedCount,
  totalCount,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}) {
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    sortOption !== "date-desc";

  return (
    <section className="expense-filters-section">
      <div className="expense-filters-header">
        <div>
          <h2>Find Expenses</h2>

          <p>
            Showing {displayedCount} of {totalCount} expenses
          </p>
        </div>

        {hasActiveFilters && (
          <button
            className="reset-filters-button"
            type="button"
            onClick={onReset}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="expense-filters-grid">
        <div className="expense-filter-group search-group">
          <label htmlFor="expenseSearch">
            Search
          </label>

          <input
            id="expenseSearch"
            type="search"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search category, description or payment..."
          />
        </div>

        <div className="expense-filter-group">
          <label htmlFor="categoryFilter">
            Category
          </label>

          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={onCategoryChange}
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="expense-filter-group">
          <label htmlFor="sortOption">
            Sort By
          </label>

          <select
            id="sortOption"
            value={sortOption}
            onChange={onSortChange}
          >
            <option value="date-desc">
              Date: Newest First
            </option>

            <option value="date-asc">
              Date: Oldest First
            </option>

            <option value="amount-desc">
              Amount: Highest First
            </option>

            <option value="amount-asc">
              Amount: Lowest First
            </option>

            <option value="category-asc">
              Category: A to Z
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default ExpenseFilters;