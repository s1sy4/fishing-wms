import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Tag } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { PlusOutlined, BarcodeOutlined } from '@ant-design/icons';

export default function ReceivingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Загрузка накладных
  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receiving'],
    queryFn: () => api.get('receiving').then(r => r.data)
  });

  // Загрузка справочников для форм
  const { data: suppliers } = useQuery({
    queryKey: ['catalog/suppliers'],
    queryFn: () => api.get('catalog/suppliers').then(r => r.data).catch(() => [])
  });

  const { data: types } = useQuery({
    queryKey: ['catalog/inventory-types'],
    queryFn: () => api.get('catalog/inventory-types').then(r => r.data)
  });

  // Мутации
  const createReceipt = useMutation({
    mutationFn: (v: any) => api.post('receiving', v),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['receiving'] }); message.success('Накладная создана!'); setIsModalOpen(false); form.resetFields(); }
  });

  const addItem = useMutation({
    mutationFn: (v: any) => api.post('receiving/items', v),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['receiving'] }); message.success('Товар оприходован!'); setIsItemModalOpen(false); itemForm.resetFields(); }
  });

  const deleteReceipt = useMutation({
    mutationFn: (id: number) => api.delete(`receiving/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['receiving'] }); message.success('Накладная удалена'); }
  });

  // Обработчики
  const handleCreateReceipt = async () => {
    const values = await form.validateFields();
    createReceipt.mutate(values);
  };

  const handleAddItem = async () => {
    const values = await itemForm.validateFields();
    if (!selectedReceipt) return message.error('Выберите накладную');
    addItem.mutate({ ...values, receiptId: selectedReceipt.id });
  };

  const openItemModal = (receipt: any) => {
    setSelectedReceipt(receipt);
    itemForm.setFieldsValue({ receiptId: receipt.id });
    setIsItemModalOpen(true);
  };

  // Симуляция сканера: поле с автофокусом, ввод = добавление
  const [scanValue, setScanValue] = useState('');
  const handleScan = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && scanValue.trim()) {
      // В реальном проекте: поиск по штрих-коду в БД
      message.info(`Отсканировано: ${scanValue}`);
      setScanValue('');
    }
  };

  const columns = [
    { title: '№', dataIndex: 'number', key: 'number', width: 120 },
    { title: 'Поставщик', dataIndex: ['supplier', 'name'], key: 'supplier' },
    { 
      title: 'Дата', 
      dataIndex: 'date', 
      key: 'date',
      render: (d: string) => new Date(d).toLocaleString('ru-RU')
    },
    { 
      title: 'Позиций', 
      key: 'itemsCount',
      render: (_: any, r: any) => r.items?.length || 0
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => openItemModal(record)}>➕ Добавить товар</Button>
          <Button size="small" danger onClick={() => deleteReceipt.mutate(record.id)}>🗑️</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>📥 Приёмка товара</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Новая накладная
        </Button>
      </div>

      {/* Симулятор сканера */}
      <div style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 6 }}>
        <Space>
          <BarcodeOutlined />
          <Input 
            placeholder="🔦 Сканируйте штрих-код (Enter)" 
            value={scanValue}
            onChange={e => setScanValue(e.target.value)}
            onKeyDown={handleScan}
            style={{ width: 300 }}
            autoFocus
          />
          <Tag color="blue">USB-HID режим</Tag>
        </Space>
      </div>

      <Table 
        dataSource={receipts} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading} 
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record: any) => (
            <Table 
              dataSource={record.items} 
              columns={[
                { title: 'Тип', dataIndex: ['type', 'name'], key: 'type' },
                { title: 'Кол-во', dataIndex: 'quantity', key: 'qty' },
                { title: 'Цена', dataIndex: 'price', key: 'price', render: (p: number) => `${p} ₽` }
              ]} 
              rowKey="id" 
              pagination={false} 
              size="small"
            />
          )
        }}
      />

      {/* Модалка: создание накладной */}
      <Modal title="Новая приходная накладная" open={isModalOpen} onOk={handleCreateReceipt} onCancel={() => setIsModalOpen(false)} confirmLoading={createReceipt.isPending}>
        <Form form={form} layout="vertical">
          <Form.Item name="supplierId" label="Поставщик" rules={[{ required: true }]}>
            <Select placeholder="Выберите поставщика">
              {suppliers?.map((s: any) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Дата (опционально)">
            <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Модалка: добавление позиции */}
      <Modal title={`Добавить товар в накладную #${selectedReceipt?.number}`} open={isItemModalOpen} onOk={handleAddItem} onCancel={() => setIsItemModalOpen(false)} confirmLoading={addItem.isPending}>
        <Form form={itemForm} layout="vertical">
          <Form.Item name="typeId" label="Тип снасти" rules={[{ required: true }]}>
            <Select placeholder="Выберите тип">
              {types?.map((t: any) => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Количество" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="price" label="Цена за единицу (₽)" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}