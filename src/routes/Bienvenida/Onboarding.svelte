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
  let isSending = false; // Estado para controlar el envío y mostrar el loader
  let title = "Preguntas de Discovery"; // Título inicial

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
          respuesta: "", // Initialize with an empty string or default value
        });
      });

      userId = localStorage.getItem("id");
      isLoading = false;
    } catch (error) {
      console.error("Error al cargar el formulario de onboarding:", error);
      isLoading = false;
    }
  }

  function updateTitle() {
    if (responses[currentQuestionIndex]?.id === "pregunta_id05") {
      title = "Ahora un poco sobre tu rutina";
    } else {
      title = "Preguntas de Discovery";
    }
  }

  function goToNextQuestion() {
    if (responses[currentQuestionIndex].respuesta === "") {
      alert("Por favor selecciona una respuesta.");
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
    if (isSending) return; // Evitar múltiples envíos simultáneos

    isSending = true; // Marcar como enviando

    try {
      await saveResponses(userId, responses);
      console.log("Respuestas enviadas correctamente a la API.");
      // Obtener la zona horaria del navegador
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Actualizar el estado del usuario con la zona horaria
      await updateUserState(userId, "cuestionariocompletado", timezone);
      navigate("/FinOnb");
    } catch (error) {
      console.error("Error al enviar respuestas a la API:", error);
    } finally {
      isSending = false; // Marcar como no enviando, ya sea éxito o error
    }
  }
</script>

<div
  class="flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-black to-purple-700"
>
  <div class="max-w-md w-full px-4">
    <h1 class="text-3xl text-white font-light text-left mt-8 mb-8">{title}</h1>
    <img
      src={logo}
      alt="Logo"
      class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto"
    />

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
                  bind:group={responses[currentQuestionIndex].respuesta}
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

        {#if currentQuestionIndex === formData.preguntas.length - 1 && !isSending}
          <div class="flex justify-center mt-4">
            <div class="flex justify-center mt-4">
              <button
                type="button"
                on:click={() => {
                  console.log("Botón clickeado");
                  isSending = !isSending; // Alterna el estado para pruebas
                }}
                class="bg-transparent border-4 border-[#32CD32] px-4 py-2 rounded-xl text-white transition duration-300 ease-in-out hover:bg-[#32CD32] hover:text-white hover:shadow-xl"
                style="min-width: 200px;"
              >
                {#if isSending}
                  <span class="text-white">Enviando...</span>
                {:else}
                  <span>Enviar</span>
                {/if}
              </button>
            </div>
          </div>
        {/if}
      </form>
    {:else}
      <p class="text-white text-center">No se pudo cargar el formulario.</p>
    {/if}
  </div>
</div>
