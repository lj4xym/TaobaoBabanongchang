function main() {
    // 参数设置 = main.html
    // 权限&模式 = intr.html
    // 定时任务 = timer.html
    // 使用说明 = other.html
    ui.layout("参数设置", "main.html");
    // ui.layout("权限&模式", "intr.html");
    ui.layout("定时任务", "timer.html");
    ui.layout("使用说明", "other.html");
}

main();