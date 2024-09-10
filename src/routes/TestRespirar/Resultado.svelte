<script>
    import { translations } from './translations.js'; // Asegúrate de importar el archivo de traducciones

    // Imagen y texto alternativo
    let resultImageSrc = "https://img.icons8.com/emoji/96/000000/trophy-emoji.png";
    let resultImageAlt = "Trophy";

    // Obtener idioma desde localStorage, con valor predeterminado en español
    const language = localStorage.getItem("language") || "español";
    let t = translations[language] || translations["español"]; // Seleccionar las traducciones según el idioma
</script>

<div class="flex justify-center items-center h-screen bg-gradient-to-b from-purple-800 to-black text-white text-center p-5">
    <div class="max-w-md w-full">
        <h2 class="text-2xl font-bold mb-3">{t.thankYou}</h2>
        <div class="w-24 h-24 mx-auto mb-5">
            <img src={resultImageSrc} alt={resultImageAlt} class="w-full h-auto">
        </div>
        <p>{t.testRecorded}</p>
        <div class="mt-5">
            <a href="https://wa.me/5214871956877">
                <button class="bg-transparent border-2 border-[#32CD32] px-6 py-3 rounded-lg shadow-lg text-white transition duration-300 ease-in-out hover:bg-[#32CD32] hover:text-white hover:shadow-xl">
                    {t.continueWhatsApp}
                </button>
            </a>
        </div>
    </div>
</div>
