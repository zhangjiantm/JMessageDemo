import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TextInput,
    ScrollView
} from 'react-native';

import { SafeAreaView } from 'react-navigation'

// import { Card, WingBlank, WhiteSpace } from 'antd-mobile';

import Card from 'antd-mobile/lib/card'
import WingBlank from 'antd-mobile/lib/wing-blank'
import WhiteSpace from 'antd-mobile/lib/white-space'
import List from 'antd-mobile/lib/list'
import InputItem from 'antd-mobile/lib/input-item'
import Button from 'antd-mobile/lib/button'
import Toast from 'antd-mobile/lib/toast'
import TextareaItem from 'antd-mobile/lib/textarea-item'
import Checkbox from 'antd-mobile/lib/checkbox'

import JMessage from 'jmessage-react-plugin';

const appkey = "在此替换你的APPKey"; // 在此替换你的APPKey

export default class JMessageDemo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            zhuce: {
                username: '',
                password: ''
            },
            login: {
                username: '',
                password: ''
            },
            getUserInfo: {
                username: ''
            },
            updateMyPassword: {
                oldPwd: '',
                newPwd: ''
            },
            updateMyInfo: {
                nickname: '',
                birthday: 123456789,
                signature: '',
                gender: '',
                region: '',
                address: ''
            },
            sendMessage: {
                username: '',
                message: ''
            },
            sendTextMessage: {
                username: '',
                text: ''
            }
        }
    }

    componentDidMount() {
        JMessage.init({
            appkey: appkey,
            isOpenMessageRoaming: false, // 是否开启消息漫游，默认不开启
            isProduction: true, // 是否为生产模式
        })

        JMessage.setDebugMode({ enable: true })

        // this.JIM = new JMessage()

        console.log('初始化');

        this.getMyInfo();

        this.addReceiveMessageListener();

        this.addClickMessageNotificationListener();
    }

    // 监听收到新消息
    addReceiveMessageListener() {
        var listener = (message) => {
            // 收到的消息会返回一个消息对象. 对象字段可以参考对象说明
            console.log(message);
            Toast.info('收到一条消息', 1);
        }

        JMessage.addReceiveMessageListener(listener) // 添加监听
    }

    // 点击消息通知回调
    addClickMessageNotificationListener() {
        var listener = (message) => { 
            console.log(message);
            Toast.info('点击了通知栏消息', 2);
        }

        JMessage.addClickMessageNotificationListener(listener) // 添加监听
    }

    zhuce() {
        let { username, password } = this.state.zhuce

        console.log(this.state.zhuce);

        // 注册
        JMessage.register({
            username,
            password
        }, () => {
            /*注册成功回调*/
            console.log('注册成功');
            Toast.success('注册成功', 1);
        }, (error) => {
            /*注册失败回调*/
            console.log('注册失败', error)
            Toast.fail('注册失败', 1);
        })
    }

    login() {
        let { username, password } = this.state.login;

        // 登录
        JMessage.login({
            username,
            password
        }, () => {
            /*登录成功回调*/
            console.log('登录成功');
            Toast.success('登录成功', 1);
            this.setState({ isLogin: true })
            this.getMyInfo();
        }, (error) => {
            /*登录失败回调*/
            Toast.fail('登录失败', 1);
            console.log('登录失败', error);
        })
    }

    getMyInfo() {
        JMessage.getMyInfo((UserInf) => {
            if (UserInf && UserInf.username) {
                // 已登录
                console.log('已登录', UserInf);
                this.setState({ MyInfo: UserInf, isLogin: true })
            } else {
                // 未登录
                console.log('未登录');
                this.setState({ MyInfo: null, isLogin: false })
            }
        })
    }

    getUserInfo() {
        let { username } = this.state.getUserInfo
        JMessage.getUserInfo({ username, appKey: appkey },
            (userInfo) => {
                console.log(userInfo);
                this.setState({ UserInfo: userInfo })
            }, (error) => {
                var code = error.code
                var desc = error.description
                console.log(error);
            })
    }

    logout() {
        JMessage.logout()
        this.setState({ MyInfo: null, isLogin: false })
        Toast.success('退出成功', 1);
    }

    // 更新当前用户登录密码
    updateMyPassword() {
        let { oldPwd, newPwd } = this.state.updateMyPassword;
        if (oldPwd && newPwd) {
            JMessage.updateMyPassword({ oldPwd, newPwd },
                () => {
                    // do something.
                    Toast.success('更新密码成功', 1);
                }, (error) => {
                    Toast.fail('修改密码失败', 1);
                    console.log('修改密码失败', error)
                })
        } else {
            Toast.fail('请填写表单', 1);
        }

    }

    // 更新用户资料
    updateMyInfo() {
        let { updateMyInfo } = this.state;
        JMessage.updateMyInfo(updateMyInfo,
            () => {
                // do something.
                Toast.success('更新成功', 1);
            }, (error) => {
                console.log(error);
                Toast.fail('更新失败', 1)
            })
    }

    // 发送消息
    sendMessage() {
        let { sendMessage } = this.state;
        JMessage.createSendMessage({
            type: 'single',
            username: sendMessage.username,
            appKey: appkey,
            messageType: 'text',
            text: sendMessage.message
        }, (message) => {
            JMessage.sendMessage({
                id: message.id,
                type: 'single',
                username: sendMessage.username,
                appKey: appkey,
                groupId: '',
                messageSendingOptions: JMessage.messageSendingOptions
            }, () => {
                // 成功回调
                Toast.success('发送消息成功', 1)
            }, (error) => {
                // 失败回调
                console.log(sendMessage, message.id, error);
                Toast.fail('发送消息失败', 1)
            })
        })
    }

    // 发送文本消息
    sendTextMessage() {
        let { sendTextMessage } = this.state;
        JMessage.sendTextMessage({
            type: 'single', username: sendTextMessage.username, appKey: appkey,
            text: sendTextMessage.text, extras: { key1: 'value1' }, messageSendingOptions: JMessage.messageSendingOptions
        },
            (msg) => {
                // do something.
                console.log(msg);
                Toast.success('发送文本消息成功', 1)
            }, (error) => {
                console.log(error);
                Toast.fail('发送文本消息失败', 1)
            })
    }

    render() {
        let { username, password } = this.state.zhuce
        let { login, MyInfo, getUserInfo, UserInfo, isLogin, updateMyPassword, updateMyInfo, sendMessage, sendTextMessage } = this.state;
        return (
            <ScrollView>
                <SafeAreaView>
                    <List renderHeader={() => '注册'}>
                        <InputItem
                            value={username}
                            onChange={(text) => { let { zhuce } = this.state; zhuce.username = text; this.setState({ zhuce }) }}
                            clear
                            placeholder="用户名"
                        >
                            用户名
                        </InputItem>
                        <InputItem
                            value={password}
                            onChange={(text) => { let { zhuce } = this.state; zhuce.password = text; this.setState({ zhuce }) }}
                            clear
                            placeholder="密码"
                        >
                            密码
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.zhuce()}
                                type="primary"
                            >
                                注册
                            </Button>
                        </List.Item>
                    </List>
                    {isLogin ? <List renderHeader={() => '退出登录'}>
                        <List.Item>
                            <Button
                                onClick={() => this.logout()}
                                type="primary"
                            >
                                退出登录
                            </Button>
                        </List.Item>
                    </List> : <List renderHeader={() => '登录'}>
                            <InputItem
                                value={login.username}
                                onChange={(text) => { let { login } = this.state; login.username = text; this.setState({ login }) }}
                                clear
                                placeholder="用户名"
                            >
                                用户名
                        </InputItem>
                            <InputItem
                                value={login.password}
                                onChange={(text) => { let { login } = this.state; login.password = text; this.setState({ login }) }}
                                clear
                                placeholder="密码"
                            >
                                密码
                        </InputItem>
                            <List.Item>
                                <Button
                                    onClick={() => this.login()}
                                    type="primary"
                                >
                                    登录
                            </Button>
                            </List.Item>
                        </List>}
                    <List renderHeader={() => '获取登录用户的信息'}>
                        <List.Item>
                            <Button
                                onClick={() => this.getMyInfo()}
                                type="primary"
                            >
                                获取登录用户的信息
                            </Button>
                        </List.Item>
                        {MyInfo && Object.keys(MyInfo).map((key) => <List.Item extra={MyInfo[key].toString()} key={key} arrow="empty">{key}</List.Item>)}
                    </List>
                    <WhiteSpace size="lg" />
                    <List renderHeader={() => '获取指定用户的信息'}>
                        <InputItem
                            value={getUserInfo.username}
                            onChange={(text) => { let { getUserInfo } = this.state; getUserInfo.username = text; this.setState({ getUserInfo }) }}
                            clear
                            placeholder="用户名"
                        >
                            用户名
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.getUserInfo()}
                                type="primary"
                            >
                                获取指定用户的信息
                            </Button>
                        </List.Item>
                        {UserInfo && Object.keys(UserInfo).map((key) => <List.Item extra={UserInfo[key].toString()} key={key} arrow="empty">{key}</List.Item>)}
                    </List>
                    <List renderHeader={() => '修改密码'}>
                        <InputItem
                            value={updateMyPassword.oldPwd}
                            onChange={(text) => { let { updateMyPassword } = this.state; updateMyPassword.oldPwd = text; this.setState({ updateMyPassword }) }}
                            clear
                            placeholder="原始密码"
                        >
                            原始密码
                        </InputItem>
                        <InputItem
                            value={updateMyPassword.newPwd}
                            onChange={(text) => { let { updateMyPassword } = this.state; updateMyPassword.newPwd = text; this.setState({ updateMyPassword }) }}
                            clear
                            placeholder="新密码"
                        >
                            新密码
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.updateMyPassword()}
                                type="primary"
                            >
                                修改密码
                            </Button>
                        </List.Item>
                    </List>
                    <List renderHeader={() => '修改用户资料'}>
                        <InputItem
                            value={updateMyInfo.nickname}
                            onChange={(text) => { let { updateMyInfo } = this.state; updateMyInfo.nickname = text; this.setState({ updateMyInfo }) }}
                            clear
                            placeholder="昵称"
                        >
                            昵称
                        </InputItem>
                        <InputItem
                            value={updateMyInfo.birthday}
                            onChange={(text) => { let { updateMyInfo } = this.state; updateMyInfo.birthday = parseInt(text); this.setState({ updateMyInfo }) }}
                            clear
                            placeholder="生日"
                        >
                            生日
                        </InputItem>
                        <List.Item
                            extra={<View>
                                <View style={{ flexDirection: 'row' }}>
                                    <WingBlank size="lg"><Checkbox
                                        onChange={() => { let { updateMyInfo } = this.state; updateMyInfo.gender = 'male'; this.setState({ updateMyInfo }) }}
                                        checked={updateMyInfo.gender === 'male'}
                                    >男</Checkbox></WingBlank>
                                    <Checkbox
                                        onChange={() => { let { updateMyInfo } = this.state; updateMyInfo.gender = 'female'; this.setState({ updateMyInfo }) }}
                                        checked={updateMyInfo.gender === 'female'}
                                    >女</Checkbox>
                                </View>
                            </View>}
                        >
                            性别
                        </List.Item>
                        <TextareaItem
                            value={updateMyInfo.signature}
                            onChange={(text) => { let { updateMyInfo } = this.state; updateMyInfo.signature = text; this.setState({ updateMyInfo }) }}
                            placeholder="个性签名"
                            autoHeight
                        />
                        <InputItem
                            value={updateMyInfo.region}
                            onChange={(text) => { let { updateMyInfo } = this.state; updateMyInfo.region = text; this.setState({ updateMyInfo }) }}
                            clear
                            placeholder="地区"
                        >
                            地区
                        </InputItem>
                        <InputItem
                            value={updateMyInfo.address}
                            onChange={(text) => { let { updateMyInfo } = this.state; updateMyInfo.address = text; this.setState({ updateMyInfo }) }}
                            clear
                            placeholder="具体地址"
                        >
                            具体地址
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.updateMyInfo()}
                                type="primary"
                            >
                                修改用户资料
                            </Button>
                        </List.Item>
                    </List>

                    <List renderHeader={() => '发送一条消息'}>
                        <InputItem
                            value={sendMessage.username}
                            onChange={(text) => { let { sendMessage } = this.state; sendMessage.username = text; this.setState({ sendMessage }) }}
                            clear
                            placeholder="用户名"
                        >
                            用户名
                        </InputItem>
                        <InputItem
                            value={sendMessage.message}
                            onChange={(text) => { let { sendMessage } = this.state; sendMessage.message = text; this.setState({ sendMessage }) }}
                            clear
                            placeholder="消息"
                        >
                            消息
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.sendMessage()}
                                type="primary"
                            >
                                发送一条消息
                            </Button>
                        </List.Item>
                    </List>

                    <List renderHeader={() => '发送文本消息'}>
                        <InputItem
                            value={sendTextMessage.username}
                            onChange={(text) => { let { sendTextMessage } = this.state; sendTextMessage.username = text; this.setState({ sendTextMessage }) }}
                            clear
                            placeholder="用户名"
                        >
                            用户名
                        </InputItem>
                        <InputItem
                            value={sendTextMessage.text}
                            onChange={(text) => { let { sendTextMessage } = this.state; sendTextMessage.text = text; this.setState({ sendTextMessage }) }}
                            clear
                            placeholder="消息"
                        >
                            消息
                        </InputItem>
                        <List.Item>
                            <Button
                                onClick={() => this.sendTextMessage()}
                                type="primary"
                            >
                                发送文本消息
                            </Button>
                        </List.Item>
                    </List>
                </SafeAreaView>
                <SafeAreaView></SafeAreaView>
            </ScrollView>
        )
    }
}