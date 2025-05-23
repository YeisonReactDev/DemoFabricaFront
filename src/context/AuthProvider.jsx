import { useState, useEffect, createContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios.jsx'


const AuthContext = createContext();

//contexto de toda la aplicacion
const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate();
    const location = useLocation();

    const autenticarUsuario = async () => {
        const token = localStorage.getItem('token');
        const companyId = localStorage.getItem('companyId');

        if (!token) {
            setCargando(false)
            location.pathname?.includes("/app/") && navigate('/')
            return
        }

        try {
            const { data: { user, empresas } } = await clienteAxios('/usuarios/perfil');
            let companyParams = [];
            if(companyId){
                const res = await clienteAxios(`/parametros/empresa/${companyId}`);
                companyParams = res?.data?.result;
            }
            const permissions = user?.permisosInfo?.Rol?.opciones?.map(v => ({ key: v.opcion.Acceso, parentKey: v.opcion.opcionPadre?.Acceso || null })) || []
            setAuth({ ...user, permissions, empresas, companyParams });

            //ojo aca es para que si el token no se ha expirado mande a maestros
            !location.pathname?.includes("/app/") && navigate('/app/home')

        } catch (error) {
            setAuth({})
            location.pathname?.includes("/app/") && navigate('/')
        }

        setCargando(false)


    }
   /*  useEffect(() => {
        autenticarUsuario()
    }, []) */

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                autenticarUsuario
            }
            }
        >
            {children}
        </AuthContext.Provider>

    )
}

export {
    AuthProvider
}

export default AuthContext;