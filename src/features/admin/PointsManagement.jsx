import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Typography, 
  message,
  Tabs,
  Row,
  Col,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ExportOutlined,
  HistoryOutlined
} from '@ant-design/icons';

import { 
  getPointTransactions, 
  addPoints, 
  deductPoints, 
  getPointsExpirationSettings 
} from '../services/pointsService';
import { getUsers } from '../services/userService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PointsManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [transactionType, setTransactionType] = useState('all');
  const [expirationSettings, setExpirationSettings] = useState({});
  
  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchExpirationSettings();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getPointTransactions();
      setTransactions(data);
    } catch (error) {
      message.error('Failed to fetch transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
      console.error(error);
    }
  };

  const fetchExpirationSettings = async () => {
    try {
      const settings = await getPointsExpirationSettings();
      setExpirationSettings(settings);
    } catch (error) {
      console.error('Failed to fetch expiration settings:', error);
    }
  };

  const showAdjustModal = (type) => {
    setAdjustmentType(type);
    form.resetFields();
    setModalVisible(true);
  };

  const handleAdjustPoints = async () => {
    try {
      const values = await form.validateFields();
      
      if (adjustmentType === 'add') {
        await addPoints({
          userId: values.userId,
          points: values.points,
          reason: values.reason,
          expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
        });
        message.success(`Added ${values.points} points to user`);
      } else {
        await deductPoints({
          userId: values.userId,
          points: values.points,
          reason: values.reason,
        });
        message.success(`Deducted ${values.points} points from user`);
      }
      
      setModalVisible(false);
      fetchTransactions();
    } catch (error) {
      message.error('Failed to adjust points');
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Text search
    if (searchText) {
      filtered = filtered.filter(tx => 
        tx.username.toLowerCase().includes(searchText.toLowerCase()) ||
        tx.reason.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate >= startDate && txDate <= endDate;
      });
    }
    
    if (transactionType !== 'all') {
      filtered = filtered.filter(tx => tx.type === transactionType);
    }
    
    return filtered;
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Transaction Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Text style={{ 
          color: type === 'credit' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      ),
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (points, record) => (
        <Text style={{ 
          color: record.type === 'credit' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {record.type === 'credit' ? '+' : '-'}{points}
        </Text>
      ),
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Date & Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expiresAt) => expiresAt ? expiresAt : 'Never',
    },
    {
      title: 'Admin',
      dataIndex: 'adminName',
      key: 'adminName',
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="transactions">
        <TabPane tab="Points Transactions" key="transactions">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Title level={4}>Points Transaction History</Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => showAdjustModal('add')}
                >
                  Add Points
                </Button>
                <Button 
                  danger 
                  icon={<PlusOutlined />} 
                  onClick={() => showAdjustModal('deduct')}
                >
                  Deduct Points
                </Button>
              </Space>
            </div>
            
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search users or reasons"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200 }}
              />
              <RangePicker onChange={handleDateRangeChange} />
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handleTransactionTypeChange}
              >
                <Option value="all">All Transactions</Option>
                <Option value="credit">Credits</Option>
                <Option value="debit">Debits</Option>
              </Select>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Space>
            
            <Table 
              columns={columns} 
              dataSource={filterTransactions()} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Expiration Settings" key="expiration">
          <Card>
            <Title level={4}>Points Expiration Settings</Title>
            <Form layout="vertical" initialValues={expirationSettings}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="expirationEnabled"
                    label="Enable Points Expiration"
                    valuePropName="checked"
                  >
                    <Select>
                      <Option value={true}>Enabled</Option>
                      <Option value={false}>Disabled</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={8}>
                  <Form.Item
                    name="defaultExpirationPeriod"
                    label="Default Expiration Period (days)"
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={8}>
                  <Form.Item
                    name="expirationNotificationDays"
                    label="Send Notification Days Before Expiry"
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary">Save Settings</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={`${adjustmentType === 'add' ? 'Add' : 'Deduct'} Points`}
        open={modalVisible}
        onOk={handleAdjustPoints}
        onCancel={() => setModalVisible(false)}
        okText={adjustmentType === 'add' ? 'Add Points' : 'Deduct Points'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="Select User"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select
              showSearch
              placeholder="Select a user"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name} ({user.email})</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="points"
            label="Points"
            rules={[
              { required: true, message: 'Please enter number of points' },
              { type: 'number', min: 1, message: 'Points must be greater than 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter points"
              min={1}
            />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter reason for point adjustment"
            />
          </Form.Item>
          
          {adjustmentType === 'add' && (
            <Form.Item
              name="expiresAt"
              label="Expiration Date (Optional)"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PointsManagement;