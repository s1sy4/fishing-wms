// frontend/src/components/ReferenceTable.tsx
import React, { useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Select,
  Space, Popconfirm, message, DatePicker, Tag
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat); // для парсинга строк
interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  options?: { label: string; value: any }[]; // для select
  render?: (form: any) => React.ReactNode; // кастомный рендер
  defaultValue?: any;
  min?: number; // для InputNumber
  max?: number;
  placeholder?: string;
}

interface ReferenceTableProps {
  title: string;
  apiPath: string;
  columns: any[];
  formFields: FieldConfig[];
  refreshDeps?: string[]; // какие запросы инвалидировать после изменения
}

export default function ReferenceTable({
  title, apiPath, columns, formFields, refreshDeps = []
}: ReferenceTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [apiPath],
    queryFn: () => api.get(apiPath).then(res => res.data).catch(() => [])
  });

  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: [apiPath] });
    refreshDeps.forEach(dep => queryClient.invalidateQueries({ queryKey: [dep] }));
  };

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post(apiPath, values),
    onSuccess: () => { invalidateCache(); message.success('Создано!'); setIsModalOpen(false); },
    onError: () => message.error('Ошибка создания')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.patch(`${apiPath}/${id}`, values),
    onSuccess: () => { invalidateCache(); message.success('Обновлено!'); setIsModalOpen(false); },
    onError: () => message.error('Ошибка обновления')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`${apiPath}/${id}`),
    onSuccess: () => { invalidateCache(); message.success('Удалено!'); },
    onError: () => message.error('Ошибка удаления')
  });

  const handleOpenModal = (item: any = null) => { // ← добавь : any
    setEditingItem(item);
    if (item) {
      const values = { ...item }; // ✅ теперь item: any
      formFields.forEach(f => {
        if (f.type === 'date' && values[f.name]) {
          values[f.name] = new Date(values[f.name]);
        }
      });
      form.setFieldsValue(values);
    } else {
      form.resetFields();
      formFields.forEach(f => {
        if (f.defaultValue !== undefined) {
          form.setFieldValue(f.name, f.defaultValue);
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Преобразуем даты в ISO для отправки
      const payload = { ...values };
      formFields.forEach(f => {
        if (f.type === 'date' && payload[f.name]) {
          // ✅ dayjs-объект или Date → ISO-строка
          const dateVal = payload[f.name];
          payload[f.name] = dayjs.isDayjs(dateVal)
            ? dateVal.toISOString()
            : (dateVal instanceof Date ? dateVal.toISOString() : dateVal);
        }
      });

      if (editingItem) {
        updateMutation.mutate({ id: editingItem.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const actionColumn = {
    title: 'Действия',
    key: 'action',
    width: 120,
    render: (_: any, record: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
        <Popconfirm title="Удалить?" onConfirm={() => deleteMutation.mutate(record.id)} okText="Да" cancelText="Нет">
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      placeholder: field.placeholder || `Введите ${field.label.toLowerCase()}`,
    };

    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} min={field.min} max={field.max} {...commonProps} />;
      case 'select':
        return (
          <Select {...commonProps}>
            {field.options?.map(opt => (
              <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
            ))}
          </Select>
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} showTime {...commonProps} />;
      case 'textarea':
        return <Input.TextArea rows={3} {...commonProps} />;
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{title}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Добавить
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={[...columns, actionColumn]}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingItem ? '✏️ Редактировать' : '➕ Создать'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          {formFields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Заполните "${field.label}"` }]}
            >
              {field.render ? field.render(form) : renderField(field)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}