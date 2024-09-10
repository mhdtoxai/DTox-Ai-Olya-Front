<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { registerTest } from '../../api/user/getRegisterTest';
    import { checkTestIdExists } from '../../api/user/getcheckTestIdExists';
    import { translations } from './translations.js'; // Importar traducciones

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

    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get("id") || "ID Predeterminado";
    name = urlParams.get("name") || "Nombre Predeterminado";
    testId = urlParams.get("testId") || "TestID Predeterminado";
    const language = urlParams.get("language") || "español"; // Obtener el idioma desde la URL, valor predeterminado en español

    // Guardar en localStorage
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("testId", testId);
    localStorage.setItem("language", language); // Guardar el idioma en localStorage

    // Obtener el idioma seleccionado desde localStorage, con valor predeterminado en español
    let t = translations[language] || translations["español"]; // Usar traducción para el idioma seleccionado

    onMount(async () => {
        try {
            // Verificar si el testId ya está registrado
            const result = await checkTestIdExists();
            if (result.exists) {
                navigate('/'); // Redirigir a la raíz si el testId ya está registrado
            } else if (result.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error al verificar el testId:', error);
        } finally {
            isLoading = false; // Desactivar el estado de carga inicial
        }

        // Configurar el texto del botón según el idioma
        circleText = t.startButton; // Usar traducción para el texto del botón
    });

    function startExercise() {
        startTime = new Date();
        circleText = t.stopButton; // Cambiar texto del botón al iniciar
        animationPaused = true;
    }

    function stopExercise() {
        if (startTime) {
            endTime = new Date();
            const timeElapsed = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
            score = timeElapsed;
            circleText = t.startButton; // Cambiar texto del botón al detener
            animationPaused = false;
        }
    }

    function resetExercise() {
        score = 0;
        circleText = t.startButton; // Reiniciar texto del botón
        startTime = null;
        endTime = null;
        animationPaused = false;
    }

    async function handleRegister() {
        loading = true; // Activar el estado de carga
        try {
            const userId = localStorage.getItem("id");
            const currentTestId = localStorage.getItem("testId");
            if (!userId) {
                console.error(t.userIdError);
                loading = false; // Desactivar el estado de carga
                return;
            }

            // Registrar la nueva prueba
            const result = await registerTest(userId, score, currentTestId);
            console.log(result.message);

            // Redirigir a la pantalla de resultados
            navigate('/Resultado');
        } catch (error) {
            console.error(t.registerError);
        } finally {
            loading = false; // Desactivar el estado de carga después de completar
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.5); }
    }

    .animate-breathe {
        animation: breathe 8s infinite;
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
</style>

{#if isLoading}
<div class="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-purple-800 to-black text-white text-center font-roboto">
    <div class="loading-message">{t.loading}</div>
</div>
{:else}
    <div class="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-purple-800 to-black text-white text-center font-roboto">
        <div class="text-center my-10">
            <h2 class="text-3xl font-bold mb-4">{t.greeting} {name}!</h2>
            <p class="mb-4">
                {t.instructions}
            </p>
            <div class="flex justify-center items-center h-48">
                <button
                    class="w-24 h-24 bg-gradient-to-b from-purple-800 to-purple-900 rounded-full flex justify-center items-center text-lg cursor-pointer transition-transform duration-300 animate-breathe"
                    style="animation-play-state: {animationPaused ? 'paused' : 'running'}"
                    on:click="{() => circleText === t.startButton ? startExercise() : stopExercise()}"
                    aria-label="{t.buttonAriaLabel}"
                >
                    {circleText}
                </button>
            </div>
            <div class="mt-4 text-xl font-bold">
                {t.scoreLabel}: <span class="block text-4xl font-normal">{score}</span>
            </div>
            <div class="mt-5 flex justify-center gap-5">
                <button class="py-2 px-6 border-2 border-purple-800 rounded-full bg-transparent text-purple-800 text-lg cursor-pointer transition duration-300 hover:bg-purple-800 hover:text-white {loading ? 'button-disabled' : ''}" on:click="{resetExercise}">{t.retryButton}</button>
                <button class="py-2 px-6 border-2 border-[#32CD32] rounded-full bg-transparent text-green-400 text-lg cursor-pointer transition duration-300 hover:bg-[#32CD32] hover:text-white {loading ? 'button-disabled' : ''}" on:click="{handleRegister}" disabled={loading}>{t.registerButton}</button>
            </div>
            {#if loading}
                <div class="text-white loading-message">{t.processing}</div>
            {/if}
        </div>
    </div>
{/if}

