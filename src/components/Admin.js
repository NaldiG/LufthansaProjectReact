import React, { useState, useEffect, useRef } from "react";
import { Row, Col, ListGroup, Table,  } from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AdminService from "../services/admin.service";

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

const Admin = () => {
  const form = useRef();
  const checkBtn = useRef();
  const form2 = useRef();
  const checkBtn2 = useRef();

  const [refresh, setRefresh] = useState("");
  const [users, setUsers] = useState(["nothing"]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message2, setMessage2] = useState("");
  const [successful2, setSuccessful2] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AdminService.getUserList().then(
      (response) => {
        setUsers([...response.data.users]);
      },
    );
  }, [refresh]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeUpdateUsername = (e) => {
    setUpdateUsername(e.target.value);
  };

  const onChangeUpdateEmail = (e) => {
    setUpdateEmail(e.target.value);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCreate = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AdminService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setRefresh("4");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Administrator</h3>
      </header>
      <h5 className="bg-light p-3">
        Create new user
      </h5>
      <Form onSubmit={handleCreate} ref={form}>
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
            <button className="btn btn-dark btn-block">Create</button>
          </div>
        </div>
        

        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
      <h5 className="bg-light p-3">
        List of users
      </h5>
      <Form onSubmit={e=>{
        e.preventDefault();
        AdminService.serachUsers(search).then(
          (response) => {
            setUsers([...response.data.users]);
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
      {users.map(user=>(      
        <div>
          <Form ref={form2} onSubmit={(e)=>{
            e.preventDefault();
            setMessage2("");
            setSuccessful2(false);
            form2.current.validateAll();
            if (checkBtn2.current.context._errors.length === 0) {
              AdminService.processRequest(user.id, updateUsername, updateEmail).then(
                (response) => {
                  setMessage2(response.data.message);
                  setSuccessful2(true);
                  setRefresh("3");
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
        
                  setMessage2(resMessage);
                  setSuccessful(false);
                }
              );
            }}}>
            <div>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>User id:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{user.id}</label>
                </Col>  
              </Row>

              <div className="form-group">
                <Row className="d-flex align-items-center">
                  <Col xs={2}>
                    <label htmlFor="username">Username</label>
                  </Col>
                  <Col xs={4}>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={updateUsername}
                      onChange={onChangeUpdateUsername}
                      validations={[required, vusername]}
                      placeholder={user.username}
                    />
                  </Col>  
                </Row>               
              </div>

              <div className="form-group">
                <Row className="d-flex align-items-center">
                  <Col xs={2}>
                    <label htmlFor="email">Email</label>
                  </Col>
                  <Col xs={4}>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      value={updateEmail}
                      onChange={onChangeUpdateEmail}
                      validations={[required, validEmail]}
                      placeholder={user.email}
                    />
                  </Col>  
                </Row>               
              </div>

              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Free days left:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{user.days}</label>
                </Col>  
              </Row>
              <Row className="d-flex align-items-center">
                <Col xs={2}>
                  <label>Roles:</label>
                </Col>
                <Col xs={4}>
                  <label className="pl-2">{user.roles}</label>
                </Col>  
              </Row>

              <div className="form-group">
                <button className="btn btn-dark btn-block">Update User</button>
              </div>
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn2} />
          </Form>

          <Form onSubmit={(e)=>{
            e.preventDefault();
            setMessage2("");
            setSuccessful2(false);
            AdminService.deleteUser(user.id).then(
              (response) => {
                setMessage2(response.data.message);
                setSuccessful2(true);
                setRefresh("3");
              },
              (error) => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
      
                setMessage2(resMessage);
                setSuccessful(false);
              }
            );
            }}>
            <div className="form-group">
              <button className="btn btn-danger btn-block">Delete User</button>
            </div>
          </Form>
        </div>
        
        
      ))}
    </div>
  );
};

export default Admin;
