import React, { useContext, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import NewNote from '../../components/NewNote/NewNote'
import Topbar from '../../components/Topbar/Topbar'
import { Button, Form, Input } from 'antd';
import { httpClient } from '../../lib/httpClient';
import { updateUser } from '../../utils';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
    const [image, setImage] = useState(null);
    const ctx = useContext(AuthContext);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // making web form through js
        const formDa = new FormData();
        formDa.append('name', values.name);
        formDa.append('image', image);

        // api call
        httpClient.put("/user/update-profile", formDa, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        }).then( res => {
            form.resetFields();

            updateUser(res.data.user);
            ctx.setUser(res.data.user);
        }).catch( (err) => { 
            console.log(err.message);

        }).finally( () => {

        });

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='home'>
            <Sidebar />
            <div className='main'>
                <Topbar />
                <div className='profile'>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            label="Profile Image"
                            name="image"
                        >
                            <input name='image' type='file' onChange={ (e) => setImage(e.target.files[0])} accept='image/*' />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <NewNote />
        </div>
    )
}

export default Profile