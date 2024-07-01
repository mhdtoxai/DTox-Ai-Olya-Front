<script>
  import logo from "/log.png";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getUserInfoAndOnboardingCheck } from "../../api/user/getUserInfoAndOnboardingCheck";
  import { updateUserState } from "../../api/user/updateUserState";
  import { saveResponses } from "../../api/user/saveResponses";
  import { getOnboardingForm } from "../../api/user/getOnboardingForm";

  // Obtener los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id") || "ID Predeterminado";
  const name = urlParams.get("name") || "Nombre Predeterminado";

  // Almacenar el nombre en localStorage si está presente en la URL
  if (name) {
    localStorage.setItem("name", name);
  }

  let formData = {};
  let currentQuestionIndex = 0;
  let responses = [];
  let userId = "";
  let isLoading = true;
  let showError = false;
  let isSending = false; // Estado para controlar el envío y mostrar el loader
  let title = "Déjame conocerte para ayudarte"; // Título inicial

  // Ejecutar la verificación al montar el componente
  onMount(() => {
    // Utiliza la función para obtener información del usuario y verificar el onboarding
    getUserInfoAndOnboardingCheck(id, name)
      .then(() => {
        // Al completarse, cargar el formulario de onboarding
        loadOnboardingForm();
      })
      .catch((error) => {
        console.error(
          "Error al obtener información del usuario y verificar onboarding:",
          error,
        );
        navigate("/Error"); // Redirigir a una página de error en caso de problemas
      });
  });

  async function loadOnboardingForm() {
    try {
      formData = await getOnboardingForm("español");
      formData.preguntas.forEach((pregunta) => {
        responses.push({
          id: pregunta.id,
          texto: pregunta.texto,
          respuesta: "",
        });
      });

      userId = localStorage.getItem("id");
      isLoading = false;
    } catch (error) {
      console.error("Error al cargar el formulario de onboarding:", error);
      isLoading = false;
    }
  }

  function validateTimes() {
    const wakeUpTime = responses.find(
      (response) => response.id === "pregunta_id05",
    ).respuesta;
    const breakfastTime = responses.find(
      (response) => response.id === "pregunta_id06",
    ).respuesta;

    if (wakeUpTime && breakfastTime && wakeUpTime > breakfastTime) {
      showError = true;
    } else {
      showError = false;
    }
  }

  function updateTitle() {
    if (responses[currentQuestionIndex]?.id === "pregunta_id05") {
      title = "Ahora un poco sobre tu rutina";
    } else {
      title = "Déjame conocerte para ayudarte";
    }
  }

  function goToNextQuestion() {
    if (responses[currentQuestionIndex].respuesta === "") {
      alert("Por favor selecciona una respuesta.");
      return;
    }

    validateTimes();

    if (!showError) {
      if (currentQuestionIndex < formData.preguntas.length - 1) {
        currentQuestionIndex++;
      }
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
    validateTimes();
    console.log("Respuestas actuales:", responses);
  }

  async function sendResponsesToAPI() {
    if (isSending) return; // Evitar múltiples envíos simultáneos

    isSending = true; // Marcar como enviando

    try {
  
      await saveResponses(userId, responses);
      console.log("Respuestas enviadas correctamente a la API.");
      await updateUserState(userId, "cuestionariocompletado");
      navigate("/FinOnb");
    } catch (error) {
      console.error("Error al enviar respuestas a la API:", error);
    } finally {
      isSending = false; // Marcar como no enviando, ya sea éxito o error
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-black to-purple-700">
  <div class="max-w-md w-full px-4">
    <h1 class="text-3xl text-white font-bold text-left mt-8 mb-4">{title}</h1>
    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto"/>

    {#if isLoading}
      <p class="text-white text-center mt-4">Cargando...</p>
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
                  checked={responses[currentQuestionIndex].respuesta === opcion}
                />
                <span>{opcion}</span>
              </label>
            {/each}
          {:else if formData.preguntas[currentQuestionIndex].tipo === "fecha"}
            <input
              type="date"
              class="border rounded-md p-2 w-full"
              bind:value={responses[currentQuestionIndex].respuesta}
              on:change={updateResponse}
            />
          {:else if formData.preguntas[currentQuestionIndex].tipo === "hora"}
            <input
              type="time"
              class="border rounded-md p-2 w-full"
              bind:value={responses[currentQuestionIndex].respuesta}
              on:change={updateResponse}
              inputMode="text"
            />
          {/if}
        </div>
        {#if showError}
          <p class="text-red-500 text-center mb-4">
            La hora del desayuno no puede ser antes de la hora de despertar.
          </p>
        {/if}
        <div class="flex justify-center">
          {#if currentQuestionIndex > 0}
            <button
              type="button"
              on:click={goToPreviousQuestion}
              class="bg-purple-500 text-white px-4 py-2 rounded mr-2"
            >
              Atrás
            </button>
          {/if}
          {#if currentQuestionIndex < formData.preguntas.length - 1}
            <button
              type="button"
              on:click={goToNextQuestion}
              class="bg-purple-500 text-white px-4 py-2 rounded ml-2"
            >
              Siguiente
            </button>
          {/if}
        </div>

        {#if currentQuestionIndex === formData.preguntas.length - 1 && !showError}
          <div class="flex justify-center mt-4">
            <button
              type="button"
              on:click={sendResponsesToAPI}
              disabled={isSending} 
              class="bg-[#32CD32] text-white px-8 py-2 rounded flex items-center justify-center"
              style="min-width: 200px;" 
            >
              {#if isSending}
                <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.003 8.003 0 014 4.437M22 12h-4M18 20.562a8.003 8.003 0 01-7.563-4.688M20 9.709a8.003 8.003 0 01-7.563 4.687"></path>
                </svg>
              {:else}
                Enviar respuestas
              {/if}
            </button>
          </div>
        {/if}
      </form>
    {:else}
      <p class="text-white text-center">No se pudo cargar el formulario.</p>
    {/if}
  </div>
</div>
