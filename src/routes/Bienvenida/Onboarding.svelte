<script>
  import logo from "/log.png";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getUserInfoAndOnboardingCheck } from "../../api/user/getUserInfoAndOnboardingCheck";
  import { updateUserState } from "../../api/user/updateUserState";
  import { saveResponses } from "../../api/user/saveResponses";
  import { getOnboardingForm } from "../../api/user/getOnboardingForm";
  import { translations } from "./translations.js"; // Importar traducciones

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
        console.error("Error al obtener información del usuario y verificar onboarding:", error);
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
  if (currentQuestionIndex >= formData.preguntas.findIndex(p => p.id === "pregunta_id05")) {
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

  function updateResponse(event) {
    responses[currentQuestionIndex].respuesta = event.target.value;
    console.log("Respuestas actuales:", responses);
  }

  async function sendResponsesToAPI() {
    if (isSending) return;

    isSending = true;

    try {
      await saveResponses(userId, responses);
      console.log("Respuestas enviadas correctamente a la API.");
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await updateUserState(userId, "cuestionariocompletado", timezone);
      navigate("/FinOnb");
    } catch (error) {
      console.error("Error al enviar respuestas a la API:", error);
    } finally {
      isSending = false;
    }
  }
</script>

<!-- HTML -->
<div class="flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-black to-purple-700">
  <div class="max-w-md w-full px-4">
    <h1 class="text-3xl text-white font-light text-left mt-8 mb-8">{title}</h1> <!-- Título dinámico -->

    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto" />

    {#if isLoading}
      <p class="text-white text-center mt-4">{t.loading}</p> <!-- Texto dinámico para "Cargando..." -->
    {:else if Object.keys(formData).length > 0}
      <form>
        <div class="question-block mb-6">
          <p class="text-white font-bold mb-2">
            {formData.preguntas[currentQuestionIndex].texto}
          </p>

          {#if formData.preguntas[currentQuestionIndex].tipo === "radio"}
            {#each formData.preguntas[currentQuestionIndex].opciones as opcion}
              <label class="text-white flex items-center mb-2">
                <input
                  type="radio"
                  name={formData.preguntas[currentQuestionIndex].id}
                  value={opcion}
                  class="mr-2 appearance-none rounded-full w-4 h-4 border-2 border-green-500 checked:bg-green-500 checked:border-transparent focus:outline-none"
                  on:change={updateResponse}
                  bind:group={responses[currentQuestionIndex].respuesta}
                />
                <span>{opcion}</span>
              </label>
            {/each}
          {/if}

          {#if formData.preguntas[currentQuestionIndex].tipo === "fecha"}
            <input
              type="date"
              class="border rounded-md p-2 w-full"
              bind:value={responses[currentQuestionIndex].respuesta}
              on:change={updateResponse}
            />
          {/if}

          {#if formData.preguntas[currentQuestionIndex].tipo === "hora"}
            <input
              type="time"
              class="border rounded-md p-2 w-full"
              bind:value={responses[currentQuestionIndex].respuesta}
              on:change={updateResponse}
              inputMode="text"
            />
          {/if}
        </div>

        <div class="flex justify-center">
          {#if currentQuestionIndex > 0}
            <button
              type="button"
              on:click={goToPreviousQuestion}
              class="bg-purple-500 text-white px-4 py-2 rounded mr-2"
            >
              {t.previous}
            </button>
          {/if}
          {#if currentQuestionIndex < formData.preguntas.length - 1}
            <button
              type="button"
              on:click={goToNextQuestion}
              class="bg-purple-500 text-white px-4 py-2 rounded ml-2"
            >
              {t.next}
            </button>
          {/if}
        </div>

        {#if currentQuestionIndex === formData.preguntas.length - 1}
          {#if !isSending}
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

          {#if isSending}
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
      </style>
      