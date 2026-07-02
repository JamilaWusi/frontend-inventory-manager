
const baseURL = 'https://shop-inventory-manager-1.onrender.com'

const baseURL = 'http://localhost:8080'

export async function register(data) {
  const res = await fetch(`${baseURL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  const response = await res.json(); // Parse the response first

  if (!res.ok) {
    console.log(response); // Log the backend error
    throw new Error(response.message || "Registration failed");
  }

  return response;
}

export async function login(data) {
   try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
      }
      )
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      return response
   } catch (error) {
      throw error
   }
}

export async function getProfile(token) {
   try {
      const res = await fetch(`${baseURL}/api/auth/profile`, {
         method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      })

      if (!res.ok) {
         const error = new Error("Request failed");
         error.statusCode = res.status;
         error.data = await res.json().catch(() => null);

         throw error;
      }

      const responseData = await res.json()
      return responseData

   } catch (error) {
      console.log(error)
   }
}

export async function getProducts(token) {
   try {
      const res = await fetch(`${baseURL}/api/products`, {
         method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      })

      if (!res.ok) {
         const error = new Error("Request failed");
         error.statusCode = res.status;
         error.data = await res.json().catch(() => null);

         throw error;
      }

      const responseData = await res.json()
      return responseData

   } catch (error) {
      console.log(error)
   }
}

export async function addProduct(token, data) {
   try {
      const res = await fetch(`${baseURL}/api/products`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${token}`
         }
      });
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
      throw error;
   }
}

export async function editProduct(token, productId, data) {
   try {
      const res = await fetch(`${baseURL}/api/products/${productId}`, {
         method: "PATCH",
         body: JSON.stringify(data),
         headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${token}`
         }
      });
      const response = await res.json();
      if (!res.ok) {
         throw new Error();
      }
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
   }
}

export async function deleteProduct(token, productId) {
   try {
      const res = await fetch(`${baseURL}/api/products/${productId}`, {
         method: "DELETE",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      });
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
   }
}

export async function handleSaveProduct(token, data, productId) {
   try {
      if (productId) { 
         return await editProduct(token, productId, data);
      } else {
         return await addProduct(token, data);
      }
   } catch (error) {
      console.log(error);
   }
}

export async function getSuppliers(token) {
   try {
      const res = await fetch(`${baseURL}/api/suppliers`, {
         method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      })

      if (!res.ok) {
         const error = new Error("Request failed");
         error.statusCode = res.status;
         error.data = await res.json().catch(() => null);

         throw error;
      }

      const responseData = await res.json()
      return responseData

   } catch (error) {
      console.log(error)
   }
}

export async function addSupplier(token, data) {
   try {
      const res = await fetch(`${baseURL}/api/suppliers`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${token}`
         }
      });
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
   }
}

export async function  editSupplier(token, supplierId, data) {
   try {
      const res = await fetch(`${baseURL}/api/suppliers/${supplierId}`, {
         method: "PUT",
         body: JSON.stringify(data),
         headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${token}`
         }
      });
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
   }
}

export async function deleteSupplier(token, supplierId) {
   try {
      const res = await fetch(`${baseURL}/api/suppliers/${supplierId}`, {
         method: "DELETE",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      });
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error);
   }
}

export async function getTransactions(token) {
    try {
        const res = await fetch(`${baseURL}/api/stock`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const response = await res.json();

        if (!res.ok) {
            throw new Error(response.message);
        }

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}