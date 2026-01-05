export const fetchAllTags = async (): Promise<string[]> => {
    try {
        const response = await fetch("http://localhost:8080/tags/all");
        if (!response.ok) throw new Error("Błąd pobierania tagów");
        return await response.json(); 
    } catch (error) {
        console.error("Tag fetch error:", error);
        return [];
    }   
};