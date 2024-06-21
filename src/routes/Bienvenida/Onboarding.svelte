<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import logo from '/log.png';

  let formData = {};
  let currentQuestionIndex = 0;
  let responses = [];
  let userId = '';
  let isLoading = true; // Variable para indicar si se está cargando la información

  onMount(async () => {
    try {
      const response = await fetch('https://jjhvjvui.top/api/form/onboarding/español');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      formData = await response.json();
      formData.preguntas.forEach(pregunta => {
        responses.push({
          id: pregunta.id,
          texto: pregunta.texto,
          respuesta: ''
        });
      });

      // Obtener userId de localStorage
      userId = localStorage.getItem('id');
      isLoading = false; // Se establece en falso cuando la carga de datos está completa
    } catch (error) {
      console.error('Error al realizar la solicitud fetch:', error);
      isLoading = false; // Manejar caso de error también
    }
  });

  function goToNextQuestion() {
    if (currentQuestionIndex < formData.preguntas.length - 1) {
      currentQuestionIndex++;
    }
    console.log('Respuestas actuales:', responses);
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    }
    console.log('Respuestas actuales:', responses);
  }

  function updateResponse(event) {
    responses[currentQuestionIndex].respuesta = event.target.value;
    console.log('Respuestas actuales:', responses);
  }

  async function sendResponsesToAPI() {
    try {
      const body = {
        userId: userId,
        respuestas: responses
      };

      const response = await fetch('https://jjhvjvui.top/api/saveResponses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Respuestas enviadas correctamente a la API.');

      // Actualizar el estado del usuario a "cuestionariocompletado"
      await updateUserState();

      // Redireccionar a la página de fin de onboarding
      navigate('/FinOnb');

    } catch (error) {
      console.error('Error al enviar respuestas a la API:', error);
    }
  }

  async function updateUserState() {
    try {
      const body = {
        userId: userId,
        estado: 'cuestionariocompletado'
      };

      const response = await fetch('https://jjhvjvui.top/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Estado del usuario actualizado correctamente.');

    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-black">
  <div class="max-w-md w-full px-4">
    <img src={logo} alt="Logo" class="absolute top-0 left-0 mt-4 ml-4 w-12 h-auto" />

    {#if isLoading}
      <p class="text-white text-center mt-4">Cargando...</p>
    {:else}
      {#if Object.keys(formData).length > 0}
        <form>
          <div class="question-block mb-6">
            <p class="text-white font-bold mb-2">{formData.preguntas[currentQuestionIndex].texto}</p>
            {#if formData.preguntas[currentQuestionIndex].tipo === 'radio'}
              {#each formData.preguntas[currentQuestionIndex].opciones as opcion}
                <label class="text-white flex items-center mb-2">
                  <input 
                    type="radio" 
                    name={formData.preguntas[currentQuestionIndex].id} 
                    value={opcion} 
                    class="mr-2"
                    on:change={updateResponse}
                    checked={responses[currentQuestionIndex].respuesta === opcion}
                  />
                  <span>{opcion}</span>
                </label>
              {/each}
            {:else if formData.preguntas[currentQuestionIndex].tipo === 'fecha'}
              <input 
                type="date" 
                class="border rounded-md p-2 w-full" 
                bind:value={responses[currentQuestionIndex].respuesta}
                on:change={updateResponse}
              />
            {:else if formData.preguntas[currentQuestionIndex].tipo === 'hora'}
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
              <button type="button" on:click={goToPreviousQuestion} class="bg-purple-500 text-white px-4 py-2 rounded mr-2">
                Atrás
              </button>
            {/if}
            {#if currentQuestionIndex < formData.preguntas.length - 1}
              <button type="button" on:click={goToNextQuestion} class="bg-purple-500 text-white px-4 py-2 rounded ml-2">
                Siguiente
              </button>
            {/if}
          </div>
          
          {#if currentQuestionIndex === formData.preguntas.length - 1}
            <div class="flex justify-center mt-4">
              <button type="button" on:click={sendResponsesToAPI} class="bg-green-500 text-white px-4 py-2 rounded">
                Enviar respuestas
              </button>
            </div>
          {/if}
        </form>
      {:else}
        <p class="text-white text-center">No se pudo cargar el formulario.</p>
      {/if}
    {/if}
  </div>
</div>
