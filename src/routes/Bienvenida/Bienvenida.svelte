<script>
  import { onMount } from 'svelte';
  import { Link, navigate } from 'svelte-routing';
  import logo from '/log.png';
  import { getOnboardingData } from '../../api/getOnboardingData';  // Importa la función de la API

  // Obtener el userId del parámetro 'id' en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || "ID Predeterminado";

  // Ejecutar la verificación al montar el componente
  onMount(async () => {
    try {
      // Consultar la API para obtener información del usuario
      const response = await fetch('https://jjhvjvui.top/api/user/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: id
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud API: ${response.status} - ${response.statusText}`);
      }

      const userData = await response.json();
  
      // Almacenar el nombre del usuario en localStorage
      localStorage.setItem('name', userData.nombre);

      // Almacenar el ID del usuario en localStorage si es necesario
      localStorage.setItem('id', id);

      // Verificar el estado del onboarding
      const result = await getOnboardingData(id);

      if (!result.data) {
        console.log('El ID especificado no tiene un documento de onboarding asociado. Mostrar formulario o mensaje.');
      } else if (result.data.completado) {
        navigate('/Complete');
      } else {
        console.log('Cuestionario no completado. Permitir continuar en la misma página.');
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario desde la API:', error);
      navigate('/Error');
    }
  });
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-black to-purple-700">
  <div class="max-w-md w-full px-4 text-center">
    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto" />

    <h1 class="text-4xl font-bold text-white mt-12 mb-4">¡Felicidades, {localStorage.getItem('name')}!</h1>
    <img src="https://img.icons8.com/emoji/96/000000/trophy-emoji.png" alt="Imagen" class="w-24 h-auto rounded-full mb-4 mx-auto">
    <p class="text-lg text-white mb-6">Has tomado la decisión más importante de tu vida.</p>
    <p class="text-2xl text-white mb-4">¡Eres increíble!</p>
    <p class="text-lg text-white mb-8">Quiero conocerte para crear un plan.</p>
    <Link to="/Onboarding">
      <button class="bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
        Continuar
      </button>
    </Link>
  </div>
</div>

<style>
  /* Estilos personalizados */
</style>

