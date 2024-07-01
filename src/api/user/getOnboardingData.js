// api/onboarding.js

export const getOnboardingData = async (senderId) => {
    try {
      const response = await fetch('https://jjhvjvui.top/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId }), // Asegúrate de enviar el senderId en el cuerpo de la solicitud
      });
  
      if (response.status === 404) {
        return { status: 404, data: null };
      } else if (response.status === 200) {
        const data = await response.json();
        return { status: 200, data: data };
      } else {
        console.error('Error al obtener los datos de onboarding:', response.statusText);
        return { status: response.status, data: null };
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return { status: 500, data: null };
    }
  };
  