import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../context/context';
import axios from 'axios';
import ReadOnlyUserRow from "../components/ReadOnlyUserRow";
import EditableUserRow from '../components/EditableUserRow'

export default function Admin() {
//set states
    const {user} = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState();
    const [editFormData, setEditFormData] = useState({
        email:"",
        role:"",
    });

     //get Users data from mongodb input to array
    const getUsers = () => {
        axios.get("http://localhost:5000/api/users")
        .then((response) => {
            const data = response.data;
            setUsers(data);
        })
        .catch(error => console.error(error));
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('email');
        const fieldValue = event.target.value;

        const newFormData = {...editFormData};
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    }

    const handleEditClick = (event, users)=> {
        event.preventDefault();
        setEditUser(users.email);

        const formValues = { 
            email: users.email,
            role: users.role,
        }
        setEditFormData(formValues);
    };


    return (
            <div>
                {user ? 
                (<div className="py-1 m-3">
                    Logged in: {JSON.stringify(user.user)}
                    {user.role === 'admin' ? 
                    
                    (
                    <div>
                        <form>
                        <table>
                            <thead>
                                <tr>
                                <th>E-mail</th>
                                <th>Role</th>
                                <th>Admin Buttons</th>
                                </tr>
                            </thead>
                            <tbody>
                            {users.map((users) => (
                                <React.Fragment key={users.email}>
                                    {editUser === users.email ? 
                                    (<EditableUserRow editFormData={editFormData} handleEditFormChange ={handleEditFormChange}/>)
                                    : 
                                    (<ReadOnlyUserRow users={users} handleEditClick = {handleEditClick}/>)
                                    }
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                        </form>
                    </div>
                    )
                    :
                    (<div>
                        Not an Admin
                    </div>)
                    
                    }</div>)
                :
                (<div className="py-1 m-3">
                    Logged out.
                </div>)
                }
            </div>
        
    );
    }