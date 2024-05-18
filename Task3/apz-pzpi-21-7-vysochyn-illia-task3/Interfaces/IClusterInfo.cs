using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace apz_pzpi_21_7_vysochyn_illia_task3.Interfaces
{
    public class IClusterInfo
    {
        public ClusterInfo cluster { get; set; }
        public List<StorageInfo> storages { get; set; }
    }

    public class ClusterInfo
    {
        public LocationInfo location { get; set; }
        public WorkTimeInfo workTime { get; set; }
        public string _id { get; set; }
        public string name { get; set; }
        public string city { get; set; }
        public string type { get; set; }
    }
    public class LocationInfo
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class WorkTimeInfo
    {
        public string from { get; set; }
        public string to { get; set; }
    }

    public class StorageInfo
    {
        public string _id { get; set; }
        public string number { get; set; }
        public bool isOpened { get; set; }
        public bool isBooked { get; set; }
        public int price { get; set; }
        public string clusterId { get; set; }
        public List<VolumeInfo> volumes {get; set;} 
    }
    public class VolumeInfo
    {
        public float height { get; set; }
        public float width { get; set; }
        public float length { get; set; }
        public string unit { get; set; }
    }
}
