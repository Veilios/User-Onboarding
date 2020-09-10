import React, { useState } from 'react';
import * as yup from "yup";
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field"),
    email: yup.string().email("Must include a valid email address").required("Must include email address"),
    password: yup.string().required("Password is required"),
    terms: yup.boolean().oneOf([true], "Please agree to terms of use")
});

const Forms = () => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
    });

    const [errorState, setErrorState] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
      })

      const validate = (e) => {
          let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
          yup.reach(formSchema, e.target.name)
          .validate(value)
          .then( valid => {
              setErrorState({
                  ...errorState, [e.target.name]: ""
              });
          })
          .catch( err => {
              console.log(err.errors);
              setErrorState({
                  ...errorState, [e.target.name]: err.errors[0]
              });
          });
      };

      const inputChange = e => {
          e.persist()
          validate(e)
          let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
          setFormState({ ...formState, [e.target.name]: value });
      };

      const [users, setUsers] = useState([]);

      const formSubmit = (e) => {
          e.preventDefault();
          console.log("form submitted");
          axios
            .post("https://reqres.in/api/users", formState)
            .then( res => {
                setUsers(res.data);
                console.log("success", res);
            })
            .catch( err => console.log(err));
      };
 


    return (
        <div>
            <form className="form" onSubmit={formSubmit}>
                <label className="name" htmlFor="name">
                    Name 
                    <input type="text" name="name" id="name" value={formState.name} onChange={inputChange} ></input>
                </label>
                {errorState.name.length > 0 ? <p className="error">{errorState.name}</p> : null }
                <label  className="email" html="email">
                    Email 
                    <input type="text" name="email" id="email" value={formState.email} onChange={inputChange} ></input>
                </label>
                {errorState.email.length > 0 ? <p className="error" >{errorState.email}</p> : null }
                <label className="password" htmlFor="password">
                    Password    
                    <input type="password" name="password" id="password" value={formState.password} onChange={inputChange} ></input>
                </label>
                {errorState.password.length > 0 ? <p className="error">{errorState.password}</p>: null }
                <div className="termsDiv">
                <input className="box" type="checkbox" name="terms" id="terms" checked={formState.terms} onChange={inputChange} />
                    <label className="terms" htmlFor="terms">
                    
                        Terms & Conditions
                        
                    </label>
                    
                </div>
                {errorState.terms.length > 0 ? <p className="error" >{errorState.terms}</p> : null }
                <button className="submit" type="submit">Submit</button>
            </form>
            <div>
                <pre className="users">
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>
        </div>

        
        )
    
}

export default Forms; 