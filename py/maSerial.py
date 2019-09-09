#coding=UTF-8
#This Python file uses the following encoding: utf-8

import serial
import serial.tools.list_ports as serialPortList
import logging
import json
import time
from maLogger import *

#获取可用的串口列表，并选择可用的口发送数据
class maPorts:
    def __init__(self):
        #可用的串口列表
        self.portList = list()
        self._logger = logging.getLogger('serial')
        self.port = serial.Serial()
        self.port.baudrate = 9600
        self.port.timeout = 3
    
    def bringUp(self):
        self.portList = list()
        for port in serialPortList.comports():
            port_dict = {
                "name": port.device,
                "hwid": port.hwid
            }
            self.portList.append(port_dict)
            self._logger.info(json.dumps(port_dict))

    def openPort(self,name):
        self.port.port = name
        try:
            if not self.port.is_open:
                self.port.open()
                self._logger.info('open port %s success.'%name)
                return True
            else:
                self._logger.info('port %s is already open.'%name)
                return True
        except BaseException as e:
            self._logger.error(e)
            return False

    

if __name__ == '__main__':
    initLogger()
    ports = maPorts()
    ports.bringUp()
    print(ports.openPort('COM4'))
    ports.port.write('hello')
    while True:
        time.sleep(0.01)
        if(ports.port.in_waiting > 0):
            string = ports.port.read_all()
            print(string[0:2])