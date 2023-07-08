namespace APIprojectfinal.Models
{
    public class Order : ModelBase
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DiplomaId { get; set; }
        public string DiplomaName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int Finished { get; set; }
    }
}
