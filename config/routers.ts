import AsyncStorage from "@react-native-async-storage/async-storage";

const ip1 = "http://10.0.2.2";
const ip2 = "http://192.168.0.31";

export const loginRequest = async (user: string, pass: string) => {
  try {
    const response = await fetch(`${ip2}:3001/api/v1/login`, {
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
      return {
        success: false,
        message: data.msg,
      };
    }
  } catch (error) {
    console.error("Error de red. Verifica tu conexión.");
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

    const response = await fetch(`${ip2}:3001/api/v1/request/`, {
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
      message: "Error de red. Verifica tu conexión.",
    };
  }
};

export const accessRequest = async (email: string) => {
    try {
      const response = await fetch(`${ip2}:3001/api/v1/request/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        switch (response.status) {
          case 400:
            return { success: false, message: "Solicitud incorrecta. Revisa los datos ingresados." };
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

export const getTickets = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip2}:3001/api/v1/request/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      switch (response.status) {
        case 404:
          return {
            success: true,
            data: 0,
          };
      }
    }
  } catch (error) {
   return { success: false, message: error};
  }
};

export const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip2}:3001/api/v1/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      switch (response.status) {
        case 404:
          return {
            success: true,
            data: 0,
          };
      }
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return { success: false, message: "Error de red. Verifica tu conexión." };
  }
};

export const getAssigments = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip2}:3001/api/v1/assignment/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          return {
            success: false,
            message: "No se encontraron turnos asignados.",
          };
        case 403:
          return {
            success: false,
            message: "Acceso denegado. Verifica tus credenciales.",
          };
        default:
          return {
            success: false,
            message: "Error al obtener los turnos. Intenta más tarde.",
          };
      }
    }

    const assignments = await response.json();
    const detailedShifts = [];

    for (const assignment of assignments) {
      const shiftDetails = await getShiftDetails(assignment.id_shift);
      if (shiftDetails.success) {
        detailedShifts.push({
          ...assignment,
          ...shiftDetails.data,
        });
      } else {
        console.error(`Error obteniendo detalles del turno ${assignment.id_shift}:`, shiftDetails.message);
      }
    }

    return { success: true, data: detailedShifts };

  } catch (error) {
    console.error("Error de red:", error);
    return {
      success: false,
      message: "Error de red. Verifica tu conexión.",
    };
  }
};

export const getShiftDetails = async (id_shift: string) => {
  try {
    const response = await fetch(`${ip2}:3001/api/v1/shift/${id_shift}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {

      switch (response.status) {
        case 404:
          return {
            success: false,
            message: "No se encontraro el turno",
          };
        default:
          return {
            success: false,
            message: "Error al obtener los turnos. Intenta más tarde.",
          };
      }
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error de red:", error);  
    return {
      success: false,
      message: "Error de red. Verifica tu conexión.",
    };
  }
};

export const updatePasswordRequest = async (currentPassword:String, newPassword:String) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No se encontró el token de autenticación." };
    }

    const response = await fetch(`${ip2}:3001/api/v1/user/changepassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.msg };
    } else {
      return {
        success: false,
        message: data.msg

      };
    }
  } catch (error) {
    return { success: false, message: "Error de red. Verifica tu conexión." };
  }
};
