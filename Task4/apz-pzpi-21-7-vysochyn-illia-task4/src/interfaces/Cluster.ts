interface LocationC {
    type: string;
    coordinates: Coordinates;
}

type Coordinates = [number, number];

interface WorkTime {
    from: string;
    to: string;
}

interface Cluster {
    location: LocationC;
    workTime: WorkTime;
    _id?: string;
    name: string;
    city: string;
    type: string;
    __v?: number;
    storages?:StorageB[]
}