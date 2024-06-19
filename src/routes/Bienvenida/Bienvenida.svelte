<script>
  import { Link } from 'svelte-routing';
  import logo from '/log.png';

  // Obtener los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name') || "Nombre Predeterminado";
  const id = urlParams.get('id') || "ID Predeterminado";

  // Almacenar en localStorage
  localStorage.setItem('name', name);
  localStorage.setItem('id', id);
</script>


<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-black">
  <div class="max-w-md w-full px-4 text-center">
    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto" />

    <h1 class="text-4xl font-bold text-white mt-12 mb-4">¡Felicidades, {name}! </h1>
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
