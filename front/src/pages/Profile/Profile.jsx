import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import NewNote from '../../components/NewNote/NewNote'
import Topbar from '../../components/Topbar/Topbar'
import { Button, Form, Input } from 'antd';
import { httpClient } from '../../lib/httpClient';

const Profile = () => {
    const [image, setImage] = useState(null);

    const onFinish = (values) => {

        // making web form through js
        const form = new FormData();
        form.append('name', values.name);
        form.append('image', image);

        // api call
        httpClient.put("/update-profile", form, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        }).then( res => {
            console.log(res);

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