import AsyncStorage from "@react-native-async-storage/async-storage";
import JSEncrypt from "jsencrypt";
import { Buffer } from 'buffer';

const ip = "http://192.168.1.21:3001";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1JdP5oyqwODB26qcwuKR
DbI09S/3zWHvVE4TJfjui1NRPE9eU7X4DNFn1WznA14MRmzbYknO5CNghXoN1PyL
QUWhTv8brUYjM70a0+GrHaRIC32oDLACUB5hhMWTNoRzcWA7VgUxoqGmeK2EPcqO
w7uC8mCXzoSU8R3U4S5OFHbFJH1QpoDMAIItamGFkGODeJ5nm4LtzXgCCCb+SJS3
qXgW26xB5WKfROUi0WGAgWzCdr9bGQWY12/K6J5TxX9sby/nVQ3gyQIepdyQ2tPO
yqYXvVm0K22oj6TR1fTUVk8vdKvHz5DDrMEYD8CvUO63cXKBlGQ5/sofzWiNu7Xu
BwIDAQAB
-----END PUBLIC KEY-----`;

const secretKey = 'locadelpereira';

const encryptPassword = (password: string): string => {
  // Usamos base64 como método de codificación simple
  return Buffer.from(password).toString('base64');
};

export const loginRequest = async (user: string, pass: string) => {
  try {
    const encodedPassword = encryptPassword(pass);

    const response = await fetch(`${ip}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        email: user, 
        password: encodedPassword 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("token", data.access);
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.msg || "Error en el inicio de sesión",
      };
    }
  } catch (error) {
    console.error("Error completo:", error);
    return {
      success: false,
      message: "Error de red. Verifica tu conexión."
    };
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
      const extension = imageUri.split('.').pop() || 'jpg';
      
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; 
      const fileName = `incapacidad_medica_${formattedDate}.${extension}`;
      
      const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'pdf': 'application/pdf'
      };
      const type = mimeTypes[extension.toLowerCase()] || 'image/jpeg';
      
      formData.append("attach", {
        uri: imageUri,
        name: fileName,
        type,
      } as any);
    }

    const response = await fetch(`${ip}/api/v1/request/`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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
    console.error('Error en createRequest:', error);
    return {
      success: false,
      message: "Error de red. Verifica tu conexión.",
    };
  }
};

export const accessRequest = async (email: string) => {
  try {
    console.log('Enviando solicitud de reset para:', email);
    
    const response = await fetch(`${ip}/api/v1/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    console.log('Respuesta del servidor:', response.status);
    const data = await response.json();
    console.log('Datos de respuesta:', data);
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { 
        success: false, 
        message: data.msg || "Error al procesar la solicitud" 
      };
    }
  } catch (error) {
    console.error('Error completo:', error);
    return { 
      success: false, 
      message: "Error de red. Verifica tu conexión." 
    };
  }
};

export const verifyResetCode = async (email: string, code: string) => {
  try {
    const response = await fetch(`${ip}/api/v1/reset-password/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    const data = await response.json();
    return { success: response.ok, message: data.msg };
  } catch (error) {
    return { 
      success: false, 
      message: "Error de red. Verifica tu conexión." 
    };
  }
};

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  try {
    const response = await fetch(`${ip}/api/v1/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token, newPassword }),
    });

    const data = await response.json();
    return { success: response.ok, message: data.msg };
  } catch (error) {
    return { 
      success: false, 
      message: "Error de red. Verifica tu conexión." 
    };
  }
};

export const getTickets = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${ip}/api/v1/request/me`, {
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
    const response = await fetch(`${ip}/api/v1/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const department = await getUserDepartment(data.id_department);

    data.department_name = department?.data.name;

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
    const response = await fetch(`${ip}/api/v1/assignment/me`, {
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
    const response = await fetch(`${ip}/api/v1/shift/${id_shift}`, {
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

    const response = await fetch(`${ip}/api/v1/user/changepassword`, {
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

export const updateProfilePhoto = async (formData: FormData) => {
  const token = await AsyncStorage.getItem("token");
  
  const response = await fetch(`${ip}/api/v1/user/photo`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.photo; 
};

export const getUserDepartment = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token. Inicia sesión nuevamente.");
    }

    const response = await fetch(`${ip}/api/v1/department/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, data: data };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al obtener el departamento del usuario",
    };
  }
};