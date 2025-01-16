<script>
    import { onMount } from "svelte";
    import { translations } from "./translations.js";
    import logo from "/log.png";
    import dog1 from "/dog1.webp";
    import { navigate } from "svelte-routing";

    // Obtener parámetros desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id") || "ID Predeterminado";
    const name = urlParams.get("name") || "Nombre Predeterminado";
    const language = urlParams.get("language") || "español"; // Valor predeterminado en español

    // Almacenar el nombre y el idioma en localStorage si están presentes en la URL
    if (name) {
        localStorage.setItem("name", name);
    }
    if (language) {
        localStorage.setItem("language", language);
    }
    if (id) {
        localStorage.setItem("id", id);
    }

    // Obtener el idioma seleccionado desde localStorage, con valor predeterminado en español
    const currentLanguage = localStorage.getItem("language") || "español";
    let t = translations[language] || translations["español"]; // Seleccionar las traducciones según el idioma

    let formData = {}; // Para almacenar las preguntas y sus respuestas
    let currentQuestionIndex = 0; // Para llevar el control de la pregunta actual
    let responses = []; // Para almacenar las respuestas del usuario
    let isLoading = true; // Estado para mostrar cargando mientras obtenemos los datos
    let isSubmitting = false; // Controlar el estado del botón (enviando respuestas o no)

    // Función para obtener las preguntas desde la API
    async function fetchQuestions() {
        try {
            const response = await fetch(
                `https://olya.club/api/formOpiniones/opiniones/${currentLanguage}`,
            );
            const data = await response.json();

            // Verificamos que los datos tengan las preguntas
            if (data && data.preguntas) {
                formData = data; // Almacenamos las preguntas en formData
                // Inicializamos las respuestas en base a las preguntas obtenidas
                formData.preguntas.forEach((pregunta) => {
                    responses.push({
                        id: pregunta.id,
                        respuesta: "", // Respuesta vacía por defecto
                    });
                });
                isLoading = false;
            } else {
                console.error(
                    "No se encontraron preguntas en la respuesta de la API.",
                );
                isLoading = false;
            }
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
            isLoading = false;
        }
    }

    // Cargar las preguntas al montar el componente
    onMount(() => {
        fetchQuestions();
    });

    // Ir a la siguiente pregunta
    function goToNextQuestion() {
        if (responses[currentQuestionIndex].respuesta === "") {
            alert("Por favor, selecciona una respuesta.");
            return;
        }
        if (currentQuestionIndex < formData.preguntas.length - 1) {
            currentQuestionIndex++;
        }
    }

    // Ir a la pregunta anterior
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
        }
    }

    // Función para actualizar la respuesta seleccionada (para radio buttons)
    function updateResponse(input) {
        responses[currentQuestionIndex].respuesta = input;
        console.log(
            "Respuestas actuales en formato JSON (Radio):",
            JSON.stringify(responses, null, 2),
        ); // Imprime en formato JSON para respuestas tipo "radio"
    }

    // Función para actualizar la respuesta escrita en el campo de texto
    function updateTextResponse(event) {
        const responseText = event.target.value;
        responses[currentQuestionIndex].respuesta = responseText;
        console.log(
            "Respuestas actuales en formato JSON (Texto):",
            JSON.stringify(responses, null, 2),
        ); // Imprime en formato JSON para respuestas tipo "texto"
    }

    // Función para enviar las respuestas
    async function submitAnswers() {
        // Verificar que todas las preguntas han sido respondidas
        const allAnswered = responses.every(
            (response) => response.respuesta !== "",
        );

        if (!allAnswered) {
            alert("Por favor, responde todas las preguntas antes de enviar.");
            return;
        }

        const userId = localStorage.getItem("id") || "ID Predeterminado";
        const respuestas = responses.map((response) => {
            const pregunta = formData.preguntas.find(
                (p) => p.id === response.id,
            );
            return {
                id: response.id,
                texto: pregunta?.texto || "Pregunta no disponible",
                respuesta: response.respuesta,
            };
        });

        const dataToSend = {
            userId: userId,
            respuestas: respuestas,
        };

        try {
            // Cambiar el estado de 'isSubmitting' a 'true' para indicar que estamos enviando
            isSubmitting = true;
            const response = await fetch(
                "https://olya.club/api/saveResponsesgOpinions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                },
            );

            if (response.ok) {
                navigate("/FinalEnc");
                // Aquí podrías redirigir a otra página o reiniciar el formulario si lo deseas
            } else {
                alert(
                    "Hubo un error al enviar las respuestas. Intenta de nuevo.",
                );
            }
        } catch (error) {
            console.error("Error al enviar las respuestas:", error);
            alert("Hubo un error al enviar las respuestas. Intenta de nuevo.");
        } finally {
            // Cambiar el estado de 'isSubmitting' a 'false' para permitir que el botón vuelva a aparecer si hubo un error
            isSubmitting = false;
        }
    }
</script>

<div
    class="flex flex-col items-center min-h-screen bg-black font-arial text-white"
>
    <!-- Banner superior -->
    <div
        class="w-11/12 max-w-4xl h-48 bg-white rounded-b-3xl mb-3 flex relative overflow-hidden"
    >
        <div class="absolute bottom-0 left-[-25px]">
            <img
                class="w-44 h-44 object-cover"
                src={dog1}
                alt="Foto de un perro"
            />
        </div>

        <div
            class="text-black text-right flex flex-col items-end justify-end flex-grow pr-4 ml-auto max-w-xs mb-2"
        >
            <div class="self-end mb-12">
                <img src={logo} alt="Logo" class="w-10 h-10" />
            </div>
            <div>
                <h2
                    class="text-2xl lg:text-3xl font-bold leading-tight mb-2 max-w-[12rem] break-words"
                >
                    {t.welcome}, {name}
                </h2>
                <div
                    class="text-purple-600 text-[15px] lg:text-[19px] font-semibold max-w-[15rem] lg:max-w-full text-right leading-none m-0.5"
                >
                    {t.warning1}
                </div>
                <div
                    class="text-purple-600 text-[15px] lg:text-[19px] font-semibold max-w-[15rem] lg:max-w-full text-right leading-none m-0.5"
                >
                    {t.warning2}
                </div>
            </div>
        </div>
    </div>

    <!-- Contenedor principal con las preguntas -->
    <div
        class="w-11/12 max-w-4xl bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900 text-white rounded-t-3xl p-4 text-center flex-grow"
    >
        <!-- Preguntas de la encuesta -->
        <div class="text-left text-normal lg:text-xl mb-4">
            {#if isLoading}
                <p class="text-white">Cargando...</p>
            {:else}
                <h1 class="text-3xl text-white font-light mt-8 mb-8">
                    {t.title}
                </h1>
                <!-- Barra de progreso -->
                <div class="flex mb-6 space-x-2">
                    {#each Array(6) as _, index}
                        <div
                            class="flex-1 h-2 rounded-full transition-all duration-200 ease-in-out"
                            style="background-color: {currentQuestionIndex >=
                            index
                                ? '#000000'
                                : '#ffffff'}"
                        ></div>
                    {/each}
                </div>
                <!-- Mostrar pregunta actual -->
                <div class="flex items-center mb-4">
                    <span
                        class="border border-white text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 flex-shrink-0 text-xs"
                    >
                        {currentQuestionIndex + 1}
                    </span>
                    <h3
                        class="text-white font-bold flex-grow text-sm md:text-base break-words"
                    >
                        {formData.preguntas[currentQuestionIndex]?.texto ||
                            "No hay preguntas"}
                    </h3>
                </div>

                <!-- Opciones de la pregunta tipo "radio" -->
                {#if formData.preguntas[currentQuestionIndex]?.tipo === "radio"}
                    <div class="space-y-2">
                        {#each formData.preguntas[currentQuestionIndex].opciones as opcion, i}
                            <button
                                type="button"
                                class="font-bold border-2 border-[#00000000] py-6 px-4 text-sm rounded-xl mb-3 cursor-pointer transition-all duration-200 ease-in-out w-[200px] md:w-full flex justify-center items-center"
                                class:selected={responses[currentQuestionIndex]
                                    .respuesta === opcion}
                                on:click={() => updateResponse(opcion)}
                            >
                                {opcion}
                            </button>
                        {/each}
                    </div>
                {/if}

                <!-- Entrada de texto para la pregunta tipo "texto" -->
                {#if formData.preguntas[currentQuestionIndex]?.tipo === "texto"}
                    <textarea
                        class="w-full p-4 text-sm rounded-xl border-none bg-white text-black"
                        placeholder={t.writeYourAnswer}
                        bind:value={responses[currentQuestionIndex].respuesta}
                        on:input={updateTextResponse}
                    ></textarea>
                {/if}

                <!-- Navegación -->
                <div class="flex flex-col items-center mt-4 space-y-4">
                    <!-- Contenedor para "Atrás" y "Next" -->
                    <div class="flex justify-center w-full max-w-[20rem]">
                        <!-- Botón "Atrás" -->
                        {#if currentQuestionIndex > 0}
                            <button
                                type="button"
                                on:click={goToPreviousQuestion}
                                class="bg-[#000000] text-white px-6 py-2 rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl min-w-[8rem] mr-4"
                            >
                                {t.previous}
                            </button>
                        {/if}

                        <!-- Botón "Next" -->
                        {#if currentQuestionIndex < formData.preguntas.length - 1}
                            <button
                                type="button"
                                on:click={goToNextQuestion}
                                class="bg-[#000000] text-white px-6 py-2 rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl min-w-[8rem]"
                            >
                                {t.next}
                            </button>
                        {/if}
                    </div>

                    <!-- Botón "Enviar respuestas" solo en la última pregunta -->
                    {#if currentQuestionIndex === formData.preguntas.length - 1}
                        <div class="flex justify-center w-full">
                            {#if !isSubmitting} <!-- Solo mostrar el botón si no estamos enviando -->
                            <button
                                type="button"
                                on:click={submitAnswers}
                                class="submit-button bg-[#32CD32] text-white rounded-3xl px-8 py-2 flex items-center justify-center"
                                style="min-width: 200px; transform: translateX(-10px);"
                            >
                                {t.submit}
                            </button>
                            {:else} <!-- Si estamos enviando, mostrar un loader -->
      <div class="loader"></div>
    {/if}
                        </div>
                        
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    button.selected {
        background-color: #4caf50;
        color: white;
    }
    button:not(.selected):not(.submit-button) {
        background-color: black;
        color: white;
    }


  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #ffffff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
