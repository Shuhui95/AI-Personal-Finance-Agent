package backend.controller;

import backend.dto.ExpenseRequest;
import backend.dto.ExpenseResponse;
import backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    /*
     * Constructor Injection:
     * Spring 自动创建 ExpenseService，
     * 然后通过构造方法传给 Controller。
     */
    public ExpenseController(
            ExpenseService expenseService
    ) {
        this.expenseService = expenseService;
    }

    /*
     * 获取所有 Expense
     *
     * GET /api/expenses
     */
    @GetMapping
    public List<ExpenseResponse> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    /*
     * 根据 ID 获取单个 Expense
     *
     * GET /api/expenses/1
     */
    @GetMapping("/{id}")
    public ExpenseResponse getExpenseById(
            @PathVariable Long id
    ) {
        return expenseService.getExpenseById(id);
    }

    /*
     * 创建 Expense
     *
     * POST /api/expenses
     *
     * @Valid 会检查 ExpenseRequest 中的验证注解。
     * 创建成功返回 201 Created。
     */
    @PostMapping
    public ResponseEntity<ExpenseResponse>
    createExpense(
            @Valid
            @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse createdExpense =
                expenseService.createExpense(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdExpense);
    }

    /*
     * 更新 Expense
     *
     * PUT /api/expenses/1
     */
    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,

            @Valid
            @RequestBody ExpenseRequest request
    ) {
        return expenseService.updateExpense(
                id,
                request
        );
    }

    /*
     * 删除 Expense
     *
     * DELETE /api/expenses/1
     *
     * 删除成功返回 204 No Content，
     * 因此 Response Body 为空。
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id
    ) {
        expenseService.deleteExpense(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    /*
     * 根据 Category 查询
     *
     * GET /api/expenses/category/Food
     */
    @GetMapping("/category/{category}")
    public List<ExpenseResponse> getByCategory(
            @PathVariable String category
    ) {
        return expenseService.getByCategory(category);
    }

    /*
     * 根据日期范围查询
     *
     * GET /api/expenses/date-range
     *     ?startDate=2026-08-01
     *     &endDate=2026-08-31
     */
    @GetMapping("/date-range")
    public List<ExpenseResponse> getByDateRange(

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate endDate
    ) {
        return expenseService.getByDateRange(
                startDate,
                endDate
        );
    }

    /*
     * 根据 Category 和日期范围查询
     *
     * GET /api/expenses/search
     *     ?category=Food
     *     &startDate=2026-08-01
     *     &endDate=2026-08-31
     */
    @GetMapping("/search")
    public List<ExpenseResponse> search(

            @RequestParam
            String category,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate endDate
    ) {
        return expenseService.search(
                category,
                startDate,
                endDate
        );
    }

    /*
     * 查询某月的全部 Expense
     *
     * GET /api/expenses/month
     *     ?year=2026
     *     &month=8
     */
    @GetMapping("/month")
    public List<ExpenseResponse>
    getMonthlyExpenses(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return expenseService.getMonthlyExpenses(
                year,
                month
        );
    }

    /*
     * 查询某月总消费
     *
     * GET /api/expenses/summary/monthly
     *     ?year=2026
     *     &month=8
     *
     * 返回：
     * {
     *   "year": 2026,
     *   "month": 8,
     *   "total": 55.70
     * }
     */
    @GetMapping("/summary/monthly")
    public Map<String, Object> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month
    ) {
        BigDecimal total =
                expenseService.getMonthlyTotal(
                        year,
                        month
                );

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("year", year);
        result.put("month", month);
        result.put("total", total);

        return result;
    }

    /*
     * 查询某月各 Category 的消费总额
     *
     * GET /api/expenses/summary/categories
     *     ?year=2026
     *     &month=8
     *
     * 返回：
     * {
     *   "Food": 27.70,
     *   "Transport": 3.00
     * }
     */
    @GetMapping("/summary/categories")
    public Map<String, BigDecimal>
    getCategorySummary(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return expenseService
                .getMonthlyCategorySummary(
                        year,
                        month
                );
    }
}