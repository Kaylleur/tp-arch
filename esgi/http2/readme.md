### Http2 test

This is a simple test of http2 using nodejs and express. The server is configured to use http2 and the client is configured to use http2. The server is also configured to use https.
<pre>
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -in server.csr -signkey server.key -out server.crt

</pre>