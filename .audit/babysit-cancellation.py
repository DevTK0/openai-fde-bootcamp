import concurrent.futures
import json
import socket
import sys
import time
import urllib.request
from urllib.parse import urlparse

base = sys.argv[1].rstrip('/')
address = urlparse(base)
with urllib.request.urlopen(base + '/api/operations?view=records&table=trips') as response:
    assert response.status == 200
sockets = []
for index in range(4):
    connection = socket.create_connection((address.hostname, address.port))
    connection.sendall((f'GET /api/operations?view=records&table=stop_calls&q=absent-cancel-{index} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n').encode())
    sockets.append(connection)
time.sleep(0.2)
for connection in sockets:
    connection.shutdown(socket.SHUT_RDWR)
    connection.close()
time.sleep(0.2)
def replacement(index):
    with urllib.request.urlopen(base + '/api/operations?view=records&table=trips&page=' + str(index)) as response:
        assert response.status == 200
        assert json.load(response)['total'] == 6900
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    list(executor.map(replacement, range(4)))
print('PASS four disconnected searches release capacity for four replacement HTTP requests')
