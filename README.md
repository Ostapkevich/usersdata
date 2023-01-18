по разному работает метода split на сервере herocu и локально на localhost, поэтому в файле routes.js строка 31,32
 'for herocu' будет:
mailArray = arr[0].split('\n');
femailArray = arr[1].split('\n')
 'for localhost' будет:
mailArray = arr[0].split('\r\n');
femailArray = arr[1].split('\r\n')
