<script>
  import logo from '/log.png';
  import { translations } from './translations'; // Ajusta la ruta según corresponda

  // Obtener el idioma desde localStorage, con un valor predeterminado de "español"
  const language = localStorage.getItem('language') || 'español';

  // Elegir las traducciones correspondientes al idioma
  const t = translations[language] || translations['español']; // Usar español por defecto si el idioma no está disponible
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900">
  <div class="max-w-md w-full px-4 text-center">
    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto" />
    <img
      src="https://img.icons8.com/emoji/96/nikita-clapping-hands-emoji.png"
      alt="Imagen"
      class="w-24 h-auto rounded-full mb-4 mx-auto"
    />
    <h1 class="text-4xl font-bold text-white mb-4">
      {t.questionnaireCompleted} <!-- Texto dinámico -->
    </h1>
    
    <a href="https://wa.me/5214871956877">
      <button
        class="bg-transparent border-2 border-[#32CD32] px-6 py-3 rounded-lg shadow-lg text-white transition duration-300 ease-in-out hover:bg-[#32CD32] hover:text-white hover:shadow-xl"
      >
        {t.continueOnWhatsApp} <!-- Texto dinámico -->
      </button>
    </a>
  </div>
</div>

<style>
  /* Estilos personalizados */
</style>

