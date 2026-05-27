import { useState, useEffect } from 'react';
import { Button, Form, Input, message, Tabs, Layout, Menu } from 'antd';
import { api } from './api/axios';
import ReferencesPage from './pages/ReferencesPage';
import ReceivingPage from './pages/ReceivingPage';
import RentalPage from './pages/RentalPage';

const { Header, Sider, Content } = Layout;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('login');
  const [token, setToken] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState('references');

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const handleLogin = async (v: any) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', v);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      message.success('Вход выполнен!');
    } catch { message.error('Неверные данные'); } finally { setLoading(false); }
  };

  const handleRegister = async (v: any) => {
    setLoading(true);
    try {
      await api.post('/auth/register', v);
      message.success('Аккаунт создан! Войдите.');
      setActiveKey('login');
    } catch { message.error('Ошибка регистрации'); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    message.info('Выход выполнен');
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <div style={{ width: 350, background: '#fff', padding: 30, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', color: '#001529', marginBottom: 20 }}>WMS Снасти 🎣</h2>
          <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
            { key: 'login', label: 'Вход', children: <Form onFinish={handleLogin} layout="vertical"><Form.Item name="email" rules={[{ required: true }]}><Input placeholder="Email" /></Form.Item><Form.Item name="password" rules={[{ required: true }]}><Input.Password placeholder="Пароль" /></Form.Item><Form.Item><Button type="primary" htmlType="submit" loading={loading} block>Войти</Button></Form.Item></Form> },
            { key: 'register', label: 'Регистрация', children: <Form onFinish={handleRegister} layout="vertical"><Form.Item name="name" rules={[{ required: true }]}><Input placeholder="ФИО" /></Form.Item><Form.Item name="email" rules={[{ required: true }]}><Input placeholder="Email" /></Form.Item><Form.Item name="password" rules={[{ required: true }]}><Input.Password placeholder="Пароль" /></Form.Item><Button type="primary" htmlType="submit" loading={loading} block>Зарегистрироваться</Button></Form> }
          ]} centered />
        </div>
      </div>
    );
  }

  const menuItems = [
    { key: 'references', label: '📚 Справочники' },
    { key: 'receiving', label: '📥 Приёмка' },
    { key: 'rental', label: '🎣 Аренда' },
    { key: 'inventory', label: '📋 Инвентаризация' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#fff' }}>
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}><strong>WMS Снасти 🎣</strong></div>
        <Menu mode="inline" selectedKeys={[selectedMenu]} onClick={(e) => setSelectedMenu(e.key)} style={{ borderRight: 0, height: 'calc(100vh - 64px)' }} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Система управления складом</span>
          <Button danger onClick={handleLogout}>Выйти</Button>
        </Header>
        <Content style={{ margin: '16px', background: '#f0f2f5', borderRadius: 8 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 120px)' }}>
            {selectedMenu === 'references' && <ReferencesPage />}
            {selectedMenu === 'receiving' && <ReceivingPage />}
            {selectedMenu === 'rental' && <RentalPage />}
            {selectedMenu !== 'references' && selectedMenu !== 'receiving' && selectedMenu !== 'rental' && (
              <div style={{ padding: 20 }}>🚧 Модуль в разработке</div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}