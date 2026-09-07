package backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import backend.dto.ExpenseRequest;
import backend.dto.ExpenseResponse;
import backend.entity.Expense;
import backend.exception.ResourceNotFoundException;
import backend.repository.ExpenseRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository
    ) {
        this.expenseRepository = expenseRepository;
    }

    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long id) {
        return toResponse(findExpenseById(id));
    }

    public ExpenseResponse createExpense(
            ExpenseRequest request
    ) {
        Expense expense = new Expense(
                request.amount(),
                normalizeCategory(request.category()),
                request.description(),
                request.expenseDate(),
                request.paymentMethod()
        );

        Expense savedExpense =
                expenseRepository.save(expense);

        return toResponse(savedExpense);
    }

    public ExpenseResponse updateExpense(
            Long id,
            ExpenseRequest request
    ) {
        Expense expense = findExpenseById(id);

        expense.setAmount(request.amount());
        expense.setCategory(
                normalizeCategory(request.category())
        );
        expense.setDescription(request.description());
        expense.setExpenseDate(request.expenseDate());
        expense.setPaymentMethod(
                request.paymentMethod()
        );

        Expense updatedExpense =
                expenseRepository.save(expense);

        return toResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {
        Expense expense = findExpenseById(id);
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> getByCategory(
            String category
    ) {
        validateCategory(category);

        return expenseRepository
                .findByCategoryIgnoreCase(
                        category.trim()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ExpenseResponse> getByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
        validateDateRange(startDate, endDate);

        return expenseRepository
                .findByExpenseDateBetween(
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ExpenseResponse> search(
        String keyword,
        LocalDate startDate,
        LocalDate endDate
) {
    if (keyword == null || keyword.isBlank()) {
        throw new IllegalArgumentException(
                "Keyword must not be blank"
        );
    }

    // 只填了一个日期：不允许
    if ((startDate == null) != (endDate == null)) {
        throw new IllegalArgumentException(
                "Both startDate and endDate must be provided together"
        );
    }

    // 两个日期都填写
    if (startDate != null && endDate != null) {

        validateDateRange(startDate, endDate);

        return expenseRepository
                .searchByKeywordAndDateRange(
                        keyword.trim(),
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 两个日期都没填写
    return expenseRepository
            .searchByKeyword(keyword.trim())
            .stream()
            .map(this::toResponse)
            .toList();
}

    public List<ExpenseResponse> getMonthlyExpenses(
            int year,
            int month
    ) {
        return findMonthlyExpenseEntities(year, month)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BigDecimal getMonthlyTotal(
            int year,
            int month
    ) {
        return findMonthlyExpenseEntities(year, month)
                .stream()
                .map(Expense::getAmount)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );
    }

    public Map<String, BigDecimal>
    getMonthlyCategorySummary(
            int year,
            int month
    ) {
        Map<String, BigDecimal> summary =
                new LinkedHashMap<>();

        for (Expense expense :
                findMonthlyExpenseEntities(year, month)) {

            summary.merge(
                    expense.getCategory(),
                    expense.getAmount(),
                    BigDecimal::add
            );
        }

        return summary;
    }

    /*
     * 以下是 private 方法。
     * Controller 无法调用，因此 Entity 被限制在 Service 内部。
     */

    private Expense findExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id: "
                                        + id
                        )
                );
    }

    private List<Expense>
    findMonthlyExpenseEntities(
            int year,
            int month
    ) {
        YearMonth yearMonth =
                validateAndCreateYearMonth(year, month);

        return expenseRepository
                .findByExpenseDateBetween(
                        yearMonth.atDay(1),
                        yearMonth.atEndOfMonth()
                );
    }

    private ExpenseResponse toResponse(
            Expense expense
    ) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getExpenseDate(),
                expense.getPaymentMethod()
        );
    }

    private void validateDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date must not be after end date"
            );
        }
    }

    private void validateCategory(String category) {
        if (category == null ||
                category.isBlank()) {
            throw new IllegalArgumentException(
                    "Category must not be blank"
            );
        }
    }

    private YearMonth validateAndCreateYearMonth(
            int year,
            int month
    ) {
        if (year < 2000 || year > 2100) {
            throw new IllegalArgumentException(
                    "Year must be between 2000 and 2100"
            );
        }

        if (month < 1 || month > 12) {
            throw new IllegalArgumentException(
                    "Month must be between 1 and 12"
            );
        }

        return YearMonth.of(year, month);
    }

    private String normalizeCategory(
            String category
    ) {
        String trimmed = category.trim();

        return trimmed.substring(0, 1)
                .toUpperCase()
                + trimmed.substring(1)
                .toLowerCase();
    }
}