package backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        BigDecimal amount,
        String category,
        String description,
        LocalDate expenseDate,
        String paymentMethod
) {
}