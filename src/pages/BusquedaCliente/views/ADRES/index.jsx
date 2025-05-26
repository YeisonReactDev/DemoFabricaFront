import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import CardDocumento from '../../components/CardDocumento'
import TableRender from '../../components/TableRender'
import { useGetADRESAfiliationsQuery, useGetADRESBasicQuery, useGetADRESPeriodsQuery } from '../../redux/api'

export default () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams(location?.search)

  const NumeroDocumento = searchParams?.get("id")
  const IdEmpresa = searchParams?.get("idempresa")

  const paramsForQuery = useMemo(() => ({
    NumeroDocumento
  }), [NumeroDocumento])
  const skipCondition = useMemo(() => !NumeroDocumento, [NumeroDocumento])

  // queries columns

  const columnsBasicInfo = useMemo(() => [
    {
      title: 'N. Identificación',
      dataIndex: 'NumeroDocumento',
      key: 'NumeroDocumento',
      render: (v) => <span className='font-bold'>{v}</span>
    },
    {
      title: 'Tipo Identificación',
      dataIndex: 'TipoIdentificacion',
      key: 'TipoIdentificacion',
    },
    {
      title: 'Primer Apellido',
      dataIndex: 'PrimerApellido',
      key: 'PrimerApellido',
    },
    {
      title: 'Segundo Apellido',
      dataIndex: 'SegundoApellido',
      key: 'SegundoApellido',
    },
    {
      title: 'Primer Nombre',
      dataIndex: 'PrimerNombre',
      key: 'PrimerNombre',
    },
    {
      title: 'Segundo Nombre',
      dataIndex: 'SegundoNombre',
      key: 'SegundoNombre',
    },
  ]);

  const columnsAfiliations = useMemo(() => [
    {
      title: 'Último Periodo',
      dataIndex: 'UltimoPeriodo',
      key: 'UltimoPeriodo',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
    {
      title: 'EPS / EOC',
      dataIndex: 'EPS',
      key: 'EPS',
    },
    {
      title: 'Tipo Afiliación',
      dataIndex: 'TipoAfiliacion',
      key: 'TipoAfiliacion',
    },
  ]);

  const columnsCompensatedPeriods = useMemo(() => [
    {
      title: 'EPS / EOC',
      dataIndex: 'EPS',
      key: 'EPS',
    },
    {
      title: 'Periodos Compensados',
      dataIndex: 'PeriodosCompensados',
      key: 'PeriodosCompensados',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("YYYY/MM")}</span>
    },
    {
      title: 'DiasCompensados',
      dataIndex: 'DiasCompensados',
      key: 'DiasCompensados',
    },
    {
      title: 'Tipo Afiliación',
      dataIndex: 'TipoAfiliacion',
      key: 'TipoAfiliacion',
    },
    {
      title: 'Observación',
      dataIndex: 'Observacion',
      key: 'Observacion',
    },
  ]);

  return (
    <>
      <div className='w-full px-5 py-3'>
        <h1 className='text-xl text-center'>ADRES - Administradora de los Recursos del Sistema General de Seguridad Social en Salud</h1>

        <div className='w-full flex justify-center items-center my-3'>
          <CardDocumento
            NumeroDocumento={NumeroDocumento}
            IdEmpresa={IdEmpresa}
            onClick={() => navigate("/")}
          />
        </div>

        <div className='w-full flex flex-col justify-start items-start gap-2'>
          <TableRender
            title='Información Básica'
            getQueryHook={useGetADRESBasicQuery}
            columns={columnsBasicInfo}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Afiliaciones'
            getQueryHook={useGetADRESAfiliationsQuery}
            columns={columnsAfiliations}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Períodos Compensados'
            getQueryHook={useGetADRESPeriodsQuery}
            columns={columnsCompensatedPeriods}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
        </div>
      </div>
    </>
  )
}
