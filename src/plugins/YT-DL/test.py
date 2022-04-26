#!/usr/bin/env python3
import socket
import json

url = 'https://www.youtube.com/watch?v=Qn1pyDjEj78'
#url = 'https://soundcloud.com/ubiktune/fearofdark-rolling-down-the-street-in-my-katamari'
#url = 'https://the8bitbigband.bandcamp.com/track/metaknights-revenge-feat-buttonmasher-from-kirby-super-star'
#url = 'https://throw.error';
obj = {"src":url,"title":"AAAAAAA"}

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
sock.connect(('localhost',4200))
sock.sendall(json.dumps(obj).encode('utf-8'))
response = sock.recv(8192).decode('utf-8')
print(response)