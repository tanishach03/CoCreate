import React from "react";
import "./index.css";
import CreateRoomForm from "./createRoomForms/index";
import JoinRoomForm from "./joinRoomForms";

const Forms = ({ uuid, socket, setUser }) => {
  return (
    <div className="row h-100 pt-5">
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 d-flex flex-column align-items-center mx-auto">
        <h1 className="text-primary fw-bold">Create Room</h1>
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 d-flex flex-column align-items-center mx-auto">
        <h1 className="text-primary fw-bold">Join Room</h1>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </div>
  );
};

export default Forms;
