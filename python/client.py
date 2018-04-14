#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import os

import grpc
import protol

PROTO_PATH = os.path.join('..', 'protos', 'grpc_minimal.proto')
SERVICE_NAME = 'GRPCMinimal'
SERVER_HOST = 'localhost'
SERVER_PORT = 12345
NAMES = [
    'Alice',
    'Bob',
    'Carol',
    'David',
    'Eve',
    'Faythe',
    'Grace',
]


class Client:
    def __init__(self, proto_path, service_name, host, port):
        super(Client, self).__init__()
        self._messages, self._service = protol.load(proto_path)
        self._channel = grpc.insecure_channel(str(host) + ':' + str(port))
        self._stub = getattr(self._service, service_name + 'Stub')
        self._stub = self._stub(self._channel)

    def _generate_requetsts(self, names, n=None):
        for name in names:
            yield self._messages.Request(name=name, n=n)

    def one_to_one(self, name):
        request = self._messages.Request(name=name)
        response = self._stub.one_to_one(request)
        return response.message

    def one_to_many(self, name, n):
        request = self._messages.Request(name=name, n=n)
        responses = self._stub.one_to_many(request)
        return [response.message for response in responses]

    def many_to_one(self, names):
        request_iterator = self._generate_requetsts(names)
        response = self._stub.many_to_one(request_iterator)
        return response.message

    def many_to_many(self, names, n):
        request_iterator = self._generate_requetsts(names, n)
        responses = self._stub.many_to_many(request_iterator)
        return [response.message for response in responses]


if __name__ == '__main__':
    client = Client(
        proto_path=PROTO_PATH,
        service_name=SERVICE_NAME,
        host=SERVER_HOST,
        port=SERVER_PORT
    )
    print('one_to_one   : ', client.one_to_one('Alice'))
    print('one_to_many  : ', client.one_to_many('Alice', 3))
    print('many_to_one  : ', client.many_to_one(NAMES))
    print('many_to_many : ', client.many_to_many(NAMES, n=3))
