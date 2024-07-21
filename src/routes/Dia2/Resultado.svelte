<script>
    let percentileValue = 56; // Reemplaza esto con el valor real de tu base de datos

    let resultImageSrc;
    let resultImageAlt;
    
    if (percentileValue >= 0) {
        resultImageSrc = "https://img.icons8.com/emoji/96/000000/trophy-emoji.png";
        resultImageAlt = "Trophy";
    } else {
        resultImageSrc = "https://img.icons8.com/emoji/96/000000/sad-but-relieved-face.png";
        resultImageAlt = "Sad Face";
    }
</script>

<div class="flex justify-center items-center h-screen bg-gradient-to-b from-purple-800 to-black text-white text-center p-5">
    <div class="max-w-md w-full">
        <h2 class="text-2xl font-bold mb-3">¡GRACIAS!</h2>
        <div class="w-24 h-24 mx-auto mb-5">
            <img src={resultImageSrc} alt={resultImageAlt} class="w-full h-auto">
        </div>
        <div class="mb-5">
            <p>Tu resultado de la prueba de capacidad pulmonar ha sido registrado.</p>
            <p>Has mejorado tu capacidad pulmonar en un {Math.abs(percentileValue)}%</p>
        </div>
        <div class="mt-5">
            <a href="https://www.whatsapp.com" class="inline-block py-2 px-6 border-2 border-[#32CD32] rounded-full bg-transparent text-green-400 text-lg cursor-pointer transition duration-300 hover:bg-[#32CD32] hover:text-white">
                Ir a WhatsApp
            </a>
        </div>
    </div>
</div>
