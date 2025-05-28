public class DailyExpenseItem
{
    public int Id { get; set; }
    public int DailyExpenseId { get; set; }

    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }

    public DailyExpense? DailyExpense { get; set; }
}
