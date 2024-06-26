<script>
  // Importamos los componentes necesarios desde la biblioteca svelte-routing.
  import { Router, Link, Route } from "svelte-routing";
  // Importamos los componentes que representan las diferentes páginas de la aplicación.
  import Bienvenida from "./routes/Bienvenida/Bienvenida.svelte";
  import Onboarding from "./routes/Bienvenida/Onboarding.svelte";
  import FinOnb from "./routes/Bienvenida/FinOnb.svelte";
  import Complete from "./routes/Bienvenida/Complete.svelte";
  import Error from "./routes/Bienvenida/Error.svelte";
  import Home from "./routes/Bienvenida/Home.svelte";
</script>
<!-- Definimos el Router, que se encarga de gestionar la navegación entre las diferentes rutas de la aplicación. -->
<Router>
  <main>
    <!-- Cada Route especifica un camino de URL y el componente que debe renderizarse cuando se visita esa URL. -->
    <!-- La ruta raíz "/" renderiza el componente Bienvenida. -->
   
   
    <Route path="/" component={Home} />

    <Route path="/Bienvenida" component={Bienvenida} />
    <!-- La ruta "/FinOnb" renderiza el componente FinOnb. -->
    <Route path="/FinOnb" component={FinOnb} />
    <!-- La ruta "/Onboarding" renderiza el componente Onboarding. -->
    <Route path="/Onboarding" component={Onboarding} />

    <Route path="/Complete" component={Complete} />
    <Route path="/Error" component={Error} />


  </main>
</Router>
