import React, { useState, useRef, useEffect } from "react";
import { Row, Col, ListGroup, Table,  } from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Profile = (props) => {
  const currentUser = AuthService.getCurrentUser();
  const form1 = useRef();
  const form2 = useRef();
  const checkBtn1 = useRef();
  const checkBtn2 = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful1, setSuccessful1] = useState(false);
  const [successful2, setSuccessful2] = useState(false);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);
  const [reason, setReason] = useState("");
  const [refresh, setRefresh] = useState("");
  const [requestList, setRequestList] = useState(['nothing']);

  useEffect(() => {
    UserService.getRequstList().then(
      (response) => {
        console.log(response.data.message)
        setRequestList([...response.data.requests]);
        
      },
    );

  }, [refresh]);

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeDays = (e) => {
    const daysRequested = e.target.value;
    setDaysRequested(daysRequested);
  }

  const onChangeReason = (e) => {
    const reason = e.target.value;
    setReason(reason);
  }

  const handleRequest= (e) => {
    e.preventDefault();

    setMessage2("");
    setSuccessful2(false);

    form2.current.validateAll();

    if (checkBtn2.current.context._errors.length === 0) {
      UserService.requestDays(parseInt(daysRequested, 10), currentUser.days, reason).then(
        (response) => {
          setMessage2(response.data.message);
          setSuccessful2(true);
          setRefresh(response.data.message);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage2(resMessage);
          setSuccessful2(false);
        }
      );
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setMessage1("");
    setSuccessful1(false);

    form1.current.validateAll();

    if (checkBtn1.current.context._errors.length === 0) {
      const data = UserService.update(username, email, password).then(
        (response) => {
          setMessage1(currentUser.message);
          setSuccessful1(true);
          props.callback(currentUser.username);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage1(resMessage);
          setSuccessful1(false);
        }
      );
    }
  };

  return (
    <div className="container">
      <header className="bg-light jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
      <h5 className="bg-light p-3">
        User Details
      </h5>
      <Form onSubmit={handleUpdate} ref={form1}>
        {!successful1 && (
          <div>
            <div className="form-group">
              <Row className="d-flex align-items-center">
                <Col xs={1}>
                  <label htmlFor="username">Username</label>
                </Col>
                <Col xs={4}>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder={currentUser.username}
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required, vusername]}
                  />
                </Col>  
              </Row>
            </div>

            <div className="form-group">
              <Row className="d-flex align-items-center">
                <Col xs={1}>
                  <label htmlFor="email">Email</label>
                </Col>
                <Col xs={4}>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder={currentUser.email}
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, validEmail]}
                  />
                </Col>  
              </Row>               
            </div>

            <div className="form-group">
              <Row className="d-flex align-items-center">
                <Col xs={1}>
                  <label htmlFor="password">Password</label>
                </Col>
                <Col xs={4}>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required, vpassword]}
                  />
                </Col>  
              </Row>                                    
            </div>

            <div className="form-group">
              <button className="btn btn-dark btn-block">Update</button>
            </div>
          </div>
        )}

        {message1 && (
          <div className="form-group">
            <div
              className={
                successful1 ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message1}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn1} />
      </Form>

      <h5 className="bg-light p-3">
        Request off Days
      </h5>

      <Form onSubmit={handleRequest} ref={form2}>
        {!successful2 && (
          <div>
            <Row className="d-flex align-items-center">
                <Col xs={2}>
                <label>off Days Avaliable:</label>
                </Col>
                <Col xs={4}>
                <label className="pl-2">{currentUser.days}</label>
                </Col>  
              </Row>
            <div className="form-group">
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label htmlFor="daysRequested">Number of days</label>
                </Col>
                <Col xs={4}>
                  <Input
                    type="text"
                    className="form-control"
                    name="daysRequested"
                    value={daysRequested}
                    onChange={onChangeDays}
                    validations={[required]}
                  />
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
                    value={reason}
                    onChange={onChangeReason}
                    validations={[required]}
                  />
                </Col>  
              </Row>               
            </div>

            <div className="form-group">
              <button className="btn btn-dark btn-block">Send Request</button>
            </div>
          </div>
        )}

        {message2 && (
          <div className="form-group">
            <div
              className={
                successful2 ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message2}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn2} />
      </Form>
      <h5 className="bg-light p-3">
        off Days Requested
      </h5>
      <ListGroup variant="flush">
        {requestList.map(request => (
          <div>
          <Table striped bordered hover className="mt-3">
          <tbody>
            <tr>
              <td>Days requested</td>
              <td>{request.daysRequested}</td>
            </tr>
            <tr>
              <td>Reason for the request</td>
              <td>{request.reason}</td>
            </tr>
            <tr>
              <td>Request status</td>
              {(request.status === "STATUS_PENDING") && (
                <td className="text-secondary">Pending</td>
              )}
              {(request.status === "STATUS_ACCEPTED") && (
                <td className="text-success">Accepted</td>
              )}
              {(request.status === "STATUS_DENIED") && (
                <td className="text-danger">Denied</td>
              )}
            </tr>
            <tr>
              <td>Manager response</td>
              <td>{request.response}</td>
            </tr>
          </tbody>
        </Table>
          <Row className="justify-content-center mb-3">
            {(request.status === "STATUS_PENDING") && (
              <button onClick={() => {UserService.deleteRequest(request.id); setRefresh(2);}} className="btn btn-danger">Cancle Request</button>
            )}
            {(request.status === "STATUS_ACCEPTED") && (
              <button onClick={() => {UserService.deleteRequest(request.id); setRefresh(2);}} className="btn btn-dark">Remove Request</button>
            )}
            {(request.status === "STATUS_DENIED") && (
              <button onClick={() =>{UserService.deleteRequest(request.id); setRefresh(2);}} className="btn btn-dark">Remove Request</button>
            )}
          </Row>
        </div>
          
        ))}
      </ListGroup>
        
    </div>
  );
};

export default Profile;
