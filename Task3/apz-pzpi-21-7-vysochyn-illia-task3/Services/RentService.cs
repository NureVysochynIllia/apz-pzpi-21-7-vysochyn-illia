using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Services
{
    internal class RentService
    {
        public static async Task<string> RentStorage(string jwt, List<DateTime> selectedDateTime, string selectedStorageId)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwt);
                var requestData = new
                {
                    storageId = selectedStorageId,
                    from = selectedDateTime[0],
                    to = selectedDateTime[1],
                };
                var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:5000/rent/new/", content);
                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
                return json["message"].ToString();
            }
        }
        public static async Task<string> CloseStorage(string jwt, string storageId)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwt);
                var activeRentalsResponse = await client.GetAsync("http://localhost:5000/rent/active/");

                var activeRentalsJson = await activeRentalsResponse.Content.ReadAsStringAsync();
                if (!activeRentalsResponse.IsSuccessStatusCode)
                {
                    return activeRentalsJson;
                }
                var activeRentals = JArray.Parse(JObject.Parse(activeRentalsJson)["bookings"].ToString());

                string bookingId = null;
                foreach (var rental in activeRentals)
                {
                    if (rental["storageId"]["_id"].ToString() == storageId)
                    {
                        bookingId = rental["_id"].ToString();
                        break;
                    }
                }

                if (string.IsNullOrEmpty(bookingId))
                {
                    return "No active booking found for the specified storage.";
                }
                var openBookingRequestContent = new StringContent(
                    JsonConvert.SerializeObject(new { bookingId }),
                    Encoding.UTF8,
                    "application/json"
                );
                var request = new HttpRequestMessage(new HttpMethod("PATCH"), "http://localhost:5000/rent/open/");
                request.Content = openBookingRequestContent;
                var openBookingResponse = await client.SendAsync(request);
                if (openBookingResponse.IsSuccessStatusCode)
                {
                    return "Storage successfully closed and booking opened.";
                }
                else
                {
                    return "Failed to open booking.";
                }
            }
        }
    }
}
