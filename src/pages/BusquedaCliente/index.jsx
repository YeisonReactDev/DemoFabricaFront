import { Button, Card, DatePicker, Form, Input, Result, Select, Table, Tag } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IoMdEye } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../hooks/useNotification'
import { searchCatalog } from '../../redux/common/redux'
import { useCreateClienteMutation, useGetByIdClienteQuery } from './redux/api'
import { clearIdEmpresa, clearNumeroDocumento } from './redux/slice'

const CardSystemType = ({
  name, link, title, NumeroDocumento, IdEmpresa
}) => {
  const navigate = useNavigate()

  const handleGoTo = useCallback(() => {
    return navigate(`${link}?id=${NumeroDocumento}&idempresa=${IdEmpresa}`)
  }, [link, NumeroDocumento, IdEmpresa])

  return (
    <Card
      hoverable
      className='w-full h-full group'
      style={{ maxHeight: 300 }}
      onClick={handleGoTo}
    >
      <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
        <h3 className='text-xl text-center font-blue mb-3'>{name}</h3>
        <span className='text-base text-center mb-3'>Ver información del {title}</span>
        <Button
          type='primary'
          className='disable-custom'
          icon={<IoMdEye />}
          onClick={handleGoTo}
        >
          Ver
        </Button>
      </div>
    </Card>
  )
}

export default () => {

  const dispatch = useDispatch()
  const [form] = useForm()

  const [NumeroDocumento, setNumeroDocumento] = useState();
  const [IdEmpresa, setIdEmpresa] = useState();

  const { empresas, loadingempresas } = useSelector(state => state.common)
  const { NumeroDocumento: NumeroDocumentoRedux, IdEmpresa: IdEmpresaRedux } = useSelector(state => state.clientes)

  const [createClient, { isLoading, data: result, error }] = useCreateClienteMutation();
  const { data, isFetching, isError, refetch } = useGetByIdClienteQuery({
    IdEmpresa,
    NumeroDocumento,
  }, {
    skip: !IdEmpresa || !NumeroDocumento
  });

  console.log({ data, IdEmpresa, NumeroDocumento })

  const notification = useNotification(result?.msg, null)


  const empresasOptions = useMemo(() => {
    if (!empresas || empresas?.length <= 0) {
      return []
    }

    return empresas?.map((v) => ({
      value: v?.IdEmpresa,
      label: v?.NombreEmpresa,
    }))
  })

  const systemTypes = useMemo(() => ({
    ruaf: {
      name: "RUAF",
      title: "Registro Único de Afiliados",
      link: "/ruaf"
    },
    adres: {
      name: "ADRES",
      title: "Administradora de los Recursos del Sistema General de Seguridad Social en Salud",
      link: "/adres"
    },
  }))
  const dataFormatted = useMemo(() => {
    if (!data || data?.length <= 0) {
      return {
        result: {},
        results: [],
        views: []
      }
    }

    const results = [data?.result]
    const views = Object.entries(data?.systems)?.reduce((p, entry) => {

      const [key, value] = entry
      console.log({ entry })
      if (!value) {
        return p
      }

      const systemKeyValue = systemTypes?.[key]

      p.push(systemKeyValue)
      return p
    }, [])

    return {
      result: data?.result,
      results,
      views
    }

  }, [data])

  const handleClear = useCallback(() => {
    setIdEmpresa(null)
    setNumeroDocumento(null)
    dispatch(clearNumeroDocumento())
    dispatch(clearIdEmpresa())
    form?.resetFields()
  })

  const handleSubmit = useCallback((values) => {

    if (values?.NumeroDocumento == NumeroDocumento) {
      refetch()
      return;
    }

    createClient({
      ...values,
      FechaExpedicion: dayjs(values?.FechaExpedicion)?.format("YYYY-MM-DD")
    })
      .unwrap()
      .catch((err) => {
        if (err?.data?.alreadyExists) {
          notification.notificationInfo("Persona ya Registrada", "La persona ya se encuentra registrada en el sistema")
        }
      })
      .finally(() => {
        setNumeroDocumento(values?.NumeroDocumento)
        setIdEmpresa(values?.IdEmpresa)
      })
  })

  const statusColumnInfo = useMemo(() => ({
    1: {
      text: "Pendiente",
      color: "default"
    },
    2: {
      text: "Exito",
      color: "green"
    },
    3: {
      text: "Error",
      color: "volcano"
    },
  }))
  const columns = useMemo(() => [
    {
      title: 'NumeroDocumento',
      dataIndex: 'NumeroDocumento',
      key: 'NumeroDocumento',
      render: (v) => <span className='font-bold'>{v}</span>
    },
    {
      title: 'TipoDocumento',
      dataIndex: 'TipoDocumento',
      key: 'TipoDocumento',
    },
    {
      title: 'FechaExpedicion',
      dataIndex: 'FechaExpedicion',
      key: 'FechaExpedicion',
      render: (v) => <span className="whitespace-nowrap">{dayjs(v)?.format("DD MMM YYYY")}</span>
    },
    {
      title: "Estado",
      dataIndex: "Estado",
      key: "Estado",
      render: (v) => <Tag color={statusColumnInfo?.[v]?.color}>{statusColumnInfo?.[v]?.text}</Tag>
    },
  ]);

  useEffect(() => {
    if (IdEmpresa) {
      localStorage.setItem("companyId", IdEmpresa)
    }
    else {
      localStorage.removeItem("companyId")
    }

    /* return () => {
      localStorage.removeItem("companyId")
    } */
  }, [IdEmpresa])


  // SETTEOS PARA MANTENER CACHE ENTRE VISTAS
  useEffect(() => {
    if (!!IdEmpresaRedux && !IdEmpresa) {
      setIdEmpresa(IdEmpresaRedux)
      form?.setFieldValue("IdEmpresa", IdEmpresaRedux)
    }
  }, [IdEmpresa, IdEmpresaRedux])

  useEffect(() => {
    if (!!NumeroDocumentoRedux && !NumeroDocumento) {
      setNumeroDocumento(NumeroDocumentoRedux)
      form?.setFieldValue("NumeroDocumento", NumeroDocumentoRedux)
    }
  }, [NumeroDocumento, NumeroDocumentoRedux])

  // setter for api data into form
  useEffect(() => {
    if (dataFormatted?.result?.NumeroDocumento) {
      for (const key in dataFormatted?.result) {
        if (Object.prototype.hasOwnProperty.call(dataFormatted?.result, key)) {
          const value = dataFormatted?.result[key];
          if (!value) continue;

          if (key?.includes("Fecha")) {
            const date = dayjs(value)
            form?.setFieldValue(key, date)
          }
          else {
            form?.setFieldValue(key, value)
          }
        }
      }
    }
  }, [dataFormatted])


  useEffect(() => {
    dispatch(searchCatalog({ endpoint: "empresas" }))
    return () => {
      // handleClear()
    }
  }, []);

  return (
    <>
      <Form
        form={form}
        name='cliente'
        layout='vertical'
        onFinish={handleSubmit}
        className='w-full'
      >
        <div className='w-full grid grid-cols-12 gap-3'>
          <Form.Item
            className="mb-2 col-span-3"
            label="Empresa"
            name="IdEmpresa"
            rules={[
              { required: true, message: "Este campo es obligatorio." },
            ]}
          >
            <Select
              allowClear
              loading={loadingempresas}
              placeholder="Seleccione la empresa"
              options={empresasOptions}
              filterOption
              showSearch
              optionFilterProp={"label"}
            />
          </Form.Item>
          <Form.Item
            className="mb-2 col-span-3"
            label="Tipo Documento"
            name="TipoDocumento"
            rules={[
              { required: true, message: "Este campo es obligatorio." },
            ]}
          >
            <Input
              allowClear
              placeholder="Tipo de documento de la persona"
            />
          </Form.Item>
          <Form.Item
            className="mb-2 col-span-3"
            label="N. Documento"
            name="NumeroDocumento"
            rules={[
              { required: true, message: "Este campo es obligatorio." },
            ]}
          >
            <Input
              allowClear
              placeholder="Número de documento de la persona"
            />
          </Form.Item>
          <Form.Item
            className="mb-2 col-span-3"
            label="Fecha Expedición"
            name="FechaExpedicion"
            rules={[
              { required: true, message: "Este campo es obligatorio." },
            ]}
          >
            <DatePicker
              placeholder="Seleccione la fecha"
            />
          </Form.Item>
        </div>
        <div className='mt-4 flex justify-end w-full gap-4'>
          <Button
            loading={isLoading}
            htmlType="submit"
            className="rounded disable-custom"
            type="primary"
          >
            Consultar
          </Button>
          <Button
            loading={isLoading}
            htmlType="reset"
            className="rounded disable-custom"
            danger
            onClick={handleClear}
          >
            Cancelar
          </Button>
        </div>
      </Form>

      {
        (data && NumeroDocumento && IdEmpresa) ? (
          <>
            <div className='w-full my-3'>
              <Table
                columns={columns}
                loading={isFetching}
                dataSource={!isError ? dataFormatted?.results : []}
              />
            </div>
            <div className='w-full grid grid-cols-12 gap-4'>
              {
                dataFormatted?.views?.map(systemType => (
                  <div className='sm:col-span-6 col-span-12'>
                    <CardSystemType
                      {...systemType}
                      NumeroDocumento={dataFormatted?.result?.NumeroDocumentoEncrypted}
                      IdEmpresa={dataFormatted?.result?.IdEmpresaEncrypted}
                    />
                  </div>
                ))
              }

            </div>
          </>
        )
          : (
            <div className='w-full h-full flex justify-center items-stretch'>
              <Result
                status="info"
                title="Búsqueda de clientes."
                subTitle="Ingresa los datos del cliente para consultarlo o generar un registro nuevo"

              />
            </div>
          )
      }
    </>
  )
}
