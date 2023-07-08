using APIprojectfinal.Models;

namespace APIprojectfinal.Data_Access
{
    public interface IDataAccess
    {
        int CreateUser(User user);
        bool IsEmailAvailable(string email);
        bool AuthenticateUser(string email, string password, out User? user);

        IList<Diploma> GetAllDiplomas();
        bool OrderDiploma(int UserId, int DiplomaId);
        IList<Order> GetOrdersOfUser(int userId);
        IList<Order> GetAllOrders();
        bool FinishDiploma(int userId, int diplomaId);
        IList<User> GetUsers();
        void BlockUser(int userId);
        void UnblockUser(int userId);
        void DeactivateUser(int userId);
        void ActivateUser(int userId);
        IList<DiplomaCategory> GetAllCategories();
        void InsertNewDiploma(Diploma diploma);
        bool DeleteDiploma(int diplomaId);
        void CreateCategory(DiplomaCategory diplomaCategory);
    }
}

