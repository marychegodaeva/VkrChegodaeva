import React from 'react';
import '../css/basic.css';
import '../css/modal.css';

const Modal = ({active, setActive, children}) => {
  return (
    <>
    <div id="modal-favourites" className={active ? "modal active" : "modal "} onClick={() => setActive(false)}>
      <div className={active ? "modal-content active" : "modal-content"} onClick={e => e.stopPropagation()}>
          {children}
      </div>
    </div>
    </>
  );
};

export default Modal;