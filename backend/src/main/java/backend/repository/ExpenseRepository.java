package backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.entity.Expense;


public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    // 只按 category 查询
    List<Expense> findByCategoryIgnoreCase(
            String category
    );


    // 只按日期范围查询
    List<Expense> findByExpenseDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );


    // category + 日期范围联合查询
    List<Expense>
    findByCategoryIgnoreCaseAndExpenseDateBetween(
            String category,
            LocalDate startDate,
            LocalDate endDate
    );


    // keyword 搜索：
    // category / description / paymentMethod
    @Query("""
        SELECT e
        FROM Expense e
        WHERE LOWER(e.category)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(e.description, ''))
                LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(e.paymentMethod, ''))
                LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Expense> searchByKeyword(
            @Param("keyword") String keyword
    );


    // keyword + 日期范围联合搜索
    @Query("""
        SELECT e
        FROM Expense e
        WHERE (
               LOWER(e.category)
                    LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(COALESCE(e.description, ''))
                    LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(COALESCE(e.paymentMethod, ''))
                    LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND e.expenseDate
                BETWEEN :startDate AND :endDate
    """)
    List<Expense> searchByKeywordAndDateRange(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}