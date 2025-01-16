<script>
    import pulmones from '/pulmones.png';
    import { translations } from './translations'; // Ajusta la ruta según corresponda
    import dog2 from "/dog2.webp";
    import logo from "/log.png";
    
  
    // Obtener el idioma desde localStorage, con un valor predeterminado de "español"
    const language = localStorage.getItem('language') || 'español';
  
    // Elegir las traducciones correspondientes al idioma
    const t = translations[language] || translations['español']; // Usar español por defecto si el idioma no está disponible
  </script>
  
  <div class="flex flex-col items-center min-h-screen bg-black font-arial text-white">
    <!-- Div blanco más grande -->
    <div class="w-11/12 max-w-4xl h-[600px] bg-white rounded-b-3xl mb-3 flex flex-col justify-between relative overflow-hidden">
      <!-- Logo en la esquina superior derecha -->
      <div class="absolute top-0 right-0 p-2 ">
        <img class="w-10 h-10" src={logo} alt="Logo" />
      </div>
  
      <!-- Contenedor flex para centrar verticalmente -->
      <div class="flex flex-col justify-center flex-grow items-center text-center  mt-14 ">
  
        
        <!-- Título centrado con texto responsivo -->
        <h1 class="text-4xl sm:text-4xl md:text-4xl lg:text-5xl text-black mb-2 font-bold">
          {t.thankYouTitle} <!-- Texto dinámico -->
        </h1>
        <h1 class="text-3xl sm:text-3xl md:text-3xl lg:text-4xl text-black mb-4 font-bold">
          {t.thankYouTitle2} <!-- Texto dinámico -->
        </h1>
        <!-- Mensaje centrado debajo del título con texto responsivo -->
        <p class="text-2xl sm:text-2xl md:text-2xl lg:text-3xl text-purple-500 mb-6 font-bold">
          {t.thankYouMessage} <!-- Texto dinámico -->
        </p>
  
  
        
  
        
      </div>
  
      <!-- Imagen del perro centrada en la parte inferior del div blanco -->
      <div class="flex items-end justify-center mb-0">
        <img class="w-64 h-64 object-cover" src={dog2} alt="Foto de un perro" />
      </div>
      
    </div>
  
   
    <!-- Div morado mucho más pequeño -->
  <div class="w-11/12 max-w-4xl h-[250px] bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900 text-white rounded-t-3xl p-4 text-center flex-grow">
    <!-- Botón desplazado hacia abajo en el borde inferior -->
  
    <p class="text-2xl sm:text-2xl md:text-2xl lg:text-3xl text-[#35b135] mb-6 font-bold">
   
    </p>
    <a href="https://wa.me/5214871956877">
      <button
      class="bg-black text-[#35b135] px-6 py-2 rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl transition duration-300 ease-in-out hover:bg-[#32CD32] hover:text-black hover:shadow-xl mt-8">
      {t.continueOnWhatsApp} <!-- Texto dinámico -->
    </button>
    
    </a>
  </div>
  
  </div>
  
  
  <style>
    /* Estilos personalizados */
  </style>
  