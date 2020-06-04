import React, {Component} from 'react';
import { Card, Avatar, Input, Button} from 'antd';
import 'antd/dist/antd.css';
import pic from '../asset/img/picture.png';

const { Search } = Input;

export default class TextField extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            searchVal: '',
            imgUrl: ''
        }

        this.inputReference = React.createRef();
    }

    fileUploadAction = () => this.inputReference.current.click();

    fileUploadInputChange = (e) => {
        this.setState({fileUploadState:e.target.value});
        console.log(e.target.files[0])

        var reader = new FileReader();
        reader.onload = function(){
            var dataURL = reader.result;

            this.setState({imgUrl: dataURL})
        }.bind(this);
        reader.readAsDataURL(e.target.files[0]);
    }

    render() {
        return(
            <div style={{display: 'flex'}}>
                <div>
                    <input type="file" hidden accept=".jpg, .jpeg, .png" ref={this.inputReference} onChange={this.fileUploadInputChange} />
                    <Button
                        icon={<img className="iconimg" src={pic} />}
                        size="large"
                        onClick={this.fileUploadAction}
                    >
                    </Button>
                </div>
                <Search
                placeholder="Type something..."
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={(value) => {
                    this.props.onSearch({
                        text: value,
                        imgUrl: this.state.imgUrl
                    })
                    this.setState({ searchVal: '', imgUrl: '' })
                }}
                style={{left: 10}}
              />
            </div>
        )
    }
}