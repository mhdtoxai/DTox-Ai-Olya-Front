const BASE_URL = 'https://jjhvjvui.top/api/test/testrespiracion';

// Obtener el número de pruebas registradas
export async function getTestCount(userId) {
    try {
        const response = await fetch(`${BASE_URL}/contarpruebas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el número de pruebas:', error);
        throw error;
    }
}
