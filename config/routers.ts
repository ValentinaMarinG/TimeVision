import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginRequest = async (user: string, pass: string) => {
  try {
    const response = await fetch("http://192.168.0.17:3001/api/v1/login", {
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
            message: "Solicitud incorrecta. Revisa los datos ingresados.",
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
    console.error("Error al iniciar sesión:", error);
  }
};

const getBlobFromUri = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export const createRequest = async (
  start_date: Date | null,
  end_date: Date | null,
  type: string,
  title: string,
  description: string,
  imageUri: string | null
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No se encontró el token de autenticación.",
      };
    }

    console.log("token", token);

    const formData = new FormData();
    formData.append("start_date", start_date?.toISOString() || "");
    formData.append("end_date", end_date?.toISOString() || "");
    formData.append("type", type);
    formData.append("title", title);
    formData.append("description", description);

    if (imageUri) {
      const imageBlob = await getBlobFromUri(imageUri);
      formData.append("attach", imageBlob);
    }

    const response = await fetch("http://192.168.0.17:3001/api/v1/request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
       body: JSON.stringify({
        start_date: start_date,
        end_date: end_date,
        type: type,
        title: title,
        description: description
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
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
      message: "Error de red o servidor. Verifica tu conexión.",
    };
  }
};

export const accessRequest = async (email: string) => {
    try {
      const response = await fetch('xxxxxxxxx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        switch (response.status) {
          case 400:
            return { success: false, message: "Solicitud incorrecta. Revisa los datos ingresados." };
          case 401:
            return { success: false, message: "Correo o contraseña incorrectos." };
          case 403:
            return { success: false, message: "Acceso denegado. Verifica tus credenciales." };
          case 404:
            return { success: false, message: "El servicio no está disponible. Intenta más tarde." };
          case 500:
            return { success: false, message: "Error en el servidor. Intenta más tarde." };
          default:
            return { success: false, message: "Error desconocido. Intenta más tarde." };
        }
      }
    } catch (error) {
      return { success: false, message: "Error de red o servidor. Verifica tu conexión." };
    }
  };
