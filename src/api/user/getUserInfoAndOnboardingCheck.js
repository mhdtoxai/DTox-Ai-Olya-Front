
import { getOnboardingData } from './getOnboardingData';  // Ajusta la ruta según sea necesario
import { navigate } from 'svelte-routing'; // Asegúrate de importar navigate desde svelte-routing

export async function getUserInfoAndOnboardingCheck(id, name) {
  try {
    const response = await fetch("https://olya.club/api/user/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error en la solicitud API: ${response.status} - ${response.statusText}`,
      );
    }

    const userData = await response.json();
    console.log("Datos del usuario:", userData);

    // Verificar si el nombre del usuario está presente en los datos de la API
    if (!userData || !userData.nombre) {
      throw new Error(
        "Datos del usuario incompletos o nombre no encontrado.",
      );
    }

    // Almacenar el nombre del usuario en localStorage si no se obtuvo de la URL
    if (!name) {
      localStorage.setItem("name", userData.nombre);
    }

    // Almacenar el ID del usuario en localStorage si es necesario
    localStorage.setItem("id", id);

    // Verificar el estado del onboarding
    const result = await getOnboardingData(id);

    if (!result.data) {
      console.log(
        "El ID especificado no tiene un documento de onboarding asociado. Mostrar formulario o mensaje.",
      );
    } else if (result.data.completado) {
      navigate("/Complete");
    } else {
      console.log(
        "Cuestionario no completado. Permitir continuar en la misma página.",
      );
    }
  } catch (error) {
    console.error(
      "Error al obtener la información del usuario desde la API:",
      error,
    );
    navigate("/Error");
  }
}
