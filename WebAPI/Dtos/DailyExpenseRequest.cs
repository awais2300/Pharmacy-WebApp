public class DailyExpenseRequest
{
    public DateTime Date { get; set; }
    public List<DailyExpenseItemDto> Items { get; set; } = new();
}

public class DailyExpenseItemDto
{
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
}
