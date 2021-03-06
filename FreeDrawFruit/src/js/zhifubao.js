// 变量定义
// 支付宝种树页面特征点
var xy_Lingfeiliao_Zhifubao = new Point(null);
var xy_Dianjilingqu_Zhifubao = new Point(null);
//支付宝防止任务列表刷新后坐标错乱，保存好起始坐标和间距
var FirstPt_Tasks_Zhifubao = new Point(null);
var Gap_Tasks_Zhifubao = 0;
var ClosePt_Tasks_Zhifubao = new Point(null);
var MAXN_Tasks_Zhifubao = 0;
var QianDao_Tasks_Zhifubao = new Point(null);
//支付宝任务中，小鸡肥料是否领取了第一次
var ChickenLingquClicked = false;
//支付宝任务中，去喂鸡是否点过
var QuweijiClicked = false;
//支付宝未知任务数组
var UnknowTasks_Zhifubao = [];


// 支付宝任务
function doZhifubaoBaBaNongChang() {
    //跳转至支付宝芭芭农场，点击继续赚肥料进入任务子页面
    while (true) {
        if (isInJifeiliao_Zhifubao()) {
            logd("doZhifubaoBaBaNongChang：在集肥料1");
            //第一次进入集肥料，初始化
            sleep(500);
            let tasklist = getTaskList_Zhifubao();
            initTaskListXY_Zhifubao(tasklist);
            clickPoint(ClosePt_Tasks_Zhifubao.x, ClosePt_Tasks_Zhifubao.y);
            sleep(2000);
            //第一次进入种树页面，初始化
            if (getKeyXY_Zhifubao()) {
                break;
            }
        } else if (isInZhongshu_Zhifubao()) {
            logd("doZhifubaoBaBaNongChang：在种树1");
            //确保不会因为弹窗误判
            sleep(2000);
            if (isInZhongshu_Zhifubao()) {
                logd("doZhifubaoBaBaNongChang：在种树2");
                //第一次进入种树页面，初始化
                if (getKeyXY_Zhifubao()) {
                    break;
                }
            }
        }
        sleep(2000);
    }
    logd("跳转至支付宝成功~");
    //领取肥料
    lingFeiliao_Zhifubao();
    //进入做任务页面
    clickPoint(xy_Lingfeiliao_Zhifubao.x, xy_Lingfeiliao_Zhifubao.y);
    sleep(3000);
    //如果没有初始化则初始化
    if (Gap_Tasks_Zhifubao === 0) {
        let tasklist = getTaskList_Zhifubao();
        initTaskListXY_Zhifubao(tasklist);
    }
    //如果是马上领或者领取的情况，则先签到
    if (has(text('马上领').clz("android.view.View"))) {
        click(text('马上领').clz("android.view.View"));
        sleep(2000);
    }
    if (has(text('领取').clz("android.view.View"))) {
        let nodes = text('领取').clz("android.view.View").getNodeInfo(5000);
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].bounds.top <= QianDao_Tasks_Zhifubao.y && QianDao_Tasks_Zhifubao.y <= nodes[i].bounds.bottom) {
                clickPoint(QianDao_Tasks_Zhifubao.x, QianDao_Tasks_Zhifubao.y);
                sleep(2000);
                //点击领取，签到后会有弹窗
                for (let j = 0; j < 5; j++) {
                    if (has(text("签到成功！开通领肥料提醒，更快1分钱领水果"))) {
                        sleep(100);
                        click(text("取消").clz("android.widget.Button"));
                        sleep(1000);
                        while (true) {
                            if (!has(text("签到成功！开通领肥料提醒，更快1分钱领水果"))) {
                                break;
                            } else {
                                click(text("取消").clz("android.widget.Button"));
                            }
                            sleep(1000);
                        }
                        break;
                    }
                    sleep(1000);
                }
                break;
            }
        }
    }
    //做任务
    while (true) {
        //做完一个任务，并返回
        let taskList = getTaskList_Zhifubao();
        let n = taskList.length;
        let finished = false;
        for (let i = 0; i < n; i++) {
            if (isTodo_Zhifubao(taskList[i])) {
                logd("doZhifubaoBaBaNongChang：正在做任务...", i);
                doTask_Zhifubao(taskList[i], i);
                finished = false;
                break;
            }
            finished = true;
        }
        //判断是否做完
        if (finished) {
            logd("doZhifubaoBaBaNongChang：finished");
            clickPoint(ClosePt_Tasks_Zhifubao.x, ClosePt_Tasks_Zhifubao.y);
            sleep(2000);
            break;
        }
        //等待刷新
        sleep(2000);
    }
    //停止支付宝异常处理线程
    IsStartZhifubaoExcp = false;
}


// 支付宝::判断是否在 种树主页面
function isInZhongshu_Zhifubao() {
    let ret1, ret2;
    ret1 = has(text('逛逛淘宝芭芭农场').clz('android.view.View'));
    ret2 = has(text('队伍设置').clz('android.view.View'));
    if (!ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 支付宝::判断是否在 做任务集肥料子页面
function isInJifeiliao_Zhifubao() {
    let ret1, ret2;
    ret1 = has(text('逛逛淘宝芭芭农场').clz('android.view.View'));
    ret2 = has(text('队伍设置').clz('android.view.View'));
    if (ret1 && ret2) {
        return true;
    } else {
        return false;
    }
}


// 支付宝::获取种树得水果页面关键图标的坐标，保存到全局变量
// 需要队伍设置！
function getKeyXY_Zhifubao() {
    let lingWidth, lingHeight;
    let duiwu = text('队伍设置').clz('android.view.View').getOneNodeInfo(3000);
    let views = duiwu.parent().parent().parent().allChildren();
    let lingZFB = views[3].child(1);
    if (lingZFB == null) {
        return false;
    }
    let p = lingZFB.bounds.center();
    lingWidth = lingZFB.bounds.right - lingZFB.bounds.left;
    lingHeight = lingZFB.bounds.bottom - lingZFB.bounds.top;
    p.x = Math.floor(p.x);
    p.y = Math.floor(p.y);
    xy_Dianjilingqu_Zhifubao.x = p.x - lingWidth;
    xy_Dianjilingqu_Zhifubao.y = p.y - lingHeight * 2;
    xy_Lingfeiliao_Zhifubao = p;
    return true;
}


// 支付宝::判断页面，并回到集肥料
function returnJifeiliao_Zhifubao() {
    let dead = false;
    while (true) {
        if (isInJifeiliao_Zhifubao()) {
            break;
        } else if (isInZhongshu_Zhifubao()) {
            clickPoint(xy_Lingfeiliao_Zhifubao.x, xy_Lingfeiliao_Zhifubao.y);
            sleep(2000);
        } else if (has(text("首页").id("com.alipay.android.phone.openplatform:id/tab_description"))) {
            if (has(text("扫一扫").id("com.alipay.android.phone.openplatform:id/king_kong_text"))) {
                click(text("芭芭农场").clz("android.widget.TextView"));
                sleep(8000);
            } else {
                click(text("首页").id("com.alipay.android.phone.openplatform:id/tab_description"));
                sleep(2000);
            }
        } else if (has(text("九色鹿").clz("android.view.View"))) {
            //进入支付宝芭芭农场的路上
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


// 支付宝::获取集肥料的任务列表
function getTaskList_Zhifubao() {
    let tasklist = [];
    try {
        //签到UI会变！
        //如果是芭芭农场每日签到
        if (has(text('芭芭农场每日签到').clz('android.view.View'))) {
            let node = text('芭芭农场每日签到').clz('android.view.View').getOneNodeInfo(3000);
            let nodes = node.parent().allChildren();
            let size = nodes.length;
            let table = {"title": "", "buttonText": "", "buttonPoint": null, "buttonBounds": null};
            let n = Math.floor(size / 4) * 4;
            for (let i = 0; i < n; i++) {
                let yushu = i % 4;
                switch (yushu) {
                    case 1: {
                        table["title"] = nodes[i].text;
                        break;
                    }
                    case 3: {
                        let childsView = nodes[i].allChildren();
                        let pt = new Point(null);
                        if (childsView.length === 1) {
                            table["buttonText"] = childsView[0].text;
                            table["buttonBounds"] = childsView[0].bounds;
                            pt = childsView[0].bounds.center();
                            pt.x = Math.floor(pt.x);
                            pt.y = Math.floor(pt.y);
                            table["buttonPoint"] = pt;
                        } else {
                            table["buttonText"] = childsView[1].text;
                            table["buttonBounds"] = childsView[1].bounds;
                            pt = childsView[1].bounds.center();
                            pt.x = Math.floor(pt.x);
                            pt.y = Math.floor(pt.y);
                            table["buttonPoint"] = pt;
                        }
                        let tmp = {"title": "", "buttonText": "", "buttonPoint": null, "buttonBounds": null};
                        tmp["title"] = table["title"];
                        tmp["buttonText"] = table["buttonText"];
                        tmp["buttonBounds"] = table["buttonBounds"];
                        tmp["buttonPoint"] = table["buttonPoint"];
                        tasklist[Math.floor(i / 4)] = tmp;
                        break;
                    }
                }
            }
        } else if (has(textMatch("第[0-9]天").clz('android.view.View')) || has(textMatch(".天").clz('android.view.View'))) {
            //如果是第1天~第5天
            let node = text('逛逛淘宝芭芭农场').clz('android.view.View').getOneNodeInfo(3000);
            let nodes = node.parent().allChildren();
            let size = nodes.length;
            let table = {"title": "", "buttonText": "", "buttonPoint": null, "buttonBounds": null};
            let n = Math.floor((size - 1) / 4) * 4 + 1;
            let imgI = 1;
            for (let i = imgI; i < n; i++) {
                let idx = i - imgI;
                let yushu = idx % 4;
                switch (yushu) {
                    case 1: {
                        table["title"] = nodes[i].text;
                        break;
                    }
                    case 3: {
                        let childsView = nodes[i].allChildren();
                        let pt = new Point(null);
                        if (childsView.length === 1) {
                            table["buttonText"] = childsView[0].text;
                            table["buttonBounds"] = childsView[0].bounds;
                            pt = childsView[0].bounds.center();
                            pt.x = Math.floor(pt.x);
                            pt.y = Math.floor(pt.y);
                            table["buttonPoint"] = pt;
                        } else {
                            table["buttonText"] = childsView[1].text;
                            table["buttonBounds"] = childsView[1].bounds;
                            pt = childsView[1].bounds.center();
                            pt.x = Math.floor(pt.x);
                            pt.y = Math.floor(pt.y);
                            table["buttonPoint"] = pt;
                        }
                        let tmp = {"title": "", "buttonText": "", "buttonPoint": null, "buttonBounds": null};
                        tmp["title"] = table["title"];
                        tmp["buttonText"] = table["buttonText"];
                        tmp["buttonBounds"] = table["buttonBounds"];
                        tmp["buttonPoint"] = table["buttonPoint"];
                        tasklist[Math.floor(idx / 4)] = tmp;
                        break;
                    }
                }
            }
        }
        return tasklist;
    } catch (e) {
        logd("获取支付宝集肥料的任务列表失败！");
        return null;
    }
}


// 支付宝::初始化任务列表的关键点坐标
function initTaskListXY_Zhifubao(taskList) {
    let view = text('逛逛淘宝芭芭农场').clz('android.view.View').getOneNodeInfo(5000);
    let sbls = view.parent().parent().allChildren();
    ClosePt_Tasks_Zhifubao.x = Math.floor(sbls[1].bounds.center().x);
    ClosePt_Tasks_Zhifubao.y = Math.floor(sbls[1].bounds.center().y);

    FirstPt_Tasks_Zhifubao.x = taskList[0]["buttonPoint"].x;
    FirstPt_Tasks_Zhifubao.y = taskList[0]["buttonPoint"].y;

    Gap_Tasks_Zhifubao = taskList[1]["buttonPoint"].y - taskList[0]["buttonPoint"].y;

    QianDao_Tasks_Zhifubao.x = FirstPt_Tasks_Zhifubao.x;
    QianDao_Tasks_Zhifubao.y = FirstPt_Tasks_Zhifubao.y - Gap_Tasks_Zhifubao;

    MAXN_Tasks_Zhifubao = Math.ceil((SCREEN_HEIGHT - FirstPt_Tasks_Zhifubao.y) / Gap_Tasks_Zhifubao);

    // logd("ClosePt_Tasks_Mianfei:", ClosePt_Tasks_Zhifubao);
    // logd("QianDao_Tasks_Mianfei:", QianDao_Tasks_Zhifubao);
    // logd("FirstPt_Tasks_Mianfei:", FirstPt_Tasks_Zhifubao);
    // logd("Gap_Tasks_Mianfei:", Gap_Tasks_Zhifubao);
    // logd("MAXN_Tasks_Mianfei:", MAXN_Tasks_Zhifubao);
}


// 支付宝::领肥料
function lingFeiliao_Zhifubao() {
    while (true) {
        clickPoint(xy_Dianjilingqu_Zhifubao.x, xy_Dianjilingqu_Zhifubao.y);
        sleep(2000);
        logd("lingFeiliao_Zhifubao：点了点击领取");
        if (has(text('去施肥').clz('android.view.View'))) {
            click(text('去施肥').clz('android.view.View'));
            sleep(2000);
            break;
        }
    }
    while (true) {
        logd("lingFeiliao_Zhifubao：判断去施肥");
        if (!has(text('去施肥').clz('android.view.View'))) {
            break;
        } else {
            click(text('去施肥').clz('android.view.View'));
        }
        sleep(2000);
    }
    logd("支付宝领肥料成功~");
}


// 支付宝::判断一个任务是否需要去做
function isTodo_Zhifubao(table) {
    let ttl = table["title"];
    let btt = table["buttonText"];
    if (btt === "去挑选" || btt === "去分享") {
        return false;
    } else if (btt === "生产中" || btt === "已完成") {
        return false;
    } else if (ttl === "专属肥料礼包领取") {
        return false;
    } else if (btt === "去喂鸡") {
        if (QuweijiClicked) {
            return false;
        } else {
            logd("点了去喂鸡");
            QuweijiClicked = true;
            return true;
        }
    } else if (ttl === "蚂蚁庄园小鸡肥料" && btt === "领取") {
        if (ChickenLingquClicked) {
            return false;
        } else {
            ChickenLingquClicked = true;
            return true;
        }
    } else if (UnknowTasks_Zhifubao.includes(ttl)) {
        return false;
    } else if (ttl === "逛逛淘宝芭芭农场" && !guangtaobao_UI) {
        return false;
    } else {
        return true;
    }
}


// 支付宝::做一个任务，并返回集肥料子页面
function doTask_Zhifubao(table, index) {
    let buttonX = FirstPt_Tasks_Zhifubao.x;
    let buttonY = FirstPt_Tasks_Zhifubao.y + Gap_Tasks_Zhifubao * index;

    const rollDist = 1 * Gap_Tasks_Zhifubao;
    const n = Math.floor(((index - (MAXN_Tasks_Zhifubao - 1)) + 0) / 1);
    const startx = FirstPt_Tasks_Zhifubao.x;
    const starty = FirstPt_Tasks_Zhifubao.y + Gap_Tasks_Zhifubao * 3;
    if (index > (MAXN_Tasks_Zhifubao - 1)) {
        //第7个开始要滚动
        for (let i = 0; i < n; i++) {
            swipeToPoint(startx, starty, startx, starty - rollDist, 200 * 1);
            sleep(500);
        }
        buttonY = FirstPt_Tasks_Zhifubao.y + Gap_Tasks_Zhifubao * (MAXN_Tasks_Zhifubao - 1);
    }

    //根据具体任务去做
    const ttl = table["title"];
    const btt = table["buttonText"];
    if (ttl.substr(0, 8) === "芭芭农场每日签到" && btt === "领取") {
        clickPoint(buttonX, buttonY);
        sleep(500);
    } else if (ttl.substr(0, 5) === "逛精选商品" && btt === "去完成") {
        //时钟，快，15s
        clickPoint(buttonX, buttonY);
        sleep(17000);
        while (true) {
            if (has(text('浏览完成，现在下单立即得1万肥料！'))) {
                while (true) {
                    if (has(text("浏览得肥料").clz("android.widget.TextView"))) {
                        let node = text("浏览得肥料").clz("android.widget.TextView").getOneNodeInfo(3000);
                        let sbls = node.parent().parent().parent().parent().parent().previousSiblings();
                        sbls[0].child(0).child(0).clickCenter();
                        sleep(3000);
                    } else {
                        break;
                    }
                }
                break;
            }
            sleep(1000);
        }
    } else if (ttl === "蚂蚁庄园小鸡肥料" && btt === "领取") {
        clickPoint(buttonX, buttonY);
        sleep(1500);
    } else if (ttl === "蚂蚁庄园小鸡肥料" && btt === "去喂鸡") {
        clickPoint(buttonX, buttonY);
        sleep(3000);
        doQuWeiJi();
    } else if (ttl === "去蚂蚁庄园喂小鸡" && btt === "去喂鸡") {
        clickPoint(buttonX, buttonY);
        sleep(5000);
        doQuWeiJi();
    } else if (ttl === "去蚂蚁庄园喂小鸡" && btt === "领取") {
        clickPoint(table["buttonPoint"].x, table["buttonPoint"].y);
        sleep(1000);
    } else if (ttl === "逛逛淘宝芭芭农场" && btt === "去逛逛") {
        IsStartZhifubaoExcp = false;
        clickPoint(buttonX, buttonY);
        sleep(15000);
        while (true) {
            if (has(text('欢迎来到淘宝').clz('android.view.View'))) {
                if (click(text('继续赚肥料').clz('android.view.View'))) {
                    sleep(2000);
                    break;
                }
            } else if (isInMianfeilingshuiguo()) {
                sleep(3000);
                break;
            } else if (isInJifeiliao()) {
                sleep(3000);
                break;
            }
            sleep(4000);
        }
        //返回支付宝做任务子页面
        back();
        sleep(5000);
        let doubleBack = false;
        logd("doTask_Zhifubao：正在返回支付宝...");
        while (true) {
            if (getRunningPkg() === "com.eg.android.AlipayGphone") {
                IsStartZhifubaoExcp = true;
                if (has(text('芭芭农场').id('com.alipay.mobile.nebula:id/h5_tv_title'))) {
                    let dead = true;
                    for (let i = 0; i < 2; i++) {
                        sleep(2000);
                        if (isInJifeiliao_Zhifubao()) {
                            dead = false;
                            break;
                        }
                    }
                    if (dead) {
                        exitOpenMobileTB();
                    } else {
                        break;
                    }
                } else if (isInJifeiliao_Zhifubao()) {
                    logd("返回支付宝：在集肥料");
                    sleep(200);
                    break;
                } else if (isInZhongshu_Zhifubao()) {
                    logd("返回支付宝：在种树");
                    clickPoint(xy_Lingfeiliao_Zhifubao.x, xy_Lingfeiliao_Zhifubao.y);
                } else if (has(text("首页").id("com.alipay.android.phone.openplatform:id/tab_description"))) {
                    if (has(text("扫一扫").id("com.alipay.android.phone.openplatform:id/king_kong_text"))) {
                        click(text("芭芭农场").clz("android.widget.TextView"));
                        sleep(4000);
                    } else {
                        click(text("首页").id("com.alipay.android.phone.openplatform:id/tab_description"));
                    }
                } else if (has(text("九色鹿").clz("android.view.View"))) {
                    //进入支付宝芭芭农场的路上
                }
            } else if (getRunningPkg() === "com.taobao.taobao") {
                logd("返回支付宝：还在淘宝...");
                IsStartZhifubaoExcp = false;
                if (has(text("订阅").clz("android.widget.TextView")) && has(text("推荐").clz("android.widget.TextView"))) {
                    if (!doubleBack) {
                        back();
                        sleep(1000);
                        back();
                        doubleBack = true;
                        sleep(4000);
                    }
                } else if (has(desc("全部").clz("android.view.View"))) {
                    click(desc("首页").clz("android.widget.FrameLayout"));
                    sleep(1000);
                } else if (has(text("消息").clz("android.widget.TextView")) && has(desc("通讯录").clz("android.widget.TextView"))) {
                    click(desc("首页").clz("android.widget.FrameLayout"));
                    sleep(1000);
                } else if (has(text("购物车").clz("android.widget.TextView")) && has(text("结算").clz("android.widget.TextView"))) {
                    click(desc("首页").clz("android.widget.FrameLayout"));
                    sleep(1000);
                } else if (has(desc("设置").clz("android.view.View")) && has(text("芭芭农场").clz("android.widget.TextView"))) {
                    click(desc("首页").clz("android.widget.FrameLayout"));
                    sleep(1000);
                } else if (isInBabanongchang()) {
                    exitBabanongchang();
                } else if (has(id("com.taobao.taobao:id/searchbar_inner")) && has(desc("转到上一层级").clz("android.widget.ImageButton"))) {
                    click(desc("转到上一层级").clz("android.widget.ImageButton"));
                }
            }
            sleep(4000);
        }
    } else {
        logd("支付宝未知任务！", ttl);
        UnknowTasks_Zhifubao.push(ttl);
    }

    //判断返回的页面，并回到集肥料
    returnJifeiliao_Zhifubao();

    if (index > (MAXN_Tasks_Zhifubao - 1)) {
        //第7个开始要滚回去
        for (let i = 0; i < n; i++) {
            swipeToPoint(startx, starty, startx, starty + 2 * rollDist, 200);
            sleep(500);
        }
    }
}


// 关闭打开手机淘宝的过渡页面
function exitOpenMobileTB() {
    click(desc("关闭").clz("android.widget.TextView"));
}


// 支付宝::完成 去喂鸡 任务
function doQuWeiJi() {
    while (true) {
        if (has(text('蚂蚁庄园').clz('android.webkit.WebView'))) {
            if (isGoingToMaYiZhuangYuan()) {
            } else {
                sleep(2000);
                break;
            }
        }
        sleep(2000);
    }
    //在喂鸡加载出来后，喂小鸡
    let node = desc("关闭").clz("android.widget.FrameLayout").getOneNodeInfo(3000);
    let linlay = node.parent().parent();
    let areax1 = linlay.bounds.left;
    let pwj = getWeiXiaoJiXY(areax1);
    if (pwj == null) {
        //可能出现新春专属套装的提示！
        //可能出现主人来抢消费券啦
        pwj = closeZhuanShuTaoZhuang(areax1);
        if (pwj == null) {
            logd("喂小鸡失败！");
            return false;
        }
    }
    clickPoint(pwj.x, pwj.y);
    //等待信息框消失
    sleep(2000);
    //不管喂没喂成功都返回
    click(desc("关闭").clz("android.widget.TextView"));
    sleep(3000);
    return true;
}


// 支付宝::是否在进入蚂蚁庄园的途中
function isGoingToMaYiZhuangYuan() {
    //根据背景为#B7EAFF判断
    let x1 = Math.floor(SCREEN_WIDTH / 4);
    let x2 = Math.floor(SCREEN_WIDTH / 2);
    let x3 = Math.floor(SCREEN_WIDTH / 4 * 3);
    let y1 = Math.floor(SCREEN_HEIGHT / 4);
    let y2 = Math.floor(SCREEN_HEIGHT / 2);
    let y3 = Math.floor(SCREEN_HEIGHT / 4 * 3);
    let imageX = image.captureFullScreen();
    let c1 = image.pixel(imageX, x1, y2);
    let c2 = image.pixel(imageX, x3, y2);
    let c3 = image.pixel(imageX, x2, y1);
    let c4 = image.pixel(imageX, x2, y3);
    if (c1 === -4723969 && c2 === -4723969 && c3 === -4723969 && c4 === -4723969) {
        image.recycle(imageX);
        return true;
    } else {
        image.recycle(imageX);
        return false;
    }
}


// 支付宝::返回支付宝喂小鸡按钮的坐标，约需1s
function getWeiXiaoJiXY(areax1) {
    let areay1 = Math.floor(0.8194 * SCREEN_HEIGHT);
    let ex = SCREEN_WIDTH - 1;
    let ey = SCREEN_HEIGHT - 1;
    let p = new Point(null);
    //从工程目录下res文件夹下读取文件，需要运行工程才能读取res里的文件！
    //透明图是指背景为单一颜色的图片，图片四角的颜色相同时，则该颜色被视为透明色,找图命令忽略这种颜色！
    let picW = 21;
    let picH = 9;
    let picStepX = picW - 1;
    let picStepY = picH - 1;
    let aimage = image.captureFullScreen();
    let found = false;
    for (let j = areay1; j <= ey - picH; j++) {
        let i;
        for (i = areax1; i <= ex - picW; i += 3) {
            let k;
            for (k = 0; k < 2; k++) {
                let c;
                for (let l = 0; l < 2; l++) {
                    c = image.pixel(aimage, i + k * picStepX, j + l * picStepY);
                    if (c !== -1) {
                        break;
                    }
                }
                if (c !== -1) {
                    break;
                }
            }
            if (k >= 2) {
                found = true;
                break;
            }
        }
        if (found) {
            p.x = i + Math.floor(picW / 2);
            p.y = j + Math.floor(picH / 2);
            break;
        }
    }
    image.recycle(aimage);
    if (found) {
        return p;
    } else {
        return null;
    }
}


// 支付宝::关闭新春专属套装的提示，并返回喂小鸡的坐标点
function closeZhuanShuTaoZhuang(areax1) {
    //由下至上点击直至关闭
    let node = desc("关闭").clz("android.widget.TextView").getOneNodeInfo(3000);
    let smallXdiam = Math.floor(node.bounds.bottom - node.bounds.top);
    let step1 = smallXdiam;
    let x = Math.floor(SCREEN_WIDTH / 2)
    for (let i = SCREEN_HEIGHT - smallXdiam; i > SCREEN_HEIGHT / 2; i -= step1) {
        clickPoint(x, i);
        sleep(200);
        let xy = getWeiXiaoJiXY(areax1);
        if (xy != null) {
            return xy;
        }
    }
    return null;
}