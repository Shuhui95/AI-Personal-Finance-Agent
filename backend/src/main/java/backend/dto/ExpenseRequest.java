package backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExpenseRequest(

        @NotNull(message = "Amount is required")
        @DecimalMin(
                value = "0.01",
                message = "Amount must be greater than 0"
        )
        BigDecimal amount,

        @NotBlank(message = "Category is required")
        @Size(
                max = 50,
                message = "Category must not exceed 50 characters"
        )
        String category,

        String description,

        @NotNull(message = "Expense date is required")
        LocalDate expenseDate,

        @Size(
                max = 50,
                message = "Payment method must not exceed 50 characters"
        )
        String paymentMethod
) {
}
