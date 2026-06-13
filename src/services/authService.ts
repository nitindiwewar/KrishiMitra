// import {api} from "./api";

// export interface UserSession {
//   userId: number;
//   token: string;
//   message: string;
//   role: string;

//   name?: string;
//   mobile?: string;

//   village?: string;
//   district?: string;
//   state?: string;

//   loginTime?: string;
// }

// export interface UserRecord {
//   id?: number;

//   name: string;
//   mobile: string;
//   password: string;

//   village: string;
//   district: string;
//   state: string;

//   role?: string;
// }

// export const authService = {

//   // REGISTER
//   async registerUser(user: UserRecord) {

//     const response = await api.post(
//       "/api/auth/register",
//       user
//     );

//     return response.data;
//   },

//   // LOGIN USER
//   async loginUser(
//     mobile: string,
//     password: string
//   ): Promise<UserSession> {

//     const response = await api.post(
//       "api/auth/login",
//       {
//         mobile,
//         password,
//       }
//     );

//     const data = response.data;

//     // Login Failed
//     if (!data.userId || !data.token) {
//       throw new Error(
//         data.message || "Login Failed"
//       );
//     }

//     const session: UserSession = {
//       userId: data.userId,
//       token: data.token,
//       message: data.message,
//       role: data.role || "user",

//       name: data.name,
//       mobile: data.mobile,

//       village: data.village,
//       district: data.district,
//       state: data.state,

//       loginTime: new Date().toISOString(),
//     };

//     localStorage.setItem(
//       "userSession",
//       JSON.stringify(session)
//     );

//     return session;
//   },

//   // LOGIN ADMIN
//   async loginAdmin(
//     email?: string,
//     password?: string
//   ): Promise<UserSession> {

//     const response = await api.post(
//       "/api/auth/admin/login",
//       {
//         email,
//         password,
//       }
//     );

//     const data = response.data;

//     if (!data.userId || !data.token) {
//       throw new Error(
//         data.message || "Admin Login Failed"
//       );
//     }

//     const session: UserSession = {
//       userId: data.userId,
//       token: data.token,
//       message: data.message,
//       role: data.role || "admin",

//       name: data.name || "Admin",

//       loginTime: new Date().toISOString(),
//     };

//     localStorage.setItem(
//       "userSession",
//       JSON.stringify(session)
//     );

//     return session;
//   },

//   // GET CURRENT USER
//   getCurrentUser(): UserSession | null {

//     const session =
//       localStorage.getItem("userSession");

//     return session
//       ? JSON.parse(session)
//       : null;
//   },

//   // LOGOUT
//   logout() {

//     localStorage.removeItem(
//       "userSession"
//     );
//   },
// };

import { api } from "./api";

export interface UserSession {
  userId: number;
  token: string;
  message: string;
  role: string;

  name?: string;
  mobile?: string;

  village?: string;
  district?: string;
  state?: string;

  loginTime?: string;
}

export interface UserRecord {
  id?: number;

  name: string;
  mobile: string;
  password: string;

  village: string;
  district: string;
  state: string;

  role?: string;
}

export const authService = {

  // REGISTER
  async registerUser(user: UserRecord) {
    const response = await api.post(
      "/api/auth/register",
      user
    );

    return response;
  },

  // LOGIN USER
  async loginUser(
    mobile: string,
    password: string
  ): Promise<UserSession> {

    const data: any = await api.post(
      "/api/auth/login",
      {
        mobile,
        password,
      }
    );

    console.log("Login Response:", data);

    if (!data?.userId || !data?.token) {
      throw new Error(
        data?.message || "Login Failed"
      );
    }

    const session: UserSession = {
      userId: data.userId,
      token: data.token,
      message: data.message,
      role: data.role || "user",

      name: data.name,
      mobile: data.mobile,

      village: data.village,
      district: data.district,
      state: data.state,

      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(
      "userSession",
      JSON.stringify(session)
    );

    return session;
  },

  // LOGIN ADMIN
  async loginAdmin(
    email?: string,
    password?: string
  ): Promise<UserSession> {

    const data: any = await api.post(
      "/api/auth/admin/login",
      {
        email,
        password,
      }
    );

    if (!data?.userId || !data?.token) {
      throw new Error(
        data?.message || "Admin Login Failed"
      );
    }

    const session: UserSession = {
      userId: data.userId,
      token: data.token,
      message: data.message,
      role: data.role || "admin",

      name: data.name || "Admin",

      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(
      "userSession",
      JSON.stringify(session)
    );

    return session;
  },

  // GET CURRENT USER
  getCurrentUser(): UserSession | null {
    const session =
      localStorage.getItem("userSession");

    return session
      ? JSON.parse(session)
      : null;
  },

  // LOGOUT
  logout() {
    localStorage.removeItem("userSession");
  },
};
