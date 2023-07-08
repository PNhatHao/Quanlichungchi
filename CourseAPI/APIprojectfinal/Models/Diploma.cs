namespace APIprojectfinal.Models
{
    public class Diploma : ModelBase
    {
        public string Title { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public float Point { get; set; } = 0;
        public bool Ordered { get; set; } = false;
        public int CategoryId { get; set; }
        public DiplomaCategory Category { get; set; } = new DiplomaCategory();
    }
}
