::启动前配置完成JDK环境变量
::启动前配置完成MySQL环境变量
::启动前写入完成数据库
::源代码store\src\main\resources\application.properties内数据库用户名和密码须和本机数据库一致
::源启动前start.bat中store.jar所在磁盘路径和所在路径须和本机一致
::以管理员身份打开
net start mysql
::进入store.jar所在磁盘路径
d:
::进入store.jar所在路径
cd Design
start http://localhost:8080/web/index.html
java -jar store.jar
net stop mysql

