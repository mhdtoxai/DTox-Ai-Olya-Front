<script>
    let name = "Mario"; // Cambia este valor por el nombre deseado
    let circleText = "Iniciar";
    let score = 0;
    let startTime = null;
    let endTime = null;
    let animationPaused = false;

    function startExercise() {
        startTime = new Date();
        circleText = "Fin";
        animationPaused = true;
    }

    function stopExercise() {
        if (startTime) {
            endTime = new Date();
            const timeElapsed = Math.round((endTime.getTime() - startTime.getTime()) / 1000); // Utiliza getTime() para obtener los milisegundos
            score = timeElapsed;
            circleText = "Iniciar";
            animationPaused = false;
        }
    }

    function resetExercise() {
        score = 0;
        circleText = "Iniciar";
        startTime = null;
        endTime = null;
        animationPaused = false;
    }
</script>

<div class="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-purple-800 to-black text-white text-center font-roboto">
    <div class="text-center my-10"> <!-- Reducido el margen vertical aquí -->
        <h2 class="text-3xl font-bold mb-4">¡Hola 👋 {name}!</h2> <!-- Aumentado el tamaño del título y ajustado el margen inferior -->
        <p class="mb-4">
            Es hora de tu prueba de respiración.<br>Inhala al máximo, y retén la respiración..<br>Presiona Fin cuando exhales.
        </p>
        <div class="flex justify-center items-center h-48 ">
            <button
                class="w-24 h-24 bg-gradient-to-b from-purple-800 to-purple-900 rounded-full flex justify-center items-center text-lg cursor-pointer transition-transform duration-300 animate-breathe"
                style="animation-play-state: {animationPaused ? 'paused' : 'running'}"
                on:click="{() => circleText === 'Iniciar' ? startExercise() : stopExercise()}"
                aria-label="Iniciar o detener ejercicio"
>
                {circleText}
            </button>
        </div>
        <div class="mt-4 text-xl font-bold"> <!-- Reducido el margen superior del score -->
            Tu Score: <span class="block text-4xl font-normal">{score}</span>
        </div>
        <div class="mt-5 flex justify-center gap-5">
            <button class="py-2 px-6 border-2 border-purple-800 rounded-full bg-transparent text-purple-800 text-lg cursor-pointer transition duration-300 hover:bg-purple-800 hover:text-white" on:click="{resetExercise}">Reintentar</button>
            <button class="py-2 px-6 border-2 border-[#32CD32] rounded-full bg-transparent text-green-400 text-lg cursor-pointer transition duration-300 hover:bg-[#32CD32] hover:text-white">Registrar</button>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.5); } /* Ajusta el tamaño del círculo durante la animación */
    }

    .animate-breathe {
        animation: breathe 8s infinite;
    }
</style>
