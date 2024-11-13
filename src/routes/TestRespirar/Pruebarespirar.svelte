<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { registerTest } from "../../api/user/getRegisterTest";
    import { checkTestIdExists } from "../../api/user/getcheckTestIdExists";
    import { translations } from "./translations.js";
    import logo from "/log.png";
    import dog2 from "/dog2.webp";
    import dog1 from "/dog1.webp";

    let id = "ID Predeterminado";
    let name = "Nombre Predeterminado";
    let testId = "TestID Predeterminado";
    let circleText = "";
    let score = 0;
    let startTime = null;
    let endTime = null;
    let animationPaused = false;
    let loading = false;
    let isLoading = true;
    let exerciseFinished = false; // Nuevo estado para saber si el ejercicio ha terminado

    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get("id") || "ID Predeterminado";
    name = urlParams.get("name") || "Nombre Predeterminado";
    testId = urlParams.get("testId") || "TestID Predeterminado";
    const language = urlParams.get("language") || "español";

    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("testId", testId);
    localStorage.setItem("language", language);

    let t = translations[language] || translations["español"];

    onMount(async () => {
        try {
            const result = await checkTestIdExists();
            if (result.exists) {
                navigate("/"); // Redirigir si el testId ya está registrado
            } else if (result.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error al verificar el testId:", error);
        } finally {
            isLoading = false;
        }

        circleText = t.startButton;
    });

    function startExercise() {
    if (exerciseFinished) return; // No hacer nada si el ejercicio ya terminó
    if (!exerciseFinished) {
        startTime = new Date();
        circleText = t.stopButton;
        animationPaused = true;
    }
}


function stopExercise() {
    if (startTime && !exerciseFinished) { // Solo detener si el ejercicio no ha terminado
        endTime = new Date();
        const timeElapsed = Math.round(
            (endTime.getTime() - startTime.getTime()) / 1000,
        );
        score = timeElapsed;
        circleText = t.startButton;
        animationPaused = false;
        exerciseFinished = true; // Marcar como finalizado
    }
}

    function resetExercise() {
        if (!exerciseFinished) return; // Solo reiniciar si el ejercicio ha terminado
        score = 0;
        startTime = null;
        endTime = null;
        circleText = t.startButton;
        animationPaused = false;
        exerciseFinished = false; // Resetear a no finalizado
    }

    async function handleRegister() {
        loading = true;
        try {
            const userId = localStorage.getItem("id");
            const currentTestId = localStorage.getItem("testId");
            if (!userId) {
                console.error(t.userIdError);
                loading = false;
                return;
            }

            const result = await registerTest(userId, score, currentTestId);
            console.log(result.message);

            navigate("/Resultado");
        } catch (error) {
            console.error(t.registerError);
        } finally {
            loading = false;
        }
    }
</script>

{#if isLoading}
    <div
        class="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center font-roboto"
    >
        <div class="loading-message">{t.loading}</div>
    </div>
{:else}
    <div
        class="flex flex-col items-center min-h-screen bg-black font-arial text-white">
        <!-- Banner superior -->
        <div class="w-11/12 max-w-4xl h-48 bg-white rounded-b-3xl mb-3 flex relative overflow-hidden ">
            <!-- Imagen del perro absolutamente posicionada en la esquina inferior izquierda -->
            <div class="absolute bottom-0 left-[-25px]">
                <img class="w-44 h-44 object-cover" src={dog1} alt="Foto de un perro" />
            </div>
            
            <!-- Contenedor de texto alineado a la derecha y hacia abajo con ancho controlado -->
            <div class="text-black text-right flex flex-col items-end justify-end flex-grow pr-4 ml-auto max-w-xs mb-2">
                <!-- Logo alineado en la esquina superior derecha -->
                <div class="self-end mb-8 mr-2">
                    <img src={logo} alt="Logo" class="w-10 h-10" />
                </div>
        
                <!-- Texto de bienvenida con ajuste preciso para evitar saltos de línea innecesarios -->
                <div>
                    <h2 class="text-2xl lg:text-3xl font-bold leading-tight mb-2 max-w-[12rem] break-words">
                        {t.welcome}, {name}
                    </h2>
                    
                    <div class="text-purple-600 text-[15px] lg:text-[19px] font-semibold  max-w-[15rem] lg:max-w-full  text-right">
                        {t.warning1}
                    </div>
                    
                    <div class="text-purple-600 text-[15px] lg:text-[19px] font-semibold  max-w-[15rem] lg:max-w-full  text-right">
                        {t.warning2}
                    </div>
                    
                </div>
                
            </div>
        </div>
        
        <!-- Contenedor principal (fondo degradado morado a negro) -->
        <div
            class="w-11/12 max-w-4xl bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900 text-white rounded-t-3xl p-4 text-center flex-grow">
            <!-- Instrucciones numeradas en una sola línea -->
            <div class="text-left text-lg font-semibold lg:text-2xl lg:font-normal mb-4">
                <p class="flex items-start mb-2 flex-wrap">
                    <span class="w-6 h-6 text-xs flex items-center justify-center border-2 border-white text-white rounded-full mr-2">
                        1
                    </span>
                    <span class="flex-1">{t.step1}</span>
                </p>
                <p class="flex items-start mb-2 flex-wrap">
                    <span class="w-6 h-6 text-xs flex items-center justify-center border-2 border-white text-white rounded-full mr-2">
                        2
                    </span>
                    <span class="flex-1">{t.step2}</span>
                </p>
                <p class="flex items-start mb-2 flex-wrap">
                    <span class="w-6 h-6 text-xs flex items-center justify-center border-2 border-white text-white rounded-full mr-2">
                        3
                    </span>
                    <span class="flex-1">{t.step3}</span>
                </p>
                <p class="flex items-start mb-2 flex-wrap">
                    <span class="w-6 h-6 text-xs flex items-center justify-center border-2 border-white text-white rounded-full mr-2">
                        4
                    </span>
                    <span class="flex-1">{t.step4}</span>
                </p>
            </div>
            

            <!-- Botón para iniciar o detener ejercicio -->
            <div class="flex justify-center items-center h-48 mb-4">
                <button
                class="w-24 h-24 bg-gradient-to-tr from-fuchsia-600 to-sky-500 rounded-full flex justify-center items-center text-lg cursor-pointer transition-transform duration-300 animate-breathe no-select"
                style="animation-play-state: {animationPaused ? 'paused' : 'running'}"
                on:mousedown={startExercise} 
                on:mouseup={stopExercise} 
                on:touchstart={startExercise}
                on:touchend={stopExercise}
                aria-label={t.buttonAriaLabel}
            >
                {#if exerciseFinished}
                    <!-- Solo mostrar el puntaje dentro del botón cuando el ejercicio ha finalizado -->
                    <div class="text-center">
                        <div class="text-xs">{t.scoreLabel}</div>
                        <div class="text-sm font-bold">{score}</div>
                        <div class="text-xs">{t.scorecongrat}</div>
                    </div>
                {:else}
                    {circleText}
                {/if}
            </button>
            

             
            </div>

            <!-- Mostrar el puntaje debajo del botón solo si el ejercicio ha finalizado -->
            {#if exerciseFinished}
                <!-- Botones de Reintentar y Guardar -->
                <div class="mt-5 flex justify-center gap-5">
                    <button
                        class="py-2 px-4 rounded-full bg-black text-white text-lg {loading
                            ? 'button-disabled'
                            : ''}"
                        on:click={resetExercise}
                    >
                        {t.retryButton}
                    </button>
                    <button
                        class="py-2 px-4 rounded-full bg-green-400 text-black text-lg {loading
                            ? 'button-disabled'
                            : ''}"
                        on:click={handleRegister}
                        disabled={loading}
                    >
                        {t.registerButton}
                    </button>
                </div>
            {/if}

            {#if loading}
                <div class="text-white loading-message mt-4">
                    {t.processing}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

    @keyframes breathe {
        0%,
        100% {
            transform: scale(1.3);
        }
        50% {
            transform: scale(1.7);
        }
    }

    .animate-breathe {
        animation: breathe 4s infinite;
    }

    .button-disabled {
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.5);
        cursor: not-allowed;
    }

    .loading-message {
        font-size: 1.5rem;
        color: #ffffff;
        margin-top: 1rem;
    }
  
    .no-select {
        user-select: none;
    }


</style>
