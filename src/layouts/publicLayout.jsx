import { Card, Spin } from "antd";
import { Outlet } from "react-router-dom";
//todo el contenido estara dentro del main
const PublicLayout = () => {
  // const { cargando } = useAuth();
  const cargando = false
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
      ) : (
        <div className="App bg-primary-darken">
          <main
            style={{ height: "100%", minHeight: "100vh" }}
            className="w-full md:flex md:justify-center md:align-items-center"
          >
            <div className='w-full h-full flex justify-center my-24'>
              <Card className="w-full" style={{ maxWidth: 1200, minHeight: 600 }}>
                <Outlet />
              </Card>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default PublicLayout;
