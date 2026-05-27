// frontend/src/pages/ReferencesPage.tsx
import { Tabs, Select, message } from 'antd';
import ReferenceTable from '../components/ReferenceTable';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';

export default function ReferencesPage() {
  // Загружаем справочники для выпадающих списков
  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ['catalog/zones'],
    queryFn: () => api.get('catalog/zones').then(r => r.data).catch(() => [])
  });

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ['catalog/inventory-types'],
    queryFn: () => api.get('catalog/inventory-types').then(r => r.data).catch(() => [])
  });

  const { data: cells, isLoading: cellsLoading } = useQuery({
    queryKey: ['catalog/cells'],
    queryFn: () => api.get('catalog/cells').then(r => r.data).catch(() => [])
  });

  // 🔹 НОВОЕ: Загрузка поставщиков с обработкой ошибки
  const { data: suppliers, isLoading: suppliersLoading, isError: suppliersError } = useQuery({
    queryKey: ['catalog/suppliers'],
    queryFn: () => api.get('catalog/suppliers').then(r => r.data).catch((err) => {
      console.error('Ошибка загрузки поставщиков:', err);
      message.error('Не удалось загрузить поставщиков');
      return [];
    })
  });

  const items = [
    // === 1. Типы снастей ===
    {
      key: '1',
      label: '📦 Типы снастей',
      children: (
        <ReferenceTable
          title="Справочник типов"
          apiPath="catalog/inventory-types"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name', key: 'name' },
          ]}
          formFields={[{ name: 'name', label: 'Название типа' }]}
        />
      ),
    },

    // === 2. Зоны хранения ===
    {
      key: '2',
      label: '🗺️ Зоны хранения',
      children: (
        <ReferenceTable
          title="Справочник зон"
          apiPath="catalog/zones"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name', key: 'name' },
          ]}
          formFields={[{ name: 'name', label: 'Название зоны' }]}
        />
      ),
    },

    // === 3. Поставщики (НОВОЕ) ===
    {
      key: '3',
      label: '🏢 Поставщики',
      children: suppliersError ? (
        <div style={{ padding: 20, color: '#ff4d4f' }}>
          ⚠️ Не удалось загрузить поставщиков. Проверь консоль (F12) и логи бэкенда.
        </div>
      ) : (
        <ReferenceTable
          title="Справочник поставщиков"
          apiPath="catalog/suppliers"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name', key: 'name' },
          ]}
          formFields={[{ name: 'name', label: 'Название поставщика' }]}
        />
      ),
    },

    // === 4. Ячейки (была 3, стала 4) ===
    {
      key: '4',
      label: '🗄️ Ячейки',
      children: (
        <ReferenceTable
          title="Ячейки хранения"
          apiPath="catalog/cells"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: 'Название', dataIndex: 'name', key: 'name' },
            { title: 'Зона', dataIndex: ['zone', 'name'], key: 'zone', render: (z: any) => z || '—' },
          ]}
          formFields={[
            { name: 'name', label: 'Название ячейки' },
            { 
              name: 'zoneId', 
              label: 'Зона', 
              required: true, 
              render: () => zonesLoading ? <Select loading /> : (
                <Select placeholder="Выберите зону">
                  {zones?.map((z: any) => (
                    <Select.Option key={z.id} value={z.id}>{z.name}</Select.Option>
                  ))}
                </Select>
              )
            }
          ]}
        />
      ),
    },

    // === 5. Инвентарь (была 4, стала 5) ===
    {
      key: '5',
      label: '🎣 Инвентарь',
      children: (
        <ReferenceTable
          title="Экземпляры снастей"
          apiPath="catalog/inventory"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: 'Название/№', dataIndex: 'name', key: 'name' },
            { title: 'Тип', dataIndex: ['type', 'name'], key: 'type', render: (t: any) => t || '—' },
            { title: 'Ячейка', key: 'cell', render: (_: any, r: any) => `${r.cell?.zone?.name || ''} / ${r.cell?.name || ''}` },
            { 
              title: 'Статус', 
              dataIndex: 'status', 
              key: 'status',
              render: (s: string) => {
                const colors: any = { available: 'green', rented: 'blue', maintenance: 'orange', lost: 'red' };
                return <span style={{ color: colors[s] || 'gray' }}>{s}</span>;
              }
            },
          ]}
          formFields={[
            { name: 'name', label: 'Название / Серийный №' },
            { 
              name: 'typeId', 
              label: 'Тип', 
              required: true, 
              render: () => typesLoading ? <Select loading /> : (
                <Select placeholder="Выберите тип">
                  {types?.map((t: any) => (
                    <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                  ))}
                </Select>
              )
            },
            { 
              name: 'cellId', 
              label: 'Ячейка', 
              required: true, 
              render: () => cellsLoading ? <Select loading /> : (
                <Select placeholder="Выберите ячейку">
                  {cells?.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>{c.zone?.name} / {c.name}</Select.Option>
                  ))}
                </Select>
              )
            },
            { 
              name: 'status', 
              label: 'Статус', 
              render: () => (
                <Select defaultValue="available">
                  <Select.Option value="available">Доступен</Select.Option>
                  <Select.Option value="rented">Арендован</Select.Option>
                  <Select.Option value="maintenance">На обслуживании</Select.Option>
                  <Select.Option value="lost">Утерян</Select.Option>
                </Select>
              )
            }
          ]}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} style={{ padding: 20 }} />;
}