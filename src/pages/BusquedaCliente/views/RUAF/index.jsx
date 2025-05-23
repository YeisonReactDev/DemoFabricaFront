import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import TableRender from '../../components/TableRender'
import { useGetRUAFBasicQuery, useGetRUAFHealthQuery, useGetRUAFLaboralRisksQuery, useGetRUAFLayoffsQuery, useGetRUAFPensionsQuery } from '../../redux/api'
import CardDocumento from '../../components/CardDocumento'

export default () => {

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
      dataIndex: 'NumeroIdentificacion',
      key: 'NumeroIdentificacion',
      render: (v) => <span className='font-bold'>{v}</span>
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
      title: 'Sexo',
      dataIndex: 'Sexo',
      key: 'Sexo',
    },
    {
      title: 'Fecha Corte',
      dataIndex: 'FechaCorte',
      key: 'FechaCorte',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
  ]);

  const columnsHealth = useMemo(() => [
    {
      title: 'Administradora',
      dataIndex: 'Administradora',
      key: 'Administradora',
    },
    {
      title: 'Régimen',
      dataIndex: 'Regimen',
      key: 'Regimen',
    },
    {
      title: 'Tipo Afiliado',
      dataIndex: 'TipoAfiliado',
      key: 'TipoAfiliado',
    },
    {
      title: 'Departamento > Municipio',
      dataIndex: 'DepartamentoMunicipio',
      key: 'DepartamentoMunicipio',
    },
    {
      title: 'Fecha Afiliación',
      dataIndex: 'FechaAfiliacion',
      key: 'FechaAfiliacion',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
  ]);

  const columnsPensions = useMemo(() => [
    {
      title: 'Régimen',
      dataIndex: 'Regimen',
      key: 'Regimen',
    },
    {
      title: 'Administradora',
      dataIndex: 'Administradora',
      key: 'Administradora',
    },
    {
      title: 'Fecha Afiliación',
      dataIndex: 'FechaAfiliacion',
      key: 'FechaAfiliacion',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
    {
      title: 'EstadoAfiliación',
      dataIndex: 'EstadoAfiliacion',
      key: 'EstadoAfiliacion',
    },
  ]);

  const columnsLaboralRisks = useMemo(() => [
    {
      title: 'Administradora',
      dataIndex: 'Administradora',
      key: 'Administradora',
    },
    {
      title: 'Fecha Afiliación',
      dataIndex: 'FechaAfiliacion',
      key: 'FechaAfiliacion',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
    {
      title: 'EstadoAfiliación',
      dataIndex: 'EstadoAfiliacion',
      key: 'EstadoAfiliacion',
    },
    {
      title: 'Actividad Económica',
      dataIndex: 'ActividadEconomica',
      key: 'ActividadEconomica',
    },
    {
      title: 'Municipio Labora',
      dataIndex: 'MunicipioLabora',
      key: 'MunicipioLabora',
    },
  ]);

  const columnsLayoffs = useMemo(() => [
    {
      title: 'Régimen',
      dataIndex: 'Regimen',
      key: 'Regimen',
    },
    {
      title: 'Administradora',
      dataIndex: 'Administradora',
      key: 'Administradora',
    },
    {
      title: 'Fecha Afiliación',
      dataIndex: 'FechaAfiliacion',
      key: 'FechaAfiliacion',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
    {
      title: 'EstadoAfiliación',
      dataIndex: 'EstadoAfiliacion',
      key: 'EstadoAfiliacion',
    },
    {
      title: 'Municipio Labora',
      dataIndex: 'MunicipioLabora',
      key: 'MunicipioLabora',
    },
  ]);

  return (
    <>
      <div className='w-full px-5 py-3'>
        <h1 className='text-xl text-center'>RUAF - Registro Único de Afiliados</h1>

        <div className='w-full flex justify-center items-center my-3'>
          <CardDocumento
            NumeroDocumento={NumeroDocumento}
            IdEmpresa={IdEmpresa}
          />
        </div>

        <div className='w-full flex flex-col justify-start items-start gap-5'>
          <TableRender
            title='Información Básica'
            getQueryHook={useGetRUAFBasicQuery}
            columns={columnsBasicInfo}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Afiliaciones a Salud'
            getQueryHook={useGetRUAFHealthQuery}
            columns={columnsHealth}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Afiliaciones a Pensiones'
            getQueryHook={useGetRUAFPensionsQuery}
            columns={columnsPensions}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Afiliaciones a Riesgos Laborales'
            getQueryHook={useGetRUAFLaboralRisksQuery}
            columns={columnsLaboralRisks}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
          <TableRender
            title='Afiliaciones a Cesantías'
            getQueryHook={useGetRUAFLayoffsQuery}
            columns={columnsLayoffs}
            queryParams={paramsForQuery}
            skipCondition={skipCondition}
          />
        </div>
      </div>
    </>
  )
}
