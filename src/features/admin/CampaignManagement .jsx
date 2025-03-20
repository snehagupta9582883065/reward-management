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
    InputNumber,
    Switch,
    Tabs,
    Typography,
    message,
    Divider,
    Tag,
    Tooltip,
    Badge
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    SearchOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

import {
    getCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    getCampaignStats
} from '../services/pointsService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [campaignStats, setCampaignStats] = useState({});
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [currentCampaignPreview, setCurrentCampaignPreview] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const data = await getCampaigns();
            setCampaigns(data);

            const statsPromises = data.map(campaign => getCampaignStats(campaign.id));
            const statsResults = await Promise.all(statsPromises);
            const statsMap = {};

            statsResults.forEach((stats, index) => {
                statsMap[data[index].id] = stats;
            });

            setCampaignStats(statsMap);
        } catch (error) {
            message.error('Failed to fetch campaigns');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const showCreateModal = () => {
        setEditingCampaign(null);
        form.resetFields();
        setModalVisible(true);
    };

    const showEditModal = (campaign) => {
        setEditingCampaign(campaign);
        form.setFieldsValue({
            name: campaign.name,
            description: campaign.description,
            type: campaign.type,
            points: campaign.points,
            startDate: campaign.startDate ? new Date(campaign.startDate) : null,
            endDate: campaign.endDate ? new Date(campaign.endDate) : null,
            targetUsers: campaign.targetUsers,
            isActive: campaign.isActive,
            rules: campaign.rules,
            maxRedemptionsPerUser: campaign.maxRedemptionsPerUser,
            totalBudget: campaign.totalBudget,
        });
        setModalVisible(true);
    };

    const handleDelete = async (campaignId) => {
        try {
            await deleteCampaign(campaignId);
            message.success('Campaign deleted successfully');
            fetchCampaigns();
        } catch (error) {
            message.error('Failed to delete campaign');
            console.error(error);
        }
    };

    const handleDuplicate = async (campaignId) => {
        try {
            await duplicateCampaign(campaignId);
            message.success('Campaign duplicated successfully');
            fetchCampaigns();
        } catch (error) {
            message.error('Failed to duplicate campaign');
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingCampaign) {
                await updateCampaign(editingCampaign.id, values);
                message.success('Campaign updated successfully');
            } else {
                await createCampaign(values);
                message.success('Campaign created successfully');
            }

            setModalVisible(false);
            fetchCampaigns();
        } catch (error) {
            message.error('Form validation failed');
            console.error(error);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    const showPreviewModal = (campaign) => {
        setCurrentCampaignPreview(campaign);
        setPreviewModalVisible(true);
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        let matchesSearch = true;
        let matchesStatus = true;

        if (searchText) {
            matchesSearch = campaign.name.toLowerCase().includes(searchText.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchText.toLowerCase());
        }

        if (statusFilter !== 'all') {
            matchesStatus = statusFilter === 'active' ? campaign.isActive : !campaign.isActive;
        }

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space>
                    <Text strong>{text}</Text>
                    {record.isActive ? (
                        <Badge status="success" text="Active" />
                    ) : (
                        <Badge status="error" text="Inactive" />
                    )}
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Purchase', value: 'purchase' },
                { text: 'Referral', value: 'referral' },
                { text: 'Engagement', value: 'engagement' },
                { text: 'Loyalty', value: 'loyalty' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (type) => (
                <Tag color={
                    type === 'purchase' ? 'green' :
                        type === 'referral' ? 'blue' :
                            type === 'engagement' ? 'purple' :
                                'orange'
                }>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
            sorter: (a, b) => a.points - b.points,
        },
        {
            title: 'Date Range',
            key: 'dateRange',
            render: (_, record) => (
                <span>
                    {record.startDate ? new Date(record.startDate).toLocaleDateString() : 'N/A'} - {record.endDate ? new Date(record.endDate).toLocaleDateString() : 'Ongoing'}
                </span>
            ),
        },
        {
            title: 'Performance',
            key: 'performance',
            render: (_, record) => {
                const stats = campaignStats[record.id] || {};
                return (
                    <Space direction="vertical" size="small">
                        <Text>Redemptions: {stats.totalRedemptions || 0}</Text>
                        <Text>Points Issued: {stats.pointsIssued || 0}</Text>
                        <Text>Conversion: {stats.conversionRate || 0}%</Text>
                    </Space>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Preview">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showPreviewModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => showEditModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Duplicate">
                        <Button
                            icon={<CopyOutlined />}
                            size="small"
                            onClick={() => handleDuplicate(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4}>Campaign Management</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Create Campaign
                    </Button>
                </div>

                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search campaigns"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 150 }}
                        onChange={handleStatusFilter}
                    >
                        <Option value="all">All Status</Option>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredCampaigns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                width={800}
                okText={editingCampaign ? 'Update' : 'Create'}
            >
                <Form form={form} layout="vertical">
                    <Tabs defaultActiveKey="basic">
                        <TabPane tab="Basic Information" key="basic">
                            <Form.Item
                                name="name"
                                label="Campaign Name"
                                rules={[{ required: true, message: 'Please enter campaign name' }]}
                            >
                                <Input placeholder="Enter campaign name" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter description' }]}
                            >
                                <Input.TextArea rows={3} placeholder="Enter campaign description" />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label="Campaign Type"
                                rules={[{ required: true, message: 'Please select campaign type' }]}
                            >
                                <Select placeholder="Select campaign type">
                                    <Option value="purchase">Purchase</Option>
                                    <Option value="referral">Referral</Option>
                                    <Option value="engagement">Engagement</Option>
                                    <Option value="loyalty">Loyalty</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="points"
                                label="Points"
                                rules={[
                                    { required: true, message: 'Please enter points' },
                                    { type: 'number', min: 1, message: 'Points must be greater than 0' }
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} placeholder="Enter points" min={1} />
                            </Form.Item>

                            <Form.Item
                                name="isActive"
                                label="Status"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Schedule & Targets" key="schedule">
                            <Form.Item
                                name="startDate"
                                label="Start Date"
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="endDate"
                                label="End Date"
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="targetUsers"
                                label="Target Users"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select target user segments"
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">All Users</Option>
                                    <Option value="new">New Users</Option>
                                    <Option value="existing">Existing Users</Option>
                                    <Option value="inactive">Inactive Users</Option>
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Rules & Limits" key="rules">
                            <Form.Item
                                name="rules"
                                label="Rules"
                            >
                                <Input.TextArea rows={4} placeholder="Enter campaign rules" />
                            </Form.Item>

                            <Form.Item
                                name="maxRedemptionsPerUser"
                                label="Max Redemptions Per User"
                            >
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter max redemptions per user (0 for unlimited)" />
                            </Form.Item>

                            <Form.Item
                                name="totalBudget"
                                label="Total Budget (Points)"
                            >
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter total budget (0 for unlimited)" />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>

            <Modal
                title="Campaign Preview"
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setPreviewModalVisible(false)}>
                        Close
                    </Button>,
                    <Button key="edit" type="primary" onClick={() => {
                        setPreviewModalVisible(false);
                        showEditModal(currentCampaignPreview);
                    }}>
                        Edit Campaign
                    </Button>,
                ]}
                width={600}
            >
                {currentCampaignPreview && (
                    <div>
                        <Title level={4}>{currentCampaignPreview.name}</Title>
                        <Text type="secondary">{currentCampaignPreview.description}</Text>

                        <Divider />

                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Campaign Type: </Text>
                                <Tag color={
                                    currentCampaignPreview.type === 'purchase' ? 'green' :
                                        currentCampaignPreview.type === 'referral' ? 'blue' :
                                            currentCampaignPreview.type === 'engagement' ? 'purple' :
                                                'orange'
                                }>
                                    {currentCampaignPreview.type.toUpperCase()}
                                </Tag>
                            </div>

                            <div>
                                <Text strong>Points: </Text>
                                <Text>{currentCampaignPreview.points}</Text>
                            </div>

                            <div>
                                <Text strong>Status: </Text>
                                {currentCampaignPreview.isActive ? (
                                    <Badge status="success" text="Active" />
                                ) : (
                                    <Badge status="error" text="Inactive" />
                                )}
                            </div>

                            <div>
                                <Text strong>Duration: </Text>
                                <Text>
                                    {currentCampaignPreview.startDate ? new Date(currentCampaignPreview.startDate).toLocaleDateString() : 'N/A'} -
                                    {currentCampaignPreview.endDate ? new Date(currentCampaignPreview.endDate).toLocaleDateString() : ' Ongoing'}
                                </Text>
                            </div>

                            <div>
                                <Text strong>Target Users: </Text>
                                <Text>{currentCampaignPreview.targetUsers ? currentCampaignPreview.targetUsers.join(', ') : 'All Users'}</Text>
                            </div>

                            <div>
                                <Text strong>Rules: </Text>
                                <Text>{currentCampaignPreview.rules || 'No specific rules'}</Text>
                            </div>

                            <div>
                                <Text strong>Limits: </Text>
                                <div>
                                    <Text>Max per user: {currentCampaignPreview.maxRedemptionsPerUser || 'Unlimited'}</Text>
                                    <br />
                                    <Text>Total budget: {currentCampaignPreview.totalBudget || 'Unlimited'} points</Text>
                                </div>
                            </div>

                            <Divider />

                            <div>
                                <Text strong>Performance: </Text>
                                <div>
                                    <Text>Redemptions: {(campaignStats[currentCampaignPreview.id] || {}).totalRedemptions || 0}</Text>
                                    <br />
                                    <Text>Points Issued: {(campaignStats[currentCampaignPreview.id] || {}).pointsIssued || 0}</Text>
                                    <br />
                                    <Text>Conversion Rate: {(campaignStats[currentCampaignPreview.id] || {}).conversionRate || 0}%</Text>
                                </div>
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CampaignManagement;