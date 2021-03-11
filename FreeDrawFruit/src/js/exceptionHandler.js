// 异常处理子线程
function exceptionHandler() {
    thread.execAsync(function () {
        while (true) {
            //处理第一次打开或更新后打开有功能引导的情况
            if (has(desc("浮层关闭按钮").clz("android.widget.ImageView"))) {
                click(desc("浮层关闭按钮").clz("android.widget.ImageView"));
                sleep(500);
            } else if (has(clz("android.widget.RelativeLayout").id("com.taobao.taobao:id/update_contentDialog"))) {
                //检测更新提示，并点击 取消
                click(text("取消").clz("android.widget.TextView"));
                sleep(500);
            } else if (has(text("天猫农场-福年种福果").clz("android.webkit.WebView"))) {
                //在淘宝免费领水果页面内
                if (has(id("gswl-superpopui").clz("android.view.View"))) {
                    //天猫小黑盒
                    let node = id("gswl-superpopui").clz("android.view.View").getOneNodeInfo(3000);
                    node.child(0).child(1).clickCenter();
                    sleep(200);
                } else if (has(text("继续努力").clz("android.widget.Button"))) {
                    //若有继续努力则点击
                    clickEx(text("继续努力").clz("android.widget.Button"));
                    sleep(300);
                } else if (has(text("有亲密奖励可领取哦").clz("android.view.View"))) {
                    //若弹出有亲密奖励可领取，则关闭
                    let node = text('立即领取').clz('android.widget.Button').getOneNodeInfo(3000);
                    let sbls = node.parent().allChildren();
                    let lingqu = sbls[3];
                    lingqu.clickEx();
                    sleep(300);
                }
            } else if (has(id("com.taobao.taobao:id/poplayer_inner_view").clz("android.widget.FrameLayout")) && has(text("订阅").clz("android.widget.TextView")) && has(text("推荐").clz("android.widget.TextView"))) {
                //首页的恭喜获得签到红包
                let node = id("com.taobao.taobao:id/poplayer_inner_view").clz("android.widget.FrameLayout").getOneNodeInfo(3000);
                let xo = node.child(0).child(0).child(1).child(0);
                xo.clickCenter();
                sleep(500);
            } else if (has(text('啊哦，人太多了').clz('android.view.View'))) {
                click(text('点击刷新').clz('android.view.View'));
                sleep(1000);
            }
            //淘金币
            else if (has(text('签到领金币').clz('android.widget.Button'))) {
                click(text('签到领金币').clz('android.widget.Button'));
                sleep(500);
            } else if (has(text("金币小镇-首页").clz("android.webkit.WebView")) && has(text('我知道了').clz('android.widget.Button'))) {
                click(text('我知道了').clz('android.widget.Button'));
                sleep(500);
            }
            //芭芭农场
            else if (has(text('立即去收').clz('android.widget.Button')) && has(text("等级").clz("android.view.View"))) {
                click(text('立即去收').clz('android.widget.Button'));
                sleep(500);
            } else if (has(text('兑换专享券').clz('android.view.View'))) {
                let node = text('兑换专享券').clz('android.view.View').getOneNodeInfo(3000);
                let sbls = node.nextSiblings();
                sbls[0].clickCenter();
                sleep(300);
            }
            //支付宝
            else if (IsStartZhifubaoExcp) {
                if (has(text('欢迎来到支付宝').clz('android.view.View'))) {
                    //可能弹出欢迎来到支付宝
                    click(text('继续赚肥料').clz('android.view.View'));
                    sleep(1000);
                } else if (has(text('关闭').clz('android.widget.Button'))) {
                    //可能弹出可以组队了
                    click(text('关闭').clz('android.widget.Button'));
                    sleep(1000);
                } else if (has(text("立即更新").clz("android.widget.TextView"))) {
                    click(text("稍后再说").clz("android.widget.TextView"));
                    sleep(500);
                } else if (has(desc("关闭").id("com.alipay.android.phone.discovery.o2ohome:id/image_close"))) {
                    click(desc("关闭").id("com.alipay.android.phone.discovery.o2ohome:id/image_close"));
                    sleep(1000);
                } else if (has(text("支付宝没有响应").pkg("android"))) {
                    click(text("等待").clz("android.widget.Button"));
                }
            } else if (has(text("EC调试版没有响应").pkg("android"))) {
                click(text("等待").clz("android.widget.Button"));
            } else if (has(text("免费领水果没有响应").pkg("android"))) {
                click(text("等待").clz("android.widget.Button"));
            } else if (has(text("允许").clz("android.widget.Button")) && has(text("拒绝").clz("android.widget.Button"))) {
                //允许EC打开其他应用
                click(text("允许").clz("android.widget.Button"));
            } else {
            }
            sleep(250);
        }
    });

}