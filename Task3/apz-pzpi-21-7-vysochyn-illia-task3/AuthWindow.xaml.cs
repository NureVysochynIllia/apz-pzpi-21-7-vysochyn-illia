using Newtonsoft.Json.Linq;
using System.Windows;
using System.Windows.Controls;
using apz_pzpi_21_7_vysochyn_illia_task3.Services;


namespace apz_pzpi_21_7_vysochyn_illia_task3
{
    public partial class AuthWindow : Window
    {
        private const string Path = "Options.json";
        public string Jwt { get; set; }
        public AuthWindow()
        {
            InitializeComponent();
            CheckData();
        }
        private void CheckData()
        {
            JObject data = FileStreamService.ReadFromJsonFile<JObject>(Path);
            if (data != null)
            {
                MainWindow mainWindow = new MainWindow(data["jwt"].ToString());
                mainWindow.ClusterId = data["clusterId"].ToString();
                mainWindow.Show();
                this.Close();
            }
        }
        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            string username = UsernameTextBox.Text;
            string password = PasswordBox.Password;
            string resp = await AuthService.Auth(username, password);
            if (resp != null)
            {
                string role = await AuthService.CheckAdmin(resp);
                if (role == "admin")
                {
                    Jwt = resp;
                    AuthStack.Visibility = Visibility.Collapsed;
                    ClusterIdStack.Visibility = Visibility.Visible;
                }
                else
                {
                    MessageBox.Show("Invalid username or password. Please try again.");
                }
            }
            else
            {
                MessageBox.Show("Invalid username or password. Please try again.");
            }
        }
        private void Cluster_Click(object sender, RoutedEventArgs e)
        {
            var data = new JObject() {
                {"jwt",Jwt },
                {"clusterId",ClusterIdBox.Text}
            };
            FileStreamService.WriteToJsonFile(Path, data);
            MainWindow mainWindow = new MainWindow(Jwt);
            mainWindow.ClusterId = ClusterIdBox.Text;
            mainWindow.Show();
            this.Close();
        }
    }

}
