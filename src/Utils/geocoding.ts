interface AddressResult {
    addressName: string;
    addressRegion: string;
    addressCountry: string;
}

export const fetchAddressFromCoords = async (lat: number, lng: number): Promise<AddressResult | null> => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'pl'
            }
        });

        if (!response.ok) {
            throw new Error("Błąd geokodowania");
        }

        const data = await response.json();
        const address = data.address;

        if (!address) return null;

        const city = address.city || address.town || address.village || address.hamlet || address.municipality || "";

        const street = address.road || "";

        const name = city ? (street ? `${street}, ${city}` : city) : street;

        return {
            addressName: name || "Nieznana lokalizacja",
            addressRegion: address.state || address.county || "",
            addressCountry: address.country || ""
        };

    } catch (error) {
        console.error("Błąd pobierania adresu:", error);
        return null;
    }
};