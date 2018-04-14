#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import os
import time
from concurrent import futures

import grpc
import protol

PROTO_PATH = os.path.join('..', 'protos', 'grpc_minimal.proto')
SERVICE_NAME = 'GRPCMinimal'
SERVER_HOST = 'localhost'
SERVER_PORT = 12345
ONE_DAY_IN_SECONDS = 60 * 60 * 24


def create_server(service_name, host, port, max_workers=5):
    messages, service = protol.load(PROTO_PATH)
    servicer_type = getattr(service, service_name + 'Servicer')
    add_service = getattr(
        service, 'add_' + service_name + 'Servicer_to_server'
    )

    class Server(servicer_type):
        def __init__(self):
            super(Server, self).__init__()
            self._server = grpc.server(futures.ThreadPoolExecutor(max_workers))
            add_service(self, self._server)
            self._server.add_insecure_port('{:}:{:}'.format(host, port))
            self._server.start()

        def stop(self, grace=0):
            self._server.stop(grace)

        def one_to_one(self, request, context):
            return messages.Reply(message='Hello, {:}!'.format(request.name))

        def one_to_many(self, request, context):
            for i in range(request.n):
                yield messages.Reply(
                    message='Hello, {:} #{:}!'.format(request.name, i)
                )

        def many_to_one(self, request_iterator, context):
            names = [request.name for request in request_iterator]
            names = ', '.join(names)
            return messages.Reply(message='Hello, {:}'.format(names))

        def many_to_many(self, request_iterator, context):
            for request in request_iterator:
                if len(request.name) > request.n:
                    yield messages.Reply(
                        message='Hello, {:}'.format(request.name))

    return Server


if __name__ == '__main__':
    server = create_server(
        service_name=SERVICE_NAME,
        host=SERVER_HOST,
        port=SERVER_PORT,
    )()
    print('Listening on port {:}'.format(SERVER_PORT))

    try:
        while True:
            time.sleep(ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop()
