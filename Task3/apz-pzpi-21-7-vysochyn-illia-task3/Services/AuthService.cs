using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Services
{
    internal class AuthService
    {
        public static async Task<string> Auth(string Username, string Password)
        {
            using (var client = new HttpClient())
            {
                var requestData = new
                {
                    username = Username,
                    password = Password
                };
                var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:5000/user/login/", content);
                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
                if (response.IsSuccessStatusCode)
                {
                    return json["accessToken"].ToString();
                }
                else
                {
                    return null;
                }
            }
        }
        public static async Task<string> CheckAdmin(string jwt)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwt);
                var response = await client.GetAsync("http://localhost:5000/user/");
                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
                if (response.IsSuccessStatusCode)
                {
                    return json["role"].ToString();
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
