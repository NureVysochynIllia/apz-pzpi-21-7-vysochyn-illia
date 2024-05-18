using apz_pzpi_21_7_vysochyn_illia_task3.Interfaces;
using apz_pzpi_21_7_vysochyn_illia_task3.Services;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace apz_pzpi_21_7_vysochyn_illia_task3
{
    public partial class MainWindow : Window
    {
        public string ClusterId { get; set; }
        public string Jwt { get; set; }
        private ClientWebSocket socket = new ClientWebSocket();
        private StorageInfo selectedStorage;
        private List<DateTime> selectedDateTime = new List<DateTime>(2) { DateTime.Now, DateTime.Now };
        private List<VolumeInfo> currentVolumes;
        private IMainLang lang = new IMainLang();
        private string interfaceLang = "EN";
        IClusterInfo clusterInfo;

        public MainWindow(string jwt)
        {
            Jwt = jwt;
            InitializeComponent();
            ConnectWebSocket();
            InitializeLanguage();
        }
        private async void ConnectWebSocket()
        {
            Uri uri = new Uri("ws://localhost:5000");
            await socket.ConnectAsync(uri, CancellationToken.None);
            await Task.Run(() => ReceiveMessage());
        }

        private async Task ReceiveMessage()
        {
            while (socket.State == WebSocketState.Open)
            {
                var buffer = new byte[1024];
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    JObject res = JObject.Parse(message);
                    if (res != null)
                    {
                        if (clusterInfo.storages.Any(s => s._id == res["storageId"].ToString()))
                        {
                            Application.Current.Dispatcher.Invoke(() =>
                            {
                                Window_Loaded(null, null);
                            });
                        }
                    }
                }
            }
        }

        private async void Window_Loaded(object sender, RoutedEventArgs e)
        {
            JObject cluster = await ClusterService.GetStorages(ClusterId, Jwt, interfaceLang);
            if (cluster != null)
            {
                clusterInfo = cluster.ToObject<IClusterInfo>();
                if (clusterInfo != null && clusterInfo.cluster != null)
                {
                    ClusterName.Text = clusterInfo.cluster.name;
                    ClusterCity.Text = clusterInfo.cluster.city;
                    ClusterType.Text = clusterInfo.cluster.type;
                    ClusterFrom.Text = lang.WorkFrom + clusterInfo.cluster.workTime.from;
                    ClusterTo.Text = lang.WorkTo + clusterInfo.cluster.workTime.to;
                    PopulateGrid(clusterInfo.storages);
                }
            }
        }

        private void PopulateGrid(List<StorageInfo> storages)
        {
            StorageGrid.RowDefinitions.Clear();
            StorageGrid.ColumnDefinitions.Clear();
            StorageGrid.Children.Clear();
            int count = storages.Count;
            int rows = (int)Math.Ceiling(Math.Sqrt(count));
            int cols = (int)Math.Ceiling((double)count / rows);

            for (int i = 0; i < rows; i++)
            {
                StorageGrid.RowDefinitions.Add(new RowDefinition());
            }
            for (int j = 0; j < cols; j++)
            {
                StorageGrid.ColumnDefinitions.Add(new ColumnDefinition());
            }

            for (int i = 0; i < storages.Count; i++)
            {
                var button = MainHelperService.FormButton(i, cols, rows, storages[i], this);
                StorageGrid.Children.Add(button);
            }
        }

        public void StorageButton_Click(object sender, RoutedEventArgs e)
        {
            Button button = sender as Button;
            if (button != null && button.Background == Brushes.Green)
            {
                StorageInfo storage = button.Tag as StorageInfo;
                if (storage != null)
                {
                    selectedStorage = storage;
                    currentVolumes = storage.volumes;
                    BookStorage.Visibility = Visibility.Visible;
                    ChooseStorage.Visibility = Visibility.Collapsed;
                    InitializeStorageLang();
                    VolumeUnit.ItemsSource = storage.volumes.Select(v => v.unit).ToList();
                    VolumeUnit.SelectedIndex = 0;
                    PickerFrom.Minimum = DateTime.Now;
                    PickerFrom.Value = DateTime.Now;
                    PickerTo.Minimum = PickerFrom.Value;
                    PickerTo.Value = DateTime.Now;
                    ButtonBack.Visibility = ChooseStorage.Visibility == Visibility.Visible ? Visibility.Collapsed : Visibility.Visible;
                }
            }
        }
        private void InitializeStorageLang()
        {
            StorageNumber.Text = lang.NumberOfStorage + selectedStorage.number;
            StoragePrice.Text = lang.PriceForRenting + selectedStorage.price.ToString();
            StorageVolume.Text = lang.VolumeOfStorage + selectedStorage.volumes[0].length.ToString() + "x" + selectedStorage.volumes[0].width.ToString() + "x" + selectedStorage.volumes[0].height.ToString();
        }
        private void VolumeUnit_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (VolumeUnit.SelectedIndex >= 0 && currentVolumes != null)
            {
                var selectedVolume = currentVolumes[VolumeUnit.SelectedIndex];
                StorageVolume.Text = lang.VolumeOfStorage + selectedVolume.length.ToString() + "x" + selectedVolume.width.ToString() + "x" + selectedVolume.height.ToString();
            }
        }
        private void PickerFrom_ValueChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            DateTime selectedDT = PickerFrom.Value ?? DateTime.Now;
            selectedDateTime[0] = selectedDT;
            if (PickerTo.Value < PickerFrom.Value)
                PickerTo.Value = PickerFrom.Value;
            PickerTo.Minimum = PickerFrom.Value;
        }
        private void PickerTo_ValueChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            DateTime selectedDT = PickerTo.Value ?? DateTime.Now;
            selectedDateTime[1] = selectedDT;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            BookStorage.Visibility = Visibility.Collapsed;
            PayForRent.Visibility = Visibility.Visible;
            InitializePaycheckLanguage();
        }
        private void InitializePaycheckLanguage()
        {
            double hours = MainHelperService.GetTime(selectedDateTime);
            PayCheck.Text = lang.PriceForHour + hours + lang.HoursCosts + Math.Ceiling(hours * selectedStorage.price).ToString();
        }
        private async void PayForRent_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.P && PayForRent.Visibility == Visibility.Visible)
            {
                string res = await RentService.RentStorage(Jwt, selectedDateTime, selectedStorage._id);
                if (res != "Storage rented successfully.")
                {
                    MessageBox.Show(res);
                    GoToMain(null, null);
                    return;
                }
                PayCheck.Text = Properties.main.Thanks;
                await Task.Delay(10000);
                GoToMain(null, null);
            }
            if (PayForRent.Visibility == Visibility.Collapsed)
            {
                MainHelperService.StorageControl(e, clusterInfo, Jwt);
            }
        }
        private void GoToMain(object sender, RoutedEventArgs e)
        {
            BookStorage.Visibility = Visibility.Collapsed;
            PayForRent.Visibility = Visibility.Collapsed;
            ChooseStorage.Visibility = Visibility.Visible;
            ButtonBack.Visibility = ChooseStorage.Visibility == Visibility.Visible ? Visibility.Collapsed : Visibility.Visible;
        }
        private void InitializeLanguage()
        {
            if (interfaceLang == "UK")
            {
                Thread.CurrentThread.CurrentCulture = new CultureInfo("uk-UA");
                Thread.CurrentThread.CurrentUICulture = new CultureInfo("uk-UA");
                ButtonUa.IsEnabled = false;
                ButtonEn.IsEnabled = true;
            }
            else if (interfaceLang == "EN")
            {
                Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");
                Thread.CurrentThread.CurrentUICulture = new CultureInfo("en-US");
                ButtonEn.IsEnabled = false;
                ButtonUa.IsEnabled = true;
            }
            lang = MainHelperService.LangSetup();
            ButtonRent.Content = lang.ButtonRent;
            TimeFrom.Text = lang.RentFrom;
            TimeTo.Text = lang.RentTo;
            PayWithTerminal.Text = lang.PayWithTerminal;
            Instruction.Text = lang.Instruction;
            ButtonBack.Content = "<-";
            Window_Loaded(null, null);
            if (PayForRent.Visibility == Visibility.Visible)
                InitializePaycheckLanguage();
            if (BookStorage.Visibility == Visibility.Visible)
                InitializeStorageLang();
        }

        private void Button_Click_En(object sender, RoutedEventArgs e)
        {
            interfaceLang = "EN";
            InitializeLanguage();
        }

        private void Button_Click_Uk(object sender, RoutedEventArgs e)
        {
            interfaceLang = "UK";
            InitializeLanguage();
        }
    }
}
