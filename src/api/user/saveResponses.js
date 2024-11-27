export async function saveResponses(userId, responses) {
    const body = {
      userId: userId,
      respuestas: responses
    };
  
    try {
      const response = await fetch('https://olya.club/api/saveResponses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // No es necesario procesar la respuesta JSON
      console.log('Respuestas enviadas correctamente a la API.');
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
      throw error; // Vuelve a lanzar el error para que lo maneje el código que llama a esta función
    }
  }
  