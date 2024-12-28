function createNoteClient() {
    let urlPrefix = "http://localhost:8001";
    const client = {
        async get<T>(endpoint: string): Promise<T> {
            try {
                const response = await fetch(`${urlPrefix}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error; // Re-throw the error after logging it
            }
        },

        async post<T>(endpoint: string, data?: unknown): Promise<T> {
            try {
                const response = await fetch(`${urlPrefix}${endpoint}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: data ? JSON.stringify(data) : undefined,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                console.error("Error posting data:", error);
                throw error; // Re-throw the error after logging it
            }
        },
    };

    return client;
}

// Eventually inject in base url from .env
const noteClient = createNoteClient();
export default noteClient;
