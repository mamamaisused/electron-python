import React from 'react';
import './App.css';
import { Button, Radio, InputNumber , Alert, Progress, Select, message } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

const ComReplyParam = {
    SETSUCCESS: 0,
    SETFAIL: -1,
    GETSUCCESS: 2,
    GETFAIL: -2
}

class ButtonSize extends React.Component {
  state = {
    size: 'large',
    info: 'hello: this is an information message',
    progress: 0,
    comList: [],
    listOpen: false,
    alertType: 'info',
    idGet: '000000000000'
  };

  deviceId = 190702000036;

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  handleProgressChange = () => {
    let p = 0;
    let interval_func = setInterval(
      () => {
        if (p < 100) {
          p++;
        }
        else {
          clearInterval(interval_func);
        }
        this.setState({ progress: p });
      }, 100);
  };

  comMessage = {
    sender: "js",
    opCode: "test",
    data: {
      param: 0,
      brief: ""
    }
  };

  closeList = () => {
    this.setState(
      {listOpen:false}
    )
  }

  updateList = () => {
    if(this.state.comList.length>0)
        {
          this.setState(
            {
              listOpen: true,
              alertType: 'success'
            }        
          )
        }
        else{
          this.setState(
            {
              listOpen: false,
              alertType: 'warning'
            }        
          )
        }
  }

  rqstComList = () => {
    this.comMessage.opCode = "com_list";
  }

  rqstTest = () => {
    this.comMessage.opCode = "test";
  }

  rqstSetId = () => {this.comMessage.opCode = "set_id"; this.comMessage.data.param = this.deviceId}

  rqstGetId = () => {this.comMessage.opCode = "get_id"}

  rqstOpenCom = (name) => {
    this.comMessage.opCode = "open_com";
    this.comMessage.data.param = name;
    this.comMessage.data.brief = "open serial port";
  }

  render() {
    const buttonStyle = {
      marginBottom: '10px',
    }
    const outputText = {
      width:'150px',
      height: '40px',
      marginRight: '10px',
      backgroundColor: '#e6f7ff',
      borderRadius: '5px',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold'
    }

    let ws = new WebSocket("ws://192.168.1.23:19002/ws");

    let rqstPython = () => {
      if (ws.readyState === WebSocket.OPEN)
      {
        console.log(this.comMessage);
        ws.send(JSON.stringify(this.comMessage));
      }
    }

    ws.onmessage = (event) => {
      console.log(event.data)
      let message_json = JSON.parse(event.data)
      //测试消息
      if (message_json.opCode === 'test') {
        this.setState(
          {
            progress: message_json.data.param,
            info: message_json.data.brief
          }
        )
      }
      else if (message_json.opCode === 'com_list') {
        let com_list = message_json.data.comList;
        let com_name_list = [];
        let x;
        for(x in com_list)
        {
          com_name_list.push(com_list[x].name);
        }
        this.setState(
          {
            info: message_json.data.brief,
            comList: com_name_list
          }        
        )
        this.updateList()
      }
      else if (message_json.opCode === 'com_reply')
      {
        if(message_json.data.param == ComReplyParam.GETSUCCESS)
        {
          message.success('get device id success',2)
          this.setState(
            {idGet:message_json.data.brief}
          )
        }
        else if(message_json.data.param == ComReplyParam.GETFAIL)
        {
          message.error('get device id failed',2)
        }
        else if(message_json.data.param == ComReplyParam.SETSUCCESS)
        {message.success('set device id success',2)}
        else if(message_json.data.param == ComReplyParam.SETFAIL)
        {message.error('set device id failed',2)}
      }
    };

    const { size, info, progress } = this.state;
    return (
      <div>
        <Alert style={{ margin: '10px' }} message={info} type={this.state.alertType} showIcon />
        <div>
          <Progress style={{ margin: '20px' }} type="circle" percent={progress} />
        </div>
        <div>
          <Radio.Group value={size} onChange={this.handleSizeChange}>
            <Radio.Button value="large">Large</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={buttonStyle}><Button shape="round" type="primary" size={size}
            onClick={() => { this.rqstTest(); rqstPython() }}>
            Test Python</Button></div>
          <div style={buttonStyle}><Button shape="round" type="dashed" onClick={this.handleProgressChange} size={size}>
            Test Progress
          </Button></div>
          <div style={buttonStyle}><Button shape="round" icon="usb" onClick={() => { this.rqstComList(); rqstPython()}} size={size}>
            List COMs
          </Button>
          <Multi comList={this.state.comList} 
          onSelectHandler={(val)=>{this.closeList();this.rqstOpenCom(this.state.comList[val]);rqstPython()}}
          open={this.state.listOpen}
          />
          </div>
          <div style={buttonStyle}>
            <InputNumber style={{width:150,marginRight:10}} min={190101000001} max={990101000001} defaultValue={this.deviceId}
             onChange={(value)=>{this.deviceId=value}} />
            <Button shape="round" type="primary" size={size}
            onClick={() => { this.rqstSetId(); rqstPython() }}>
            Set ID</Button>
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <div style={outputText}>{this.state.idGet}</div>
            <Button shape="round" type="primary" size={size}
            onClick={() => {this.rqstGetId(); rqstPython()}}>
            Get ID</Button>
          </div>
        </div>
      </div>
    );
  }
}

class Multi extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
    <Select defaultValue={this.props.comList[0]} style={{marginLeft:10, width: 100 }} 
    onSelect={this.props.onSelectHandler} open={this.props.open}>
      {
          this.props.comList.map((item, index) => {
            return <Option key={index}>{item}</Option>
          })
      }
    </Select>
    )
  }
}

function App() {
  return (
    <div style={{overflow:'hidden'}} className="App">
      <ButtonSize />
    </div>
  );
}

export default App;
