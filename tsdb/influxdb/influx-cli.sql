docker exec -it influxdb influx write \
--bucket BUCKET_NAME \
--precision s "
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1730851200
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1730851200
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1730854800
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1730854800
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1730858400
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1730858400
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1730862000
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1730862000
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1730865600
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1730865600
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1730869200
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1730869200
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1730872800
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1730872800
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1730876400
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1730876400
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1730880000
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1730880000
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1730883600
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1730883600
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1730887200
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1730887200
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1730890800
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1730890800
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1730894400
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1730894400
"
