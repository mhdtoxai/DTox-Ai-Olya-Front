const BASE_URL = 'https://jjhvjvui.top/api/test/testrespiracion';

// Registrar una nueva prueba
export async function registerTest(userId, score, testId) {
    try {
        const response = await fetch(`${BASE_URL}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, score, testId }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error al registrar el test:', error);
        throw error;
    }
}
