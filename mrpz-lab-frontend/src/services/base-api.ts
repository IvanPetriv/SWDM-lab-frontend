import type { AxiosInstance } from "axios";


/**
 * An abstract base class that provides common HTTP methods for API communication.
 * This class serves as a foundation for specific API implementations by providing
 * basic CRUD operations using Axios for HTTP requests.

 * @property {AxiosInstance} instance - The Axios instance used for making HTTP requests
 * @property {string} endpoint - The base endpoint for API requests
 * 
 * @example
 * ```typescript
 * class UserApi extends BaseApi {
 *   constructor(instance: AxiosInstance) {
 *     super(instance, 'users');
 *   }
 * }
 * ```
 */
export default abstract class BaseApi {
	protected instance: AxiosInstance;
	protected endpoint: string;

	constructor(instance: AxiosInstance, endpoint: string = "Student") {
		this.instance = instance;
		this.endpoint = endpoint;
	}

	private getUrl = (url: string) => this.endpoint ? `${this.endpoint}/${url}` : url;

	/**
	 * Sends a GET request to the specified endpoint and returns the response data.
	 *
	 * @template TGet - The expected response data type.
	 * @template TParams - The type of the query parameters (defaults to object).
	 * @param url - The relative URL to append to the endpoint.
	 * @param params - Optional query parameters to include in the request.
	 * @returns A promise that resolves to the response data of type TGet.
	 */
	protected async get<TGet, TParams = object>(url: string, params?: TParams): Promise<TGet> {
		const { data } = await this.instance.get<TGet>(this.getUrl(url), { params: params });
		return data;
	}

	/**
	 * Sends a POST request to the specified endpoint with the provided payload.
	 *
	 * @template TCreate - The type of the object to be sent in the request body.
	 * @template TGet - The type of the response data. Defaults to `TCreate` if not specified.
	 * @param url - The relative URL to append to the endpoint for the POST request.
	 * @param obj - The payload to send in the POST request body.
	 * @returns A promise that resolves to the response data of type `TGet`.
	 */
	protected async post<TCreate, TGet = TCreate>(url: string, obj: TCreate): Promise<TGet> {
		const { data } = await this.instance.post<TGet>(this.getUrl(url), obj);
		return data;
	}

	/**
	 * Sends a PUT request to the specified endpoint with the provided payload.
	 *
	 * @template TUpdate - The type of the object to be sent in the request body.
	 * @template TGet - The type of the response data. Defaults to `TUpdate` if not specified.
	 * @param url - The relative URL to append to the endpoint for the PUT request.
	 * @param obj - The payload to send in the PUT request body.
	 * @returns A promise that resolves to the response data of type `TGet`.
	 */
	protected async put<TUpdate, TGet = TUpdate>(url: string, obj: TUpdate): Promise<TGet> {
		const { data } = await this.instance.put<TGet>(this.getUrl(url), obj);
		return data;
	}

	/**
	 * Sends a DELETE request to the specified URL and returns the response data.
	 *
	 * @template TGet - The expected response data type.
	 * @param url - The endpoint URL to send the DELETE request to.
	 * @returns A promise that resolves with the response data of type `TGet`.
	 */
	protected async delete<TGet>(url: string): Promise<TGet> {
		const { data } = await this.instance.delete<TGet>(this.getUrl(url));
		return data;
	}
}
