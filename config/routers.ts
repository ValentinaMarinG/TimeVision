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