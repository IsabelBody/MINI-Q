import axios from 'axios';

const API_URL = process.env.NODE_ENV === "production" ? "api" : "http://localhost:5000/api";

// Get all responses
export const getAllResponses = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/clinician/get-all-responses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all responses:', error);
    throw error; 
  }
};


// Function does not appear to be used.
export const getAllActionedResponses = async () => { 
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.get(`${API_URL}/clinician/get-actioned-responses`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching actioned responses:', error);
    throw error;
  }
};


export const updateResponseToActioned = async (query: { nhi?: string; actioned: boolean; first_name?: string; last_name?: string; dateofbirth?: string; }) => {
  const { nhi, actioned, first_name, last_name, dateofbirth } = query;

  const token = localStorage.getItem('token');

  let url = `${API_URL}/clinician/responses/actioned?actioned=${actioned}`;
  
  if (nhi) {
    url += `&nhi=${nhi}`;
  } else if (first_name && last_name && dateofbirth) {
    const formattedDateOfBirth = dateofbirth.split("/").reverse().join("/"); 
    url += `&first_name=${first_name}&last_name=${last_name}&dateofbirth=${formattedDateOfBirth}`;
  } else {
    throw new Error("Either 'nhi' or all 'first_name', 'last_name', and 'dateofbirth' must be provided.");
  }

  try {
    const response = await axios.patch(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating response to actioned:', error);
    throw error;
  }
};




export const getSortedResponses = async (sortField: string, sortOrder: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.get(`/api/clinician/get-all-responses`, {
      params: {
        sortField,
        sortOrder,
      },
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching sorted responses:', error);
    throw error;
  }
};



export const searchResponses = async (search: string, actioned: boolean, dob?: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const params: any = { actioned }; 

    if (search) { // if statements because search and dob are optional
      params.search = search.trim();  
    }

    if (dob) {
      params.dob = dob;
    }

    const response = await axios.get(`${API_URL}/clinician/search`, {
      params, 
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching responses:', error);
    throw error;
  }
};




// Get patient response by NHI
export const getPatientDataByNHI = async (nhi: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.get(`${API_URL}/clinician/get-patient-data-with-nhi/${nhi}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};


// Get patient response by other fields when NHI is empty
export const getPatientDataWithoutNHI = async (firstName: string, lastName: string, dateOfBirth: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.get(`${API_URL}/clinician/get-patient-data-without-nhi`, {
      params: {
        firstName: firstName,
        lastName: lastName,
        DOB: dateOfBirth,
      },
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};



// Get patient responses by DOB
export const getPatientDataByDateOfBirth = async (dateOfBirth: string, showActioned: boolean) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/clinician/get-patient-data-by-dob/${dateOfBirth}`, {
      params: {
        actioned: showActioned,
      },
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching patient data by date of birth:', error);
    throw error;
  }
};


// Submit response
export const submitResponse = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }), 
    });

    if (!response.ok) {
      throw new Error("Failed to submit response");
    }

    return await response.json();
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

// Delete patient response
export const deletePatientResponse = async (nhi: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.delete(`${API_URL}/clinician/patients/responses/${nhi}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting patient response:', error);
    throw error;
  }
};


export interface LoginResponse {
  token: string;
  clinicianName: string;
  isAdmin: boolean; 
}

export const loginClinician = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/clinician/login`, { email, password });

    const { token, clinicianName, isAdmin } = response.data; 
    
    return { token, clinicianName, isAdmin }; 
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};


export const sendEmail = async (emailAddress: string, generatedPDF: string, PDFName: string) => {
  try {
    const response = await axios.post(`${API_URL}/email`, { emailAddress, generatedPDF, PDFName }, {
      headers: { 
        "Content-Type": "application/json" 
      },
    });

    return response.data;

  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

// Get latest email address
export const getLatestEmailAddress = async () => {
  try {
    const response = await axios.get(`${API_URL}/email`, {
      headers: { 
        "Content-Type": "application/json" 
      },
    });

    return response.data;

  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

// Invite a clinician to the portal
export const inviteClinician = async (
  clinicianData: { name: string; email: string; isAdminStatus: boolean },
  isAdmin: boolean 
) => {
  if (!isAdmin) {
    throw new Error("Only admininistrators can send invitations.");
  }

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/email/invite`,
      clinicianData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error inviting clinician:", error);
    throw error;
  }
};




// Allow registration of new clinician
export const registerClinician = async (name: string, email: string, password: string, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password, token });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'An error occurred during registration');
    }
};


// Get the privacy statement (for questionaire)
export const getPrivacyStatement = async () => {
    try {

        const response = await axios.get(`${API_URL}/resources/privacy-statement`);

        return response.data;
    } catch (error) {
        console.error("Error fetching privacy statement:", error);
        throw error;
    }
};

// Update the privacy statement (Admin only)
export const updatePrivacyStatement = async (
  privacyStatementData: { content: string },
  isAdmin: boolean 
) => {

  
  if (!isAdmin) {
    throw new Error("Only administrators can update the privacy statement.");
  }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/resources/privacy-statement`, 
      privacyStatementData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating privacy statement:", error);
    throw error;
  }
};