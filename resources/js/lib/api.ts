type ApiValidationErrors = Record<string, string[]>;

type ApiErrorPayload = {
    message?: string;
    errors?: ApiValidationErrors;
};

export class ApiRequestError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly errors?: ApiValidationErrors,
    ) {
        super(message);
        this.name = 'ApiRequestError';
    }
}

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        ...init,
    });

    if (!response.ok) {
        let payload: ApiErrorPayload | null = null;

        try {
            payload = (await response.json()) as ApiErrorPayload;
        } catch {
            payload = null;
        }

        const firstValidationError = payload?.errors
            ? Object.values(payload.errors).flat()[0]
            : undefined;

        const message = firstValidationError
            ?? payload?.message
            ?? 'Request failed. Please try again.';

        throw new ApiRequestError(message, response.status, payload?.errors);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
