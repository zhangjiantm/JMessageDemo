## 在项目中集成 JMessage（本项目已集成，无需进行以下操作）

```
npm install jmessage-react-plugin@2.1.2 --save
npm install jcore-react-native --save
react-native link
```

### 安卓配置

#### jmessage-react-plugin

- android/app/src/main/java/com/jmessagedemo/MainApplication.java
```java
// 如果设置为 true，则不弹出 toast。
private boolean shutdownToast = false;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new JMessageReactPackage(shutdownToast)
    );
}
```

- android/app/build.gradle
```gradle
defaultConfig {
    ...
    manifestPlaceholders = [
        JPUSH_APPKEY: "在此替换你的APPKey",	//在此替换你的APPKey
        APP_CHANNEL: "developer-default"		//应用渠道号
    ]
    ...
}
```

- 修改 /node_modules/jmessage-react-plugin/android/src/io/jchat/android/JMessageModule.java
```java
// 注册
@ReactMethod
public void userRegister(ReadableMap map, final Callback success, final Callback fail) {  <----- 修改这里 register -> userRegister
    mContext = getCurrentActivity();
    String username = map.getString(Constant.USERNAME);
    String password = map.getString(Constant.PASSWORD);
    Log.i(TAG, "username: " + username + " password: " + password);
    if (TextUtils.isEmpty(username) || TextUtils.isEmpty(password)) {
        Toast.makeText(mContext, "Username or Password null", Toast.LENGTH_SHORT).show();
    } else {
        JMessageClient.register(username, password, new BasicCallback() {
            @Override
            public void gotResult(int status, String desc) {
                mJMessageUtils.handleCallback(status, desc, success, fail);
            }
        });
    }
}
```

#### jcore-react-native 安卓 link 不成功，需要如下配置

- android/settings.gradle
```gradle
include ':jcore-react-native'
project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
```

- android/app/build.gradle
```gradle
dependencies {
    ...
    compile project(':jmessage-react-plugin')
    compile project(':jcore-react-native')
    ...
}
```

- android/app/src/main/java/com/jmessagedemo/MainApplication.java
```java
...
import cn.jpush.im.android.api.JMessageClient;
...

@Override
public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Log.i("MainApplication", "Init JMessageClient");
    JMessageClient.setDebugMode(true);
    JMessageClient.init(getApplicationContext());
}
```

### ios 配置

- 打开工程，进入 Build Settings -> Framework search paths 添加 framework 搜索路径
```
$(SRCROOT)/../node_modules/jmessage-react-plugin/ios/RCTJMessageModule
```

- 打开工程，进入 Build Settings -> Other Link Flag 添加一行编译选项
```
-framework "JMessage"
```

## 使用

### 下载项目
```
# 下载本项目
git clone https://github.com/auvenscode/JMessageDemo.git
# 进入目录
cd JMessageDemo
# 安装依赖
npm install
```

**注意：jmessage-react-plugin 为最新版 2.1.2，此版本必须在 npm 官方镜像下下载，国内镜像暂时没有同步。**

### 替换自己的 APPKey
- 修改 /android/app/build.gradle
```gradle
defaultConfig {
    ...
    manifestPlaceholders = [
        JPUSH_APPKEY: "在此替换你的APPKey",	//在此替换你的APPKey  <----- 修改此处的 APPkey
        APP_CHANNEL: "developer-default"		//应用渠道号
    ]
    ...
}
```

- 修改 /src/Demo.js
```js
componentDidMount() {
    ...
    JMessage.init({
        appkey: "在此替换你的APPKey", // 在此替换你的APPKey      <------ 修改此处
        isOpenMessageRoaming: false, // 是否开启消息漫游，默认不开启
        isProduction: true, // 是否为生产模式
    })
    ...
}
```

### 运行

```
react-native run-android/run-ios
```