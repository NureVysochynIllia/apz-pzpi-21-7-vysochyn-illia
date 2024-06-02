interface RentalTime {
    from: string;
    to: string;
}

interface Volume {
    height: number;
    width: number;
    length: number;
    unit: string;
}

interface StorageB {
    _id?: string;
    number: string;
    isOpened?: boolean;
    isBooked?: boolean;
    price: number;
    clusterId: string;
    volumes?: Volume[];
    statistics?: {
        rentedHours: number;
        earnings: number;
    };
}

interface Booking {
    rentalTime: RentalTime;
    _id?: string;
    price: number;
    storageId: StorageB;
    userId: string;
    __v?: number;
}