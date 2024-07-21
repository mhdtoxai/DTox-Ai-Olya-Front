export async function updateUserState(userId, estado,timezone) {
    const body = {
      userId: userId,
      estado: estado,
      timezone: timezone // Incluye la zona horaria en el cuerpo de la solicitud

    };
  
    const response = await fetch('https://jjhvjvui.top/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json();
  }