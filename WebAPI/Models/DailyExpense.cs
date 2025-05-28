public class DailyExpense
{
    public int Id { get; set; }
    public DateTime ExpenseDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public List<DailyExpenseItem> Items { get; set; } = new();
}
