import { Avatar, Button, Card, Result, Skeleton } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { normalizeQueryParams } from '../../../../helpers/normalizeQueryParams'
import { useGetByIdClienteQuery } from '../../redux/api'

export default ({ IdEmpresa, NumeroDocumento, onClick = null }) => {

    const { data, isFetching, refetch, isError } = useGetByIdClienteQuery({
        IdEmpresa: normalizeQueryParams(IdEmpresa),
        NumeroDocumento: normalizeQueryParams(NumeroDocumento)
    }, {
        skip: !IdEmpresa || !NumeroDocumento
    })

    const dataFormatted = useMemo(() => {
        if (!data) {
            return {}
        }

        return {
            NumeroDocumento: data?.result?.NumeroDocumento,
            TipoDocumento: data?.result?.TipoDocumento,
            FechaExpedicion: dayjs(data?.result?.FechaExpedicion)?.format("DD MMM YYYY")
        }
    })

    return (
        <Card
            className='w-full'
            style={{ maxWidth: 400 }}
            hoverable={!!onClick}
            onClick={() => onClick && onClick({NumeroDocumento, IdEmpresa})}
        >
            {
                isError
                    ? (
                        <div className='w-full flex justify-center items-center'>
                            <Result
                                status="warning"
                                title="Ha ocurrido un error, presiona para reintentar."
                                extra={
                                    <Button type="primary" key="console" onClick={refetch}>
                                        Reintentar
                                    </Button>
                                }
                            />
                        </div>
                    )
                    : (
                        <div className='w-full flex justify-start items-start gap-3'>
                            <Avatar size={"large"} />
                            <div className='w-full flex flex-col'>
                                <Skeleton
                                    paragraph={{ rows: 1 }} active loading={isFetching}
                                >
                                    <span className='text-sm'><b>{dataFormatted?.NumeroDocumento || ""}</b> ({dataFormatted?.TipoDocumento || ""})</span>
                                </Skeleton>
                                <Skeleton paragraph={{ rows: 1 }} active loading={isFetching}>
                                    <span className='text-xs text-gray-500'>{dataFormatted?.FechaExpedicion || ""}</span>
                                </Skeleton>
                            </div>
                        </div>
                    )
            }
        </Card>
    )
}
