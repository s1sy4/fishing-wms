import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface ReferenceTableProps {
  title: string;
  apiPath: string;
  columns: any[];
  // 🔹 ИЗМЕНЕНИЕ: Поддержка кастомных полей (Select и др.)
  formFields: {
    name: string;
    label: string;
    required?: boolean;
    render?: () => React.ReactNode; // ← ПОЛЕ ДЛЯ КАСТОМНОГО РЕНДЕРА
  }[];
}

export default function ReferenceTable({ title, apiPath, columns, formFields }: ReferenceTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: [apiPath], queryFn: () => api.get(apiPath).then(res => res.data) });
  const invalidateCache = () => queryClient.invalidateQueries({ queryKey: [apiPath] });

  const createMutation = useMutation({ mutationFn: (v: any) => api.post(apiPath, v), onSuccess: () => { invalidateCache(); message.success('Создано!'); setIsModalOpen(false); } });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: any) => api.patch(`${apiPath}/${id}`, values), onSuccess: () => { invalidateCache(); message.success('Обновлено!'); setIsModalOpen(false); } });
  const deleteMutation = useMutation({ mutationFn: (id: number) => api.delete(`${apiPath}/${id}`), onSuccess: () => { invalidateCache(); message.success('Удалено!'); } });

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) form.setFieldsValue(item); else form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) updateMutation.mutate({ id: editingItem.id, values });
      else createMutation.mutate(values);
    } catch (err) { console.error('Validation failed:', err); }
  };

  const actionColumn = {
    title: 'Действия', key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
        <Popconfirm title="Удалить?" onConfirm={() => deleteMutation.mutate(record.id)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{title}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Добавить</Button>
      </div>
      <Table dataSource={data} columns={[...columns, actionColumn]} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} />
      <Modal title={editingItem ? 'Редактировать' : 'Создать'} open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)} confirmLoading={createMutation.isPending || updateMutation.isPending}>
        <Form form={form} layout="vertical">
          {formFields.map((field) => (
            <Form.Item key={field.name} name={field.name} label={field.label} rules={[{ required: field.required !== false }]}>
              {/* 🔹 ИЗМЕНЕНИЕ: Кастомный рендер или обычный Input */}
              {field.render ? field.render() : <Input />}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}