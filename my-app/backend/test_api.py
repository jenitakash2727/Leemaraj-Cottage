import urllib.request, json
req = urllib.request.Request('http://127.0.0.1:8001/api/contact/', data=json.dumps({'name':'Test', 'phone':'1234567890', 'message':'Hello', 'email': ''}).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    print(e.read().decode('utf-8'))
