import { CloseOutlined } from "@ant-design/icons";
import { Alert, Layout, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";

import ModalSeleccioneEmpresa from "../components/ModalSeleccioneEmpresa";

import { useApplyDecimals } from "../hooks/useApplyDecimals";
import { useFormatPrice } from "../hooks/useFormatPrice";
import { useOpenSelectModals } from "../hooks/useOpenSelectModals";

export const ProtectedGlobalContext = React.createContext(null)

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();
  const dispatch = useDispatch();
  const [isEmpresaSelected, setIsEmpresaSelected] = useState(false);
  const [closeUploadFiles, setCloseUploadFiles] = useState(false);

  const { formatDecimals, parserDecimals } = useApplyDecimals()
  const { formatPrice, formatter } = useFormatPrice()


  //const { empresa, sucursal, isOpen } = useSelector(
  //  (state) => state.selectEmpresa
  //);
  const { isUploadingFiles, filesStates } = useSelector(
    (state) => state.workOrders
  );

  useEffect(() => {
    auth.length > 0 ||
      (auth.Email !== null && document.body.classList.add("app"));
  }, [auth]);

  useOpenSelectModals();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (isUploadingFiles) {
      setCloseUploadFiles(true);
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploadingFiles]);

  // useValidatePayment()

  //event listener para prevenir acceso a rutas que no estan permitidas al usuario
  /*   useEffect(() => {
        //unicamente permitimos entrada al "home" (TEMPORAL)
        if (
           !(auth?.permissions?.map(v => v.key).includes(location.pathname.split("/").at(-1)) ||
              auth?.permissions?.map(v => v.key).includes(location.pathname.split("/").at(-2)))) {
           //navegamos hacia atras (ultima pagina)
           if (
              (location.pathname.split("/").at(-1) === "empresas" ||
                 location.pathname.split("/").at(-2) === "empresas") &&
              auth?.permisosInfo === null
           ) {
              navigate("/", { state: { withoutPermissions: auth?.permisosInfo === null } })
           } else {
              navigate(-1)
           }
        }
     }, [location]) */

  return (
    <>
      {cargando ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Spin spinning={true} size="large" />
        </div>
      ) : auth.length > 0 || auth.Email !== null ? (
        <Layout>
          <Header />
          <Layout
            className="bg-gray-100 md:flex flex-row md:min-h-screen relative"
            style={{ minHeight: "90vh" }}
          >
            <Sidebar />
            <Layout
              className="app__main-content"
              style={{
                overflowX: "hidden",
                overflowY: "scroll",
                minHeight: "92vh",
                maxHeight: "92vh",
              }}
            >
              <main className="sm:p-5 p-2.5 flex-1">
                <ProtectedGlobalContext.Provider
                  value={{ 
                    formatDecimals, 
                    parserDecimals,
                    formatPrice,
                    formatter
                  }}
                >
                  <Outlet />
                </ProtectedGlobalContext.Provider>
              </main>
              {(filesStates?.length > 0 && closeUploadFiles) && (
                <div
                  className="shadow-lg p-2 bg-white rounded row border"
                  style={{ position: "absolute", bottom: "6%", right: "2%" }}
                >
                  <div className="col-12">
                    <div className="row d-flex justify-content-end h6">
                      <CloseOutlined onClick={() => setCloseUploadFiles(false)} />
                    </div>
                    <p className="mb-2">
                      No cierre esta ventana mientras se suben los archivos.
                    </p>
                    <ul>
                      {filesStates.map((v) => (
                        <li>
                          <Alert
                            message={v.fileName}
                            className="mb-2"
                            type={
                              v?.loading
                                ? "info"
                                : v?.isError
                                  ? "error"
                                  : "success"
                            }
                            showIcon
                            action={
                              <Spin spinning={v.loading} size="small" />
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Layout>
          </Layout>
          <ModalSeleccioneEmpresa />
        </Layout>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default RutaProtegida;
