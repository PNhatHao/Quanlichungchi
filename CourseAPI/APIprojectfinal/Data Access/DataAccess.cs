using APIprojectfinal.Models;
using Dapper;
using System.Data.Common;
using System.Data.SqlClient;

namespace APIprojectfinal.Data_Access
{
    public class DataAccess :IDataAccess
    {
        private readonly IConfiguration configuration;
        private readonly string DbConnection;

        public DataAccess(IConfiguration _configuration)
        {
            configuration = _configuration;
            DbConnection = configuration["connectionStrings:DBConnect"] ?? "";
        }
        public int CreateUser(User user)
        {
            var result = 0;
            using (var connection = new SqlConnection(DbConnection))
            {
                var parameters = new
                {
                    fn = user.FirstName,
                    ln = user.LastName,
                    em = user.Email,
                    mb = user.Mobile,
                    pwd = user.Password,
                    blk = user.Blocked,
                    act = user.Active,
                    con = user.CreatedOn,
                    type = user.UserType.ToString()
                };
                var sql = "insert into Users (FirstName, LastName, Email, Mobile, Password, Blocked, Active, CreatedOn, UserType) values (@fn, @ln, @em, @mb, @pwd, @blk, @act, @con, @type);";
                result = connection.Execute(sql, parameters);
            }
            return result;

        }

        public bool IsEmailAvailable(string email)
        {
            var result = false;

            using (var connection = new SqlConnection(DbConnection))
            {
                result = connection.ExecuteScalar<bool>("select count(*) from Users where Email=@email;", new { email });
            }

            return !result;
        }

        public bool AuthenticateUser(string email, string password, out User? user)
        {
            var result = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                result = connection.ExecuteScalar<bool>("select count(1) from Users where email=@email and password=@password;", new { email, password });
                if (result)
                {
                    user = connection.QueryFirst<User>("select * from Users where email=@email;", new { email });
                }
                else
                {
                    user = null;
                }
            }
            return result;
        }

        public IList<Diploma> GetAllDiplomas()
        {
            IEnumerable<Diploma> diplomas = null;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = "select * from Diplomas;";
                diplomas = connection.Query<Diploma>(sql);

                foreach (var diploma in diplomas)
                {
                    sql = "select * from DiplomaCategories where Id=" + diploma.CategoryId;
                    diploma.Category = connection.QuerySingle<DiplomaCategory>(sql);
                }
            }
            return diplomas.ToList();
        }

        public bool OrderDiploma(int UserId, int DiplomaId)
        {
            var ordered = false;

            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"insert into Orders (UserId, DiplomaId, OrderedOn, Finished) values ({UserId}, {DiplomaId}, '{DateTime.Now:yyyy-MM-dd HH:mm:ss}', 0);";
                var inserted = connection.Execute(sql) == 1;
                if (inserted)
                {
                    sql = $"update Diplomas set Ordered=1 where Id={DiplomaId}";
                    var updated = connection.Execute(sql) == 1;
                    ordered = updated;
                }
            }

            return ordered;
        }

        public IList<Order> GetOrdersOfUser(int userId)
        {
            IEnumerable<Order> orders;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = @"
                    select 
                        o.Id, 
                        u.Id as UserId, CONCAT(u.FirstName, ' ', u.LastName) as Name,
                        o.DiplomaId as DiplomaId, b.Title as DiplomaName,
                        o.OrderedOn as OrderDate, o.Finished as Finished
                    from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                    LEFT JOIN Diplomas b ON o.DiplomaId=b.Id
                    where o.UserId IN (@Id);
                ";
                orders = connection.Query<Order>(sql, new { Id = userId });
            }
            return orders.ToList();
        }

        public IList<Order> GetAllOrders()
        {
            IEnumerable<Order> orders;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = @"
                    select 
                        o.Id, 
                        u.Id as UserId, CONCAT(u.FirstName, ' ', u.LastName) as Name,
                        o.DiplomaId as DiplomaId, b.Title as DiplomaName,
                        o.OrderedOn as OrderDate, o.Finished as Finished
                    from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                    LEFT JOIN Diplomas b ON o.DiplomaId=b.Id
                    where o.Id IS NOT NULL;
                ";
                orders = connection.Query<Order>(sql);
            }
            return orders.ToList();
        }

        public bool FinishDiploma(int userId, int diplomaId)
        {
            var finished = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"update Diplomas set Ordered=0 where Id={diplomaId};";
                connection.Execute(sql);
                sql = $"update Orders set Finished=1 where UserId={userId} and DiplomaId={diplomaId};";
                finished = connection.Execute(sql) == 1;
            }
            return finished;
        }

        public IList<User> GetUsers()
        {
            IEnumerable<User> users;
            using (var connection = new SqlConnection(DbConnection))
            {
                users = connection.Query<User>("select * from Users;");

                var listOfOrders =
                    connection.Query("select u.Id as UserId, o.DiplomaId as DiplomaId, o.OrderedOn as OrderDate, o.Finished as Finished from Users u LEFT JOIN Orders o ON u.Id=o.UserId;");

                foreach (var user in users)
                {
                    var orders = listOfOrders.Where(lo => lo.UserId == user.Id).ToList();
                    var rank = 0;
                    foreach (var order in orders)
                    {
                        if (order.DiplomaId != null && order.Finished != null && order.Finished == false)
                        {
                            var orderDate = order.OrderDate;
                            var maxDate = orderDate.AddDays(10);
                            var currentDate = DateTime.Now;

                            var extraDays = (currentDate - maxDate).Days;
                            extraDays = extraDays < 0 ? 0 : extraDays;

                            rank = extraDays * 50;
                            user.Rank += rank;
                        }
                    }
                }
            }
            return users.ToList();
        }

        public void BlockUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Blocked=1 where Id=@Id", new { Id = userId });
        }

        public void UnblockUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Blocked=0 where Id=@Id", new { Id = userId });
        }

        public void ActivateUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Active=1 where Id=@Id", new { Id = userId });
        }

        public void DeactivateUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Active=0 where Id=@Id", new { Id = userId });
        }

        public IList<DiplomaCategory> GetAllCategories()
        {
            IEnumerable<DiplomaCategory> categories;

            using (var connection = new SqlConnection(DbConnection))
            {
                categories = connection.Query<DiplomaCategory>("select * from DiplomaCategories;");
            }

            return categories.ToList();
        }


        public void InsertNewDiploma(Diploma diploma)
        {
            using var conn = new SqlConnection(DbConnection);
            var sql = "select Id from DiplomaCategories where Category=@cat and SubCategory=@subcat";
            var parameter1 = new
            {
                cat = diploma.Category.Category,
                subcat = diploma.Category.SubCategory
            };
            var categoryId = conn.ExecuteScalar<int>(sql, parameter1);

            sql = "insert into Diplomas (Title, Position, Point, Ordered, CategoryId) values (@title, @position, @point, @ordered, @catid);";
            var parameter2 = new
            {
                title = diploma.Title,
                position = diploma.Position,
                point = diploma.Point,
                ordered = false,
                catid = categoryId
            };
            conn.Execute(sql, parameter2);
        }

        public bool DeleteDiploma(int diplomaId)
        {
            var deleted = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"delete Diplomas where Id={diplomaId}";
                deleted = connection.Execute(sql) == 1;
            }
            return deleted;
        }

        public void CreateCategory(DiplomaCategory diplomaCategory)
        {
            using var connection = new SqlConnection(DbConnection);
            var parameter = new
            {
                cat = diplomaCategory.Category,
                subcat = diplomaCategory.SubCategory
            };
            connection.Execute("insert into DiplomaCategories (category, subcategory) values (@cat, @subcat);", parameter);
        }





    }
}
