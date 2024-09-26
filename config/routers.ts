export const createTicket = async (
  start_date: string,
  end_date: string,
  type: string,
  title: string,
  description: string,
  user_id: number
) => {
  try {
    const response = await fetch("xxxxxxxxx", {
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
      })
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
      message: "Error de red o servidor. Verifica tu conexión.",
    };
  }
};
