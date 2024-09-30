import AsyncStorage from '@react-native-async-storage/async-storage';

export const createTicket = async (
  start_date: Date | null,
  end_date: Date | null,
  type: string,
  title: string,
  description: string
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      return {
        success: false,
        message: "No se encontró el token de autenticación.",
      };
    }

    const response = await fetch("http://127.0.0.1:3001/api/v1/request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
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
      console.log(data)
      return { success: true, data };
    } else {
      switch (response.status) {
        case 400:
          return {
            success: false,
            message: "Solicitud incorrecta. Revisa los datos ingresados."
          };
        case 403:
          return {
            success: false,
            message: "Acceso denegado. Verifica tus credenciales."
          };
        case 404:
          return {
            success: false,
            message: "El servicio no está disponible. Intenta más tarde."
          };
        case 500:
          return {
            success: false,
            message: "Error en el servidor. Intenta más tarde."
          };
        default:
          return {
            success: false,
            message: "Error desconocido. Intenta más tarde."
          };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Error de red o servidor. Verifica tu conexión."
    };
  }
};
