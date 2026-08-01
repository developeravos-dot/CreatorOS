import { http } from "./http";

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api/v1";

export const apiClient = {

  get<T>(url:string){

    return http<T>(`${API_BASE}${url}`);

  },

  post<T>(url:string,body:unknown){

    return http<T>(`${API_BASE}${url}`,{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify(body),

    });

  },

  put<T>(url:string,body:unknown){

    return http<T>(`${API_BASE}${url}`,{

      method:"PUT",

      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify(body),

    });

  },

  delete<T>(url:string){

    return http<T>(`${API_BASE}${url}`,{

      method:"DELETE",

    });

  },

};
