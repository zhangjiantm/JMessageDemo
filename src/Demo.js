import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Button,
    TextInput,
    SafeAreaView
} from 'react-native';

import JMessage from 'jmessage-react-plugin';

export default class JMessageDemo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zhuce: {
                username: '',
                password: ''
            }
        }
    }

    componentDidMount() {
        JMessage.init({
            appkey: "在此替换你的APPKey", // 在此替换你的APPKey
            isOpenMessageRoaming: false, // 是否开启消息漫游，默认不开启
            isProduction: true, // 是否为生产模式
        })

        JMessage.setDebugMode({ enable: true })

        // this.JIM = new JMessage()

        console.log('初始化');
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
        }, (error) => {
            /*注册失败回调*/
            console.log('注册失败', error)
        })
    }

    render() {
        let { username, password } = this.state.zhuce
        return (
            <SafeAreaView>
                <Text>使用 JMessage</Text>
                <TextInput
                    placeholder='用户名'
                    value={username}
                    onChangeText={(text) => { let { zhuce } = this.state; zhuce.username = text; this.setState({ zhuce }) }}
                />
                <TextInput
                    placeholder='密码'
                    value={password}
                    onChangeText={(text) => { let { zhuce } = this.state; zhuce.password = text; this.setState({ zhuce }) }}
                />
                <Button
                    title='注册'
                    onPress={() => this.zhuce()}
                />
            </SafeAreaView>
        )
    }
}