// frontend/src/pages/ReferencesPage.tsx
import { Tabs, Select, message, Tag } from 'antd';
import ReferenceTable from '../components/ReferenceTable';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';

export default function ReferencesPage() {
  // Загружаем справочники для выпадающих списков
  const { data: zones } = useQuery({ queryKey: ['catalog/zones'], queryFn: () => api.get('catalog/zones').then(r => r.data).catch(() => []) });
  const { data: types } = useQuery({ queryKey: ['catalog/inventory-types'], queryFn: () => api.get('catalog/inventory-types').then(r => r.data).catch(() => []) });
  const { data: cells } = useQuery({ queryKey: ['catalog/cells'], queryFn: () => api.get('catalog/cells').then(r => r.data).catch(() => []) });
  const { data: suppliers } = useQuery({ queryKey: ['catalog/suppliers'], queryFn: () => api.get('catalog/suppliers').then(r => r.data).catch(() => []) });

  const items = [
    // === 1. Типы снастей (с финансами) ===
    {
      key: '1',
      label: '📦 Типы снастей',
      children: (
        <ReferenceTable
          title="Справочник типов инвентаря"
          apiPath="catalog/inventory-types"
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name' },
            { title: 'Цена/сутки', dataIndex: 'rental_price', render: (p: number) => `${p} ₽` },
            { title: 'Залог', dataIndex: 'deposit', render: (d: number) => `${d} ₽` },
            { title: 'Сборка', dataIndex: 'requires_assembly', render: (v: boolean) => v ? '✅' : '—' },
          ]}
          formFields={[
            { name: 'name', label: 'Название типа', required: true },
            { name: 'description', label: 'Описание', type: 'textarea' },
            { name: 'rental_price', label: 'Цена аренды (₽/сутки)', type: 'number', min: 0, defaultValue: 0 },
            { name: 'deposit', label: 'Залог (₽)', type: 'number', min: 0, defaultValue: 0 },
            { 
              name: 'requires_assembly', 
              label: 'Требуется сборка', 
              type: 'select', 
              options: [{label: 'Да', value: true}, {label: 'Нет', value: false}],
              defaultValue: false
            },
          ]}
          refreshDeps={['catalog/inventory']}
        />
      ),
    },

    // === 2. Зоны хранения ===
    {
      key: '2',
      label: '🗺️ Зоны',
      children: (
        <ReferenceTable
          title="Зоны хранения"
          apiPath="catalog/zones"
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name' },
            { title: 'Описание', dataIndex: 'description', ellipsis: true },
          ]}
          formFields={[
            { name: 'name', label: 'Название зоны', required: true },
            { name: 'description', label: 'Описание', type: 'textarea' },
          ]}
          refreshDeps={['catalog/cells']}
        />
      ),
    },

    // === 3. Ячейки (с вместимостью) ===
    {
      key: '3',
      label: '🗄️ Ячейки',
      children: (
        <ReferenceTable
          title="Ячейки хранения"
          apiPath="catalog/cells"
          columns={[
            { title: 'ID', dataIndex: 'id', width: 50 },
            { title: 'Название', dataIndex: 'name' },
            { title: 'Зона', dataIndex: ['zone', 'name'] },
            { title: 'Вместимость', dataIndex: 'capacity' },
            { title: 'Статус', dataIndex: 'status', render: (s: string) => {
                const colors: any = { available: 'green', full: 'orange', maintenance: 'red' };
                return <Tag color={colors[s]}>{s}</Tag>;
              }}
          ]}
          formFields={[
            { name: 'name', label: 'Название ячейки (напр. A-01-15)', required: true },
            { 
              name: 'zoneId', 
              label: 'Зона хранения', 
              type: 'select',
              required: true,
              options: zones?.map((z: any) => ({ label: z.name, value: z.id })) || []
            },
            { name: 'capacity', label: 'Вместимость (шт)', type: 'number', min: 1, defaultValue: 1 },
            { 
              name: 'status', 
              label: 'Статус', 
              type: 'select',
              options: [
                { label: '🟢 Доступна', value: 'available' },
                { label: '🟡 Заполнена', value: 'full' },
                { label: '🔴 На обслуживании', value: 'maintenance' }
              ],
              defaultValue: 'available'
            },
          ]}
          refreshDeps={['catalog/inventory']}
        />
      ),
    },

    // === 4. Поставщики (полные реквизиты) ===
    {
      key: '4',
      label: '🏢 Поставщики',
      children: (
        <ReferenceTable
          title="Справочник поставщиков"
          apiPath="catalog/suppliers"
          columns={[
            { title: 'ID', dataIndex: 'id', width: 50 },
            { title: 'Название', dataIndex: 'name' },
            { title: 'Контакт', dataIndex: 'contact_person' },
            { title: 'Телефон', dataIndex: 'phone' },
            { title: 'Email', dataIndex: 'email', render: (e: string) => e ? <a href={`mailto:${e}`}>{e}</a> : '—' },
            { title: 'ИНН', dataIndex: 'inn' },
          ]}
          formFields={[
            { name: 'name', label: 'Название организации', required: true },
            { name: 'contact_person', label: 'Контактное лицо' },
            { name: 'phone', label: 'Телефон', placeholder: '+7 (___) ___-__-__' },
            { name: 'email', label: 'Email', type: 'text', placeholder: 'example@domain.ru' },
            { name: 'inn', label: 'ИНН', placeholder: '123456789012' },
          ]}
          refreshDeps={['receiving']}
        />
      ),
    },

    // === 5. Инвентарь (полная карточка) ===
    {
      key: '5',
      label: '🎣 Инвентарь',
      children: (
        <ReferenceTable
          title="Экземпляры снастей"
          apiPath="catalog/inventory"
          columns={[
            { title: 'ID', dataIndex: 'id', width: 50 },
            { title: 'Название', dataIndex: 'name' },
            { title: 'Серийный №', dataIndex: 'serial_number', ellipsis: true },
            { title: 'Тип', dataIndex: ['type', 'name'] },
            { title: 'Ячейка', render: (_: any, r: any) => `${r.cell?.zone?.name || ''} / ${r.cell?.name || ''}` },
            { title: 'Статус', dataIndex: 'status', render: (s: string) => {
                const colors: any = { available: 'green', rented: 'blue', maintenance: 'orange', lost: 'red', written_off: 'gray' };
                return <Tag color={colors[s]}>{s}</Tag>;
              }},
            { title: 'Состояние', dataIndex: 'condition', render: (c: string) => {
                const colors: any = { new: 'green', used: 'blue', damaged: 'red', repaired: 'orange' };
                return <Tag color={colors[c]}>{c}</Tag>;
              }},
          ]}
          formFields={[
            { name: 'name', label: 'Отображаемое название', required: true },
            { 
              name: 'serial_number', 
              label: 'Серийный номер', 
              required: true,
              placeholder: 'Уникальный идентификатор (штрих-код)'
            },
            { 
              name: 'typeId', 
              label: 'Тип инвентаря', 
              type: 'select',
              required: true,
              options: types?.map((t: any) => ({ label: t.name, value: t.id })) || []
            },
            { 
              name: 'cellId', 
              label: 'Ячейка хранения', 
              type: 'select',
              required: true,
              options: cells?.map((c: any) => ({ label: `${c.zone?.name} / ${c.name}`, value: c.id })) || []
            },
            { 
              name: 'status', 
              label: 'Статус', 
              type: 'select',
              options: [
                { label: '🟢 Доступен', value: 'available' },
                { label: '🔵 Арендован', value: 'rented' },
                { label: '🟠 На обслуживании', value: 'maintenance' },
                { label: '🔴 Утерян', value: 'lost' },
                { label: '⚫ Списан', value: 'written_off' }
              ],
              defaultValue: 'available'
            },
            { 
              name: 'condition', 
              label: 'Состояние', 
              type: 'select',
              options: [
                { label: '✨ Новый', value: 'new' },
                { label: '🔄 Б/у', value: 'used' },
                { label: '⚠️ Повреждён', value: 'damaged' },
                { label: '🔧 Отремонтирован', value: 'repaired' }
              ],
              defaultValue: 'new'
            },
            { name: 'purchase_date', label: 'Дата закупки', type: 'date' },
            { name: 'purchase_price', label: 'Закупочная цена (₽)', type: 'number', min: 0 },
          ]}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} style={{ padding: 20 }} tabPosition="left" />;
}