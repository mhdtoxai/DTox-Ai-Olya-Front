export async function updateUserState(userId, estado) {
    const body = {
      userId: userId,
      estado: estado
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