import React, { useState, useEffect, useRef } from "react";
import ModeratorService from "../services/moderator.service";
import { Row, Col, ListGroup, Table,  } from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Moderator = () => {
  const checkBtn = useRef();
  const form = useRef();

  const [refresh, setRefresh] = useState("");
  const [requests, setRequests] = useState(["nothing"]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    ModeratorService.getRequestList().then(
      (response) => {
        setRequests([...response.data.requests]);
      },
    );
  }, [refresh]);

  const onChangeReply = (e) => {
    setReply(e.target.value);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Supervisor</h3>
      </header>
      <h5 className="bg-light p-3">
        User Requests
      </h5>
      <Form onSubmit={e=>{
        e.preventDefault();
        ModeratorService.searchRequests(search).then(
          (response) => {
            setRequests([...response.data.requests]);
          },
        );}}>
          <Row>
            <Col xs={3}>
              <Input
                type="text"
                className="form-control"
                name="search"
                value={search}
                onChange={onChangeSearch}
                placeholder="Serch by username"
              />
              </Col>
              <Col xs={2}>
                <button className="btn btn-dark btn-block">search</button>
              </Col>
          </Row>
      </Form>
      {message && (
        <div className="form-group">
          <div role="alert">
            {message}
          </div>
        </div>
      )}
      {requests.map(request=>(
        <ListGroup variant="flush">
          <Form ref={form} onSubmit={(e)=>{
            e.preventDefault();
            setMessage("");
            form.current.validateAll();
            if (checkBtn.current.context._errors.length === 0) {
              ModeratorService.processRequest(request.userID, request.requestId, request.daysRequested, request.daysRemaining, status, reply).then(
                (response) => {
                  setMessage(response.data.message);
                  setRefresh("1");
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
        
                  setMessage(resMessage);
                }
              );
            }}}>
            <div>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>User id:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.userID}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Username:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.username}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Email:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.email}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Request id:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.requestId}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Free days remaining:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.daysRemaining}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Free days requested:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.daysRequested}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Reason for request:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{request.reason}</label>
                </Col>  
              </Row>

              <div className="form-group">
                <Row className="d-flex align-items-center">
                  <Col xs={2}>
                    <label htmlFor="status">Accept request?</label>
                  </Col>
                  <Col xs={4}>
                    <div onChange={onChangeStatus}>
                      <input type="radio" value="STATUS_ACCEPTED" name="status" /> Accept
                      <input type="radio" value="STATUS_DENIED" name="status" /> Deny
                    </div>
                  </Col>  
                </Row>
              </div>

              <div className="form-group">
                <Row className="d-flex align-items-center">
                  <Col xs={2}>
                    <label htmlFor="reason">Reason</label>
                  </Col>
                  <Col xs={4}>
                    <Input
                      type="text"
                      className="form-control"
                      name="reason"
                      value={reply}
                      onChange={onChangeReply}
                      validations={[required]}
                    />
                  </Col>  
                </Row>               
              </div>

              <div className="form-group">
                <button className="btn btn-dark btn-block">Process</button>
              </div>
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </ListGroup>
      ))}
    </div>
  );
};

export default Moderator;
