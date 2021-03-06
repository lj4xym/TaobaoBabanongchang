//版本说明：
//  程序版本号=9.21.1.1000
//注意：
//	需提前注册并登录过手机淘宝，并玩过一次芭芭农场；
//	适用于淘宝版本=9.21.1；
//	需提前注册并登录过支付宝，并玩过一次芭芭农场；
//	适用于支付宝版本=10.2.13；
//  支付宝首页需要固定芭芭农场快捷入口；
//  建议提前清理内存，加快程序运行；
//	只限一棵免费领水果的树和一棵年货免费送的树；
//	建议提前打开淘宝，并退出到淘宝首页，再退出应用程序，使得淘宝在后台；
//	建议提前打开支付宝，并退出到支付宝首页，再退出应用程序，使得支付宝在后台；
//	如果不想执行7、8，则必须后台关闭淘宝；
//	不要在12点左右运行，服务器会出bug；
//	淘宝芭芭农场需加入一个队伍；
//	推荐淘宝设置：
//		通用 -视频自动播放：关闭
//			 -截屏后出现分享窗口：关闭
//			 -首页摇一摇：关闭
//功能说明：
//	1、集肥料任务不包括：
//		分享给好友;
//		买实惠好物送1万肥料;
//	2、包括队伍亲密值的肥料礼包领取；
//	3、不包括队伍亲密值的福气礼包领取；
//	4、集福气任务不包括：
//			邀请好友助力； 
//	5、不包括好友林；
//	6、支付宝集肥料任务不包括：
//		分享给好友;
//		购买商品得10000肥料;
//		专属肥料礼包领取;
//		喂小鸡只简单点击饲料图标;
//已知bug：
//	1、逛淘宝任务返回支付宝可能因太卡，按退出键过多而退出芭芭农场；
//	2、逛支付宝任务返回淘宝可能因太卡，返回淘宝后不在芭芭农场；
//	3、任务做完后可能会卡死（应该是机器的原因）；
//	4、淘宝逛支付宝芭芭农场的任务跳转到支付宝后，加载芭芭农场页面后，可能会没有队伍和领肥料图标，等待很久也没用（应该是机器的原因）；


// 变量定义
var SCREEN_WIDTH = device.getScreenWidth();
var SCREEN_HEIGHT = device.getScreenHeight();
var xy_Return_Mianfei;
var xy_Jifeiliao_Mianfei;
var xy_Lingfeiliao_Mianfei;
var xy_Shifei_Mianfei;//施肥按钮
var xy_RightArrow_Mianfei;
var xy_Haoyoulin_Mianfei;
var xy_QuShifei_Mianfei;//去施肥，赚更多肥料
// var xy_Jifuqi_NewSeed;
// var xy_Lingfuqi_NewSeed;
// var xy_Jiaoguanfuqi_NewSeed;
var xy_Return_NewSeed;
var xy_RightArrow_NewSeed = null;
var xy_Jifeiliao_NewSeed;
//防止任务列表刷新后坐标错乱，保存好起始坐标和间距
var FirstPt_Tasks_Mianfei = new Point(null);
var Gap_Tasks_Mianfei;
var ClosePt_Tasks_Mianfei = new Point(null);
var MAXN_Tasks_Mianfei;
var QianDao_Tasks_Mianfei = new Point(null);
//淘宝人生任务中，有没有免费抽一次
var HasFreeChouXinYuanLiHe = true;
//淘宝未知任务数组
var UnknowTasks_Mianfei = [];
//是否开始支付宝异常处理程序
var IsStartZhifubaoExcp = false;


// 程序主逻辑
function mainLogic() {
    // 申请截图权限
    let request = image.requestScreenCapture(10000, 1);
    if (!request) {
        request = image.requestScreenCapture(10000, 1);
    }
    logd("申请截图权限结果... " + request);
    if (!request) {
        logd("申请截图权限失败！");
        exit();
    }

    closeLogWindow();
    closeCtrlWindow();

    //小米最新系统底下会有Home条，在某些页面显示为白条，会影响图色判断！
    if (has(pkg("com.miui.home"))) {
        let node = pkg("com.miui.home").getOneNodeInfo(1000);
        SCREEN_HEIGHT = node.bounds.top;
    }

    //启动淘宝，并进入芭芭农场
    openMyTaobao();
    //进入免费领水果主页面
    sleep(6000);
    gotoMianfeilingshuiguoSinceClickBaba();
    logd("进入免费领水果主页面成功~");
    sleep(2000);
    //初始化主树页面的数据
    getKeyXY_Mianfei();
    //领肥料
    lingFeiliao_Mianfei();
    //开始做集肥料任务
    sleep(1000);
    clickPoint(xy_Jifeiliao_Mianfei.x, xy_Jifeiliao_Mianfei.y);
    sleep(3000);

    //做任务
    let times = 0
    while (true) {
        //做完一个任务，并返回
        times = times + 1;
        let taskList = getTaskList_Mianfei();

        // for (let i = 0; i < taskList.length; i++) {
        //     logd(i, taskList[i]["buttonPoint"].y);
        // }

        if (times === 1) {
            let node = text('关闭').clz('android.widget.Button').getOneNodeInfo(5000);
            ClosePt_Tasks_Mianfei.x = Math.floor(node.bounds.center().x);
            ClosePt_Tasks_Mianfei.y = Math.floor(node.bounds.center().y);
            let realX = getTaskListXbyImage();
            ClosePt_Tasks_Mianfei.y = realX.y;

            let startx = taskList[0]["buttonBounds"].left - 20;
            let starty = ClosePt_Tasks_Mianfei.y + Math.floor((node.bounds.bottom - node.bounds.top) / 2);
            FirstPt_Tasks_Mianfei.x = taskList[0]["buttonPoint"].x;
            let arr = getTaskListFirtPtY_Gap_byImage(startx, starty);
            FirstPt_Tasks_Mianfei.y = arr[0];

            Gap_Tasks_Mianfei = arr[1];//taskList[1]["buttonPoint"].y - taskList[0]["buttonPoint"].y;

            QianDao_Tasks_Mianfei.x = FirstPt_Tasks_Mianfei.x;
            QianDao_Tasks_Mianfei.y = FirstPt_Tasks_Mianfei.y - Gap_Tasks_Mianfei;

            MAXN_Tasks_Mianfei = Math.floor((SCREEN_HEIGHT - FirstPt_Tasks_Mianfei.y) / Gap_Tasks_Mianfei);

            // logd("ClosePt_Tasks_Mianfei:", ClosePt_Tasks_Mianfei);
            // logd("QianDao_Tasks_Mianfei:", QianDao_Tasks_Mianfei);
            // logd("FirstPt_Tasks_Mianfei:", FirstPt_Tasks_Mianfei);
            // logd("Gap_Tasks_Mianfei:", Gap_Tasks_Mianfei);
            // logd("MAXN_Tasks_Mianfei:", MAXN_Tasks_Mianfei);

            //点击去签到
            while (true) {
                if (has(text('去签到').clz('android.widget.Button'))) {
                    clickPoint(QianDao_Tasks_Mianfei.x, QianDao_Tasks_Mianfei.y);
                    sleep(2000);
                } else {
                    break;
                }
            }
            logd("淘宝芭芭农场签到成功~");
            sleep(1000);
        }

        let n = taskList.length;
        let finished = false;
        for (let i = 0; i < n; i++) {
            if (isTodo_Mianfei(taskList[i])) {
                doTask_Mianfei(taskList[i], i);
                finished = false;
                break;
            }
            finished = true;
        }
        //判断是否做完
        if (finished) {
            clickPoint(ClosePt_Tasks_Mianfei.x, ClosePt_Tasks_Mianfei.y);
            sleep(2000);
            logd("主要任务完成~");
            break;
        }
        sleep(2000);
    }
    //可选，好友林
    returnMianfeilingshuiguo();
    logd("进入好友林...");
    clickPoint(xy_Haoyoulin_Mianfei.x, xy_Haoyoulin_Mianfei.y);
    sleep(4000);
    while (true) {
        if (isInHaoyoulin()) {
            break;
        } else if (isInMianfeilingshuiguo()) {
            clickPoint(xy_Haoyoulin_Mianfei.x, xy_Haoyoulin_Mianfei.y);
            sleep(2000);
        }
        sleep(2000);
    }
    doHaoYouLin();
    back();
    sleep(4000);
    returnMianfeilingshuiguo();
    sleep(1000);
    //施肥结束后再次领取亲密度并施肥
    for (let i = 0; i < 2; i++) {
        //可选，领取亲密度奖励
        logd("领取亲密度奖励");
        click(text('我').clz('android.view.View'));
        sleep(2000);
        while (true) {
            if (isInQinmidu()) {
                break;
            } else {
                click(text('我').clz('android.view.View'));
            }
            sleep(1000);
        }
        drawQinmiduBonus();
        //施肥
        logd("开始施肥");
        shifei_Mianfei();
    }
    //可选，退出淘宝
    logd("任务结束，正在退出淘宝...");
    while (true) {
        if (getRunningPkg() === ("com.eg.android.AlipayGphone") || getRunningPkg() === ("com.taobao.taobao")) {
            back();
            sleep(200);
        } else {
            break;
        }
    }
    //正常结束，提醒一下
    device.vibrate(1000);
    logd("淘宝和支付宝芭芭农场任务圆满完成~");
    toast("淘宝和支付宝芭芭农场任务圆满完成~");
    image.releaseScreenCapture();
// ------------主程序结束-----------------------//
}


// 打开我的淘宝
function openMyTaobao() {
    utils.openApp("com.taobao.taobao");
    logd("正在打开淘宝...");
    sleep(10000);
    while (true) {
        if (has(text("订阅").clz("android.widget.TextView")) && has(text("推荐").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("全部").clz("android.view.View"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("消息").clz("android.widget.TextView")) && has(desc("通讯录").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("购物车").clz("android.widget.TextView")) && has(text("结算").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(2000);
            break;
        } else {
            back();
            sleep(2000);
        }
        sleep(1000);
    }
    logd("我的淘宝已成功打开~");
}


// 判断是否在 免费领水果 主页面
function isInMianfeilingshuiguo() {
    let ret1 = has(text('天猫农场-福年种福果').clz('android.webkit.WebView'));
    let ret2 = has(text('做任务赢奖励').clz('android.view.View'));
    // let ret3 = has(textMatch("^couponlist"));
    let ret5 = has(text('我').clz('android.view.View')) || has(text('邀请').clz('android.view.View'));
    return ret1 && (!ret2) && ret5;
}


// 判断是否在 进入免费领水果主页面途中
function isGoingToMianfeilingshuiguo() {
    let ret1 = has(text('天猫农场-福年种福果').clz('android.webkit.WebView'));
    let ret2 = has(id('com.taobao.taobao:id/uik_page_progressbar'));
    if (ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 判断是否在 新种子 主页面
function isInNewSeed() {
    let ret1 = has(text('天猫农场-福年种福果').clz('android.webkit.WebView'));
    let ret2 = has(text('做任务赢奖励').clz('android.view.View'));
    // let ret3 = has(textMatch("^couponlist")); //couponlist不可靠！
    let ret4 = has(clz("android.widget.ProgressBar"));
    let ret5 = has(text('我').clz('android.view.View')) || has(text('邀请').clz('android.view.View'));
    if (ret1 && (!ret2) && (!ret5) && (!ret4)) {
        return true;
    } else {
        return false;
    }
}


// 获取免费领水果页面关键图标的坐标，保存到全局变量
function getKeyXY_Mianfei() {
    let tx_lingfeiliao = 0;
    let arrowHeight = 0;
    let frameNode = depth(0).pkg("com.taobao.taobao");
    let imgs = frameNode.child().clz("android.widget.Image");//child()是获取各级子节点
    let info = imgs.getNodeInfo(5000);
    let j = 0;
    for (let i = 0; i < info.length; i++) {
        if (i === 0) {
            //第一个是返回
            xy_Return_Mianfei = info[i].bounds.center();
            xy_Return_Mianfei.x = Math.floor(xy_Return_Mianfei.x);
            xy_Return_Mianfei.y = Math.floor(xy_Return_Mianfei.y);
        } else {
            let p = info[i].bounds.center();
            p.x = Math.floor(p.x);
            p.y = Math.floor(p.y);
            if (p.y > (SCREEN_HEIGHT / 2)) {
                j = j + 1
                if (j === 1) {
                    //半屏下方第1个是好友林
                    xy_Haoyoulin_Mianfei = p;
                } else if (j === 2) {
                    //半屏下方第2个是集肥料
                    xy_Jifeiliao_Mianfei = p;
                    tx_lingfeiliao = info[i].bounds.left;
                } else if (j === 4) {
                    //半屏下方第4个是→
                    xy_RightArrow_Mianfei = p;
                    arrowHeight = info[i].bounds.bottom - info[i].bounds.top;
                    xy_QuShifei_Mianfei = new Point(null);
                    xy_QuShifei_Mianfei.x = Math.floor(SCREEN_WIDTH / 2);
                    xy_QuShifei_Mianfei.y = info[i].bounds.bottom;
                } else {
                }
            }
        }
    }
    //计算施肥的坐标
    xy_Shifei_Mianfei = new Point(null);
    xy_Shifei_Mianfei.x = Math.floor(SCREEN_WIDTH / 2);
    xy_Shifei_Mianfei.y = xy_Jifeiliao_Mianfei.y;
    //计算领肥料的坐标
    xy_Lingfeiliao_Mianfei = new Point(null);
    xy_Lingfeiliao_Mianfei.x = tx_lingfeiliao;
    xy_Lingfeiliao_Mianfei.y = xy_RightArrow_Mianfei.y - arrowHeight * 2;

    // logd("xy_Return_Mianfei", xy_Return_Mianfei);
    // logd("xy_Haoyoulin_Mianfei", xy_Haoyoulin_Mianfei);
    // logd("xy_Jifeiliao_Mianfei", xy_Jifeiliao_Mianfei);
    // logd("xy_RightArrow_Mianfei", xy_RightArrow_Mianfei);
    // logd("xy_QuShifei_Mianfei", xy_QuShifei_Mianfei);
    // logd("xy_Shifei_Mianfei", xy_Shifei_Mianfei);
    // logd("xy_Lingfeiliao_Mianfei", xy_Lingfeiliao_Mianfei);
}


// 获取新种子页面关键图标的坐标，保存到全局变量
function getKeyXY_NewSeed() {
    let frameNode = depth(0).pkg("com.taobao.taobao");
    let imgs = frameNode.child().clz("android.widget.Image");
    let info = imgs.getNodeInfo(5000);
    let j = 0;
    for (let i = 0; i < info.length; i++) {
        if (i === 0) {
            //第一个是返回
            xy_Return_NewSeed = info[i].bounds.center();
            xy_Return_NewSeed.x = Math.floor(xy_Return_NewSeed.x);
            xy_Return_NewSeed.y = Math.floor(xy_Return_NewSeed.y);
        } else {
            let p = info[i].bounds.center();
            p.x = Math.floor(p.x);
            p.y = Math.floor(p.y);
            if (p.y > (SCREEN_HEIGHT / 2)) {
                j = j + 1
                if (j === 1) {
                    //半屏下方第1个是集肥料
                    xy_Jifeiliao_NewSeed = p;
                } else if (j === 3) {
                    //半屏下方第3个是→
                    xy_RightArrow_NewSeed = p;
                } else {
                }
            }
        }
    }
}


// 领肥料
function lingFeiliao_Mianfei() {
    logd("开始领肥料...");
    while (true) {
        clickPoint(xy_Lingfeiliao_Mianfei.x, xy_Lingfeiliao_Mianfei.y);
        sleep(2000);
        if (has(text('去施肥，赚更多肥料').clz('android.view.View'))) {
            break;
        }
    }
    let method = 1;
    while (true) {
        //节点坐标可能不对！
        //click(text('去施肥，赚更多肥料').clz('android.view.View'));
        switch (method) {
            case 1: {
                clickPoint(xy_QuShifei_Mianfei.x, xy_QuShifei_Mianfei.y);
                sleep(2000);
                method = 2;
                break;
            }
            case 2: {
                clickPoint(xy_QuShifei_Mianfei.x, xy_RightArrow_Mianfei.y);
                sleep(2000);
                method = 3;
                break;
            }
            case 3: {
                clickPoint(xy_QuShifei_Mianfei.x, 2 * xy_QuShifei_Mianfei.y - xy_RightArrow_Mianfei.y);
                sleep(2000);
                method = 4;
                break;
            }
            default: {
                logd("领肥料失败！");
                exit();
            }
        }
        if (!has(text('去施肥，赚更多肥料').clz('android.view.View'))) {
            break;
        }
    }
    logd("领肥料成功~");
}


// 图色获取任务列表关闭按钮的坐标
function getTaskListXbyImage() {
    //找连续3个FFFFFF
    let p = new Point(null);
    let webview = text("天猫农场-福年种福果").clz("android.webkit.WebView").getOneNodeInfo(5000);
    let starty = webview.bounds.top;
    let imageX = image.captureFullScreen();
    let i;
    for (i = starty; i < SCREEN_HEIGHT / 2; i++) {
        let c1 = image.pixel(imageX, ClosePt_Tasks_Mianfei.x, i);
        let c2 = image.pixel(imageX, ClosePt_Tasks_Mianfei.x, i + 1);
        let c3 = image.pixel(imageX, ClosePt_Tasks_Mianfei.x, i + 2);
        if (c1 === -1 && c2 === -1 && c3 === -1) {
            p.x = ClosePt_Tasks_Mianfei.x;
            p.y = i + 2;
            break;
        }
    }
    image.recycle(imageX);
    if (i >= SCREEN_HEIGHT / 2) {
        logd("图色获取任务列表关闭按钮的坐标失败！");
        exit();
    }
    return p;
}


// 图色获取任务列表第一个任务点的坐标
function getTaskListFirtPtY_Gap_byImage(startx, starty) {
    //找连续3个FFFFFF
    let y1 = 0;
    let y2 = 0;
    let imageX = image.captureFullScreen();
    let i;
    for (i = starty; i < SCREEN_HEIGHT * 3 / 4; i++) {
        let c1 = image.pixel(imageX, startx, i);
        let c2 = image.pixel(imageX, startx, i + 1);
        let c3 = image.pixel(imageX, startx, i + 2);
        if (c1 === -1 && c2 === -1 && c3 === -1) {
            y1 = i;
            break;
        }
    }
    if (i >= SCREEN_HEIGHT * 3 / 4) {
        logd("图色获取任务列表第一个任务点的坐标失败！");
        exit();
    }

    for (i = y1 + 2; i < SCREEN_HEIGHT * 3 / 4; i++) {
        let c1 = image.pixel(imageX, startx, i);
        if (c1 !== -1) {
            y2 = i - 1;
            break;
        }
    }
    if (i >= SCREEN_HEIGHT * 3 / 4) {
        logd("图色获取任务列表第一个任务点的坐标失败！");
        exit();
    }

    //找gap
    let y3 = 0;
    let y4 = 0;
    for (i = y2 + 1; i < SCREEN_HEIGHT; i++) {
        let c1 = image.pixel(imageX, startx, i);
        let c2 = image.pixel(imageX, startx, i + 1);
        let c3 = image.pixel(imageX, startx, i + 2);
        if (c1 === -1 && c2 === -1 && c3 === -1) {
            y3 = i;
            break;
        }
    }
    if (i >= SCREEN_HEIGHT) {
        logd("图色获取任务列表gap失败！");
        exit();
    }

    for (i = y3 + 2; i < SCREEN_HEIGHT; i++) {
        let c1 = image.pixel(imageX, startx, i);
        if (c1 !== -1) {
            y4 = i - 1;
            break;
        }
    }
    if (i >= SCREEN_HEIGHT) {
        logd("图色获取任务列表gap失败！");
        exit();
    }

    image.recycle(imageX);
    let ret = [0, 0]; //FirstPt.y, gap
    ret[0] = Math.floor((y1 + y2) / 2)
    ret[1] = Math.floor((y3 + y4) / 2) - Math.floor((y1 + y2) / 2);
    return ret;
}


// 获取集肥料的任务列表
function getTaskList_Mianfei() {
    let tasklist = [];
    try {
        let listview0 = clz('android.widget.ListView').getOneNodeInfo(5000);
        if (listview0) {
            let nodes = listview0.allChildren();//nodeinfo的child指的是直接子节点
            if (nodes) {
                let size = nodes.length;
                for (let i = 0; i < size; i++) {
                    if (i >= 7) {
                        let table = {"title": "", "buttonText": "", "buttonPoint": null, "buttonBounds": null};

                        let view = nodes[i];
                        let childsView = view.allChildren();
                        let titletipView = childsView[0];

                        let title_tip = titletipView.allChildren();
                        let titleView = title_tip[0];
                        table["title"] = titleView.text;

                        let button = childsView[1];
                        table["buttonText"] = button.text;
                        table["buttonBounds"] = button.bounds;
                        let pt = new Point(null);
                        pt = button.bounds.center();
                        pt.x = Math.floor(pt.x);
                        pt.y = Math.floor(pt.y);
                        table["buttonPoint"] = pt;

                        let tmp = {"title": "", "buttonText": "", "buttonPoint": pt, "buttonBounds": null};
                        tmp["title"] = table["title"];
                        tmp["buttonText"] = table["buttonText"];
                        tmp["buttonBounds"] = table["buttonBounds"];
                        // tmp["buttonPoint"] = table["buttonPoint"];
                        tasklist[i - 7] = tmp;
                    }
                }
                return tasklist;
            }
        }
    } catch (e) {
        logd("获取淘宝集肥料的任务列表失败！");
        return null;
    }
}


// 判断是否在 集肥料子页面
function isInJifeiliao() {
    let ret1 = has(text('天猫农场-福年种福果').clz('android.webkit.WebView'));
    let ret2 = has(text('做任务赢奖励').clz('android.view.View'));
    // let ret3 = has(textMatch("^couponlist"));
    // let ret4 = has(textMatch("^逛逛支付宝芭芭农场").clz("android.view.View"));
    let ret5 = has(text('我').clz('android.view.View')) || has(text('邀请').clz('android.view.View'));
    if (ret1 && ret5 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 判断返回的页面，并回到集肥料
function returnJifeiliao_Mianfei() {
    let dead = false;
    let firstInNewSeed = true;
    while (true) {
        if (isInJifeiliao()) {
            break;
        } else if (isInMianfeilingshuiguo()) {
            clickPoint(xy_Jifeiliao_Mianfei.x, xy_Jifeiliao_Mianfei.y);
            sleep(2000);
        } else if (isInNewSeed()) {
            //免费领水果页面未初始化完毕时，会被误判为新种子页面！
            if (firstInNewSeed) {
                firstInNewSeed = false;
            } else {
                if (xy_RightArrow_NewSeed == null) {
                    getKeyXY_NewSeed();
                }
                if (xy_RightArrow_NewSeed != null) {
                    clickPoint(xy_RightArrow_NewSeed.x, xy_RightArrow_NewSeed.y);
                    sleep(6000);
                }
            }
        } else if (has(text("订阅").clz("android.widget.TextView")) && has(text("推荐").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("全部").clz("android.view.View"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("消息").clz("android.widget.TextView")) && has(desc("通讯录").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("购物车").clz("android.widget.TextView")) && has(text("结算").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(4000);
            gotoMianfeilingshuiguoSinceClickBaba();
        } else if (isInBabanongchang()) {
            sleep(2000);
            clickFruitFarm();
        } else if (isGoingToMianfeilingshuiguo()) {
            sleep(4000);
        } else {
            if (dead) {
                logd("returnJifeiliao_Mianfei: 异常back()");
                back();
            } else {
                dead = true;
            }
            sleep(4000);
        }
        sleep(2000);
    }
}


// 判断返回的页面，并回到免费领水果主页
function returnMianfeilingshuiguo() {
    let dead = false;
    let firstInNewSeed = true;
    while (true) {
        if (isInMianfeilingshuiguo()) {
            break;
        } else if (isInJifeiliao()) {
            clickPoint(ClosePt_Tasks_Mianfei.x, ClosePt_Tasks_Mianfei.y);
            sleep(2000);
        } else if (isInNewSeed()) {
            //免费领水果页面未初始化完毕时，会被误判为新种子页面！
            if (firstInNewSeed) {
                firstInNewSeed = false;
            } else {
                if (xy_RightArrow_NewSeed == null) {
                    getKeyXY_NewSeed();
                }
                if (xy_RightArrow_NewSeed != null) {
                    clickPoint(xy_RightArrow_NewSeed.x, xy_RightArrow_NewSeed.y);
                    sleep(6000);
                }
            }
        } else if (has(text("订阅").clz("android.widget.TextView")) && has(text("推荐").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("全部").clz("android.view.View"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("消息").clz("android.widget.TextView")) && has(desc("通讯录").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(text("购物车").clz("android.widget.TextView")) && has(text("结算").clz("android.widget.TextView"))) {
            let selector = desc("我的淘宝").clz("android.widget.FrameLayout");
            click(selector);
            sleep(2000);
        } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(4000);
            gotoMianfeilingshuiguoSinceClickBaba();
            break;
        } else if (isInBabanongchang()) {
            sleep(2000);
            clickFruitFarm();
        } else if (isGoingToMianfeilingshuiguo()) {
            sleep(4000);
        } else {
            if (dead) {
                back();
            } else {
                dead = true;
            }
            sleep(2000);
        }
        sleep(2000);
    }
}


// 是否在淘宝人生主页
function isInTaobaorenshengMain() {
    let ret1 = has(text("淘宝人生").clz("android.webkit.WebView"));
    let ret2 = has(id("loadingDiv"));
    // let ret3 = has(textMatch("^即将为你开启"));
    // let ret4 = has(id("layaContainer"));
    let ret5 = false;
    //只有淘宝人生主页底下才是#ffffff
    let x1 = 1;
    let x2 = Math.floor(SCREEN_WIDTH / 4);
    let x3 = Math.floor(SCREEN_WIDTH / 2);
    let x4 = Math.floor(SCREEN_WIDTH / 4 * 3);
    let x5 = SCREEN_WIDTH - 1;
    let y1 = SCREEN_HEIGHT - 1;
    let imageX = image.captureFullScreen();
    let c1 = image.pixel(imageX, x1, y1);
    let c2 = image.pixel(imageX, x2, y1);
    let c3 = image.pixel(imageX, x3, y1);
    let c4 = image.pixel(imageX, x4, y1);
    let c5 = image.pixel(imageX, x5, y1);
    if (c1 === -1 && c2 === -1 && c3 === -1 && c4 === -1 && c5 === -1) {
        ret5 = true;
    }
    image.recycle(imageX);
    return ret1 && !ret2 && ret5;
}


// 查找免费抽一次心愿礼盒
function findFreeChouXinYuanLiHe() {
    //找#FF9.2.,-10，注意ES的颜色和节点抓取的一致，和按键抓抓相反
    let p = new Point(null);
    p.x = Math.floor(SCREEN_WIDTH / 2);
    let starty = SCREEN_HEIGHT - 1;
    let imageX = image.captureFullScreen();
    let i, y1, y2;
    //先由下往上找第一个#fff.f.
    for (i = starty; i > SCREEN_HEIGHT * 0.8; i = i - 4) {
        let c1 = image.pixel(imageX, Math.floor(SCREEN_WIDTH / 2), i);
        let c1h = image.argb(c1);
        c1h = c1h.toLowerCase();
        if (!c1h.match("#fff.f.")) {
            y1 = i;
            break;
        }
    }
    if (i <= SCREEN_HEIGHT * 0.8) {
        image.recycle(imageX);
        logd("查找免费抽一次心愿礼盒的坐标1失败！");
        return null;
    }
    //再继续找10个#ffffff
    for (i = y1 - 1; i > SCREEN_HEIGHT * 0.8; i--) {
        let j;
        for (j = 0; j < 10; j++) {
            let c1 = image.pixel(imageX, Math.floor(SCREEN_WIDTH / 2), i - j);
            //argb()函数返回object
            if (c1 !== -1) {
                break;
            }
        }
        if (j >= 10) {
            y2 = i;
            break;
        }
    }
    if (i <= SCREEN_HEIGHT * 0.8) {
        image.recycle(imageX);
        logd("查找免费抽一次心愿礼盒的坐标2失败！");
        return null;
    }
    image.recycle(imageX);
    p.y = Math.floor((y1 - y2) / 3 + y2);
    return p;
}


// 在淘宝人生弹窗查找直接退出的坐标
function findExitInTBRS() {
    //找第一次离开FFFFFF,-20
    let p = new Point(null);
    p.x = Math.ceil(SCREEN_WIDTH / 4);
    let y3 = 0;
    let y4 = 0;
    let starty = SCREEN_HEIGHT - 1;
    let imageX = image.captureFullScreen();
    let i;
    for (i = starty; i > SCREEN_HEIGHT / 2; i -= 2) {
        let c1 = image.pixel(imageX, p.x, i);
        let c2 = image.pixel(imageX, p.x, i - 1);
        let c3 = image.pixel(imageX, p.x, i - 2);
        if (c1 === -1 && c2 === -1 && c3 === -1) {
            y3 = i;
            break;
        }
    }
    if (i <= SCREEN_HEIGHT / 2) {
        image.recycle(imageX);
        logd("在淘宝人生弹窗查找直接退出的坐标1失败！");
        return null;
    }

    for (i = y3 - 2; i > SCREEN_HEIGHT / 2; i -= 2) {
        let c1 = image.pixel(imageX, p.x, i);
        if (c1 !== -1) {
            y4 = i - 20;
            break;
        }
    }
    if (i <= SCREEN_HEIGHT / 2) {
        image.recycle(imageX);
        logd("在淘宝人生弹窗查找直接退出的坐标2失败！");
        return null;
    }

    image.recycle(imageX);
    p.y = y4;
    return p;
}


// 完成好友林任务，不返回
function doHaoYouLin() {
    //收别人肥料
    let nodes = text("肥料").clz("android.widget.Button").getNodeInfo(3000);
    if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
            //如果肥料在屏幕下方的其他人的树上，不点击
            if ((nodes[i].bounds.bottom - nodes[i].bounds.top) <= 10) {
                continue;
            }
            nodes[i].clickCenter();
            sleep(1000);
            if (has(text("收TA太多啦 试试其他人"))) {
                sleep(3000);
            } else if (has(text("今天抢肥料达到了最大次数"))) {
                sleep(3000);
                break;
            } else {
                sleep(3000);
            }
        }
    }
    //领1000肥料
    if (has(textMatch("领.+00肥料").clz("android.widget.Button"))) {
        click(textMatch("领.+00肥料").clz("android.widget.Button"));
        sleep(3000);
        click(text("开心收下").clz("android.widget.Button"));
        sleep(1000);
        while (true) {
            if (has(text("开心收下").clz("android.widget.Button"))) {
                click(text("开心收下").clz("android.widget.Button"));
            } else {
                sleep(2000);
                break;
            }
            sleep(1000);
        }
    }
    //立即领取
    if (has(text("立即领取").clz("android.widget.Button"))) {
        click(text("立即领取").clz("android.widget.Button"));
        sleep(3000);
        click(text("开心收下").clz("android.widget.Button"));
        sleep(1000);
        while (true) {
            if (has(text("开心收下").clz("android.widget.Button"))) {
                click(text("开心收下").clz("android.widget.Button"));
            } else {
                sleep(2000);
                break;
            }
            sleep(1000);
        }
    }
    //点我领肥料，完成任务，并回到好友林
    if (has(text("点我领肥料").clz("android.widget.Button"))) {
        click(text("点我领肥料").clz("android.widget.Button"));
        sleep(3000);
        if (has(text("完成任务得肥料").clz("android.view.View"))) {
            let node = text("完成任务得肥料").clz("android.view.View").getOneNodeInfo(3000);
            let sbls = node.siblings();//siblings不包括自身！
            let task = sbls[0].text;
            if (task.substr(0, 9) === "任务：浇灌自己的树") {
                let num = parseInt(task.substr(9, 1));
                click(text("立即去浇灌").clz("android.widget.Button"));
                sleep(6000);
                while (true) {
                    if (isInMianfeilingshuiguo()) {
                        break;
                    }
                    sleep(1000);
                }
                //已处于免费领水果主页面，施肥
                for (let i = 0; i < num; i++) {
                    clickPoint(xy_Shifei_Mianfei.x, xy_Shifei_Mianfei.y);
                    sleep(3000);
                }
                //回到好友林
                back();
                sleep(3000);
                while (true) {
                    if (isInHaoyoulin()) {
                        break;
                    }
                    sleep(1000);
                }
                //立即领取
                if (click(text("立即领取").clz("android.widget.Button"))) {
                    sleep(3000);
                    click(text("开心收下").clz("android.widget.Button"));
                    sleep(1000);
                    while (true) {
                        if (has(text("开心收下").clz("android.widget.Button"))) {
                            click(text("开心收下").clz("android.widget.Button"));
                        } else {
                            sleep(2000);
                            break;
                        }
                        sleep(1000);
                    }
                }
            } else {
                logd("好友林：未知任务！");
                let nodes = node.parent().nextSiblings();
                nodes[0].clickCenter();
                sleep(2000);
            }
        }
    }
}


// 判断是否在 好友林页面
function isInHaoyoulin() {
    let ret1 = has(text('邀请好友').clz('android.widget.Button'));
    let ret2 = has(text('好友管理').clz('android.widget.Button'));
    if (ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 点击芭芭农场后，从农场进入免费领水果
function gotoMianfeilingshuiguoSinceClickBaba() {
    let firstInNewSeed = true;
    while (true) {
        if (isInMianfeilingshuiguo()) {
            break;
        } else if (isGoingToBabanongchang()) {
            // sleep(2000);
        } else if (isInBabanongchang()) {
            sleep(2000);
            clickFruitFarm();
            sleep(2000);
        } else if (isGoingToMianfeilingshuiguo()) {
            sleep(2000);
        } else if (isInNewSeed()) {
            //免费领水果页面未初始化完毕时，会被误判为新种子页面！
            if (firstInNewSeed) {
                firstInNewSeed = false;
            } else {
                if (xy_RightArrow_NewSeed == null) {
                    getKeyXY_NewSeed();
                }
                if (xy_RightArrow_NewSeed != null) {
                    clickPoint(xy_RightArrow_NewSeed.x, xy_RightArrow_NewSeed.y);
                    sleep(5000);
                }
            }
        } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
            let selector = text("芭芭农场").clz("android.widget.TextView");
            click(selector);
            sleep(2000);
        }
        sleep(3000);
    }
}


// 在芭芭农场页面点击水果田
function clickFruitFarm() {
    sleep(2000);
    let p = findFruitFarm();
    if (p != null) {
        if (p.x !== -1) {
            clickPoint(p.x, p.y);
            sleep(200);
            clickPoint(p.x, p.y);
        }
    }
}


// 图色找水果农田坐标
function findFruitFarm() {
    let p = new Point(null);
    p.x = -1;
    p.y = -1;
    let level = text("等级").clz("android.view.View").getOneNodeInfo(3000);
    if (level == null) {
        return null;
    }
    let view = level.parent().parent();
    let sbls = view.allChildren();
    let bk = sbls[1];
    let avat2 = sbls[3];
    let x1 = Math.floor(bk.bounds.center());
    let x2 = bk.bounds.right;
    let x3 = avat2.bounds.left;
    let y1 = view.bounds.bottom;
    let y2 = Math.floor(SCREEN_HEIGHT / 2);
    let imageX = image.captureFullScreen();
    //先找x2~x3范围
    for (let i = x2; i < x3; i++) {
        for (let j = y1; j < y2; j++) {
            let c1 = image.pixel(imageX, i, j);
            let c2 = image.pixel(imageX, i, j + 1);
            let c3 = image.pixel(imageX, i, j + 2);
            let c1h = image.argb(c1);
            c1h = c1h.toLowerCase();
            let c2h = image.argb(c2);
            c2h = c2h.toLowerCase();
            let c3h = image.argb(c3);
            c3h = c3h.toLowerCase();
            //找3个#9b4f29
            if (c1h.match("#9.4f2.") && c2h.match("#9.4f2.") && c3h.match("#9.4f2.")) {
                p.x = i;
                p.y = j;
                break;
            }
        }
        if (p.y !== -1) {
            break;
        }
    }
    //再找x1~x2范围
    if (p.y === -1) {
        for (let i = x1; i < x2; i++) {
            for (let j = y1; j < y2; j++) {
                let c1 = image.pixel(imageX, i, j);
                let c2 = image.pixel(imageX, i, j + 1);
                let c3 = image.pixel(imageX, i, j + 2);
                let c1h = image.argb(c1);
                c1h = c1h.toLowerCase();
                let c2h = image.argb(c2);
                c2h = c2h.toLowerCase();
                let c3h = image.argb(c3);
                c3h = c3h.toLowerCase();
                //找3个#9b4f29
                if (c1h.match("#9.4f2.") && c2h.match("#9.4f2.") && c3h.match("#9.4f2.")) {
                    p.x = i;
                    p.y = j;
                    break;
                }
            }
            if (p.y !== -1) {
                break;
            }
        }
    }
    image.recycle(imageX);
    return p;
}


// 判断是否在 进入芭芭农场途中
function isGoingToBabanongchang() {
    let ret1 = has(text('天猫农场').clz('android.webkit.WebView'));
    let ret2 = has(id('com.taobao.taobao:id/uik_page_progressbar'));
    if (ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 判断是否在 芭芭农场
function isInBabanongchang() {
    let ret1 = has(text('天猫农场').clz('android.webkit.WebView'));
    let ret2 = has(text("兑换").clz("android.view.View"));
    let ret3 = has(text("等级").clz("android.view.View"));
    if (ret1 && ret2 && ret3) {
        return true;
    } else {
        return false;
    }
}


// 退出芭芭农场页面
function exitBabanongchang() {
    let duihuan = text("兑换").clz("android.view.View").getOneNodeInfo(3000);
    duihuan.parent().child(1).clickCenter();
}


// 判断是否在 亲密度
function isInQinmidu() {
    let ret1 = has(text('肥料礼包').clz('android.view.View'));
    let ret2 = has(text("我的小队").clz("android.view.View"));
    if (ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 领取亲密度奖励，并关闭
function drawQinmiduBonus() {
    let nodes = text('肥料礼包').clz('android.view.View').getNodeInfo(3000);
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].clickCenter();
        sleep(2000);
        if (has(text('已领取').clz('android.view.View'))) {
            let node = text('已领取').clz('android.view.View').getOneNodeInfo(3000);
            let views = node.parent().allChildren();
            views[4].clickCenter();
            sleep(1000);
        } else if (has(textMatch('可领$').clz('android.view.View'))) {
            let node = textMatch('可领$').clz('android.view.View').getOneNodeInfo(3000);
            let views = node.parent().allChildren();
            views[4].clickCenter();
            sleep(1000);
        } else if (has(text('开心收下').clz('android.view.View'))) {
            click(text('开心收下').clz('android.view.View'));
            //有动画
            sleep(2500);
        }
    }
    //关闭
    sleep(200);
    let views = nodes[0].parent().parent().parent().parent().parent().parent().allChildren();
    views[2].clickCenter();
    sleep(1000);
}


// 施肥
function shifei_Mianfei() {
    while (true) {
        clickPoint(xy_Shifei_Mianfei.x, xy_Shifei_Mianfei.y);
        sleep(1500);
        if (has(text("加油做任务，果树才能快速种成喔～"))) {
            sleep(2000);
            clickPoint(ClosePt_Tasks_Mianfei.x, ClosePt_Tasks_Mianfei.y);
            sleep(2000);
            break;
        } else if (isInJifeiliao()) {
            clickPoint(ClosePt_Tasks_Mianfei.x, ClosePt_Tasks_Mianfei.y);
            sleep(2000);
            break;
        } else if (has(text('"芭芭农场"从这里进入哦').clz("android.view.View"))) {
            click(text("我知道了").clz("android.widget.Button"));
            sleep(1000);
        } else if (has(text('恭喜获得福卡！'))) {
            //若弹出恭喜获得福卡，则关闭
            let node = text('恭喜获得福卡！').getOneNodeInfo(3000);
            let nodes = node.parent().parent().allChildren();
            nodes[1].clickCenter();
            sleep(2000);
        } else if (isInQinmidu()) {
            //点太快，会误点中亲密度，关闭它
            let nodes = text('肥料礼包').clz('android.view.View').getNodeInfo(3000);
            let views = nodes[0].parent().parent().parent().parent().parent().parent().allChildren();
            views[2].clickCenter();
            sleep(2000);
        }
    }
}