::����ǰ�������JDK��������
::����ǰ�������MySQL��������
::����ǰд��������ݿ�
::Դ����store\src\main\resources\application.properties�����ݿ��û�����������ͱ������ݿ�һ��
::Դ����ǰstart.bat��store.jar���ڴ���·��������·����ͱ���һ��
::�Թ���Ա��ݴ�
net start mysql
::����store.jar���ڴ���·��
d:
::����store.jar����·��
cd Design
start http://localhost:8080/web/index.html
java -jar store.jar
net stop mysql

