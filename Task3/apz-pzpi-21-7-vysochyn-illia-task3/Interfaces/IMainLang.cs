using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Interfaces
{
    public class IMainLang
    {
        public string WorkFrom { get; set; }
        public string WorkTo { get; set; }
        public string NumberOfStorage { get; set; }
        public string PriceForHour { get; set; }
        public string VolumeOfStorage { get; set; }
        public string PriceForRenting { get; set; }
        public string HoursCosts { get; set; }
        public string ButtonRent { get; set; }
        public string RentFrom { get; set; }
        public string RentTo { get; set; }
        public string PayWithTerminal {get;set; }
        public string Instruction { get; set; }
    }
}
