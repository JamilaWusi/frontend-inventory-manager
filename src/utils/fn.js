
const baseURL = 'https://shop-inventory-manager-1.onrender.com'

export async function register(data) {
   try {
      const res = await fetch(`${baseURL}/api/auth/register`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-type":"Application/json"
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


export async function login(data) {
   try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-type":"Application/json"
         }
      }
      )
      if (!res.ok) {
         throw new Error();
      }
      const response = await res.json();
      console.log(response);
      return response
   } catch (error) {
      console.log(error)
   }
}

export async function getProfile(token) {
    try {
        const res = await fetch(`${baseUrl}/auth/profile`, {
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