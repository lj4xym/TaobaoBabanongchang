// 判断一个任务是否需要去做
function isTodo_Mianfei(table) {
    const ttl = table["title"];
    const btt = table["buttonText"];
    const n2 = btt.length;
    if (btt === "去挑选" || btt === "去分享" || btt === "已完成") {
        return false;
    } else if (ttl.substr(0, 6) === "领肥料小提示" && btt.substr(n2 - 1, 1) === "见") {
        return false;
    } else if (ttl === "领肥料小提示(1/1)") {
        return false;
    } else if (ttl.substr(0, 8) === "领400肥料礼包" && btt.substr(n2 - 2, 2) === "可领") {
        return false;
    } else if (UnknowTasks_Mianfei.includes(ttl)) {
        return false;
    } else if (ttl.match("^去淘宝人生拿套装")) {
        return HasFreeChouXinYuanLiHe;
    } else if (ttl.substr(0, 9) === "逛逛支付宝芭芭农场" && !guangzhifubao_UI) {
        return false;
    } else {
        return true;
    }
}


// 做一个任务，并返回集肥料子页面（重载：按照第一次记录的坐标点击）
function doTask_Mianfei(table, index) {
    let buttonX = FirstPt_Tasks_Mianfei.x;
    let buttonY = FirstPt_Tasks_Mianfei.y + Gap_Tasks_Mianfei * index;

    const rollDist = 1 * Gap_Tasks_Mianfei;
    const n = Math.floor(((index - (MAXN_Tasks_Mianfei - 1)) + 0) / 1);
    const startx = FirstPt_Tasks_Mianfei.x;
    const starty = FirstPt_Tasks_Mianfei.y + Gap_Tasks_Mianfei * 3;
    if (index > (MAXN_Tasks_Mianfei - 1)) {
        //第7个开始要滚动
        for (let i = 0; i < n; i++) {
            swipeToPoint(startx, starty, startx, starty - rollDist, 200 * 1);
            sleep(500);
        }
        buttonY = FirstPt_Tasks_Mianfei.y + Gap_Tasks_Mianfei * (MAXN_Tasks_Mianfei - 1);
    }

    //根据具体任务去做
    const ttl = table["title"];
    const btt = table["buttonText"];
    if ((ttl.substr(0, 5) === "逛精选好物" && btt === "去逛逛") || (ttl.substr(0, 5) === "逛精选商品" && btt === "去逛逛")) {
        //时钟，快，15s
        clickPoint(buttonX, buttonY);
        sleep(17000);
        while (true) {
            if (has(text('浏览完成，现在下单立即得1万肥料！'))) {
                while (true) {
                    if (has(text("浏览精选好货").clz("android.view.View"))) {
                        let node = text("浏览精选好货").clz("android.view.View").getOneNodeInfo(3000);
                        let sbls = node.parent().allChildren();
                        sbls[0].child(0).clickCenter();
                        sleep(3000);
                    } else {
                        break;
                    }
                }
                break;
            }
            sleep(1000);
        }
    } else if (((ttl.indexOf("短视频") > -1) && btt === "去浏览")) {
        //进度条，加载最慢，30s
        clickPoint(buttonX, buttonY);
        sleep(35000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                click(id("com.taobao.taobao:id/tbvideo_back").clz("android.widget.ImageView"));
                sleep(4000);
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(id("com.taobao.taobao:id/tbvideo_back").clz("android.widget.ImageView"))) {
                        click(id("com.taobao.taobao:id/tbvideo_back").clz("android.widget.ImageView"));
                    } else {
                        break;
                    }
                    sleep(4000);
                }
                break;
            }
            sleep(2000);
        }
    } else if (((ttl.indexOf("直播") > -1) && btt === "去浏览") || (ttl.match("^观看.+") && btt === "去浏览")) {
        //进度条，加载慢，15s
        clickPoint(buttonX, buttonY);
        sleep(25000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(id("com.taobao.taobao:id/taolive_close_new_layout").clz("android.widget.LinearLayout"))) {
                        let node = id("com.taobao.taobao:id/taolive_close_new_layout").clz("android.widget.LinearLayout").getOneNodeInfo(3000);
                        node.child(2).clickCenter();
                    } else {
                        break;
                    }
                    sleep(4000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(id("com.taobao.taobao:id/taolive_close_new_layout").clz("android.widget.LinearLayout"))) {
                        let node = id("com.taobao.taobao:id/taolive_close_new_layout").clz("android.widget.LinearLayout").getOneNodeInfo(3000);
                        node.child(2).clickCenter();
                    } else {
                        break;
                    }
                    sleep(4000);
                }
                break;
            }
            sleep(2000);
        }
    } else if ((ttl.match("^浏览.+店") && btt === "去浏览") || (ttl.substr(0, 3) === "逛一逛" && btt === "去浏览") || (ttl.substr(0, 7) === "逛网红新潮品牌" && btt === "去浏览") || (ttl.match("^逛.+会场") && btt === "去浏览") || (ttl.match("^浏览会员.+") && btt === "去浏览")) {
        //进度条，加载一般，15s
        clickPoint(buttonX, buttonY);
        sleep(20000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else if (((ttl.substr(0, 8) === "逛领券中心抢神券") && btt === "去浏览")) {
        //进度条，加载一般，15s
        clickPoint(buttonX, buttonY);
        sleep(20000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(desc("返回").clz("android.widget.FrameLayout"))) {
                        click(desc("返回").clz("android.widget.FrameLayout"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(desc("返回").clz("android.widget.FrameLayout"))) {
                        click(desc("返回").clz("android.widget.FrameLayout"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else if ((ttl.substr(0, 9) === "浏览获限时办理礼包" && btt === "去浏览")) {
        //进度条，加载一般，15s
        clickPoint(buttonX, buttonY);
        sleep(20000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(desc("转到上一层级").clz("android.widget.ImageButton"))) {
                        click(desc("转到上一层级").clz("android.widget.ImageButton"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(desc("转到上一层级").clz("android.widget.ImageButton"))) {
                        click(desc("转到上一层级").clz("android.widget.ImageButton"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else if (ttl.substr(0, 7) === "浏览超惠买爆款" && btt === "去浏览") {
        //进度条，加载较快，15s
        clickPoint(buttonX, buttonY);
        sleep(17000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(text("正品低价 好货闭眼买").clz("android.view.View"))) {
                        let node = text("正品低价 好货闭眼买").clz("android.view.View").getOneNodeInfo(3000);
                        let sbls = node.parent().previousSiblings();
                        sbls[0].clickCenter();
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(text("正品低价 好货闭眼买").clz("android.view.View"))) {
                        let node = text("正品低价 好货闭眼买").clz("android.view.View").getOneNodeInfo(3000);
                        let sbls = node.parent().previousSiblings();
                        sbls[0].clickCenter();
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else if ((ttl.substr(0, 8) === "领400肥料礼包" && btt === "去领取") || (ttl.substr(0, 6) === "领肥料小提示" && btt === "知道了")) {
        //领取
        clickPoint(buttonX, buttonY);
        sleep(3000);
    } else if (ttl.substr(0, 9) === "浏览金币小镇得肥料" && btt === "去浏览") {
        //进度条，加载一般，15s
        clickPoint(buttonX, buttonY);
        sleep(20000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else if (ttl.substr(0, 8) === "去淘宝人生拿套装" && btt === "去逛逛") {
        //抽心愿礼盒得300肥料
        clickPoint(buttonX, buttonY);
        sleep(5000);
        while (true) {
            if (isInTaobaorenshengMain()) {
                sleep(2000);
                break;
            }
            sleep(2000);
        }
        let pcxylh = findFreeChouXinYuanLiHe();
        if (pcxylh) {
            clickPoint(pcxylh.x, pcxylh.y);
            sleep(4000);
            back();
            sleep(5000);
        } else {
            //x6抽一次，不做了，退出
            back();
            sleep(5000);
        }
        while (true) {
            if (has(text('淘宝人生').clz('android.webkit.WebView'))) {
                let zjtc = findExitInTBRS();
                if (zjtc) {
                    clickPoint(zjtc.x, zjtc.y);
                    sleep(3000);
                    break;
                }
            }
            sleep(2000);
        }
        HasFreeChouXinYuanLiHe = false;
    } else if (ttl.substr(0, 9) === "逛逛支付宝芭芭农场") {
        clickPoint(buttonX, buttonY);
        sleep(10000);
        IsStartZhifubaoExcp = true;
        sleep(5000);
        doZhifubaoBaBaNongChang();
        logd("支付宝任务全部完成~");
        //返回淘宝
        logd("准备返回淘宝...");
        back();
        sleep(8000);
        while (true) {
            if (getRunningPkg() === "com.eg.android.AlipayGphone") {
                back();
            } else if (getRunningPkg() === "com.taobao.taobao") {
                sleep(2000);
                returnJifeiliao_Mianfei();
                sleep(1000);
                break;
            } else {
                openMyTaobao();
                sleep(6000);
                gotoMianfeilingshuiguoSinceClickBaba();
                sleep(2000);
                logd("支付宝返回淘宝：退了支付宝，重开淘宝，进入免费领水果主页面");
                clickPoint(xy_Jifeiliao_Mianfei.x, xy_Jifeiliao_Mianfei.y);
                sleep(2000);
                break;
            }
            sleep(4000);
        }
    } else if ((ttl.match("^浏览.+") && btt === "去浏览")) {
        //最后判断是不是浏览**
        //进度条，加载一般，15s
        clickPoint(buttonX, buttonY);
        sleep(20000);
        while (true) {
            if (has(text('任务已经全部完成啦').clz('android.view.View'))) {
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            } else if (!has(text("滑动浏览得肥料").clz("android.view.View"))) {
                //卡了，没进度条
                while (true) {
                    if (has(text("返回").clz("android.widget.Button"))) {
                        click(text("返回").clz("android.widget.Button"));
                    } else {
                        break;
                    }
                    sleep(3000);
                }
                break;
            }
            sleep(2000);
        }
    } else {
        logd("淘宝未知任务！", ttl);
        UnknowTasks_Mianfei.push(ttl);
    }

    //判断返回的页面，并回到集肥料
    returnJifeiliao_Mianfei();

    if (index > (MAXN_Tasks_Mianfei - 1)) {
        //第7个开始要滚回去
        for (let i = 0; i < n; i++) {
            swipeToPoint(startx, starty, startx, starty + 2 * rollDist, 200);
            sleep(500);
        }
    }
}