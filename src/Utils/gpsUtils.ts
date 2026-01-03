import ExifReader from 'exifreader';

export interface GpsCoords {
    latitude: number;
    longitude: number;
}

export const getGpsFromImage = async (file: File): Promise<GpsCoords | null> => {
    try {
        const tags = await ExifReader.load(file);
        const latData = tags['GPSLatitude'];
        const longData = tags['GPSLongitude'];
        const latRef = tags['GPSLatitudeRef'];
        const longRef = tags['GPSLongitudeRef'];

        if (latData && longData) {
            let latitude = Number(latData.description);
            let longitude = Number(longData.description);

            if (isNaN(latitude) || isNaN(longitude)) return null;


            const getRefDirection = (tag: any): string => {
                if (!tag) return "";

                if (Array.isArray(tag.value) && tag.value.length > 0) {
                    const val = tag.value[0];
                    return String(val);
                }

                return tag.description || "";
            };

            const latDir = getRefDirection(latRef);
            if (latDir.toUpperCase().startsWith('S')) {
                latitude = Math.abs(latitude) * -1;
            }

            const longDir = getRefDirection(longRef);
            if (longDir.toUpperCase().startsWith('W')) {
                longitude = Math.abs(longitude) * -1;
            }

            return {
                latitude,
                longitude
            };
        }
        return null;
    } catch (error) {
        console.error("Błąd parsowania EXIF:", error);
        return null;
    }
};