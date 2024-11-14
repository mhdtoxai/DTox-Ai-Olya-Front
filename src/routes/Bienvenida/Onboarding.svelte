<script>
  import logo from "/log.png";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getUserInfoAndOnboardingCheck } from "../../api/user/getUserInfoAndOnboardingCheck";
  import { updateUserState } from "../../api/user/updateUserState";
  import { saveResponses } from "../../api/user/saveResponses";
  import { getOnboardingForm } from "../../api/user/getOnboardingForm";
  import { translations } from "./translations.js"; // Importar traducciones
  import dog2 from "/dog2.webp";

  // Obtener los parámetros de la URL
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

  let formData = {};
  let currentQuestionIndex = 0;
  let responses = [];
  let userId = "";
  let isLoading = true;
  let isSending = false; // Estado para controlar el envío y mostrar el loader
  let title = ""; // Declarar la variable title

  // Obtener el idioma seleccionado desde localStorage, con valor predeterminado en español
  const currentLanguage = localStorage.getItem("language") || "español";
  let t = translations[currentLanguage]; // Acceder a los textos según el idioma

  // Ejecutar la verificación al montar el componente
  onMount(() => {
    getUserInfoAndOnboardingCheck(id, name)
      .then(() => {
        loadOnboardingForm();
      })
      .catch((error) => {
        console.error(
          "Error al obtener información del usuario y verificar onboarding:",
          error,
        );
        navigate("/Error");
      });
  });

  async function loadOnboardingForm() {
    try {
      const language = localStorage.getItem("language") || "español";
      formData = await getOnboardingForm(language);
      formData.preguntas.forEach((pregunta) => {
        responses.push({
          id: pregunta.id,
          texto: pregunta.texto,
          respuesta: "",
        });
      });

      userId = localStorage.getItem("id");
      isLoading = false;
      updateTitle(); // Actualizar título después de cargar el formulario
    } catch (error) {
      console.error("Error al cargar el formulario de onboarding:", error);
      isLoading = false;
    }
  }

  function updateTitle() {
    const currentQuestion = formData.preguntas[currentQuestionIndex];
    // Cambiar título después de la pregunta con id "pregunta_id05"
    if (
      currentQuestionIndex >=
      formData.preguntas.findIndex((p) => p.id === "pregunta_id05")
    ) {
      title = t.questionRoutine;
    } else {
      title = t.title;
    }
  }

  function goToNextQuestion() {
    if (responses[currentQuestionIndex].respuesta === "") {
      alert(t.alert);
      return;
    }

    if (currentQuestionIndex < formData.preguntas.length - 1) {
      currentQuestionIndex++;
    }
    updateTitle();
    console.log("Respuestas actuales:", responses);
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    }
    updateTitle();
    console.log("Respuestas actuales:", responses);
  }

  function updateResponse(input) {
    // Si `input` es un evento (como en `fecha` o `hora`), usa `input.target.value`
    if (input && input.target) {
      responses[currentQuestionIndex].respuesta = input.target.value;
    } else {
      // Si `input` no es un evento, es un valor directo (como en las opciones `radio`)
      responses[currentQuestionIndex].respuesta = input;
    }
    console.log("Respuestas actuales:", responses);
  }

  async function sendResponsesToAPI() {
    if (isSending) return;

    isSending = true;

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await updateUserState(userId, "cuestionariocompletado", timezone);
      await saveResponses(userId, responses);
      console.log("Respuestas enviadas correctamente a la API.");
      navigate("/FinOnb");
    } catch (error) {
      console.error("Error al enviar respuestas a la API:", error);
    } finally {
      isSending = false;
    }
  }
</script>

<!-- HTML -->
<div
  class="flex flex-col items-center min-h-screen bg-black font-arial text-white"
>
  <div
    class="w-11/12 max-w-4xl h-48 bg-white rounded-b-3xl mb-3 flex relative overflow-hidden"
  >
    <!-- Imagen del perro absolutamente posicionada en la esquina inferior izquierda -->
    <div class="absolute bottom-0 left-[-25px]">
      <img class="w-44 h-44 object-cover" src={dog2} alt="Foto de un perro" />
    </div>

    <!-- Contenedor de texto alineado a la derecha y hacia abajo con ancho controlado -->
    <div
      class="text-black text-right flex flex-col items-end justify-end flex-grow pr-4 ml-auto max-w-xs mb-2">
      <!-- Logo alineado en la esquina superior derecha -->
      <div class="self-end mb-3">
        <img src={logo} alt="Logo" class="w-10 h-10" />
      </div>

      <!-- Texto de bienvenida con ajuste preciso para evitar saltos de línea innecesarios -->
      <div>
        <h2
          class="text-2xl lg:text-3xl font-bold leading-tight mb-2 max-w-[12rem] break-words">
          {t.welcome}, {name}
        </h2>

        <div
          class="text-purple-600 text-[15px] lg:text-[19px] font-semibold max-w-[15rem] lg:max-w-full text-right">
          {t.warning1}
        </div>

        <div
          class="text-purple-600 text-[15px] lg:text-[19px] font-semibold max-w-[15rem] lg:max-w-full text-right">
          {t.warning2}
        </div>

        <div
          class="text-purple-600 text-[15px] lg:text-[19px] font-semibold max-w-[15rem] lg:max-w-full text-right">
          {t.warning3}
        </div>
      </div>
    </div>
  </div>

  <div
    class="w-11/12 max-w-4xl bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900 text-white rounded-t-3xl p-4 text-left flex-grow"
  >
    <h1 class="text-3xl text-white font-light mt-8 mb-8">{title}</h1>
    <!-- Título dinámico -->

<!-- Barra de progreso -->
<div class="flex mb-6 space-x-2">
  {#each Array(8) as _, index}
    <div
      class="flex-1 h-2 rounded-full transition-all duration-200 ease-in-out"
      style="background-color: {currentQuestionIndex >= index ? '#000000' : '#ffffff'}"
    ></div>
  {/each}
</div>



    {#if isLoading}
      <p class="text-white text-center mt-4">{t.loading}</p>
      <!-- Texto dinámico para "Cargando..." -->
    {:else if Object.keys(formData).length > 0}
      <form>
        <div class="question-block mb-6">
          <div class="flex items-start mb-4">
            <!-- Número de la pregunta con círculo fijo que no se puede reducir -->
            <span
              class="border border-white text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 flex-shrink-0 text-xs"
            >
              {currentQuestionIndex + 1}
            </span>
            <!-- Texto de la pregunta, que se ajusta en varias líneas si es necesario -->
            <p
              class="text-white font-bold flex-grow text-sm md:text-base break-words"
            >
              {formData.preguntas[currentQuestionIndex].texto}
            </p>
          </div>

          {#if formData.preguntas[currentQuestionIndex].tipo === "radio"}
          <div class="flex flex-col items-start ml-6 md:items-center md:ml-0 w-full">
            {#each formData.preguntas[currentQuestionIndex].opciones as opcion, i}
              <button
                type="button"
                class="font-bold border-2 border-[#00000000] py-6 px-4 text-sm rounded-xl mb-3 cursor-pointer transition-all duration-200 ease-in-out w-[200px] md:w-full flex justify-center items-center
                  {responses[currentQuestionIndex].respuesta === opcion ? 'selected' : 'default'}"
                on:click={() => updateResponse(opcion)}
              >
                {opcion}
              </button>
            {/each}
          </div>
        {/if}
        

          {#if formData.preguntas[currentQuestionIndex].tipo === "fecha"}
            <input
              type="date"
              class="border-2 border-gray-300 rounded-md p-2 w-full bg-white text-black"
              bind:value={responses[currentQuestionIndex].respuesta}
              on:change={updateResponse}
            />
          {/if}
          
        </div>

        <div class="flex justify-center">
          {#if currentQuestionIndex > 0 && !isSending} <!-- Agregado && !isSending -->
            <button
              type="button"
              on:click={goToPreviousQuestion}
              class="bg-[#000000] text-white px-6 py-4 rounded-xl mr-2"
            >
              {t.previous}
            </button>
          {/if}
          {#if currentQuestionIndex < formData.preguntas.length - 1 && !isSending} <!-- Agregado && !isSending -->
            <button
              type="button"
              on:click={goToNextQuestion}
              class="bg-[#000000] text-white px-6 py-4 rounded-xl ml-2"
            >
              {t.next}
            </button>
          {/if}
        </div>
        
        {#if currentQuestionIndex === formData.preguntas.length - 1}
          {#if !isSending} <!-- Agregado !isSending -->
            <div class="flex justify-center mt-4">
              <button
                type="button"
                on:click={sendResponsesToAPI}
                class="bg-[#32CD32] text-white px-8 py-2 rounded flex items-center justify-center"
                style="min-width: 200px;"
              >
                {t.sendResponses}
              </button>
            </div>
          {/if}
        
          {#if isSending} <!-- Mantenido isSending -->
            <div class="flex justify-center mt-4">
              <div class="spinner"></div>
              <span class="ml-2 text-white">{t.processing}</span>
            </div>
          {/if}
        {/if}
        
      </form>
    {:else}
      <p class="text-white text-center">No se pudo cargar el formulario.</p>
    {/if}
  </div>
</div>

<style>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #ffffff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .selected {
  background-color: #4caf50;
  color: white;
}

.default {
  background-color: black;
  color: white;
}

</style>
