function createNoteClient() {
    let urlPrefix = "http://localhost:8001";
    const client = {
        async get<T>(endpoint: string): Promise<T> {
            const response = await fetch(`${urlPrefix}${endpoint}`);
            return response.json();
        },
        
        async post<T>(endpoint: string, data?: unknown): Promise<T> {
            const response = await fetch(`${urlPrefix}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data ? JSON.stringify(data) : undefined
            });
            return response.json();
        }
    };
    
    return client;
}

// Eventually inject in base url from .env
const noteClient = createNoteClient();
export default noteClient;
