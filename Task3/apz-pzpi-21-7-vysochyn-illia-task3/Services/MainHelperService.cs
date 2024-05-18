using apz_pzpi_21_7_vysochyn_illia_task3.Interfaces;
using System;
using System.Collections.Generic;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Services
{
    internal class MainHelperService
    {
        public static UIElement FormButton(int i, int cols,int rows, Interfaces.StorageInfo storage, MainWindow page)
        {
            int row = i / cols;
            int col = i % cols;
            SolidColorBrush buttonColor;
            if (!storage.isOpened)
            {
                buttonColor = Brushes.Red;
            }
            else if (storage.isBooked)
            {
                buttonColor = Brushes.Purple;
            }
            else
            {
                buttonColor = Brushes.Green;
            }
            Button button = new Button
            {
                Content = storage.number + "  ",
                Margin = new Thickness(10),
                Background = buttonColor,
                Tag = storage,
                Width = 960 / cols,
                Height = 640 / rows,
                FontSize = 50,
                FontFamily = new FontFamily("Comic Sans MS")
            };

            button.Click += page.StorageButton_Click;
            Grid.SetRow(button, row);
            Grid.SetColumn(button, col);
            return button;
        }
        public static double GetTime(List<DateTime> selectedDateTime)
        {
            return Math.Ceiling((selectedDateTime[1] - selectedDateTime[0]).TotalHours);
        }
        public async static void StorageControl(KeyEventArgs e, IClusterInfo clusterInfo, string Jwt)
        {
            if (e.Key >= Key.D0 && e.Key <= Key.D9)
            {
                int digit = e.Key - Key.D0;
                Interfaces.StorageInfo storage = clusterInfo.storages.FirstOrDefault(s => s.number == digit.ToString());
                string closeRes = await RentService.CloseStorage(Jwt, storage._id);
                MessageBox.Show(closeRes);
            }
            else if (e.Key >= Key.NumPad0 && e.Key <= Key.NumPad9)
            {
                int digit = e.Key - Key.NumPad0;
                Interfaces.StorageInfo storage = clusterInfo.storages.FirstOrDefault(s => s.number == digit.ToString());
                string closeRes = await RentService.CloseStorage(Jwt, storage._id);
                MessageBox.Show(closeRes);
            }
        }
        public static IMainLang LangSetup()
        {
            IMainLang lang = new IMainLang();
            lang.WorkFrom = Properties.main.WorkFrom;
            lang.WorkTo = Properties.main.WorkTo;
            lang.NumberOfStorage = Properties.main.NumberOfStorage;
            lang.PriceForHour = Properties.main.PriceForHour;
            lang.VolumeOfStorage = Properties.main.VolumeOfStorage;
            lang.PriceForRenting = Properties.main.PriceForRenting;
            lang.HoursCosts = Properties.main.HoursCosts;
            lang.ButtonRent = Properties.main.ButtonRent;
            lang.RentFrom = Properties.main.RentFrom;
            lang.RentTo = Properties.main.RentTo;
            lang.PayWithTerminal = Properties.main.PayWithTerminal;
            lang.Instruction = Properties.main.Instruction;
            return lang;
        }
    }
}
