import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    companyName: "",
    address: "",
    coSerialNo: "",
    coCertificateNo: "",
    invoiceNo: "",
    country: "",
    sign: "",
    certificates: [{
      authorizedBy: "",
      hsCode: "",
      issueDate: "",
      weight: ""
    }],
    role: "user"
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const API_BASE_URL = "https://auth-app-project-production.up.railway.app";

  // Get token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeader());
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Format the certificates array with proper date format and weight as number
      const formattedUser = {
        ...newUser,
        certificates: newUser.certificates.map(cert => ({
          ...cert,
          issueDate: cert.issueDate 
            ? new Date(cert.issueDate).toISOString() 
            : new Date().toISOString()
        }))
      };
      
      // Log the request data for debugging
      console.log("Creating user with data:", formattedUser);
      
      const response = await axios.post(`${API_BASE_URL}/users`, formattedUser, getAuthHeader());
      console.log("Server response:", response.data);
      
      setNewUser({
        companyName: "",
        address: "",
        coSerialNo: "",
        coCertificateNo: "",
        invoiceNo: "",
        country: "",
        sign: "",
        certificates: [{
          authorizedBy: "",
          hsCode: "",
          issueDate: "",
          weight: ""
        }],
        role: "user"
      });
      setShowAddForm(false);
      setError(null); // Clear any previous errors
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      if (err.response) {
        console.error("Server response data:", err.response.data);
        console.error("Server response status:", err.response.status);
      }
      setError("Failed to create user. " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      setLoading(true);
      // Remove fields that shouldn't be sent to the API
      const { _id, createdAt, updatedAt, __v, ...cleanUserData } = editingUser;

      // Format certificates array
      const formattedUser = {
        ...cleanUserData,
        certificates: cleanUserData.certificates.map(cert => ({
          ...cert,
          issueDate: cert.issueDate
            ? new Date(cert.issueDate).toISOString()
            : undefined,
        }))
      };
      
      // Log the request data for debugging
      console.log("Updating user with data:", formattedUser);
      
      const response = await axios.patch(
        `${API_BASE_URL}/users/${editingUser._id}`, 
        formattedUser, 
        getAuthHeader()
      );
      console.log("Server response:", response.data);
      
      setEditingUser(null);
      setError(null); // Clear any previous errors when update is successful
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      if (err.response) {
        console.error("Server response data:", err.response.data);
        console.error("Server response status:", err.response.status);
      }
      setError("Failed to update user. " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${userId}`, getAuthHeader());
      setError(null); // Clear any previous errors
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user. " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change for new user form
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('certificates[')) {
      // Extract the index and field name from the name attribute
      // Format: certificates[0].fieldName
      const matches = name.match(/certificates\[(\d+)\]\.(.+)/);
      if (matches && matches.length === 3) {
        const index = parseInt(matches[1]);
        const field = matches[2];
        
        setNewUser(prev => {
          const updatedCertificates = [...prev.certificates];
          if (!updatedCertificates[index]) {
            updatedCertificates[index] = {};
          }
          updatedCertificates[index] = {
            ...updatedCertificates[index],
            [field]: value
          };
          return {
            ...prev,
            certificates: updatedCertificates
          };
        });
      }
    } else {
      // Handle normal fields
      setNewUser(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle input change for editing user form
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('certificates[')) {
      // Extract the index and field name from the name attribute
      const matches = name.match(/certificates\[(\d+)\]\.(.+)/);
      if (matches && matches.length === 3) {
        const index = parseInt(matches[1]);
        const field = matches[2];
        
        setEditingUser(prev => {
          const updatedCertificates = [...(prev.certificates || [])];
          if (!updatedCertificates[index]) {
            updatedCertificates[index] = {};
          }
          updatedCertificates[index] = {
            ...updatedCertificates[index],
            [field]: value
          };
          return {
            ...prev,
            certificates: updatedCertificates
          };
        });
      }
    } else {
      // Handle normal fields
      setEditingUser(prev => ({ ...prev, [name]: value }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Add a new certificate to a user
  const addCertificate = (isEditing) => {
    if (isEditing) {
      setEditingUser(prev => ({
        ...prev,
        certificates: [
          ...(prev.certificates || []),
          { authorizedBy: "", hsCode: "", issueDate: "", weight: "" }
        ]
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        certificates: [
          ...prev.certificates,
          { authorizedBy: "", hsCode: "", issueDate: "", weight: "" }
        ]
      }));
    }
  };

  // Remove a certificate from a user
  const removeCertificate = (index, isEditing) => {
    if (isEditing) {
      setEditingUser(prev => {
        const updatedCertificates = [...prev.certificates];
        // Don't remove the last certificate
        if (updatedCertificates.length > 1) {
          updatedCertificates.splice(index, 1);
        }
        return {
          ...prev,
          certificates: updatedCertificates
        };
      });
    } else {
      setNewUser(prev => {
        const updatedCertificates = [...prev.certificates];
        // Don't remove the last certificate
        if (updatedCertificates.length > 1) {
          updatedCertificates.splice(index, 1);
        }
        return {
          ...prev,
          certificates: updatedCertificates
        };
      });
    }
  };

  // Render user form (reused for both add and edit)
  const renderUserForm = (isEditing) => {
    const user = isEditing ? editingUser : newUser;
    const handleChange = isEditing ? handleEditUserChange : handleNewUserChange;
    const handleSubmit = isEditing ? updateUser : createUser;
    
    // Ensure certificates array exists
    const certificates = user.certificates || [];
    
    return (
      <form onSubmit={handleSubmit} className="user-form">
        <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
        
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={user.companyName || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>CO Serial No:</label>
          <input
            type="text"
            name="coSerialNo"
            value={user.coSerialNo || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>CO Certificate No:</label>
          <input
            type="text"
            name="coCertificateNo"
            value={user.coCertificateNo || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Invoice No:</label>
          <input
            type="text"
            name="invoiceNo"
            value={user.invoiceNo || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={user.country || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Sign:</label>
          <input
            type="text"
            name="sign"
            value={user.sign || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <h4>Certificates</h4>
        <button 
          type="button" 
          className="add-certificate-btn"
          onClick={() => addCertificate(isEditing)}
        >
          Add Certificate
        </button>
        
        {certificates.map((cert, index) => (
          <fieldset key={index} className="certificate-fieldset">
            <legend>Certificate {index + 1}</legend>
            
            <div className="form-group">
              <label>Authorized By:</label>
              <input
                type="text"
                name={`certificates[${index}].authorizedBy`}
                value={cert.authorizedBy || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>HS Code:</label>
              <input
                type="text"
                name={`certificates[${index}].hsCode`}
                value={cert.hsCode || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="text"
                name={`certificates[${index}].weight`}
                value={cert.weight || ""}
                onChange={handleChange}
                placeholder="e.g. 16790 KGS(千克)"
              />
            </div>
            
            <div className="form-group">
              <label>Issue Date:</label>
              <input
                type="date"
                name={`certificates[${index}].issueDate`}
                value={cert.issueDate ? formatDate(cert.issueDate) : ""}
                onChange={handleChange}
                required
              />
            </div>
            
            {certificates.length > 1 && (
              <button
                type="button"
                className="remove-certificate-btn"
                onClick={() => removeCertificate(index, isEditing)}
              >
                Remove Certificate
              </button>
            )}
          </fieldset>
        ))}
        
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={user.role || "user"}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit">{isEditing ? "Update" : "Create"}</button>
          <button 
            type="button" 
            onClick={() => {
              isEditing ? setEditingUser(null) : setShowAddForm(false);
              setError(null); // Clear errors when canceling form
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="dashboardPage">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-buttons">
          <button className="add-user-btn" onClick={() => setShowAddForm(true)}>
            Add New User
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showAddForm && renderUserForm(false)}
      
      {editingUser && renderUserForm(true)}
      
      {loading && !editingUser && !showAddForm ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Certificate No</th>
                <th>Serial No</th>
                <th>Country</th>
                <th>Certificates</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.companyName}</td>
                    <td>{user.coCertificateNo}</td>
                    <td>{user.coSerialNo}</td>
                    <td>{user.country}</td>
                    <td className="certificates-cell">
                      {user.certificates && user.certificates.length > 0 ? (
                        <div className="certificates-summary">
                          <span>{user.certificates.length} certificate(s)</span>
                        </div>
                      ) : "-"}
                    </td>
                    <td>{user.role}</td>
                    <td className="actions">
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;