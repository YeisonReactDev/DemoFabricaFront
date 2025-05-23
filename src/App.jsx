//se utiliza para proteger las rutas;
import { Button, ConfigProvider, Result } from "antd";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
//es el layout que esta por encima de las pages, todas las pages heredan este estilo
import { AuthProvider } from "./context/AuthProvider.jsx";
//pagina principal ojo es principal por <Route index
//configuracion global idioma antd
import locale from "antd/es/locale/es_ES";
import "moment/locale/es";
import PublicLayout from "./layouts/publicLayout";
//WorkShop

//configuracion global idioma antd
import BusquedaCliente from "./pages/BusquedaCliente/index.jsx";
import RUAF from "./pages/BusquedaCliente/views/RUAF/index.jsx";
import ADRES from "./pages/BusquedaCliente/views/ADRES/index.jsx";

export const NotFoundRoute = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Result
        status={"404"}
        title="404"
        subTitle="Perdona, esta página no existe."
        extra={<Button type='primary' className='disable-custom' onClick={() => navigate("/app/home")}>Volver</Button>}
      />
    </div>
  )
}

function App() {
  return (
    <ConfigProvider locale={locale}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<BusquedaCliente />} />
              <Route path="/ruaf" element={<RUAF />} />
              <Route path="/adres" element={<ADRES />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
