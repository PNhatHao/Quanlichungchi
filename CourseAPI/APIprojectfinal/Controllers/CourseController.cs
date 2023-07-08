using APIprojectfinal.Data_Access;
using APIprojectfinal.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace APIprojectfinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IDataAccess course;
        private readonly IConfiguration configuration;
        public CourseController(IDataAccess course, IConfiguration configuration = null)
        {
            this.course = course;
            this.configuration = configuration;
        }

        [HttpPost("CreateAccount")]
        public IActionResult CreateAccount(User user)
        {
            if (!course.IsEmailAvailable(user.Email))
            {
                return Ok("Email không khả dụng!");
            }
            user.CreatedOn = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            user.UserType = UserType.USER;
            course.CreateUser(user);
            return Ok("Tài khoản được tạo thành công!");
        }

        [HttpGet("Login")]
        public IActionResult Login(string email, string password)
        {
            if (course.AuthenticateUser(email, password, out User? user))
            {
                if (user != null)
                {
                    var jwt = new Jwt(configuration["Jwt:Key"], configuration["Jwt:Duration"]);
                    var token = jwt.GenerateToken(user);
                    return Ok(token);
                }
            }
            return Ok("Không hợp lệ");
        }

        [HttpGet("GetAllDiplomas")]
        public IActionResult GetAllDiplomas()
        {
            var diplomas = course.GetAllDiplomas();
            var diplomasToSend = diplomas.Select(diploma => new
            {
                diploma.Id,
                diploma.Title,
                diploma.Category.Category,
                diploma.Category.SubCategory,
                diploma.Point,
                Available = !diploma.Ordered,
                diploma.Position
            }).ToList();
            return Ok(diplomasToSend);
        }

        [HttpGet("OrderDiploma/{UserId}/{DiplomaId}")]
        public IActionResult OrderDiploma(int UserId, int DiplomaId)
        {
            var result = course.OrderDiploma(UserId, DiplomaId) ? "Thành công" : "Không thành công";
            return Ok(result);
        }

        [HttpGet("GetOrders/{id}")]
        public IActionResult GetOrders(int id)
        {
            return Ok(course.GetOrdersOfUser(id));
        }

        [HttpGet("GetAllOrders")]
        public IActionResult GetAllOrders()
        {
            return Ok(course.GetAllOrders());
        }

        [HttpGet("FinishDiploma/{diplomaId}/{userId}")]
        public IActionResult FinishDiploma(string diplomaId, string userId)
        {
            var result = course.FinishDiploma(int.Parse(userId), int.Parse(diplomaId));
            return Ok(result == true ? "Thành công" : "Không hoàn thành");
        }

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = course.GetUsers();
            var result = users.Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Mobile,
                user.Blocked,
                user.Active,
                user.CreatedOn,
                user.UserType,
                user.Rank
            });
            return Ok(result);
        }

        [HttpGet("ChangeBlockStatus/{status}/{id}")]
        public IActionResult ChangeBlockStatus(int status, int id)
        {
            if (status == 1)
            {
                course.BlockUser(id);
            }
            else
            {
                course.UnblockUser(id);
            }
            return Ok("Thành công");
        }

        [HttpGet("ChangeEnableStatus/{status}/{id}")]
        public IActionResult ChangeEnableStatus(int status, int id)
        {
            if (status == 1)
            {
                course.ActivateUser(id);
            }
            else
            {
                course.DeactivateUser(id);
            }
            return Ok("Thành công");
        }

        [HttpGet("GetAllCategories")]
        public IActionResult GetAllCategories()
        {
            var categories = course.GetAllCategories();
            var x = categories.GroupBy(c => c.Category).Select(item =>
            {
                return new
                {
                    name = item.Key,
                    children = item.Select(item => new { name = item.SubCategory }).ToList()
                };
            }).ToList();
            return Ok(x);
        }

        [HttpPost("InsertDiploma")]
        public IActionResult InsertDiploma(Diploma diploma)
        {
            diploma.Title = diploma.Title.Trim();
            diploma.Position = diploma.Position.Trim();
            diploma.Category.Category = diploma.Category.Category.ToLower();
            diploma.Category.SubCategory = diploma.Category.SubCategory.ToLower();

            course.InsertNewDiploma(diploma);
            return Ok("Đã thêm");
        }

        [HttpDelete("DeleteDiploma/{id}")]
        public IActionResult DeleteDiploma(int id)
        {
            var returnResult = course.DeleteDiploma(id) ? "Thành công" : "thất bại";
            return Ok(returnResult);
        }

        [HttpPost("InsertCategory")]
        public IActionResult InsertCategory(DiplomaCategory diplomaCategory)
        {
            diplomaCategory.Category = diplomaCategory.Category.ToLower();
            diplomaCategory.SubCategory = diplomaCategory.SubCategory.ToLower();
            course.CreateCategory(diplomaCategory);
            return Ok("Đã thêm");
        }
    }

}
