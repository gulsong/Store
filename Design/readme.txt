启动前须完成：
1.配置JDK环境变量
2.配置MySQL环境变量
3.打开数据库运行material中的store_sql.sql文件
4.打开源代码store\src\main\resources\application.properties修改数据库用户名和密码和本机数据库一致
打包程序将store\target\store.jar覆盖现有store.jar
5.编辑start.bat中store.jar所在磁盘路径和所在路径和本机一致
6.修改快捷方式“启动电子产品销售系统”属性->目标和起始位置和start.bat位置一致