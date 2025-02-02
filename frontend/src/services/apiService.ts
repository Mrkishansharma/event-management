import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

class ApiConstants {
  static baseURL: string = 'http://localhost:3000';

  //=============== API SERVICE ====================
  static documentService: string = '/api/document-service';
  
  //=============== ENDPOINTS =================
  static checkDocument: string = '/check-document';
  static getAllDocuments: string = '/get-all-documents';
  static downloadReport: string = '/download-report';
}

class ApiService {
  private static async request<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, data?: any): Promise<AxiosResponse<T>> {
    try {
        let headers: RawAxiosRequestHeaders = {};
        if((data instanceof FormData)) {
          headers['Content-Type'] = 'multipart/form-data'
        }
        else {
          headers['Content-Type'] = 'application/json';
        }
        
        const response: AxiosResponse<T> = await axios({
          method,
          url,
          data,
          headers,
        });

        switch (response.status) {
            case 200:
            case 201:
            return response;
            case 400:
            throw new Error(`Bad Request: ${response.data || 'Unknown error'}`);
            case 401:
            throw new Error(`Unauthorized: ${response.data || 'Unknown error'}`);
            case 403:
            throw new Error(`Forbidden: ${response.data || 'Unknown error'}`);
            case 404:
            throw new Error(`Not Found: ${response.data || 'Unknown error'}`);
            case 500:
            throw new Error(`Internal Server Error: ${response.data || 'Unknown error'}`);
            default:
            throw new Error(`Unexpected error: ${response.data || 'Unknown error'}`);
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('API request failed:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
  }


  static getRestCall<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>('GET', url);
  }

  static postRestCall<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  static putRestCall<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  static patchRestCall<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.request<T>('PATCH', url, data);
  }

  static deleteRestCall<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>('DELETE', url);
  }
}


export { ApiService, ApiConstants };