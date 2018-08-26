import React, { PureComponent } from 'react';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';

class Modal extends PureComponent {
  render() {
    return (
      <Aux>
        <Backdrop clicked={this.props.modelClosed} show={this.props.show} />
        <div
          className="Modal"
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0',
          }}
        >
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default Modal;
