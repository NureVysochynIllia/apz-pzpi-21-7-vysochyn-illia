using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Services
{
    internal class ClusterService
    {
        public static async Task<JObject> GetStorages(string clusterId, string jwt, string lang)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwt);
                client.DefaultRequestHeaders.Add("lang", lang);
                var response = await client.GetAsync("http://localhost:5000/clusters/"+clusterId+"/");
                var resp = await response.Content.ReadAsStringAsync();
                var json = JObject.Parse(resp);
                if (response.IsSuccessStatusCode)
                {
                    return json;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
