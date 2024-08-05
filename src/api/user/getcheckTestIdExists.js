// /api/checkTestIdExists.js

export async function checkTestIdExists() {
    const userId = localStorage.getItem("id"); // Obtener el id de localStorage
    const testId = localStorage.getItem("testId"); // Obtener el testId de localStorage

    if (!userId || !testId) {
        console.error("ID de usuario o Test ID no encontrados en localStorage");
        return { exists: false, error: "ID de usuario o Test ID no encontrados en localStorage" };
    }

    try {
        const response = await fetch('https://jjhvjvui.top/api/test/testrespiracion/obtenerpruebas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }), // Usar el formato correcto
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error en la solicitud de verificación del testId: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        console.log("Datos recibidos para verificación:", data); // Agregar log para verificar los datos

        // Verificar si el testId ya está registrado
        return { exists: data.some(test => test.id === testId) }; // Comparar con el campo `id`
    } catch (error) {
        console.error('Error al verificar el testId:', error);
        return { exists: false, error: error.message };
    }
}
