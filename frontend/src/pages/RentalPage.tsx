import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Tag, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { PlusOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function RentalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Данные
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['rental/contracts'],
    queryFn: () => api.get('rental').then(r => r.data)
  });

  const { data: availableInventory } = useQuery({
    queryKey: ['catalog/inventory'],
    queryFn: () => api.get('catalog/inventory').then(r => r.data).catch(() => [])
  });

  const filteredInventory = availableInventory?.filter((i: any) => i.status === 'available') || [];

  // Мутации
  const createContract = useMutation({
    mutationFn: (v: any) => api.post('rental', v),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rental/contracts'] }); message.success('Договор создан!'); setIsModalOpen(false); form.resetFields(); }
  });

  const addItem = useMutation({
    mutationFn: (v: any) => api.post('rental/items', v),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rental/contracts', 'catalog/inventory'] }); message.success('Инвентарь добавлен!'); setIsItemModalOpen(false); itemForm.resetFields(); }
  });

  const completeContract = useMutation({
    mutationFn: (id: number) => api.post(`rental/complete/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rental/contracts', 'catalog/inventory'] }); message.success('Договор завершён, инвентарь возвращён!'); }
  });

  // Обработчики
  const handleCreate = async () => {
    const values = await form.validateFields();
    createContract.mutate({
      ...values,
      startDate: values.dates[0].toISOString(),
      endDate: values.dates[1].toISOString()
    });
  };

  const handleAddItem = async () => {
    const values = await itemForm.validateFields();
    if (!selectedContract) return;
    addItem.mutate({ contractId: selectedContract.id, inventoryId: values.inventoryId });
  };

  const handleComplete = (id: number) => {
    completeContract.mutate(id);
  };

  // Колонки таблицы
  const columns = [
    { title: '№ Договора', dataIndex: 'number', key: 'number', width: 120 },
    { title: 'Клиент', dataIndex: ['customer', 'name'], key: 'customer' },
    { 
      title: 'Период', 
      key: 'dates',
      render: (_: any, r: any) => `${dayjs(r.startDate).format('DD.MM')} – ${dayjs(r.endDate).format('DD.MM.YY')}`
    },
    { 
      title: 'Статус', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => s === 'active' ? <Tag color="blue">Активен</Tag> : <Tag color="default">Завершён</Tag>
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'active' && (
            <>
              <Button size="small" icon={<PlusOutlined />} onClick={() => { setSelectedContract(record); setIsItemModalOpen(true); }}>Добавить снасть</Button>
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleComplete(record.id)}>Завершить</Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>🎣 Аренда снастей</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Новый договор</Button>
      </div>

      <Table
        dataSource={contracts}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record: any) => (
            <Table
              dataSource={record.items}
              columns={[
                { title: 'Тип', dataIndex: ['inventory', 'type', 'name'], key: 'type' },
                { title: 'Название/№', dataIndex: ['inventory', 'name'], key: 'name' },
                { title: 'Ячейка', render: (_: any, r: any) => `${r.inventory?.cell?.zone?.name || ''} / ${r.inventory?.cell?.name || ''}` }
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          )
        }}
      />

      {/* Модалка: Создание договора */}
      <Modal title="Новый договор аренды" open={isModalOpen} onOk={handleCreate} onCancel={() => setIsModalOpen(false)} confirmLoading={createContract.isPending}>
        <Form form={form} layout="vertical">
          <Form.Item name="customerName" label="ФИО Клиента" rules={[{ required: true }]}>
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>
          <Form.Item name="dates" label="Период аренды" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Модалка: Добавление снасти */}
      <Modal title={`Добавить снасть в #${selectedContract?.number}`} open={isItemModalOpen} onOk={handleAddItem} onCancel={() => setIsItemModalOpen(false)} confirmLoading={addItem.isPending}>
        <Form form={itemForm} layout="vertical">
          <Form.Item name="inventoryId" label="Доступный инвентарь" rules={[{ required: true }]}>
            <Select placeholder="Выберите снасть" showSearch optionFilterProp="children">
              {filteredInventory.map((inv: any) => (
                <Select.Option key={inv.id} value={inv.id}>
                  {inv.type?.name} / {inv.name} ({inv.cell?.zone?.name}/{inv.cell?.name})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ color: '#888', fontSize: 12 }}>
            ⚠️ После добавления статус снасти изменится на <b>"Арендован"</b>
          </div>
        </Form>
      </Modal>
    </div>
  );
}