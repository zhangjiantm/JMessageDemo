package com.jmessagedemo;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import cn.jpush.im.android.api.JMessageClient;
import io.jchat.android.JMessageReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    // 如果设置为 true，则不弹出 toast。
    private boolean shutdownToast = false;

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new JMessageReactPackage(shutdownToast)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Log.i("MainApplication", "Init JMessageClient");
    JMessageClient.setDebugMode(true);
    JMessageClient.init(getApplicationContext());
  }
}
