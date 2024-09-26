import AsyncStorage from "@react-native-async-storage/async-storage";

const ip1 = "http://10.0.2.2";
const ip2 = "http://192.168.0.149";

export const loginRequest = async (user: string, pass: string) => {
  try {
    const response = await fetch(`${ip1}:3001/api/v1/login`, {
      /* 192.168.1.75 */
      /* para emulador la ip es 10.0.2.2 */
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user, password: pass }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("token", data.access);
      return { success: true, data };
    } else {
      switch (response.status) {
        case 400:
          return {
            success: false,
            message: "No fue posible la conexión con la base de datos.",
          };
        case 401:
          return {
            success: false,
            message: "Correo o contraseña incorrectos.",
          };
        case 403:
          return {
            success: false,
            message: "Acceso denegado. Verifica tus credenciales.",
          };
        case 404:
          return {
            success: false,
            message: "El servicio no está disponible. Intenta más tarde.",
          };
        case 500:
          return {
            success: false,
            message: "Error en el servidor. Intenta más tarde.",
          };
        default:
          return {
            success: false,
            message: "Error desconocido. Intenta más tarde.",
          };
      }
    }
  } catch (error) {
    console.error("Error de red. Verifica tu conexión.");
  }
};

export const createTicket = async (
  start_date: string,
  end_date: string,
  type: string,
  title: string,
  description: string,
  user_id: number
) => {
  try {
    const response = await fetch(`${ip1}:3001/api/v1/XXXX`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: start_date,
        end_date: end_date,
        type: type,
        title: title,
        description: description,
        state: "pendiente",
        user_id: user_id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      switch (response.status) {
        case 400:
          return {
            success: false,
            message: "Solicitud incorrecta. Revisa los datos ingresados.",
          };
        case 403:
          return {
            success: false,
            message: "Acceso denegado. Verifica tus credenciales.",
          };
        case 404:
          return {
            success: false,
            message: "El servicio no está disponible. Intenta más tarde.",
          };
        case 500:
          return {
            success: false,
            message: "Error en el servidor. Intenta más tarde.",
          };
        default:
          return {
            success: false,
            message: "Error desconocido. Intenta más tarde.",
          };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Error de red. Verifica tu conexión.",
    };
  }
};

export const getTickets = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip1}:3001/api/v1/request/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }else {
      switch (response.status) {
        case 404:
          return {
            success: true,
            data:0,
          };
      }
    }
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    return { success: false, message: "Error de red. Verifica tu conexión." };
  }
};

export const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip1}:3001/api/v1/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }else {
      switch (response.status) {
        case 404:
          return {
            success: true,
            data:0,
          };
      }
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return { success: false, message: "Error de red. Verifica tu conexión." };
  }
};
