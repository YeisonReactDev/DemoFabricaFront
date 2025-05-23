import { Button, Card, DatePicker, Form, Input, Select, Table, Tag } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchCatalog } from '../../redux/common/redux'
import { useCreateClienteMutation, useGetByIdClienteQuery } from './redux/api'
import { useNotification } from '../../hooks/useNotification'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'

export default () => {

  const dispatch = useDispatch()
  const [form] = useForm()
  const [NumeroDocumento, setNumeroDocumento] = useState();
  const [IdEmpresa, setIdEmpresa] = useState();

  const {empresas, loadingempresas} = useSelector(state => state.common)

  const [createClient, {isLoading, data:result, error}] = useCreateClienteMutation();
  const {data, isFetching, isError, refetch} = useGetByIdClienteQuery({
    IdEmpresa,
    NumeroDocumento,
  }, {
    skip: !IdEmpresa || !NumeroDocumento
  });

  const empresasOptions = useMemo(() => {
    if(!empresas || empresas?.length <= 0){
      return []
    }

    return empresas?.map((v) => ({
      value: v?.IdEmpresa,
      label: v?.NombreEmpresa,
    }))
  })

  const handleClear = useCallback(() => {
    setIdEmpresa(null)
    setNumeroDocumento(null)
  })

  const handleSubmit = useCallback((values) => {
    createClient({
      ...values,
      FechaExpedicion: dayjs(values?.FechaExpedicion)?.format("YYYY-MM-DD")
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

  useNotification(result?.msg, error?.data?.msg)

  useEffect(() => {
    dispatch(searchCatalog({endpoint: "empresas"}))
    return () => {
      // handleClear()
    }
  }, []);

  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <Card style={{maxWidth: 900}}>
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
              Crear
            </Button>
            <Button
              loading={isLoading}
              htmlType="reset"
              className="rounded disable-custom"
              danger
            >
              Cancelar
            </Button>
          </div>
        </Form>

        {
          data && (
            <div className='w-full my-3'>
              <Table
                columns={columns}
                loading={isFetching}
                dataSource={!isError ? [data] : []}
              />
            </div>
          )
        }
      </Card>
    </div>
  )
}
