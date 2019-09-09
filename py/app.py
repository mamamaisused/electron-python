#coding=UTF-8
#This Python file uses the following encoding: utf-8

import logging
import logging.handlers
import colorlog
import time
from colorlog import ColoredFormatter
from maLogger import *
from maWebsocket import *

class HelloWorld:
    def __init__(self):
        self._logger = logging.getLogger('helloworld')

    def sayHello(self):
        self._logger.info('Hello, World!')

def startWsServer():
    _logger = logging.getLogger('cherrypy')
    _logger.info('cherrypy start.')
    WebSocketServer.start()

if __name__ == '__main__':
    initLogger()
    startWsServer()
