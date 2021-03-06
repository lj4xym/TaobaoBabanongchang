// 全局变量
var guangzhifubao_UI = true;
var zhuli_Mianfei_UI = false;
var friend1_Mianfei_UI = "";
var friend2_Mianfei_UI = "";
var friend3_Mianfei_UI = "";
var guangtaobao_UI = true;
var zhuli_Zhifubao_UI = false;
var friend1_Zhifubao_UI = "";
var friend2_Zhifubao_UI = "";
var friend3_Zhifubao_UI = "";


// 从配置文件读取参数
function initParas() {
    guangzhifubao_UI = readConfigBoolean("guangzhifubao");
    zhuli_Mianfei_UI = readConfigBoolean("zhuli_Mianfei");
    friend1_Mianfei_UI = readConfigString("friend1_Mianfei");
    friend2_Mianfei_UI = readConfigString("friend2_Mianfei");
    friend3_Mianfei_UI = readConfigString("friend3_Mianfei");

    guangtaobao_UI = readConfigBoolean("guangtaobao");
    zhuli_Zhifubao_UI = readConfigBoolean("zhuli_Zhifubao");
    friend1_Zhifubao_UI = readConfigString("friend1_Zhifubao");
    friend2_Zhifubao_UI = readConfigString("friend2_Zhifubao");
    friend3_Zhifubao_UI = readConfigString("friend3_Zhifubao");
}