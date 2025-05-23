import { notification } from "antd"
import { useEffect } from "react"

export const useNotification = (result, error, showError = true, showResult = true) => {

    const notificationSuccess = (msg) => {
        if (showResult) {
            notification.success({
                message: "Operación exitosa",
                description: <p dangerouslySetInnerHTML={{ __html: msg || "La operación ha sido ejecutada con éxito." }}></p>,
                duration: 4,
            })
        }
    }

    const notificationError = (msg) => {
        if (showError) {
            notification.error({
                message: "Operación fallida",
                description: <p dangerouslySetInnerHTML={{ __html: msg || "Ha ocurrido un error. Por favor, inténtelo más tarde." }}></p>,
                duration: 4,
            })
        }
    }

    const notificationWarning = (title, msg) => {
        notification.warning({
            message: title,
            description: <p dangerouslySetInnerHTML={{ __html: msg || "" }}></p>,
            duration: 4,
            className: "warning__notification",
        })
    }

    const notificationInfo = (title, msg) => {
        notification.info({
            message: title,
            description: <p dangerouslySetInnerHTML={{ __html: msg || "" }}></p>,
            duration: 4,
            className: "info__notification",
        })
    }

    useEffect(() => {
        if (error) {
            notificationError(error)
        } else if (result && !error) {
            notificationSuccess(result)
        }

    }, [result, error])


    return {
        notificationSuccess,
        notificationError,
        notificationWarning,
        notificationInfo
    }

}