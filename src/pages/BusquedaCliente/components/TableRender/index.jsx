import { Button, ConfigProvider, Empty, Table } from 'antd'
import { useMemo } from 'react'
import { MdRefresh } from 'react-icons/md'

export default ({
    title = "",
    columns = [],
    queryParams = {},
    skipCondition = false,
    getQueryHook = () => { },
    scroll = { x: 1000, y: 500 },
}) => {


    const { data, isFetching, isError, refetch } = getQueryHook({
        ...(queryParams && { ...queryParams })
    }, {
        skip: skipCondition
    })

    const dataFormatted = useMemo(() => {
        if (!data || data?.length <= 0 || !!isError) {
            return []
        }

        return data;
    }, [data, isError])

    return (
        <div className='w-full'>
            <ConfigProvider
                renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={"No se han encontrado datos. Intente de nuevo más tarde"} />}
            >
                <div className='w-full flex justify-between items-center mb-1'>
                    <div>
                        <h3 className='text-lg text-primary font-bold'>{title}</h3>
                    </div>
                    <div>
                        <Button 
                        loading={isFetching}
                        onClick={refetch}
                        icon={<MdRefresh />}
                        />
                    </div>
                </div>
                <Table
                    loading={isFetching}
                    columns={columns}
                    dataSource={dataFormatted}
                    scroll={scroll}
                />
            </ConfigProvider>
        </div>
    )
}
