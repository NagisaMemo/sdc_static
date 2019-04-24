import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component{

    constructor(props){
        super(props);
        this.render = this.render.bind(this);
    }

    render(){
        return (
            <div className="modal fade" id="Modalbox" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ModalLabel">星之海志愿者公会</h5>
                        </div>
                        <div className="modal-body">
                            无结果显示
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;