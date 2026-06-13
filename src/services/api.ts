// // src/services/api.ts

// // import { api } from "./api";

// const BASE_URL = "http://localhost:8080/";

// function getAuthHeader(): Record<string, string> {
//   const token = localStorage.getItem("krishimitra_token");

//   if (token) {
//     return {
//       Authorization: `Bearer ${token}`,
//     };
//   }

//   return {};
// }

// export const api = {
//   async get<T = any>(endpoint: string): Promise<T> {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeader(),
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();

//       throw new Error(
//         `Server Error: ${response.status} ${errorText}`
//       );
//     }

//     return response.json();
//   },

//   async post<T = any>(endpoint: string, body: any): Promise<T> {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeader(),
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();

//       throw new Error(
//         `Server Error: ${response.status} ${errorText}`
//       );
//     }

//     return response.json();
//   },

//   async put<T = any>(endpoint: string, body: any): Promise<T> {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeader(),
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();

//       throw new Error(
//         `Server Error: ${response.status} ${errorText}`
//       );
//     }

//     return response.json();
//   },

//   async delete<T = any>(endpoint: string): Promise<T> {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeader(),
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();

//       throw new Error(
//         `Server Error: ${response.status} ${errorText}`
//       );
//     }

//     return response.json();
//   },
// };

// // export default api;

// src/services/api.ts

const BASE_URL = "https://krishimitra-backend-production.up.railway.app";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("krishimitra_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return (await response.text()) as T;
}

export const api = {
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return parseResponse<T>(response);
  },

  async post<T = any>(
    endpoint: string,
    body: any
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return parseResponse<T>(response);
  },

  async put<T = any>(
    endpoint: string,
    body: any
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return parseResponse<T>(response);
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return parseResponse<T>(response);
  },
};
