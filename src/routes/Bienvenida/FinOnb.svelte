<script>
  import pulmones from '/pulmones.png';
  import { translations } from './translations'; // Ajusta la ruta según corresponda

  // Obtener el idioma desde localStorage, con un valor predeterminado de "español"
  const language = localStorage.getItem('language') || 'español';

  // Elegir las traducciones correspondientes al idioma
  const t = translations[language] || translations['español']; // Usar español por defecto si el idioma no está disponible
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-black to-purple-700">
  <div class="max-w-md w-full px-4 text-center">
    <img
      src={pulmones}
      alt="Pulmones"
      class="w-48 h-auto mb-4 mx-auto"
    />
    <h1 class="text-3xl text-white mb-4 font-light">
      {t.thankYouTitle} <!-- Texto dinámico -->
    </h1>
    <p class="text-base text-white mb-6">
      {t.thankYouMessage} <!-- Texto dinámico -->
    </p>
    <a href="https://wa.me/5214871956877">
      <button
        class="bg-transparent border-4 border-[#32CD32] px-2 py-0.5 rounded-xl text-white transition duration-300 ease-in-out hover:bg-[#32CD32] hover:text-white hover:shadow-xl"
      >
        {t.continueOnWhatsApp} <!-- Texto dinámico -->
      </button>
    </a>
  </div>
</div>

<style>
  /* Estilos personalizados */
</style>
